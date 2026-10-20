const stages=[...document.querySelectorAll('.stage')];
const dots=document.getElementById('dots');
stages.forEach(()=>dots.appendChild(document.createElement('b')));
let cur=0, timers=[], auto=false, formatted=false, deleted=false, selRow=null;

function clearT(){timers.forEach(t=>{clearTimeout(t);clearInterval(t)});timers=[]}
function go(n){
  clearT(); cur=Math.max(0,Math.min(stages.length-1,n));
  stages.forEach((s,i)=>s.classList.toggle('active',i===cur));
  [...dots.children].forEach((d,i)=>d.classList.toggle('on',i===cur));
  enter(cur);
  if(auto) scheduleAuto();
}
function next(){ if(cur<stages.length-1) go(cur+1) }
function prev(){ go(cur-1) }

/* ---- etapas com animação ---- */
function enter(i){
  const name=stages[i].dataset.name;
  if(name==='Inicialização') runPost();
  if(name==='Formatação do disco') resetPart();
  if(name==='Instalando') runInstall();
  if(name==='Reinício') runReboot();
  if(name==='Preparando') runPrep();
  if(name==='Finalizando') runFinal();
  if(name==='Área de trabalho') runDesk();
}

/* Inicialização: POST -> "pressione qualquer tecla" -> carregando arquivos */
function runPost(){
  const post=document.getElementById('postText'),wrap=document.getElementById('loadWrap'),fill=document.getElementById('lfill');
  post.style.display='block';wrap.style.display='none';fill.style.width='0';post.innerHTML='';
  const lines=[
    'Sistema BIOS v2.4 — Copyright (C) Fabricante',
    '',
    'CPU: Processador 4 núcleos @ 3.20GHz',
    'Memória: 8192 MB OK',
    'Detectando unidades SATA…',
    '  Porta 0: Disco rígido 256 GB',
    '  Porta 1: Unidade de DVD / USB inicializável',
    '',
    'Iniciando pelo dispositivo USB/DVD…',
    '',
    'Pressione qualquer tecla para iniciar a partir do CD ou DVD…'
  ];
  let i=0;
  const t=setInterval(()=>{
    if(i<lines.length){post.innerHTML+=lines[i]+'\n';i++}
    else{
      clearInterval(t);post.innerHTML+='<span class="cur"></span>';
      timers.push(setTimeout(()=>{
        post.style.display='none';wrap.style.display='flex';
        let p=0;const lt=setInterval(()=>{
          p+=1.5+Math.random()*3.5;if(p>100)p=100;fill.style.width=p+'%';
          if(p>=100){clearInterval(lt);timers.push(setTimeout(next,700))}
        },90);timers.push(lt);
      },1800));
    }
  },380);
  timers.push(t);
}

/* Particionamento */
const modal=document.getElementById('modal'),mtext=document.getElementById('mtext'),
      mbar=document.getElementById('mbar'),mfill=document.getElementById('mfill'),
      mbtns=document.getElementById('mbtns'),mok=document.getElementById('mok'),mcancel=document.getElementById('mcancel');
