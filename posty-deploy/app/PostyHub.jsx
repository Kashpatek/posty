"use client";
import { useState, useEffect, useMemo, useCallback, Fragment } from "react";

// ═══ BRAND ═══
const A="#F7B041",B="#0B86D1",BG="#08090D",B2="#0D0F14",BD="#1a1d25",G="#22c55e",R="#ef4444";
const TC={"Cloud/Infra":"#3b82f6","AI/ML":"#8b5cf6","Hardware":"#ef4444","Storage/Infra":"#06b6d4","Energy/Infra":"#22c55e","Internal":"#6b7280","AI Safety":"#f59e0b","GPU Optimization":"#f97316","Neocloud":"#0ea5e9","AMD Ecosystem":"#dc2626","Autonomous":"#f97316","HPC":"#0ea5e9","AI/Energy":"#10b981","Compute":"#6366f1","Enterprise":"#a855f7","Geopolitics":"#dc2626","DevTools":"#14b8a6","Physical AI":"#f43f5e","Networking":"#0284c7","VC/Finance":"#d97706","AI/Infra":"#7c3aed"};
const TL={1:"Flagship",2:"Strong",3:"Standard"};

// ═══ DYLAN VOICE (captions only, NOT youtube descriptions) ═══
const DYLAN_SYS=`You write social captions for SemiAnalysis. Match this voice exactly.

RULES:
- Lead with a number or specific claim. A fact, not a vibe.
- Write like texting someone who knows the space. Casual, informed.
- Short sentences. Fragments fine. Skip transitions.
- Opinionated when warranted. "huge deal" "this is the real one" etc.
- Personal take first, then link. Never just "check this out."
- NEVER hashtags on X. Ever.
- No marketing language. No "breaks down" "deep-dive" "explores" "unpacks" "in-depth" "sits down with."
- No em dashes. No emojis.
- 1-2 sentences max per platform.
- X hook: one sentence, a fact or take, no link, no hashtags.
- X reply: just the link.
- LinkedIn/Facebook: one sentence context + link.

VOICE EXAMPLES:
"NVIDIA has now open sourced their trtllmgen MoE kernels! Great to see that parts of NVIDIA move towards open kernels!"
"4% of GitHub public commits are being authored by Claude Code right now. While you blinked, AI consumed all of software development."
"SemiAnalysis autists spent all Superbowl Sunday Claude coding. Daily Claude Code spend hit $6k on Sunday. 'Fast mode is expensive' is pure cope."
"InferenceX is changing the industry. Performance of hardware + software is constantly evolving with new models and new ML Systems techniques"
"If you missed old school 2022 SemiAnalysis content, this is that, except a big step up in quality."

Write in THIS voice. Not a copywriter. This voice.`;

// ═══ SCHEDULE ═══
const BASE=new Date(2026,3,9);
const wd=i=>{const d=new Date(BASE);d.setDate(d.getDate()+i*14);return d;};
const fm=d=>d.toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"});
const fs2=d=>d.toLocaleDateString("en-US",{month:"short",day:"numeric"});

