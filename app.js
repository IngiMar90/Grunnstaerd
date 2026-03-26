const APP_NAME = 'Grunnstærðfræði';
const EMOJIS = ['🍎','⭐','🐻','🚗','🟡','🐶','🦋','🍓'];
const MODES = ['Telja hluti','Finna réttan fjölda','Hvað kemur næst?','Hvað kemur á undan?','Hvað er stærra?','Jafnmargir?','Mynstur'];
const storeKey='grunnstaerdfraedi_data_v1';
const app=document.getElementById('app');
const state={data:loadData(),student:'',mode:MODES[0],count:10,questions:[],i:0,correct:0,wrong:0,start:0};
state.student=state.data.last_student||'';
function loadData(){try{return JSON.parse(localStorage.getItem(storeKey))||{students:{},last_student:'',sessions:[]}}catch{return {students:{},last_student:'',sessions:[]}}}
function saveData(){localStorage.setItem(storeKey,JSON.stringify(state.data))}
function h(s){app.innerHTML=s}
function btn(text,cls='primary',id=''){return `<button ${id?`id="${id}"`:''} class="btn ${cls}">${text}</button>`}
function option(text,i){return `<button class="option" data-idx="${i}">${text}</button>`}
function studentOptions(){return Object.keys(state.data.students).sort((a,b)=>a.localeCompare(b,'is')).map(s=>`<option ${s===state.student?'selected':''}>${s}</option>`).join('')}
function home(){h(`<div class="wrap"><div class="top"><h1>${APP_NAME}</h1>${btn('Yfirlit','success','sumBtn')}</div><div class="grid"><div class="card"><h2>Veldu nemanda</h2><div class="row"><select id="studentSel"><option value="">Veldu nemanda</option>${studentOptions()}</select><input id="newStudent" placeholder="Nýr nemandi"><button class="btn success" id="addStudent">Nýr nemandi</button></div><div class="row" style="margin-top:18px"><label>Fjöldi spurninga</label><select id="countSel"><option>5</option><option selected>10</option><option>15</option></select></div><div style="margin-top:18px"><h2>Veldu æfingu</h2>${MODES.map((m,idx)=>`<div><label><input type="radio" name="mode" value="${m}" ${idx===0?'checked':''}> ${m}</label></div>`).join('')}</div><div style="margin-top:22px">${btn('Byrja','primary','startBtn')}</div></div><div class="card"><h2>Hvað er inni?</h2><p>• Telja hluti<br>• Para tölu og fjölda<br>• Hvað kemur næst?<br>• Hvað kemur á undan?<br>• Hvað er stærra?<br>• Jafnmargir?<br>• Einföld mynstur</p><p class="small">Nafn appsins er nú Grunnstærðfræði.</p></div></div></div>`);
  document.getElementById('studentSel').onchange=e=>state.student=e.target.value;
  document.getElementById('countSel').onchange=e=>state.count=+e.target.value;
  document.querySelectorAll('input[name=mode]').forEach(r=>r.onchange=e=>state.mode=e.target.value);
  document.getElementById('addStudent').onclick=()=>{const n=document.getElementById('newStudent').value.trim(); if(!n) return; state.data.students[n]??={sessions:0,correct:0,wrong:0}; state.student=n; state.data.last_student=n; saveData(); home();};
  document.getElementById('startBtn').onclick=()=>{if(!state.student){alert('Veldu eða búðu til nemanda fyrst.'); return;} state.data.students[state.student]??={sessions:0,correct:0,wrong:0}; state.data.last_student=state.student; saveData(); startSession();};
  document.getElementById('sumBtn').onclick=summary;
}
function rand(a,b){return Math.floor(Math.random()*(b-a+1))+a}
function sample(arr,n){const a=[...arr]; const out=[]; while(a.length&&out.length<n){out.push(a.splice(rand(0,a.length-1),1)[0])} return out}
function countEmoji(n,e){return Array(n).fill(e).join(' ')}
function buildBank(mode){const bank=[]; for(let n=1;n<=10;n++){ if(mode==='Telja hluti'){const e=EMOJIS[n%EMOJIS.length]; const opts=sample([1,2,3,4,5,6,7,8,9,10].filter(x=>x!==n),3).concat(n).sort(()=>Math.random()-.5); bank.push({prompt:'Hversu margir?', display:`<div class="emoji">${countEmoji(n,e)}</div>`, opts:opts.map(String), answer:String(n)})}
 if(mode==='Finna réttan fjölda'){const target=n; const nums=sample([1,2,3,4,5,6,7,8,9,10].filter(x=>x!==target),3).concat(target).sort(()=>Math.random()-.5); const e=EMOJIS[(n+2)%EMOJIS.length]; bank.push({prompt:`Veldu mynd með tölunni ${target}`, display:'', opts:nums.map(x=>countEmoji(x,e)), answer:countEmoji(target,e)})}
 if(mode==='Hvað kemur næst?' && n<10){const ans=n+1; const opts=sample([1,2,3,4,5,6,7,8,9,10].filter(x=>x!==ans),3).concat(ans).sort(()=>Math.random()-.5); bank.push({prompt:`Hvað kemur næst á eftir ${n}?`, display:`<div class="big">${n}</div>`, opts:opts.map(String), answer:String(ans)})}
 if(mode==='Hvað kemur á undan?' && n>1){const ans=n-1; const opts=sample([1,2,3,4,5,6,7,8,9,10].filter(x=>x!==ans),3).concat(ans).sort(()=>Math.random()-.5); bank.push({prompt:`Hvað kemur á undan ${n}?`, display:`<div class="big">${n}</div>`, opts:opts.map(String), answer:String(ans)})}
 if(mode==='Hvað er stærra?' && n<10){const b=rand(n+1,10); const big=Math.max(n,b); const vals=[n,b].sort(()=>Math.random()-.5); bank.push({prompt:'Hvaða tala er stærri?', display:`<div class="big">${vals[0]} eða ${vals[1]}</div>`, opts:vals.map(String), answer:String(big)})}
 if(mode==='Jafnmargir?'){const e1=EMOJIS[n%EMOJIS.length], e2=EMOJIS[(n+1)%EMOJIS.length]; const same=Math.random()<.5; const m=same?n:Math.max(1,Math.min(10,n+(Math.random()<.5?-1:1))); bank.push({prompt:'Eru jafnmargir hlutir?', display:`<div class="emoji">${countEmoji(n,e1)}</div><div class="emoji">${countEmoji(m,e2)}</div>`, opts:['Já','Nei'], answer:same?'Já':'Nei'})}
 if(mode==='Mynstur' && n<9){const a=(n%3)+1,b=((n+1)%3)+1; const pat=`${a} ${b} ${a} ${b} ?`; const ans=String(a); const opts=sample(['1','2','3'].filter(x=>x!==ans),2).concat(ans).sort(()=>Math.random()-.5); bank.push({prompt:'Hvað kemur næst í mynstrinu?', display:`<div class="big">${pat}</div>`, opts, answer:ans})}
 }
 return bank}
