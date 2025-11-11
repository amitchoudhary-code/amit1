// ============================
// THEME SYSTEM (Random + Black & White)
// ============================
const logo = document.querySelector('.logo');
const themeBtn = document.querySelector('.theme-toggle');

const themes = [
  { name: "aqua", accent1: "#00ffd5", accent2: "#00b4ff", bg: "#0b0b0b" },
  { name: "lime", accent1: "#00ff66", accent2: "#a8ff00", bg: "#0e0e0e" },
  { name: "purple", accent1: "#9d4edd", accent2: "#5a189a", bg: "#10002b" },
  { name: "blue", accent1: "#00b4ff", accent2: "#1a73e8", bg: "#0a0a12" },
  { name: "orange", accent1: "#ff6a00", accent2: "#ff0033", bg: "#0f0f0f" }
];

function applyTheme(theme) {
  const root = document.documentElement;
  root.style.setProperty("--accent1", theme.accent1);
  root.style.setProperty("--accent2", theme.accent2);
  root.style.setProperty("--bg", theme.bg);
  document.body.style.backgroundColor = theme.bg;
  localStorage.setItem("activeTheme", JSON.stringify(theme));
}

function randomTheme() {
  const random = themes[Math.floor(Math.random() * themes.length)];
  applyTheme(random);
  console.log("🎨 Theme switched to:", random.name);
}

// Restore saved theme
window.addEventListener("load", () => {
  const saved = localStorage.getItem("activeTheme");
  if (saved) applyTheme(JSON.parse(saved));
});

// Logo click for B/W + double click for random theme
if (logo) {
  logo.addEventListener("click", () => document.body.classList.toggle("bw-mode"));
  logo.addEventListener("dblclick", randomTheme);
}

if (themeBtn) themeBtn.addEventListener("click", randomTheme);

// ============================
// GSAP ANIMATIONS
// ============================
if (typeof gsap !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  gsap.utils.toArray(".project-card").forEach((card, i) => {
    gsap.from(card, {
      opacity: 0,
      y: 60,
      scale: 0.95,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: card,
        start: "top 85%",
        toggleActions: "play none none reverse"
      },
      delay: i * 0.1
    });
  });
}

// ============================
// HERO TYPING EFFECT
// ============================
const typingTarget = document.querySelector(".hero-tagline");
if (typingTarget) {
  const text = "Web Developer | Designer | Innovator";
  let i = 0;
  typingTarget.textContent = "";
  (function type() {
    if (i < text.length) {
      typingTarget.textContent += text.charAt(i);
      i++;
      setTimeout(type, 100);
    }
  })();
}

// ============================
// SOCIAL LOGO GLOW
// ============================
document.querySelectorAll(".social-logos a, .social-logo").forEach(btn => {
  btn.addEventListener("click", () => {
    const img = btn.tagName === "IMG" ? btn : btn.querySelector("img");
    if (img) {
      img.classList.add("glow");
      setTimeout(() => img.classList.remove("glow"), 500);
    }
  });
});

// ============================
// GITHUB REPOSITORY AUTO-LOAD
// ============================
const username = "amitchoudhary-code";
const gallery = document.querySelector(".project-gallery");
const localImages = ["image/image1.png", "image/image2.png", "image/image3.png"];
let imgIndex = 0;