// ═══ SA EPISODES ═══
const SA_INIT=[
{id:"sa-0",g:"Waleed Atallah",co:"Makora",ti:"Co-Founder & CEO",ho:"Dylan Patel",hc:"SemiAnalysis",tier:1,tag:"GPU Optimization",slot:-1,st:"published",virt:false,
bio:"Waleed Atallah is the co-founder and CEO of Makora, building AI agents that write and optimize GPU kernels across CUDA and Triton. $8.5M seed led by M13, backed by Jeff Dean.",
cd:"Makora automatically writes, optimizes, and deploys high-performance GPU code. MakoraGenerate writes GPU kernels, MakoraOptimize tunes vLLM/SGLang hyperparameters.",
logo:"https://logo.clearbit.com/makora.com",top:"GPU kernel optimization, AI-native compilers, hardware-agnostic inference"},
{id:"sa-1",g:"Bryan Shan",co:"SemiAnalysis",ti:"Member of Technical Staff",ho:"Cameron Quilici",hc:"SAIL",tier:3,tag:"Internal",slot:0,st:"scheduled",virt:false,
bio:"Bryan Shan is a Member of Technical Staff at SemiAnalysis and co-author on InferenceX v2, the benchmark validated by Google Cloud, Microsoft Azure, Oracle, and OpenAI. InferenceX runs nightly sweeps across SGLang, vLLM, and TensorRT-LLM on close to 1,000 frontier GPUs.",
cd:"SemiAnalysis is the leading semiconductor and AI infrastructure research firm. InferenceX is their open-source continuous inference benchmarking platform.",
logo:"https://logo.clearbit.com/semianalysis.com",top:"InferenceX, open-source inference benchmarking, GPU performance, NVIDIA Blackwell vs AMD Instinct"},
{id:"sa-2",g:"David Randle",co:"Amazon AWS",ti:"Principal Engineer",ho:"Wega Chu",hc:"SemiAnalysis",tier:1,tag:"Cloud/Infra",slot:1,st:"scheduled",virt:false,
bio:"David Randle is a Principal Engineer at Amazon Web Services focused on AI infrastructure and accelerated computing. Randle has shaped AWS's approach to high-performance AI workloads including GPU cluster orchestration and custom silicon strategy spanning over a decade at Amazon.",
cd:"Amazon Web Services is the world's largest cloud platform with purpose-built AI chips like Trainium and Inferentia.",
logo:"https://logo.clearbit.com/aws.amazon.com",top:"AWS AI infrastructure, Trainium, custom silicon, GPU cluster orchestration"},
{id:"sa-3",g:"Dan Fu",co:"Together AI",ti:"VP of Kernels",ho:"Caithrin Rintoul",hc:"SAIL",tier:1,tag:"AI/ML",slot:2,st:"scheduled",virt:false,
bio:"Dan Fu is VP of Kernels at Together AI and an assistant professor at UC San Diego. His research focuses on making ML models faster through hardware-aware algorithm design. Fu earned his PhD from Stanford, contributing to foundational work including FlashAttention. His work has been recognized with multiple awards at NeurIPS, ICML, and ICLR.",
cd:"Together AI builds a full-stack AI cloud platform powered by cutting-edge systems research. Founded by researchers behind FlashAttention.",
logo:"https://logo.clearbit.com/together.ai",top:"GPU kernels, hardware-aware ML, FlashAttention, inference optimization"},
{id:"sa-4",g:"Thomas Sohmers",co:"Positron AI",ti:"Co-Founder & CTO",ho:"Jordan Nanos",hc:"SAIL",tier:1,tag:"Hardware",slot:3,st:"scheduled",virt:false,
bio:"Thomas Sohmers is the co-founder and CTO of Positron AI, building purpose-built hardware for AI inference. A Thiel Fellow at 17, he previously founded REX Computing, was principal hardware architect at Lambda, and Director of Technology Strategy at Groq. Positron raised $305M including a $230M Series B at over $1B valuation.",
cd:"Positron AI builds inference-optimized accelerators delivering 3-4x better performance per dollar vs GPUs. Atlas is the world's first LLM-inference-first accelerator, manufactured in the U.S.",
logo:"https://logo.clearbit.com/positron.ai",top:"AI inference hardware, FPGA accelerators, competing with NVIDIA, inference economics"},
{id:"sa-5",g:"Lucas Atkins",co:"Arcee AI",ti:"CTO",ho:"Kimbo Chen",hc:"SemiAnalysis",tier:2,tag:"AI/ML",slot:4,st:"scheduled",virt:false,
bio:"Lucas Atkins is CTO of Arcee AI, leading pretraining and architecture for enterprise open-source language models. Under his leadership Arcee trained Trinity Large, a 400B-parameter model on 2,048 Blackwell GPUs in six months for $20M.",
cd:"Arcee AI builds open-weight enterprise language models with Apache 2.0 licensing and IP-compliant training data. ~$50M raised.",
logo:"https://logo.clearbit.com/arcee.ai",top:"open-source LLMs, Trinity architecture, enterprise AI, model pretraining at scale"},
{id:"sa-6",g:"Valentin Bercovici",co:"WEKA",ti:"Chief AI Strategy Officer",ho:"Kai Williams",hc:"SAIL",tier:1,tag:"Storage/Infra",slot:5,st:"scheduled",virt:false,
bio:"Val Bercovici is Chief AI Strategy Officer at WEKA. Previously CTO at NetApp/SolidFire, he co-authored Windows Shadowcopy, helped establish the first NAND Flash SSD guidelines, and is a founding board member of the Kubernetes CNCF.",
cd:"WEKA provides a high-performance parallel file system for AI workloads. Their Augmented Memory Grid delivers memory-class KV cache performance at petabyte scale.",
logo:"https://logo.clearbit.com/weka.io",top:"AI storage infrastructure, KV cache, disaggregated inference, data pipelines"},
{id:"sa-7",g:"Manish Shah",co:"Project VAIL",ti:"Co-Founder & CEO",ho:"Kimbo Chen",hc:"SemiAnalysis",tier:2,tag:"AI Safety",slot:6,st:"scheduled",virt:false,
bio:"Manish Shah co-founded Project VAIL (Verifiable AI Layer), building open standards for AI model verification. Previously co-founded PeerWell (acquired) and Rapleaf/LiveRamp. UC Berkeley alum.",
cd:"Project VAIL creates standards for confirming AI model legitimacy, comparable to SSL/TLS. Uses cryptographic verification and TEEs.",
logo:"",top:"AI model verification, cryptographic trust, TEEs, AI governance"},
{id:"sa-8",g:"Patrick Wohlschlegel",co:"Radiant",ti:"Founder",ho:"Jordan Nanos",hc:"SAIL",tier:2,tag:"Energy/Infra",slot:7,st:"scheduled",virt:false,
bio:"Patrick Wohlschlegel leads Radiant at the intersection of energy infrastructure and AI compute. Background from Warwick Business School and ENSEIRB.",
cd:"Radiant addresses the growing power demands of GPU-dense data centers.",logo:"",top:"AI energy infrastructure, data center power, sustainable compute"},
{id:"sa-9",g:"David Randle (Pt. 2)",co:"Amazon AWS",ti:"Principal Engineer",ho:"Kai Williams",hc:"SAIL",tier:2,tag:"Cloud/Infra",slot:8,st:"scheduled",virt:false,
bio:"Second session with David Randle going deeper into AWS's technical roadmap for AI infrastructure.",
cd:"Amazon Web Services.",logo:"https://logo.clearbit.com/aws.amazon.com",top:"AWS roadmap, Trainium evolution, cloud AI strategy"},
{id:"sa-10",g:"Mohamed Abdelfattah",co:"Makora",ti:"Co-Founder & Chief Science Officer",ho:"Kimbo Chen",hc:"SemiAnalysis",tier:1,tag:"GPU Optimization",slot:9,st:"scheduled",virt:true,
bio:"Mohamed Abdelfattah, Ph.D (University of Toronto) co-founded Makora with Waleed Atallah. He leads the science behind Makora's AI-native compiler and kernel generation engine. Advisory board includes Jeff Dean (Google Chief Scientist) and Shyamal Anadket (Head of Applied Evals, OpenAI). Previously researched at Samsung and Cornell.",
cd:"Makora's MakoraGenerate is an AI agent that writes and validates GPU kernels in CUDA, Triton, and more. MakoraOptimize auto-tunes hyperparameters for vLLM and SGLang. $8.5M seed led by M13.",
logo:"https://logo.clearbit.com/makora.com",top:"AI kernel generation, search-based optimization, CUDA vs Triton, GPU utilization"},
{id:"sa-11",g:"Narek Tatevosyan",co:"Nebius",ti:"VP of Product",ho:"Jordan Nanos",hc:"SemiAnalysis",tier:1,tag:"Neocloud",slot:10,st:"scheduled",virt:true,
bio:"Narek Tatevosyan has 15+ years in IT. Built broadcast networks for the Olympics in London and Sochi. Built Yandex Cloud from scratch. Now leads product at Nebius, the neocloud with $27B Meta deal, $19.4B Microsoft deal, and $2B direct NVIDIA investment. Scaling from 170MW to 1GW capacity in 2026.",
cd:"Nebius is a purpose-built AI cloud (neocloud) spun out of Yandex. NASDAQ-listed (NBIS). $3-3.4B projected 2026 revenue. Building a 1.2GW campus in Missouri. Designs own server racks, cooling, and networking.",
logo:"https://logo.clearbit.com/nebius.com",top:"neocloud infrastructure, scaling AI capacity, Meta/Microsoft deals, cluster engineering, MLPerf"},
{id:"sa-12",g:"Jeff Tatarchuk",co:"TensorWave",ti:"Co-Founder & Chief Growth Officer",ho:"Cameron Quilici",hc:"SemiAnalysis",tier:1,tag:"AMD Ecosystem",slot:11,st:"scheduled",virt:true,
bio:"Jeff Tatarchuk co-founded TensorWave, the only all-AMD GPU cloud. Previously co-founded VMAccel (FPGA cloud on Xilinx). 8,192 MI325X cluster in Arizona. $100M Series A led by Magnetar and AMD Ventures. Among the first to ship MI355X. Revenue run rate exceeding $100M (20x YoY). Signed 1GW capacity deal with Tecfusions.",
cd:"TensorWave is the only all-AMD GPU cloud. No NVIDIA hardware. $145M total raised. $800M debt facility for AMD buildouts. Hosted the 'Beyond CUDA' summit at GTC.",
logo:"https://logo.clearbit.com/tensorwave.com",top:"AMD MI355X, Beyond CUDA, ROCm state of play, all-AMD inference, GPU cloud economics"},
{id:"sa-13",g:"Keval Shah",co:"Pebble",ti:"AI Research Lead",ho:"Jordan Nanos",hc:"SAIL",tier:3,tag:"AI/ML",slot:12,st:"scheduled",virt:false,
bio:"Keval Shah is AI Research Lead at Pebble, driving applied research and model development.",cd:"Pebble builds AI-native tools.",logo:"",top:""},
{id:"sa-14",g:"Kimbo Chen",co:"SemiAnalysis",ti:"Analyst",ho:"Cameron Quilici",hc:"SAIL",tier:3,tag:"Internal",slot:13,st:"scheduled",virt:false,
bio:"Kimbo Chen is a research analyst at SemiAnalysis focused on AI systems architecture and interconnects.",cd:"SemiAnalysis is the leading semiconductor and AI infrastructure research firm.",logo:"https://logo.clearbit.com/semianalysis.com",top:""},
{id:"sa-15",g:"Mishek Musa",co:"Analog",ti:"Mechatronics Engineer",ho:"Jordan Nanos",hc:"SAIL",tier:3,tag:"Hardware",slot:14,st:"pending",virt:false,notes:"Needs approval",
bio:"Mishek Musa is a Mechatronics Engineer at Analog working on hardware bridging physical and digital worlds.",cd:"Analog develops hardware and sensor solutions.",logo:"",top:""},
];

