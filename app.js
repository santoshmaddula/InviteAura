const state={template:"emerald",tab:0,photoData:"",preview:0};
const tabs=["details","events","media","style","publish"];
const templateNames={emerald:"Emerald Temple",maroon:"Royal Kalyanam",ivory:"Ivory Heritage"};
const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);

function fmtDate(v){
 if(!v)return "YOUR DATE";
 const [y,m,d]=v.split("-").map(Number);
 return new Date(Date.UTC(y,m-1,d)).toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric",timeZone:"UTC"});
}
function shortDate(v){
 if(!v)return "YOUR DATE";
 const [y,m,d]=v.split("-").map(Number);
 return `${String(d).padStart(2,"0")} · ${String(m).padStart(2,"0")} · ${y}`;
}
function updatePreview(){
 $("#pGroom").textContent=$("#groom").value||"Your Name";
 $("#pBride").textContent=$("#bride").value||"Your Love";
 $("#pDate").textContent=shortDate($("#date").value);
 $("#pCity").textContent=$("#city").value||"Your City";
 $("#pOpening").textContent=$("#opening").value||"With the blessings of our families, we invite you to celebrate.";
 $("#pMarriageDate").textContent=fmtDate($("#marriageDate").value);
 $("#pMarriage").textContent=$("#marriageTime").value||"Time";
 $("#pMarriageVenue").textContent=$("#marriageVenue").value||"Venue";
 $("#pReceptionDate").textContent=fmtDate($("#receptionDate").value);
 $("#pReception").textContent=$("#receptionTime").value||"Time";
 $("#pReceptionVenue").textContent=$("#receptionVenue").value||"Venue";
 const photo=$("#pPhoto");
 if(state.photoData) photo.innerHTML=`<img src="${state.photoData}" alt="Couple photo">`;
 else photo.textContent="Your\nCouple\nPhoto";
 $("#templatePill").textContent=templateNames[state.template];
 document.querySelector("#phoneScreen").className="phone-screen theme-"+state.template;
}
function setTab(i){
 state.tab=Math.max(0,Math.min(tabs.length-1,i));
 $$(".tab").forEach((b,n)=>b.classList.toggle("active",n===state.tab));
 $$(".tab-panel").forEach((p,n)=>p.classList.toggle("active",n===state.tab));
 $("#nextTab").textContent=state.tab===tabs.length-1?"Back to Couple":"Continue →";
}
$$(".tab").forEach((b,i)=>b.addEventListener("click",()=>setTab(i)));
$("#nextTab").addEventListener("click",()=>setTab(state.tab===tabs.length-1?0:state.tab+1));
["groom","bride","date","city","opening","marriageDate","marriageTime","marriageVenue","receptionDate","receptionTime","receptionVenue"].forEach(id=>$("#"+id).addEventListener("input",updatePreview));
$$(".use-template").forEach(b=>b.addEventListener("click",()=>{
 state.template=b.dataset.template;
 $$(".template-card").forEach(c=>c.classList.toggle("selected",c.dataset.template===state.template));
 $("#mood").value=state.template; updatePreview(); $("#create").scrollIntoView({behavior:"smooth"});
}));
$("#mood").addEventListener("change",e=>{state.template=e.target.value;$$(".template-card").forEach(c=>c.classList.toggle("selected",c.dataset.template===state.template));updatePreview()});
$("#photoInput").addEventListener("change",e=>{
 const f=e.target.files[0]; if(!f||!f.type.startsWith("image/"))return;
 const r=new FileReader();r.onload=()=>{state.photoData=r.result;$("#photoPreview").innerHTML=`<img src="${state.photoData}" alt="Selected couple photo">`;updatePreview()};r.readAsDataURL(f);
});
$("#publishBtn").addEventListener("click",()=>{
 const slug="atrivarada-renuka";
 const url=`${window.location.origin}/i/${slug}`;
 $("#generated").innerHTML=`<strong>Invitation URL:</strong><br><a class="share-url" href="${url}" target="_blank" rel="noopener">${url}</a><br><button class="secondary small share-copy" type="button">Copy link</button> <a class="primary small share-open" href="${url}" target="_blank" rel="noopener">Open invitation</a>`;
 const copy=$(".share-copy");
 copy.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(url);copy.textContent="Copied ✓";}catch(e){window.prompt("Copy invitation URL:",url);}});
});
$("#resetBtn").addEventListener("click",()=>{
 const vals={groom:"Atrivarada Sri Bhaskara Sharma",bride:"Renuka",date:"2026-11-21",city:"Vijayawada",opening:"With the blessings of our families, we invite you to celebrate our sacred union.",marriageDate:"2026-11-21",marriageTime:"9:56 PM",marriageVenue:"Vijayawada",receptionDate:"2026-12-05",receptionTime:"7:00 PM onwards",receptionVenue:"Vijayawada"};
 Object.entries(vals).forEach(([k,v])=>$("#"+k).value=v);state.photoData="";$("#photoInput").value="";$("#photoPreview").textContent="Photo preview";updatePreview();
});
$("#startBtn").addEventListener("click",()=>$("#create").scrollIntoView({behavior:"smooth"}));
$("#heroCreate").addEventListener("click",()=>$("#create").scrollIntoView({behavior:"smooth"}));
$$(".choose-plan").forEach(b=>b.addEventListener("click",()=>$("#create").scrollIntoView({behavior:"smooth"})));

const pages=$$(".preview-page"), dots=$("#previewDots");
pages.forEach((_,i)=>{const s=document.createElement("span");s.className=i===0?"active":"";dots.appendChild(s)});
function showPreview(n){state.preview=(n+pages.length)%pages.length;pages.forEach((p,i)=>p.classList.toggle("active",i===state.preview));Array.from(dots.children).forEach((d,i)=>d.classList.toggle("active",i===state.preview))}
$("#previewPrev").addEventListener("click",()=>showPreview(state.preview-1));
$("#previewNext").addEventListener("click",()=>showPreview(state.preview+1));
$("#previewOpen").addEventListener("click",()=>showPreview(1));

const weddingTarget=new Date("2026-11-21T21:56:00+05:30").getTime();
function tick(){let x=Math.max(0,weddingTarget-Date.now());const d=Math.floor(x/86400000);x%=86400000;const h=Math.floor(x/3600000);x%=3600000;const m=Math.floor(x/60000);$("#dd").textContent=d;$("#hh").textContent=String(h).padStart(2,"0");$("#mm").textContent=String(m).padStart(2,"0")}
tick();setInterval(tick,1000);updatePreview();showPreview(0);