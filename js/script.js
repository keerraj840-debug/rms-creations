// ==========================================
// RMS Gift Hampers
// Premium JavaScript
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    //---------------------------------------
    // Sticky Navbar
    //---------------------------------------

    const header = document.querySelector("header");

    window.addEventListener("scroll", () => {

        if (window.scrollY > 40) {

            header.style.background = "rgba(255,255,255,.95)";
            header.style.boxShadow = "0 10px 30px rgba(0,0,0,.08)";
            header.style.transition = ".3s";

        } else {

            header.style.background = "rgba(255,255,255,.75)";
            header.style.boxShadow = "none";

        }

    });

    //---------------------------------------
    // Smooth Scroll
    //---------------------------------------

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {

        anchor.addEventListener("click", function (e) {

            const target = document.querySelector(this.getAttribute("href"));

            if (target) {

                e.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth"
                });

            }

        });

    });

    //---------------------------------------
    // Scroll Reveal
    //---------------------------------------

    const reveals = document.querySelectorAll(
        ".card,.feature-grid div,.about-grid,.cta,.hero-grid,.reveal"
    );

    const reveal = () => {

        reveals.forEach(item => {

            const top = item.getBoundingClientRect().top;

            if (top < window.innerHeight - 100) {

                item.style.opacity = "1";
                item.style.transform = "translateY(0)";

            }

        });

    };

    reveals.forEach(item => {

        item.style.opacity = "0";
        item.style.transform = "translateY(50px)";
        item.style.transition = "all .8s ease";

    });

    reveal();

    window.addEventListener("scroll", reveal);

    //---------------------------------------
    // Active Navigation
    //---------------------------------------

    const navLinks = document.querySelectorAll("nav a");

    navLinks.forEach(link => {

        link.addEventListener("click", () => {

            navLinks.forEach(item => item.classList.remove("active"));

            link.classList.add("active");

        });

    });

    //---------------------------------------
    // Card Hover Effect
    //---------------------------------------

    const cards = document.querySelectorAll(".card");

    cards.forEach(card => {

        card.addEventListener("mousemove", function () {

            card.style.transform = "translateY(-15px) scale(1.02)";

        });

        card.addEventListener("mouseleave", function () {

            card.style.transform = "";

        });

    });

    //---------------------------------------
    // Button Ripple
    //---------------------------------------

    document.querySelectorAll(".btn,.btn-outline").forEach(button => {

        button.addEventListener("mouseenter", () => {

            button.style.transform = "translateY(-4px)";

        });

        button.addEventListener("mouseleave", () => {

            button.style.transform = "";

        });

    });

    //---------------------------------------
    // Dynamic Gallery
    //---------------------------------------

    const galleryGrid = document.getElementById("galleryGrid");

    if (galleryGrid) {

        const galleryItems = [
            { image: "images/gallery/gallery-birthday.svg", title: "Birthday Hamper", text: "Pink luxury box with premium treats" },
            { image: "images/gallery/gallery-floral.svg", title: "Floral Surprise", text: "Soft florals and elegant wrapping" },
            { image: "images/gallery/gallery-festival.svg", title: "Festival Box", text: "Festive styling for celebrations" },
            { image: "images/gallery/gallery-custom.svg", title: "Custom Gift Set", text: "Personalized hamper with memorable details" },
            { image: "images/gallery/gallery-premium.svg", title: "Premium Presentation", text: "A polished gift hamper for special moments" },
            { image: "images/gallery/gallery-girls.svg", title: "Girls Delight", text: "Charming, colorful and elegant" }
        ];

        galleryGrid.innerHTML = galleryItems.map(item => `
            <div class="card reveal">
                <img src="${item.image}" alt="${item.title}">
                <div class="card-body">
                    <h3>${item.title}</h3>
                    <p>${item.text}</p>
                    <a href="https://wa.me/918149611926?text=Hello%20RMS%20Gift%20Hampers!%20I%20would%20like%20to%20order%20the%20${encodeURIComponent(item.title)}">Order this style <i class="fa-solid fa-arrow-right"></i></a>
                </div>
            </div>
        `).join("");

    }

});

// ==========================================
// Back To Top Button
// ==========================================

const topButton = document.createElement("button");

topButton.innerHTML = "↑";

topButton.id = "topButton";

document.body.appendChild(topButton);

Object.assign(topButton.style, {
    position: "fixed",
    right: "25px",
    bottom: "25px",
    width: "55px",
    height: "55px",
    borderRadius: "50%",
    border: "none",
    background: "#F39AB8",
    color: "#fff",
    fontSize: "22px",
    cursor: "pointer",
    display: "none",
    zIndex: "9999",
    boxShadow: "0 10px 25px rgba(0,0,0,.2)",
    transition: ".3s"
});

window.addEventListener("scroll", () => {

    if (window.scrollY > 400) {

        topButton.style.display = "block";

    } else {

        topButton.style.display = "none";

    }

});

topButton.onclick = () => {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

};

// ==========================================
// Floating Hero Image
// ==========================================

const heroImage = document.querySelector(".hero-image");

if (heroImage) {

    let angle = 0;

    setInterval(() => {

        angle += 0.02;

        heroImage.style.transform =
            `translateY(${Math.sin(angle) * 8}px)`;

    }, 30);

}
