(()=>{'use strict';
const section=document.querySelector('#portfolio');if(!section)return;
const cards=[...section.querySelectorAll('[data-media]')],filters=[...section.querySelectorAll('[data-filter]')];
const viewer=document.querySelector('#portfolio-viewer'),stage=document.querySelector('#moment-stage'),title=document.querySelector('#moment-title'),count=document.querySelector('#moment-count');
let current=null,opener=null;
const visible=()=>cards.filter(card=>!card.hidden);
function show(card){current=card;const video=stage.querySelector('video');if(video)video.pause();stage.replaceChildren();let media;
if(card.dataset.media==='video'){media=document.createElement('video');media.controls=true;media.playsInline=true;media.preload='metadata';media.poster=card.querySelector('img').src;media.src=card.href;media.setAttribute('aria-label',card.dataset.title)}else{media=document.createElement('img');media.src=card.href;media.alt=card.querySelector('img').alt}
stage.append(media);title.textContent=card.dataset.title;const list=visible();count.textContent=`${list.indexOf(card)+1} / ${list.length}`;
if(!viewer.open){viewer.showModal();document.body.classList.add('moment-open')}if(media.tagName==='VIDEO')media.play().catch(()=>{});
}
cards.forEach(card=>card.addEventListener('click',event=>{if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;event.preventDefault();opener=card;show(card)}));
filters.forEach(button=>button.addEventListener('click',()=>{filters.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));cards.forEach(card=>{card.hidden=button.dataset.filter!=='all'&&card.dataset.media!==button.dataset.filter})}));
function step(delta){const list=visible();show(list[(list.indexOf(current)+delta+list.length)%list.length])}
viewer.querySelectorAll('[data-step]').forEach(button=>button.addEventListener('click',()=>step(Number(button.dataset.step))));
viewer.querySelector('.moment-close').addEventListener('click',()=>viewer.close());
viewer.addEventListener('click',event=>{if(event.target!==viewer)return;const r=viewer.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)viewer.close()});
viewer.addEventListener('keydown',event=>{if(event.target.tagName==='VIDEO')return;if(event.key==='ArrowRight'){event.preventDefault();step(1)}if(event.key==='ArrowLeft'){event.preventDefault();step(-1)}});
viewer.addEventListener('close',()=>{const video=stage.querySelector('video');if(video){video.pause();video.removeAttribute('src');video.load()}stage.replaceChildren();document.body.classList.remove('moment-open');opener?.focus({preventScroll:true})});
})();