// ═══ SAIL (lightweight, no full metadata) ═══
const SAIL=[
{id:"sl-1",g:"Charles Frye",co:"Modal",ho:"Lily Ottinger",tag:"AI/Infra"},
{id:"sl-2",g:"Chenghui Xuan",co:"Pony AI",ho:"Irene Zhang",tag:"Autonomous"},
{id:"sl-3",g:"Juan Alonso",co:"Luminary Cloud",ho:"Lily Ottinger",tag:"HPC"},
{id:"sl-4",g:"Varun Sivaram",co:"Emerald AI",ho:"Kai Williams",tag:"AI/Energy"},
{id:"sl-5",g:"Alan Butler",co:"SF Compute",ho:"Kai Williams",tag:"Compute"},
{id:"sl-6",g:"Zach Mueller",co:"Lambda AI",ho:"Caithrin Rintoul",tag:"AI/Infra"},
{id:"sl-7",g:"Caia Costello",co:"Lambda AI",ho:"Caithrin Rintoul",tag:"AI/Infra"},
{id:"sl-8",g:"Alejandro Corredor",co:"TE Connectivity",ho:"Lily Ottinger",tag:"Hardware"},
{id:"sl-9",g:"Lucas",co:"SAP",ho:"Kai Williams",tag:"Enterprise"},
{id:"sl-10",g:"Jay Chen",co:"Contextual AI",ho:"Irene Zhang",tag:"AI/ML"},
{id:"sl-11",g:"Aqib Zakaria",co:"ChinaTalk",ho:"Lily Ottinger",tag:"Geopolitics"},
{id:"sl-12",g:"Will Schenk",co:"The Focus AI",ho:"Kai Williams",tag:"AI/ML"},
{id:"sl-13",g:"Wei Ding",co:"Nobles Machine",ho:"Caithrin Rintoul",tag:"Hardware"},
{id:"sl-14",g:"Andrey Chepstov",co:"dstack",ho:"Kai Williams",tag:"DevTools"},
{id:"sl-15",g:"Craig Schindler",co:"Assemble Labs",ho:"Kai Williams",tag:"Physical AI"},
{id:"sl-16",g:"Travis Perkins",co:"Tailscale",ho:"Kai Williams",tag:"Networking"},
{id:"sl-17",g:"Eric Bielke",co:"Fathom Fund",ho:"Caithrin Rintoul",tag:"VC/Finance"},
{id:"sl-18",g:"Keval Shah",co:"Pebble",ho:"Caithrin Rintoul",tag:"AI/ML"},
{id:"sl-19",g:"DJ",co:"Makora",ho:"Lily Ottinger",tag:"AI/ML"},
];

const HOSTS=["All","Dylan Patel","Kimbo Chen","Wega Chu","Cameron Quilici","Jordan Nanos","Kai Williams","Caithrin Rintoul","Lily Ottinger","Irene Zhang"];

// ═══ STYLES ═══
const F="'JetBrains Mono','SF Mono',monospace";
const badge=(bg,c="#fff")=>({display:"inline-block",fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:4,background:bg,color:c,letterSpacing:.5});
const card={padding:14,background:B2,borderRadius:8,border:`1px solid ${BD}`};
const btn=(on)=>({padding:"6px 14px",border:on?`2px solid ${A}`:`1px solid ${BD}`,borderRadius:6,background:on?`${A}18`:"transparent",color:on?A:"#6b7280",cursor:"pointer",fontFamily:F,fontSize:12,fontWeight:on?700:400,transition:"all .15s"});

// ═══ STORAGE ═══
function load(k){try{if(typeof window!=="undefined"&&window.storage){return window.storage.get(k).then(r=>r?JSON.parse(r.value):null).catch(()=>null);}if(typeof localStorage!=="undefined"){const v=localStorage.getItem(k);return Promise.resolve(v?JSON.parse(v):null);}return Promise.resolve(null);}catch(e){return Promise.resolve(null);}}
function save(k,v){try{const s=JSON.stringify(v);if(typeof window!=="undefined"&&window.storage)window.storage.set(k,s).catch(()=>{});if(typeof localStorage!=="undefined")localStorage.setItem(k,s);}catch(e){}}

