document.addEventListener('DOMContentLoaded', () => {

  /* ============================================
     1. NAVBAR — Scroll Effect & Mobile Toggle
     ============================================ */
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  // Sticky navbar on scroll
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });

  // Mobile hamburger toggle
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    // Animate hamburger to X
    const spans = hamburger.querySelectorAll('span');
    spans.forEach(s => s.style.transition = 'all 0.3s ease');
    if (navLinks.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity   = '1';
      spans[2].style.transform = '';
    }
  });

  // Close mobile nav when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      const spans = hamburger.querySelectorAll('span');
      spans.forEach(s => {
        s.style.transform = '';
        s.style.opacity   = '1';
      });
    });
  });

  /* ============================================
     2. SCROLL REVEAL — Intersection Observer
     ============================================ */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger the reveal within a group
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  /* ============================================
     3. COUNTER ANIMATION — Hero Stats
     ============================================ */
  const counters = document.querySelectorAll('.stat-num');
  let countersStarted = false;

  function animateCounters() {
    counters.forEach(counter => {
      const target   = +counter.getAttribute('data-target');
      const duration = 1800; // ms
      const start    = performance.now();

      function update(currentTime) {
        const elapsed  = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased    = 1 - Math.pow(1 - progress, 3);
        counter.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(update);
        else counter.textContent = target;
      }

      requestAnimationFrame(update);
    });
  }

  // Trigger counters when hero stats come into view
  const heroSection = document.querySelector('.hero-stats');
  if (heroSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersStarted) {
          countersStarted = true;
          animateCounters();
        }
      });
    }, { threshold: 0.5 });
    statsObserver.observe(heroSection);
  }

  /* ============================================
     4. MENU TABS — Click Switching
     ============================================ */
  const tabBtns     = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab');

      // Remove active from all
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      // Activate selected
      btn.classList.add('active');
      const activeContent = document.getElementById(target);
      if (activeContent) {
        activeContent.classList.add('active');

        // Re-trigger reveal for cards in the newly shown tab
        activeContent.querySelectorAll('.reveal').forEach((el, i) => {
          el.classList.remove('visible');
          setTimeout(() => el.classList.add('visible'), i * 100 + 50);
        });
      }
    });
  });

  /* ============================================
     5. CONTACT FORM — Validation & Submission
     ============================================ */
  const form    = document.getElementById('contactForm');
  const formMsg = document.getElementById('formMsg');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name    = document.getElementById('name').value.trim();
      const email   = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      // Basic validation
      if (!name || !email || !message) {
        showFormMsg('error', '⚠️ Please fill in all required fields.');
        return;
      }

      if (!isValidEmail(email)) {
        showFormMsg('error', '⚠️ Please enter a valid email address.');
        return;
      }

      // Simulate a successful send
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        showFormMsg('success', '✅ Thank you! Your message has been sent. We\'ll get back to you shortly.');
        form.reset();
      }, 1800);
    });
  }

  function showFormMsg(type, text) {
    formMsg.className = `form-message ${type}`;
    formMsg.textContent = text;
    formMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Auto-clear success message after 6 seconds
    if (type === 'success') {
      setTimeout(() => {
        formMsg.className = 'form-message';
        formMsg.textContent = '';
      }, 6000);
    }
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /* ============================================
     6. BACK TO TOP BUTTON
     ============================================ */
  const backToTopBtn = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    backToTopBtn.classList.toggle('show', window.scrollY > 500);
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ============================================
     7. SMOOTH ACTIVE NAV LINK on Scroll
     ============================================ */
  const sections = document.querySelectorAll('section[id]');
  const navAnchorLinks = document.querySelectorAll('.nav-links a');

  function updateActiveNav() {
    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        currentSection = section.getAttribute('id');
      }
    });

    navAnchorLinks.forEach(link => {
      link.style.color = '';
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.style.color = 'var(--gold-light)';
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav);
  updateActiveNav(); // run once on load

  /* ============================================
     8. GALLERY — Lightbox on Click
     ============================================ */
  const galleryItems = document.querySelectorAll('.g-item img');

  // Create lightbox elements
  const lightbox = document.createElement('div');
  lightbox.id = 'lightbox';
  lightbox.style.cssText = `
    display:none; position:fixed; inset:0; z-index:9999;
    background:rgba(26,10,0,0.92); cursor:zoom-out;
    align-items:center; justify-content:center;
  `;

  const lightboxImg = document.createElement('img');
  lightboxImg.style.cssText = `
    max-width:90vw; max-height:88vh; border-radius:12px;
    object-fit:contain; box-shadow:0 20px 60px rgba(0,0,0,0.6);
    animation: lightboxIn 0.3s ease;
  `;

  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '&times;';
  closeBtn.style.cssText = `
    position:absolute; top:20px; right:28px;
    background:none; border:none; color:#fff;
    font-size:2.5rem; cursor:pointer; line-height:1;
    opacity:0.8; transition:opacity 0.2s;
  `;
  closeBtn.onmouseover = () => closeBtn.style.opacity = '1';
  closeBtn.onmouseout  = () => closeBtn.style.opacity = '0.8';

  const style = document.createElement('style');
  style.textContent = `
    @keyframes lightboxIn {
      from { opacity:0; transform:scale(0.9); }
      to   { opacity:1; transform:scale(1); }
    }
  `;
  document.head.appendChild(style);

  lightbox.appendChild(lightboxImg);
  lightbox.appendChild(closeBtn);
  document.body.appendChild(lightbox);

  galleryItems.forEach(img => {
    img.addEventListener('click', () => {
      lightboxImg.src = img.src;
      lightbox.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.style.display = 'none';
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
  });

  /* ============================================
     9. PAGE LOAD — Trigger initial reveals
     ============================================ */
  // Trigger visible for elements already in view on load
  setTimeout(() => {
    revealElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 60) {
        el.classList.add('visible');
      }
    });
  }, 100);

  // Also trigger counters on load if hero is in viewport
  if (heroSection) {
    const r = heroSection.getBoundingClientRect();
    if (r.top < window.innerHeight) {
      countersStarted = true;
      animateCounters();
    }
  }

  console.log(
    '%c☕ Brewed Awakenings Website Loaded!',
    'color: #c8922a; font-size: 1.2rem; font-weight: bold;'
  );
}); 