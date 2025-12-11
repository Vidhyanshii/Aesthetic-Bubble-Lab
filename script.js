const canvas = document.getElementById('bubbleCanvas');
const ctx = canvas.getContext('2d');
const backgroundCanvas = document.getElementById('backgroundCanvas');
const bgCtx = backgroundCanvas.getContext('2d');
const redSlider = document.getElementById('redSlider');
const greenSlider = document.getElementById('greenSlider');
const blueSlider = document.getElementById('blueSlider');
const redVal = document.getElementById('redVal');
const greenVal = document.getElementById('greenVal');
const blueVal = document.getElementById('blueVal');
const colorPreview = document.getElementById('colorPreview');
const createBtn = document.getElementById('createBtn');
const shareBtn = document.getElementById('shareBtn');
const clearBtn = document.getElementById('clearBtn');
const messagesList = document.getElementById('messagesList');
const messagePopup = document.getElementById('messagePopup');
const popupMessage = document.getElementById('popupMessage');
const closePopup = document.getElementById('closePopup');
const shareModal = document.getElementById('shareModal');
const shareLinkInput = document.getElementById('shareLink');
const copyLinkBtn = document.getElementById('copyLinkBtn');
const closeShareBtn = document.getElementById('closeShareBtn');
const customMessageContainer = document.getElementById('customMessageContainer');
const customMessageInput = document.getElementById('customMessage');
const messageMode = document.querySelectorAll('input[name="messageMode"]');
const backgroundMusic = document.getElementById('backgroundMusic');
const shareWhatsAppBtn = document.getElementById('shareWhatsApp');
const shareFacebookBtn = document.getElementById('shareFacebook');
const shareTwitterBtn = document.getElementById('shareTwitter');
const shareTelegramBtn = document.getElementById('shareTelegram');
const shareEmailBtn = document.getElementById('shareEmail');
const shareInstagramBtn = document.getElementById('shareInstagram');

// Positive messages
const positiveMessages = [
  '✨ You are amazing!',
  '💕 Be kind to yourself today',
  '🌟 You deserve good things',
  '🎨 Creativity is your superpower',
  '💪 You can do anything you set your mind to',
  '🌈 Every day is a new beginning',
  '✨ Your smile brightens the world',
  '💜 You are enough, just as you are',
  '🚀 Great things are coming your way',
  '🌸 You are beautiful inside and out',
  '💖 Spread love everywhere you go',
  '⭐ You are the author of your story',
  '🎯 Your dreams matter',
  '🌺 Bloom where you are planted',
  '✨ You make a difference'
];

// Bubble state
let bubbles = [];
let displayedMessages = [];
let currentMessageMode = 'automated';
let currentGiftMode = false;
let backgroundParticles = [];

