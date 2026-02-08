// Instance-mode sketch for tab 2
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
    p.background(220);
    p.fill(100, 150, 240);
    p.textSize(32);
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