function resetPart(){
  formatted=false;deleted=false;selRow=null;
  const rows=document.querySelectorAll('#ptable tr.row');
  rows.forEach(r=>r.classList.remove('sel','gone'));
  rows[2].children[1].textContent='237,2 GB';rows[2].children[2].textContent='89,4 GB';
  rows[2].children[0].textContent='Unidade 0 Partição 3';
  document.getElementById('hint').innerHTML='Selecione a <b>Partição 3</b> e clique em <b>Formatar</b> para apagar todo o conteúdo antes de instalar.';
  modal.classList.remove('on');
}
document.querySelectorAll('#ptable tr.row').forEach(r=>r.onclick=()=>{
  document.querySelectorAll('#ptable tr.row').forEach(x=>x.classList.remove('sel'));
  r.classList.add('sel');selRow=+r.dataset.i;
});
function runBar(text,done){
  mtext.textContent=text;mbar.style.display='block';mbtns.style.display='none';mfill.style.width='0';
  modal.classList.add('on');
  let p=0;const t=setInterval(()=>{p+=4+Math.random()*7;if(p>=100){p=100;clearInterval(t);setTimeout(()=>{modal.classList.remove('on');done()},350)}mfill.style.width=p+'%'},120);
  timers.push(t);
}
document.getElementById('aFormat').onclick=()=>{
  if(selRow!==2){alert('Selecione a Partição 3 para formatar.');return}
  mtext.textContent='Se você formatar esta partição, todos os dados nela serão perdidos. Deseja continuar?';
  mbar.style.display='none';mbtns.style.display='block';modal.classList.add('on');
  mok.onclick=()=>{
    mbtns.style.display='none';
    runBar('Formatando a partição… Apagando dados e criando sistema de arquivos NTFS.',()=>{
      formatted=true;
      const r=document.querySelectorAll('#ptable tr.row')[2];
      r.children[2].textContent='237,2 GB';
      document.getElementById('hint').innerHTML='✔ <b>Partição formatada com sucesso.</b> Clique em Avançar para instalar.';
    });
  };
  mcancel.onclick=()=>modal.classList.remove('on');
};
document.getElementById('aDelete').onclick=()=>{
  if(selRow!==2){alert('Selecione a Partição 3 para excluir.');return}
  mtext.textContent='Se você excluir esta partição, perderá todos os dados nela. Deseja continuar?';
  mbar.style.display='none';mbtns.style.display='block';modal.classList.add('on');
  mok.onclick=()=>{
    modal.classList.remove('on');
    const r=document.querySelectorAll('#ptable tr.row')[2];
    r.children[0].textContent='Unidade 0 Espaço não alocado';r.children[1].textContent='237,2 GB';r.children[2].textContent='237,2 GB';
    r.classList.add('gone');deleted=true;
    document.getElementById('hint').innerHTML='Espaço não alocado. Selecione-o e clique em Avançar (o sistema criará as partições automaticamente).';
  };
  mcancel.onclick=()=>modal.classList.remove('on');
};

/* Instalação */
function runInstall(){
  const lis=[...document.querySelectorAll('#steps li')],fill=document.getElementById('ifill'),pct=document.getElementById('ipct');
  lis.forEach(l=>{l.className='';l.querySelector('.ic').textContent='○'});
  let p=0;fill.style.width='0';
  const marks=[0,25,50,70,90];
  const t=setInterval(()=>{
    p+=0.7+Math.random()*1.4; if(p>100)p=100;
    fill.style.width=p+'%';pct.textContent=Math.floor(p)+'%';
    lis.forEach((l,i)=>{
      const nxt=marks[i+1]??101;
      if(p>=nxt){l.className='done';l.querySelector('.ic').textContent='✔'}
      else if(p>=marks[i]){l.className='cur';l.querySelector('.ic').textContent='▶'}
    });
    if(p>=100){clearInterval(t);lis[4].className='done';lis[4].querySelector('.ic').textContent='✔';timers.push(setTimeout(next,900))}
  },120);
  timers.push(t);
}

/* Reinício */
function runReboot(){
  const el=document.getElementById('bootText');el.innerHTML='';
  const lines=['Concluindo a instalação…','Seu computador será reiniciado em alguns segundos.','','Reiniciando em 5…'];
  let i=0;
  const t=setInterval(()=>{ if(i<3){el.innerHTML+=lines[i]+'<br>';i++} else clearInterval(t)},500);
  timers.push(t);
  let c=5;
  timers.push(setTimeout(()=>{
    const cd=setInterval(()=>{
      c--; if(c>0){el.innerHTML=lines.slice(0,3).join('<br>')+'<br>Reiniciando em '+c+'…'}
      else{clearInterval(cd);el.innerHTML='';
        timers.push(setTimeout(()=>{el.innerHTML='BIOS v2.4 — Inicializando…<br>Detectando dispositivos de armazenamento…<br>Iniciando pelo disco rígido…';
          timers.push(setTimeout(next,2200))},800))}
    },900);timers.push(cd);
  },1500));
}

/* Preparando */
function runPrep(){
  const txt=document.getElementById('prepText'),pc=document.getElementById('prepPct');
  const msgs=['Preparando dispositivos','Preparando dispositivos','Preparando para a primeira utilização','Quase pronto'];
  let p=0;
  const t=setInterval(()=>{
    p+=2+Math.random()*4;if(p>100)p=100;
    pc.textContent=Math.floor(p)+'%';txt.textContent=msgs[Math.min(3,Math.floor(p/26))];
    if(p>=100){clearInterval(t);timers.push(setTimeout(next,700))}
  },150);timers.push(t);
}
document.querySelectorAll('#regList div').forEach(d=>d.onclick=()=>{
  document.querySelectorAll('#regList div').forEach(x=>x.classList.remove('sel'));d.classList.add('sel')});