// Resize canvases
function resizeCanvas() {
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = Math.max(500, window.innerHeight - 200);
  
  backgroundCanvas.width = window.innerWidth;
  backgroundCanvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Color mixer
function updateColor() {
  const r = Number(redSlider.value);
  const g = Number(greenSlider.value);
  const b = Number(blueSlider.value);
  redVal.textContent = r;
  greenVal.textContent = g;
  blueVal.textContent = b;
  const rgb = `rgb(${r}, ${g}, ${b})`;
  colorPreview.style.background = rgb;
}

redSlider.addEventListener('input', updateColor);
greenSlider.addEventListener('input', updateColor);
blueSlider.addEventListener('input', updateColor);

// Get current bubble settings
function getBubbleSettings() {
  const r = Number(redSlider.value);
  const g = Number(greenSlider.value);
  const b = Number(blueSlider.value);
  
  let message;
  if (currentMessageMode === 'automated') {
    message = positiveMessages[Math.floor(Math.random() * positiveMessages.length)];
  } else {
    message = customMessageInput.value || 'A special message just for you!';
  }
  
  return {
    color: { r, g, b },
    rgb: `rgb(${r}, ${g}, ${b})`,
    size: 60, // Default size
    shine: 0.7, // Default shine
    message: message,
    gift: currentGiftMode,
    pulseTime: 0
  };
}

// Create bubble
createBtn.addEventListener('click', () => {
  const settings = getBubbleSettings();
  const bubble = {
    x: canvas.width / 2 + (Math.random() - 0.5) * 200,
    y: canvas.height / 2 + (Math.random() - 0.5) * 200,
    vx: (Math.random() - 0.5) * 4,
    vy: (Math.random() - 0.5) * 4 - 2, // slight upward drift
    ...settings
  };
  bubbles.push(bubble);
  animate();
});

// Draw glossy bubble circle
function drawBubble(bubble) {
  const { x, y, size, rgb, shine, color } = bubble;

  // Soft glow
  ctx.shadowColor = rgb;
  ctx.shadowBlur = 20;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  // Main bubble with gradient
  const bubbleGrad = ctx.createRadialGradient(x - size / 3, y - size / 3, 0, x, y, size);
  bubbleGrad.addColorStop(0, `rgba(255, 255, 255, ${shine * 0.4})`);
  bubbleGrad.addColorStop(0.3, rgb);
  bubbleGrad.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0.3)`);
  
  ctx.fillStyle = bubbleGrad;
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fill();

  // Shine effect (top-left)
  const shineGrad = ctx.createRadialGradient(
    x - size / 3,
    y - size / 3,
    0,
    x,
    y,
    size
  );
  shineGrad.addColorStop(0, `rgba(255, 255, 255, ${shine * 0.8})`);
  shineGrad.addColorStop(0.4, `rgba(255, 255, 255, ${shine * 0.2})`);
  shineGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = shineGrad;
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fill();

  // Soft outline
  ctx.strokeStyle = `rgba(255, 182, 193, 0.5)`;
  ctx.lineWidth = 1.5;
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.stroke();

  // Reset shadow
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
}

// Animation loop
function animate() {
  // Clear canvas with slight trail effect (light pink instead of black)
  ctx.fillStyle = 'rgba(255, 240, 245, 0.5)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Update and draw bubbles
  for (let i = bubbles.length - 1; i >= 0; i--) {
    const bubble = bubbles[i];

    // Physics
    bubble.x += bubble.vx;
    bubble.y += bubble.vy;
    bubble.vy += 0.15; // gravity
    bubble.vx *= 0.99; // friction

    // Bounce off edges
    if (bubble.x - bubble.size < 0) {
      bubble.x = bubble.size;
      bubble.vx *= -0.8;
    }
    if (bubble.x + bubble.size > canvas.width) {
      bubble.x = canvas.width - bubble.size;
      bubble.vx *= -0.8;
    }
    if (bubble.y - bubble.size < 0) {
      bubble.y = bubble.size;
      bubble.vy *= -0.8;
    }
    if (bubble.y + bubble.size > canvas.height) {
      bubble.y = canvas.height - bubble.size;
      bubble.vy *= -0.8;
    }

    // Pulsing effect
    bubble.pulseTime = (bubble.pulseTime || 0) + 0.02;
    const pulseScale = 1 + Math.sin(bubble.pulseTime * 3) * 0.03;
    
    drawBubbleWithPulse(bubble, pulseScale);
  }

  // Draw particles
  if (window.particles) {
    for (let i = window.particles.length - 1; i >= 0; i--) {
      const p = window.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.2;
      p.life -= 0.02;

      if (p.life <= 0) {
        window.particles.splice(i, 1);
      } else {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      }
    }
  }

  if (bubbles.length > 0 || (window.particles && window.particles.length > 0)) {
    requestAnimationFrame(animate);
  }
}

// Click to pop bubble
canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  for (let i = bubbles.length - 1; i >= 0; i--) {
    const bubble = bubbles[i];
    const dist = Math.hypot(x - bubble.x, y - bubble.y);
    if (dist < bubble.size) {
      popBubble(bubble);
      bubbles.splice(i, 1);
      break;
    }
  }
});

// Pop bubble with animation and message
function popBubble(bubble) {
  // Play sound (always enabled)
  playPopSound(bubble.size);

  // Add message
  addMessage(bubble.message);

  // Show popup
  showMessagePopup(bubble.message);

  // Create particle burst with neon glow
  createPopAnimation(bubble);

  // Glitch effect on canvas
  applyGlitchEffect();
}

// Array of different pop sound effects
const popSoundTypes = [
  'classic',      // Original beep
  'pop',          // Pop sound (descending pitch)
  'boing',        // Funny boing sound
  'plinky',       // Light plinking sound
  'whoosh',       // Whoosh sound
  'giggle',       // Giggling effect
  'sparkle',      // Sparkle chime
  'bell',         // Warm bell chime (new)
  'drum',         // Soft drum hit (new)
  'swell'         // Soft swell/atmospheric (new)
];

// Backend-only configuration: change this value directly in code to alter pop-sound behavior.
// Options: 'random' (default), 'chime' (favor sparkles/bell), 'percussive' (favor drum/boing), 'lovely' (favor sparkle/bell/swell)
const popSoundMode = 'random';

function playPopSound(size) {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  // Decide sound type based on backend mode
  let soundType;
  if (popSoundMode === 'random') {
    soundType = popSoundTypes[Math.floor(Math.random() * popSoundTypes.length)];
  } else if (popSoundMode === 'chime') {
    const pool = ['sparkle', 'bell', 'plinky'];
    soundType = pool[Math.floor(Math.random() * pool.length)];
  } else if (popSoundMode === 'percussive') {
    const pool = ['drum', 'boing', 'pop'];
    soundType = pool[Math.floor(Math.random() * pool.length)];
  } else if (popSoundMode === 'lovely') {
    const pool = ['sparkle', 'bell', 'swell'];
    soundType = pool[Math.floor(Math.random() * pool.length)];
  } else {
    soundType = popSoundTypes[Math.floor(Math.random() * popSoundTypes.length)];
  }

  // Dispatch to appropriate generator
  if (soundType === 'classic') {
    playClassicSound(audioContext, size);
  } else if (soundType === 'pop') {
    playPopSound2(audioContext, size);
  } else if (soundType === 'boing') {
    playBoingSound(audioContext, size);
  } else if (soundType === 'plinky') {
    playPlinkySound(audioContext, size);
  } else if (soundType === 'whoosh') {
    playWhooshSound(audioContext, size);
  } else if (soundType === 'giggle') {
    playGiggleSound(audioContext, size);
  } else if (soundType === 'sparkle') {
    playSparkleSound(audioContext, size);
  } else if (soundType === 'bell') {
    playBellSound(audioContext, size);
  } else if (soundType === 'drum') {
    playDrumSound(audioContext, size);
  } else if (soundType === 'swell') {
    playSwellSound(audioContext, size);
  }
}

// New backend-only synthesized sounds
function playBellSound(audioContext, size) {
  // A soft bell with short decay
  const fundamental = 600 + (size / 120) * 300;
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const filter = audioContext.createBiquadFilter();

  osc.type = 'sine';
  osc.frequency.value = fundamental;
  filter.type = 'highpass';
  filter.frequency.value = 300;

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(audioContext.destination);

  gain.gain.setValueAtTime(0.0, audioContext.currentTime);
  gain.gain.linearRampToValueAtTime(0.25, audioContext.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.9);

  // Slight overtone
  const osc2 = audioContext.createOscillator();
  const gain2 = audioContext.createGain();
  osc2.type = 'triangle';
  osc2.frequency.value = fundamental * 1.8;
  osc2.connect(gain2);
  gain2.connect(audioContext.destination);
  gain2.gain.setValueAtTime(0.12, audioContext.currentTime);
  gain2.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.6);

  osc.start();
  osc2.start();
  osc.stop(audioContext.currentTime + 0.9);
  osc2.stop(audioContext.currentTime + 0.6);
}

function playDrumSound(audioContext, size) {
  // Short low-frequency hit
  const now = audioContext.currentTime;
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const band = audioContext.createBiquadFilter();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(120 - (size / 120) * 40, now);
  band.type = 'lowpass';
  band.frequency.value = 400;

  osc.connect(band);
  band.connect(gain);
  gain.connect(audioContext.destination);

  gain.gain.setValueAtTime(0.5, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

  osc.start(now);
  osc.stop(now + 0.18);
}

function playSwellSound(audioContext, size) {
  // Gentle ambient swell — longer and softer
  const now = audioContext.currentTime;
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const filter = audioContext.createBiquadFilter();

  osc.type = 'sine';
  osc.frequency.value = 220 + (size / 120) * 200;
  filter.type = 'lowpass';
  filter.frequency.value = 900;

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(audioContext.destination);

  gain.gain.setValueAtTime(0.0, now);
  gain.gain.linearRampToValueAtTime(0.18, now + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

  osc.start(now);
  osc.stop(now + 0.95);
}

function playClassicSound(audioContext, size) {
  const freq = 200 + (size / 120) * 800;
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();

  osc.connect(gain);
  gain.connect(audioContext.destination);

  osc.frequency.value = freq;
  osc.type = 'sine';
  gain.gain.setValueAtTime(0.3, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);

  osc.start(audioContext.currentTime);
  osc.stop(audioContext.currentTime + 0.15);

  const osc2 = audioContext.createOscillator();
  const gain2 = audioContext.createGain();
  osc2.connect(gain2);
  gain2.connect(audioContext.destination);
  osc2.frequency.value = freq * 1.5;
  osc2.type = 'sine';
  gain2.gain.setValueAtTime(0.15, audioContext.currentTime);
  gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
  osc2.start(audioContext.currentTime);
  osc2.stop(audioContext.currentTime + 0.1);
}

function playPopSound2(audioContext, size) {
  const startFreq = 400 + (size / 120) * 400;
  const endFreq = 100;
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();

  osc.connect(gain);
  gain.connect(audioContext.destination);

  osc.type = 'sine';
  osc.frequency.setValueAtTime(startFreq, audioContext.currentTime);
  osc.frequency.exponentialRampToValueAtTime(endFreq, audioContext.currentTime + 0.2);
  
  gain.gain.setValueAtTime(0.4, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

  osc.start(audioContext.currentTime);
  osc.stop(audioContext.currentTime + 0.2);
}

function playBoingSound(audioContext, size) {
  const baseFreq = 300 + (size / 120) * 300;
  
  // First bounce - high pitch
  const osc1 = audioContext.createOscillator();
  const gain1 = audioContext.createGain();
  osc1.connect(gain1);
  gain1.connect(audioContext.destination);
  osc1.frequency.value = baseFreq * 1.5;
  osc1.type = 'sine';
  gain1.gain.setValueAtTime(0.3, audioContext.currentTime);
  gain1.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
  osc1.start(audioContext.currentTime);
  osc1.stop(audioContext.currentTime + 0.15);

  // Second bounce - lower pitch
  const osc2 = audioContext.createOscillator();
  const gain2 = audioContext.createGain();
  osc2.connect(gain2);
  gain2.connect(audioContext.destination);
  osc2.frequency.value = baseFreq * 0.8;
  osc2.type = 'sine';
  gain2.gain.setValueAtTime(0.2, audioContext.currentTime + 0.12);
  gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.25);
  osc2.start(audioContext.currentTime + 0.12);
  osc2.stop(audioContext.currentTime + 0.25);
}

function playPlinkySound(audioContext, size) {
  const freq = 800 + Math.random() * 400;
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();

  osc.connect(gain);
  gain.connect(audioContext.destination);

  osc.frequency.value = freq;
  osc.type = 'sine';
  gain.gain.setValueAtTime(0.25, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

  osc.start(audioContext.currentTime);
  osc.stop(audioContext.currentTime + 0.1);
}

function playWhooshSound(audioContext, size) {
  const startFreq = 500;
  const endFreq = 100;
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();

  osc.connect(gain);
  gain.connect(audioContext.destination);

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(startFreq, audioContext.currentTime);
  osc.frequency.exponentialRampToValueAtTime(endFreq, audioContext.currentTime + 0.3);
  
  gain.gain.setValueAtTime(0.35, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

  osc.start(audioContext.currentTime);
  osc.stop(audioContext.currentTime + 0.3);
}

function playGiggleSound(audioContext, size) {
  const freqs = [400, 500, 450];
  const duration = 0.08;
  
  for (let i = 0; i < freqs.length; i++) {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(audioContext.destination);
    
    osc.frequency.value = freqs[i];
    osc.type = 'sine';
    
    const startTime = audioContext.currentTime + i * 0.08;
    gain.gain.setValueAtTime(0.2, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
    
    osc.start(startTime);
    osc.stop(startTime + duration);
  }
}

function playSparkleSound(audioContext, size) {
  const frequencies = [900, 1200, 750, 1050];
  
  for (let i = 0; i < frequencies.length; i++) {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(audioContext.destination);
    
    osc.frequency.value = frequencies[i];
    osc.type = 'sine';
    
    const startTime = audioContext.currentTime + i * 0.05;
    const duration = 0.15;
    
    gain.gain.setValueAtTime(0.15, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
    
    osc.start(startTime);
    osc.stop(startTime + duration);
  }
}

function createPopAnimation(bubble) {
  createEnhancedConfetti(bubble);
}

function applyGlitchEffect() {
  // Subtle glitch effect
  const glitchCanvas = document.createElement('canvas');
  glitchCanvas.width = canvas.width;
  glitchCanvas.height = canvas.height;
  const gctx = glitchCanvas.getContext('2d');
  gctx.drawImage(canvas, 0, 0);
  
  // Apply slight distortion
  for (let i = 0; i < 3; i++) {
    const offset = Math.floor(Math.random() * 4) - 2;
    ctx.globalAlpha = 0.1;
    ctx.drawImage(glitchCanvas, offset, 0);
  }
  ctx.globalAlpha = 1;
}

function addMessage(msg) {
  displayedMessages.unshift(msg);
  if (displayedMessages.length > 5) displayedMessages.pop();

  messagesList.innerHTML = displayedMessages
    .map((m) => `<div class="message-item">${m}</div>`)
    .join('');
}

function showMessagePopup(msg) {
  popupMessage.textContent = msg;
  messagePopup.style.display = 'flex';
}

closePopup.addEventListener('click', () => {
  messagePopup.style.display = 'none';
});

messagePopup.addEventListener('click', (e) => {
  if (e.target === messagePopup) {
    messagePopup.style.display = 'none';
  }
});

// Clear all bubbles
clearBtn.addEventListener('click', () => {
  bubbles = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Share functionality
function generateShareLink() {
  let message;
  if (currentMessageMode === 'automated') {
    message = positiveMessages[Math.floor(Math.random() * positiveMessages.length)];
  } else {
    message = customMessageInput.value || 'A special message just for you!';
  }
  
  const color = `${redSlider.value},${greenSlider.value},${blueSlider.value}`;
  const encodedMessage = encodeURIComponent(message);
  const baseUrl = window.location.origin + window.location.pathname;
  const shareUrl = `${baseUrl}?bubble=true&msg=${encodedMessage}&color=${color}`;
  
  return shareUrl;
}

shareBtn.addEventListener('click', () => {
  const shareLink = generateShareLink();
  shareLinkInput.value = shareLink;
  shareModal.style.display = 'flex';
});

copyLinkBtn.addEventListener('click', () => {
  shareLinkInput.select();
  document.execCommand('copy');
  
  // Show feedback
  const originalText = copyLinkBtn.textContent;
  copyLinkBtn.textContent = '✅ Copied!';
  setTimeout(() => {
    copyLinkBtn.textContent = originalText;
  }, 2000);
});

closeShareBtn.addEventListener('click', () => {
  shareModal.style.display = 'none';
});

shareModal.addEventListener('click', (e) => {
  if (e.target === shareModal) {
    shareModal.style.display = 'none';
  }
});

// Social media sharing
shareWhatsAppBtn.addEventListener('click', () => {
  const shareLink = generateShareLink();
  const message = 'I created a special bubble message for you! Pop it to reveal what I am sending';
  const text = encodeURIComponent(`${message}\n${shareLink}`);
  window.open(`https://wa.me/?text=${text}`, '_blank');
});

