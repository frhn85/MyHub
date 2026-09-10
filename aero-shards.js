(() => {
  'use strict';

  const canvas = document.getElementById('aeroShardsCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobile = window.matchMedia('(max-width: 600px)').matches;
  const dprCap = mobile ? 1.25 : 1.5;
  let width = 0, height = 0, dpr = 1, raf = 0;
  let shards = [];
  let last = performance.now();

  const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    dpr = Math.min(window.devicePixelRatio || 1, dprCap);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    createShards();
  }

  function random(min, max) {
    return min + Math.random() * (max - min);
  }

  function createShards() {
    const count = mobile ? 18 : 30;
    shards = Array.from({ length: count }, (_, i) => ({
      x: random(-0.08, 1.08),
      y: random(-0.08, 1.08),
      size: random(20, mobile ? 90 : 150),
      angle: random(0, Math.PI * 2),
      spin: random(-0.00035, 0.00035),
      speed: random(0.000015, 0.000045),
      drift: random(-0.000025, 0.000025),
      alpha: random(0.08, 0.22),
      depth: random(0.35, 1),
      phase: random(0, Math.PI * 2),
      shape: i % 3
    }));
  }

  function drawShard(s, time) {
    const px = (s.x + (pointer.x - 0.5) * 0.018 * s.depth) * width;
    const py = (s.y + (pointer.y - 0.5) * 0.018 * s.depth) * height;
    const size = s.size * (0.72 + s.depth * 0.42);
    const pulse = 0.78 + Math.sin(time * 0.0007 + s.phase) * 0.18;

    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(s.angle);
    ctx.globalAlpha = s.alpha * pulse;

    const grad = ctx.createLinearGradient(-size, -size, size, size);
    grad.addColorStop(0, 'rgba(65,150,255,0)');
    grad.addColorStop(0.35, 'rgba(65,150,255,0.55)');
    grad.addColorStop(0.7, 'rgba(125,92,255,0.42)');
    grad.addColorStop(1, 'rgba(34,211,238,0)');
    ctx.fillStyle = grad;

    ctx.beginPath();
    if (s.shape === 0) {
      ctx.moveTo(-size * 0.95, -size * 0.18);
      ctx.lineTo(size * 0.75, -size * 0.42);
      ctx.lineTo(size * 0.35, size * 0.2);
      ctx.lineTo(-size * 0.7, size * 0.48);
    } else if (s.shape === 1) {
      ctx.moveTo(-size * 0.9, 0);
      ctx.lineTo(-size * 0.1, -size * 0.55);
      ctx.lineTo(size * 0.85, -size * 0.15);
      ctx.lineTo(size * 0.25, size * 0.55);
    } else {
      ctx.moveTo(-size * 0.8, -size * 0.35);
      ctx.lineTo(size * 0.15, -size * 0.65);
      ctx.lineTo(size * 0.85, size * 0.25);
      ctx.lineTo(-size * 0.15, size * 0.48);
    }
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = 'rgba(120,190,255,0.13)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
  }

  function render(time) {
    const dt = Math.min(32, time - last);
    last = time;
    pointer.x += (pointer.tx - pointer.x) * 0.035;
    pointer.y += (pointer.ty - pointer.y) * 0.035;

    ctx.clearRect(0, 0, width, height);

    const glow = ctx.createRadialGradient(
      width * (0.5 + (pointer.x - 0.5) * 0.12),
      height * (0.38 + (pointer.y - 0.5) * 0.12),
      0,
      width * 0.5,
      height * 0.45,
      Math.max(width, height) * 0.72
    );
    glow.addColorStop(0, 'rgba(50,105,255,0.10)');
    glow.addColorStop(0.48, 'rgba(95,65,220,0.045)');
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);

    for (const s of shards) {
      if (!reduceMotion) {
        s.y -= s.speed * dt;
        s.x += s.drift * dt;
        s.angle += s.spin * dt;
        if (s.y < -0.14) s.y = 1.14;
        if (s.x < -0.14) s.x = 1.14;
        if (s.x > 1.14) s.x = -0.14;
      }
      drawShard(s, time);
    }

    if (!reduceMotion) raf = requestAnimationFrame(render);
  }

  window.addEventListener('pointermove', (e) => {
    pointer.tx = e.clientX / window.innerWidth;
    pointer.ty = e.clientY / window.innerHeight;
  }, { passive: true });

  window.addEventListener('resize', resize, { passive: true });
  resize();
  render(performance.now());
})();
