/* Robo-Cip · 4 laboratoare de Științe, trei niveluri de vârstă */
(()=>{'use strict';const $=id=>document.getElementById(id);const category=document.body.dataset.lab;
const DB={
satellites:{title:'🛰️ Sateliți și Pământul',lead:'Observă planeta și află ce informații ne pot oferi sateliții.',levels:{
'7-8':{mission:'Privesc Pământul de sus',instruction:'Alege ce putem recunoaște în imagini observate de sus.',questions:[
['Ce apare albastru pe multe imagini ale Pământului?',['Oceanele și mările','Toate pădurile','Toți munții'],0,'Apa acoperă o mare parte a suprafeței Pământului.'],
['Ce reprezintă o pată mare de verde pe o hartă colorată a vegetației?',['Un ocean','O zonă cu vegetație','O planetă nouă'],1,'Hărțile tematice pot folosi verde pentru a reprezenta vegetația; legenda explică semnificația.'],
['Ce folosim ca să știm ce reprezintă simbolurile de pe o hartă?',['Legenda','Volumul telefonului','Ora de culcare'],0,'Legenda explică simbolurile și culorile.']]},
'8-9':{mission:'Compar imagini și schimbări',instruction:'Analizează situații în care observațiile prin satelit sunt folositoare.',questions:[
['Două imagini ale aceluiași lac, făcute în ani diferiți, arată suprafețe diferite. Ce verificăm?',['Comparăm aceeași zonă și condiții cât mai asemănătoare','Presupunem că lacul a dispărut','Ignorăm datele'],0,'Compararea corectă cere aceeași localizare și atenție la sezon și condiții.'],
['Ce poate ajuta la observarea extinderii unui oraș?',['Imagini repetate ale aceleiași zone','O singură fotografie a clasei','Un termometru din bucătărie'],0,'Imaginile din momente diferite pot evidenția schimbări ale terenului.'],
['De ce este importantă data unei imagini satelitare?',['Pentru a vedea când a fost observată zona','Pentru a alege o culoare preferată','Pentru a afla numele unui elev'],0,'Data ne ajută să interpretăm schimbările.']]},
'9-10':{mission:'Interpretez dovezi de la distanță',instruction:'Evaluează informațiile și limitele observațiilor prin satelit.',questions:[
['O imagine arată o zonă maro după o perioadă secetoasă. Ce concluzie este justificată?',['Sigur toți copacii au murit','Poate fi o schimbare a vegetației; verificăm și alte date','Nu există apă pe planetă'],1,'Culoarea singură nu demonstrează cauza. Avem nevoie de comparații și date suplimentare.'],
['Norii acoperă un teren în imaginea optică. Ce facem?',['Recunoaștem limita observației și căutăm alte imagini sau date','Inventăm detalii','Declarăm zona nelocuită'],0,'Norii împiedică observarea directă în imaginile optice.'],
['Care este o folosire responsabilă a datelor satelitare?',['Prezentăm observațiile împreună cu sursa, data și limitele lor','Tragem concluzii despre persoane din orice pixel','Ignorăm erorile posibile'],0,'Concluziile trebuie însoțite de context, precizie și limite.']]}},
creative:'Propune o întrebare despre mediul din localitatea ta la care imaginile satelitare ar putea contribui.'},
weather:{title:'🌦️ Vremea și observațiile',lead:'Înregistrează fenomene meteorologice și interpretează date simple.',levels:{
'7-8':{mission:'Descopăr vremea',instruction:'Identifică fenomenele pe care le putem observa.',questions:[
['Ce instrument măsoară temperatura aerului?',['Termometrul','Busola','Rigla'],0,'Temperatura se măsoară cu termometrul.'],
['Ce observăm când picăturile de apă cad din nori?',['Ploaie','Cutremur','Curent electric'],0,'Ploaia este o formă de precipitație.'],
['Ce este bine să purtăm dacă afară plouă?',['Un impermeabil','Ochelari de înot la clasă','Patine cu rotile'],0,'Îmbrăcămintea potrivită ne ajută să ne protejăm de ploaie.']]},
'8-9':{mission:'Citesc un jurnal meteo',instruction:'Compară date dintr-un jurnal imaginar de observații: luni 12°C, marți 15°C, miercuri 11°C.',questions:[
['În ce zi a fost temperatura cea mai mare?',['Miercuri','Marți','Luni'],1,'15°C este valoarea maximă din seria dată.'],
['Cu câte grade a crescut temperatura de luni până marți?',['3°C','5°C','1°C'],0,'15 minus 12 este egal cu 3.'],
['Putem spune cum va fi vremea săptămâna viitoare doar din aceste trei valori?',['Da, cu certitudine','Nu, sunt necesare mai multe informații','Da, dacă alegem o culoare'],1,'Trei observații nu sunt suficiente pentru o prognoză sigură.']]},
'9-10':{mission:'Investighez datele meteorologice',instruction:'Analizează datele fictive ale unei stații: ora 9: 10°C; ora 12: 16°C; ora 15: 15°C.',questions:[
['Care a fost variația dintre valoarea minimă și cea maximă?',['6°C','5°C','26°C'],0,'16°C − 10°C = 6°C.'],
['Ce concluzie susțin cele trei observații?',['La ora 12 temperatura era mai mare decât la ora 9','La ora 18 sigur ninge','Mâine va fi soare'],0,'Putem afirma doar ceea ce susțin observațiile.'],
['Unde plasăm un termometru pentru măsurarea temperaturii aerului?',['În soare direct pe asfalt','Într-un adăpost ventilat, ferit de radiația solară directă','Lângă o sursă de căldură'],1,'Pentru măsurători comparabile, instrumentul trebuie protejat de încălzirea directă.']]}},
creative:'Proiectează un jurnal meteo pentru trei zile: dată, temperatură, nori și precipitații. Notează că valorile trebuie măsurate, nu inventate.'},
nature:{title:'🌱 Ecosisteme și biodiversitate',lead:'Explorează legăturile dintre viețuitoare, apă, sol și spațiile verzi.',levels:{
'7-8':{mission:'Descopăr nevoile plantelor',instruction:'Observă de ce au nevoie organismele vii.',questions:[
['De ce are nevoie o plantă verde pentru a crește?',['Apă, lumină și substanțe nutritive','Numai jucării','Numai muzică'],0,'Plantele au nevoie de apă, lumină și substanțe nutritive, în condiții potrivite.'],
['Ce viețuitoare poate vizita o floare pentru nectar?',['Albina','Bicicleta','Cartea'],0,'Multe albine se hrănesc cu nectar și pot transporta polen.'],
['Ce ajută la protejarea unui parc?',['Aruncarea deșeurilor în coșuri','Ruperea tuturor florilor','Distrugerea cuiburilor'],0,'Îngrijirea habitatelor ajută viețuitoarele.']]},
'8-9':{mission:'Construiesc legături în natură',instruction:'Găsește relațiile dintre organisme și mediul lor.',questions:[
['Ce relație este posibilă într-o pajiște?',['Floare → albină care colectează nectar','Piatră → pasăre care produce apă','Nor → copac din plastic'],0,'Albinele pot colecta nectarul florilor și contribui la polenizare.'],
['Ce poate schimba dispariția unor flori dintr-o pajiște?',['Resursele de hrană ale unor insecte','Numărul de pagini al manualului','Forma tuturor norilor'],0,'Unele insecte depind de florile disponibile.'],
['De ce păstrăm zone cu plante diferite?',['Pot oferi habitate și resurse variate','Pentru a alunga toate animalele','Pentru a opri ploaia'],0,'Diversitatea plantelor poate susține mai multe tipuri de viețuitoare.']]},
'9-10':{mission:'Investighez echilibrul unui ecosistem',instruction:'Folosește dovezi și evită explicațiile prea simple.',questions:[
['După reducerea spațiilor cu flori se observă mai puține insecte. Ce este corect?',['Reducerea florilor ar putea contribui, dar verificăm și alți factori','Toate insectele au dispărut definitiv','Știm cauza cu certitudine'],0,'Observația sugerează o ipoteză, nu dovedește singură cauza.'],
['Cum ai compara două zone verzi?',['Aceeași perioadă și metodă de observare','Numărăm doar în locul preferat','Schimbăm mereu durata observației'],0,'Comparațiile trebuie făcute cu metode asemănătoare.'],
['Care măsură poate îmbunătăți biodiversitatea într-o curte școlară?',['Plantarea unor specii locale potrivite și reducerea distrugerii habitatelor','Acoperirea întregului sol cu beton','Eliminarea tuturor plantelor spontane'],0,'Plantele potrivite și diversitatea habitatelor pot susține biodiversitatea.']]}},
creative:'Proiectează o mică grădină prietenoasă cu polenizatorii și explică două alegeri.'},
recycle:{title:'♻️ Reciclare și materiale',lead:'Investighează proprietățile materialelor și traseul responsabil al deșeurilor.',levels:{
'7-8':{mission:'Recunosc materialele',instruction:'Alege materialul din care este făcut obiectul descris.',questions:[
['Din ce este făcută o foaie obișnuită de caiet?',['Hârtie','Sticlă','Metal'],0,'Foile obișnuite de caiet sunt realizate din hârtie.'],
['Din ce este făcut un borcan de sticlă?',['Carton','Sticlă','Textil'],1,'Borcanul de sticlă este un ambalaj din sticlă.'],
['Ce facem cu ambalajele, după ce le golim?',['Le sortăm conform regulilor locale','Le aruncăm în parc','Le ascundem sub bancă'],0,'Colectarea separată urmează regulile și infrastructura locală.']]},
'8-9':{mission:'Aleg colectarea potrivită',instruction:'Gândește-te la material și la starea obiectului.',questions:[
['Unde poate fi colectată o sticlă de plastic goală, conform regulilor locale?',['Cu plasticul, dacă sistemul local acceptă acest ambalaj','Cu frunzele din parc','În apa râului'],0,'Verificăm regulile locale și simbolurile de pe recipientele de colectare.'],
['Ce facem cu o cutie de carton curată?',['O colectăm cu hârtia și cartonul, dacă regulile locale prevăd asta','O amestecăm cu resturi de mâncare','O abandonăm pe stradă'],0,'Cartonul curat poate fi colectat separat.'],
['De ce nu punem orice obiect din sticlă în containerul pentru ambalaje de sticlă?',['Fiindcă regulile pot exclude alte tipuri, precum geamurile și ceramica','Fiindcă toate obiectele sunt din plastic','Fiindcă reciclarea este inutilă'],0,'Tipurile de sticlă au procese și reguli de colectare diferite.']]},
'9-10':{mission:'Investighez ciclul materialelor',instruction:'Analizează prevenirea deșeurilor, reutilizarea și limitele reciclării.',questions:[
['Care alegere poate preveni producerea unui ambalaj de unică folosință?',['Folosirea unei sticle reutilizabile, când este sigur și potrivit','Cumpărarea zilnică a uneia noi','Aruncarea ambalajului pe jos'],0,'Prevenirea generării deșeurilor poate reduce consumul de resurse.'],
['O ambalare are plastic și hârtie lipite. Ce decizie e corectă?',['Presupunem că merge sigur la hârtie','Verificăm marcajele și regulile locale','O aruncăm în natură'],1,'Ambalajele compozite pot necesita fluxuri speciale de colectare.'],
['Ce comparație ar fi utilă pentru a analiza deșeurile din clasă?',['Măsurăm tipurile și cantitățile în perioade comparabile','Ne bazăm doar pe impresii','Numărăm doar obiectele albastre'],0,'Datele colectate consecvent ajută la evaluarea măsurilor.']]}},
creative:'Propune un plan de reducere a deșeurilor în clasă: o acțiune, o măsurare și un indicator al îmbunătățirii.'}
};
function shuffledOptions(options){const entries=options.map((text,originalIndex)=>({text,originalIndex}));for(let i=entries.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[entries[i],entries[j]]=[entries[j],entries[i]];}return entries;}
const lab=DB[category];if(!lab)return;let age='7-8',idx=0,selection=-1,correct=0,finished=false;
const feedback=(t,kind='')=>{$('feedback').textContent=t;$('feedback').className='feedback '+kind};
function draw(){const t=lab.levels[age].questions[idx];$('scenario').textContent=t[0];$('choices').replaceChildren();selection=-1;$('next').hidden=true;shuffledOptions(t[1]).forEach(({text,originalIndex},i)=>{const b=document.createElement('button');b.textContent=text;b.type='button';b.className='option';b.setAttribute('aria-pressed','false');b.onclick=()=>{selection=originalIndex;[...$('choices').children].forEach((c,j)=>c.setAttribute('aria-pressed',String(i===j)));feedback('Răspuns ales. Apasă „Verifică”.')};$('choices').appendChild(b)});$('progress').textContent='Provocarea '+(idx+1)+' din 3';feedback('Alege o explicație pe baza observațiilor.')}

const STEAM={
satellites:{
'7-8':{math:['O hartă are 3 lacuri și 2 râuri marcate. Câte elemente de apă sunt?',5,'Adunăm 3 + 2 = 5.'],algo:['Pentru a observa o zonă: 1. Alegi locul. 2. Privești imaginea. 3. Notezi observația. Care este primul pas?',0,['Aleg locul','Notez observația','Trag concluzia']]},
'8-9':{math:['Pe o grilă, satelitul observă 4 rânduri cu câte 5 celule. Câte celule sunt?',20,'Calculăm 4 × 5 = 20.'],algo:['Pentru a compara două imagini ale aceluiași loc, care este ordinea potrivită?',1,['Trag concluzia → aleg imaginile → verific data','Aleg imaginile → verific locul și data → compar','Compar → șterg datele → aleg locul']]},
'9-10':{math:['Suprafața unei păduri scade de la 45 la 32 de hectare. Cu câte hectare a scăzut?',13,'45 − 32 = 13 hectare.'],algo:['Când norii acoperă o imagine optică, algoritmul de analiză ar trebui să…',2,['inventeze ce se află dedesubt','declare automat pădure','marcheze observația drept incompletă și să solicite alte date']]}}
,weather:{
'7-8':{math:['Luni au fost 10°C, marți 12°C. Cu câte grade a crescut temperatura?',2,'12 − 10 = 2°C.'],algo:['Ce faci mai întâi când completezi jurnalul meteo?',0,['Observ vremea','Scriu rezultatul fără să observ','Inventez temperatura']]},
'8-9':{math:['Temperaturile sunt 12°C, 15°C și 11°C. Care este diferența dintre maxim și minim?',4,'15 − 11 = 4°C.'],algo:['Care este ordinea corectă pentru o măsurătoare?',1,['Notez → aleg instrumentul → măsor','Aleg instrumentul → măsor → notez','Ghicesc → notez → verific']]},
'9-10':{math:['La orele 9, 12 și 15 sunt 10°C, 16°C și 15°C. Care este media aritmetică, aproximată la o zecimală?',13.7,'(10 + 16 + 15) / 3 = 13,7°C, rotunjit la o zecimală.'],algo:['Dacă valoarea unui senzor lipsește, ce pas este responsabil?',2,['O înlocuiesc cu zero fără explicații','O înlocuiesc cu o valoare inventată','Marchez lipsa și verific instrumentul']]}}
,nature:{
'7-8':{math:['În grădină sunt 4 flori roșii și 3 galbene. Câte flori sunt?',7,'4 + 3 = 7.'],algo:['Pentru a îngriji o plantă, care este primul pas?',1,['Torn mereu apă','Observ solul și planta','Rup frunzele']]},
'8-9':{math:['Pe 3 straturi cresc câte 4 plante. Câte plante cresc în total?',12,'3 × 4 = 12.'],algo:['Pentru a compara două zone cu flori, care este o regulă corectă?',0,['Observ aceeași durată în ambele zone','Observ una un minut și alta o oră','Număr numai insectele preferate']]},
'9-10':{math:['Într-o zonă observi 18 albine, în alta 11, în intervale egale. Care este diferența observată?',7,'18 − 11 = 7 albine observate. Datele singure nu explică de ce.'],algo:['Dacă apar mai puține insecte într-o zonă, ce verifici înainte de concluzie?',1,['Presupun că au dispărut','Compar vremea, ora și durata observațiilor','Conchid că florile sunt inutile']]}}
,recycle:{
'7-8':{math:['Strângi 3 ambalaje din hârtie și 4 din plastic. Câte ambalaje ai?',7,'3 + 4 = 7.'],algo:['Care este o ordine potrivită pentru colectarea separată?',0,['Identific materialul → verific regulile locale → depun ambalajul','Arunc → verific → identific','Amestec toate materialele']]},
'8-9':{math:['O clasă colectează 5 cutii luni și 7 marți. Câte cutii a colectat?',12,'5 + 7 = 12.'],algo:['Ce verifici înainte să depui un ambalaj compozit?',2,['Doar culoarea lui','Dacă îmi place','Marcajul și regulile locale de colectare']]},
'9-10':{math:['Clasa reduce numărul ambalajelor de la 40 la 25. Cu câte ambalaje a scăzut numărul?',15,'40 − 25 = 15 ambalaje.'],algo:['Ce pași permit verificarea eficienței unui plan de reducere a deșeurilor?',1,['Schimb metoda de numărare zilnic','Număr înainte → aplic măsura → număr după, în condiții comparabile','Aleg doar rezultatele favorabile']]}}
};
let steamAnswers={math:'',algo:-1};
function renderSteam(){
const current=STEAM[category][age],container=$('steamArea');container.replaceChildren();
const title=document.createElement('h2');title.textContent='🔢 Matematică și 🤖 Gândire algoritmică';container.appendChild(title);
const m=document.createElement('p');m.textContent='Matematică: '+current.math[0];container.appendChild(m);
const input=document.createElement('input');input.type='number';input.step='any';input.inputMode='decimal';input.placeholder='Răspuns numeric';input.setAttribute('aria-label','Răspuns la provocarea de matematică');input.style.cssText='font:inherit;padding:11px;border:1px solid #a5c8df;border-radius:10px;max-width:100%;width:220px';input.oninput=()=>steamAnswers.math=input.value;container.appendChild(input);
const a=document.createElement('p');a.textContent='Algoritmică: '+current.algo[0];container.appendChild(a);
shuffledOptions(current.algo[2]).sort((a,b)=>a.originalIndex===current.algo[1]?1:b.originalIndex===current.algo[1]?-1:0).forEach(({text,originalIndex},i)=>{const b=document.createElement('button');b.type='button';b.className='option';b.textContent=text;b.setAttribute('aria-pressed','false');b.onclick=()=>{steamAnswers.algo=originalIndex;[...container.querySelectorAll('.steamChoice')].forEach(x=>x.setAttribute('aria-pressed',String(Number(x.dataset.n)===i)))};b.classList.add('steamChoice');b.dataset.n=i;container.appendChild(b)});
const check=document.createElement('button');check.type='button';check.className='primary';check.textContent='Verifică matematica și algoritmul';container.appendChild(check);
const result=document.createElement('p');result.className='feedback';result.setAttribute('role','status');result.setAttribute('aria-live','polite');result.textContent='Rezolvă ambele provocări.';container.appendChild(result);
check.onclick=()=>{if(steamAnswers.math.trim()===''||steamAnswers.algo<0){result.textContent='Completează calculul și alege pașii algoritmului.';return}
const mv=Number(steamAnswers.math.replace(',','.'));const mathOK=Number.isFinite(mv)&&Math.abs(mv-current.math[1])<0.051;
const algoOK=steamAnswers.algo===current.algo[1];result.className='feedback '+(mathOK&&algoOK?'good':'warn');
result.textContent=(mathOK?'Matematică: corect. ':'Matematică: verifică rezultatul. ')+(algoOK?'Algoritmică: corect. ':'Algoritmică: verifică ordinea sau regula. ')+(mathOK&&algoOK?current.math[2]:'Poți încerca din nou.')};
}

function choose(a){age=lab.levels[a]?a:'7-8';try{localStorage.setItem('roboCip:ageTrack',age)}catch(e){}document.querySelectorAll('[data-age]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.age===age)));$('mission').textContent=lab.levels[age].mission;$('instruction').textContent=lab.levels[age].instruction;$('creative').textContent=lab.creative;idx=0;correct=0;finished=false;steamAnswers={math:'',algo:-1};renderSteam();try{$('reflection').value=localStorage.getItem('roboCip:science:'+category+':'+age)||''}catch(e){$('reflection').value=''}draw()}
$('verify').onclick=()=>{if(selection<0){feedback('Alege un răspuns.','warn');return}const t=lab.levels[age].questions[idx];if(selection===t[2]){finished=true;feedback('Corect! '+t[3],'good');$('next').hidden=idx===2;if(idx===2)feedback('Ai terminat cele trei provocări! '+t[3]+' Continuă cu misiunea creativă.','good')}else{finished=false;$('next').hidden=true;feedback('Mai încearcă. Gândește-te ce dovezi ai și recitește variantele.','warn')}};
$('next').onclick=()=>{if(finished&&idx<2){idx++;draw()}};
$('save').onclick=()=>{if(!$('reflection').value.trim()){ $('saveStatus').textContent='Scrie mai întâi răspunsul tău.';return}try{localStorage.setItem('roboCip:science:'+category+':'+age,$('reflection').value);$('saveStatus').textContent=' Reflecția este salvată pe acest dispozitiv.'}catch(e){$('saveStatus').textContent=' Salvarea nu a reușit.'}};
document.querySelectorAll('[data-age]').forEach(b=>b.onclick=()=>choose(b.dataset.age));$('title').textContent=lab.title;$('lead').textContent=lab.lead;
const extra=document.createElement('section');extra.className='card';extra.id='steamArea';document.querySelector('main').insertBefore(extra,document.querySelector('main').children[2]);
let stored='';try{stored=localStorage.getItem('roboCip:ageTrack')||''}catch(e){}choose(new URLSearchParams(location.search).get('age')||stored);
if(typeof roboLogActivity==='function')roboLogActivity({title:lab.title,module:'Cartografie digitală și mediu',type:'Științe – explorare și investigație'});
})();