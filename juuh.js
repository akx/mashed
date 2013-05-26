var mx, my, mbx, mby, mb, x0$, canvas, ref$, ctx, audio, x1$, filter, x2$, osc, x3$, glitch, rnd, mash, mashCanvas, redraw;
mx = my = mbx = mby = mb = 0;
x0$ = canvas = document.createElement("canvas");
x0$.width = 1280;
x0$.height = 720;
ref$ = x0$.style;
ref$.width = "100%";
ref$.height = "100%";
ctx = x0$.getContext("2d");
document.body.appendChild(x0$);
x0$.addEventListener("mousedown", function(event){
  mb = 1;
});
x0$.addEventListener("mouseup", function(event){
  mb = 0;
});
x0$.addEventListener("mousemove", function(event){
  if (mb) {
    mbx = event.clientX / window.innerWidth;
    mby = event.clientY / window.innerHeight;
  } else {
    mx = event.clientX / window.innerWidth;
    my = event.clientY / window.innerHeight;
  }
});
if (false && (audio = (function(){
  try {
    return new webkitAudioContext();
  } catch (e$) {}
}()))) {
  x1$ = filter = audio.createBiquadFilter();
  x1$.type = "lowpass";
  x1$.frequency.value = 10000;
  x1$.Q.value = 30;
  x1$.connect(audio.destination);
  x2$ = osc = audio.createOscillator();
  x2$.connect(filter);
  x2$.frequency.value = 60;
  x2$.start(0);
  x3$ = glitch = audio.createScriptProcessor(512, 0, 1);
  x3$.onaudioprocess = function(event){
    var buf, z, x, to$, results$ = [];
    buf = event.outputBuffer.getChannelData(0);
    z = 0;
    for (x = 0, to$ = event.outputBuffer.length; x < to$; ++x) {
      if (rnd(0, 50000) < mx * 500) {
        z += rnd(50, 250);
      }
      if (z > 0) {
        z--;
        results$.push(buf[x] = (rnd(0, 100) < 50
          ? -1
          : +1) / 10.0);
      } else {
        results$.push(buf[x] = 0);
      }
    }
    return results$;
  };
  x3$.connect(filter);
}
rnd = function(a, b){
  return 0 | a + Math.random() * (b - a);
};
mash = function(data, num){
  var iter, i0, i1;
  data = [].slice.apply(data);
  for (iter = 0; iter < num; ++iter) {
    i0 = rnd(30, data.length);
    i1 = rnd(30, data.length);
    data[i0] = data[i1];
  }
  return data.join("");
};
mashCanvas = function(){
  var jpg, ref$, header, data, src, x4$, img;
  jpg = canvas.toDataURL("image/jpeg", 0.1);
  ref$ = jpg.split(","), header = ref$[0], data = ref$[1];
  src = header + "," + mash(data, rnd(2, 5));
  x4$ = img = document.createElement("img");
  x4$.src = src;
  x4$.onload = function(){
    var x, y;
    ctx.globalAlpha = 0.9;
    x = rnd(0, 100) < 30 ? rnd(-250, +250) : 0;
    y = rnd(0, 100) < 30 ? rnd(-250, +250) : 0;
    ctx.drawImage(img, x, y, canvas.width, canvas.height);
    setTimeout(redraw, 4);
  };
  x4$.onerror = function(){
    mashCanvas();
  };
};
redraw = function(){
  var tz, data, am, ph, partials, step, x, to$, t, y;
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 0.1;
  ctx.fillStyle = "purple";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalAlpha = 0.8 * (1 - my);
  if (audio) {
    tz = 0;
    data = ctx.getImageData(0, 0 | canvas.height * 0.2, canvas.width, 0 | canvas.height * 0.2);
    am = [];
    ph = [];
    partials = 0 | 20 + my * 40;
    step = 0 | data.data.length / partials;
    for (x = 0, to$ = data.data.length; step < 0 ? x > to$ : x < to$; x += step) {
      am.push(data.data[x] / 256.0);
      ph.push(data.data[x + 1] / 256.0);
    }
    osc.setWaveTable(audio.createWaveTable(new Float32Array(am), new Float32Array(ph)));
    osc.frequency.value = 60 + mx * 10;
  }
  t = +new Date() * (0.3 + mx * 5);
  for (y = 0; y < 15; ++y) {
    ctx.fillStyle = ['orange', 'black'][y & 1];
    ctx.fillRect((t * (1 + y / 10.0 * (y % 3 == 0
      ? -1
      : +1))) % canvas.width, 50 + y * 30, 150, 150);
  }
  mashCanvas();
};
redraw();