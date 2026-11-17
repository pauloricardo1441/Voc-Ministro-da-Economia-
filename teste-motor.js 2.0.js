const fs=require('fs'),vm=require('vm');
const mk=()=>{const f=function(){};const p=new Proxy(f,{get:(t,k)=>k===Symbol.toPrimitive?()=>"":k==="length"?0:k==="style"||k==="classList"||k==="dataset"?mk():k==="value"||k==="innerHTML"||k==="textContent"?"":k==="getContext"?()=>mk():mk(),set:()=>true,apply:()=>mk()});return p};
function run(seed,n){
 const store={};const ov={};const doc=new Proxy(mk(),{get:(t,k)=>k in ov?ov[k]:t[k],set:(t,k,v)=>(ov[k]=v,true)});const pol={g:0,c:0,p:0,i:0,em:2};const els={};const el=()=>{const o={},b=mk();return new Proxy(b,{get:(t,k)=>k in o?o[k]:t[k],set:(t,k,v)=>(o[k]=v,true)})};
doc.getElementById=id=>{if(id in pol)return new Proxy(mk(),{get:(t,k)=>k==='value'?String(pol[id]):t[k],set:()=>true});return els[id]||(els[id]=el())};doc.querySelectorAll=()=>[];doc.querySelector=()=>mk();doc.createElement=()=>mk();
 const ctx={__pol:pol,__els:els,document:doc,window:null,localStorage:{getItem:k=>store[k]||null,setItem:(k,v)=>store[k]=v,removeItem:k=>delete store[k]},setTimeout:()=>0,setInterval:()=>0,requestAnimationFrame:()=>0,navigator:{},console:{log(){},error(){}},Math,Date,JSON,fetch:()=>Promise.reject(new Error('offline')),addEventListener(){},scrollTo(){},clearTimeout(){},performance:{now:()=>Date.now()},innerWidth:400,innerHeight:800,getComputedStyle:()=>mk(),Audio:function(){return mk()},Image:function(){return mk()},cancelAnimationFrame(){},matchMedia:()=>({matches:false}),Intl,alert(){},confirm:()=>true,prompt:()=>"" };
 ctx.window=ctx;vm.createContext(ctx);
 const h=fs.readFileSync('./index.html','utf8');
 const sc=[...h.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
 let src=sc.join('\n;\n')+'\n;globalThis.__S=()=>S;globalThis.__CR=typeof CR!=="undefined"?CR:[];globalThis.__turn=typeof turn==="function"?turn:null;';
 vm.runInContext(src,ctx);ctx.__seed(seed);
 return ctx;
}
const strat={neutro:[0,0,0,0],ajuste:[-1,1,0,-.3],expansao:[1.5,-1,0,.5],pressao:[1,0,60,0]};
const rows=[];
for(const [nome,d] of Object.entries(strat))for(const seed of [1,2,3,4,5]){
 const c=run(seed,24);const S0=c.__S();const P=c.__pol;let err=null,bad=0,mx=0,mi=1e9;
 P.g=S0.gasto;P.c=S0.carga;P.i=S0.inv;
 for(let k=0;k<30&&!c.__S().over;k++){const S=c.__S();
  if(S.crise!=null){try{c.__els.cr.onclick({target:{closest:()=>({dataset:{k:0}})}})}catch(e){err="crise:"+e.message;break}}
  P.g=S.gasto+d[0]*.2;P.c=S.carga+d[1]*.2;P.p=d[2];P.i=S.inv+d[3]*.1;
  try{c.__turn()}catch(e){err=e.message;break}
  const s=c.__S();for(const[kk,v]of Object.entries(s))if(typeof v==="number"&&!isFinite(v))bad++;}
 const s=c.__S();rows.push([nome,seed,'mês',s.m,'over',s.over?'sim':'não','NaN',bad,'err',err||'-','selic',s.selic.toFixed(1),'pib',s.g.toFixed(1),'dív',s.div.toFixed(0),'pop',s.pop.toFixed(0)].join(' '));}
console.log(rows.join('\n'));
