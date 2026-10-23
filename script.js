/* ===================================================
 * ALL EDITABLE CONFIGURATION HERE
 * =================================================== */
const CONFIG = {
  nicknames: ["bubuu", "bubyyy", "goluuu", "chinni paapu", "maharani", "chinthana"],
  formspreeUrl: "", 
  targetBirthday: "2026-12-09T00:00:00",
  
  gallery: [
    { src: "photos/1.jpg", caption: "The smile that completely ruined my bachelorhood. ❤️" },
    { src: "photos/2.jpg", caption: "My official Maharani on her absolute best behavior! ✨" },
    { src: "photos/3.jpg", caption: "Chinni Paapu being unconditionally cute as always." },
    { src: "photos/4.jpg", caption: "Every moment with you feels like a page from a fairytale." },
    { src: "photos/5.jpg", caption: "18 years of magic in this world, and you're all mine." }
  ],

  loveLetter: "Happy 18th Birthday, my love! Watching you grow into this breathtaking, independent woman is my favorite gift in life. You'll always be my Bubuu, my Maharani, and my safe space. Today is a brand new chapter, and I promise to hold your hand through every single page.",

  reasons: [
    "1. The way your eyes light up when you laugh.",
    "2. How you make even boring days feel like an adventure.",
    "3. You're my home, my Maharani, and my best friend."
  ],

  scratchSecret: "🎁 Surprise Coupon: 1x Unlimited Warm Hugs & Late Night Ice Cream on Duduu!"
};

/* State Variables */
let currentPhotoIndex = 0;
let userWish = "";
let isMusicPlaying = false;

/* Audio & Spotify Player Controls */
const bgMusic = document.getElementById('bg-music');

function startAudio() {
  if (!bgMusic) return;
  bgMusic.play().then(() => {
    isMusicPlaying = true;
    updateMusicUI(true);
  }).catch((err) => {
    console.log("Audio play blocked or failed:", err);
  });
}

function pauseAudio() {
  if (!bgMusic) return;
  bgMusic.pause();
  isMusicPlaying = false;
  updateMusicUI(false);
}

function updateMusicUI(playing) {
  const icon = document.getElementById('spotify-icon');
  const thumb = document.getElementById('spotify-thumb');
  if (icon) icon.textContent = playing ? '⏸' : '▶';
  if (thumb) {
    if (playing) {
      thumb.classList.add('playing');
    } else {
      thumb.classList.remove('playing');
    }
  }
}

function toggleMusic() {
  if (!bgMusic) return;
  if (isMusicPlaying) {
    pauseAudio();
  } else {
    startAudio();
  }
}

/* Navigation Helper */
function nextPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const targetPage = document.getElementById(pageId);
  if (targetPage) targetPage.classList.add('active');
  
  if (pageId === 'page-intro') startCountdown();
  if (pageId === 'page-letter') {
    startTypingEffect();
    initScratchCard();
  }
}

/* Log to Formspree */
function logReaction(eventType, payload) {
  if (!CONFIG.formspreeUrl) return;
  fetch(CONFIG.formspreeUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event: eventType, data: payload, timestamp: new Date().toISOString() })
  }).catch(() => {});
}

/* Page 0: Gate Verification */
function verifyGate() {
  const input = document.getElementById('passcode-input').value.trim().toLowerCase();
  const errorElement = document.getElementById('gate-error');

  if (CONFIG.nicknames.includes(input)) {
    errorElement.textContent = "";
    const nameDisplay = document.getElementById('user-display-name');
    if (nameDisplay) nameDisplay.textContent = input.toUpperCase();
    
    // Start music on exact moment she unlocks
    startAudio();
    
    logReaction("Gate Unlocked", { nicknameUsed: input });
    nextPage('page-intro');
  } else {
    errorElement.textContent = "Access denied! Only Duduu's Maharani knows the secret code. 😉";
  }
}

/* Page 1: Countdown */
function startCountdown() {
  const targetDate = new Date(CONFIG.targetBirthday).getTime();
  
  const timer = setInterval(() => {
    const now = new Date().getTime();
    const distance = targetDate - now;

    const timerEl = document.getElementById("countdown-timer");
    if (!timerEl) return;

    if (distance < 0) {
      clearInterval(timer);
      timerEl.innerHTML = "HAPPY 18TH BIRTHDAY! 🎉👑";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    timerEl.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s left`;
  }, 1000);
}

/* Page 2: Photo Gallery Navigation */
function updatePhoto() {
  const item = CONFIG.gallery[currentPhotoIndex];
  const imgEl = document.getElementById('gallery-img');
  const capEl = document.getElementById('gallery-caption');
  const countEl = document.getElementById('photo-counter');

  if (imgEl) imgEl.src = item.src;
  if (capEl) capEl.textContent = item.caption;
  if (countEl) countEl.textContent = `${currentPhotoIndex + 1} / ${CONFIG.gallery.length}`;
}

function prevPhoto() {
  if (currentPhotoIndex > 0) {
    currentPhotoIndex--;
    updatePhoto();
  }
}

function nextPhoto() {
  if (currentPhotoIndex < CONFIG.gallery.length - 1) {
    currentPhotoIndex++;
    updatePhoto();
  }
}

/* Page 3: Letter & Scratch Card */
let typingDone = false;
function startTypingEffect() {
  if (typingDone) return;
  const target = document.getElementById('typing-text');
  if (!target) return;
  
  let i = 0;
  target.textContent = "";

  function type() {
    if (i < CONFIG.loveLetter.length) {
      target.textContent += CONFIG.loveLetter.charAt(i);
      i++;
      setTimeout(type, 35);
    } else {
      typingDone = true;
    }
  }
  type();
}

function revealReason(card, index) {
  card.classList.add('revealed');
  card.innerHTML = CONFIG.reasons[index];
  logReaction("Reason Revealed", { reasonIndex: index });
}

function initScratchCard() {
  const secretEl = document.getElementById('scratch-secret');
  if (secretEl) secretEl.textContent = CONFIG.scratchSecret;
  
  const canvas = document.getElementById('scratch-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#D4A373';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#2A0812';
  ctx.font = '14px sans-serif';
  ctx.fillText('Scratch with finger to reveal!', 40, 40);

  let isScratching = false;

  function scratch(e) {
    if (!isScratching) return;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches ? e.touches[0] : e;
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 18, 0, Math.PI * 2);
    ctx.fill();
  }

  canvas.addEventListener('mousedown', () => isScratching = true);
  canvas.addEventListener('mouseup', () => isScratching = false);
  canvas.addEventListener('mousemove', scratch);

  canvas.addEventListener('touchstart', (e) => { isScratching = true; scratch(e); });
  canvas.addEventListener('touchend', () => isScratching = false);
  canvas.addEventListener('touchmove', scratch);
}

/* Restart */
function restartExperience() {
  currentPhotoIndex = 0;
  typingDone = false;
  updatePhoto();
  nextPage('page-gate');
}

/* Event Listeners on DOM Loaded */
document.addEventListener('DOMContentLoaded', () => {
  updatePhoto();
  
  const playBtn = document.getElementById('spotify-play-btn');
  if (playBtn) {
    playBtn.addEventListener('click', toggleMusic);
  }

  /* Auto-stop music when switching apps, minimizing, or closing tab */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      pauseAudio();
    }
  });

  window.addEventListener('pagehide', () => {
    pauseAudio();
  });
});
