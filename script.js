window.addEventListener("load", () => {
    document.getElementById("loader").style.display = "none";
  });
  
  document.addEventListener("DOMContentLoaded", () => {
    const root = document.documentElement;
    const themeToggle = document.getElementById("theme-toggle");
  
    // Theme toggle
    function setTheme(theme) {
      root.setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme);
      themeToggle.textContent = theme === "dark" ? "🌚" : "🌞";
    }
    setTheme(localStorage.getItem("theme") || "light");
    themeToggle.addEventListener("click", () => {
      const current = root.getAttribute("data-theme");
      setTheme(current === "dark" ? "light" : "dark");
    });
  
    // Ripple
    document.querySelectorAll(".ripple-btn").forEach(btn => {
      btn.addEventListener("click", e => {
        const ripple = document.createElement("span");
        ripple.classList.add("ripple");
        const size = Math.max(btn.clientWidth, btn.clientHeight);
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${e.offsetX - size/2}px`;
        ripple.style.top = `${e.offsetY - size/2}px`;
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      });
    });
  
    // Custom cursor
    const cursor = document.querySelector(".custom-cursor");
    document.addEventListener("mousemove", e => {
      if (cursor) {
        cursor.style.left = `${e.clientX - 16}px`;
        cursor.style.top = `${e.clientY - 16}px`;
      }
    });
    document.querySelectorAll("button, a, input, textarea").forEach(el => {
      el.addEventListener("mouseenter", () => cursor?.classList.add("active"));
      el.addEventListener("mouseleave", () => cursor?.classList.remove("active"));
    });
  
    // Scroll reveal
    function animateOnScroll() {
      document.querySelectorAll("[data-animate]").forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight - 100) {
          el.classList.add("animated-in");
        }
      });
    }
    window.addEventListener("scroll", animateOnScroll);
    animateOnScroll();
  
    // Stats count-up
    function animateStats() {
      document.querySelectorAll(".stat-number").forEach(el => {
        if (el.dataset.animated) return;
        if (el.getBoundingClientRect().top < window.innerHeight - 60) {
          el.dataset.animated = "true";
          const target = +el.dataset.count;
          let current = 0;
          const step = Math.max(1, target / 60);
          function update() {
            current += step;
            el.textContent = current >= target ? target : Math.floor(current);
            if (current < target) requestAnimationFrame(update);
          }
          update();
        }
      });
    }
    window.addEventListener("scroll", animateStats);
    animateStats();
  
    // Carousel
    const carousel = document.querySelector(".carousel");
    const track = carousel?.querySelector(".carousel-track");
    const cards = carousel?.querySelectorAll(".carousel-card") || [];
    let index = 0;
    function updateCarousel() {
      cards.forEach((card, i) => {
        card.classList.toggle("active", i === index);
      });
      // Center the active card
      if (track && cards.length) {
        const cardWidth = cards[0].offsetWidth + 32; // 32px margin (2vw*2)
        const trackWidth = cardWidth * cards.length;
        const containerWidth = carousel.offsetWidth;
        const offset = (containerWidth / 2) - (cardWidth / 2) - (index * cardWidth);
        track.style.transform = `translateX(${offset}px)`;
      }
    }
    carousel?.querySelector(".next")?.addEventListener("click", () => {
      index = (index + 1) % cards.length;
      updateCarousel();
    });
    carousel?.querySelector(".prev")?.addEventListener("click", () => {
      index = (index - 1 + cards.length) % cards.length;
      updateCarousel();
    });
    window.addEventListener("resize", updateCarousel);
    updateCarousel();
  
    // Optional: Add animated SVG overlay to background
    if (!document.getElementById('bg-animated-overlay')) {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('id', 'bg-animated-overlay');
      svg.setAttribute('width', '100vw');
      svg.setAttribute('height', '100vh');
      svg.setAttribute('style', 'position:fixed;z-index:-1;top:0;left:0;pointer-events:none;');
      svg.innerHTML = `<defs>
        <radialGradient id="g1" cx="50%" cy="50%" r="80%">
          <stop offset="0%" stop-color="#26d0ce" stop-opacity="0.18"/>
          <stop offset="100%" stop-color="#0e1a40" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <ellipse cx="60%" cy="30%" rx="400" ry="180" fill="url(#g1)">
        <animate attributeName="cx" values="60%;40%;60%" dur="12s" repeatCount="indefinite"/>
      </ellipse>
      <ellipse cx="30%" cy="70%" rx="300" ry="120" fill="url(#g1)">
        <animate attributeName="cy" values="70%;60%;70%" dur="10s" repeatCount="indefinite"/>
      </ellipse>`;
      document.body.appendChild(svg);
    }
  
    // Particle overlay for background
    function startParticles() {
      const canvas = document.getElementById('bg-particles');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      let w = window.innerWidth, h = window.innerHeight;
      canvas.width = w; canvas.height = h;
      let particles = Array.from({length: 48}, () => ({
        x: Math.random()*w,
        y: Math.random()*h,
        r: 24 + Math.random()*32,
        dx: (Math.random()-0.5)*0.3,
        dy: (Math.random()-0.5)*0.3,
        a: 0.08 + Math.random()*0.12,
        c: `hsl(${Math.random()*360},100%,70%)`
      }));
      function draw() {
        ctx.clearRect(0,0,w,h);
        for (const p of particles) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, 2*Math.PI);
          ctx.fillStyle = p.c;
          ctx.globalAlpha = p.a;
          ctx.shadowColor = p.c;
          ctx.shadowBlur = 32;
          ctx.fill();
          ctx.globalAlpha = 1;
          ctx.shadowBlur = 0;
          p.x += p.dx; p.y += p.dy;
          if (p.x < -p.r) p.x = w + p.r;
          if (p.x > w + p.r) p.x = -p.r;
          if (p.y < -p.r) p.y = h + p.r;
          if (p.y > h + p.r) p.y = -p.r;
        }
        requestAnimationFrame(draw);
      }
      draw();
      window.addEventListener('resize', () => {
        w = window.innerWidth; h = window.innerHeight;
        canvas.width = w; canvas.height = h;
      });
    }
    startParticles();
  
    // Hide scroll-indicator on scroll
    const scrollInd = document.querySelector('.scroll-indicator');
    window.addEventListener('scroll', () => {
      if (!scrollInd) return;
      if (window.scrollY > 40) scrollInd.style.opacity = '0';
      else scrollInd.style.opacity = '1';
    });
  
    // Focus/keyboard support for skip-to-content
    const skip = document.querySelector('.skip-to-content');
    if (skip) {
      skip.addEventListener('click', e => {
        const hero = document.getElementById('hero');
        if (hero) hero.setAttribute('tabindex', '-1');
        hero?.focus();
      });
    }
  });
  