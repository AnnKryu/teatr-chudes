(()=>{'use strict';
const CATALOG=window.TEATR_CATALOG;
const clock="<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M12 6v6h5\"/></svg>",people="<svg viewBox=\"0 0 28 24\" aria-hidden=\"true\"><circle cx=\"9\" cy=\"6\" r=\"3\"/><circle cx=\"21\" cy=\"7\" r=\"3\"/><path d=\"M2 21v-4a7 7 0 0 1 14 0v4ZM17 13a6 6 0 0 1 10 5v3h-8\"/></svg>";
const tabs=[...document.querySelectorAll('[data-category][role="tab"]')];
const stage=document.querySelector('.catalog-stage'),grid=document.querySelector('.catalog-grid'),panel=document.querySelector('#catalog-panel'),dialog=document.querySelector('#program-dialog');
const titles=document.querySelector('#catalog-title'),subtitle=document.querySelector('#catalog-subtitle');
const allPrograms=Object.values(CATALOG).flatMap(c=>c.programs);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function artist(n){return n===1?'артист':'артиста'}
function categoryFromURL(){const value=new URL(location.href).searchParams.get('category');return Object.hasOwn(CATALOG,value)?value:'animation'}
function render(category,push=false){
 const c=CATALOG[category];if(!c)return;
 if(push){const u=new URL(location.href);u.searchParams.set('category',category);u.searchParams.delete('program');history.pushState({category},'',u)}
 stage.dataset.category=category;stage.querySelector('.catalog-scenery').src=`assets/catalog/${category}-stage.svg?v=20261029-6`;
 titles.textContent=c.title;subtitle.textContent=c.subtitle;document.title=`${c.title} — программы Театра чудес`;
 panel.setAttribute('aria-labelledby',`tab-${category}`);
 for(const t of tabs){const active=t.dataset.category===category;t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1}
 grid.innerHTML=c.programs.map((r,i)=>`<article class="catalog-card" style="--order:${i}"><div class="program-tools"><button type="button" class="icon-button" data-favorite="${r.id}" aria-label="В избранное: ${esc(r.title)}" aria-pressed="false">${window.HolidayIcons.heart}</button><button type="button" class="icon-button" data-add="${r.id}" aria-label="Добавить в мой праздник: ${esc(r.title)}">${window.HolidayIcons.plus}</button></div><div class="catalog-photo"><img src="${esc(r.image)}" alt="${esc(r.title)}" width="800" height="1067" ${i>2?'loading="lazy"':''}></div><div class="catalog-card-copy"><h2>${esc(r.title)}</h2><div class="catalog-meta"><span>${clock}${r.minutes} минут</span><img class="meta-star" src="assets/button-star.svg" alt=""><span>${people}${r.artists} ${artist(r.artists)}</span></div><button type="button" class="ribbon gold catalog-details" data-program="${r.id}" aria-label="Подробнее: ${esc(r.title)}"><span class="ticket-size" aria-hidden="true">Подробнее</span><span class="ticket-label">Подробнее</span></button></div></article>`).join('');
 window.HolidayUI?.sync();
 document.querySelector('#catalog-status').textContent=`${c.title}. Программ: ${c.programs.length}.`;
}
for(const t of tabs){t.addEventListener('click',()=>{if(t.getAttribute('aria-selected')!=='true')render(t.dataset.category,true)});t.addEventListener('keydown',e=>{let i=tabs.indexOf(t);if(e.key==='ArrowRight')i=(i+1)%tabs.length;else if(e.key==='ArrowLeft')i=(i+tabs.length-1)%tabs.length;else if(e.key==='Home')i=0;else if(e.key==='End')i=tabs.length-1;else return;e.preventDefault();tabs[i].focus();render(tabs[i].dataset.category,true)})}
window.addEventListener('popstate',()=>render(categoryFromURL()));
function openProgram(r){document.querySelector('#program-dialog-title').textContent=r.title;document.querySelector('#program-dialog-meta').textContent=r.minutes?`${r.minutes} минут · ${r.artists} ${artist(r.artists)}`:'';document.querySelector('#program-dialog-description').textContent=r.description;const im=document.querySelector('#program-dialog-photo');im.hidden=!r.image;if(r.image){im.src=r.image;im.alt=r.title}const add=document.querySelector('#program-dialog-add');add.hidden=!r.id;if(r.id)add.dataset.add=r.id;window.HolidayUI?.sync();dialog.showModal()}
grid.addEventListener('click',e=>{const b=e.target.closest('[data-program]');if(!b)return;const r=allPrograms.find(r=>r.id===b.dataset.program);if(r)openProgram(r)});
document.querySelector('[data-combo]').addEventListener('click',()=>openProgram({title:'Комбо выгоднее',description:'Объедините поздравление, шоу и мастер-класс в одну программу. Состав и итоговую стоимость рассчитываем индивидуально — с учётом даты, количества гостей и площадки.'}));
dialog.querySelector('.close-dialog').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()});
render(categoryFromURL());
const requested=allPrograms.find(r=>r.id===new URL(location.href).searchParams.get('program'));if(requested)openProgram(requested);
})();
