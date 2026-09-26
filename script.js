const $ = (s, p=document) => p.querySelector(s);
const $$ = (s, p=document) => [...p.querySelectorAll(s)];

document.addEventListener("DOMContentLoaded", () => {
  const loader = $("#loader"), pct = $("#loadPct"), line = $(".loader-line i");
  let n = 0;
  const timer = setInterval(() => {
    n += Math.floor(Math.random()*9)+4;
    if(n >= 100){ n=100; clearInterval(timer); setTimeout(()=>loader.classList.add("done"),350); }
    pct.textContent=n; line.style.width=n+"%";
  },55);

  $("#year").textContent = new Date().getFullYear();

  const nav = $("#nav"), toTop = $("#toTop");
  const onScroll = () => {
    nav.classList.toggle("scrolled", scrollY > 40);
    toTop.classList.toggle("show", scrollY > 700);
  };
  addEventListener("scroll", onScroll, {passive:true}); onScroll();
  toTop.onclick=()=>scrollTo({top:0,behavior:"smooth"});

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add("visible"); observer.unobserve(e.target); }});
  }, {threshold:.12});
  $$(".reveal").forEach(el=>observer.observe(el));

  // Magnetic micro-interactions
  $$(".magnetic").forEach(el => {
    el.addEventListener("mousemove", e => {
      if(matchMedia("(pointer:fine)").matches){
        const r=el.getBoundingClientRect(), x=e.clientX-r.left-r.width/2, y=e.clientY-r.top-r.height/2;
        el.style.transform=`translate(${x*.12}px,${y*.12}px)`;
      }
    });
    el.addEventListener("mouseleave",()=>el.style.transform="");
  });

  // Custom cursor
  if(matchMedia("(pointer:fine)").matches){
    const dot=$(".cursor-dot"), ring=$(".cursor-ring");
    let mx=innerWidth/2,my=innerHeight/2,rx=mx,ry=my;
    addEventListener("mousemove",e=>{mx=e.clientX;my=e.clientY;dot.style.left=mx+"px";dot.style.top=my+"px"});
    const loop=()=>{rx+=(mx-rx)*.13;ry+=(my-ry)*.13;ring.style.left=rx+"px";ring.style.top=ry+"px";requestAnimationFrame(loop)}; loop();
    $$("a,button,.project-card,.stack-card,.portrait-frame").forEach(el=>{
      el.addEventListener("mouseenter",()=>ring.classList.add("hover"));
      el.addEventListener("mouseleave",()=>ring.classList.remove("hover"));
    });
  }

  // 3D tilt
  $$(".tilt").forEach(card=>{
    card.addEventListener("mousemove",e=>{
      if(!matchMedia("(pointer:fine)").matches)return;
      const r=card.getBoundingClientRect(), x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
      card.style.transform=`perspective(1200px) rotateY(${x*3}deg) rotateX(${-y*3}deg) translateY(-3px)`;
    });
    card.addEventListener("mouseleave",()=>card.style.transform="");
  });

  // Canvas particle field
  const canvas=$("#particles"), ctx=canvas.getContext("2d"); let w,h,dpr,pts=[];
  const resize=()=>{dpr=Math.min(devicePixelRatio||1,2);w=canvas.clientWidth;h=canvas.clientHeight;canvas.width=w*dpr;canvas.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);pts=Array.from({length:75},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.25,vy:(Math.random()-.5)*.25,r:Math.random()*1.5+.3}))};
  resize(); addEventListener("resize",resize);
  const draw=()=>{
    ctx.clearRect(0,0,w,h);
    pts.forEach((p,i)=>{
      p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>w)p.vx*=-1;if(p.y<0||p.y>h)p.vy*=-1;
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle="rgba(215,255,70,.55)";ctx.fill();
      for(let j=i+1;j<pts.length;j++){const q=pts[j],dx=p.x-q.x,dy=p.y-q.y,dist=Math.hypot(dx,dy);if(dist<120){ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.strokeStyle=`rgba(215,255,70,${(1-dist/120)*.10})`;ctx.stroke()}}
    }); requestAnimationFrame(draw);
  }; draw();

  // Subtle hero parallax
  addEventListener("mousemove",e=>{
    if(!matchMedia("(pointer:fine)").matches)return;
    const x=(e.clientX/innerWidth-.5), y=(e.clientY/innerHeight-.5);
    $(".orbit-a").style.transform=`translate(${x*20}px,${y*20}px)`;
    $(".orbit-b").style.transform=`translate(${x*-15}px,${y*-15}px)`;
  });
});
