document.addEventListener('DOMContentLoaded', () => {
    // --- Cursor handling ---
    const cursor = document.querySelector('.heart-cursor');
    const moveCursor = (x, y) => {
      cursor.style.left = `${x}px`;
      cursor.style.top = `${y}px`;
    };
  
    // Handle both mouse and touch
    document.addEventListener('mousemove', (e) => moveCursor(e.clientX, e.clientY));
    document.addEventListener(
      'touchmove',
      (e) => {
        e.preventDefault();
        moveCursor(e.touches[0].clientX, e.touches[0].clientY);
      },
      { passive: false }
    );
  
    // --- Sparkle on click/touch ---
    const handleInteraction = (x, y) => {
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle';
      sparkle.style.left = `${x - 3}px`;
      sparkle.style.top = `${y - 3}px`;
      document.body.appendChild(sparkle);
      setTimeout(() => sparkle.remove(), 700);
    };
  
    document.addEventListener('click', (e) => handleInteraction(e.clientX, e.clientY));
    document.addEventListener(
      'touchstart',
      (e) => {
        e.preventDefault();
        handleInteraction(e.touches[0].clientX, e.touches[0].clientY);
      },
      { passive: false }
    );
  
    // --- Envelope fade/slide in from the top ---
    gsap.from('.envelope', {
      duration: 1.2,
      y: -60,
      opacity: 0,
      ease: 'power4.out'
    });
  
    // --- Sync bounce for envelope & scale for shadow ---
    gsap.to('.envelope', {
      y: -10, // how high it bounces
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
    gsap.to('.envelope-shadow', {
      scaleX: 0.85, // how much the shadow compresses
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      transformOrigin: '50% 50%'
    });
  
    // --- Hearts & Bees creation (start later) ---
    let heartsInterval = null;
    let beesInterval = null;
  
    function createFloatingElement(type) {
      const element = document.createElement('span');
      element.innerHTML =
        type === 'heart'
          ? ['❤️', '💖', '💗'][Math.floor(Math.random() * 3)]
          : '🐝';
  
      element.style.left = `${Math.random() * 100}%`;
      element.style.animationDuration = `${Math.random() * 3 + 4}s`;
  
      // Slight random color tweak for bees
      if (type === 'bee') {
        element.style.filter = `sepia(30%) hue-rotate(${
          Math.random() * 20 - 10
        }deg) saturate(0.7)`;
      }
  
      document.querySelector(`.floating-${type}s`).appendChild(element);
      setTimeout(() => element.remove(), 8000);
    }
  
    function startHeartsAndBees() {
      if (!heartsInterval) {
        heartsInterval = setInterval(
          () => createFloatingElement('heart'),
          window.innerWidth < 600 ? 500 : 350
        );
      }
      if (!beesInterval) {
        beesInterval = setInterval(
          () => createFloatingElement('bee'),
          window.innerWidth < 600 ? 800 : 600
        );
      }
    }
  
    // --- Typed text trigger on envelope hover/tap ---
    let typedStarted = false;
    const envelope = document.querySelector('.envelope');
  
    function startTyped() {
      if (typedStarted) return;
      typedStarted = true;
  
      new Typed('#typedText', {
        strings: [
          " 🧸  🧸  🧸  🧸  🧸  🧸  🧸  🧸  🧸  🧸  🧸  🧸  🧸  🧸  🧸  🧸  🧸  🧸^1000\n\n",
          "You make every moment\nsweeter than honey... 🍯\n\n",
          "Happy Valentine's Day\n Ambee 🦋"
        ],
        typeSpeed: 48,
        backSpeed: 24,
        showCursor: false,
        smartBackspace: true
      });
    }
  
    // On desktop hover, start typed + hearts/bees
    envelope.addEventListener('mouseenter', () => {
      startTyped();
      startHeartsAndBees();
    });
  
    // Mobile fallback: double-tap
    if (window.innerWidth < 600) {
      let lastTap = 0;
      envelope.addEventListener('click', () => {
        const now = Date.now();
        if (now - lastTap < 300) {
          // Double-tap
          envelope.classList.toggle('hover');
          startTyped();
          startHeartsAndBees();
        }
        lastTap = now;
      });
    }
  });
  