// ═══ API ═══
async function callAPI(sys,usr){
  try{const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:sys,messages:[{role:"user",content:usr}]})});const d=await r.json();return (d.content||[]).map(b=>b.text||"").join("\n")||"Generation failed.";}catch(e){return "API error: "+e.message;}
}

// ═══════════════════════════════════════
// APP
// ═══════════════════════════════════════
export default function Posty(){
  const [view,setView]=useState("welcome");
  const [sub,setSub]=useState("timeline");
  const [eps,setEps]=useState(SA_INIT);
  const [sel,setSel]=useState(null);
  const [edit,setEdit]=useState(false);
  const [hostF,setHostF]=useState("All");
  const [tagF,setTagF]=useState("All");
  const [showSail,setShowSail]=useState(false);
  const [drag,setDrag]=useState(null);
  const [ready,setReady]=useState(false);

  useEffect(()=>{load("posty-v3-eps").then(s=>{if(s)setEps(s);setReady(true);});},[]);
  useEffect(()=>{if(ready)save("posty-v3-eps",eps);},[eps,ready]);

  const upd=useCallback((id,u)=>setEps(p=>p.map(e=>e.id===id?{...e,...u}:e)),[]);

  const scheduled=useMemo(()=>{
    let r=eps.filter(e=>e.st!=="published").sort((a,b)=>a.slot-b.slot);
    if(hostF!=="All")r=r.filter(e=>e.ho===hostF);
    if(tagF!=="All")r=r.filter(e=>e.tag===tagF);
    return r;
  },[eps,hostF,tagF]);

  const pub=eps.filter(e=>e.st==="published");
  const allTags=useMemo(()=>[...new Set(eps.map(e=>e.tag))].sort(),[eps]);
  const total=eps.filter(e=>e.st!=="published").length;

  const handleDrop=(tid)=>{
    if(!drag||drag===tid)return;
    setEps(prev=>{
      const arr=[...prev],fr=arr.find(e=>e.id===drag),to=arr.find(e=>e.id===tid);
      if(fr&&to){const t=fr.slot;fr.slot=to.slot;to.slot=t;}
      return[...arr];
    });
    setDrag(null);
  };

  if(view==="welcome")return<WelcomeScreen onClick={()=>setView("dash")}/>;
  if(view==="ep"&&sel)return<EpDetail ep={sel} onBack={()=>{setView("dash");setSel(null);}} upd={upd}/>;

  // ═══ DASHBOARD ═══
  return(
  <div style={{fontFamily:F,background:BG,color:"#e5e7eb",minHeight:"100vh"}}>
  <div style={{maxWidth:1140,margin:"0 auto",padding:"28px 24px 60px"}}>
    {/* Header */}
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20,flexWrap:"wrap",gap:10}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <PIcon s={28}/><div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:18,fontWeight:900,color:A}}>POSTY</span>
            <span style={{fontSize:10,color:"#4b5563",letterSpacing:2}}>// REGIMENT HUB v3</span>
          </div>
          <div style={{fontSize:10,color:"#374151",letterSpacing:1}}>EVERY OTHER WEDNESDAY // 8:00 AM PST</div>
        </div>
      </div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
        <button style={btn(sub==="timeline")} onClick={()=>setSub("timeline")}>Timeline</button>
        <button style={btn(sub==="calendar")} onClick={()=>setSub("calendar")}>Calendar</button>
        <button style={{...btn(showSail),borderColor:B}} onClick={()=>setShowSail(!showSail)}>{showSail?"SAIL On":"SAIL Off"}</button>
        <button style={{...btn(edit),marginLeft:4}} onClick={()=>setEdit(!edit)}>{edit?"Done":"Edit Order"}</button>
      </div>
    </div>

    {/* Published */}
    {pub.length>0&&<div style={{marginBottom:16,padding:12,background:"rgba(34,197,94,0.04)",borderRadius:8,border:"1px solid rgba(34,197,94,0.2)"}}>
      <div style={{fontSize:10,color:G,textTransform:"uppercase",letterSpacing:2,fontWeight:700,marginBottom:8}}>Published</div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        {pub.map(e=><div key={e.id} onClick={()=>{setSel(e);setView("ep");}} style={{padding:"8px 14px",borderRadius:6,background:"rgba(34,197,94,0.06)",border:"1px solid rgba(34,197,94,0.2)",cursor:"pointer"}}>
          <div style={{fontSize:13,fontWeight:700,color:"#d1d5db"}}>{e.g}</div>
          <div style={{fontSize:10,color:"#6b7280"}}>{e.co} // {e.ho}</div>
        </div>)}
      </div>
    </div>}

    {/* Filters */}
    <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap",marginBottom:10}}>
      <span style={{fontSize:10,color:"#4b5563",textTransform:"uppercase",letterSpacing:1.5}}>Host</span>
      <select value={hostF} onChange={e=>setHostF(e.target.value)} style={{padding:"4px 8px",background:B2,border:`1px solid ${BD}`,borderRadius:5,color:A,fontFamily:F,fontSize:11,cursor:"pointer"}}>
        {HOSTS.map(h=><option key={h} value={h}>{h}</option>)}
      </select>
      <span style={{width:1,height:16,background:BD,margin:"0 4px"}}/>
      <span style={{fontSize:10,color:"#4b5563",textTransform:"uppercase",letterSpacing:1.5}}>Topic</span>
      <select value={tagF} onChange={e=>setTagF(e.target.value)} style={{padding:"4px 8px",background:B2,border:`1px solid ${BD}`,borderRadius:5,color:B,fontFamily:F,fontSize:11,cursor:"pointer"}}>
        <option value="All">All</option>
        {allTags.map(t=><option key={t} value={t}>{t}</option>)}
      </select>
    </div>

    {/* Stats */}
    <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8,marginBottom:18,...card}}>
      {[{l:"Remaining",v:total,c:A},{l:"Cadence",v:"Bi-Weekly",c:"#9ca3af"},{l:"Day",v:"Wednesday",c:B},{l:"Time",v:"8AM PST",c:A},{l:"End",v:fs2(wd(total-1)),c:"#9ca3af"}].map((s,i)=>
        <div key={i} style={{textAlign:"center"}}>
          <div style={{fontSize:16,fontWeight:900,color:s.c}}>{s.v}</div>
          <div style={{fontSize:8,color:"#4b5563",textTransform:"uppercase",letterSpacing:1}}>{s.l}</div>
        </div>
      )}
    </div>

    {/* Edit */}
    {edit&&<div style={{...card,border:`2px solid ${A}40`,marginBottom:18}}>
      <div style={{fontSize:10,color:A,textTransform:"uppercase",letterSpacing:2,fontWeight:700,marginBottom:10}}>Drag to reorder. Changes save automatically.</div>
      {eps.filter(e=>e.st!=="published").sort((a,b)=>a.slot-b.slot).map((e,i)=>
        <div key={e.id} draggable onDragStart={()=>setDrag(e.id)} onDragOver={ev=>ev.preventDefault()} onDrop={()=>handleDrop(e.id)}
          style={{display:"flex",alignItems:"center",gap:10,padding:"7px 12px",marginBottom:3,borderRadius:6,background:drag===e.id?`${A}18`:"rgba(255,255,255,0.015)",border:drag===e.id?`1px solid ${A}`:"1px solid transparent",cursor:"grab"}}>
          <span style={{fontSize:11,color:"#4b5563",fontWeight:700,width:22}}>{i+1}</span>
          <span style={badge(e.tier===1?A:e.tier===2?B:"#2a2d35",e.tier===3?"#9ca3af":"#0D0F14")}>T{e.tier}</span>
          {e.virt&&<span style={{fontSize:8,color:"#06b6d4",border:"1px solid #06b6d440",padding:"1px 4px",borderRadius:3}}>VIRTUAL</span>}
          <span style={{fontSize:13,fontWeight:600,color:"#d1d5db",flex:1}}>{e.g}</span>
          <span style={{fontSize:11,color:"#6b7280"}}>{e.co}</span>
          <span style={{fontSize:10,color:"#4b5563"}}>{e.ho}</span>
          <span style={{fontSize:9,color:"#374151"}}>{fs2(wd(e.slot))}</span>
        </div>
      )}
    </div>}

    {/* Timeline */}
    {sub==="timeline"&&<div style={{position:"relative"}}>
      <div style={{position:"absolute",left:50,top:0,bottom:0,width:2,background:`linear-gradient(to bottom,${A},${BD} 12%,${BD} 88%,${A})`}}/>
      {scheduled.map((e,i)=>{
        const d=wd(e.slot),fl=e.tier===1,nx=i===0&&hostF==="All"&&tagF==="All";
        return <div key={e.id} style={{display:"flex",gap:14,marginBottom:5,position:"relative",minHeight:50}}>
          <div style={{width:100,flexShrink:0,textAlign:"right",paddingRight:18,paddingTop:8}}>
            <div style={{fontSize:11,fontWeight:fl?800:500,color:nx?G:fl?A:"#374151"}}>{nx?"NEXT UP":`Wk ${i+1}`}</div>
            <div style={{fontSize:10,color:"#4b5563"}}>{fs2(d)}</div>
            <div style={{fontSize:8,color:"#2a2d35"}}>8AM PST</div>
          </div>
          <div style={{position:"absolute",left:fl?46:48,top:12,width:fl?12:8,height:fl?12:8,borderRadius:"50%",background:nx?G:fl?A:BD,border:`2px solid ${nx?G:fl?A:"#2a2d35"}`,zIndex:2}}/>
          <div style={{flex:1,paddingTop:4}}>
            <EPCard e={e} d={d} onClick={()=>{setSel(e);setView("ep");}}/>
          </div>
        </div>;
      })}
      {/* SAIL */}
      {showSail&&<div style={{marginTop:20,paddingTop:16,borderTop:`1px solid ${BD}`}}>
        <div style={{fontSize:10,color:B,textTransform:"uppercase",letterSpacing:2,fontWeight:700,marginBottom:10}}>SAIL Episodes (partner, no SA metadata)</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
          {SAIL.map(s=><div key={s.id} style={{padding:"6px 10px",borderRadius:6,background:"rgba(11,134,209,0.04)",border:"1px solid rgba(11,134,209,0.12)"}}>
            <div style={{fontSize:12,fontWeight:600,color:"#9ca3af"}}>{s.g}</div>
            <div style={{fontSize:10,color:"#4b5563"}}>{s.co} // {s.ho}</div>
          </div>)}
        </div>
      </div>}
    </div>}

    {/* Calendar */}
    {sub==="calendar"&&<CalView eps={eps.filter(e=>e.st!=="published").sort((a,b)=>a.slot-b.slot)} onSel={e=>{setSel(e);setView("ep");}}/>}

    {/* Strategy */}
    <div style={{...card,marginTop:24}}>
      <div style={{fontSize:10,color:A,textTransform:"uppercase",letterSpacing:2,fontWeight:700,marginBottom:8}}>Rollout Framework</div>
      <p style={{fontSize:12,color:"#9ca3af",lineHeight:1.8,margin:0}}>
        Every other Wednesday at 8:00 AM PST. Two kits per episode:
        <strong style={{color:A}}> Interview Launch Kit</strong> covers the full episode (YouTube description, X hook + reply, LinkedIn, Facebook).
        <strong style={{color:B}}> Clips Social Kit</strong> covers two short-form clips (X, YouTube Shorts, IG Reels, TikTok).
        YouTube descriptions stay informative. All social captions match Dylan's voice.
        Short #1 drops Thursday, Short #2 the following Tuesday. TikTok staggers 4-6 hours.
      </p>
    </div>
  </div></div>);
}

