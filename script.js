const themeToggle = document.getElementById("themeToggle");
const logo = document.getElementById("logo");
const mobileThemeToggle = document.getElementById("mobileThemeToggle");
const mobileThemeIcon = document.getElementById("mobileThemeIcon");

if (mobileThemeToggle) {
    mobileThemeToggle.addEventListener("click", () => {
        const current = document.documentElement.classList.contains("dark") ? "dark" : "light";
        const newTheme = current === "dark" ? "light" : "dark";
        setTheme(newTheme);
    });
}

function setTheme(theme) {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);

    // Swap icon on Desktop
    const icon = theme === "dark" ? "fa-sun" : "fa-moon";

    themeToggle.innerHTML = `<i class="fas ${icon}"></i>`;

    applyGlow(themeToggle, theme);

    // Mobile icon: reset and apply correct one
    if (mobileThemeIcon) {
        mobileThemeIcon.classList.remove("fa-sun", "fa-moon");
        mobileThemeIcon.classList.add(icon);

        applyGlow(mobileThemeToggle, theme);
    }

    // Swap logo
    logo.src = theme === "dark" ? "assets/logo-dark.png" : "assets/logo-light.png";
}

themeToggle.addEventListener("click", () => {
    const current = document.documentElement.classList.contains("dark") ? "dark" : "light";

    setTheme(current === "dark" ? "light" : "dark");
});

document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme") || "light";

    setTheme(savedTheme);
});

// Hamburger toggle
const menuBtn = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");

menuBtn.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.contains("opacity-100");

    mobileMenu.classList.toggle("hidden", isOpen);

    setTimeout(() => {
        mobileMenu.classList.toggle("opacity-100");
        mobileMenu.classList.toggle("opacity-0");
        mobileMenu.classList.toggle("pointer-events-none");
    }, 10);

    // Animate
    menuBtn.classList.toggle("open");
});

// Close on click nav
document.querySelectorAll("nav a, #mobileMenu a").forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();

        const target = document.querySelector(link.getAttribute("href"));

        target.scrollIntoView({ behavior: "smooth" });

        // Close menu visually
        mobileMenu.classList.add("opacity-0", "pointer-events-none");
        mobileMenu.classList.remove("opacity-100");

        setTimeout(() => mobileMenu.classList.add("hidden"), 0);

        // Reset hamburger icon animation
        menuBtn.classList.remove("open");
    });
});

// Shrink header on scroll
window.addEventListener("scroll", () => {
    const header = document.getElementById("siteHeader");

    header.classList.toggle("h-16", window.scrollY > 30);
    header.classList.toggle("h-24", window.scrollY <= 30);
});

// Load projects with animations
fetch('data/projects.json')
    .then(res => res.json())
    .then(projects => {
        const grid = document.getElementById('projectGrid');

        projects.forEach(p => {
            const card = document.createElement('div');

            card.className = 'bg-white dark:bg-gray-800 rounded-2xl shadow hover:shadow-lg transition-all transform ' +
                'hover:scale-105 overflow-hidden flex flex-col ring-1 ring-gray-200 dark:ring-gray-700 ' +
                'opacity-0 animate__fadeIn animate__delay-1s';

            const tags = p.tags.map(tag =>
                `<span class="inline-block bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 
                    text-xs font-medium px-2.5 py-0.5 rounded">${tag}</span>`
            ).join('');

            let githubLink = '';

            if (p.link) {
                githubLink = `
                    <a href="${p.link}" target="_blank" class="mt-4 inline-block text-indigo-600 dark:text-indigo-400 
                    hover:underline font-semibold">
                        🔗 View on GitHub
                    </a>
                `;
            }

            card.innerHTML = `
        <img src="${p.image}" alt="${p.title}" class="w-full h-48 object-cover hover:scale-105 
        transition-transform duration-300"
        >
        <div class="p-4 flex-grow flex flex-col">
          <h3 class="text-xl font-bold mb-2 text-gray-800 dark:text-white">${p.title}</h3>
          <p class="text-sm text-gray-600 dark:text-gray-300 flex-grow">${p.description}</p>
          <div class="mt-3 flex flex-wrap gap-2">${tags}</div>
          ${githubLink}
        </div>`;

            grid.appendChild(card);
        });
    });

window.addEventListener("load", () => {
    document.getElementById("preloader").style.display = "none";
});

function applyGlow(el, theme) {
    el.classList.remove("theme-glow-light", "theme-glow-dark");

    const glowClass = theme === "dark" ? "theme-glow-dark" : "theme-glow-light";
    el.classList.add(glowClass);

    setTimeout(() => {
        el.classList.remove(glowClass);
    }, 600);
}