shareFacebookBtn.addEventListener('click', () => {
  const shareLink = generateShareLink();
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}`, '_blank');
});

shareTwitterBtn.addEventListener('click', () => {
  const shareLink = generateShareLink();
  const text = encodeURIComponent('I created a special bubble message just for you! Pop it to see what I am sending #BubbleLab');
  window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareLink)}&text=${text}`, '_blank');
});

shareTelegramBtn.addEventListener('click', () => {
  const shareLink = generateShareLink();
  const text = encodeURIComponent('I created a special bubble message for you! Pop it to reveal what I am sending');
  window.open(`https://t.me/share/url?url=${encodeURIComponent(shareLink)}&text=${text}`, '_blank');
});

shareEmailBtn.addEventListener('click', () => {
  const shareLink = generateShareLink();
  const subject = encodeURIComponent('A Special Bubble Message For You!');
  const body = encodeURIComponent(`Hi!\n\nI created a special bubble message just for you. Click the link below and pop the bubble to see what I am sending:\n\n${shareLink}\n\nEnjoy!`);
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
});

shareInstagramBtn.addEventListener('click', () => {
  const shareLink = generateShareLink();
  alert('To share on Instagram:\n\n1. Copy the link by clicking Copy\n2. Go to Instagram\n3. Share in a DM, Story, or Bio\n\nLink: ' + shareLink);
});