async function loadRepos() {
  if (!gallery) return;
  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos`);
    if (!response.ok) return console.warn("GitHub API returned", response.status);
    const repos = await response.json();
    if (!Array.isArray(repos) || repos.length === 0) return;

    const topRepos = repos
      .filter(r => !r.fork)
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
      .slice(0, 6);

    gallery.innerHTML = "";
    topRepos.forEach(repo => {
      const imagePath = localImages[imgIndex % localImages.length];
      imgIndex++;
      const card = document.createElement("a");
      card.href = repo.html_url;
      card.target = "_blank";
      card.classList.add("project-card");
      card.setAttribute("data-category", "frontend");
      card.innerHTML = `
        <img loading="lazy" src="${imagePath}" alt="${repo.name}" onerror="this.src='image/image1.png'">
        <div class="project-info">
          <h3>${repo.name.replace(/-/g, ' ')}</h3>
          <p>${repo.description || 'A creative and modern web project.'}</p>
        </div>
      `;
      gallery.appendChild(card);
    });
  } catch (err) {
    console.error("⚠️ Failed to load repos:", err);
  }
}
window.addEventListener("DOMContentLoaded", loadRepos);

// ============================
// CERTIFICATE MODAL
// ============================
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.querySelector("#certificateModal");
  const modalImg = document.querySelector("#modalImage");
  const closeBtn = document.querySelector(".modal-close");
  if (!modal || !modalImg || !closeBtn) return;

  document.querySelectorAll(".cert-card").forEach(card => {
    card.addEventListener("click", () => {
      const imgSrc = card.getAttribute("data-cert");
      modalImg.src = imgSrc;
      modal.classList.add("active");
    });
  });

  closeBtn.addEventListener("click", () => modal.classList.remove("active"));
  modal.addEventListener("click", e => {
    if (e.target === modal || e.target === closeBtn) modal.classList.remove("active");
  });
});

// ============================
// ACTIVE NAV + SMOOTH SCROLL + SCROLL TO TOP
// ============================
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll("nav a");

window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach(sec => {
    const sectionTop = sec.offsetTop - 120;
    if (pageYOffset >= sectionTop) current = sec.getAttribute("id");
  });

  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === "#" + current) link.classList.add("active");
  });
});

navLinks.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute("href"));
    if (target) target.scrollIntoView({ behavior: "smooth" });
  });
});

const scrollBtn = document.createElement("div");
scrollBtn.className = "scroll-top";
scrollBtn.innerHTML = "⬆";
document.body.appendChild(scrollBtn);

window.addEventListener("scroll", () => {
  const show = window.scrollY > 400;
  scrollBtn.style.display = show ? "flex" : "none";
  scrollBtn.classList.toggle("show", show);
});

scrollBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ============================
// PROJECT FILTER
// ============================
const filterBtns = document.querySelectorAll(".filter-controls button");
if (filterBtns && gallery) {
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const category = btn.dataset.filter;
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const projectCards = gallery.querySelectorAll(".project-card");
      projectCards.forEach(card => {
        const match = category === "all" || card.dataset.category === category;
        if (match) {
          card.style.display = "block";
          requestAnimationFrame(() => {
            card.style.opacity = "1";
            card.style.transform = "scale(1)";
          });
        } else {
          card.style.opacity = "0";
          card.style.transform = "scale(0.9)";
          setTimeout(() => (card.style.display = "none"), 300);
        }
      });
    });
  });
}

// ============================
// EMAILJS CONTACT FORM
// ============================
const SERVICE_ID = "service_sngyt5z";
const TEMPLATE_ID = "template_fypofo9";
const PUBLIC_KEY = "fL_kee3w4k-Rb6hME";

(function() {
  if (typeof emailjs !== "undefined") {
    emailjs.init(PUBLIC_KEY);
  } else {
    console.error("⚠️ EmailJS SDK not loaded. Add CDN before this file.");
  }
})();

const contactForm = document.querySelector(".contact-form");
if (contactForm) {
  const statusMsg = contactForm.querySelector(".form-status");

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = {
      name: contactForm.name.value.trim(),
      email: contactForm.email.value.trim(),
      message: contactForm.message.value.trim()
    };

    if (!formData.name || !formData.email || !formData.message) {
      statusMsg.textContent = "Please fill in all fields.";
      statusMsg.style.color = "orange";
      statusMsg.classList.add("active");
      setTimeout(() => statusMsg.classList.remove("active"), 4000);
      return;
    }

    statusMsg.textContent = "Sending...";
    statusMsg.style.color = "#aaa";
    statusMsg.classList.add("active");

    try {
      const result = await emailjs.send(SERVICE_ID, TEMPLATE_ID, formData);
      console.log("✅ Email sent successfully:", result);
      statusMsg.textContent = "Message sent successfully!";
      statusMsg.style.color = "lime";
      contactForm.reset();
    } catch (error) {
      console.error("❌ Email send failed:", error);
      statusMsg.textContent = "Failed to send. Try again later.";
      statusMsg.style.color = "red";
    }

    setTimeout(() => statusMsg.classList.remove("active"), 4000);
  });
}

// ============================
// SKILL BAR CREATION
// ============================
document.querySelectorAll(".skill-card").forEach(card => {
  const percent = card.getAttribute("data-skill") + "%";
  const bar = document.createElement("div");
  bar.className = "skill-bar";
  bar.style.setProperty("--percent", percent);
  card.appendChild(bar);
});
