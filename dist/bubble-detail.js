(()=>{'use strict';
const store=window.HolidayStore,radios=[...document.querySelectorAll('[name="costume"]')],status=document.querySelector('#costume-status');
function syncCostume(){const value=store.costume('crystal-story');radios.forEach(r=>r.checked=r.value===value);status.textContent='Выбран образ: '+(value==='elf'?'Эльф':'Снегурочка')}
radios.forEach(r=>r.addEventListener('change',()=>{if(r.checked)store.setCostume('crystal-story',r.value)}));window.addEventListener('holidaychange',syncCostume);syncCostume();
const thumbs=[...document.querySelectorAll('[data-photo]')],main=document.querySelector('#bubble-main-photo');let index=0;
function show(i){index=(i+thumbs.length)%thumbs.length;const thumb=thumbs[index];main.src=thumb.querySelector('img').src;main.alt=thumb.getAttribute('aria-label').replace(/^Фото \d+: /,'');thumbs.forEach((t,n)=>t.setAttribute('aria-pressed',String(n===index)));document.querySelector('#gallery-count').textContent=`${index+1} / ${thumbs.length}`}
thumbs.forEach((t,i)=>t.addEventListener('click',()=>show(i)));document.querySelectorAll('[data-gallery-step]').forEach(b=>b.addEventListener('click',()=>show(index+Number(b.dataset.galleryStep))));document.querySelector('.bubble-gallery').addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();show(index+(e.key==='ArrowRight'?1:-1))}});
})();