// Check for shared bubble on page load
function checkForSharedBubble() {
  const urlParams = new URLSearchParams(window.location.search);
  const bubbleParam = urlParams.get('bubble');
  const msgParam = urlParams.get('msg');
  const colorParam = urlParams.get('color');
  
  if (bubbleParam === 'true' && msgParam) {
    const message = decodeURIComponent(msgParam);
    
    // Set color if provided
    if (colorParam) {
      const [r, g, b] = colorParam.split(',');
      redSlider.value = r;
      greenSlider.value = g;
      blueSlider.value = b;
      updateColor();
    }
    
    // Create bubble automatically
    const settings = {
      color: { 
        r: Number(redSlider.value), 
        g: Number(greenSlider.value), 
        b: Number(blueSlider.value) 
      },
      rgb: `rgb(${redSlider.value}, ${greenSlider.value}, ${blueSlider.value})`,
      size: 60,
      shine: 0.7,
      message: message
    };
    
    const bubble = {
      x: canvas.width / 2 + (Math.random() - 0.5) * 100,
      y: canvas.height / 2 + (Math.random() - 0.5) * 100,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2 - 1,
      ...settings
    };
    
    bubbles.push(bubble);
    animate();
    
    // Show hint
    const hint = document.querySelector('.canvas-hint');
    hint.textContent = '✨ Pop this bubble to see the special message! ✨';
    hint.style.color = '#ff69b4';
    hint.style.fontWeight = '600';
  }
}