// ═══ COMPONENTS ═══
function PIcon({s=80}){return<svg width={s} height={s} viewBox="0 0 80 80"><circle cx="40" cy="40" r="28" fill={A} opacity=".22"/><text x="40" y="52" textAnchor="middle" fontSize="36" fill={A} fontWeight="900">P</text></svg>}

function WelcomeScreen({onClick}){
  return<div onClick={onClick} style={{cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",background:BG,fontFamily:F,position:"relative"}}>
    <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 50% 38%,rgba(232,168,48,0.06) 0%,transparent 55%)"}}/>
    <div style={{position:"relative",zIndex:2,textAlign:"center"}}>
      <PIcon s={72}/>
      <h1 style={{fontSize:26,fontWeight:900,color:A,margin:"14px 0 6px",letterSpacing:-1,textTransform:"uppercase"}}>Hello, and welcome to the</h1>
      <h2 style={{fontSize:17,color:"#e5e7eb",margin:"0 0 3px",fontWeight:400,letterSpacing:3,textTransform:"uppercase"}}>GTC Researcher Conversations</h2>
      <h3 style={{fontSize:13,color:"#6b7280",margin:"0 0 28px",fontWeight:400,letterSpacing:5,textTransform:"uppercase"}}>Posting Regiment Hub</h3>
      <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"10px 24px",border:`1px solid ${A}40`,borderRadius:24,background:`${A}08`}}>
        <span style={{fontSize:14,color:A,fontWeight:700}}>I'm Posty.</span>
        <span style={{fontSize:13,color:"#6b7280"}}>Click anywhere to enter.</span>
      </div>
      <div style={{marginTop:28,display:"flex",gap:14,justifyContent:"center"}}>
        {["16 Episodes","Bi-Weekly Wed","8AM PST","3 Virtual"].map((t,i)=>
          <div key={i} style={{padding:"7px 14px",border:`1px solid ${BD}`,borderRadius:6,fontSize:10,color:"#4b5563",letterSpacing:1,textTransform:"uppercase"}}>{t}</div>
        )}
      </div>
    </div>
  </div>;
}

