registerSketch("sk5", function (p) {
  let table;

  const W = 1080, H = 1350;
  let useLog = true; 
  let wf0 = [];
  let wf1 = []; 

  let globalMin = 0;
  let globalMax = 1;

  function money(x) {
    const s = Math.round(x).toString();
    return "$" + s.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function median(a) {
    if (a.length === 0) return NaN;
    const b = a.slice().sort((x, y) => x - y);
    const n = b.length;
    const m = Math.floor(n / 2);
    return n % 2 ? b[m] : (b[m - 1] + b[m]) / 2;
  }

  function quantile(a, q) {
    if (a.length === 0) return NaN;
    const b = a.slice().sort((x, y) => x - y);
    const pos = (b.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;
    if (b[base + 1] === undefined) return b[base];
    return b[base] + rest * (b[base + 1] - b[base]);
  }

  function buildGroups() {
    wf0 = [];
    wf1 = [];
    for (let r = 0; r < table.getRowCount(); r++) {
      const price = Number(table.getString(r, "price"));
      const wf = Number(table.getString(r, "waterfront"));
      if (!Number.isFinite(price) || !Number.isFinite(wf)) continue;
      (wf === 1 ? wf1 : wf0).push(price);
    }
  }

  function recomputeScale() {
    const all = wf0.concat(wf1);

    const vals = all
      .map(v => (useLog ? Math.log10(v) : v))
      .filter(Number.isFinite)
      .sort((a, b) => a - b);

    if (vals.length === 0) {
      globalMin = 0;
      globalMax = 1;
      return;
    }

    const loQ = 0.005;  
    const hiQ = 0.995; 

    const loIdx = Math.floor((vals.length - 1) * loQ);
    const hiIdx = Math.floor((vals.length - 1) * hiQ);

    globalMin = vals[loIdx];
    globalMax = vals[hiIdx];

    const pad = (globalMax - globalMin) * 0.12;
    globalMin -= pad;
    globalMax += pad;

    if (!Number.isFinite(globalMin) || !Number.isFinite(globalMax) || globalMin === globalMax) {
      globalMin = vals[0];
      globalMax = vals[vals.length - 1];
    }
  }

  function drawBox(xc, top, bottom, values) {
    const vals = values.map(v => (useLog ? Math.log10(v) : v));

    const q1 = quantile(vals, 0.25);
    const q2 = quantile(vals, 0.50);
    const q3 = quantile(vals, 0.75);
    const iqr = q3 - q1;

    const lowFence = q1 - 1.5 * iqr;
    const highFence = q3 + 1.5 * iqr;
    const clipped = vals.slice().sort((a, b) => a - b);

    let wLow = clipped.find(v => v >= lowFence);
    let wHigh = clipped.slice().reverse().find(v => v <= highFence);
    if (wLow === undefined) wLow = clipped[0];
    if (wHigh === undefined) wHigh = clipped[clipped.length - 1];

    const yQ1 = p.constrain(p.map(q1, globalMin, globalMax, bottom, top), top, bottom);
    const yQ2 = p.constrain(p.map(q2, globalMin, globalMax, bottom, top), top, bottom);
    const yQ3 = p.constrain(p.map(q3, globalMin, globalMax, bottom, top), top, bottom);
    const yWL = p.constrain(p.map(wLow, globalMin, globalMax, bottom, top), top, bottom);
    const yWH = p.constrain(p.map(wHigh, globalMin, globalMax, bottom, top), top, bottom);

    p.noStroke();
    p.fill(235);
    p.rect(xc - 70, yQ3, 140, yQ1 - yQ3, 12);

    p.stroke(20);
    p.strokeWeight(4);
    p.line(xc - 70, yQ2, xc + 70, yQ2);

    p.stroke(235);
    p.strokeWeight(3);
    p.line(xc, yQ3, xc, yWH);
    p.line(xc, yQ1, xc, yWL);
    p.line(xc - 35, yWH, xc + 35, yWH);
    p.line(xc - 35, yWL, xc + 35, yWL);
  }

  function samplePoints(values, k) {
    const out = [];
    const n = values.length;
    const take = Math.min(k, n);
    for (let i = 0; i < take; i++) {
      const idx = Math.floor(p.random(n));
      out.push(values[idx]);
    }
    return out;
  }

  function drawPoster() {
    p.background(17);

    p.noStroke();
    p.fill(245);
    p.textAlign(p.LEFT, p.TOP);
    p.textStyle(p.BOLD);
    p.textSize(56);
    p.text("Waterfront homes: rare, but extremely expensive", 70, 80);

    p.textStyle(p.NORMAL);
    p.textSize(28);
    p.fill(200);
    p.text("King County sales (kc_house_data.csv) — distribution, not just averages", 70, 155);

    const bx = W - 480, by = 210, bw = 390, bh = 60;
    p.stroke(255, 60);
    p.strokeWeight(2);
    p.fill(0, 120);
    p.rect(bx, by, bw, bh, 14);
    p.noStroke();
    p.fill(235);
    p.textSize(24);
    p.textStyle(p.BOLD);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(useLog ? "Scale: LOG (click)" : "Scale: LINEAR (click)", bx + bw / 2, by + bh / 2);

    const top = 300, bottom = 1100;

    p.stroke(120);
    p.strokeWeight(2);
    p.line(140, top, 140, bottom);

    p.noStroke();
    p.fill(160);
    p.textAlign(p.RIGHT, p.CENTER);
    p.textSize(22);

    for (let i = 0; i <= 4; i++) {
      const t = p.lerp(globalMin, globalMax, i / 4);
      const y = p.map(t, globalMin, globalMax, bottom, top);

      p.stroke(80);
      p.strokeWeight(2);
      p.line(140, y, 980, y);

      p.noStroke();

      let label;
      if (useLog) {
        const dollars = Math.pow(10, t);
        label = money(dollars);
      } else {
        label = money(t);
      }
      p.text(label, 130, y);
    }

    const x0 = 380;
    const x1 = 760;

    const s0 = samplePoints(wf0, 500);
    const s1 = samplePoints(wf1, 500);

    function drawJitter(xc, values) {
      p.noStroke();
      p.fill(255, 70);
      for (const raw of values) {
        const v = useLog ? Math.log10(raw) : raw;
        let y = p.map(v, globalMin, globalMax, bottom, top);
        y = p.constrain(y, top, bottom);
        const x = xc + p.random(-65, 65);
        p.circle(x, y, 6);
      }
    }

    drawJitter(x0, s0);
    drawJitter(x1, s1);

    drawBox(x0, top, bottom, wf0);
    drawBox(x1, top, bottom, wf1);

    p.noStroke();
    p.fill(220);
    p.textAlign(p.CENTER, p.TOP);
    p.textStyle(p.BOLD);
    p.textSize(28);
    p.text("Non-waterfront (0)", x0, bottom + 20);
    p.text("Waterfront (1)", x1, bottom + 20);

    const m0 = median(wf0);
    const m1 = median(wf1);
    const ratio = Number.isFinite(m0) && m0 > 0 ? (m1 / m0) : NaN;

    p.noStroke();
    p.fill(0, 160);
    p.rect(70, 1160, W - 140, 150, 18);

    p.fill(255);
    p.textAlign(p.LEFT, p.TOP);
    p.textStyle(p.BOLD);
    p.textSize(30);
    p.text("Story:", 100, 1185);

    p.textStyle(p.NORMAL);
    p.textSize(24);
    p.fill(230);

    const line1 = `Median waterfront sale: ${money(m1)} vs ${money(m0)} non-waterfront.`;
    const line2 = Number.isFinite(ratio)
      ? `That’s about ${ratio.toFixed(1)}× higher — the whole distribution shifts upward.`
      : "Waterfront shows a clear upward shift across the distribution.";

    p.text(line1, 210, 1187);
    p.text(line2, 100, 1230);

    p.fill(160);
    p.textSize(20);
    p.textAlign(p.LEFT, p.BOTTOM);
    p.text(
      "Source: kc_house_data.csv | Chart: boxplot + jitter | Interaction: linear/log toggle",
      70,
      H - 35
    );
  }

  p.preload = function () {
    table = p.loadTable("kc_house_data.csv", "csv", "header");
  };

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    buildGroups();
    recomputeScale();
  };

  p.draw = function () {
    p.background(10);
    const s = Math.min(p.width / W, p.height / H);
    const ox = (p.width - W * s) / 2;
    const oy = (p.height - H * s) / 2;

    p.push();
    p.translate(ox, oy);
    p.scale(s);
    drawPoster();
    p.pop();
  };

  p.mousePressed = function () {
    const s = Math.min(p.width / W, p.height / H);
    const ox = (p.width - W * s) / 2;
    const oy = (p.height - H * s) / 2;
    const mx = (p.mouseX - ox) / s;
    const my = (p.mouseY - oy) / s;

    const bx = W - 480, by = 210, bw = 390, bh = 60;
    if (mx >= bx && mx <= bx + bw && my >= by && my <= by + bh) {
      useLog = !useLog;
      recomputeScale();
    }
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
});
