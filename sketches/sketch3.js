registerSketch('sk3', function (p) {

  function sizeCanvas() {
    const w = Math.min(p.windowWidth, 800);
    const h = Math.min(p.windowHeight, 800);
    p.resizeCanvas(w, h);
  }

  p.setup = function () {
    p.createCanvas(10, 10);
    sizeCanvas();
    p.angleMode(p.RADIANS);
    p.textFont('sans-serif');
  };

  p.draw = function () {
    const h24 = p.hour();
    const m = p.minute();
    const s = p.second();
    const ms = p.millis();

    let h12 = h24 % 12;
    if (h12 === 0) h12 = 12;

    const breathCycle = 8000;
    const breathProgress = (ms % breathCycle) / breathCycle;

    let breathSize;
    if (breathProgress < 0.5) {
      breathSize = p.map(breathProgress, 0, 0.5, 0.5, 1.0);
    } else {
      breathSize = p.map(breathProgress, 0.5, 1.0, 1.0, 0.5);
    }

    breathSize = p.sin(breathProgress * p.TWO_PI) * 0.25 + 0.75;

    const bgBrightness = p.map(h24, 0, 23, 20, 240);
    const bgHue = p.map(h24, 0, 23, 200, 280) % 360;

    p.colorMode(p.HSB, 360, 100, 100, 100);
    p.background(bgHue, 30, bgBrightness > 200 ? 95 : 15);

    const cx = p.width / 2;
    const cy = p.height / 2;
    const baseRadius = Math.min(p.width, p.height) * 0.25;

    p.noFill();
    for (let i = 0; i < 60; i++) {
      const ringHue = p.map(i, 0, 60, 180, 280);
      const ringAlpha = i === m ? 80 : 20;
      const ringWeight = i === m ? 4 : (i % 5 === 0 ? 2 : 1);

      p.stroke(ringHue, 60, 80, ringAlpha);
      p.strokeWeight(ringWeight);

      const ringRadius = baseRadius + (i * 3);
      p.circle(cx, cy, ringRadius * 2);
    }

    const mainRadius = baseRadius * breathSize;
    const secondHue = p.map(s, 0, 60, 180, 320);

    for (let i = 5; i > 0; i--) {
      p.noFill();
      p.stroke(secondHue, 70, 90, 10);
      p.strokeWeight(i * 3);
      p.circle(cx, cy, mainRadius * 2 + i * 10);
    }

    p.fill(secondHue, 50, 90, 30);
    p.stroke(secondHue, 80, 100, 60);
    p.strokeWeight(3);
    p.circle(cx, cy, mainRadius * 2);

    p.push();
    p.translate(cx, cy);

    for (let i = 0; i < 12; i++) {
      const angle = p.map(i, 0, 12, 0, p.TWO_PI) - p.HALF_PI;
      const petalDist = mainRadius * 1.3;
      const petalX = petalDist * p.cos(angle);
      const petalY = petalDist * p.sin(angle);

      const petalHue = p.map(i, 0, 12, 200, 300);
      const isCurrentHour = (i + 1) === h12 || (i === 0 && h12 === 12);

      if (isCurrentHour) {
        p.fill(petalHue, 80, 100, 80);
        p.noStroke();
        p.circle(petalX, petalY, 25);
      } else {
        p.fill(petalHue, 40, 70, 30);
        p.noStroke();
        p.circle(petalX, petalY, 15);
      }
    }
    p.pop();

    p.colorMode(p.RGB, 255);
    p.fill(255, 255, 255, 200);
    p.noStroke();
    p.textAlign(p.CENTER, p.CENTER);

    p.textSize(baseRadius * 0.4);
    p.textStyle(p.BOLD);
    p.text(h12, cx, cy - baseRadius * 0.15);

    p.textSize(baseRadius * 0.2);
    p.textStyle(p.NORMAL);
    p.text(p.nf(m, 2) + ":" + p.nf(s, 2), cx, cy + baseRadius * 0.2);

    p.fill(255, 255, 255, 150);
    p.textSize(baseRadius * 0.15);
    const breathText = breathProgress < 0.5 ? "breathe in..." : "breathe out...";
    p.text(breathText, cx, cy + baseRadius * 1.8);

    p.fill(255, 255, 255, 100);
    p.textSize(12);
    p.text("Center = time • Circle pulse = breathing • Petals = hours", cx, p.height - 20);
  };

  p.windowResized = function () {
    sizeCanvas();
  };
});