// Initialize
updateColor();
checkForSharedBubble();

// Message mode toggle
messageMode.forEach(radio => {
  radio.addEventListener('change', (e) => {
    currentMessageMode = e.target.value;
    if (currentMessageMode === 'custom') {
      customMessageContainer.style.display = 'block';
    } else {
      customMessageContainer.style.display = 'none';
    }
  });
});

// Gift mode toggle
giftMode.addEventListener('change', (e) => {
  currentGiftMode = e.target.checked;
});

// Auto-play background music
backgroundMusic.play().catch(() => {
  // Autoplay might be blocked, that's ok
});

// Initialize background animation
function initBackgroundAnimation() {
  backgroundParticles = [];
  for (let i = 0; i < 15; i++) {
    backgroundParticles.push({
      x: Math.random() * backgroundCanvas.width,
      y: Math.random() * backgroundCanvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 3 + 2,
      opacity: Math.random() * 0.3 + 0.1
    });
  }
  animateBackground();
}

function animateBackground() {
  bgCtx.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);
  
  backgroundParticles.forEach(particle => {
    particle.x += particle.vx;
    particle.y += particle.vy;
    
    if (particle.x < 0) particle.x = backgroundCanvas.width;
    if (particle.x > backgroundCanvas.width) particle.x = 0;
    if (particle.y < 0) particle.y = backgroundCanvas.height;
    if (particle.y > backgroundCanvas.height) particle.y = 0;
    
    bgCtx.fillStyle = `rgba(255, 105, 180, ${particle.opacity})`;
    bgCtx.beginPath();
    bgCtx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    bgCtx.fill();
  });
  
  requestAnimationFrame(animateBackground);
}

