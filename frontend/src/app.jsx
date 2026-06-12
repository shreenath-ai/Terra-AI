/**
 * ████████╗███████╗██████╗ ██████╗  █████╗      █████╗ ██╗
 * TERRA AI — AURORA BENTO EDITION v4.0
 * Design: Aurora Dark × Bento Grid × Custom Cursor × Magnetic UI
 * Stack: React + Recharts + Space Grotesk + Inter + JetBrains Mono
 */
import React, { useState, useEffect, useRef } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

// ── DESIGN TOKENS ──────────────────────────────────────────
const D = {
  bg:  '#050818', bg1: '#080d1a', bg2: '#0c1224',
  v:   '#7c3aed', vl:  '#a78bfa',   // violet
  c:   '#06b6d4',                   // cyan
  g:   '#10b981',                   // emerald
  o:   '#f97316',                   // orange
  pk:  '#ec4899',                   // pink
  tx:  '#f1f5f9', t2: '#94a3b8', t3: '#475569',
  bd:  'rgba(255,255,255,0.06)',
};

const OWM = "066e3fd9d58a6c4d71f945816207c9b2";

// ── MOCK DATA ──────────────────────────────────────────────
const YIELD_DATA = [
  {m:'J',p:5.2,a:4.9,o:6.0},{m:'F',p:5.8,a:5.6,o:6.2},{m:'M',p:6.4,a:6.1,o:6.8},
  {m:'A',p:7.1,a:6.9,o:7.4},{m:'M',p:7.8,a:7.5,o:8.0},{m:'J',p:8.2,a:8.0,o:8.5},
  {m:'J',p:8.5,a:8.3,o:8.8},{m:'A',p:8.1,a:7.9,o:8.4},{m:'S',p:7.4,a:7.2,o:7.8},
  {m:'O',p:6.8,a:6.5,o:7.1},{m:'N',p:6.1,a:5.8,o:6.4},{m:'D',p:5.5,a:5.3,o:5.9},
];
const CLIMATE_DATA = [
  {t:'00',temp:24,hum:62,rain:0},{t:'03',temp:22,hum:68,rain:0},
  {t:'06',temp:21,hum:72,rain:5},{t:'09',temp:27,hum:58,rain:2},
  {t:'12',temp:34,hum:45,rain:0},{t:'15',temp:36,hum:40,rain:0},
  {t:'18',temp:31,hum:52,rain:8},{t:'21',temp:26,hum:65,rain:3},
];
const SOIL_DATA = [
  {m:'N',v:78},{m:'P',v:62},{m:'K',v:85},{m:'pH',v:70},{m:'H₂O',v:55},{m:'OM',v:48},
];
const HYDRO_DATA = [
  {z:'A',use:4200,opt:4000},{z:'B',use:3100,opt:3200},
  {z:'C',use:5600,opt:5000},{z:'D',use:2800,opt:3000},{z:'E',use:6100,opt:5500},
];
const NN_N=[{x:55,y:80},{x:55,y:150},{x:55,y:220},{x:150,y:55},{x:150,y:120},{x:150,y:185},{x:150,y:250},{x:245,y:90},{x:245,y:165},{x:245,y:235},{x:330,y:130},{x:330,y:200},{x:400,y:165}];
const NN_E=[[0,3],[0,4],[1,3],[1,4],[1,5],[2,4],[2,5],[2,6],[3,7],[4,7],[4,8],[5,8],[5,9],[6,8],[6,9],[7,10],[8,10],[8,11],[9,11],[10,12],[11,12]];

// ── GLOBAL CSS ─────────────────────────────────────────────
const GCSS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;overflow:hidden;cursor:none!important}
*{cursor:none!important}
::-webkit-scrollbar{width:3px;height:3px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:rgba(124,58,237,0.45);border-radius:4px}
input,select,textarea{outline:none}

