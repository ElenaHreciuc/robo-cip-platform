/* Robo Mentor 3D – componenta izolată, nu alterează activitățile */
(()=>{'use strict';
if(document.querySelector('[data-robo-mentor]'))return;
const scriptURL=document.currentScript?.src||'';
const assetBase=scriptURL?new URL('.',scriptURL).href:location.origin+'/';
const ageValues=['7-8','8-9','9-10'];
function detectAge(){const query=new URLSearchParams(location.search).get('age');let stored='';try{stored=localStorage.getItem('roboCip:ageTrack')||''}catch(e){}return ageValues.includes(query)?query:ageValues.includes(stored)?stored:'7-8'}
const HELP={
default:{title:'Cu ce te pot ajuta?',intro:'Salut! Sunt Robo, mentorul tău. Îți pot explica pașii activității și îți pot oferi un indiciu.',hint:'Citește cerința, rezolvă un pas și verifică rezultatul.'},
'parser-propozitii.html':{title:'Construim propoziții',intro:'O propoziție exprimă un gând și are un sens complet.',hint:'Alege cuvintele potrivite. La început folosește majusculă, iar la sfârșit un semn de punctuație.'},
'eticheteaza-lumea.html':{title:'Clasificăm obiecte',intro:'Clasificăm atunci când grupăm obiecte după o regulă clară.',hint:'Citește criteriul și caută proprietatea comună a fiecărui grup.'},
'clinica-mesaje.html':{title:'Reparăm mesajele',intro:'Un mesaj bun este clar, corect și respectuos.',hint:'Verifică sensul, diacriticele, majuscula și semnele de punctuație. Poți folosi tastatura virtuală.'}};
const ageHint={'7-8':'Începem cu un singur pas și un exemplu simplu.','8-9':'Explică regula și verifică dacă ai aplicat-o consecvent.','9-10':'Gândește-te la o excepție și argumentează alegerea.'};
const file=decodeURIComponent(location.pathname.split('/').pop()||'');
const content=HELP[file]||HELP.default;let opened=false,reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const host=document.createElement('aside');host.dataset.roboMentor='';host.setAttribute('aria-label','Mentorul Robo');
host.style.cssText='position:fixed;right:14px;bottom:14px;z-index:2147483000;font:15px system-ui,Arial,sans-serif;color:#173954;max-width:calc(100vw - 28px)';
const shadow=host.attachShadow({mode:'open'});
shadow.innerHTML=String.raw`<style>
*{box-sizing:border-box}.wrap{display:flex;align-items:flex-end;flex-direction:column;gap:8px}
#roboTrigger{position:relative;width:116px;height:140px;border:0;background:linear-gradient(160deg,#daf5ff,#e8efff);border-radius:25px;box-shadow:0 6px 22px #19578355;cursor:pointer;overflow:hidden;touch-action:manipulation}
#roboTrigger:focus-visible,button:focus-visible{outline:3px solid #ff9d20;outline-offset:3px}
#roboTrigger .fallback{font-size:65px;position:absolute;inset:20px 0 auto;text-align:center}
model-viewer{height:120px;width:116px;position:relative;z-index:1;--poster-color:transparent;pointer-events:none}
#label{position:absolute;bottom:3px;left:2px;right:2px;background:#fffdfcdd;border-radius:9px;color:#17587d;padding:3px;font-weight:750;font-size:12px;z-index:2}
#panel{width:min(355px,calc(100vw - 28px));max-height:min(480px,65vh);overflow:auto;background:#fff;border:2px solid #b7daf5;box-shadow:0 9px 35px #14436950;border-radius:19px;padding:16px}
[hidden]{display:none!important}h2{font-size:20px;margin:0 0 8px;color:#164f80}p{line-height:1.45;margin:7px 0}button{cursor:pointer;font:inherit}
.actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}.action{border:0;border-radius:11px;padding:9px 12px;background:#176da9;color:white;font-weight:650}.secondary{background:#e6f2fb;color:#16527c}
.note{background:#eef7ff;border-radius:10px;padding:10px;margin-top:8px}
#close{float:right;border:0;background:#edf4fa;border-radius:9px;padding:5px 9px;color:#14496f}
@media(max-width:420px){#roboTrigger{height:98px;width:86px}model-viewer{height:82px;width:86px}#roboTrigger .fallback{font-size:48px;top:10px}#label{font-size:10px}}
@media(prefers-reduced-motion:reduce){model-viewer{animation:none!important}}
</style><div class="wrap">
<section id="panel" hidden role="dialog" aria-label="Ajutorul lui Robo">
<button id="close" aria-label="Închide ajutorul">✕</button><h2 id="title"></h2>
<p id="intro"></p><p id="age"></p>
<div class="actions"><button class="action" id="hint">💡 Arată indiciul</button><button class="action" id="speak">🔊 Ascultă</button><button class="action secondary" id="stop">Oprește vocea</button></div>
<p class="note" id="tip" hidden></p><small id="audioState" role="status" aria-live="polite"></small>
</section>
<button id="roboTrigger" aria-label="Deschide ajutorul mentorului Robo" aria-expanded="false">
<span class="fallback" aria-hidden="true">🤖</span><span id="modelAnchor"></span><span id="label">Robo · Ajutor</span>
</button></div>`;
document.body.appendChild(host);
const $=id=>shadow.getElementById(id);
$('title').textContent=content.title;
$('intro').textContent=content.intro;
const ageText=()=>ageHint[detectAge()];
$('age').textContent=ageText();
let speech=null;
function stopVoice(){speakingAttempt++;if('speechSynthesis'in window){window.speechSynthesis.cancel()}$('audioState').textContent=''}
function close(){opened=false;$('panel').hidden=true;$('roboTrigger').setAttribute('aria-expanded','false');stopVoice()}
$('roboTrigger').addEventListener('click',()=>{opened=!opened;$('panel').hidden=!opened;$('roboTrigger').setAttribute('aria-expanded',String(opened));$('age').textContent=ageText();if(opened)$('close').focus();else stopVoice()});
$('close').addEventListener('click',()=>{$('roboTrigger').focus();close()});
$('hint').addEventListener('click',()=>{$('tip').textContent=content.hint;$('tip').hidden=false});
$('stop').addEventListener('click',stopVoice);
function availableVoices(){return window.speechSynthesis.getVoices()||[]}
function romanianVoice(voices){return voices.find(v=>String(v.lang).toLowerCase()==='ro-ro')||voices.find(v=>String(v.lang).toLowerCase().startsWith('ro'))}
let speakingAttempt=0;
async function waitForVoices(){
const current=availableVoices();if(current.length)return current;
return await new Promise(resolve=>{
let settled=false;
const finish=()=>{if(settled)return;settled=true;window.speechSynthesis.removeEventListener?.('voiceschanged',changed);clearTimeout(timer);resolve(availableVoices())};
const changed=()=>{if(availableVoices().length)finish()};
window.speechSynthesis.addEventListener?.('voiceschanged',changed);
const timer=setTimeout(finish,1800);window.speechSynthesis.getVoices();
});
}
$('speak').addEventListener('click',async()=>{
const attempt=++speakingAttempt;
const spokenText=[content.intro,ageText(),$('tip').hidden?'':content.hint].filter(Boolean).join(' ');
if(!('speechSynthesis' in window)||!('SpeechSynthesisUtterance' in window)){$('audioState').textContent='Acest browser nu permite citirea vocală. Explicația este disponibilă în scris.';return}
$('audioState').textContent='Robo pregătește vocea…';
let voices=await waitForVoices();if(attempt!==speakingAttempt)return;
const voice=romanianVoice(voices);
window.speechSynthesis.cancel();
const utterance=new SpeechSynthesisUtterance(spokenText);speech=utterance;
utterance.lang='ro-RO';utterance.rate=0.88;utterance.pitch=1;
if(voice)utterance.voice=voice;
let began=false;
utterance.onstart=()=>{began=true;$('audioState').textContent=voice?'Robo vorbește în limba română.':'Robo vorbește cu vocea implicită a dispozitivului. Pronunția română poate fi imperfectă.'};
utterance.onend=()=>{$('audioState').textContent='Explicația audio s-a încheiat.'};
utterance.onerror=e=>{$('audioState').textContent='Vocea nu a putut fi redată ('+(e.error||'eroare necunoscută')+'). Verifică volumul și vocile instalate pe dispozitiv.'};
if(!voice)$('audioState').textContent=voices.length?'Nu am găsit o voce românească; încerc vocea implicită a dispozitivului.':'Nu sunt raportate voci instalate; încerc sistemul audio implicit.';
try{window.speechSynthesis.speak(utterance)}catch(e){$('audioState').textContent='Browserul a blocat redarea audio: '+e.message}
setTimeout(()=>{if(!began&&speech===utterance&&window.speechSynthesis.speaking===false){$('audioState').textContent='Nu a pornit sunetul. Verifică setările de voce ale browserului și volumul dispozitivului.'}},3500);
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&opened)close()});
window.addEventListener('pagehide',stopVoice);
function load3D(){
const js=document.createElement('script');js.type='module';js.src='https://ajax.googleapis.com/ajax/libs/model-viewer/4.1.0/model-viewer.min.js';
js.onload=()=>{const m=document.createElement('model-viewer');m.setAttribute('src',assetBase+'Robo.glb');m.setAttribute('alt','Robo, mentorul tridimensional');m.setAttribute('camera-orbit','0deg 75deg auto');m.setAttribute('interaction-prompt','none');m.setAttribute('shadow-intensity','0');m.setAttribute('disable-zoom','');if(!reduced){m.setAttribute('auto-rotate','');m.setAttribute('rotation-per-second','8deg')}m.addEventListener('load',()=>{const fallback=shadow.querySelector('.fallback');if(fallback)fallback.hidden=true});$('modelAnchor').appendChild(m)};
js.onerror=()=>{$('audioState').textContent='Modelul 3D nu s-a încărcat. Ajutorul text rămâne disponibil.'};document.head.appendChild(js);
}
if('customElements'in window&&window.WebGLRenderingContext&&!reduced)load3D();else if(window.WebGLRenderingContext)load3D();
})();