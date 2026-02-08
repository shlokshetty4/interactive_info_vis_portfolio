registerSketch('sk4', function (p) {

  function sizeCanvas() {
    const w = Math.min(p.windowWidth, 800);
    const h = Math.min(p.windowHeight, 800);
    p.resizeCanvas(w, h);
  }

  
  let heatMode = 0;

  function drawArc(cx, cy, r, a0, a1, w) {
    p.noFill();
    p.strokeWeight(w);
    p.arc(cx, cy, r * 2, r * 2, a0, a1);
  }

  function flame(cx, cy, baseR, t, alpha) {
    p.push();
    p.translate(cx, cy);
    const n = 14;
    for (let i = 0; i < n; i++) {
      const ang = (i / n) * p.TWO_PI + p.sin(t * 0.9 + i) * 0.08;
      const r = baseR * (1.05 + 0.08 * p.sin(t * 1.8 + i * 1.2));
      const fx = r * p.cos(ang);
      const fy = r * p.sin(ang);
      const sz = baseR * (0.22 + 0.06 * p.sin(t * 2.2 + i));
      p.noStroke();
      p.fill(40, 170, 255, alpha);
      p.ellipse(fx, fy, sz * 0.8, sz * 1.25);
      p.fill(120, 220, 255, alpha * 0.7);
      p.ellipse(fx, fy, sz * 0.45, sz * 0.85);
    }
    p.pop();
  }

  p.setup = function () {
    p.createCanvas(10, 10);
    sizeCanvas();
    p.angleMode(p.RADIANS);
    p.textFont("sans-serif");
  };

  p.keyPressed = function () {
    if (p.key === ' ') heatMode = 1 - heatMode;
  };

  p.draw = function () {
    const h24 = p.hour();
    const m = p.minute();
    const s = p.second();
    const ms = p.millis();

    let h12 = h24 % 12;
    if (h12 === 0) h12 = 12;

    const minuteProg = (m + s / 60) / 60;

    p.background(18);

    const cx = p.width / 2;
    const cy = p.height / 2;

    const panelW = Math.min(p.width * 0.86, 700);
    const panelH = Math.min(p.height * 0.78, 620);
    const px = cx - panelW / 2;
    const py = cy - panelH / 2;

    p.noStroke();
    p.fill(26);
    p.rect(px, py, panelW, panelH, 26);

    const pad = panelW * 0.08;
    const gridW = panelW - pad * 2;
    const gridH = panelH - pad * 2;

    const col1 = px + pad + gridW * 0.25;
    const col2 = px + pad + gridW * 0.75;
    const row1 = py + pad + gridH * 0.28;
    const row2 = py + pad + gridH * 0.72;

    const burners = [
      { x: col1, y: row1 },
      { x: col2, y: row1 },
      { x: col1, y: row2 },
      { x: col2, y: row2 }
    ];

    const activeIdx = Math.floor(((h12 - 1) / 12) * 4);

    const burnerR = Math.min(gridW, gridH) * 0.17;
    const ringR1 = burnerR * 0.82;
    const ringR2 = burnerR * 1.05;

    for (let i = 0; i < burners.length; i++) {
      const bx = burners[i].x;
      const by = burners[i].y;

      p.noStroke();
      p.fill(16);
      p.circle(bx, by, burnerR * 2.35);

      p.noFill();
      p.stroke(70, 70, 70, 160);
      p.strokeWeight(6);
      p.circle(bx, by, ringR2 * 2);

      p.stroke(95, 95, 95, 140);
      p.strokeWeight(4);
      p.circle(bx, by, ringR1 * 2);

      if (i === activeIdx) {
        const a0 = -p.HALF_PI;
        const a1 = a0 + minuteProg * p.TWO_PI;

        p.stroke(0, 170, 255, 220);
        drawArc(bx, by, ringR2, a0, a1, 10);

        p.stroke(0, 230, 255, 140);
        drawArc(bx, by, ringR1, a0, a1, 7);

        const t = ms / 1000;
        const heatScale = heatMode ? 1.35 : 0.95;
        flame(bx, by, burnerR * 0.78 * heatScale, t, heatMode ? 95 : 65);

        const sparkN = heatMode ? 12 : 6;
        for (let k = 0; k < sparkN; k++) {
          const ang = (k / sparkN) * p.TWO_PI + t * (0.6 + 0.15 * k);
          const rr = burnerR * (0.35 + 0.35 * p.noise(k * 10, t));
          const sx = bx + rr * p.cos(ang);
          const sy = by + rr * p.sin(ang);
          p.noStroke();
          p.fill(180, 240, 255, heatMode ? 110 : 70);
          p.circle(sx, sy, burnerR * (0.05 + 0.02 * p.sin(t * 3 + k)));
        }
      } else {
        p.noStroke();
        p.fill(255, 255, 255, 20);
        p.circle(bx, by, burnerR * 1.6);
      }
    }

    p.fill(235);
    p.textAlign(p.CENTER, p.CENTER);
    p.textStyle(p.BOLD);
    p.textSize(Math.max(18, panelW * 0.05));
    p.text("Stove Burner Clock", cx, py + panelH * 0.08);

    p.textStyle(p.NORMAL);
    p.textSize(Math.max(12, panelW * 0.022));
    p.fill(220, 220, 220, 170);
    p.text("Hour = active burner • Minute = ring fill • Seconds = flicker", cx, py + panelH * 0.14);

    const hh = (h12 < 10 ? "0" : "") + h12;
    const mm = (m < 10 ? "0" : "") + m;
    const ss = (s < 10 ? "0" : "") + s;

    p.fill(235, 235, 235, 220);
    p.textSize(Math.max(14, panelW * 0.03));
    p.text(hh + ":" + mm + ":" + ss + (h24 < 12 ? " AM" : " PM"), cx, py + panelH * 0.20);

    p.fill(200, 200, 200, 140);
    p.textSize(Math.max(12, panelW * 0.02));
    p.text("Press SPACE to toggle Simmer / High heat", cx, py + panelH * 0.92);

    p.fill(0, 170, 255, 200);
    p.textStyle(p.BOLD);
    p.textSize(Math.max(12, panelW * 0.022));
    p.text(heatMode ? "HIGH HEAT" : "SIMMER", cx, py + panelH * 0.88);
  };

  p.windowResized = function () {
    sizeCanvas();
  };
});
