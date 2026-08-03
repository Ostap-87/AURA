/*!
 * aura-mascot.js — интерактивный 3D-маскот для сайта
 * Зависимости: three.js r128+ (подгружается сам, если не найден)
 *
 * Подключение:
 *   <div id="mascot"></div>
 *   <script src="/js/aura-mascot.js"></script>
 *   <script>
 *     const m = AuraMascot.mount({ container: '#mascot', size: 260 });
 *     // позже можно дёргать жесты вручную:
 *     // m.play('wave'); m.play('jump'); m.destroy();
 *   </script>
 *
 * Работает и как ES-модуль: import { mount } from './aura-mascot.js'
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.AuraMascot = api;
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var THREE_CDN = [
    "/js/vendor/three-r128.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js",
    "https://unpkg.com/three@0.128.0/build/three.min.js",
    "https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.min.js"
  ];

  var DEFAULTS = {
    container: "#mascot",
    size: 260,               // сторона канваса в px; null = растянуть по контейнеру
    palette: { light: 0xE9EDF1, dark: 0x25304C, accent: 0xC93A2B, glow: 0x59A8FF },
    quality: "high",         // 'high' — отражения и тени, 'low' — без них
    greetOnLoad: true,       // помахать при первом появлении
    reactToScroll: true,     // провожать взглядом прокрутку страницы
    autoGestures: true,      // сам себя занимает в простое
    enableOnMobile: false,   // на узких экранах по умолчанию выключен
    mobileBreakpoint: 760,
    fallbackImage: null,     // картинка-заглушка вместо 3D
    onReady: null,
    onError: null
  };

  /* ---------- загрузка three.js ---------- */
  var THREE_LOAD_TIMEOUT_MS = 4000; // не ждём зависший источник вечно — переходим к следующему
  var threePromise = null;
  function loadThree() {
    if (window.THREE) return Promise.resolve(window.THREE);
    if (threePromise) return threePromise;
    threePromise = new Promise(function (resolve, reject) {
      var i = 0;
      (function next() {
        if (i >= THREE_CDN.length) return reject(new Error("three.js не загрузился ни с одного зеркала"));
        var s = document.createElement("script");
        var settled = false;
        var timer = setTimeout(function () {
          if (settled) return;
          settled = true;
          s.onload = s.onerror = null;
          next();
        }, THREE_LOAD_TIMEOUT_MS);
        s.src = THREE_CDN[i++];
        s.async = true;
        s.onload = function () {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          window.THREE ? resolve(window.THREE) : next();
        };
        s.onerror = function () {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          next();
        };
        document.head.appendChild(s);
      })();
    });
    return threePromise;
  }

  function hasWebGL() {
    try {
      var c = document.createElement("canvas");
      return !!(c.getContext("webgl") || c.getContext("experimental-webgl"));
    } catch (e) { return false; }
  }

  /* ================= основной модуль ================= */
  function mount(userOpts) {
    var o = Object.assign({}, DEFAULTS, userOpts || {});
    if (userOpts && userOpts.palette) o.palette = Object.assign({}, DEFAULTS.palette, userOpts.palette);

    var host = typeof o.container === "string" ? document.querySelector(o.container) : o.container;
    if (!host) throw new Error("AuraMascot: контейнер не найден — " + o.container);

    var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    var narrow = matchMedia("(max-width:" + o.mobileBreakpoint + "px)").matches;

    // Заглушка вместо 3D: мобильные, отключённое WebGL, экономия батареи
    if ((narrow && !o.enableOnMobile) || !hasWebGL()) {
      if (o.fallbackImage) {
        var img = new Image();
        img.src = o.fallbackImage;
        img.alt = "";
        img.style.cssText = "display:block;width:100%;height:auto";
        host.appendChild(img);
      }
      return { destroy: function () { host.innerHTML = ""; }, play: function () {}, ready: false };
    }

    var api = { destroy: null, play: function () {}, ready: false };

    loadThree().then(function (THREE) { build(THREE); }).catch(function (err) {
      if (o.onError) o.onError(err);
      else if (window.console) console.warn("AuraMascot:", err.message);
    });

    /* ---------------------------------------------------- */
    function build(THREE) {
      var HI = o.quality === "high";

      var canvas = document.createElement("canvas");
      canvas.style.cssText = "display:block;width:100%;height:100%;background:transparent";
      host.appendChild(canvas);
      if (o.size) { host.style.width = o.size + "px"; host.style.height = o.size + "px"; }

      var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true, powerPreference: "low-power" });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      renderer.outputEncoding = THREE.sRGBEncoding;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      renderer.shadowMap.enabled = HI;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      var scene = new THREE.Scene();
      var camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);

      /* --- окружение для отражений --- */
      if (HI) {
        var envScene = new THREE.Scene();
        var bg = new THREE.BoxGeometry(1, 1, 1); bg.deleteAttribute("uv");
        var room = new THREE.Mesh(bg, new THREE.MeshBasicMaterial({ side: THREE.BackSide, color: 0x1B2128 }));
        room.scale.set(26, 16, 26); room.position.y = 6; envScene.add(room);
        [[12,.5,10, 0,11.5,0, 0xffffff,3.6],[.5,7,8, -8,5.5,-2, 0xC6DCFF,2.2],
         [.5,6,7, 8,5,2, 0xFFD8BC,1.5],[9,2.5,.5, 0,3,-9, o.palette.accent,1.1]]
        .forEach(function (s) {
          var m = new THREE.Mesh(new THREE.BoxGeometry(s[0], s[1], s[2]),
                  new THREE.MeshBasicMaterial({ color: s[6] }));
          m.material.color.multiplyScalar(s[7]);
          m.position.set(s[3], s[4], s[5]); envScene.add(m);
        });
        var pm = new THREE.PMREMGenerator(renderer);
        scene.environment = pm.fromScene(envScene, 0.04).texture;
        pm.dispose();
      }

      scene.add(new THREE.HemisphereLight(0xC8D8E8, 0x20262C, HI ? 0.35 : 1.0));
      var key = new THREE.DirectionalLight(0xffffff, HI ? 1.6 : 1.9);
      key.position.set(4, 7, 5); key.castShadow = HI;
      if (HI) {
        key.shadow.mapSize.set(1024, 1024);
        key.shadow.camera.near = 1; key.shadow.camera.far = 26;
        key.shadow.camera.left = -4; key.shadow.camera.right = 4;
        key.shadow.camera.top = 5.5; key.shadow.camera.bottom = -0.6;
        key.shadow.bias = -0.0009; key.shadow.radius = 3;
      }
      scene.add(key);
      var rim = new THREE.DirectionalLight(o.palette.accent, 1.0);
      rim.position.set(-3, 3.5, -4.5); scene.add(rim);

      /* --- материалы --- */
      function paint(c, cc) {
        return new THREE.MeshPhysicalMaterial({ color: c, metalness: 0.1, roughness: 0.3,
          clearcoat: cc, clearcoatRoughness: 0.06, envMapIntensity: 1.15 });
      }
      var M = {
        white: paint(o.palette.light, 1.0),
        navy : paint(o.palette.dark, 0.85),
        red  : paint(o.palette.accent, 0.9),
        rubber: new THREE.MeshStandardMaterial({ color: 0x14171B, roughness: 0.92 }),
        metal : new THREE.MeshStandardMaterial({ color: 0x9AA4AE, metalness: 0.95, roughness: 0.24 }),
        joint : new THREE.MeshStandardMaterial({ color: 0x2C333B, metalness: 0.85, roughness: 0.38 }),
        seam  : new THREE.MeshStandardMaterial({ color: 0x0D1014, roughness: 0.9 }),
        visor : new THREE.MeshPhysicalMaterial({ color: 0x05070A, metalness: 0.4, roughness: 0.05,
                  clearcoat: 1, clearcoatRoughness: 0.02, envMapIntensity: 2.0 }),
        eye   : new THREE.MeshStandardMaterial({ color: 0x9FD2FF, emissive: o.palette.glow, emissiveIntensity: 3, roughness: 0.2 }),
        led   : new THREE.MeshStandardMaterial({ color: 0xFF6A54, emissive: o.palette.accent, emissiveIntensity: 2.4, roughness: 0.3 })
      };

      function box(w,h,d,m,x,y,z,p){var o2=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);
        o2.position.set(x||0,y||0,z||0);o2.castShadow=HI;p.add(o2);return o2;}
      function cyl(a,b,h,s,m,x,y,z,p){var o2=new THREE.Mesh(new THREE.CylinderGeometry(a,b,h,s),m);
        o2.position.set(x||0,y||0,z||0);o2.castShadow=HI;p.add(o2);return o2;}
      function sph(r,m,x,y,z,p){var o2=new THREE.Mesh(new THREE.SphereGeometry(r,16,12),m);
        o2.position.set(x||0,y||0,z||0);o2.castShadow=HI;p.add(o2);return o2;}
      function grp(x,y,z,p){var g=new THREE.Group();g.position.set(x,y,z);p.add(g);return g;}
      function plate(w,h,d,m,x,y,z,p){box(w+.035,h+.035,d*.9,M.seam,x,y,z-.006,p);return box(w,h,d,m,x,y,z,p);}
      function vents(n,w,h,d,m,x,y,z,st,p,ax){for(var i=0;i<n;i++){var q=(i-(n-1)/2)*st;
        box(w,h,d,m,x+(ax==="x"?q:0),y+(ax==="y"?q:0),z,p);}}

      /* ================= СКЕЛЕТ =================
         Меняете на свою модель здесь: замените этот блок на
         GLTFLoader и достаньте одноимённые кости через
         gltf.scene.getObjectByName('Head' | 'Arm_R' | 'Leg_L' …)
      ========================================== */
      var robot = new THREE.Group(); scene.add(robot);
      var root = grp(0,0,0, robot);
      var hips = grp(0,1.72,0, root);

      plate(.60,.28,.42, M.navy, 0,.05,0, hips);
      plate(.50,.10,.44, M.white,0,.20,0, hips);
      var pelvLed = sph(.045, M.led, 0,.05,.23, hips);
      cyl(.05,.05,.30,8, M.metal, .34,.06,-.10, hips).rotation.z = .25;
      cyl(.05,.05,.30,8, M.metal,-.34,.06,-.10, hips).rotation.z = -.25;

      var spine = grp(0,.24,0, hips);
      plate(.72,.60,.42, M.navy, 0,.34,0, spine);
      plate(.54,.44,.05, M.white,0,.40,.23, spine);
      plate(.30,.13,.04, M.red,  0,.60,.26, spine);
      vents(5,.20,.022,.02,M.seam, 0,.24,.262,.038, spine,"y");
      plate(.74,.20,.40, M.white,0,.70,0, spine);
      box(.18,.07,.42, M.red, 0,.79,0, spine);
      var coreLed = sph(.05, M.eye, 0,.50,.27, spine);

      var neck = grp(0,.88,0, spine);
      cyl(.10,.115,.16,12, M.joint, 0,0,0, neck);
      var head = grp(0,.10,0, neck);
      sph(.265, M.white, 0,.14,0, head);
      box(.30,.05,.28, M.seam, 0,.14,.02, head);
      plate(.26,.09,.05, M.red, 0,.33,.13, head);
      box(.36,.21,.11, M.visor, 0,.10,.20, head).rotation.x = -.13;
      var eye = sph(.05, M.eye, .085,.11,.265, head);
      box(.055,.15,.06, M.navy, -.255,.12,.05, head);
      box(.055,.15,.06, M.navy,  .255,.12,.05, head);

      function makeArm(s){
        var sh = grp(s*.54,.64,0, spine);
        sph(.145, M.joint, 0,0,0, sh);
        plate(.24,.22,.26, M.white, s*.055,.02,0, sh);
        plate(.18,.44,.20, M.white, 0,-.30,0, sh);
        box(.09,.18,.09, M.red, s*.095,-.24,0, sh);
        var el = grp(0,-.55,0, sh);
        sph(.10, M.joint, 0,0,0, el);
        plate(.155,.40,.16, M.navy, 0,-.25,0, el);
        var wr = grp(0,-.49,0, el);
        box(.13,.17,.12, M.rubber, 0,-.10,0, wr);
        box(.045,.12,.10, M.rubber, s*.075,-.12,.02, wr);
        return { sh: sh, el: el, wr: wr };
      }
      var armL = makeArm(-1), armR = makeArm(1);

      function makeLeg(s){
        var hip = grp(s*.19,0,0, hips);
        sph(.15, M.joint, 0,0,0, hip);
        plate(.25,.54,.27, M.white, 0,-.34,0, hip);
        box(.09,.28,.04, M.red, s*.135,-.34,.02, hip);
        cyl(.035,.035,.40,6, M.metal, 0,-.30,-.155, hip);
        var kn = grp(0,-.64,0, hip);
        sph(.12, M.joint, 0,0,0, kn);
        plate(.15,.17,.09, M.navy, 0,0,.135, kn);
        plate(.21,.54,.23, M.navy, 0,-.34,0, kn);
        var an = grp(0,-.64,0, kn);
        sph(.085, M.joint, 0,0,0, an);
        plate(.23,.11,.44, M.white, 0,-.09,.07, an);
        box(.24,.05,.46, M.rubber, 0,-.15,.07, an);
        return { hip: hip, kn: kn, an: an };
      }
      var legL = makeLeg(-1), legR = makeLeg(1);

      if (HI) {
        var floor = new THREE.Mesh(new THREE.PlaneGeometry(20,20), new THREE.ShadowMaterial({ opacity: .34 }));
        floor.rotation.x = -Math.PI/2; floor.receiveShadow = true; scene.add(floor);
      }

      /* ================= АНИМАЦИЯ ================= */
      var REST = { shZ: .13, elX: -.18 };
      var DUR = { wave:2.8, jump:1.75, nod:1.4, scan:3.0, point:2.2, shrug:1.8 };
      var AUTO = ["scan","nod","shrug","wave"];

      var ptr = {x:0,y:0}, hovering=false, act=null, actT=0, actDur=0;
      var yaw=0,yawV=0, pit=0,pitV=0, waveW=0, lastInput=0, idleGap=6+Math.random()*5;
      var blink=0,nextBlink=2.2, sacc=0,nextSacc=1.6, scrollPull=0;

      function play(name){
        if (reduce || !DUR[name]) return;
        act = name; actT = 0; actDur = DUR[name]; lastInput = 0;
      }
      api.play = play;

      function envp(p){ return Math.sin(Math.min(Math.max(p,0),1)*Math.PI); }
      function lerp(a,b,w){ return a+(b-a)*w; }

      function poseWave(w,t){
        var s = Math.sin(t*8.5);
        armR.sh.rotation.z = lerp(armR.sh.rotation.z, 1.98+s*.05, w);
        armR.sh.rotation.x = lerp(armR.sh.rotation.x, -.22, w);
        armR.el.rotation.z = lerp(armR.el.rotation.z, 1.05+s*.32, w);
        armR.wr.rotation.z = lerp(armR.wr.rotation.z, s*.42, w);
        armL.sh.rotation.z = lerp(armL.sh.rotation.z, -.24, w);
        head.rotation.z    = lerp(head.rotation.z, .13, w);
      }

      /* ---- ввод ---- */
      function onMove(e){
        var r = host.getBoundingClientRect();
        // курсор отслеживается по всему окну, а не только над виджетом
        ptr.x = Math.max(-1.6, Math.min(1.6, (e.clientX - (r.left+r.width/2)) / (r.width*0.9)));
        ptr.y = Math.max(-1.2, Math.min(1.2, (e.clientY - (r.top+r.height/2)) / (r.height*0.9)));
        lastInput = 0;
      }
      function onEnter(){ hovering = true; }
      function onLeave(){ hovering = false; }
      function onDown(){ play("jump"); }
      var lastScroll = window.scrollY, scrollTimer = 0;
      function onScroll(){
        var d = window.scrollY - lastScroll; lastScroll = window.scrollY;
        scrollPull = Math.max(-1, Math.min(1, d/60));
        scrollTimer = 0.5; lastInput = 0;
      }

      window.addEventListener("pointermove", onMove, { passive: true });
      host.addEventListener("pointerenter", onEnter);
      host.addEventListener("pointerleave", onLeave);
      host.addEventListener("pointerdown", onDown);
      if (o.reactToScroll) window.addEventListener("scroll", onScroll, { passive: true });

      /* ---- размер ---- */
      function resize(){
        var w = host.clientWidth, h = host.clientHeight;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        camera.aspect = w/h; camera.updateProjectionMatrix();
        camera.position.set(.9, 2.1, h < 300 ? 10.6 : 9.6);
        camera.lookAt(0, 1.62, 0);
      }
      var ro = new ResizeObserver(resize); ro.observe(host); resize();

      /* ---- пауза, когда виджет вне экрана или вкладка неактивна ---- */
      var onScreen = true, tabVisible = !document.hidden, running = false;
      var io = new IntersectionObserver(function(es){
        onScreen = es[0].isIntersecting; sync();
      }, { threshold: 0.01 });
      io.observe(host);
      document.addEventListener("visibilitychange", function(){ tabVisible = !document.hidden; sync(); });
      function sync(){
        var should = onScreen && tabVisible;
        if (should === running) return;
        running = should;
        renderer.setAnimationLoop(should ? tick : null);
      }

      /* ---- цикл ---- */
      var clock = new THREE.Clock();
      function tick(){
        var dt = Math.min(clock.getDelta(), .05), t = clock.elapsedTime;
        lastInput += dt;
        if (scrollTimer > 0) { scrollTimer -= dt; if (scrollTimer <= 0) scrollPull = 0; }

        var tY = ptr.x*.62, tP = ptr.y*.30 + scrollPull*.22;
        yawV += (tY-yaw)*42*dt; yawV *= Math.pow(.055,dt); yaw += yawV*dt;
        pitV += (tP-pit)*42*dt; pitV *= Math.pow(.055,dt); pit += pitV*dt;

        var servo = reduce ? 0 : Math.sin(t*23.7)*.0035 + Math.sin(t*17.1)*.0028;
        head.rotation.set(pit, yaw+servo, 0);
        spine.rotation.set(0, yaw*.30, 0);
        hips.rotation.y = yaw*.10;

        var sway = reduce ? 0 : Math.sin(t*.58);
        armR.sh.rotation.set(-sway*.085, 0,  REST.shZ);
        armL.sh.rotation.set( sway*.085, 0, -REST.shZ);
        armR.el.rotation.set(REST.elX - sway*.05, 0, 0);
        armL.el.rotation.set(REST.elX + sway*.05, 0, 0);
        armR.wr.rotation.set(0,0,0); armL.wr.rotation.set(0,0,0);

        if (!reduce){
          hips.position.y = 1.72 + Math.sin(t*1.5)*.020;
          hips.position.x = sway*.032;
          spine.rotation.z = Math.sin(t*.58+.5)*.024;
          spine.scale.y = 1 + Math.sin(t*1.5)*.009;
          coreLed.material.emissiveIntensity = 2.4 + Math.sin(t*2.1)*1.0;
          pelvLed.material.emissiveIntensity = 2.0 + Math.sin(t*1.3+1)*.8;

          nextBlink -= dt;
          if (nextBlink <= 0){ blink = .12; nextBlink = 1.9+Math.random()*3.8; }
          if (blink > 0){ blink -= dt; eye.scale.set(1,.1,1); } else eye.scale.set(1,1,1);
          nextSacc -= dt;
          if (nextSacc <= 0){ sacc = (Math.random()-.5)*.10; nextSacc = 1.2+Math.random()*2.4; }
          eye.position.x += (.085+sacc-eye.position.x)*Math.min(dt*8,1);
        }

        if (o.autoGestures && !act && !reduce && lastInput > idleGap){
          play(AUTO[Math.floor(Math.random()*AUTO.length)]);
          idleGap = 8+Math.random()*8;
        }

        var tW = (hovering && !act && !reduce) ? 1 : 0;
        waveW += (tW-waveW)*Math.min(dt*3.4,1);
        if (waveW > .002) poseWave(waveW, t);

        if (act){
          actT += dt; var p = actT/actDur, e = envp(p), k;
          if (act === "wave") poseWave(e, t);
          else if (act === "nod"){ head.rotation.x += Math.sin(p*Math.PI*2)*.30; }
          else if (act === "scan"){
            head.rotation.y += Math.sin(p*Math.PI*2)*.95;
            eye.material.emissiveIntensity = 3 + e*2.5;
          }
          else if (act === "point"){
            armR.sh.rotation.x = lerp(armR.sh.rotation.x, -1.42, e);
            armR.sh.rotation.z = lerp(armR.sh.rotation.z, .34, e);
            spine.rotation.y += e*.18; head.rotation.y += e*.22;
          }
          else if (act === "shrug"){
            armR.sh.rotation.z = lerp(armR.sh.rotation.z, .62, e);
            armL.sh.rotation.z = lerp(armL.sh.rotation.z, -.62, e);
            armR.el.rotation.x = lerp(armR.el.rotation.x, -.95, e);
            armL.el.rotation.x = lerp(armL.el.rotation.x, -.95, e);
            head.rotation.x += e*.12;
          }
          else if (act === "jump"){
            var crouch=0, air=0, tuck=0, armX=0, spread=0;
            if (p < .20){ k = p/.20; k*=k; crouch = k; armX = k*.95; }
            else if (p < .32){ k = (p-.20)/.12; crouch = 1-k*1.35; armX = .95-k*3.10; }
            else if (p < .76){ k = (p-.32)/.44; air = Math.sin(k*Math.PI);
              tuck = air*1.05; armX = -2.15+k*.30; spread = air*.30; }
            else if (p < .90){ k = (p-.76)/.14; crouch = Math.sin(k*Math.PI)*1.25;
              armX = -.85*(1-k)+k*.30; spread = .35*Math.sin(k*Math.PI); }
            else { k = (p-.90)/.10; crouch = .22*(1-k)*Math.cos(k*Math.PI*2); armX = .30*(1-k); }

            // бедро −a, колено +2a, стопа −a: ступня плоская, корпус
            // опускается ровно на укорочение ноги — ноги не тонут в полу
            var a = Math.max(0,crouch)*.62, drop = 1.28*(1-Math.cos(a));
            legR.hip.rotation.x = legL.hip.rotation.x = -a - tuck*.85;
            legR.kn.rotation.x  = legL.kn.rotation.x  = 2*a + tuck*1.30;
            legR.an.rotation.x  = legL.an.rotation.x  = -a - tuck*.35;
            root.position.y = air*1.15 - drop + Math.max(0,-crouch)*.12;

            var eb = REST.elX*(1-Math.min(Math.abs(armX)/2.2,1));
            armR.sh.rotation.x = armL.sh.rotation.x = armX;
            armR.sh.rotation.z =  REST.shZ + spread;
            armL.sh.rotation.z = -REST.shZ - spread;
            armR.el.rotation.x = armL.el.rotation.x = eb;
            spine.rotation.x = Math.max(0,crouch)*.30 - air*.10;
            spine.scale.y = 1 - Math.max(0,crouch)*.05 + air*.04;
            head.rotation.x += -Math.max(0,crouch)*.18 + air*.12;
          }

          if (actT >= actDur){
            act = null; lastInput = 0;
            root.position.set(0,0,0);
            legL.hip.rotation.x = legR.hip.rotation.x = 0;
            legL.kn.rotation.x  = legR.kn.rotation.x  = 0;
            legL.an.rotation.x  = legR.an.rotation.x  = 0;
            eye.material.emissiveIntensity = 3;
          }
        }

        renderer.render(scene, camera);
      }

      sync();
      if (o.greetOnLoad && !reduce) setTimeout(function(){ play("wave"); }, 700);

      api.ready = true;
      api.destroy = function(){
        renderer.setAnimationLoop(null);
        ro.disconnect(); io.disconnect();
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("scroll", onScroll);
        host.removeEventListener("pointerenter", onEnter);
        host.removeEventListener("pointerleave", onLeave);
        host.removeEventListener("pointerdown", onDown);
        scene.traverse(function(n){
          if (n.isMesh){ n.geometry.dispose();
            (Array.isArray(n.material) ? n.material : [n.material]).forEach(function(m){ m.dispose(); }); }
        });
        renderer.dispose();
        host.innerHTML = "";
      };
      if (o.onReady) o.onReady(api);
    }

    return api;
  }

  return { mount: mount, version: "1.0.0" };
});