@keyframes au1{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(80px,-60px) scale(1.15)}66%{transform:translate(-50px,70px) scale(.9)}}
@keyframes au2{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(-70px,55px) scale(1.2)}66%{transform:translate(65px,-70px) scale(.85)}}
@keyframes au3{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(55px,-50px) scale(1.18)}}
@keyframes au4{0%,100%{transform:translate(0,0) scale(1)}40%{transform:translate(-60px,-40px) scale(1.1)}80%{transform:translate(40px,60px) scale(.92)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
@keyframes float2{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes fade-up{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
@keyframes fade-in{from{opacity:0}to{opacity:1}}
@keyframes slide-r{from{opacity:0;transform:translateX(-22px)}to{opacity:1;transform:translateX(0)}}
@keyframes page-in{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
@keyframes shimmer{from{transform:translateX(-100%)}to{transform:translateX(200%)}}
@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes breathe{0%,100%{transform:scale(1);opacity:.5}50%{transform:scale(1.7);opacity:1}}
@keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
@keyframes grad-shift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
@keyframes letter-in{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
@keyframes node-p{0%,100%{opacity:.2;r:3}50%{opacity:1;r:5}}
@keyframes edge-f{0%{stroke-dashoffset:120}100%{stroke-dashoffset:0}}
@keyframes scan-v{0%{top:-5%}100%{top:108%}}
@keyframes orbit1{from{transform:rotate(0deg) translateX(130px) rotate(0deg)}to{transform:rotate(360deg) translateX(130px) rotate(-360deg)}}
@keyframes orbit2{from{transform:rotate(90deg) translateX(165px) rotate(-90deg)}to{transform:rotate(450deg) translateX(165px) rotate(-450deg)}}
@keyframes orbit3{from{transform:rotate(200deg) translateX(98px) rotate(-200deg)}to{transform:rotate(560deg) translateX(98px) rotate(-560deg)}}
@keyframes ring-exp{0%{r:28;opacity:.9}100%{r:100;opacity:0}}
@keyframes ping-v{0%{box-shadow:0 0 0 0 rgba(124,58,237,.7)}100%{box-shadow:0 0 0 14px rgba(124,58,237,0)}}
@keyframes count-in{from{opacity:0;transform:scale(.8)}to{opacity:1;transform:scale(1)}}
@keyframes progress{from{width:0}to{width:100%}}
@keyframes blink{0%,49%{opacity:1}50%,100%{opacity:0}}
@keyframes glow-pulse{0%,100%{opacity:.35}50%{opacity:.85}}
@keyframes glitch{0%,85%,100%{text-shadow:.04em 0 0 #7c3aed,-.04em 0 0 #06b6d4}87%{text-shadow:-.07em 0 0 #7c3aed,.07em 0 0 #06b6d4}90%{text-shadow:.07em 0 0 #a78bfa,-.07em 0 0 #7c3aed}93%{text-shadow:-.04em 0 0 #06b6d4,.04em 0 0 #7c3aed}}
@keyframes terminal-in{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:translateX(0)}}
@keyframes hud-l{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}
@keyframes hud-r{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
.gc{transition:all .3s ease}
.gc:hover{transform:translateY(-2px)!important}
`;

// ── TOOLTIP STYLE ──────────────────────────────────────────
const TT = {contentStyle:{background:'rgba(8,13,26,0.96)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:10,color:D.tx,fontFamily:"'JetBrains Mono',monospace",fontSize:11,backdropFilter:'blur(12px)'}};

// ── CUSTOM CURSOR ──────────────────────────────────────────
function Cursor(){
  const mouse=useRef({x:-200,y:-200});
  const ring=useRef({x:-200,y:-200});
  const raf=useRef(null);
  const [dot,setDot]=useState({x:-200,y:-200});
  const [ri,setRi]=useState({x:-200,y:-200});
  const [click,setClick]=useState(false);
  const [hover,setHover]=useState(false);

  useEffect(()=>{
    const mv=(e)=>{mouse.current={x:e.clientX,y:e.clientY};setDot({x:e.clientX,y:e.clientY});};
    const dn=()=>setClick(true);
    const up=()=>setClick(false);
    const over=(e)=>{if(e.target.tagName==='BUTTON'||e.target.tagName==='A'||e.target.closest('button'))setHover(true);};
    const out=()=>setHover(false);
    window.addEventListener('mousemove',mv);
    window.addEventListener('mousedown',dn);
    window.addEventListener('mouseup',up);
    window.addEventListener('mouseover',over);
    window.addEventListener('mouseout',out);
    const animate=()=>{
      ring.current.x+=(mouse.current.x-ring.current.x)*0.11;
      ring.current.y+=(mouse.current.y-ring.current.y)*0.11;
      setRi({x:ring.current.x,y:ring.current.y});
      raf.current=requestAnimationFrame(animate);
    };
    raf.current=requestAnimationFrame(animate);
    return()=>{window.removeEventListener('mousemove',mv);window.removeEventListener('mousedown',dn);window.removeEventListener('mouseup',up);window.removeEventListener('mouseover',over);window.removeEventListener('mouseout',out);cancelAnimationFrame(raf.current);};
  },[]);

  const ds=click?14:hover?12:8;
  const rs=click?52:hover?46:36;
  return(
    <>
      <div style={{position:'fixed',zIndex:999999,pointerEvents:'none',width:ds,height:ds,borderRadius:'50%',background:'#fff',left:dot.x-ds/2,top:dot.y-ds/2,transition:'width .15s,height .15s',boxShadow:'0 0 10px rgba(255,255,255,.9)',mixBlendMode:'difference'}}/>
      <div style={{position:'fixed',zIndex:999998,pointerEvents:'none',width:rs,height:rs,borderRadius:'50%',border:`1.5px solid rgba(167,139,250,${click?.9:hover?.75:.55})`,left:ri.x-rs/2,top:ri.y-rs/2,transition:'width .3s,height .3s,border-color .2s',backdropFilter:hover?'blur(1px)':'none'}}/>
    </>
  );
}

// ── SPOTLIGHT ──────────────────────────────────────────────
function Spotlight(){
  const [p,setP]=useState({x:-500,y:-500});
  useEffect(()=>{const h=(e)=>setP({x:e.clientX,y:e.clientY});window.addEventListener('mousemove',h);return()=>window.removeEventListener('mousemove',h);},[]);
  return <div style={{position:'fixed',inset:0,zIndex:1,pointerEvents:'none',background:`radial-gradient(700px at ${p.x}px ${p.y}px, rgba(124,58,237,0.08), transparent 40%)`,transition:'background .05s'}}/>;
}

// ── AURORA ORBS ────────────────────────────────────────────
function Aurora(){
  return(
    <div style={{position:'fixed',inset:0,overflow:'hidden',pointerEvents:'none',zIndex:0}}>
      <div style={{position:'absolute',width:700,height:700,borderRadius:'50%',background:'radial-gradient(circle,rgba(124,58,237,.14) 0%,transparent 70%)',top:'-15%',left:'12%',animation:'au1 20s ease-in-out infinite'}}/>
      <div style={{position:'absolute',width:600,height:600,borderRadius:'50%',background:'radial-gradient(circle,rgba(6,182,212,.1) 0%,transparent 70%)',top:'22%',right:'-8%',animation:'au2 24s ease-in-out infinite'}}/>
      <div style={{position:'absolute',width:500,height:500,borderRadius:'50%',background:'radial-gradient(circle,rgba(16,185,129,.08) 0%,transparent 70%)',bottom:'-8%',left:'5%',animation:'au3 16s ease-in-out infinite'}}/>
      <div style={{position:'absolute',width:450,height:450,borderRadius:'50%',background:'radial-gradient(circle,rgba(236,72,153,.07) 0%,transparent 70%)',bottom:'18%',right:'22%',animation:'au4 28s ease-in-out infinite'}}/>
    </div>
  );
}

// ── GLASS CARD ─────────────────────────────────────────────
function GC({children,style={},ac=D.v,onClick,noHover}){
  const [h,setH]=useState(false);
  const act=h&&!noHover;
  return(
    <div className="gc" onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{background:act?'rgba(12,18,36,.9)':'rgba(8,12,26,.75)',border:`1px solid ${act?`${ac}38`:'rgba(255,255,255,.07)'}`,borderRadius:16,backdropFilter:'blur(24px)',boxShadow:act?`0 0 0 1px ${ac}18,0 8px 40px rgba(0,0,0,.5),inset 0 0 40px ${ac}04`:'0 4px 28px rgba(0,0,0,.35)',position:'relative',overflow:'hidden',cursor:onClick?'none':'default',...style}}>
      <div style={{position:'absolute',top:0,left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,${ac}${act?'cc':'44'},transparent)`,transition:'opacity .3s'}}/>
      {act&&<div style={{position:'absolute',inset:0,background:`linear-gradient(110deg,transparent 35%,${ac}05 50%,transparent 65%)`,animation:'shimmer 1.8s infinite',pointerEvents:'none'}}/>}
      {children}
    </div>
  );
}

// ── MAGNETIC BUTTON ────────────────────────────────────────
function MB({children,color=D.v,onClick,style={},outline,sm,disabled}){
  const ref=useRef(null);
  const [tr,setTr]=useState('');
  const [h,setH]=useState(false);
  const mv=(e)=>{if(disabled)return;const r=ref.current.getBoundingClientRect();const x=(e.clientX-r.left-r.width/2)*.28;const y=(e.clientY-r.top-r.height/2)*.28;setTr(`translate(${x}px,${y}px)`);};
  return(
    <button ref={ref} disabled={disabled} onClick={disabled?null:onClick} onMouseMove={mv} onMouseEnter={()=>setH(true)} onMouseLeave={()=>{setTr('');setH(false);}}
      style={{transform:tr,padding:sm?'7px 18px':'12px 28px',borderRadius:12,border:`1px solid ${color}${h?'bb':'44'}`,background:outline?'transparent':(h?`${color}22`:`${color}10`),color:h?'#fff':D.tx,fontFamily:"'Space Grotesk',sans-serif",fontWeight:600,fontSize:sm?'.75rem':'.88rem',transition:'all .3s cubic-bezier(.23,1,.32,1)',boxShadow:h?`0 0 32px ${color}44,0 0 64px ${color}18`:'none',opacity:disabled?.45:1,...style}}>
      {children}
    </button>
  );
}

// ── COUNTER HOOK ───────────────────────────────────────────
function useCount(target,dur=1400,delay=0){
  const [v,setV]=useState(0);
  useEffect(()=>{
    const t=setTimeout(()=>{
      let s=null;
      const step=(ts)=>{if(!s)s=ts;const p=Math.min((ts-s)/dur,1);setV(Math.round(p*target));if(p<1)requestAnimationFrame(step);};
      requestAnimationFrame(step);
    },delay);
    return()=>clearTimeout(t);
  },[target]);
  return v;
}

// ── STAT CARD ──────────────────────────────────────────────
function SC({icon,label,value,num,unit,sub,ac=D.v,delay=0}){
  const c=useCount(num||0,1400,delay*180);
  return(
    <GC ac={ac} style={{padding:'1.4rem',animation:`fade-up .5s ${delay*.1}s ease both`}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'1rem'}}>
        <div style={{background:`${ac}14`,borderRadius:10,padding:'.55rem',fontSize:'1.2rem',border:`1px solid ${ac}20`}}>{icon}</div>
        <div style={{display:'flex',alignItems:'center',gap:5}}>
          <div style={{width:6,height:6,borderRadius:'50%',background:ac,animation:'breathe 2s infinite'}}/>
          <span style={{color:ac,fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',opacity:.75}}>LIVE</span>
        </div>
      </div>
      <div style={{color:D.t2,fontFamily:"'Inter',sans-serif",fontSize:'.7rem',fontWeight:500,letterSpacing:'.5px',marginBottom:'.3rem',textTransform:'uppercase'}}>{label}</div>
      <div style={{display:'flex',alignItems:'baseline',gap:4,animation:`count-in .5s ${delay*.1+.3}s ease both`}}>
        <span style={{color:ac,fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,fontSize:'1.9rem',lineHeight:1}}>{num?c:value}</span>
        {unit&&<span style={{color:`${ac}77`,fontFamily:"'JetBrains Mono',monospace",fontSize:'.72rem'}}>{unit}</span>}
      </div>
      {sub&&<div style={{color:D.t3,fontFamily:"'Inter',sans-serif",fontSize:'.68rem',marginTop:'.3rem'}}>{sub}</div>}
    </GC>
  );
}

// ── PAGE HERO ──────────────────────────────────────────────
function PH({title,sub,ac=D.v,right,badge}){
  return(
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'2rem',animation:'fade-up .4s ease'}}>
      <div>
        <div style={{display:'flex',alignItems:'center',gap:'.5rem',marginBottom:'.4rem'}}>
          {badge&&<span style={{background:`${ac}14`,border:`1px solid ${ac}30`,borderRadius:20,padding:'3px 10px',color:ac,fontFamily:"'JetBrains Mono',monospace",fontSize:'.58rem',letterSpacing:'1.5px'}}>{badge}</span>}
          <span style={{color:`${ac}88`,fontFamily:"'JetBrains Mono',monospace",fontSize:'.62rem',letterSpacing:'2.5px',textTransform:'uppercase'}}>{sub}</span>
        </div>
        <h1 style={{color:D.tx,fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,fontSize:'1.7rem',letterSpacing:'-.5px',lineHeight:1.2}}>{title}</h1>
        <div style={{width:44,height:3,background:`linear-gradient(90deg,${ac},transparent)`,borderRadius:2,marginTop:'.45rem'}}/>
      </div>
      {right}
    </div>
  );
}

// ── NEURAL NET SVG ─────────────────────────────────────────
function NNet({w=460,h=260}){
  return(
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{overflow:'visible'}}>
      <defs><filter id="nf"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
      {NN_E.map(([a,b],i)=>{const na=NN_N[a],nb=NN_N[b];const c=i%3===0?`${D.v}55`:i%3===1?`${D.c}45`:`${D.g}35`;return <line key={i} x1={na.x} y1={na.y} x2={nb.x} y2={nb.y} stroke={c} strokeWidth="1" strokeDasharray="7 5" style={{animation:`edge-f ${1.4+i%4*.35}s ${i*.07}s linear infinite`}}/>;
      })}
      {NN_N.map((n,i)=>(
        <g key={i}>
          <circle cx={n.x} cy={n.y} r="8" fill={`${D.v}08`} stroke={`${D.v}25`} strokeWidth=".8"/>
          <circle cx={n.x} cy={n.y} r="4" fill={i===12?D.v:i%3===0?D.v:i%3===1?D.c:D.g} filter="url(#nf)" style={{animation:`node-p ${1.1+i%3*.45}s ${i*.09}s ease-in-out infinite`}}/>
        </g>
      ))}
    </svg>
  );
}

// ── SCAN LINE ──────────────────────────────────────────────
function SL({color=D.v}){
  return(
    <div style={{position:'absolute',inset:0,overflow:'hidden',pointerEvents:'none',borderRadius:'inherit',zIndex:9}}>
      <div style={{position:'absolute',left:0,right:0,height:1.5,background:`linear-gradient(90deg,transparent,${color}99,transparent)`,animation:'scan-v 4s linear infinite'}}/>
    </div>
  );
}

// ── BADGE ──────────────────────────────────────────────────
function Badge({children,color=D.v}){
  return <span style={{padding:'2px 10px',borderRadius:20,border:`1px solid ${color}38`,background:`${color}10`,color,fontSize:'.62rem',fontFamily:"'JetBrains Mono',monospace",letterSpacing:'1px'}}>{children}</span>;
}

// ── NAVBAR ─────────────────────────────────────────────────
const NAVPAGES=[
  {id:'landing',  icon:'🌍',l:'Home'},
  {id:'command',  icon:'⚡',l:'Command'},
  {id:'yield',    icon:'🌾',l:'Yield AI'},
  {id:'climate',  icon:'🌦️',l:'Climate'},
  {id:'hydro',    icon:'💧',l:'Hydro AI'},
  {id:'soil',     icon:'🧬',l:'Soil Scan'},
  {id:'assistant',icon:'🤖',l:'Assistant'},
];

function Navbar({page,setPage,user,onLogout}){
  const [time,setTime]=useState(new Date());
  useEffect(()=>{const t=setInterval(()=>setTime(new Date()),1000);return()=>clearInterval(t);},[]);
  return(
    <div style={{height:62,background:'rgba(5,8,24,.94)',backdropFilter:'blur(24px)',borderBottom:`1px solid ${D.bd}`,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 2rem',flexShrink:0,position:'relative',zIndex:50}}>
      <div style={{display:'flex',alignItems:'center',gap:'.75rem',minWidth:170}}>
        <div style={{width:36,height:36,borderRadius:10,background:`linear-gradient(135deg,${D.v},${D.c})`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.1rem',boxShadow:`0 0 20px ${D.v}44`}}>🌿</div>
        <div>
          <div style={{color:D.tx,fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,fontSize:'1rem',letterSpacing:'-.5px'}}>Terra AI</div>
          <div style={{color:D.t3,fontFamily:"'JetBrains Mono',monospace",fontSize:'.52rem',letterSpacing:'2px'}}>v4.0 AURORA</div>
        </div>
      </div>

      <div style={{display:'flex',alignItems:'center',gap:'.2rem'}}>
        {NAVPAGES.map(({id,icon,l})=>{
          const active=page===id;
          return(
            <button key={id} onClick={()=>setPage(id)} style={{display:'flex',alignItems:'center',gap:'.38rem',padding:'.42rem .82rem',borderRadius:10,border:'none',background:active?`${D.v}18`:'transparent',color:active?D.vl:D.t2,fontFamily:"'Inter',sans-serif",fontWeight:500,fontSize:'.8rem',transition:'all .2s',boxShadow:active?`0 0 0 1px ${D.v}35`:'none',position:'relative'}}>
              <span style={{fontSize:'.82rem'}}>{icon}</span>{l}
              {active&&<div style={{position:'absolute',bottom:0,left:'25%',right:'25%',height:1.5,background:`linear-gradient(90deg,transparent,${D.v},transparent)`,borderRadius:2}}/>}
            </button>
          );
        })}
      </div>

      <div style={{display:'flex',alignItems:'center',gap:'1rem',minWidth:170,justifyContent:'flex-end'}}>
        <span style={{color:D.t3,fontFamily:"'JetBrains Mono',monospace",fontSize:'.7rem'}}>{time.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit',second:'2-digit'})}</span>
        <div style={{width:30,height:30,borderRadius:'50%',background:`linear-gradient(135deg,${D.v},${D.c})`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.78rem',fontWeight:700,color:'#fff',fontFamily:"'Space Grotesk',sans-serif"}}>
          {(user?.name||'U')[0]}
        </div>
        <button onClick={onLogout} style={{background:'none',border:'1px solid rgba(239,68,68,.3)',borderRadius:8,padding:'4px 12px',color:'#ef4444',fontFamily:"'Inter',sans-serif",fontSize:'.72rem',fontWeight:500}}>Logout</button>
      </div>
    </div>
  );
}

// ── AUTH PAGE ──────────────────────────────────────────────
function Auth({onAuth}){
  const [isReg,setIsReg]=useState(false);
  const [f,setF]=useState({name:'',email:'',pass:'',conf:'',role:'farmer'});
  const [busy,setBusy]=useState(false);
  const [err,setErr]=useState('');
  const [prog,setProg]=useState(0);

  const submit=async()=>{
    if(!f.email||!f.pass){setErr('Fill in all required fields.');return;}
    if(isReg&&f.pass!==f.conf){setErr('Passwords do not match.');return;}
    setBusy(true);setErr('');setProg(0);
    for(let i=0;i<=100;i+=5){await new Promise(r=>setTimeout(r,48));setProg(i);}
    onAuth({name:f.name||'Operator',email:f.email,role:f.role});
    setBusy(false);
  };

  const inp={width:'100%',padding:'.68rem 1rem',borderRadius:10,background:'rgba(0,0,0,.35)',border:'1px solid rgba(255,255,255,.08)',color:D.tx,fontFamily:"'Inter',sans-serif",fontSize:'.88rem',transition:'border .2s,box-shadow .2s',marginBottom:'.85rem',display:'block'};
  const letters="TERRA AI".split('');

  return(
    <div style={{minHeight:'100vh',background:D.bg,display:'flex',alignItems:'center',justifyContent:'center',position:'relative',overflow:'hidden'}}>
      <Aurora/><Spotlight/>

      {/* Left branding */}
      <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'4rem',position:'relative',zIndex:2,maxWidth:580}}>
        <div style={{marginBottom:'2.5rem',animation:'float 6s ease-in-out infinite',textAlign:'center'}}>
          <div style={{display:'flex',gap:'.1rem',justifyContent:'center',marginBottom:'.75rem'}}>
            {letters.map((l,i)=>(
              <span key={i} style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:800,fontSize:'5.5rem',background:`linear-gradient(135deg,${D.vl},${D.c},${D.g})`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundSize:'200%',animation:`letter-in .5s ${i*.06}s ease both, grad-shift 4s ${i*.1}s ease infinite`,lineHeight:1}}>
                {l===' '?'\u00A0':l}
              </span>
            ))}
          </div>
          <div style={{color:D.t2,fontFamily:"'Inter',sans-serif",fontSize:'1rem',fontWeight:300,letterSpacing:'.5px'}}>Neural Agricultural Intelligence</div>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1.5rem',marginBottom:'2.5rem',width:'100%',maxWidth:380}}>
          {[['98.7%','Accuracy',D.v],['2.4M','Hectares',D.c],['340+','AI Models',D.g]].map(([v,l,c])=>(
            <GC key={l} ac={c} style={{padding:'.85rem',textAlign:'center'}}>
              <div style={{color:c,fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,fontSize:'1.3rem'}}>{v}</div>
              <div style={{color:D.t3,fontFamily:"'Inter',sans-serif",fontSize:'.68rem'}}>{l}</div>
            </GC>
          ))}
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:'.65rem',width:'100%',maxWidth:380}}>
          {['🌾 Neural yield prediction with 98.7% accuracy','🧬 Spectroscopic soil health diagnostics','🌦️ Satellite climate matrix & fusion','💧 AI-driven irrigation optimization'].map((ft,i)=>(
            <div key={i} style={{display:'flex',alignItems:'center',gap:'.75rem',animation:`fade-in .4s ${.5+i*.1}s ease both`}}>
              <div style={{width:4,height:4,borderRadius:'50%',background:D.v,boxShadow:`0 0 8px ${D.v}`,flexShrink:0}}/>
              <span style={{color:D.t2,fontFamily:"'Inter',sans-serif",fontSize:'.85rem'}}>{ft}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div style={{width:1,height:'65vh',background:'rgba(255,255,255,.05)',flexShrink:0}}/>

      {/* Right form */}
      <div style={{width:460,padding:'2.5rem',position:'relative',zIndex:2}}>
        <GC ac={D.v} style={{padding:'2.5rem'}}>
          {busy&&<div style={{position:'absolute',top:0,left:0,right:0,height:3,background:`${D.v}18`,borderRadius:'16px 16px 0 0',overflow:'hidden'}}><div style={{height:'100%',width:`${prog}%`,background:`linear-gradient(90deg,${D.v},${D.c})`,boxShadow:`0 0 12px ${D.v}`,transition:'width .08s'}}/></div>}
          <div style={{marginBottom:'1.75rem'}}>
            <div style={{color:D.tx,fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,fontSize:'1.4rem',marginBottom:'.25rem'}}>{isReg?'Create Account':'Welcome Back'}</div>
            <div style={{color:D.t2,fontFamily:"'Inter',sans-serif",fontSize:'.82rem'}}>{isReg?'Join the neural farm network':'Sign in to your command center'}</div>
          </div>

          <div style={{display:'flex',background:'rgba(0,0,0,.3)',borderRadius:10,padding:4,marginBottom:'1.5rem'}}>
            {['Sign In','Register'].map((t,i)=>(
              <button key={t} onClick={()=>{setIsReg(i===1);setErr('');}} style={{flex:1,padding:'.5rem',borderRadius:8,border:'none',background:(i===1)===isReg?`linear-gradient(135deg,${D.v}2a,${D.c}1a)`:'transparent',color:(i===1)===isReg?D.vl:D.t3,fontFamily:"'Space Grotesk',sans-serif",fontWeight:600,fontSize:'.82rem',transition:'all .2s',boxShadow:(i===1)===isReg?`0 0 16px ${D.v}1a`:'none'}}>{t}</button>
            ))}
          </div>

          {isReg&&<input style={inp} placeholder="Full name" value={f.name} onChange={e=>setF(x=>({...x,name:e.target.value}))}/>}
          <input style={inp} type="email" placeholder="Email address" value={f.email} onChange={e=>setF(x=>({...x,email:e.target.value}))}/>
          <input style={inp} type="password" placeholder="Password" value={f.pass} onChange={e=>setF(x=>({...x,pass:e.target.value}))}/>
          {isReg&&<input style={inp} type="password" placeholder="Confirm password" value={f.conf} onChange={e=>setF(x=>({...x,conf:e.target.value}))}/>}
          {isReg&&(
            <select style={{...inp,background:'rgba(0,0,0,.5)'}} value={f.role} onChange={e=>setF(x=>({...x,role:e.target.value}))}>
              <option value="farmer">Field Operator</option>
              <option value="admin">Platform Admin</option>
              <option value="analyst">Data Analyst</option>
            </select>
          )}

          {err&&<div style={{background:'rgba(239,68,68,.08)',border:'1px solid rgba(239,68,68,.25)',borderRadius:9,padding:'.6rem 1rem',marginBottom:'1rem',color:'#f87171',fontFamily:"'Inter',sans-serif",fontSize:'.8rem'}}>⚠ {err}</div>}

          <MB color={D.v} onClick={submit} disabled={busy} style={{width:'100%',padding:'.85rem',marginBottom:'1rem',fontSize:'.9rem'}}>
            {busy?`Authenticating ${prog}%…`:isReg?'⚡ Create Account':'⚡ Sign In'}
          </MB>
          <div style={{textAlign:'center',color:D.t3,fontFamily:"'Inter',sans-serif",fontSize:'.78rem'}}>
            {isReg?'Already have access? ':'New operator? '}
            <span onClick={()=>{setIsReg(!isReg);setErr('');}} style={{color:D.vl,textDecoration:'underline'}}>{isReg?'Sign in':'Register'}</span>
          </div>
          <div style={{textAlign:'center',marginTop:'.65rem',color:D.t3,fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',opacity:.45}}>any email + password works</div>
        </GC>
      </div>
    </div>
  );
}


// ── GLOBE HERO ─────────────────────────────────────────────
function GlobeHero({size=420}){
  const r=size/2;
  return(
    <div style={{width:size,height:size,position:'relative',flexShrink:0}}>
      {/* Atmosphere rings */}
      {[1.1,1.22,1.36].map((s,i)=>(
        <div key={i} style={{position:'absolute',width:size*s,height:size*s,top:`${50-50*s}%`,left:`${50-50*s}%`,borderRadius:'50%',border:`1px solid ${[D.v,D.c,D.vl][i]}${['26','18','0e'][i]}`,animation:`glow-pulse ${2.5+i*.8}s ease-in-out infinite`,animationDelay:`${i*.4}s`}}/>
      ))}
      {/* Orbital dots */}
      {[{an:'orbit1',c:D.v,ds:10,dur:'7s'},{an:'orbit2',c:D.c,ds:7,dur:'11s'},{an:'orbit3',c:D.g,ds:5,dur:'15s'}].map(({an,c,ds,dur},i)=>(
        <div key={i} style={{position:'absolute',top:'50%',left:'50%',marginLeft:'-5px',marginTop:'-5px',animation:`${an} ${dur} linear infinite`}}>
          <div style={{width:ds,height:ds,borderRadius:'50%',background:c,boxShadow:`0 0 14px ${c},0 0 28px ${c}66`}}/>
        </div>
      ))}
      {/* SVG Globe */}
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{position:'absolute',top:0,left:0}}>
        <defs>
          <radialGradient id="gBg" cx="35%" cy="30%">
            <stop offset="0%" stopColor="#1e0a4a"/>
            <stop offset="55%" stopColor="#0a0525"/>
            <stop offset="100%" stopColor="#040215"/>
          </radialGradient>
          <radialGradient id="gAtm" cx="50%" cy="50%">
            <stop offset="62%" stopColor="#7c3aed" stopOpacity="0"/>
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.22"/>
          </radialGradient>
          <radialGradient id="gHl" cx="32%" cy="28%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.1)"/>
            <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
          </radialGradient>
          <clipPath id="gCP"><circle cx={r} cy={r} r={r-5}/></clipPath>
          <filter id="gGlow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        <circle cx={r} cy={r} r={r-5} fill="url(#gBg)"/>
        <circle cx={r} cy={r} r={r-5} fill="url(#gHl)"/>
        <g clipPath="url(#gCP)">
          <g style={{transformOrigin:`${r}px ${r}px`,animation:'spin 35s linear infinite'}}>
            {[0,30,60,90,120,150].map((lng,i)=>(
              <ellipse key={i} cx={r} cy={r} rx={(r-5)*Math.abs(Math.cos(lng*Math.PI/180))} ry={r-5} fill="none" stroke="rgba(124,58,237,0.18)" strokeWidth=".6"/>
            ))}
            <g fill="rgba(124,58,237,0.14)" stroke="rgba(124,58,237,0.5)" strokeWidth=".9">
              <polygon points={`${r-58},${r-68} ${r-28},${r-80} ${r-18},${r-38} ${r-26},${r+12} ${r-58},${r+48} ${r-72},${r+5}`}/>
              <polygon points={`${r+12},${r-82} ${r+46},${r-68} ${r+52},${r-18} ${r+34},${r+52} ${r+9},${r+58} ${r+3},${r-18}`}/>
              <polygon points={`${r+52},${r-78} ${r+88},${r-70} ${r+92},${r-20} ${r+70},${r+16} ${r+44},${r+8}`}/>
              <polygon points={`${r+60},${r+30} ${r+80},${r+22} ${r+82},${r+55} ${r+62},${r+62}`}/>
            </g>
          </g>
          {[-60,-30,0,30,60].map((lat,i)=>{
            const y=r+(lat/90)*(r-5);
            const lr=Math.sqrt(Math.max(0,(r-5)**2-(y-r)**2));
            return lr>0?<ellipse key={i} cx={r} cy={y} rx={lr} ry={lr*.3} fill="none" stroke={lat===0?'rgba(6,182,212,0.35)':'rgba(124,58,237,0.15)'} strokeWidth={lat===0?'.8':'.5'}/>:null;
          })}
        </g>
        <circle cx={r} cy={r} r={r-5} fill="url(#gAtm)"/>
        <circle cx={r} cy={r} r={r-5} fill="none" stroke="#7c3aed" strokeWidth="2.5" opacity=".18"/>
        <circle cx={r} cy={r} r={r-2} fill="none" stroke="#06b6d4" strokeWidth="1" opacity=".1"/>
        {[{cx:r-38,cy:r-48,c:'#7c3aed'},{cx:r+32,cy:r-28,c:'#06b6d4'},{cx:r+58,cy:r-52,c:'#7c3aed'},{cx:r-18,cy:r+38,c:'#10b981'},{cx:r+25,cy:r+45,c:'#06b6d4'},{cx:r-52,cy:r+22,c:'#a78bfa'}].map(({cx,cy,c},i)=>(
          <g key={i}>
            <circle cx={cx} cy={cy} r="4.5" fill={c} opacity=".95" filter="url(#gGlow)"/>
            <circle cx={cx} cy={cy} r="4.5" fill="none" stroke={c} strokeWidth="1.5">
              <animate attributeName="r" values="4.5;22;4.5" dur={`${1.8+i*.4}s`} repeatCount="indefinite"/>
              <animate attributeName="opacity" values=".95;0;.95" dur={`${1.8+i*.4}s`} repeatCount="indefinite"/>
            </circle>
          </g>
        ))}
      </svg>
    </div>
  );
}

// ── LANDING PAGE ─────────────────────────────────────────
function Landing({setPage}){
  const [termLines,setTermLines]=useState([]);
  const [showMain,setShowMain]=useState(false);
  const [termDone,setTermDone]=useState(false);

  const TLINES=[
    {t:'> INITIALIZING TERRA AI v4.0...',c:D.t2},
    {t:'> LOADING NEURAL MODELS ......... [████████████] 100%',c:D.t2},
    {t:'> SATELLITE UPLINK .............. ESTABLISHED',c:D.t2},
    {t:'> CLIMATE MATRIX ................ SYNCED',c:D.t2},
    {t:'> HYDRO IOT SENSORS ............. ONLINE',c:D.t2},
    {t:'> 340 AI MODELS ................. LOADED',c:D.t2},
    {t:'> WELCOME, OPERATOR. SYSTEM READY.',c:D.g},
  ];

  useEffect(()=>{
    TLINES.forEach(({t,c},i)=>{
      setTimeout(()=>{
        setTermLines(x=>[...x,{t,c}]);
        if(i===TLINES.length-1){
          setTimeout(()=>{setTermDone(true);setTimeout(()=>setShowMain(true),700);},800);
        }
      },i*480);
    });
  },[]);

  if(!showMain){
    return(
      <div style={{height:'100%',background:D.bg,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',position:'relative',overflow:'hidden'}}>
        <Aurora/>
        <div style={{position:'absolute',bottom:0,left:'-10%',right:'-10%',height:320,backgroundImage:`linear-gradient(${D.v}18 1px,transparent 1px),linear-gradient(90deg,${D.v}18 1px,transparent 1px)`,backgroundSize:'55px 55px',transform:'perspective(500px) rotateX(72deg)',transformOrigin:'center bottom',opacity:.45,pointerEvents:'none'}}/>
        <div style={{width:'100%',maxWidth:700,padding:'2rem 2.5rem',position:'relative',zIndex:2}}>
          <div style={{display:'flex',alignItems:'center',gap:'.5rem',marginBottom:'1.5rem',paddingBottom:'.75rem',borderBottom:`1px solid ${D.bd}`}}>
            {['#ef4444','#f59e0b','#10b981'].map((c,i)=><div key={i} style={{width:11,height:11,borderRadius:'50%',background:c}}/>)}
            <span style={{marginLeft:'.5rem',color:D.t3,fontFamily:"'JetBrains Mono',monospace",fontSize:'.62rem',letterSpacing:'2px'}}>TERRA AI — NEURAL TERMINAL v4.0</span>
          </div>
          {termLines.map((line,i)=>(
            <div key={i} style={{color:line.c,fontFamily:"'JetBrains Mono',monospace",fontSize:'.88rem',marginBottom:'.55rem',animation:'terminal-in .3s ease both',lineHeight:1.5,textShadow:i===termLines.length-1&&termDone?`0 0 12px ${D.g}`:'none'}}>
              {line.t}
            </div>
          ))}
          {!termDone&&termLines.length>0&&<span style={{color:D.g,fontFamily:"'JetBrains Mono',monospace",fontSize:'1rem',animation:'blink 1s step-end infinite'}}>█</span>}
          {termDone&&<div style={{marginTop:'1rem',color:`${D.g}77`,fontFamily:"'JetBrains Mono',monospace",fontSize:'.75rem',letterSpacing:'2px'}}>LOADING INTERFACE<span style={{animation:'blink 1s step-end infinite'}}>...</span></div>}
        </div>
        <button onClick={()=>setShowMain(true)} style={{position:'absolute',bottom:'2rem',right:'2rem',background:'none',border:`1px solid ${D.t3}44`,borderRadius:8,padding:'6px 18px',color:D.t3,fontFamily:"'JetBrains Mono',monospace",fontSize:'.68rem',letterSpacing:'1px'}}>
          SKIP INTRO ›
        </button>
      </div>
    );
  }

  return(
    <div style={{height:'100%',overflowY:'auto',position:'relative',background:D.bg}}>
      {/* Perspective grid floor */}
      <div style={{position:'fixed',bottom:0,left:'-10%',right:'-10%',height:340,backgroundImage:`linear-gradient(${D.v}16 1px,transparent 1px),linear-gradient(90deg,${D.v}16 1px,transparent 1px)`,backgroundSize:'58px 58px',transform:'perspective(500px) rotateX(72deg)',transformOrigin:'center bottom',opacity:.4,pointerEvents:'none',zIndex:0}}/>

      {/* Top ticker */}
      <div style={{height:30,background:`${D.v}0c`,borderBottom:`1px solid ${D.v}18`,display:'flex',alignItems:'center',overflow:'hidden',position:'relative',zIndex:5}}>
        <div style={{display:'flex',gap:'3rem',animation:'ticker 28s linear infinite',whiteSpace:'nowrap'}}>
          {[...Array(2)].flatMap(()=>['🌾 YIELD +12.4%','🌡️ TEMP 28.4°C','💧 WATER SAVED 18%','🧬 SOIL HEALTH 84.7%','⚡ 1,247 PREDICTIONS TODAY','🌍 2.4M HECTARES','📡 340 AI MODELS ACTIVE','🤖 NEURAL ENGINE: ONLINE'].map((t,i)=>(
            <span key={`${t}${i}`} style={{color:`${D.v}88`,fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',letterSpacing:'1px'}}>{t}</span>
          )))}
        </div>
      </div>

      {/* HUD — Top Left */}
      <div style={{position:'fixed',top:96,left:16,zIndex:10,animation:'hud-l .8s ease',pointerEvents:'none'}}>
        <div style={{border:`1px solid ${D.v}28`,borderRadius:8,padding:'.55rem .8rem',background:'rgba(5,8,24,.85)',backdropFilter:'blur(12px)',minWidth:190}}>
          <div style={{color:`${D.v}66`,fontFamily:"'JetBrains Mono',monospace",fontSize:'.52rem',letterSpacing:'2px',marginBottom:'.3rem'}}>SYS COORDINATES</div>
          <div style={{color:D.vl,fontFamily:"'JetBrains Mono',monospace",fontSize:'.68rem'}}>25.2048° N, 55.2708° E</div>
          <div style={{color:D.t3,fontFamily:"'JetBrains Mono',monospace",fontSize:'.58rem',marginTop:'.2rem'}}>REGION: MENA ZONE 04</div>
        </div>
      </div>

      {/* HUD — Top Right */}
      <div style={{position:'fixed',top:96,right:16,zIndex:10,animation:'hud-r .8s ease',pointerEvents:'none'}}>
        <div style={{border:`1px solid ${D.g}28`,borderRadius:8,padding:'.55rem .8rem',background:'rgba(5,8,24,.85)',backdropFilter:'blur(12px)',textAlign:'right'}}>
          <div style={{display:'flex',alignItems:'center',gap:'.4rem',justifyContent:'flex-end',marginBottom:'.3rem'}}>
            <div style={{width:5,height:5,borderRadius:'50%',background:D.g,animation:'breathe 1.5s infinite'}}/>
            <span style={{color:D.g,fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',letterSpacing:'1.5px'}}>SYSTEMS ONLINE</span>
          </div>
          {[['NEURAL NET',D.v,'ACTIVE'],['SATELLITE',D.c,'SYNCED'],['ML ENGINE',D.g,'READY']].map(([l,c,s])=>(
            <div key={l} style={{display:'flex',justifyContent:'flex-end',gap:'.6rem'}}>
              <span style={{color:D.t3,fontFamily:"'JetBrains Mono',monospace",fontSize:'.55rem'}}>{l}</span>
              <span style={{color:c,fontFamily:"'JetBrains Mono',monospace",fontSize:'.55rem',fontWeight:700}}>{s}</span>
            </div>
          ))}
        </div>
      </div>

      {/* HUD — Bottom Left */}
      <div style={{position:'fixed',bottom:24,left:16,zIndex:10,pointerEvents:'none'}}>
        <div style={{border:`1px solid ${D.c}22`,borderRadius:8,padding:'.55rem .8rem',background:'rgba(5,8,24,.8)',backdropFilter:'blur(12px)'}}>
          <div style={{color:`${D.c}66`,fontFamily:"'JetBrains Mono',monospace",fontSize:'.52rem',letterSpacing:'2px',marginBottom:'.3rem'}}>LIVE DATA STREAM</div>
          {[['TEMP','28.4°C',D.o],['HUMIDITY','62%',D.c],['WIND','18 km/h',D.g],['UV INDEX','8.4',D.v]].map(([l,v,c])=>(
            <div key={l} style={{display:'flex',justifyContent:'space-between',gap:'1.2rem'}}>
              <span style={{color:D.t3,fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem'}}>{l}</span>
              <span style={{color:c,fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',fontWeight:700}}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* HUD — Bottom Right */}
      <div style={{position:'fixed',bottom:24,right:16,zIndex:10,pointerEvents:'none'}}>
        <div style={{border:`1px solid ${D.vl}22`,borderRadius:8,padding:'.55rem .8rem',background:'rgba(5,8,24,.8)',backdropFilter:'blur(12px)'}}>
          <div style={{color:`${D.vl}66`,fontFamily:"'JetBrains Mono',monospace",fontSize:'.52rem',letterSpacing:'2px',marginBottom:'.4rem'}}>NEURAL PULSE</div>
          <svg width="90" height="38" viewBox="0 0 90 38">
            <polyline points="0,28 10,28 16,6 22,32 28,20 34,24 40,9 46,30 52,17 58,28 64,13 70,28 76,20 82,24 88,11" fill="none" stroke="#7c3aed" strokeWidth="1.8"/>
            <polyline points="0,28 10,28 16,6 22,32 28,20 34,24 40,9 46,30 52,17 58,28 64,13 70,28 76,20 82,24 88,11" fill="none" stroke="#a78bfa" strokeWidth=".8" opacity=".4"/>
          </svg>
        </div>
      </div>

      {/* HERO */}
      <div style={{padding:'3rem 5rem 2rem',display:'flex',alignItems:'center',gap:'3rem',minHeight:'88vh',position:'relative',zIndex:2}}>

        {/* LEFT: Text */}
        <div style={{flex:1,animation:'fade-up .6s ease forwards'}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:'.5rem',background:`${D.v}12`,border:`1px solid ${D.v}28`,borderRadius:20,padding:'5px 14px',marginBottom:'1.75rem'}}>
            <div style={{width:6,height:6,borderRadius:'50%',background:D.g,animation:'breathe 1.5s infinite'}}/>
            <span style={{color:D.vl,fontFamily:"'Inter',sans-serif",fontSize:'.75rem',fontWeight:500}}>Next-Gen Agricultural Intelligence</span>
          </div>

          {/* TERRA AI — Huge Glitch Title */}
          <div style={{marginBottom:'1.25rem',lineHeight:.95}}>
            <div style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:900,fontSize:'8rem',letterSpacing:'-5px',lineHeight:.9,animation:'glitch 6s ease-in-out infinite',background:`linear-gradient(135deg,${D.vl},${D.c},${D.g})`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundSize:'200%'}}>
              TERRA
            </div>
            <div style={{display:'flex',alignItems:'baseline',gap:'1rem'}}>
              <span style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:900,fontSize:'8rem',letterSpacing:'-5px',lineHeight:.9,color:D.tx}}>AI</span>
              <span style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:300,fontSize:'3rem',color:D.t3,letterSpacing:'-2px'}}>v4.0</span>
              <span style={{color:D.g,fontFamily:"'JetBrains Mono',monospace",fontSize:'3rem',animation:'blink 1.2s step-end infinite'}}>_</span>
            </div>
          </div>

          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.78rem',color:`${D.v}88`,letterSpacing:'2px',marginBottom:'.4rem',textTransform:'uppercase'}}>
            Neural Agricultural Intelligence Platform
          </div>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.68rem',color:`${D.c}55`,letterSpacing:'2px',marginBottom:'2rem'}}>
            {'>'} SYSTEM ONLINE &nbsp;·&nbsp; 340 MODELS &nbsp;·&nbsp; 98.7% ACCURACY
          </div>

          <p style={{color:D.t2,fontFamily:"'Inter',sans-serif",fontSize:'1rem',lineHeight:1.78,maxWidth:460,marginBottom:'2.25rem',fontWeight:400}}>
            Unify neural yield prediction, satellite climate fusion, soil diagnostics, and precision irrigation in one intelligent command center.
          </p>

          <div style={{display:'flex',gap:'1rem',marginBottom:'2.5rem'}}>
            <MB color={D.v} onClick={()=>setPage('command')} style={{fontSize:'.95rem',padding:'13px 30px'}}>⚡ Launch Platform</MB>
            <MB color={D.c} onClick={()=>setPage('yield')} outline style={{fontSize:'.95rem',padding:'13px 30px'}}>View Demo →</MB>
          </div>

          <div style={{display:'flex',gap:'2rem'}}>
            {[['98.7%','Accuracy',D.v],['2.4M','Hectares',D.c],['340+','AI Models',D.g],['50M+','Data Pts',D.o]].map(([v,l,c])=>(
              <div key={l}>
                <div style={{color:c,fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,fontSize:'1.3rem',textShadow:`0 0 16px ${c}44`}}>{v}</div>
                <div style={{color:D.t3,fontFamily:"'Inter',sans-serif",fontSize:'.65rem'}}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Globe + floating cards */}
        <div style={{position:'relative',flexShrink:0,animation:'fade-in .8s .3s ease both'}}>
          {/* Floating stat cards */}
          {[
            {top:-45,left:-130,icon:'🌾',l:'YIELD',v:'8.4 t/ha',c:D.g,a:'float'},
            {top:70,right:-140,icon:'🌡️',l:'TEMPERATURE',v:'28.4°C',c:D.o,a:'float2'},
            {bottom:90,left:-135,icon:'🧬',l:'SOIL HEALTH',v:'84.7%',c:D.v,a:'float2'},
            {bottom:-25,right:-135,icon:'💧',l:'HYDRO EFF.',v:'92.4%',c:D.c,a:'float'},
            {top:'38%',left:-145,icon:'⚡',l:'AI MODELS',v:'340 LIVE',c:D.vl,a:'float'},
          ].map(({top,left,right,bottom,icon,l,v,c,a},i)=>(
            <div key={i} style={{position:'absolute',top,left,right,bottom,animation:`${a} ${4+i*.7}s ${i*.3}s ease-in-out infinite`,zIndex:5}}>
              <GC ac={c} style={{padding:'.7rem 1rem',minWidth:115}} noHover>
                <div style={{display:'flex',alignItems:'center',gap:'.4rem',marginBottom:'.2rem'}}>
                  <span style={{fontSize:'.85rem'}}>{icon}</span>
                  <span style={{color:`${c}77`,fontFamily:"'JetBrains Mono',monospace",fontSize:'.5rem',letterSpacing:'1px'}}>{l}</span>
                </div>
                <div style={{color:c,fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,fontSize:'.9rem',textShadow:`0 0 10px ${c}44`}}>{v}</div>
              </GC>
            </div>
          ))}

          <div style={{animation:'float 8s ease-in-out infinite'}}>
            <GlobeHero size={420}/>
          </div>
        </div>
      </div>

      {/* Feature bento grid */}
      <div style={{padding:'0 5rem 4rem',position:'relative',zIndex:2}}>
        <div style={{textAlign:'center',marginBottom:'2.5rem'}}>
          <div style={{color:`${D.v}77`,fontFamily:"'JetBrains Mono',monospace",fontSize:'.62rem',letterSpacing:'5px',marginBottom:'.5rem',textTransform:'uppercase'}}>Platform Modules</div>
          <h2 style={{color:D.tx,fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,fontSize:'2rem',letterSpacing:'-.5px'}}>Intelligence at Every Layer</h2>
          <div style={{width:60,height:2,background:`linear-gradient(90deg,transparent,${D.v},transparent)`,margin:'.75rem auto 0',borderRadius:2}}/>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1rem'}}>
          {[
            {icon:'⚡',t:'Command Center',d:'Real-time neural dashboard with AI anomaly detection',c:D.v,pg:'command'},
            {icon:'🌾',t:'Yield Intelligence',d:'RF + LSTM prediction with 98.7% accuracy across 340 models',c:D.g,pg:'yield'},
            {icon:'🌦️',t:'Climate Matrix',d:'Satellite weather fusion with microclimate analytics',c:D.c,pg:'climate'},
            {icon:'💧',t:'Hydro AI',d:'IoT sensor fusion for precision irrigation optimization',c:D.c,pg:'hydro'},
            {icon:'🧬',t:'Soil Neural Scan',d:'Spectroscopic deep learning diagnostics',c:D.v,pg:'soil'},
            {icon:'🤖',t:'Terra Assistant',d:'Claude AI trained on 50M+ agricultural data points',c:D.vl,pg:'assistant'},
          ].map(({icon,t,d,c,pg},i)=>(
            <GC key={t} ac={c} onClick={()=>setPage(pg)} style={{padding:'1.4rem',animation:`fade-up .5s ${i*.07}s ease both`}}>
              <div style={{fontSize:'1.6rem',marginBottom:'.75rem',filter:`drop-shadow(0 0 10px ${c}55)`}}>{icon}</div>
              <div style={{color:D.tx,fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,fontSize:'.92rem',marginBottom:'.3rem'}}>{t}</div>
              <div style={{color:D.t2,fontFamily:"'Inter',sans-serif",fontSize:'.78rem',lineHeight:1.6}}>{d}</div>
              <div style={{marginTop:'.85rem',color:`${c}88`,fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',letterSpacing:'1px'}}>EXPLORE MODULE →</div>
            </GC>
          ))}
        </div>
      </div>
    </div>
  );
}


// ── COMMAND CENTER ─────────────────────────────────────────
function Command(){
  return(
    <div style={{padding:'2rem',overflowY:'auto',height:'100%',animation:'page-in .4s ease'}}>
      <PH title="Command Center" sub="Real-time neural monitoring" ac={D.v} badge="ALL SYSTEMS ONLINE"
        right={<div style={{display:'flex',gap:'.5rem'}}><Badge color={D.g}>● NEURAL LIVE</Badge><Badge color={D.c}>ML ACTIVE</Badge></div>}/>

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1rem',marginBottom:'1.25rem'}}>
        <SC icon="🌾" label="Total Yield" num={84} unit="t/ha" sub="+12.3% this season" ac={D.g} delay={0}/>
        <SC icon="🌡️" label="Avg Temperature" num={284} unit="°C" sub="Optimal range" ac={D.o} delay={1}/>
        <SC icon="💧" label="Water Usage" value="3.2K" unit="m³" sub="18% efficiency gain" ac={D.c} delay={2}/>
        <SC icon="🧬" label="Soil Health" num={847} unit="%" sub="Neural scan: optimal" ac={D.v} delay={3}/>
      </div>

      {/* Main bento row */}
      <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:'1rem',marginBottom:'1rem'}}>
        <GC ac={D.v} style={{padding:'1.5rem',position:'relative'}}>
          <SL color={D.v}/>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem'}}>
            <div>
              <div style={{color:D.tx,fontFamily:"'Space Grotesk',sans-serif",fontWeight:600,fontSize:'.9rem'}}>Yield Intelligence Stream</div>
              <div style={{color:D.t3,fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',marginTop:2}}>PREDICTED × ACTUAL × OPTIMAL</div>
            </div>
            <div style={{display:'flex',gap:'.6rem'}}>
              {[[D.v,'Pred'],[D.c,'Actual'],[D.g,'Optimal']].map(([c,l])=>(
                <span key={l} style={{display:'flex',alignItems:'center',gap:3,color:D.t2,fontSize:'.65rem',fontFamily:"'Inter',sans-serif"}}>
                  <span style={{width:18,height:2,background:c,display:'inline-block',borderRadius:1}}></span>{l}
                </span>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart data={YIELD_DATA}>
              <defs>
                {[[D.v,'gv'],[D.c,'gc'],[D.g,'gg']].map(([c,id])=>(
                  <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={c} stopOpacity={.3}/>
                    <stop offset="95%" stopColor={c} stopOpacity={0}/>
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 8" stroke="rgba(255,255,255,.04)"/>
              <XAxis dataKey="m" stroke="rgba(255,255,255,.15)" fontSize={10} fontFamily="monospace"/>
              <YAxis stroke="rgba(255,255,255,.15)" fontSize={10} fontFamily="monospace"/>
              <Tooltip {...TT}/>
              <Area type="monotone" dataKey="p" stroke={D.v} fill="url(#gv)" strokeWidth={2.5} name="Predicted"/>
              <Area type="monotone" dataKey="a" stroke={D.c} fill="url(#gc)" strokeWidth={2}   name="Actual"/>
              <Area type="monotone" dataKey="o" stroke={D.g} fill="url(#gg)" strokeWidth={1.5} strokeDasharray="5 3" name="Optimal"/>
            </AreaChart>
          </ResponsiveContainer>
        </GC>

        <GC ac={D.vl} style={{padding:'1.5rem'}}>
          <div style={{color:D.tx,fontFamily:"'Space Grotesk',sans-serif",fontWeight:600,fontSize:'.9rem',marginBottom:'1rem'}}>Neural Engine</div>
          <NNet w={280} h={165}/>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'.5rem',marginTop:'.85rem'}}>
            {[['Layers','13',D.v],['Nodes','2048',D.c],['Accuracy','98.7%',D.g],['Status','LIVE',D.vl]].map(([l,v,c])=>(
              <div key={l} style={{background:'rgba(0,0,0,.3)',borderRadius:8,padding:'.4rem .65rem'}}>
                <div style={{color:D.t3,fontSize:'.55rem',fontFamily:"'JetBrains Mono',monospace"}}>{l}</div>
                <div style={{color:c,fontSize:'.78rem',fontFamily:"'Space Grotesk',sans-serif",fontWeight:700}}>{v}</div>
              </div>
            ))}
          </div>
        </GC>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'1rem'}}>
        <GC ac={D.o} style={{padding:'1.25rem'}}>
          <div style={{color:D.tx,fontFamily:"'Space Grotesk',sans-serif",fontWeight:600,fontSize:'.85rem',marginBottom:'.85rem'}}>Climate Matrix</div>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={CLIMATE_DATA}>
              <CartesianGrid strokeDasharray="3 8" stroke="rgba(255,255,255,.04)"/>
              <XAxis dataKey="t" stroke="rgba(255,255,255,.15)" fontSize={9} fontFamily="monospace"/>
              <Tooltip {...TT}/>
              <Bar dataKey="temp" fill={D.o} fillOpacity={.8} radius={[3,3,0,0]} name="°C"/>
            </BarChart>
          </ResponsiveContainer>
        </GC>

        <GC ac={D.c} style={{padding:'1.25rem'}}>
          <div style={{color:D.tx,fontFamily:"'Space Grotesk',sans-serif",fontWeight:600,fontSize:'.85rem',marginBottom:'.85rem'}}>Hydro Network</div>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={HYDRO_DATA}>
              <CartesianGrid strokeDasharray="3 8" stroke="rgba(255,255,255,.04)"/>
              <XAxis dataKey="z" stroke="rgba(255,255,255,.15)" fontSize={9} fontFamily="monospace"/>
              <Tooltip {...TT}/>
              <Bar dataKey="use" fill={D.c} fillOpacity={.75} radius={[3,3,0,0]} name="m³"/>
              <Bar dataKey="opt" fill={D.g} fillOpacity={.55} radius={[3,3,0,0]} name="Optimal"/>
            </BarChart>
          </ResponsiveContainer>
        </GC>

        <GC ac="#ef4444" style={{padding:'1.25rem'}}>
          <div style={{color:D.tx,fontFamily:"'Space Grotesk',sans-serif",fontWeight:600,fontSize:'.85rem',marginBottom:'.85rem'}}>Live Alerts</div>
          {[{l:'INFO',m:'Soil optimal — Zone B',c:D.g,t:'2m'},{l:'WARN',m:'Temp spike — Zone C NW',c:D.o,t:'8m'},{l:'CRIT',m:'Pump A3 offline',c:'#ef4444',t:'15m'},{l:'INFO',m:'ML model retrained',c:D.c,t:'32m'}].map(({l,m,c,t},i)=>(
            <div key={i} style={{display:'flex',gap:'.45rem',marginBottom:'.52rem',padding:'.4rem .6rem',background:`${c}08`,borderRadius:8,border:`1px solid ${c}18`}}>
              <span style={{color:c,fontSize:'.52rem',fontFamily:"'JetBrains Mono',monospace",flexShrink:0,marginTop:1}}>[{l}]</span>
              <span style={{color:D.t2,fontSize:'.68rem',fontFamily:"'Inter',sans-serif",flex:1,lineHeight:1.4}}>{m}</span>
              <span style={{color:D.t3,fontSize:'.58rem',fontFamily:"'JetBrains Mono',monospace",flexShrink:0}}>{t}</span>
            </div>
          ))}
        </GC>
      </div>
    </div>
  );
}

// ── YIELD INTELLIGENCE ─────────────────────────────────────
function Yield(){
  const [form,setForm]=useState({crop:'Rice',soil:'Loamy',temp:28,hum:65,rain:800,fert:120,irri:'Drip'});
  const [res,setRes]=useState(null);
  const [run,setRun]=useState(false);
  const [prog,setProg]=useState(0);
  const [hist,setHist]=useState([
    {id:1,crop:'Rice',date:'2024-01-15',yield:'6.8 t/ha',acc:'94.2%',status:'Excellent'},
    {id:2,crop:'Wheat',date:'2024-01-14',yield:'4.5 t/ha',acc:'91.7%',status:'Good'},
    {id:3,crop:'Corn',date:'2024-01-13',yield:'8.2 t/ha',acc:'96.1%',status:'Excellent'},
  ]);
  const SC2={width:'100%',padding:'.6rem .85rem',borderRadius:9,background:'rgba(0,0,0,.35)',border:'1px solid rgba(255,255,255,.08)',color:D.tx,fontSize:'.82rem',fontFamily:"'Inter',sans-serif",marginBottom:'.85rem'};
  const STATUS={Excellent:D.g,Good:D.c,Optimal:D.v,Suboptimal:D.o,Fair:D.o,Poor:'#ef4444'};

  const execute=async()=>{
    setRun(true);setRes(null);setProg(0);
    for(let i=0;i<=100;i+=4){await new Promise(r=>setTimeout(r,52));setProg(i);}
    const base={Rice:5.5,Wheat:4.0,Corn:7.0,Soybeans:3.5,Cotton:1.8}[form.crop]||5;
    const v=Math.max(.5,base*(0.75+(form.fert/300)*.4)*(0.8+(form.rain/3000)*.4));
    const acc=(89+Math.random()*9).toFixed(1);
    const status=v>=base*1.1?'Excellent':v>=base*.9?'Good':'Fair';
    const r={yield:v.toFixed(2),acc,status,base,imp:((v-base)/base*100).toFixed(1)};
    setRes(r);
    setHist(h=>[{id:h.length+1,crop:form.crop,date:new Date().toISOString().split('T')[0],yield:`${r.yield} t/ha`,acc:`${r.acc}%`,status:r.status},...h.slice(0,9)]);
    setRun(false);
  };

  return(
    <div style={{padding:'2rem',overflowY:'auto',height:'100%',animation:'page-in .4s ease'}}>
      <PH title="Yield Intelligence" sub="Neural prediction engine" ac={D.g} badge="RF + LSTM MODEL"/>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1.5rem',marginBottom:'1.5rem'}}>
        <GC ac={D.g} style={{padding:'1.5rem'}}>
          <div style={{color:D.tx,fontFamily:"'Space Grotesk',sans-serif",fontWeight:600,fontSize:'.92rem',marginBottom:'1.25rem'}}>Model Parameters</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'.75rem',marginBottom:'.25rem'}}>
            {[{k:'crop',l:'Crop Type',o:['Rice','Wheat','Corn','Soybeans','Cotton']},{k:'soil',l:'Soil Class',o:['Loamy','Sandy','Clay','Silty','Peaty']}].map(({k,l,o})=>(
              <div key={k}>
                <div style={{color:D.t3,fontSize:'.62rem',fontFamily:"'JetBrains Mono',monospace",letterSpacing:'1px',marginBottom:'.3rem',textTransform:'uppercase'}}>{l}</div>
                <select style={SC2} value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))}>
                  {o.map(x=><option key={x}>{x}</option>)}
                </select>
              </div>
            ))}
          </div>
          <div style={{marginBottom:'.85rem'}}>
            <div style={{color:D.t3,fontSize:'.62rem',fontFamily:"'JetBrains Mono',monospace",letterSpacing:'1px',marginBottom:'.3rem',textTransform:'uppercase'}}>Irrigation Method</div>
            <select style={SC2} value={form.irri} onChange={e=>setForm(f=>({...f,irri:e.target.value}))}>
              {['Drip','Sprinkler','Flood','Rain-fed'].map(x=><option key={x}>{x}</option>)}
            </select>
          </div>

          {[{k:'temp',l:'Temperature',min:5,max:45,unit:'°C',c:D.o},{k:'hum',l:'Humidity',min:20,max:100,unit:'%',c:D.c},{k:'rain',l:'Rainfall',min:0,max:3000,unit:'mm',c:D.g},{k:'fert',l:'Fertilizer',min:0,max:300,unit:'kg/ha',c:D.v}].map(({k,l,min,max,unit,c})=>{
            const pct=((form[k]-min)/(max-min))*100;
            return(
              <div key={k} style={{marginBottom:'.9rem'}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                  <span style={{color:D.t3,fontSize:'.62rem',fontFamily:"'JetBrains Mono',monospace",letterSpacing:'1px',textTransform:'uppercase'}}>{l}</span>
                  <span style={{color:c,fontSize:'.78rem',fontFamily:"'Space Grotesk',sans-serif",fontWeight:700}}>{form[k]} <span style={{fontSize:'.6rem',fontWeight:400,opacity:.7}}>{unit}</span></span>
                </div>
                <div style={{position:'relative',height:5,background:'rgba(255,255,255,.06)',borderRadius:3}}>
                  <div style={{position:'absolute',left:0,top:0,height:'100%',width:`${pct}%`,background:`linear-gradient(90deg,${c}66,${c})`,borderRadius:3,boxShadow:`0 0 8px ${c}77`}}/>
                  <input type="range" min={min} max={max} value={form[k]} onChange={e=>setForm(f=>({...f,[k]:+e.target.value}))} style={{position:'absolute',inset:'-9px 0',opacity:0,width:'100%'}}/>
                </div>
              </div>
            );
          })}

          <MB color={D.g} onClick={execute} disabled={run} style={{width:'100%',marginTop:'1.1rem',padding:'.85rem',fontSize:'.9rem'}}>
            {run?`⟳ Processing ${prog}%…`:'⚡ Execute Prediction'}
          </MB>
          {run&&<div style={{marginTop:'.7rem',height:3,background:`${D.g}14`,borderRadius:2,overflow:'hidden'}}><div style={{height:'100%',width:`${prog}%`,background:`linear-gradient(90deg,${D.v},${D.c})`,transition:'width .06s',boxShadow:`0 0 10px ${D.v}`}}/></div>}
        </GC>

        <div>
          {!res&&!run&&(
            <GC style={{height:'100%',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',border:`1px dashed rgba(255,255,255,.07)`,minHeight:420}} noHover>
              <div style={{fontSize:'3.5rem',marginBottom:'1rem',animation:'float 4s ease-in-out infinite',filter:`drop-shadow(0 0 20px ${D.g}44)`}}>🌾</div>
              <div style={{color:D.t3,fontFamily:"'Inter',sans-serif",fontSize:'.85rem',textAlign:'center',maxWidth:200,lineHeight:1.8}}>Configure parameters and execute the neural engine</div>
            </GC>
          )}
          {run&&(
            <GC style={{height:'100%',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:420}} noHover>
              <NNet w={300} h={180}/>
              <div style={{marginTop:'1rem',color:D.vl,fontFamily:"'JetBrains Mono',monospace",fontSize:'.7rem',letterSpacing:'2px'}}>NEURAL ENGINE PROCESSING…</div>
              {['Preprocessing feature vectors','Running Random Forest inference','LSTM sequence analysis','Ensemble confidence scoring','Generating recommendations'].map((s,i)=>(
                <div key={i} style={{display:'flex',alignItems:'center',gap:'.5rem',color:`${D.v}66`,fontFamily:"'JetBrains Mono',monospace",fontSize:'.62rem',marginTop:'.3rem'}}>
                  <span style={{color:D.g}}>✓</span>{s}
                </div>
              ))}
            </GC>
          )}
          {res&&!run&&(
            <GC ac={STATUS[res.status]||D.g} style={{padding:'1.75rem',position:'relative',overflow:'hidden'}}>
              <SL color={STATUS[res.status]||D.g}/>
              <div style={{textAlign:'center',background:'rgba(0,0,0,.35)',borderRadius:14,padding:'1.5rem',marginBottom:'1.1rem'}}>
                <div style={{color:D.t3,fontSize:'.6rem',fontFamily:"'JetBrains Mono',monospace",letterSpacing:'3px',marginBottom:'.4rem'}}>NEURAL OUTPUT</div>
                <div style={{color:STATUS[res.status]||D.g,fontSize:'4.5rem',fontWeight:800,fontFamily:"'Space Grotesk',sans-serif",lineHeight:1,textShadow:`0 0 40px ${STATUS[res.status]}88`}}>{res.yield}</div>
                <div style={{color:D.t3,fontFamily:"'JetBrains Mono',monospace",fontSize:'.72rem'}}>tonnes / hectare</div>
                <div style={{display:'flex',justifyContent:'center',gap:'.65rem',marginTop:'.85rem'}}>
                  <Badge color={STATUS[res.status]||D.g}>{res.status.toUpperCase()}</Badge>
                  <Badge color={D.v}>ACC: {res.acc}%</Badge>
                </div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'.6rem',marginBottom:'1.1rem'}}>
                {[['Baseline',`${res.base} t/ha`,D.c],['Improvement',`${res.imp>=0?'+':''}${res.imp}%`,res.imp>=0?D.g:'#ef4444'],['Model','RF+LSTM',D.v]].map(([l,v,c])=>(
                  <div key={l} style={{background:'rgba(0,0,0,.3)',borderRadius:9,padding:'.65rem',textAlign:'center'}}>
                    <div style={{color:D.t3,fontSize:'.55rem',fontFamily:"'JetBrains Mono',monospace"}}>{l}</div>
                    <div style={{color:c,fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,fontSize:'.85rem'}}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{color:D.t3,fontSize:'.6rem',fontFamily:"'JetBrains Mono',monospace",letterSpacing:'2px',marginBottom:'.6rem',textTransform:'uppercase'}}>AI Recommendations</div>
              {['Maintain fertilizer cadence at 14-day intervals','Pre-harvest moisture check in 72 hours','Document conditions — exceeds regional benchmark'].map((r,i)=>(
                <div key={i} style={{display:'flex',gap:'.5rem',marginBottom:'.45rem'}}>
                  <span style={{color:D.g,fontSize:'.7rem'}}>→</span>
                  <span style={{color:D.t2,fontSize:'.72rem',fontFamily:"'Inter',sans-serif",lineHeight:1.5}}>{r}</span>
                </div>
              ))}
            </GC>
          )}
        </div>
      </div>

      <GC ac={D.v} style={{padding:'1.5rem'}}>
        <div style={{color:D.tx,fontFamily:"'Space Grotesk',sans-serif",fontWeight:600,fontSize:'.9rem',marginBottom:'1rem'}}>Prediction History</div>
        <table style={{width:'100%',borderCollapse:'collapse',fontFamily:"'Inter',sans-serif",fontSize:'.78rem'}}>
          <thead><tr>{['ID','Crop','Date','Yield','Accuracy','Status'].map(h=><th key={h} style={{textAlign:'left',padding:'.42rem .7rem',color:D.t3,borderBottom:'1px solid rgba(255,255,255,.05)',fontSize:'.65rem',letterSpacing:'.5px',fontWeight:500,textTransform:'uppercase'}}>{h}</th>)}</tr></thead>
          <tbody>{hist.map(r=>(
            <tr key={r.id} style={{borderBottom:'1px solid rgba(255,255,255,.03)'}}>
              <td style={{padding:'.52rem .7rem',color:D.t3,fontFamily:"'JetBrains Mono',monospace",fontSize:'.7rem'}}>#{r.id}</td>
              <td style={{padding:'.52rem .7rem',color:D.tx,fontWeight:500}}>{r.crop}</td>
              <td style={{padding:'.52rem .7rem',color:D.t2,fontFamily:"'JetBrains Mono',monospace",fontSize:'.7rem'}}>{r.date}</td>
              <td style={{padding:'.52rem .7rem',color:D.g,fontWeight:700,fontFamily:"'Space Grotesk',sans-serif"}}>{r.yield}</td>
              <td style={{padding:'.52rem .7rem',color:D.v,fontFamily:"'JetBrains Mono',monospace",fontSize:'.7rem'}}>{r.acc}</td>
              <td style={{padding:'.52rem .7rem'}}><span style={{background:`${STATUS[r.status]||D.g}14`,color:STATUS[r.status]||D.g,padding:'3px 10px',borderRadius:20,fontSize:'.62rem',fontWeight:600}}>{r.status}</span></td>
            </tr>
          ))}</tbody>
        </table>
      </GC>
    </div>
  );
}

// ── CLIMATE MATRIX ─────────────────────────────────────────
function Climate(){
  const [s,setS]=useState('Dubai');
  const [wx,setWx]=useState(null);
  const [fc,setFc]=useState([]);
  const [load,setLoad]=useState(false);
  const [err,setErr]=useState('');
  const DAYS=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const wE=c=>{if(!c)return'🌤️';if(c<300)return'⛈️';if(c<400)return'🌦️';if(c<600)return'🌧️';if(c<700)return'🌨️';if(c<800)return'🌫️';if(c===800)return'☀️';return'⛅';};
  const fw=async(city)=>{
    setLoad(true);setErr('');
    try{
      const r=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${OWM}&units=metric`);
      if(!r.ok)throw new Error(r.status===404?'City not found':'Invalid API key');
      const d=await r.json();setWx(d);
      const fr=await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${OWM}&units=metric&cnt=40`);
      const fd=await fr.json();
      setFc(fd.list.filter(i=>i.dt_txt.includes('12:00:00')).slice(0,5));
    }catch(e){setErr(e.message);}
    setLoad(false);
  };
  useEffect(()=>{fw('Dubai');},[]);
  const impact=w=>{if(!w)return[];const t=w.main.temp,h=w.main.humidity,ws=w.wind.speed*3.6;return[
    {ok:t>=15&&t<=35,txt:`Temp ${t.toFixed(1)}°C — ${t>35?'heat stress risk':t<15?'cold stress risk':'optimal for most crops'}`},
    {ok:h>=40&&h<=80,txt:`Humidity ${h}% — ${h>80?'fungal disease risk':h<40?'drought stress':'favorable range'}`},
    {ok:ws<25,txt:`Wind ${ws.toFixed(0)} km/h — ${ws>40?'suspend operations':ws>20?'delay spraying':'clear for field work'}`},
  ];};

  return(
    <div style={{padding:'2rem',overflowY:'auto',height:'100%',animation:'page-in .4s ease'}}>
      <PH title="Climate Matrix" sub="Satellite weather fusion" ac={D.c} badge="LIVE DATA"/>
      <GC ac={D.c} style={{padding:'1.25rem',marginBottom:'1.25rem'}}>
        <div style={{display:'flex',gap:'.75rem'}}>
          <div style={{flex:1,position:'relative'}}>
            <span style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)'}}>🌍</span>
            <input value={s} onChange={e=>setS(e.target.value)} onKeyDown={e=>e.key==='Enter'&&fw(s)}
              placeholder="Search any city…"
              style={{width:'100%',padding:'.65rem 1rem .65rem 2.3rem',borderRadius:10,background:'rgba(0,0,0,.35)',border:`1px solid ${D.c}25`,color:D.tx,fontFamily:"'Inter',sans-serif",fontSize:'.88rem',boxSizing:'border-box'}}/>
          </div>
          <MB color={D.c} onClick={()=>fw(s)} disabled={load}>{load?'Scanning…':'⚡ Scan Weather'}</MB>
        </div>
        {err&&<div style={{marginTop:'.65rem',color:'#ef4444',fontFamily:"'JetBrains Mono',monospace",fontSize:'.72rem'}}>❌ {err}</div>}
      </GC>

      {wx&&!load&&(
        <>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1rem',marginBottom:'1.25rem'}}>
            <SC icon="🌡️" label="Temperature" value={`${Math.round(wx.main.temp)}°C`}     ac={D.o} delay={0}/>
            <SC icon="💧" label="Humidity"    value={`${wx.main.humidity}%`}               ac={D.c} delay={1}/>
            <SC icon="💨" label="Wind Speed"  value={`${(wx.wind.speed*3.6).toFixed(0)} km/h`} ac={D.g} delay={2}/>
            <SC icon="🌡️" label="Feels Like"  value={`${Math.round(wx.main.feels_like)}°C`}    ac={D.v} delay={3}/>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'1.5fr 1fr',gap:'1rem',marginBottom:'1rem'}}>
            <GC ac={D.o} style={{padding:'1.5rem'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'1.25rem'}}>
                <div>
                  <div style={{color:D.tx,fontFamily:"'Space Grotesk',sans-serif",fontWeight:600,fontSize:'1rem'}}>{wx.name}, {wx.sys.country}</div>
                  <div style={{color:D.t2,fontFamily:"'Inter',sans-serif",fontSize:'.8rem',marginTop:2,textTransform:'capitalize'}}>{wx.weather[0]?.description}</div>
                </div>
                <div style={{fontSize:'4rem'}}>{wE(wx.weather[0]?.id)}</div>
              </div>
              <div style={{color:D.o,fontSize:'3.5rem',fontWeight:800,fontFamily:"'Space Grotesk',sans-serif",lineHeight:1,marginBottom:'.35rem',textShadow:`0 0 30px ${D.o}66`}}>{Math.round(wx.main.temp)}°C</div>
              <div style={{color:D.t3,fontFamily:"'JetBrains Mono',monospace",fontSize:'.72rem',marginBottom:'1.25rem'}}>Feels like {Math.round(wx.main.feels_like)}°C</div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'.5rem'}}>
                {[['🌅','Sunrise',new Date(wx.sys.sunrise*1000).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})],['🌇','Sunset',new Date(wx.sys.sunset*1000).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})],['🔺','Max',`${Math.round(wx.main.temp_max)}°`],['🔻','Min',`${Math.round(wx.main.temp_min)}°`]].map(([ic,l,v])=>(
                  <div key={l} style={{background:'rgba(0,0,0,.3)',borderRadius:9,padding:'.55rem',textAlign:'center'}}>
                    <div style={{fontSize:'.9rem',marginBottom:2}}>{ic}</div>
                    <div style={{color:D.t3,fontSize:'.52rem',fontFamily:"'JetBrains Mono',monospace"}}>{l}</div>
                    <div style={{color:D.o,fontSize:'.75rem',fontFamily:"'Space Grotesk',sans-serif",fontWeight:700}}>{v}</div>
                  </div>
                ))}
              </div>
            </GC>

            <GC ac={D.g} style={{padding:'1.5rem'}}>
              <div style={{color:D.tx,fontFamily:"'Space Grotesk',sans-serif",fontWeight:600,fontSize:'.9rem',marginBottom:'1rem'}}>🌾 Farming Impact</div>
              {impact(wx).map((a,i)=>(
                <div key={i} style={{display:'flex',gap:'.55rem',marginBottom:'.65rem',padding:'.65rem',borderRadius:10,background:a.ok?`${D.g}08`:`${D.o}08`,border:`1px solid ${a.ok?D.g:D.o}1a`}}>
                  <span style={{flexShrink:0,fontSize:'.85rem'}}>{a.ok?'✅':'⚠️'}</span>
                  <span style={{color:a.ok?'#6ee7b7':'#fed7aa',fontFamily:"'Inter',sans-serif",fontSize:'.72rem',lineHeight:1.6}}>{a.txt}</span>
                </div>
              ))}
            </GC>
          </div>

          {fc.length>0&&(
            <GC ac={D.c} style={{padding:'1.5rem'}}>
              <div style={{color:D.tx,fontFamily:"'Space Grotesk',sans-serif",fontWeight:600,fontSize:'.9rem',marginBottom:'1rem'}}>5-Day Forecast</div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:'.75rem'}}>
                {fc.map((day,i)=>{
                  const d=new Date(day.dt*1000);
                  const rain=day.pop?Math.round(day.pop*100):0;
                  return(
                    <div key={i} style={{background:'rgba(0,0,0,.3)',borderRadius:12,padding:'1rem .5rem',textAlign:'center',border:`1px solid ${D.c}14`}}>
                      <div style={{color:D.t3,fontSize:'.62rem',fontFamily:"'JetBrains Mono',monospace",marginBottom:'.35rem',fontWeight:600}}>{DAYS[d.getDay()]}</div>
                      <div style={{fontSize:'2rem',margin:'.35rem 0'}}>{wE(day.weather[0]?.id)}</div>
                      <div style={{color:D.t2,fontSize:'.65rem',fontFamily:"'Inter',sans-serif",textTransform:'capitalize',marginBottom:'.45rem'}}>{day.weather[0]?.description}</div>
                      <div style={{color:D.o,fontSize:'.9rem',fontWeight:700,fontFamily:"'Space Grotesk',sans-serif"}}>{Math.round(day.main.temp_max)}°</div>
                      <div style={{color:D.t3,fontSize:'.78rem',fontFamily:"'JetBrains Mono',monospace"}}>{Math.round(day.main.temp_min)}°</div>
                      <div style={{color:D.c,fontSize:'.62rem',marginTop:'.35rem',fontFamily:"'JetBrains Mono',monospace"}}>💧 {day.main.humidity}%</div>
                      {rain>0&&<div style={{color:'#93c5fd',fontSize:'.6rem',fontFamily:"'JetBrains Mono',monospace"}}>🌧 {rain}%</div>}
                    </div>
                  );
                })}
              </div>
            </GC>
          )}
        </>
      )}
      {load&&<GC style={{textAlign:'center',padding:'3.5rem'}} noHover><div style={{fontSize:'3rem',marginBottom:'.75rem',animation:'float 3s ease-in-out infinite'}}>🌍</div><div style={{color:D.t3,fontFamily:"'Inter',sans-serif"}}>Scanning satellite data for {s}…</div></GC>}
    </div>
  );
}

// ── HYDRO AI ───────────────────────────────────────────────
function Hydro(){
  return(
    <div style={{padding:'2rem',overflowY:'auto',height:'100%',animation:'page-in .4s ease'}}>
      <PH title="Hydro AI" sub="Precision irrigation intelligence" ac={D.c} badge="IOT SENSORS ONLINE"/>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1rem',marginBottom:'1.5rem'}}>
        <SC icon="💧" label="Total Usage"   num={198} unit="K m³/d" sub="↓ 18% optimized"      ac={D.c} delay={0}/>
        <SC icon="♻️" label="Efficiency"    num={924} unit="%"      sub="AI-optimized"           ac={D.g} delay={1}/>
        <SC icon="⚡" label="Pump Energy"   value="4.2" unit="kWh/m³" sub="↓ 12% vs baseline"   ac={D.o} delay={2}/>
        <SC icon="🗓️" label="Next Cycle"    value="14:30" unit="HRS"  sub="Auto-scheduled"       ac={D.v} delay={3}/>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:'1rem',marginBottom:'1rem'}}>
        <GC ac={D.c} style={{padding:'1.5rem'}}>
          <div style={{color:D.tx,fontFamily:"'Space Grotesk',sans-serif",fontWeight:600,fontSize:'.9rem',marginBottom:'1rem'}}>Zone Water Matrix</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={HYDRO_DATA}>
              <CartesianGrid strokeDasharray="3 8" stroke="rgba(255,255,255,.04)"/>
              <XAxis dataKey="z" stroke="rgba(255,255,255,.15)" fontSize={10} fontFamily="'Inter',sans-serif"/>
              <YAxis stroke="rgba(255,255,255,.15)" fontSize={10} fontFamily="'Inter',sans-serif"/>
              <Tooltip {...TT}/>
              <Bar dataKey="use" fill={D.c} fillOpacity={.8} radius={[4,4,0,0]} name="Usage m³"/>
              <Bar dataKey="opt" fill={D.g} fillOpacity={.65} radius={[4,4,0,0]} name="Optimal m³"/>
            </BarChart>
          </ResponsiveContainer>
        </GC>
        <GC ac={D.g} style={{padding:'1.5rem'}}>
          <div style={{color:D.tx,fontFamily:"'Space Grotesk',sans-serif",fontWeight:600,fontSize:'.9rem',marginBottom:'1rem'}}>Sensor Network</div>
          {[{z:'Zone A',m:72,s:'Optimal',c:D.g},{z:'Zone B',m:88,s:'High',c:D.o},{z:'Zone C',m:45,s:'Dry',c:'#ef4444'},{z:'Zone D',m:68,s:'Optimal',c:D.g},{z:'Zone E',m:55,s:'Low',c:D.o}].map(({z,m,s,c})=>(
            <div key={z} style={{marginBottom:'.8rem'}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                <span style={{color:D.t2,fontSize:'.72rem',fontFamily:"'Inter',sans-serif",fontWeight:500}}>{z}</span>
                <span style={{color:c,fontSize:'.65rem',fontFamily:"'JetBrains Mono',monospace"}}>{s} {m}%</span>
              </div>
              <div style={{height:5,background:'rgba(255,255,255,.06)',borderRadius:3}}>
                <div style={{height:'100%',width:`${m}%`,background:`linear-gradient(90deg,${c}66,${c})`,borderRadius:3,boxShadow:`0 0 6px ${c}55`}}/>
              </div>
            </div>
          ))}
        </GC>
      </div>
      <GC ac={D.c} style={{padding:'1.5rem'}}>
        <div style={{color:D.tx,fontFamily:"'Space Grotesk',sans-serif",fontWeight:600,fontSize:'.9rem',marginBottom:'1rem'}}>AI Irrigation Schedule — Next 7 Days</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:'.7rem'}}>
          {['MON','TUE','WED','THU','FRI','SAT','SUN'].map((d,i)=>{
            const vol=Math.round(1200+Math.random()*1800);
            const c=vol>2500?'#ef4444':vol>2000?D.o:D.c;
            return(
              <div key={d} style={{background:'rgba(0,0,0,.3)',borderRadius:12,padding:'.9rem .5rem',textAlign:'center',border:`1px solid ${c}15`}}>
                <div style={{color:D.t3,fontSize:'.6rem',fontFamily:"'JetBrains Mono',monospace",marginBottom:'.4rem'}}>{d}</div>
                <div style={{fontSize:'1.5rem',margin:'.35rem 0'}}>{['💧','🌧️','☀️','💦','🌤️','💧','🌧️'][i]}</div>
                <div style={{color:c,fontSize:'.72rem',fontFamily:"'Space Grotesk',sans-serif",fontWeight:700}}>{vol}</div>
                <div style={{color:D.t3,fontSize:'.52rem',fontFamily:"'JetBrains Mono',monospace"}}>m³</div>
              </div>
            );
          })}
        </div>
      </GC>
    </div>
  );
}

// ── SOIL NEURAL SCAN ───────────────────────────────────────
function Soil(){
  const [scan,setScan]=useState(false);
  const [done,setDone]=useState(false);
  const [pct,setPct]=useState(0);
  const doScan=async()=>{
    setScan(true);setDone(false);setPct(0);
    for(let i=0;i<=100;i+=2){await new Promise(r=>setTimeout(r,42));setPct(i);}
    setScan(false);setDone(true);
  };
  return(
    <div style={{padding:'2rem',overflowY:'auto',height:'100%',animation:'page-in .4s ease'}}>
      <PH title="Soil Neural Scan" sub="Spectroscopic deep learning diagnostics" ac={D.v} badge="MULTI-LAYER ANALYSIS"/>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1.5rem',marginBottom:'1.5rem'}}>
        <GC ac={D.v} style={{padding:'1.5rem',position:'relative',overflow:'hidden'}}>
          {scan&&<SL color={D.v}/>}
          <div style={{color:D.tx,fontFamily:"'Space Grotesk',sans-serif",fontWeight:600,fontSize:'.9rem',marginBottom:'1.5rem'}}>Neural Scan Interface</div>
          <div style={{position:'relative',height:220,background:'rgba(0,0,0,.45)',borderRadius:14,border:`1px solid ${D.v}18`,overflow:'hidden',marginBottom:'1.25rem',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <svg width="100%" height="100%" style={{position:'absolute',top:0,left:0}}>
              {Array.from({length:8},(_,i)=><line key={`h${i}`} x1="0" y1={`${(i+1)*11}%`} x2="100%" y2={`${(i+1)*11}%`} stroke={`${D.v}10`} strokeWidth="1"/>)}
              {Array.from({length:10},(_,i)=><line key={`v${i}`} x1={`${(i+1)*9}%`} y1="0" x2={`${(i+1)*9}%`} y2="100%" stroke={`${D.v}10`} strokeWidth="1"/>)}
              {scan&&<line x1="0" y1={`${pct}%`} x2="100%" y2={`${pct}%`} stroke={D.v} strokeWidth="2.5" style={{filter:`drop-shadow(0 0 6px ${D.v})`}}/>}
              {done&&[{x:25,y:30},{x:62,y:55},{x:80,y:25},{x:45,y:72}].map(({x,y},i)=>(
                <g key={i}>
                  <circle cx={`${x}%`} cy={`${y}%`} r="5" fill={D.v} opacity=".9"/>
                  <circle cx={`${x}%`} cy={`${y}%`} r="5" fill="none" stroke={D.v} strokeWidth="1.5">
                    <animate attributeName="r" values="5;20;5" dur="2s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values=".9;0;.9" dur="2s" repeatCount="indefinite"/>
                  </circle>
                </g>
              ))}
            </svg>
            <div style={{textAlign:'center',zIndex:2}}>
              {!scan&&!done&&<><div style={{fontSize:'2.5rem',opacity:.3,marginBottom:'.5rem'}}>🧬</div><div style={{color:`${D.v}44`,fontFamily:"'JetBrains Mono',monospace",fontSize:'.72rem'}}>AWAITING SCAN</div></>}
              {scan&&<><div style={{color:D.v,fontFamily:"'Space Grotesk',sans-serif",fontSize:'1.8rem',fontWeight:800,textShadow:`0 0 20px ${D.v}`}}>{pct}%</div><div style={{color:`${D.v}77`,fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',letterSpacing:'2px'}}>LAYER {Math.max(1,Math.ceil(pct/25))}/4</div></>}
              {done&&<><div style={{color:D.g,fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,fontSize:'.9rem'}}>Scan Complete ✓</div><div style={{color:`${D.g}77`,fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem'}}>Health: 84.7%</div></>}
            </div>
          </div>
          <MB color={D.v} onClick={doScan} disabled={scan} style={{width:'100%',padding:'.85rem'}}>
            {scan?`⟳ Scanning Layer ${Math.max(1,Math.ceil(pct/25))}/4…`:'🧬 Initiate Neural Scan'}
          </MB>
          {scan&&<div style={{marginTop:'.7rem',height:3,background:`${D.v}12`,borderRadius:2,overflow:'hidden'}}><div style={{height:'100%',width:`${pct}%`,background:`linear-gradient(90deg,${D.v},${D.c})`,transition:'width .05s',boxShadow:`0 0 10px ${D.v}`}}/></div>}
        </GC>

        <GC ac={D.g} style={{padding:'1.5rem'}}>
          <div style={{color:D.tx,fontFamily:"'Space Grotesk',sans-serif",fontWeight:600,fontSize:'.9rem',marginBottom:'1rem'}}>Nutrient Radar Profile</div>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={SOIL_DATA}>
              <PolarGrid stroke="rgba(255,255,255,.06)"/>
              <PolarAngleAxis dataKey="m" tick={{fill:D.t2,fontSize:11,fontFamily:"'JetBrains Mono',monospace"}}/>
              <Radar dataKey="v" stroke={D.g} fill={D.g} fillOpacity={.12} strokeWidth={2}/>
            </RadarChart>
          </ResponsiveContainer>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'.5rem',marginTop:'.75rem'}}>
            {SOIL_DATA.map(({m,v})=>(
              <div key={m} style={{background:'rgba(0,0,0,.3)',borderRadius:8,padding:'.42rem',textAlign:'center',border:`1px solid ${v>70?D.g:v>50?D.o:'#ef4444'}15`}}>
                <div style={{color:D.t3,fontSize:'.55rem',fontFamily:"'JetBrains Mono',monospace"}}>{m}</div>
                <div style={{color:v>70?D.g:v>50?D.o:'#ef4444',fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,fontSize:'.8rem'}}>{v}%</div>
              </div>
            ))}
          </div>
        </GC>
      </div>

      <GC ac={D.v} style={{padding:'1.5rem'}}>
        <div style={{color:D.tx,fontFamily:"'Space Grotesk',sans-serif",fontWeight:600,fontSize:'.9rem',marginBottom:'1rem'}}>Depth Layer Analysis</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1rem'}}>
          {[{d:'0–20 cm',n:'Topsoil',h:88,ph:6.8,c:D.g},{d:'20–40 cm',n:'Subsoil A',h:75,ph:7.1,c:D.c},{d:'40–60 cm',n:'Subsoil B',h:62,ph:7.4,c:D.o},{d:'60–100 cm',n:'Deep Layer',h:45,ph:7.8,c:D.v}].map(({d,n,h,ph,c})=>(
            <div key={d} style={{background:'rgba(0,0,0,.35)',borderRadius:12,padding:'1.1rem',border:`1px solid ${c}18`}}>
              <div style={{color:`${c}88`,fontSize:'.58rem',fontFamily:"'JetBrains Mono',monospace",letterSpacing:'1px',marginBottom:'.2rem',textTransform:'uppercase'}}>{d}</div>
              <div style={{color:D.t2,fontFamily:"'Space Grotesk',sans-serif",fontWeight:600,fontSize:'.75rem',marginBottom:'.75rem'}}>{n}</div>
              <div style={{height:56,background:`${c}0c`,borderRadius:9,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'.6rem',border:`1px solid ${c}18`}}>
                <div style={{color:c,fontSize:'1.4rem',fontFamily:"'Space Grotesk',sans-serif",fontWeight:800,textShadow:`0 0 16px ${c}88`}}>{h}%</div>
              </div>
              <div style={{display:'flex',justifyContent:'space-between'}}>
                <span style={{color:D.t3,fontSize:'.6rem',fontFamily:"'JetBrains Mono',monospace"}}>pH</span>
                <span style={{color:c,fontSize:'.65rem',fontFamily:"'Space Grotesk',sans-serif",fontWeight:600}}>{ph}</span>
              </div>
            </div>
          ))}
        </div>
      </GC>
    </div>
  );
}

// ── TERRA ASSISTANT ────────────────────────────────────────
function Assistant(){
  const [msgs,setMsgs]=useState([{role:'assistant',content:'Hello! I\'m Terra AI, your neural agricultural intelligence.\n\nI can help with crop yield optimization, soil health, irrigation strategies, climate analysis, and precision farming. What would you like to improve today?'}]);
  const [inp,setInp]=useState('');
  const [busy,setBusy]=useState(false);
  const end=useRef(null);
  useEffect(()=>{end.current?.scrollIntoView({behavior:'smooth'});},[msgs]);
  const QUICK=['Optimize rice yield for loamy soil in 35°C','Best fertilizer for wheat in monsoon season','Irrigation schedule for corn — Zone B moisture low','How to correct soil pH from 8.2 to optimal 6.8'];
  const send=async()=>{
    if(!inp.trim()||busy)return;
    const t=inp.trim();setInp('');setBusy(true);
    setMsgs(m=>[...m,{role:'user',content:t}]);
    try{
      const res=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:1000,system:'You are Terra AI, an expert agricultural intelligence system with deep expertise in crop science, soil chemistry, precision agriculture, irrigation, and AI-driven farming. Provide specific, data-driven, actionable advice with precise numbers. Keep responses concise and highly practical. Use bullet points for lists.',messages:msgs.concat({role:'user',content:t}).map(m=>({role:m.role,content:m.content}))})});
      const d=await res.json();
      setMsgs(m=>[...m,{role:'assistant',content:d.content?.[0]?.text||'Processing error — please retry.'}]);
    }catch{setMsgs(m=>[...m,{role:'assistant',content:'Connection error — please check network and retry.'}]);}
    setBusy(false);
  };
  return(
    <div style={{padding:'2rem',display:'flex',flexDirection:'column',height:'100%',animation:'page-in .4s ease'}}>
      <PH title="Terra Assistant" sub="Neural AI advisor" ac={D.v} badge="CLAUDE POWERED"/>
      <div style={{display:'flex',gap:'.5rem',flexWrap:'wrap',marginBottom:'1rem'}}>
        {QUICK.map((q,i)=>(
          <button key={i} onClick={()=>setInp(q)} style={{padding:'.32rem .85rem',borderRadius:20,border:`1px solid ${D.v}25`,background:`${D.v}08`,color:`${D.vl}cc`,fontFamily:"'Inter',sans-serif",fontSize:'.72rem',fontWeight:500,transition:'all .2s'}}>
            {q}
          </button>
        ))}
      </div>

      <GC ac={D.v} style={{flex:1,overflowY:'auto',padding:'1.25rem',marginBottom:'1rem',minHeight:0}} noHover>
        {msgs.map((m,i)=>(
          <div key={i} style={{display:'flex',justifyContent:m.role==='user'?'flex-end':'flex-start',marginBottom:'1rem',animation:'fade-in .3s ease'}}>
            {m.role==='assistant'&&(
              <div style={{width:32,height:32,borderRadius:'50%',background:`linear-gradient(135deg,${D.v},${D.c})`,display:'flex',alignItems:'center',justifyContent:'center',marginRight:10,flexShrink:0,marginTop:4,fontSize:'.9rem',boxShadow:`0 0 14px ${D.v}44`}}>🤖</div>
            )}
            <div style={{maxWidth:'76%',padding:'.82rem 1.1rem',lineHeight:1.7,borderRadius:m.role==='user'?'14px 14px 4px 14px':'14px 14px 14px 4px',background:m.role==='user'?`${D.v}14`:'rgba(0,0,0,.4)',border:`1px solid ${m.role==='user'?`${D.v}28`:'rgba(255,255,255,.06)'}`,color:D.tx,fontFamily:"'Inter',sans-serif",fontSize:'.82rem',whiteSpace:'pre-wrap',fontWeight:400}}>
              {m.content}
            </div>
          </div>
        ))}
        {busy&&(
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div style={{width:32,height:32,borderRadius:'50%',background:`${D.v}22`,border:`1px solid ${D.v}44`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.9rem'}}>🤖</div>
            <div style={{background:'rgba(0,0,0,.4)',border:'1px solid rgba(255,255,255,.06)',borderRadius:'14px',padding:'.82rem 1.1rem',display:'flex',gap:5}}>
              {[0,1,2].map(i=><div key={i} style={{width:7,height:7,borderRadius:'50%',background:D.v,animation:`node-p 1s ${i*.22}s ease-in-out infinite`}}/>)}
            </div>
          </div>
        )}
        <div ref={end}/>
      </GC>

      <div style={{display:'flex',gap:'.75rem',flexShrink:0}}>
        <input value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()}
          placeholder="Ask about yield, soil health, climate, irrigation…"
          style={{flex:1,padding:'.82rem 1.1rem',borderRadius:12,background:'rgba(5,8,20,.85)',border:`1px solid ${D.v}25`,color:D.tx,fontSize:'.85rem',fontFamily:"'Inter',sans-serif",boxShadow:`0 0 20px ${D.v}10`}}/>
        <MB color={D.v} onClick={send} disabled={busy||!inp.trim()} style={{padding:'.82rem 1.4rem'}}>Send →</MB>
      </div>
    </div>
  );
}

// ── ROOT APP ───────────────────────────────────────────────
export default function App(){
  const [auth,setAuth]=useState(false);
  const [user,setUser]=useState(null);
  const [page,setPage]=useState('landing');

  useEffect(()=>{
    const el=document.createElement('style');
    el.textContent=GCSS;
    document.head.appendChild(el);
    return()=>{try{document.head.removeChild(el);}catch{}};
  },[]);

  if(!auth) return <><Aurora/><Spotlight/><Cursor/><Auth onAuth={u=>{setUser(u);setAuth(true);}}/></>;

  return(
    <div style={{display:'flex',flexDirection:'column',height:'100vh',background:D.bg,color:D.tx,fontFamily:"'Inter',sans-serif",overflow:'hidden',position:'relative'}}>
      <Aurora/>
      <Spotlight/>
      <Cursor/>
      <div style={{position:'relative',zIndex:10}}>
        <Navbar page={page} setPage={setPage} user={user} onLogout={()=>{setAuth(false);setUser(null);setPage('landing');}}/>
      </div>
      <div style={{flex:1,overflow:'hidden',position:'relative',zIndex:5}}>
        {page==='landing'   &&<Landing   setPage={setPage}/>}
        {page==='command'   &&<Command/>}
        {page==='yield'     &&<Yield/>}
        {page==='climate'   &&<Climate/>}
        {page==='hydro'     &&<Hydro/>}
        {page==='soil'      &&<Soil/>}
        {page==='assistant' &&<Assistant/>}
      </div>
    </div>
  );
}