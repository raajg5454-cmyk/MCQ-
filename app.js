var TX={
hi:{up:"फोटो अपलोड",sets:"मेरे सेट",wrong:"गलत जवाब",bm:"बुकमार्क",hist:"हिस्ट्री",me:"प्रोफाइल",
cam:"📷 कैमरे से फोटो",gal:"🖼️ गैलरी से चुनो",go:"AI से सवाल निकालो",wait:"पढ़ रहा हूँ… (10-20 सेकंड)",
hint:"सवाल और 4 ऑप्शन वाली साफ फोटो डालो। एक से ज़्यादा फोटो भी चलेंगी।",
rev:"सवाल जाँचो और सुधारो",name:"सेट का नाम",saveset:"सेट सेव करो",ok:"सही जवाब चुनो (गोला)",unsure:"⚠️ AI को पक्का नहीं है, जाँच लो",
del:"हटाओ",prac:"प्रैक्टिस",empty:"अभी कुछ नहीं है।",submit:"जवाब जमा करो",next:"अगला",prev:"पिछला",fin:"खत्म करो",
corr:"✅ सही!",wr:"❌ गलत।",ans:"सही जवाब",score:"स्कोर",att:"किए गए",restart:"दोबारा शुरू",retry:"गलत वाले दोबारा",home:"होम",
all:"सब प्रैक्टिस",lang:"भाषा",wipe:"सारा डेटा हटाओ",note:"डेटा सिर्फ इस फोन के ब्राउज़र में सेव है। अकाउंट/लॉगिन अभी नहीं है।",q:"सवाल",opts:"ऑप्शन"},
en:{up:"Upload",sets:"My Sets",wrong:"Wrong",bm:"Bookmarks",hist:"History",me:"Profile",
cam:"📷 Take photo",gal:"🖼️ Choose from gallery",go:"Extract questions with AI",wait:"Reading… (10-20 sec)",
hint:"Upload a clear photo with the question and its options. Multiple photos are fine.",
rev:"Review and edit questions",name:"Set name",saveset:"Save set",ok:"Pick the correct answer (circle)",unsure:"⚠️ AI is not sure, please check",
del:"Delete",prac:"Practice",empty:"Nothing here yet.",submit:"Submit answer",next:"Next",prev:"Previous",fin:"Finish",
corr:"✅ Correct!",wr:"❌ Wrong.",ans:"Correct answer",score:"Score",att:"attempted",restart:"Restart",retry:"Retry wrong",home:"Home",
all:"Practice all",lang:"Language",wipe:"Delete all data",note:"Data is saved only in this phone's browser. There is no account or login yet.",q:"Question",opts:"Options"}};
var D={sets:[],hist:[],lang:"hi"},tab="up",files=[],draft=null,quiz=null,busy=false,err="";
function ld(){try{var x=JSON.parse(localStorage.getItem("mcq2")||"null");if(x)D=x}catch(e){}}
function sv(){try{localStorage.setItem("mcq2",JSON.stringify(D))}catch(e){}}
function t(k){return TX[D.lang][k]||k}
function esc(s){var d=document.createElement("div");d.textContent=s==null?"":String(s);return d.innerHTML}
var $=function(i){return document.getElementById(i)},L="ABCDEFGH";
function nav(){
  var h="";["up","sets","wrong","bm","hist","me"].forEach(function(k){h+='<button data-a="tab" data-v="'+k+'" class="'+(tab==k?"on":"")+'">'+t(k)+'</button>'});
  $("tabs").innerHTML=h;
}
function R(){
  nav();var a=$("app");
  if(quiz)a.innerHTML=vQuiz();
  else if(tab=="up")a.innerHTML=draft?vReview():vUp();
  else if(tab=="sets")a.innerHTML=vSets();
  else if(tab=="wrong")a.innerHTML=vList("wrong");
  else if(tab=="bm")a.innerHTML=vList("bm");
  else if(tab=="hist")a.innerHTML=vHist();
  else a.innerHTML=vMe();
}
function vUp(){
  var h='<div class="card"><div class="mu">'+t("hint")+'</div><button class="btn" data-a="cam">'+t("cam")+'</button><button class="btn s" data-a="gal">'+t("gal")+'</button><div class="thumbs">';
  files.forEach(function(f,i){h+='<div><img src="'+f.u+'"><b data-a="rmf" data-v="'+i+'">×</b></div>'});
  h+='</div><button class="btn" data-a="go"'+((!files.length||busy)?" disabled":"")+'>'+(busy?t("wait"):t("go"))+'</button><div class="err">'+esc(err)+'</div></div>';
  return h;
}
function vReview(){
  var h='<div class="card"><b>'+t("rev")+'</b> ('+draft.qs.length+')<div class="mu">'+t("ok")+'</div><div class="mu">'+t("name")+'</div><input type="text" data-f="name" value="'+esc(draft.name)+'"></div>';
  draft.qs.forEach(function(q,i){
    h+='<div class="card"><div class="row"><b>'+t("q")+' '+(i+1)+'</b><button class="sm" data-a="dq" data-v="'+i+'">'+t("del")+'</button></div>';
    if(q.unsure)h+='<div class="warn">'+t("unsure")+'</div>';
    h+='<textarea rows="3" data-f="q" data-i="'+i+'">'+esc(q.q)+'</textarea>';
    q.options.forEach(function(o,j){h+='<div class="oe"><input type="radio" name="r'+i+'" data-f="ans" data-i="'+i+'" data-j="'+j+'"'+(q.answer===j?" checked":"")+'><span>'+L[j]+'</span><input type="text" data-f="o" data-i="'+i+'" data-j="'+j+'" value="'+esc(o)+'"></div>'});
    h+='<textarea rows="2" data-f="ex" data-i="'+i+'">'+esc(q.explanation)+'</textarea></div>';
  });
  return h+'<button class="btn" data-a="saveset">'+t("saveset")+'</button><button class="btn s" data-a="canc">'+t("del")+'</button>';
}
function vSets(){
  if(!D.sets.length)return '<div class="card mu">'+t("empty")+'</div>';
  var h="";D.sets.forEach(function(s){
    h+='<div class="card"><b>'+esc(s.name)+'</b><div class="mu">'+s.qs.length+' '+t("q")+' · '+esc(s.date)+'</div><div class="row"><button class="sm on" data-a="pset" data-v="'+s.id+'">'+t("prac")+'</button><button class="sm" data-a="dset" data-v="'+s.id+'">'+t("del")+'</button></div></div>'});
  return h;
}
function flagged(k){var r=[];D.sets.forEach(function(s){s.qs.forEach(function(q,i){if(q[k])r.push({s:s.id,i:i})})});return r}
function vList(k){
  var r=flagged(k=="wrong"?"wrong":"bm");
  if(!r.length)return '<div class="card mu">'+t("empty")+'</div>';
  var h='<button class="btn" data-a="plist" data-v="'+k+'">'+t("all")+' ('+r.length+')</button>';
  r.forEach(function(x){var q=gq(x);h+='<div class="card"><div class="q">'+esc(q.q)+'</div><div class="mu">'+t("ans")+': '+L[q.answer]+') '+esc(q.options[q.answer])+'</div></div>'});
  return h;
}
function vHist(){
  if(!D.hist.length)return '<div class="card mu">'+t("empty")+'</div>';
  var h="";D.hist.slice().reverse().forEach(function(x){h+='<div class="card row"><span><b>'+esc(x.n)+'</b><br><span class="mu">'+esc(x.d)+'</span></span><b>'+x.c+'/'+x.t+'</b></div>'});
  return h;
}
function vMe(){
  return '<div class="card"><div class="row"><b>'+t("lang")+'</b><span><button class="sm'+(D.lang=="hi"?" on":"")+'" data-a="lang" data-v="hi">हिन्दी</button> <button class="sm'+(D.lang=="en"?" on":"")+'" data-a="lang" data-v="en">English</button></span></div></div><div class="card mu">'+t("note")+'</div><button class="btn s" data-a="wipe">'+t("wipe")+'</button>';
}
function gq(r){var s=D.sets.find(function(x){return x.id==r.s});return s&&s.qs[r.i]}
function vQuiz(){
  var Q=quiz,n=Q.list.length;
  if(Q.done){
    var c=0,at=0;Q.list.forEach(function(r,i){if(Q.res[i]!==undefined){at++;if(Q.res[i]===gq(r).answer)c++}});
    return '<div class="card" style="text-align:center"><div style="font-size:34px;font-weight:700">'+c+'/'+n+'</div><div class="mu">'+t("score")+' · '+at+' '+t("att")+'</div></div><button class="btn" data-a="qrestart">'+t("restart")+'</button><button class="btn s" data-a="qretry">'+t("retry")+'</button><button class="btn s" data-a="qexit">'+t("home")+'</button>';
  }
  var q=gq(Q.list[Q.pos]),res=Q.res[Q.pos],sub=res!==undefined;
  var h='<div class="row mu" style="margin-bottom:8px"><span>'+(Q.pos+1)+' / '+n+'</span><span><button class="sm" data-a="bmk">'+(q.bm?"★":"☆")+'</button> <button class="sm" data-a="qexit">✕</button></span></div><div class="card"><div class="q">'+esc(q.q)+'</div>';
  q.options.forEach(function(o,j){
    var c="opt";if(sub){if(j===q.answer)c+=" ok";else if(j===res)c+=" no"}else if(Q.sel===j)c+=" sel";
    h+='<button class="'+c+'" data-a="pick" data-v="'+j+'">'+L[j]+') '+esc(o)+'</button>';
  });
  if(sub)h+='<div class="ex"><b>'+(res===q.answer?t("corr"):t("wr"))+' '+t("ans")+': '+L[q.answer]+') '+esc(q.options[q.answer])+'</b><br>'+esc(q.explanation)+'</div>';
  h+='</div>';
  if(!sub)h+='<button class="btn" data-a="sub"'+(Q.sel==null?" disabled":"")+'>'+t("submit")+'</button>';
  h+='<div class="row"><button class="btn s" style="flex:1" data-a="qprev"'+(Q.pos?"":" disabled")+'>'+t("prev")+'</button><button class="btn" style="flex:1" data-a="qnext">'+(Q.pos==n-1?t("fin"):t("next"))+'</button></div>';
  return h;
}
function start(list,name){if(!list.length)return;quiz={list:list,pos:0,sel:null,res:{},done:false,name:name};R();window.scrollTo(0,0)}
document.addEventListener("click",function(e){
  var el=e.target.closest("[data-a]");if(!el)return;
  var a=el.dataset.a,v=el.dataset.v,Q=quiz;
  if(a=="tab"){tab=v;quiz=null}
  else if(a=="cam")$("cam").click();
  else if(a=="gal")$("gal").click();
  else if(a=="rmf"){files.splice(+v,1)}
  else if(a=="go"){extract();return}
  else if(a=="dq"){draft.qs.splice(+v,1);if(!draft.qs.length)draft=null}
  else if(a=="canc"){draft=null;files=[]}
  else if(a=="saveset"){
    draft.qs.forEach(function(q){delete q.unsure;q.wrong=false;q.bm=false});
    D.sets.push({id:Date.now(),name:draft.name||"Set",date:new Date().toLocaleDateString(),qs:draft.qs});
    sv();draft=null;files=[];tab="sets"}
  else if(a=="pset"){var s=D.sets.find(function(x){return x.id==v});start(s.qs.map(function(_,i){return{s:s.id,i:i}}),s.name);return}
  else if(a=="dset"){if(confirm(t("del")+"?")){D.sets=D.sets.filter(function(x){return x.id!=v});sv()}}
  else if(a=="plist"){start(flagged(v=="wrong"?"wrong":"bm"),t(v));return}
  else if(a=="lang"){D.lang=v;sv()}
  else if(a=="wipe"){if(confirm(t("wipe")+"?")){D={sets:[],hist:[],lang:D.lang};sv()}}
  else if(a=="pick"){if(Q.res[Q.pos]===undefined)Q.sel=+v}
  else if(a=="sub"){var q=gq(Q.list[Q.pos]);Q.res[Q.pos]=Q.sel;q.wrong=Q.sel!==q.answer;sv()}
  else if(a=="bmk"){var q2=gq(Q.list[Q.pos]);q2.bm=!q2.bm;sv()}
  else if(a=="qprev"){Q.pos--;Q.sel=null}
  else if(a=="qnext"){
    if(Q.pos==Q.list.length-1){
      var c=0;Q.list.forEach(function(r,i){if(Q.res[i]===gq(r).answer)c++});
      D.hist.push({n:Q.name,d:new Date().toLocaleString(),c:c,t:Q.list.length});sv();Q.done=true;
    }else{Q.pos++;Q.sel=null}}
  else if(a=="qrestart"){start(Q.list,Q.name);return}
  else if(a=="qretry"){var w=Q.list.filter(function(r,i){return Q.res[i]!==undefined&&Q.res[i]!==gq(r).answer});if(w.length)start(w,Q.name);else alert("0");return}
  else if(a=="qexit"){quiz=null;tab="up"}
  R();
});
document.addEventListener("input",function(e){
  var el=e.target,f=el.dataset.f;if(!f||!draft)return;
  var i=+el.dataset.i,j=+el.dataset.j;
  if(f=="name")draft.name=el.value;
  else if(f=="q")draft.qs[i].q=el.value;
  else if(f=="ex")draft.qs[i].explanation=el.value;
  else if(f=="o")draft.qs[i].options[j]=el.value;
  else if(f=="ans"){draft.qs[i].answer=j;draft.qs[i].unsure=false}
});
function add(l){
  Array.prototype.slice.call(l).forEach(function(f){files.push({f:f,u:URL.createObjectURL(f)})});
  files=files.slice(0,6);R();
}
$("cam").onchange=function(e){add(e.target.files);e.target.value=""};
$("gal").onchange=function(e){add(e.target.files);e.target.value=""};
function shrink(f){
  return new Promise(function(ok,bad){
    var im=new Image();
    im.onload=function(){
      var s=Math.min(1,1600/Math.max(im.width,im.height)),c=document.createElement("canvas");
      c.width=Math.round(im.width*s);c.height=Math.round(im.height*s);
      c.getContext("2d").drawImage(im,0,0,c.width,c.height);
      c.toBlob(function(b){b?ok(b):bad(new Error("photo"))},"image/jpeg",0.85);
    };
    im.onerror=function(){bad(new Error("Photo error"))};
    im.src=URL.createObjectURL(f);
  });
}
var PROMPT="Photos me MCQ sawal hain. Har sawal alag nikalo. Question aur sabhi visible options photo se jaise likhe hain bilkul waise copy karo; apne naye options mat banao. Agar photo me sahi answer marked hai to wahi lo, warna khud sahi option chuno. 1-2 line ka chhota explanation likho (sawal ki bhasha me). Agar photo dhundhli ho ya answer pakka na ho to unsure=true karo. Sirf valid JSON do, koi markdown nahi: {\"questions\":[{\"q\":\"...\",\"options\":[\"...\",\"...\",\"...\",\"...\"],\"answer\":0,\"explanation\":\"...\",\"unsure\":false}]}. answer 0-based index hai. Options me A) B) labels mat rakho.";
function b64(b){return new Promise(function(ok){var r=new FileReader();r.onload=function(){ok(r.result.split(",")[1])};r.readAsDataURL(b)})}
async function getQuestions(blobs){
  if(typeof claude!=="undefined"&&claude.use){
    var sample=await claude.use("sample");
    if(sample)return sample.json(PROMPT,{images:blobs,modelTier:"default",cache:false});
  }
  var imgs=await Promise.all(blobs.map(b64)),r;
  try{r=await fetch("/api/extract",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({images:imgs})})}
  catch(e){throw new Error("Server nahi mila. Pehle terminal me node server.js chalao aur http://localhost:3000 kholo.")}
  var j={};try{j=await r.json()}catch(e){}
  if(!r.ok)throw new Error(j.error||("Server error "+r.status));
  return j;
}
async function extract(){
  if(busy)return;busy=true;err="";R();
  try{
    var blobs=await Promise.all(files.map(function(x){return shrink(x.f)}));
    var out=await getQuestions(blobs);
    var qs=((out&&out.questions)||[]).filter(function(x){return x&&x.q&&x.options&&x.options.length>1&&x.answer>=0&&x.answer<x.options.length});
    if(!qs.length)throw new Error("Koi MCQ nahi mila. Saaf photo try karo.");
    draft={name:"Set "+(D.sets.length+1),qs:qs.map(function(x){return{q:x.q,options:x.options,answer:x.answer,explanation:x.explanation||"",unsure:!!x.unsure}})};
  }catch(e){
    err=(e&&e.code=="not_granted")?"Permission allow karni padegi.":(e&&e.code=="rate_limited")?"Thoda ruk kar dobara try karo.":("Galti: "+((e&&e.message)||"kuch gadbad hui"));
  }
  busy=false;R();
}
ld();R();
