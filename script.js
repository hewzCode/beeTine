document.addEventListener('DOMContentLoaded', () => {
  // --- 1) Custom heart cursor ---
  const cursor = document.querySelector('.heart-cursor');
  function moveCursor(x, y) {
    cursor.style.left = `${x}px`;
    cursor.style.top = `${y}px`;
  }

  // Mouse & touch for cursor
  document.addEventListener('mousemove', (e) => moveCursor(e.clientX, e.clientY));
  // IMPORTANT: No preventDefault here so envelope can also get taps
  document.addEventListener('touchmove', (e) => {
    moveCursor(e.touches[0].clientX, e.touches[0].clientY);
  });

  // --- 2) Sparkle on click/touch ---
  function addSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.left = `${x - 3}px`;
    sparkle.style.top = `${y - 3}px`;
    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 700);
  }
  document.addEventListener('click', (e) => addSparkle(e.clientX, e.clientY));
  // On touchstart, we do NOT preventDefault, so envelope can also get the tap
  document.addEventListener('touchstart', (e) => {
    addSparkle(e.touches[0].clientX, e.touches[0].clientY);
  });

  // --- 3) Envelope + shadow bounce with GSAP ---
  gsap.from('.envelope', {
    duration: 1.2,
    y: -60,
    opacity: 0,
    ease: 'power4.out'
  });
  gsap.to('.envelope', {
    y: -10,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  });
  gsap.to('.envelope-shadow', {
    scaleX: 0.85,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    transformOrigin: '50% 50%'
  });

  // --- 4) Hearts & Bees creation (start once the letter is opened) ---
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

  // --- 5) Typed text (triggered once) ---
  let typedStarted = false;
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

  // Envelope references
  const envelope = document.querySelector('.envelope');

  // Desktop hover → open letter
  envelope.addEventListener('mouseenter', () => {
    startTyped();
    startHeartsAndBees();
  });

  // Mobile single tap → open letter, trigger typed text + hearts/bees
  if (window.innerWidth < 600) {
    envelope.addEventListener('click', () => {
      envelope.classList.toggle('hover');
      startTyped();
      startHeartsAndBees();
    });
  }
});