function startSession(){state.questions=sample(buildBank(state.mode), state.count); state.i=0; state.correct=0; state.wrong=0; state.start=Date.now(); showQuestion();}
function showQuestion(msg=''){const q=state.questions[state.i]; h(`<div class="wrap"><div class="top"><h1>${APP_NAME}</h1><div class="small">Nemandi: ${state.student} | ${state.mode} | ${state.i+1}/${state.questions.length}</div></div><div class="card"><div class="status">${msg}</div><h2>${q.prompt}</h2>${q.display||''}<div class="option-grid" style="margin-top:18px">${q.opts.map((o,idx)=>option(o,idx)).join('')}</div><div style="margin-top:18px">${btn('Heim','soft','homeBtn')}</div></div></div>`);
 document.querySelectorAll('.option').forEach(b=>b.onclick=()=>{const val=state.questions[state.i].opts[+b.dataset.idx]; if(val===q.answer){state.correct++; state.i++; if(state.i>=state.questions.length) endSession(); else showQuestion('Rétt!')} else {state.wrong++; showQuestion('Rangt, reyndu aftur.')}});
 document.getElementById('homeBtn').onclick=home;
}
function endSession(){const mins=(Date.now()-state.start)/60000||1/60; const cpm=(state.correct/mins).toFixed(1); const st=state.data.students[state.student]; st.sessions++; st.correct+=state.correct; st.wrong+=state.wrong; state.data.sessions.unshift({date:new Date().toISOString(), student:state.student, mode:state.mode, total:state.questions.length, correct:state.correct, wrong:state.wrong, cpm:+cpm}); saveData(); h(`<div class="wrap"><div class="card"><h1>Lotu lokið</h1><p>Rétt: ${state.correct}</p><p>Rangt: ${state.wrong}</p><p>Rétt á mínútu: ${cpm}</p>${btn('Aftur heim','primary','homeBtn')}</div></div>`); document.getElementById('homeBtn').onclick=home}
function summary(){const students=Object.entries(state.data.students); const sessions=state.data.sessions.slice(0,20); h(`<div class="wrap"><div class="top"><h1>Yfirlit</h1>${btn('Heim','primary','homeBtn')}</div><div class="grid"><div class="card"><h2>Nemendur</h2>${students.length?students.map(([n,s])=>`<p><b>${n}</b><br>Lotur: ${s.sessions} | Rétt: ${s.correct} | Rangt: ${s.wrong}</p>`).join(''):'<p>Engin gögn enn.</p>'}</div><div class="card"><h2>Síðustu lotur</h2>${sessions.length?sessions.map(s=>`<p><b>${s.student}</b> - ${s.mode}<br>Rétt: ${s.correct}/${s.total} | CPM: ${s.cpm}</p>`).join(''):'<p>Engar lotur enn.</p>'}</div></div></div>`); document.getElementById('homeBtn').onclick=home}
if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js'))}
home();
