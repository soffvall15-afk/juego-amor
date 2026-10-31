const C=window.GAME_CONFIG,S=document.querySelector('#screen'),BGM=document.querySelector('#bgm');
let level=0,score=0,mission=0,advanceTimer=null,heroX=10,heroY=14,chosenRole='nicholas';
const avatars={nicholas:'🧑🏻‍🚀',valentina:'👩🏻‍🚀'};
const levels=[
 ['THE BEGINNING','Cruza la distancia y encuentra la señal que nos conecta.','💖','Encuentra 1 corazón'],
 ['LITTLE THINGS','Cinco detalles que viajan contigo aunque estemos lejos.','🌸','Descubre 5 recuerdos'],
 ['OUR LITTLE WORLD','Construye nuestro pequeño mundo: recoge las estrellas del cielo.','⭐','Recoge 4 estrellas'],
 ['THE HEART QUEST','Tres pruebas para reconstruir un corazón a distancia.','🧩','Completa 3 fragmentos']
];
document.querySelector('#start').onclick=showCharacterSelect;
function showCharacterSelect(){S.className='screen character-select';S.innerHTML=`<div class="stars">✦ ✧ ✦ ✧ ✦</div><small>CHOOSE YOUR PLAYER</small><h1>¿QUIÉN JUGARÁ?</h1><p class="select-copy">Elige el personaje que quieres controlar durante la aventura.</p><div class="character-cards"><button class="character-card" data-role="nicholas"><span class="avatar">${avatars.nicholas}</span><strong>NICHOLAS</strong><small>PLAYER 1</small></button><button class="character-card" data-role="valentina"><span class="avatar">${avatars.valentina}</span><strong>VALENTINA</strong><small>PLAYER 2</small></button></div><p class="hint">Podrás cambiar esta elección cuando quieras volver al menú.</p>`;document.querySelectorAll('[data-role]').forEach(b=>b.onclick=()=>beginGame(b.dataset.role))}
function beginGame(role){chosenRole=role;showLevel(0);startMusic()}
function startMusic(){BGM.volume=.34;BGM.play().catch(()=>{});const b=document.querySelector('#music');if(b){b.textContent='♫ PAUSAR';b.setAttribute('aria-label','Pausar música')}}
function toggleMusic(){if(BGM.paused){startMusic();document.querySelector('#music').textContent='♫ PAUSAR'}else{BGM.pause();document.querySelector('#music').textContent='♫ MÚSICA'}}
function shell(title,sub,goal){
 S.className='screen play';
 const heroAvatar=avatars[chosenRole],npcAvatar=avatars[chosenRole==='nicholas'?'valentina':'nicholas'];
 S.innerHTML=`<div class="hud"><span>♡ ${C.playerName} y ${C.partnerName}</span><span>CAPÍTULO ${level+1}/5</span><span>★ ${score}</span></div><div class="chapter"><small>MISSION ${String(level+1).padStart(2,'0')}</small><h2>${title}</h2><p>${sub}</p></div><div class="mission"><span>OBJETIVO</span><b id="goal">${goal}</b><i id="progress">0 / ${level===0?1:level===1?5:level===2?4:3}</i></div><div class="world" id="world"><div class="moon">☾</div><div class="hero" title="${chosenRole==='nicholas'?C.playerName:C.partnerName}">${heroAvatar}</div><div class="npc" title="${chosenRole==='nicholas'?C.partnerName:C.playerName}">${npcAvatar}</div></div><div class="actions"><button class="small" id="back">↩ MENU</button><button class="small" id="music">♫ AMBIENTE</button></div>`;
 heroX=10;heroY=14;document.querySelector('.hero').style.left=heroX+'%';document.querySelector('.hero').style.bottom=heroY+'%';
 document.querySelector('#back').onclick=()=>location.reload();
 document.querySelector('#music').onclick=toggleMusic;
}
function showLevel(n){
 clearTimeout(advanceTimer);level=n;mission=0;shell(levels[n][0],levels[n][1],levels[n][3]);
 if(n===0)add('heart','💖',55,35,()=>collect('¡La señal llegó! Incluso a kilómetros de distancia, siempre encontramos el camino.',1));
 if(n===1)C.memories.forEach((m,i)=>add('item',levels[n][2],12+i*18,18+(i%2)*29,()=>{dialog(`RECUERDO ${i+1}/5 · ${m}`);collect('',5)}));
 if(n===2)for(let i=0;i<4;i++)add('heart','⭐',18+i*21,20+(i%2)*29,()=>collect('Una estrella más para nuestro cielo compartido.',4));
 if(n===3)for(let i=0;i<3;i++)add('item','🧩',20+i*27,24+(i%2)*27,()=>collect('Fragmento recuperado. El corazón vuelve a latir.',3));
}
function add(cls,icon,left,bottom,fn){const e=document.createElement('div');e.className=cls;e.textContent=icon;e.dataset.left=left;e.dataset.bottom=bottom;e.dataset.action='1';e.style.left=left+'%';e.style.bottom=bottom+'%';e.onclick=()=>activate(e,fn);e._action=fn;document.querySelector('#world').append(e)}
function activate(e,fn=e._action){if(!e||e.dataset.done)return;e.dataset.done='1';e.remove();fn()}
document.addEventListener('keydown',e=>{if(!document.querySelector('.play'))return;const k=e.key.toLowerCase();if(['arrowleft','arrowright','arrowup','arrowdown','a','d','w','s'].includes(k)){e.preventDefault();if(k==='arrowleft'||k==='a')heroX-=4;if(k==='arrowright'||k==='d')heroX+=4;if(k==='arrowup'||k==='w')heroY+=4;if(k==='arrowdown'||k==='s')heroY-=4;heroX=Math.max(4,Math.min(86,heroX));heroY=Math.max(8,Math.min(60,heroY));const h=document.querySelector('.hero');h.style.left=heroX+'%';h.style.bottom=heroY+'%'}if(k===' '||k==='enter'){e.preventDefault();const targets=[...document.querySelectorAll('[data-action="1"]')];const near=targets.sort((a,b)=>Math.hypot(parseFloat(a.dataset.left)-heroX,parseFloat(a.dataset.bottom)-heroY)-Math.hypot(parseFloat(b.dataset.left)-heroX,parseFloat(b.dataset.bottom)-heroY))[0];if(near&&Math.hypot(parseFloat(near.dataset.left)-heroX,parseFloat(near.dataset.bottom)-heroY)<24)activate(near);else dialog('Acércate a un objeto brillante para interactuar ✦')}});
function collect(message,total){mission++;score++;document.querySelector('#progress').textContent=`${mission} / ${total}`;if(message)dialog(message);if(mission>=total){document.querySelector('#goal').textContent='MISIÓN COMPLETADA ✓';advanceTimer=setTimeout(()=>advance(),850)}}
function advance(){if(level<3){level++;showLevel(level)}else final()}
function dialog(t){const host=document.querySelector('.world');if(!host)return;const d=document.createElement('div');d.className='dialog';d.innerHTML=`<b>PLAYER 2</b><br>${t}`;host.append(d);setTimeout(()=>d.remove(),2200)}
function final(){level=4;S.className='screen final';S.innerHTML=`<div class="final-orbit orbit-a">✦</div><div class="final-orbit orbit-b">✧</div><div class="stars">✦ ✧ ✦ ✧ ✦</div><small>MISSION 05 · DISTANCE CANNOT STOP US</small><h1>THE FINAL QUESTION</h1><div class="letter">${C.finalLetter}<br><br><b>¿Quieres ser mi novia?</b></div><div id="final-feedback" aria-live="polite"></div><div class="actions"><button id="yes">YES, I'LL BE YOUR PLAYER 2!</button><button class="small" id="no">NO… (con cariño)</button></div>`;document.querySelector('#yes').onclick=win;document.querySelector('#no').onclick=reject}
function reject(){document.querySelector('#final-feedback').innerHTML='<div class="soft-no"><strong>TODO BIEN 💜</strong><br>Sin presión, de verdad. Me alegra compartir esta aventura contigo, y lo más importante es que te sientas cómoda.<br><button class="small retry" id="retry">VOLVER A LA PREGUNTA</button></div>';document.querySelector('#retry').onclick=()=>final()}
function win(){S.innerHTML='<div class="stars">💖 ✦ 💖 ✦ 💖</div><p class="win">GAME COMPLETED<br>FOREVER PLAYER 2 UNLOCKED</p><div class="letter">¡Nuestro equipo es invencible, incluso a distancia!<br><br>💕 🌙 💕</div>'}