// Enhanced confetti on pop
function createEnhancedConfetti(bubble) {
  const particleCount = 20;
  const confettiColors = ['#ff69b4', '#ffc0cb', '#ff1493', '#ffb3d9', '#f3e5f5'];
  
  if (!window.particles) window.particles = [];
  
  for (let i = 0; i < particleCount; i++) {
    const angle = (Math.PI * 2 * i) / particleCount;
    const speed = Math.random() * 8 + 4;
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;
    
    window.particles.push({
      x: bubble.x,
      y: bubble.y,
      vx,
      vy,
      life: 0.8,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      size: Math.random() * 6 + 3,
      rotation: Math.random() * Math.PI * 2,
      rotationVel: (Math.random() - 0.5) * 0.2
    });
  }
}

// Pulsing effect for bubbles
function drawBubbleWithPulse(bubble, pulseScale = 1) {
  const { x, y, size, rgb, shine, color } = bubble;

  ctx.shadowColor = rgb;
  ctx.shadowBlur = 20;

  const bubbleGrad = ctx.createRadialGradient(x - (size/3)*pulseScale, y - (size/3)*pulseScale, 0, x, y, size*pulseScale);
  bubbleGrad.addColorStop(0, `rgba(255, 255, 255, ${shine * 0.4})`);
  bubbleGrad.addColorStop(0.3, rgb);
  bubbleGrad.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0.3)`);
  
  ctx.fillStyle = bubbleGrad;
  ctx.beginPath();
  ctx.arc(x, y, size*pulseScale, 0, Math.PI * 2);
  ctx.fill();

  const shineGrad = ctx.createRadialGradient(
    x - (size/3)*pulseScale,
    y - (size/3)*pulseScale,
    0,
    x,
    y,
    size*pulseScale
  );
  shineGrad.addColorStop(0, `rgba(255, 255, 255, ${shine * 0.8})`);
  shineGrad.addColorStop(0.4, `rgba(255, 255, 255, ${shine * 0.2})`);
  shineGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = shineGrad;
  ctx.beginPath();
  ctx.arc(x, y, size*pulseScale, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = `rgba(255, 182, 193, 0.5)`;
  ctx.lineWidth = 1.5;
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.beginPath();
  ctx.arc(x, y, size*pulseScale, 0, Math.PI * 2);
  ctx.stroke();
  
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  
  // Gift wrapping if enabled
  if (currentGiftMode && bubble.gift) {
    drawGiftWrapping(x, y, size*pulseScale);
  }
}

function drawGiftWrapping(x, y, size) {
  // Draw heart shape
  ctx.fillStyle = '#ff1493';
  ctx.save();
  ctx.translate(x, y);
  
  // Heart path
  ctx.beginPath();
  ctx.moveTo(0, -size/3);
  
  // Left curve
  ctx.bezierCurveTo(-size/2, -size, -size/1.5, -size/2, 0, size/2);
  
  // Right curve
  ctx.bezierCurveTo(size/1.5, -size/2, size/2, -size, 0, -size/3);
  ctx.fill();
  
  ctx.restore();
  
  // Add sparkle
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.beginPath();
  ctx.arc(x - size/4, y - size/4, size/8, 0, Math.PI * 2);
  ctx.fill();
}

resizeCanvas();
initBackgroundAnimation();
window.addEventListener('resize', () => {
  resizeCanvas();
  initBackgroundAnimation();
});
