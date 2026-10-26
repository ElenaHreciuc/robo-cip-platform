(function(g){'use strict';
const journeyKey='roboCip:explore:student-journey.html';
const specs=[
['roboCity','🏙️ Constructor de orașe 3D','/resources/constructor-3d.html','array'],
['roboCip:rhythmPortfolio','🥁 Laboratorul ritmurilor','/resources/laborator-ritmuri.html','array'],
['roboCip:stories','🎬 Constructor de povești','/resources/constructor-povesti.html','array'],
['roboCip:steamMissions','🌍 Misiuni STEAM din viața reală','/learner.html?moduleId=programare-vizuala','array'],
['reflectionNotes','🗣️ Reflecțiile elevului','/portofolio.html','array'],
['shadowObs','🌤️ Observații asupra umbrelor','/resources/portofolio.html','array']
];
const individual=[
['roboCip:transform:','🔷 Mașina transformărilor','/resources/masina-transformari.html'],
['roboCip:scratchjr:','🧩 Scratch online','/resources/scratchjr-steam.html']
];
const labs=[
['pod-inteligent','🌉 Podul Inteligent'],['parghii-echilibru','⚖️ Pârghii și echilibru'],['lumina-umbre','☀️ Lumina și umbrele'],['corpuri-geometrice','📐 Corpuri geometrice']
];
function read(storage){const cards=[];for(const [key,title,url] of specs){try{const items=JSON.parse(storage.getItem(key)||'[]');if(Array.isArray(items))for(const record of items)cards.push({key,title,url,record})}catch(e){}}
for(const [prefix,title,url] of individual)for(const age of ['7-8','8-9','9-10']){const val=storage.getItem(prefix+age);if(val&&val.trim())cards.push({key:prefix+age,title,url,record:{age,description:val}})}
for(const [id,title] of labs)for(const age of ['7-8','8-9','9-10']){const val=storage.getItem('roboCip:engineering:'+id+':'+age);if(val&&val.trim())cards.push({key:id+':'+age,title,url:'/resources/'+id+'.html',record:{age,description:val}})}
try {
  const journey=JSON.parse(storage.getItem(journeyKey)||'{}');
  if(journey && typeof journey==='object' && !Array.isArray(journey)) {
    const titles=['Jurnal de descoperire','Fișă de investigație','Plan de prototip și prezentare'];
    titles.forEach((title,stage)=>{
      const saved=journey[stage];
      if(saved && typeof saved.answer==='string' && saved.answer.trim()) {
        cards.push({key:journeyKey,title,url:'/student-journey.html?stage='+stage,record:{
          ...saved,stage,description:saved.answer,finished:saved.finished===true,
          student:typeof journey.student==='string'?journey.student:''
        }});
      }
    });
  }
} catch(e) {}
return cards}
function flat(item){const r=item.record||{},str=(v)=>typeof v==='string'?v:'',parts=[];for(const k of ['title','description','notes','reflection','activity','q1','q2','q3'])if(str(r[k]).trim())parts.push(str(r[k]).trim());if(r.id)parts.push('Misiune: '+r.id);if(r.heights&&Array.isArray(r.heights))parts.push('Cuburi: '+r.heights.reduce((a,b)=>a+(Number(b)||0),0));if(r.A&&r.B)parts.push('Ritmuri A/B: '+r.A.filter(Boolean).length+'/'+r.B.filter(Boolean).length+' sunete');if(r.scenes)parts.push('Scene: '+r.scenes.length);if(r.values)parts.push('Valori: '+JSON.stringify(r.values));return parts.join(' · ').slice(0,430)||'Produs salvat'}
function render(target,items) {
  target.replaceChildren();
  if(!items.length) {
    const p=document.createElement('p');
    p.textContent='Nu există încă produse salvate în acest browser sau în fișierul încărcat.';
    target.appendChild(p);
    return;
  }
  const groups=new Map();
  for(const item of items) {
    if(!groups.has(item.title)) groups.set(item.title,[]);
    groups.get(item.title).push(item);
  }
  for(const [title,group] of groups) {
    const section=document.createElement('section');
    section.className='portfolio-group';
    const h=document.createElement('h2');
    h.textContent=title+' ('+group.length+')';
    section.appendChild(h);
    const grid=document.createElement('div');
    grid.className='portfolio-grid';
    for(const item of group) {
      const r=item.record||{},card=document.createElement('article');
      card.className='portfolio-card';
      const link=document.createElement('a');
      link.href=item.url;
      link.textContent=item.title+' ↗';
      link.className='portfolio-link';
      card.appendChild(link);
      const details=document.createElement('p');
      details.textContent=flat(item);
      card.appendChild(details);
      const small=document.createElement('small');
      const meta=[r.age?'Vârsta: '+r.age:'',r.date?'Salvat: '+r.date:''].filter(Boolean);
      if(item.key===journeyKey) {
        if(r.student) meta.push('Explorator: '+r.student);
        meta.push('Stare: '+(r.finished?'Finalizat':'În lucru'));
      }
      small.textContent=meta.join(' · ');
      card.appendChild(small);
      grid.appendChild(card);
    }
    section.appendChild(grid);
    target.appendChild(section);
  }
}
function exportData(){return {format:'robo-cip-portfolio-v1',exportedAt:new Date().toISOString(),items:read(localStorage)}}
function download(data){const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='robo-cip-portofoliu-'+new Date().toISOString().slice(0,10)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
g.RoboPortfolio={read,render,exportData,download,flat}
})(window);
