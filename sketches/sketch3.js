registerSketch('sk3', function (p) {

  function sizeCanvas() {
    const w = Math.min(p.windowWidth, 800);
    const h = Math.min(p.windowHeight, 800);
    p.resizeCanvas(w, h);
  }

  function pad2(n) {
    return (n < 10 ? "0" : "") + n;
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

    
    
    
    const secondsIntoHour = m * 60 + s;
    const meltProg = secondsIntoHour / 3600; 
    const iceFrac = 1 - meltProg;            

    p.background(240);

    const cx = p.width / 2;
    const cy = p.height / 2;

    
    const tubeW = Math.min(p.width, p.height) * 0.22;
    const tubeH = Math.min(p.width, p.height) * 0.62;

    const tubeX = cx - tubeW / 2;
    const tubeY = cy - tubeH / 2;

    const capR = tubeW / 2;

    
    p.noStroke();
    p.fill(255, 255, 255, 160);
    p.rect(tubeX, tubeY, tubeW, tubeH, capR);

   
    p.noFill();
    p.stroke(60, 60, 60, 160);
    p.strokeWeight(3);
    p.rect(tubeX, tubeY, tubeW, tubeH, capR);


    const leftTickX1 = tubeX - tubeW * 0.25;
    const leftTickX2 = tubeX - tubeW * 0.10;

    p.stroke(80, 80, 80, 160);
    p.strokeWeight(2);
    p.fill(60, 60, 60, 170);
    p.textAlign(p.RIGHT, p.CENTER);

    for (let i = 0; i <= 60; i++) {
      const t = i / 60; 
      const y = tubeY + t * tubeH;

      const isFive = (i % 5 === 0);
      const tickLen = isFive ? (leftTickX2 - leftTickX1) * 1.35 : (leftTickX2 - leftTickX1);

      p.strokeWeight(isFive ? 3 : 2);
      p.line(leftTickX2 - tickLen, y, leftTickX2, y);

      if (isFive) {
        p.noStroke();
        p.textSize(Math.max(10, tubeW * 0.14));
        p.text(i.toString(), leftTickX2 - tickLen - 6, y);
      }
    }

   
    const curY = tubeY + (m / 60) * tubeH;
    p.stroke(220, 60, 80, 200);
    p.strokeWeight(4);
    p.line(tubeX, curY, tubeX + tubeW, curY);

   
    const innerPad = tubeW * 0.10;
    const innerX = tubeX + innerPad;
    const innerY = tubeY + innerPad;
    const innerW = tubeW - 2 * innerPad;
    const innerH = tubeH - 2 * innerPad;

    const iceH = innerH * iceFrac;
    const iceY = innerY + (innerH - iceH);

    
    const waterH = innerH - iceH;
    if (waterH > 0) {
      p.noStroke();
      p.fill(120, 170, 220, 120);
      p.rect(innerX, innerY + iceH, innerW, waterH, innerW * 0.25);
    }


    p.noStroke();
    p.fill(200, 235, 255, 210);
    p.rect(innerX, iceY, innerW, iceH, innerW * 0.25);


    p.fill(255, 255, 255, 120);
    p.rect(innerX + innerW * 0.12, iceY + iceH * 0.08, innerW * 0.22, iceH * 0.84, innerW * 0.2);


    const dripCount = 6;
    for (let i = 0; i < dripCount; i++) {
      const phase = (s / 60) * p.TWO_PI + i * 0.9;
      const dx = innerX + innerW * (0.15 + 0.7 * (i / (dripCount - 1)));
      const dy = innerY + iceH + (p.sin(phase) * 6 + 10);
      p.noStroke();
      p.fill(120, 170, 220, 140);
      p.circle(dx, dy, innerW * 0.08);
    }


    p.fill(30);
    p.textAlign(p.CENTER, p.CENTER);

    p.textStyle(p.BOLD);
    p.textSize(Math.max(22, tubeW * 0.55));
    p.text(h12.toString(), cx, tubeY - tubeW * 0.55);

    p.textStyle(p.NORMAL);
    p.textSize(Math.max(12, tubeW * 0.18));
    p.text(h24 < 12 ? "AM" : "PM", cx, tubeY - tubeW * 0.28);

    p.fill(30, 30, 30, 170);
    p.textSize(Math.max(12, tubeW * 0.16));
    p.text(
      pad2(h12) + ":" + pad2(m) + ":" + pad2(s),
      cx,
      tubeY + tubeH + tubeW * 0.40
    );

    p.fill(30, 30, 30, 120);
    p.textSize(Math.max(11, tubeW * 0.14));
    p.text("Ice resets each hour • Line = current minute", cx, tubeY + tubeH + tubeW * 0.62);
  };

  p.windowResized = function () {
    sizeCanvas();
  };
});