function EPCard({e,d,onClick}){
  const [h,setH]=useState(false);
  const tc=TC[e.tag]||"#6b7280";
  return<div onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
    style={{padding:"10px 14px",borderRadius:8,background:`${A}08`,border:`1px solid ${h?A:`${A}20`}`,cursor:"pointer",transition:"all .15s",transform:h?"translateY(-1px)":"none",boxShadow:h?`0 4px 16px ${A}18`:"none",maxWidth:500}}>
    <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:3}}>
      <span style={badge(A,"#0D0F14")}>SA</span>
      <span style={{...badge("transparent"),border:`1px solid ${tc}50`,color:tc,background:`${tc}12`}}>{e.tag}</span>
      <span style={{fontSize:8,color:"#374151"}}>T{e.tier} {TL[e.tier]}</span>
      {e.virt&&<span style={{fontSize:8,color:"#06b6d4",border:"1px solid #06b6d430",padding:"1px 4px",borderRadius:3,background:"rgba(6,182,212,0.06)"}}>VIRTUAL</span>}
      {e.st==="pending"&&<span style={{fontSize:8,color:R}}>PENDING</span>}
    </div>
    <div style={{fontSize:15,fontWeight:700,color:"#f3f4f6"}}>{e.g}</div>
    <div style={{fontSize:11,color:"#6b7280"}}>{e.ti} at {e.co} // Host: {e.ho}</div>
    <div style={{display:"flex",gap:12,marginTop:5,fontSize:9,color:"#4b5563"}}>
      <span style={{color:A}}>Launch: {fs2(d)} 8AM</span>
      <span style={{color:B}}>Clip 1: Thu {fs2(new Date(d.getTime()+864e5))}</span>
      <span style={{color:B}}>Clip 2: Tue {fs2(new Date(d.getTime()+6*864e5))}</span>
    </div>
  </div>;
}

function CalView({eps,onSel}){
  const months=useMemo(()=>{
    const m={};eps.forEach(e=>{const d=wd(e.slot),k=`${d.getFullYear()}-${d.getMonth()}`;if(!m[k])m[k]={y:d.getFullYear(),mo:d.getMonth(),eps:[]};m[k].eps.push({...e,date:d});});return Object.values(m);
  },[eps]);
  return<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
    {months.map((mo,mi)=>{
      const fd=new Date(mo.y,mo.mo,1).getDay(),dim=new Date(mo.y,mo.mo+1,0).getDate();
      const cells=[];for(let i=0;i<fd;i++)cells.push(null);for(let d=1;d<=dim;d++)cells.push(d);
      return<div key={mi} style={card}>
        <div style={{fontSize:13,fontWeight:700,color:A,marginBottom:8}}>{new Date(mo.y,mo.mo).toLocaleDateString("en-US",{month:"long",year:"numeric"})}</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,fontSize:9}}>
          {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d=><div key={d} style={{textAlign:"center",color:"#4b5563",padding:3,fontWeight:700}}>{d}</div>)}
          {cells.map((day,ci)=>{
            if(!day)return<div key={`e${ci}`}/>;
            const ep=mo.eps.find(e=>e.date.getDate()===day);
            const s1=mo.eps.find(e=>e.date.getDate()+1===day);
            const s2=mo.eps.find(e=>e.date.getDate()+6===day);
            return<div key={ci} onClick={()=>(ep||s1||s2)&&onSel(ep||s1||s2)}
              style={{textAlign:"center",padding:"5px 2px",borderRadius:4,
                background:ep?`${A}20`:s1?`${B}14`:s2?`${B}0a`:"transparent",
                border:ep?`1px solid ${A}40`:"1px solid transparent",
                color:ep?"#f3f4f6":"#374151",cursor:(ep||s1||s2)?"pointer":"default",fontWeight:ep?700:400,fontSize:10}}>
              {day}
              {ep&&<div style={{fontSize:7,color:A,marginTop:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ep.g.split(" ")[0]}</div>}
              {s1&&!ep&&<div style={{width:4,height:4,borderRadius:2,background:B,margin:"2px auto 0"}}/>}
              {s2&&!ep&&!s1&&<div style={{width:4,height:4,borderRadius:2,background:B,margin:"2px auto 0",opacity:.4}}/>}
            </div>;
          })}
        </div>
      </div>;
    })}
  </div>;
}