/* Finalizando */
function runFinal(){
  const n=document.getElementById('uname').value.trim()||'Usuário';
  const el=document.getElementById('finText');
  const msgs=['Olá, '+n,'Estamos preparando tudo','Aplicando as configurações','Tudo pronto!'];
  let i=0;el.textContent=msgs[0];
  const t=setInterval(()=>{i++;if(i<msgs.length)el.textContent=msgs[i];else{clearInterval(t);next()}},1700);
  timers.push(t);
}

/* Desktop */
function runDesk(){
  const n=document.getElementById('uname').value.trim()||'Usuário';
  document.getElementById('wtext').textContent='Bem-vindo, '+n;
  const d=new Date();
  document.getElementById('clk').textContent=d.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});
  document.getElementById('dt').textContent=d.toLocaleDateString('pt-BR');
}

/* Navegação */
document.querySelectorAll('[data-next]').forEach(b=>b.addEventListener('click',e=>{
  if(b.id==='partNext' && !(formatted||deleted)){
    if(!confirm('A partição ainda não foi formatada. Continuar mesmo assim?'))return;
  }
  if(stages[cur].dataset.name==='Licença' && !document.getElementById('aceite').checked){
    alert('Marque "Aceito os termos de licença" para continuar.');return;
  }
  next();
}));
document.getElementById('bNext').onclick=next;
document.getElementById('bPrev').onclick=prev;
document.getElementById('bFull').onclick=()=>document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen();
document.getElementById('bReset').onclick=()=>{auto=false;document.getElementById('bAuto').textContent='▶ Automático (A)';go(0)};

/* Modo automático (para apresentar sem cliques) */
function scheduleAuto(){
  const name=stages[cur].dataset.name;
  if(name==='Área de trabalho'){
    /* Fim da apresentação: com o loop ligado, volta ao início após alguns segundos */
    if(loop) timers.push(setTimeout(restartLoop,6000));
    return;
  }
  if(['Inicialização','Instalando','Reinício','Preparando','Finalizando'].includes(name))return;
  if(name==='Formatação do disco'){
    timers.push(setTimeout(()=>{document.querySelectorAll('#ptable tr.row')[2].click()},1200));
    timers.push(setTimeout(()=>document.getElementById('aFormat').click(),2400));
    timers.push(setTimeout(()=>mok.click(),3600));
    timers.push(setTimeout(next,9000));return;
  }
  if(name==='Licença') timers.push(setTimeout(()=>document.getElementById('aceite').checked=true,1000));
  timers.push(setTimeout(next,2600));
}
/* Loop: no modo automático, recomeça a simulação ao chegar no final */
let loop=false;
function restartLoop(){
  if(!(auto&&loop))return;
  const ac=document.getElementById('aceite');if(ac)ac.checked=false;
  go(0);
}
function toggleLoop(){
  loop=!loop;
  document.getElementById('bLoop').textContent=loop?'🔁 Loop: ligado (L)':'🔁 Loop: desligado (L)';
  /* se já está no final em modo automático, aplica na hora */
  if(auto&&stages[cur].dataset.name==='Área de trabalho'){
    clearT();
    if(loop) timers.push(setTimeout(restartLoop,6000));
  }
}
document.getElementById('bLoop').onclick=toggleLoop;
document.getElementById('bAuto').onclick=toggleAuto;
function toggleAuto(){
  auto=!auto;document.getElementById('bAuto').textContent=auto?'⏸ Parar automático (A)':'▶ Automático (A)';
  if(auto) scheduleAuto(); else clearT();
}
function toggleHud(){document.body.classList.toggle('hud-off')}
document.getElementById('bHide').onclick=toggleHud;
document.getElementById('hudShow').onclick=toggleHud;
document.addEventListener('keydown',e=>{
  if(e.target.tagName==='INPUT'&&e.key!=='Escape')return;
  if(e.key==='h'||e.key==='H'){toggleHud();return}
  if(e.key==='ArrowRight')next();
  else if(e.key==='ArrowLeft')prev();
  else if(e.key==='Enter'){const b=stages[cur].querySelector('[data-next]');b?b.click():next()}
  else if(e.key==='a'||e.key==='A')toggleAuto();
  else if(e.key==='l'||e.key==='L')toggleLoop();
  else if(e.key==='f'||e.key==='F')document.getElementById('bFull').click();
  else if(e.key==='r'||e.key==='R')document.getElementById('bReset').click();
});
go(0);
