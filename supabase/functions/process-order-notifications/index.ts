// ==============================================================================
// Supabase Edge Function: process-order-notifications
// Production Server-Side Outbox Worker for Order & Status Notification Delivery
// ==============================================================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.117.2';

interface OutboxItem {
  id: number;
  event_type: 'order_created' | 'order_status_updated' | 'custom_quote_prepared';
  purchase_order_id?: number;
  purchase_order_no: string;
  recipient_role: 'admin' | 'customer';
  recipient_email: string;
  recipient_name?: string;
  subject: string;
  template_data: any;
  status: 'pending' | 'processing' | 'sent' | 'failed';
  attempts: number;
  max_attempts: number;
  idempotency_key: string;
  created_at: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-notification-secret',
};

serve(async (req: Request) => {
  // 1. Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // 2. Load Server-Side Secrets
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
  const resendApiKey = Deno.env.get('RESEND_API_KEY') || '';
  const senderEmail = Deno.env.get('NOTIFICATION_SENDER_EMAIL') || 'RMS Creations <orders@resend.dev>';
  const notificationSecret = Deno.env.get('NOTIFICATION_SECRET') || '';

  // 3. Worker Authorization Check (Bearer token or matching secret header)
  const authHeader = req.headers.get('Authorization') || '';
  const secretHeader = req.headers.get('x-notification-secret') || '';

  if (notificationSecret) {
    const isSecretValid = secretHeader === notificationSecret || authHeader === `Bearer ${notificationSecret}`;
    if (!isSecretValid) {
      return new Response(JSON.stringify({ error: 'Unauthorized outbox worker invocation' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  }

  if (!supabaseUrl || !supabaseServiceKey) {
    return new Response(JSON.stringify({ error: 'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // 4. Fetch Pending Outbox Entries (Bounded batch)
  const { data: pendingEntries, error: fetchErr } = await supabase
    .from('order_notification_outbox')
    .select('*')
    .in('status', ['pending', 'failed'])
    .lt('attempts', 5)
    .order('id', { ascending: true })
    .limit(15);

  if (fetchErr) {
    return new Response(JSON.stringify({ error: fetchErr.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  if (!pendingEntries || pendingEntries.length === 0) {
    return new Response(JSON.stringify({ message: 'No pending notifications to process', processed: 0 }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // 5. Verification: If no email provider key is configured, warn clearly without faking sends
  if (!resendApiKey) {
    return new Response(JSON.stringify({
      warning: 'RESEND_API_KEY is not configured in Supabase Secrets. Emails cannot be delivered until a valid provider key is set.',
      pending_count: pendingEntries.length,
      sample_recipient: pendingEntries[0]?.recipient_email
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // 6. Process Outbox Entries
  let sentCount = 0;
  let failedCount = 0;

  for (const entry of pendingEntries as OutboxItem[]) {
    const now = new Date().toISOString();
    const nextAttempts = (entry.attempts || 0) + 1;

    // A. Atomic status transition: Lock record into 'processing'
    const { error: lockErr } = await supabase
      .from('order_notification_outbox')
      .update({
        status: 'processing',
        attempts: nextAttempts,
        updated_at: now
      })
      .eq('id', entry.id)
      .eq('status', entry.status); // Optimistic concurrency check

    if (lockErr) continue; // Skip if another worker picked it up

    // B. Build HTML Content
    const htmlBody = buildNotificationHtml(entry);

    // C. Deliver via Resend API
    try {
      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: senderEmail,
          to: [entry.recipient_email],
          subject: entry.subject,
          html: htmlBody
        })
      });

      const resendData = await resendResponse.json();

      if (resendResponse.ok && resendData?.id) {
        // D. Success: Mark sent with verified provider message ID
        await supabase
          .from('order_notification_outbox')
          .update({
            status: 'sent',
            sent_at: now,
            updated_at: now,
            provider_message_id: resendData.id,
            last_error: null
          })
          .eq('id', entry.id);

        sentCount++;
      } else {
        throw new Error(resendData?.message || `HTTP ${resendResponse.status}: Email delivery rejected by provider`);
      }
    } catch (deliveryErr: any) {
      failedCount++;
      const errorMessage = String(deliveryErr?.message || 'Email delivery failed').slice(0, 300);
      const isPermanentlyFailed = nextAttempts >= entry.max_attempts;

      await supabase
        .from('order_notification_outbox')
        .update({
          status: isPermanentlyFailed ? 'failed' : 'pending',
          last_error: errorMessage,
          updated_at: now
        })
        .eq('id', entry.id);
    }
  }

  return new Response(JSON.stringify({
    success: true,
    total_batch: pendingEntries.length,
    sent: sentCount,
    failed: failedCount
  }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});

// ==============================================================================
// HTML Email Template Generator
// ==============================================================================

function buildNotificationHtml(entry: OutboxItem): string {
  const data = entry.template_data || {};
  const isDarkAccent = '#57251C';
  const brandRose = '#9C4738';
  const creamBg = '#FAF7F2';

  if (entry.event_type === 'order_created' && entry.recipient_role === 'admin') {
    return `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><title>New Order Alert #${data.orderNo}</title></head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: ${creamBg}; margin: 0; padding: 24px; color: #2E2825;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 18px; padding: 28px; border: 1px solid #EADFD2; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          
          <div style="border-bottom: 2px solid ${brandRose}; padding-bottom: 14px; margin-bottom: 20px;">
            <span style="background: #F3E7DC; color: ${brandRose}; font-size: 11px; font-weight: bold; text-transform: uppercase; padding: 4px 10px; border-radius: 20px; display: inline-block;">
              RMS Admin Alert
            </span>
            <h1 style="color: ${isDarkAccent}; font-size: 22px; margin: 10px 0 4px 0; font-family: Georgia, serif;">
              🔔 New Order Received: #${data.orderNo}
            </h1>
            <p style="color: #7A6C5E; font-size: 13px; margin: 0;">Order placed on ${new Date(data.orderDate || Date.now()).toLocaleString('en-IN')}</p>
          </div>

          <div style="background: ${creamBg}; padding: 18px; border-radius: 12px; margin-bottom: 20px; font-size: 13px; line-height: 1.6;">
            <p style="margin: 0 0 8px 0;"><strong>Customer:</strong> ${data.customerName}</p>
            <p style="margin: 0 0 8px 0;"><strong>Email:</strong> ${data.customerEmail}</p>
            <p style="margin: 0 0 8px 0;"><strong>Contact Mobile:</strong> ${data.customerPhone}</p>
            <p style="margin: 0 0 8px 0;"><strong>Package Summary:</strong> ${data.itemSummary}</p>
            <p style="margin: 0 0 8px 0;"><strong>Payable Amount:</strong> <span style="color: ${brandRose}; font-weight: bold; font-size: 15px;">₹${data.totalAmount}</span></p>
            <p style="margin: 0 0 8px 0;"><strong>Payment Mode:</strong> ${data.paymentMode}</p>
            <p style="margin: 0;"><strong>Delivery Address:</strong> ${data.shippingAddress}</p>
          </div>

          <div style="text-align: center; margin-top: 24px;">
            <a href="https://rmscreations.netlify.app/admin/orders" style="background: ${brandRose}; color: #ffffff; padding: 12px 28px; border-radius: 24px; text-decoration: none; font-weight: bold; font-size: 13px; display: inline-block;">
              View in Admin Dashboard &rarr;
            </a>
          </div>

          <div style="margin-top: 32px; border-top: 1px solid #EADFD2; padding-top: 14px; text-align: center; font-size: 11px; color: #A89F91;">
            RMS Creations Store Automation &bull; Automated System Notification
          </div>
        </div>
      </body>
      </html>
    `;
  }

  if (entry.event_type === 'order_created' && entry.recipient_role === 'customer') {
    return `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><title>Order Confirmation #${data.orderNo}</title></head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: ${creamBg}; margin: 0; padding: 24px; color: #2E2825;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 18px; padding: 32px; border: 1px solid #EADFD2; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: ${isDarkAccent}; font-family: Georgia, serif; font-size: 26px; margin: 0;">RMS Creations</h1>
            <p style="color: ${brandRose}; font-size: 12px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; margin-top: 4px;">
              Handcrafted Gift Hampers &amp; Festive Specials
            </p>
          </div>

          <div style="background: ${creamBg}; padding: 20px; border-radius: 14px; margin-bottom: 20px;">
            <h2 style="color: ${isDarkAccent}; font-size: 18px; margin-top: 0; font-family: Georgia, serif;">
              Thank you, ${data.customerName}! 🎁
            </h2>
            <p style="font-size: 14px; line-height: 1.6; color: #4A3C31; margin-bottom: 16px;">
              Your order <strong>#${data.orderNo}</strong> has been received and confirmed. Our team has begun preparing your gift hamper with utmost care.
            </p>

            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #EADFD2; color: #7A6C5E;">Order Number:</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #EADFD2; text-align: right; font-weight: bold; font-family: monospace;">#${data.orderNo}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #EADFD2; color: #7A6C5E;">Items Summary:</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #EADFD2; text-align: right; font-weight: 500;">${data.itemSummary}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #EADFD2; color: #7A6C5E;">Total Amount:</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #EADFD2; text-align: right; font-weight: bold; color: ${brandRose}; font-size: 15px;">₹${data.totalAmount}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #EADFD2; color: #7A6C5E;">Payment Mode:</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #EADFD2; text-align: right;">${data.paymentMode}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #7A6C5E;">Delivery Address:</td>
                <td style="padding: 8px 0; text-align: right;">${data.shippingAddress}</td>
              </tr>
            </table>
          </div>

          <div style="background: #FDFBF7; border: 1px dashed #EADFD2; padding: 14px; border-radius: 12px; margin-bottom: 24px; font-size: 12px; color: #7A6C5E; line-height: 1.5;">
            <strong>What happens next?</strong><br>
            We will carefully pack, seal, and ribbon-wrap your hampers. You will receive courier dispatch and tracking updates via email and WhatsApp.
          </div>

          <div style="text-align: center; margin-bottom: 24px;">
            <a href="https://rmscreations.netlify.app/my-orders" style="background: ${brandRose}; color: #ffffff; padding: 12px 28px; border-radius: 24px; text-decoration: none; font-weight: bold; font-size: 13px; display: inline-block;">
              Track Order Status &rarr;
            </a>
          </div>

          <div style="border-top: 1px solid #EADFD2; padding-top: 18px; font-size: 12px; color: #7A6C5E; text-align: center;">
            <p style="margin: 0 0 6px 0;">Need assistance? Call or WhatsApp RMS Support: <strong>+91 92849 05118</strong></p>
            <p style="margin: 0;">Email: <strong>rmsgifthampers@gmail.com</strong> &bull; <a href="https://rmscreations.netlify.app/" style="color: ${brandRose}; text-decoration: none;">www.rmscreations.com</a></p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Customer Status Update
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><title>Order #${data.orderNo} Status Update</title></head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: ${creamBg}; margin: 0; padding: 24px; color: #2E2825;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 18px; padding: 32px; border: 1px solid #EADFD2; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        
        <div style="border-bottom: 2px solid ${brandRose}; padding-bottom: 14px; margin-bottom: 20px;">
          <span style="background: #F3E7DC; color: ${brandRose}; font-size: 11px; font-weight: bold; text-transform: uppercase; padding: 4px 10px; border-radius: 20px; display: inline-block;">
            Order Status Update
          </span>
          <h1 style="color: ${isDarkAccent}; font-size: 22px; margin: 10px 0 4px 0; font-family: Georgia, serif;">
            📦 Order #${data.orderNo}
          </h1>
          <p style="color: #7A6C5E; font-size: 13px; margin: 0;">Status Changed to: <strong>${data.newStatus}</strong></p>
        </div>

        <div style="background: ${creamBg}; padding: 20px; border-radius: 14px; margin-bottom: 20px; font-size: 14px; line-height: 1.6;">
          <p style="margin-top: 0;">Hello ${data.customerName},</p>
          <p style="color: #4A3C31; margin-bottom: 14px;">
            ${data.statusExplainer || `Your order status has been updated to ${data.newStatus}.`}
          </p>

          ${data.trackingRemark ? `
            <div style="background: #ffffff; padding: 14px; border-radius: 10px; border: 1px solid #EADFD2; margin-top: 12px; font-size: 13px;">
              <strong style="color: ${isDarkAccent};">Courier Dispatch &amp; Tracking Details:</strong><br>
              <span style="color: #4A3C31;">${data.trackingRemark}</span>
            </div>
          ` : ''}
        </div>

        <div style="text-align: center; margin-bottom: 24px;">
          <a href="https://rmscreations.netlify.app/my-orders" style="background: ${brandRose}; color: #ffffff; padding: 12px 28px; border-radius: 24px; text-decoration: none; font-weight: bold; font-size: 13px; display: inline-block;">
            View Updated Order Details &rarr;
          </a>
        </div>

        <div style="border-top: 1px solid #EADFD2; padding-top: 18px; font-size: 12px; color: #7A6C5E; text-align: center;">
          <p style="margin: 0 0 6px 0;">Questions about your delivery? Contact RMS Support: <strong>+91 92849 05118</strong></p>
          <p style="margin: 0;">Email: <strong>rmsgifthampers@gmail.com</strong></p>
        </div>
      </div>
    </body>
    </html>
  `;
}