// ═══════════════════════════════════════
// EPISODE DETAIL
// ═══════════════════════════════════════
function EpDetail({ep,onBack,upd}){
  const [tab,setTab]=useState("kit");
  const [genK,setGenK]=useState(false);
  const [kitOut,setKitOut]=useState("");
  const [c1,setC1]=useState("");
  const [c2,setC2]=useState("");
  const [clipOut,setClipOut]=useState("");
  const [genC,setGenC]=useState(false);
  const [cp,setCp]=useState("");

  const d=ep.slot>=0?wd(ep.slot):new Date(2026,3,2);
  const tc=TC[ep.tag]||"#6b7280";

  // YT description stays INFORMATIVE, not Dylan voice
  const ytDesc=`${ep.ho} sits down with ${ep.g}, ${ep.ti} at ${ep.co}, to discuss ${ep.top||"[TOPICS COVERED]"}.\n\n${ep.bio}\n\nResearcher Conversations is a live interview series recorded${ep.virt?" virtually via Riverside":" on-site at NVIDIA GTC 2026 in San Jose"}, produced by SemiAnalysis${ep.virt?"":" in partnership with SAIL"}. Technical conversations with the researchers, founders, and engineers building the future of AI compute.`;

  // Launch Kit template (captions in Dylan voice style)
  const kitTpl=`GTC INTERVIEW LAUNCH KIT
═══════════════════════════
${ep.g} (${ep.co})
Host: ${ep.ho} // ${fm(d)} 8:00 AM PST${ep.virt?" // Virtual (Riverside)":""}
Link: [INSERT YOUTUBE LINK]
Thumbnail: [ATTACH]

─── YOUTUBE DESCRIPTION ───
${ytDesc}

─── X (HOOK TWEET) ───
${ep.top?ep.top.split(",")[0]:"[TOPIC]"} with ${ep.g} from ${ep.co}. ${ep.co==="SemiAnalysis"?"Internal crossover episode.":"New Researcher Conversations episode."}

─── X (REPLY-TO-SELF) ───
[INSERT YOUTUBE LINK]

─── LINKEDIN ───
${ep.g} (${ep.co}) on ${ep.top||"[topics]"}.

[INSERT YOUTUBE LINK]

─── FACEBOOK ───
${ep.g} from ${ep.co} on ${ep.top||"[topics]"}.

[INSERT YOUTUBE LINK]

─── POSTING REGIMENT ───
${fm(d)} 8:00 AM PST    YouTube Full Episode
${fm(d)} 8:15 AM PST    X Hook + Reply
${fm(d)} 8:30 AM PST    LinkedIn + Facebook
Thu ${fs2(new Date(d.getTime()+864e5))} 8:00 AM PST    Short #1 (via Clips Social Kit)
Tue ${fs2(new Date(d.getTime()+6*864e5))} 8:00 AM PST    Short #2 (via Clips Social Kit)`;

  async function genKit(){
    setGenK(true);
    const r=await callAPI(DYLAN_SYS,`Write social captions for this podcast episode launch. YouTube description should stay informative and professional (NOT in the casual voice, keep it factual). Only the X, LinkedIn, and Facebook captions should match the casual voice.\n\nGuest: ${ep.g}, ${ep.ti} at ${ep.co}\nHost: ${ep.ho}\nBio: ${ep.bio}\nTopics: ${ep.top||"general"}\nFormat: ${ep.virt?"Virtual via Riverside":"In-person at GTC 2026"}\n\nWrite:\n1. YouTube description (informative, under 150 words, include bio and series tagline)\n2. X hook (1 sentence, casual voice, no link, no hashtags)\n3. X reply (just "[INSERT YOUTUBE LINK]")\n4. LinkedIn (1 sentence + link placeholder)\n5. Facebook (1 sentence + link placeholder)`);
    setKitOut(r);setGenK(false);
  }

  async function genClips(){
    setGenC(true);
    const r=await callAPI(DYLAN_SYS,`Write social captions for TWO short-form video clips from a podcast episode. All captions in the casual voice.\n\nGuest: ${ep.g} (${ep.co})\nHost: ${ep.ho}\n\nCLIP 1 TRANSCRIPT:\n${c1||"[No transcript. Write general captions based on guest/topic.]"}\n\nCLIP 2 TRANSCRIPT:\n${c2||"[No transcript. Write general captions based on guest/topic.]"}\n\nFor EACH clip write:\n1. X caption (no hashtags)\n2. YouTube Shorts title (under 40 chars) + description + #shorts\n3. Instagram Reels caption + save CTA + 5-8 hashtags + location: San Jose Convention Center\n4. TikTok (lowercase + 4-6 hashtags + on-screen text at 0s/3s/6s)\n\nLabel as CLIP 1 and CLIP 2. Include schedule: Short #1 Thu 8AM PST, Short #2 following Tue 8AM PST. TikTok staggers 4-6hr.`);
    setClipOut(r);setGenC(false);
  }

  const copy=(t,l)=>{navigator.clipboard.writeText(t);setCp(l);setTimeout(()=>setCp(""),2000);};

  return<div style={{fontFamily:F,background:BG,color:"#e5e7eb",minHeight:"100vh"}}>
  <div style={{maxWidth:880,margin:"0 auto",padding:"28px 24px 60px"}}>
    <button onClick={onBack} style={{background:"none",border:`1px solid ${BD}`,color:"#6b7280",padding:"8px 16px",borderRadius:6,cursor:"pointer",fontFamily:F,fontSize:12,marginBottom:20}}>← Back</button>

    {/* Header */}
    <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:6,flexWrap:"wrap"}}>
      <span style={badge(A,"#0D0F14")}>SEMIANALYSIS</span>
      <span style={{...badge("transparent"),border:`1px solid ${tc}50`,color:tc}}>{ep.tag}</span>
      <span style={{...badge("transparent"),border:`1px solid ${A}50`,color:A}}>T{ep.tier} {TL[ep.tier]}</span>
      {ep.virt&&<span style={badge("rgba(6,182,212,0.15)","#06b6d4")}>VIRTUAL</span>}
      {ep.st==="published"&&<span style={badge(`${G}20`,G)}>PUBLISHED</span>}
      {ep.st==="pending"&&<span style={badge(`${R}20`,R)}>PENDING APPROVAL</span>}
    </div>
    <h1 style={{fontSize:28,fontWeight:900,color:"#f3f4f6",letterSpacing:-1,margin:"6px 0 2px"}}>{ep.g}</h1>
    <p style={{fontSize:14,color:"#6b7280",margin:"0 0 4px"}}>{ep.ti} at {ep.co}</p>
    <p style={{fontSize:12,color:A,margin:"0 0 20px",fontWeight:600}}>
      {ep.st==="published"?"Published":"Release:"} {fm(d)} at 8:00 AM PST{ep.virt?" // Recorded via Riverside":""}
    </p>

    {/* Company + Bio */}
    <div style={{display:"flex",gap:14,marginBottom:16}}>
      {ep.logo&&<div style={{width:52,height:52,borderRadius:8,border:`1px solid ${BD}`,background:B2,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
        <img src={ep.logo} alt="" style={{width:36,height:36,objectFit:"contain"}} onError={e=>e.target.style.display="none"}/>
      </div>}
      <div><div style={{fontSize:10,color:A,textTransform:"uppercase",letterSpacing:2,fontWeight:700,marginBottom:4}}>Company</div>
        <p style={{fontSize:12,color:"#9ca3af",margin:0,lineHeight:1.6}}>{ep.cd}</p></div>
    </div>
    <div style={{marginBottom:16}}>
      <div style={{fontSize:10,color:A,textTransform:"uppercase",letterSpacing:2,fontWeight:700,marginBottom:6}}>Guest Bio</div>
      <p style={{fontSize:12,color:"#d1d5db",margin:0,lineHeight:1.7,...card}}>{ep.bio}</p>
    </div>

    {/* Schedule */}
    {ep.slot>=0&&<div style={{...card,marginBottom:16}}>
      <div style={{fontSize:10,color:A,textTransform:"uppercase",letterSpacing:2,fontWeight:700,marginBottom:8}}>Content Rollout</div>
      <div style={{display:"grid",gridTemplateColumns:"auto 1fr",gap:"5px 14px",fontSize:12}}>
        {[[`${fm(d)} 8:00 AM PST`,"YouTube Full Episode"],[`${fm(d)} 8:15 AM PST`,"X Hook + Reply"],[`${fm(d)} 8:30 AM PST`,"LinkedIn + Facebook"],
          [`Thu ${fs2(new Date(d.getTime()+864e5))} 8:00 AM PST`,"Short #1: YT Shorts + IG Reels + X + TikTok"],[`Tue ${fs2(new Date(d.getTime()+6*864e5))} 8:00 AM PST`,"Short #2: YT Shorts + IG Reels + X + TikTok"]
        ].map(([t,desc],i)=><Fragment key={i}><div style={{color:A,fontWeight:600,whiteSpace:"nowrap"}}>{t}</div><div style={{color:"#9ca3af"}}>{desc}</div></Fragment>)}
      </div>
    </div>}

    {/* Meta */}
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,marginBottom:20}}>
      {[["Host",ep.ho],["Host Co",ep.hc],["Format",ep.virt?"Virtual (Riverside)":"In-Person (GTC)"],["Notes",ep.notes||"None"]].map(([l,v],i)=>
        <div key={i} style={{...card,padding:10}}>
          <div style={{fontSize:8,color:"#4b5563",textTransform:"uppercase",letterSpacing:1}}>{l}</div>
          <div style={{fontSize:12,color:"#d1d5db",fontWeight:600,marginTop:2}}>{v}</div>
        </div>
      )}
    </div>

    {/* Tabs */}
    <div style={{display:"flex",gap:8,marginBottom:6}}>
      <button style={btn(tab==="kit")} onClick={()=>setTab("kit")}>Interview Launch Kit</button>
      <button style={btn(tab==="clips")} onClick={()=>setTab("clips")}>Clips Social Kit</button>
    </div>
    <div style={{fontSize:9,color:"#4b5563",marginBottom:14}}>
      {tab==="kit"?"Full episode: YT description (informative) + X, LinkedIn, Facebook (Dylan voice)":"Short-form clips: paste transcripts, generate captions for X, YT Shorts, IG Reels, TikTok (Dylan voice)"}
    </div>

    {/* ─── LAUNCH KIT ─── */}
    {tab==="kit"&&<div>
      <div style={{display:"flex",gap:8,marginBottom:10}}>
        <button onClick={()=>copy(kitOut||kitTpl,"kit")} style={{...btn(false),borderColor:`${A}60`,color:A}}>{cp==="kit"?"Copied!":"Copy Kit"}</button>
        <button onClick={genKit} disabled={genK} style={{...btn(true),opacity:genK?.5:1}}>{genK?"Generating...":"Generate with AI"}</button>
      </div>
      <pre style={{fontSize:11,color:"#9ca3af",lineHeight:1.7,padding:14,...card,whiteSpace:"pre-wrap",fontFamily:F,maxHeight:520,overflow:"auto"}}>{kitOut||kitTpl}</pre>
    </div>}

    {/* ─── CLIPS SOCIAL KIT ─── */}
    {tab==="clips"&&<div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
        <div>
          <div style={{fontSize:11,color:A,fontWeight:600,marginBottom:4}}>Clip 1 Transcript</div>
          <textarea value={c1} onChange={e=>setC1(e.target.value)} placeholder="Paste clip 1 transcript..."
            style={{width:"100%",minHeight:130,padding:10,background:B2,border:`1px solid ${BD}`,borderRadius:6,color:"#d1d5db",fontFamily:F,fontSize:11,resize:"vertical",outline:"none"}}/>
        </div>
        <div>
          <div style={{fontSize:11,color:B,fontWeight:600,marginBottom:4}}>Clip 2 Transcript</div>
          <textarea value={c2} onChange={e=>setC2(e.target.value)} placeholder="Paste clip 2 transcript..."
            style={{width:"100%",minHeight:130,padding:10,background:B2,border:`1px solid ${BD}`,borderRadius:6,color:"#d1d5db",fontFamily:F,fontSize:11,resize:"vertical",outline:"none"}}/>
        </div>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:10}}>
        <button onClick={genClips} disabled={genC} style={{...btn(true),opacity:genC?.5:1}}>{genC?"Generating...":"Generate Clips Kit"}</button>
        {clipOut&&<button onClick={()=>copy(clipOut,"clips")} style={{...btn(false),borderColor:`${A}60`,color:A}}>{cp==="clips"?"Copied!":"Copy Clips Kit"}</button>}
      </div>
      {clipOut&&<pre style={{fontSize:11,color:"#9ca3af",lineHeight:1.7,padding:14,...card,whiteSpace:"pre-wrap",fontFamily:F,maxHeight:520,overflow:"auto"}}>{clipOut}</pre>}
      {!clipOut&&<div style={{...card,color:"#4b5563",fontSize:12,textAlign:"center",padding:40}}>Paste transcripts above and hit generate. Captions will output here in Dylan's voice for X, YT Shorts, IG Reels, and TikTok.</div>}
    </div>}
  </div></div>;
}
