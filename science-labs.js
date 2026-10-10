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
const lab=DB[category];if(!lab)return;let age='7-8',idx=0,selection=-1,correct=0,finished=false;
const feedback=(t,kind='')=>{$('feedback').textContent=t;$('feedback').className='feedback '+kind};
function draw(){const t=lab.levels[age].questions[idx];$('scenario').textContent=t[0];$('choices').replaceChildren();selection=-1;$('next').hidden=true;t[1].forEach((option,i)=>{const b=document.createElement('button');b.textContent=option;b.type='button';b.className='option';b.setAttribute('aria-pressed','false');b.onclick=()=>{selection=i;[...$('choices').children].forEach((c,j)=>c.setAttribute('aria-pressed',String(i===j)));feedback('Răspuns ales. Apasă „Verifică”.')};$('choices').appendChild(b)});$('progress').textContent='Provocarea '+(idx+1)+' din 3';feedback('Alege o explicație pe baza observațiilor.')}
function choose(a){age=lab.levels[a]?a:'7-8';try{localStorage.setItem('roboCip:ageTrack',age)}catch(e){}document.querySelectorAll('[data-age]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.age===age)));$('mission').textContent=lab.levels[age].mission;$('instruction').textContent=lab.levels[age].instruction;$('creative').textContent=lab.creative;idx=0;correct=0;finished=false;try{$('reflection').value=localStorage.getItem('roboCip:science:'+category+':'+age)||''}catch(e){$('reflection').value=''}draw()}
$('verify').onclick=()=>{if(selection<0){feedback('Alege un răspuns.','warn');return}const t=lab.levels[age].questions[idx];if(selection===t[2]){finished=true;feedback('Corect! '+t[3],'good');$('next').hidden=idx===2;if(idx===2)feedback('Ai terminat cele trei provocări! '+t[3]+' Continuă cu misiunea creativă.','good')}else{finished=false;$('next').hidden=true;feedback('Mai încearcă. Gândește-te ce dovezi ai și recitește variantele.','warn')}};
$('next').onclick=()=>{if(finished&&idx<2){idx++;draw()}};
$('save').onclick=()=>{if(!$('reflection').value.trim()){ $('saveStatus').textContent='Scrie mai întâi răspunsul tău.';return}try{localStorage.setItem('roboCip:science:'+category+':'+age,$('reflection').value);$('saveStatus').textContent=' Reflecția este salvată pe acest dispozitiv.'}catch(e){$('saveStatus').textContent=' Salvarea nu a reușit.'}};
document.querySelectorAll('[data-age]').forEach(b=>b.onclick=()=>choose(b.dataset.age));$('title').textContent=lab.title;$('lead').textContent=lab.lead;
let stored='';try{stored=localStorage.getItem('roboCip:ageTrack')||''}catch(e){}choose(new URLSearchParams(location.search).get('age')||stored);
if(typeof roboLogActivity==='function')roboLogActivity({title:lab.title,module:'Cartografie digitală și mediu',type:'Științe – explorare și investigație'});
})();