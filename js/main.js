/* ai_vedeolarr — sayt effektlari va interaktivlik */
(function(){
  window.__fx=1;var d=document,root=d.documentElement,body=d.body;
  var T=window.T||{},TG='jamshedabulqosimov';
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $(id){return d.getElementById(id)}
  function $$(s,c){return [].slice.call((c||d).querySelectorAll(s))}
  function sstore(k,v){try{if(v===undefined)return sessionStorage.getItem(k);sessionStorage.setItem(k,v)}catch(e){return null}}
  function store(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}}

  /* toast */
  var toastEl=$('toast'),tt;
  function toast(m){if(!toastEl)return;toastEl.textContent=m;toastEl.classList.add('show');clearTimeout(tt);tt=setTimeout(function(){toastEl.classList.remove('show')},4200)}

  /* ---------- hero sarlavha sig'dirish ---------- */
  function fitH1(){var h=d.querySelector('.hero h1');if(!h)return;h.style.fontSize='';var cs=parseFloat(getComputedStyle(h).fontSize),w=h.clientWidth,m=0;
    $$('.ln>span',h).forEach(function(s){m=Math.max(m,s.scrollWidth)});if(m>w)h.style.fontSize=(cs*w/m*.97)+'px'}
  addEventListener('resize',fitH1);if(d.fonts&&d.fonts.ready)d.fonts.ready.then(fitH1);fitH1();

  /* ---------- intro ---------- */
  var leader=$('leader'),started=false;
  function start(){if(started)return;started=true;if(leader)leader.classList.add('done');sstore('seenLeader','1');
    requestAnimationFrame(function(){requestAnimationFrame(function(){root.classList.add('go')})})}
  if(leader&&!reduce&&!sstore('seenLeader')){
    root.classList.add('intro');
    var num=$('leaderNum'),t0=performance.now(),step=480,n=3;
    leader.addEventListener('click',start);
    d.addEventListener('keydown',function k(){start();d.removeEventListener('keydown',k)});
    (function tick(now){if(started)return;var e=now-t0,c=3-Math.floor(e/step);leader.firstElementChild.style.setProperty('--sweep',((e%step)/step*360)+'deg');if(c!==n&&c>0){n=c;num.textContent=n}if(c<=0){start();return}requestAnimationFrame(tick)})(t0);
  }else start();

  /* ---------- nav ---------- */
  var nav=$('nav'),bar=$('progress'),dock=$('dock'),isHome=body.classList.contains('home');
  function onScroll(){
    var y=scrollY,h=root.scrollHeight-innerHeight;
    nav.classList.toggle('solid',y>40);if(bar)bar.style.width=(h>0?y/h*100:0)+'%';
    if(dock&&isHome)dock.classList.toggle('show',y>innerHeight*.6);
  }
  addEventListener('scroll',onScroll,{passive:true});onScroll();
  var burger=$('burger');
  function setMenu(o){body.classList.toggle('menu-open',o);burger.setAttribute('aria-expanded',o);body.style.overflow=o?'hidden':''}
  if(burger){burger.addEventListener('click',function(){setMenu(!body.classList.contains('menu-open'))});
    $$('#sheet a').forEach(function(a){a.addEventListener('click',function(){setMenu(false)})})}

  /* ---------- scroll reveal ---------- */
  if('IntersectionObserver' in window&&!reduce){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('on');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px'});
    $$('.rv').forEach(function(x){io.observe(x)});
  }else $$('.rv').forEach(function(x){x.classList.add('on')});

  /* ---------- demo: matndan kadrgacha ---------- */
  var shot=$('shot');
  if(shot){
    var ptxt=$('ptxt'),shotImg=$('shotImg'),shotTag=$('shotTag'),picks=$$('.pick'),di=0,typer,advance,paused=false,demoStarted=false;
    picks.forEach(function(b,i){b.addEventListener('click',function(){paused=true;runDemo(i)})});
    function runDemo(i){
      di=i;clearTimeout(typer);clearTimeout(advance);
      picks.forEach(function(b,j){b.setAttribute('aria-pressed',j===i)});
      var txt=picks[i].getAttribute('data-prompt'),p=0;
      shotImg.alt=txt;shot.classList.add('rendering');shotTag.textContent=T.render;shotImg.src=picks[i].getAttribute('data-src');
      if(reduce){ptxt.textContent=txt;shot.classList.remove('rendering');shotTag.textContent=T.done;return}
      ptxt.textContent='';
      (function type(){ptxt.textContent=txt.slice(0,++p);if(p<txt.length)typer=setTimeout(type,24+Math.random()*28);else typer=setTimeout(function(){shot.classList.remove('rendering');shotTag.textContent=T.done;if(!paused)advance=setTimeout(function(){runDemo((di+1)%picks.length)},4800)},350)})();
    }
    new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting&&!demoStarted){demoStarted=true;runDemo(0)}})},{threshold:.35}).observe(shot);
  }

  /* ---------- kinoteka ---------- */
  var gal=$('gal');
  if(gal){
    var items=$$('.gi',gal),more=$('more'),cur='all',step=+gal.getAttribute('data-step')||12,shown=step,list=[];
    function render(anim){
      list=items.filter(function(f){return cur==='all'||f.getAttribute('data-g')===cur});
      items.forEach(function(f){f.hidden=true;f.classList.remove('in')});
      list.forEach(function(f,i){if(i<shown){f.hidden=false;if(anim){f.classList.add('in');f.style.animationDelay=(Math.min(i,11)*35)+'ms'}}});
      if(more)more.style.display=list.length>shown?'':'none';
    }
    $$('.flt').forEach(function(b){b.addEventListener('click',function(){cur=b.getAttribute('data-f');shown=step;$$('.flt').forEach(function(x){x.setAttribute('aria-pressed',x===b)});render(true)})});
    if(more)more.addEventListener('click',function(){var from=shown;shown+=step;render(false);list.slice(from,shown).forEach(function(f,i){f.classList.add('in');f.style.animationDelay=(i*35)+'ms'})});
    render(false);
    var lb=$('lb'),lbImg=$('lbImg'),lbG=$('lbG'),li=0,lastFocus;
    function vis(){return list.filter(function(f){return !f.hidden})}
    function showLb(i){var v=vis();li=(i+v.length)%v.length;var im=v[li].querySelector('img');lbImg.src=im.src;lbImg.alt=im.alt;lbG.textContent=v[li].querySelector('figcaption').textContent}
    function openLb(i){lastFocus=d.activeElement;showLb(i);lb.classList.add('open');body.style.overflow='hidden';$('lbX').focus()}
    function closeLb(){lb.classList.remove('open');body.style.overflow='';lastFocus&&lastFocus.focus()}
    items.forEach(function(f){f.setAttribute('tabindex','0');f.setAttribute('role','button');
      f.addEventListener('click',function(){openLb(vis().indexOf(f))});
      f.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();openLb(vis().indexOf(f))}})});
    $('lbX').addEventListener('click',closeLb);$('lbP').addEventListener('click',function(){showLb(li-1)});$('lbN').addEventListener('click',function(){showLb(li+1)});
    lb.addEventListener('click',function(e){if(e.target===lb)closeLb()});
    var tx=0;lb.addEventListener('touchstart',function(e){tx=e.touches[0].clientX},{passive:true});
    lb.addEventListener('touchend',function(e){var dx=e.changedTouches[0].clientX-tx;if(Math.abs(dx)>50)showLb(li+(dx<0?1:-1))});
    d.addEventListener('keydown',function(e){if(!lb.classList.contains('open'))return;if(e.key==='Escape')closeLb();if(e.key==='ArrowRight')showLb(li+1);if(e.key==='ArrowLeft')showLb(li-1)});
  }
  d.addEventListener('keydown',function(e){if(e.key==='Escape'&&burger)setMenu(false)});

  /* ---------- xizmatlar akkordeoni ---------- */
  $$('.svc>li').forEach(function(li,i,all){
    var b=li.querySelector('.svc-btn');
    b.addEventListener('click',function(){var o=!li.classList.contains('open');all.forEach(function(x){x.classList.remove('open');x.querySelector('.svc-btn').setAttribute('aria-expanded','false')});
      if(o){li.classList.add('open');b.setAttribute('aria-expanded','true')}});
  });

  /* ---------- loyiha chiptasi (forma) ---------- */
  var form=$('brief');
  if(form){
    var fName=$('f-name'),fMsg=$('f-msg'),fCon=$('f-contact'),err=$('err');
    var svcChips=$$('#chips .chip'),whenChips=$$('#when .chip');
    function saveDraft(){store('brief3',JSON.stringify({n:fName.value,m:fMsg.value,c:fCon.value,s:svcChips.map(function(c){return c.getAttribute('aria-pressed')==='true'}),w:whenChips.map(function(c){return c.getAttribute('aria-pressed')==='true'})}))}
    try{var dr=JSON.parse(store('brief3')||'null');if(dr){fName.value=dr.n||'';fMsg.value=dr.m||'';fCon.value=dr.c||'';(dr.s||[]).forEach(function(v,i){svcChips[i]&&svcChips[i].setAttribute('aria-pressed',!!v)});(dr.w||[]).forEach(function(v,i){whenChips[i]&&whenChips[i].setAttribute('aria-pressed',!!v)})}}catch(e){}
    svcChips.forEach(function(c){c.addEventListener('click',function(){c.setAttribute('aria-pressed',c.getAttribute('aria-pressed')!=='true');err.textContent='';saveDraft()})});
    whenChips.forEach(function(c){c.addEventListener('click',function(){var on=c.getAttribute('aria-pressed')!=='true';whenChips.forEach(function(x){x.setAttribute('aria-pressed','false')});c.setAttribute('aria-pressed',on);saveDraft()})});
    [fName,fMsg,fCon].forEach(function(i){i.addEventListener('input',function(){saveDraft();err.textContent=''})});
    function pick(i){if(svcChips[i]){svcChips[i].setAttribute('aria-pressed','true');saveDraft();toast(T.added.replace('{x}',svcChips[i].textContent))}}
    try{var q=new URLSearchParams(location.search).get('xizmat');if(q!==null&&q!=='')pick(+q)}catch(e){}
    d.addEventListener('click',function(e){var p=e.target.closest('[data-pick]');if(!p)return;e.preventDefault();pick(+p.getAttribute('data-pick'));
      $('chipta').scrollIntoView({behavior:reduce?'auto':'smooth'});setTimeout(function(){fName.focus({preventScroll:true})},700)});
    function copy(text){if(navigator.clipboard&&window.isSecureContext)return navigator.clipboard.writeText(text).then(function(){return true},function(){return legacy(text)});return Promise.resolve(legacy(text))}
    function legacy(text){try{var ta=d.createElement('textarea');ta.value=text;ta.setAttribute('readonly','');ta.style.position='fixed';ta.style.opacity='0';body.appendChild(ta);ta.select();var ok=d.execCommand('copy');ta.remove();return ok}catch(e){return false}}
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var name=fName.value.trim(),msg=fMsg.value.trim(),c=fCon.value.trim();
      var sel=svcChips.filter(function(x){return x.getAttribute('aria-pressed')==='true'}).map(function(x){return x.textContent});
      var wh=whenChips.filter(function(x){return x.getAttribute('aria-pressed')==='true'}).map(function(x){return x.textContent})[0];
      if(!name){err.textContent=T.e_name;fName.focus();return}
      if(!sel.length&&!msg){err.textContent=T.e_need;return}
      err.textContent='';
      var lines=[T.m_hi,'',T.m_name+': '+name];
      if(sel.length)lines.push(T.m_svc+': '+sel.join(', '));
      if(msg)lines.push(T.m_msg+': '+msg);
      if(wh)lines.push(T.m_when+': '+wh);
      if(c)lines.push(T.m_con+': '+c);
      var text=lines.join('\n');
      var a=d.createElement('a');a.href='https://t.me/'+TG+'?text='+encodeURIComponent(text);a.target='_blank';a.rel='noopener';body.appendChild(a);a.click();a.remove();
      copy(text).then(function(ok){toast(ok?T.copied:T.opened)});
    });
  }

  /* ---------- ulashish ---------- */
  var share=$('share');
  if(share)share.addEventListener('click',function(){
    var url=location.href.split('#')[0];
    if(navigator.share)navigator.share({title:d.title,url:url}).catch(function(){});
    else (navigator.clipboard?navigator.clipboard.writeText(url):Promise.reject()).then(function(){toast(T.shared)},function(){toast(T.share_no)});
  });

  /* ---------- tushayotgan zarrachalar ---------- */
  (function(){
    var c=$('dust');if(!c)return;var x=c.getContext('2d'),W,H,dpr=Math.min(devicePixelRatio||1,1.5),P=[],run=true;
    function size(){W=innerWidth;H=innerHeight;c.width=W*dpr;c.height=H*dpr;x.setTransform(dpr,0,0,dpr,0,0);var n=Math.round(Math.min(80,Math.max(30,W*H/17000)));while(P.length<n)P.push(mk(true));P.length=n}
    function mk(any){var big=Math.random()<.12;return{x:Math.random()*W,y:any?Math.random()*H:-20,r:big?2.2+Math.random()*2.6:.6+Math.random()*1.4,v:big?.25+Math.random()*.35:.35+Math.random()*.8,s:Math.random()*6.28,a:big?.18+Math.random()*.2:.35+Math.random()*.5,big:big,k:Math.random()}}
    function frame(){
      if(!run)return;x.clearRect(0,0,W,H);
      for(var i=0;i<P.length;i++){var p=P[i];p.y+=p.v;p.s+=.012;p.x+=Math.sin(p.s)*.35;if(p.y>H+20)P[i]=p=mk(false);
        x.beginPath();x.fillStyle=p.k<.6?'rgba(226,184,76,'+p.a+')':(p.k<.85?'rgba(196,181,253,'+p.a+')':'rgba(243,236,226,'+p.a+')');
        if(p.big){x.shadowBlur=12;x.shadowColor=p.k<.6?'rgba(226,184,76,.6)':'rgba(139,92,246,.6)'}else x.shadowBlur=0;
        x.arc(p.x,p.y,p.r,0,6.283);x.fill()}
      requestAnimationFrame(frame);
    }
    size();addEventListener('resize',size);if(reduce)return;
    d.addEventListener('visibilitychange',function(){run=!d.hidden;if(run)frame()});frame();
  })();


  /* ---------- rangli ko'lmak: tegilgan joydan ekran chetigacha tarqaladigan to'lqinlar ---------- */
  (function(){
    if(reduce)return;
    var c=d.createElement('canvas');c.id='ripple';c.setAttribute('aria-hidden','true');body.appendChild(c);
    var x=c.getContext('2d'),W,H,dpr=Math.min(devicePixelRatio||1,2),R=[],run=false,DUR=1700;
    var COLS=['246,220,140','226,184,76','167,139,250','236,72,153','56,189,248'];
    function size(){W=innerWidth;H=innerHeight;c.width=W*dpr;c.height=H*dpr;x.setTransform(dpr,0,0,dpr,0,0)}
    size();addEventListener('resize',size);
    function ease(t){return 1-Math.pow(1-t,3)}
    addEventListener('pointerdown',function(e){
      if(e.button>0)return;
      var px=e.clientX,py=e.clientY,max=Math.hypot(Math.max(px,W-px),Math.max(py,H-py));
      var drops=[];for(var i=0;i<10;i++){var a=Math.random()*6.283,v=.18+Math.random()*.35;drops.push({a:a,v:v,s:2+Math.random()*3,c:COLS[i%COLS.length]})}
      R.push({x:px,y:py,t:performance.now(),max:max,rot:Math.random()*6.283,drops:drops});
      if(R.length>6)R.shift();
      if(!run){run=true;requestAnimationFrame(frame)}
    },{passive:true});
    function ringStyle(r,rr,a){
      if(x.createConicGradient){var g=x.createConicGradient(r.rot+rr/180,r.x,r.y);
        g.addColorStop(0,'rgba(246,220,140,'+a+')');g.addColorStop(.25,'rgba(167,139,250,'+a+')');g.addColorStop(.5,'rgba(236,72,153,'+a+')');
        g.addColorStop(.75,'rgba(56,189,248,'+a+')');g.addColorStop(1,'rgba(246,220,140,'+a+')');return g}
      return 'rgba(226,184,76,'+a+')';
    }
    function frame(now){
      x.clearRect(0,0,W,H);x.globalCompositeOperation='lighter';
      R=R.filter(function(r){return now-r.t<DUR+400});
      R.forEach(function(r){
        var p=(now-r.t)/DUR;
        /* ko'lmak: yumshoq rangli dog' */
        var pp=Math.min(p,1),rad=Math.max(1,r.max*.55*ease(pp)),fa=.32*(1-pp);
        if(fa>0){var g=x.createRadialGradient(r.x,r.y,0,r.x,r.y,rad);
          g.addColorStop(0,'rgba(246,220,140,'+fa+')');g.addColorStop(.45,'rgba(139,92,246,'+fa*.8+')');g.addColorStop(1,'rgba(236,72,153,0)');
          x.fillStyle=g;x.beginPath();x.arc(r.x,r.y,rad,0,6.283);x.fill()}
        /* to'lqin halqalari — narigi chetgacha */
        for(var k=0;k<4;k++){var pk=(p-k*.1)/(1-k*.1);if(pk<=0||pk>=1)continue;
          var rr=r.max*ease(pk),a=(1-pk)*(k===0?.75:.5);
          x.lineWidth=(1-pk)*(k===0?16:9)+1.5;x.strokeStyle=ringStyle(r,rr,a);
          x.beginPath();x.arc(r.x,r.y,rr,0,6.283);x.stroke()}
        /* sachragan tomchilar */
        if(p<.8)r.drops.forEach(function(dp){var dist=ease(p/.8)*dp.v*r.max*.35,da=(1-p/.8)*.9;
          x.fillStyle='rgba('+dp.c+','+da+')';x.beginPath();x.arc(r.x+Math.cos(dp.a)*dist,r.y+Math.sin(dp.a)*dist,dp.s*(1-p*.6),0,6.283);x.fill()});
      });
      if(R.length)requestAnimationFrame(frame);else{run=false;x.clearRect(0,0,W,H)}
    }
  })();

  /* ---------- 3D kino lentalari (faqat bosh sahifa) ---------- */
  var canvas=$('stage');
  if(canvas&&!reduce){
    var go3d=function(){var s=d.createElement('script');s.src=canvas.getAttribute('data-three');s.onload=stage3d;d.body.appendChild(s)};
    var later=function(){(window.requestIdleCallback||function(f){setTimeout(f,300)})(go3d)};
    if(d.readyState==='complete')later();else addEventListener('load',later);
  }
  function stage3d(){
    if(!window.THREE)return;var renderer;
    try{renderer=new THREE.WebGLRenderer({canvas:canvas,alpha:true,antialias:true,powerPreference:'high-performance'})}catch(e){return}
    renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));
    var scene=new THREE.Scene();scene.fog=new THREE.Fog(0x0b0a10,10,24);
    var cam=new THREE.PerspectiveCamera(36,1,.1,100),group=new THREE.Group();scene.add(group);
    var fr=JSON.parse(canvas.getAttribute('data-frames'));
    function load(list){return Promise.all(list.map(function(u){return new Promise(function(res){var im=new Image();im.onload=function(){res(im)};im.onerror=function(){res(null)};im.src=u})}))}
    function strip(imgs){
      var cw=210,ch=300,cv=d.createElement('canvas');cv.width=cw*imgs.length;cv.height=ch;var g=cv.getContext('2d');
      g.fillStyle='#0a0910';g.fillRect(0,0,cv.width,ch);
      imgs.forEach(function(im,i){var x0=i*cw;
        for(var h=0;h<8;h++){var hx=x0+8+h*25.5;g.clearRect(hx,12,15,16);g.clearRect(hx,ch-28,15,16)}
        if(!im)return;var fx=x0+10,fy=44,fw=cw-20,fh=ch-88,s=Math.max(fw/im.width,fh/im.height),sw=fw/s,sh=fh/s;
        g.drawImage(im,(im.width-sw)/2,(im.height-sh)/2,sw,sh,fx,fy,fw,fh);
        var gr=g.createLinearGradient(0,fy,0,fy+fh);gr.addColorStop(0,'rgba(226,184,76,.10)');gr.addColorStop(1,'rgba(60,20,120,.22)');g.fillStyle=gr;g.fillRect(fx,fy,fw,fh)});
      var t=new THREE.CanvasTexture(cv);t.anisotropy=renderer.capabilities.getMaxAnisotropy();t.wrapS=THREE.RepeatWrapping;return t;
    }
    function ring(tex,n,h){var r=n*h*(210/300)/(2*Math.PI);return new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,120,1,true),new THREE.MeshBasicMaterial({map:tex,side:THREE.DoubleSide,transparent:true,alphaTest:.02}))}
    Promise.all([load(fr.a),load(fr.b)]).then(function(r){
      var A=ring(strip(r[0]),r[0].length,2.3),B=ring(strip(r[1]),r[1].length,1.5),gA=new THREE.Group(),gB=new THREE.Group();
      gA.add(A);gB.add(B);gA.rotation.set(.16,0,-.1);gB.rotation.set(1.05,0,.55);group.add(gA);group.add(gB);
      var px=0,py=0,tpx=0,tpy=0,boost=0,lastY=scrollY,visible=true,running=false;
      addEventListener('pointermove',function(e){tpx=e.clientX/innerWidth-.5;tpy=e.clientY/innerHeight-.5},{passive:true});
      addEventListener('scroll',function(){boost=Math.min(.06,boost+Math.abs(scrollY-lastY)*.0004);lastY=scrollY},{passive:true});
      function resize(){var w=canvas.clientWidth,h=canvas.clientHeight;renderer.setSize(w,h,false);cam.aspect=w/h;
        var portrait=w/h<.9,wide=w/h>1.25;cam.position.set(0,portrait?1.2:1.4,portrait?17.5:12.5);cam.lookAt(0,portrait?-.4:-.9,0);
        group.position.set(wide?2.4:0,portrait?3.5:1.2,0);cam.updateProjectionMatrix()}
      resize();addEventListener('resize',resize);
      function draw(){px+=(tpx-px)*.04;py+=(tpy-py)*.04;A.rotation.y+=.0022+boost;B.rotation.y-=.0034+boost*1.3;boost*=.94;group.rotation.x=py*.18;group.rotation.y=px*.3;renderer.render(scene,cam)}
      function loop(){if(running)return;running=true;(function f(){if(!visible||d.hidden){running=false;return}draw();requestAnimationFrame(f)})()}
      new IntersectionObserver(function(es){visible=es[0].isIntersecting;if(visible)loop()}).observe(canvas.parentNode);
      d.addEventListener('visibilitychange',function(){if(!d.hidden&&visible)loop()});
      draw();root.classList.add('has3d');loop();
    });
  }
})();
