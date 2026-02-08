registerSketch('sk2', function (p) {

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

    let h12 = h24 % 12;
    if (h12 === 0) h12 = 12;

    const vinylSpin = (s / 60) * p.TWO_PI;
    const minuteFloat = m + s / 60;
    const minuteAng = -p.HALF_PI + (minuteFloat / 60) * p.TWO_PI;

    p.background(18);

    const cx = p.width / 2;
    const cy = p.height / 2;
    const recordR = Math.min(p.width, p.height) * 0.35;

    p.noStroke();
    p.fill(12);
    p.circle(cx, cy, recordR * 2.45);

    const tickOuter = recordR * 1.18;
    const tickInnerShort = recordR * 1.11;
    const tickInnerLong = recordR * 1.06;
    const labelRadius = recordR * 1.28;

    for (let i = 0; i < 60; i++) {
      const ang = -p.HALF_PI + (i / 60) * p.TWO_PI;
      const isFive = (i % 5 === 0);
      const inner = isFive ? tickInnerLong : tickInnerShort;

      const x1 = cx + tickOuter * p.cos(ang);
      const y1 = cy + tickOuter * p.sin(ang);
      const x2 = cx + inner * p.cos(ang);
      const y2 = cy + inner * p.sin(ang);

      if (i === m) {
        p.stroke(255);
        p.strokeWeight(4);
      } else {
        p.stroke(160, 160, 160, 140);
        p.strokeWeight(isFive ? 3 : 2);
      }
      p.line(x1, y1, x2, y2);

      if (isFive) {
        const tx = cx + labelRadius * p.cos(ang);
        const ty = cy + labelRadius * p.sin(ang);

        p.noStroke();
        p.fill(i === m ? 255 : p.color(220, 220, 220, 170));
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(recordR * 0.07);

        const label = (i === 0) ? "0" : i.toString();
        p.text(label, tx, ty);
      }
    }

    p.push();
    p.translate(cx, cy);
    p.rotate(vinylSpin);

    p.noStroke();
    p.fill(8);
    p.circle(0, 0, recordR * 2);

    p.fill(25);
    p.ellipse(-recordR * 0.18, -recordR * 0.10, recordR * 1.6, recordR * 1.6);

    p.noFill();
    p.stroke(45);
    p.strokeWeight(2);
    for (let r = recordR * 0.32; r < recordR; r += recordR * 0.085) {
      p.circle(0, 0, r * 2);
    }

    p.pop();

    const labelTone = p.map(h24, 0, 23, 90, 210);
    p.noStroke();
    p.fill(labelTone, 110, 180);
    p.circle(cx, cy, recordR * 0.42);

    p.fill(20);
    p.circle(cx, cy, recordR * 0.06);

    const handLen = tickOuter * 0.98;
    const hx = cx + handLen * p.cos(minuteAng);
    const hy = cy + handLen * p.sin(minuteAng);

    p.stroke(255, 255, 255, 220);
    p.strokeWeight(5);
    p.line(cx, cy, hx, hy);

    p.stroke(255, 255, 255, 255);
    p.strokeWeight(2);
    p.line(hx, hy, hx - 14 * p.cos(minuteAng), hy - 14 * p.sin(minuteAng));

    p.noStroke();
    p.fill(245);
    p.textAlign(p.CENTER, p.CENTER);
    p.textStyle(p.BOLD);
    p.textSize(recordR * 0.22);
    p.text(h12.toString(), cx, cy);

    p.textStyle(p.NORMAL);
    p.textSize(recordR * 0.08);
    p.fill(245, 245, 245, 170);
    p.text(h24 < 12 ? "AM" : "PM", cx, cy + recordR * 0.17);

    p.noStroke();
    p.fill(230, 230, 230, 140);
    p.textSize(Math.max(11, Math.min(p.width, p.height) * 0.025));
    p.text("Minute = hand • Second = record spin • Hour = center", cx, cy + recordR * 1.35);
  };

  p.windowResized = function () {
    sizeCanvas();
  };
});