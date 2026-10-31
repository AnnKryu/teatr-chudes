const $=s=>document.querySelector(s);const money=n=>new Intl.NumberFormat('ru-RU').format(n)+' ₽';
const budget=$('#budget'),output=$('#budget-output'),info=$('#info-dialog');
function updateBudget(){output.value=money(Number(budget.value));budget.style.setProperty('--progress',((budget.value-10000)/190000*100)+'%')}
budget.addEventListener('input',updateBudget);updateBudget();
const texts={
 about:['Мы создаём праздники','Дед Мороз и Снегурочка, шоу, творческие мастер-классы и командные игры в Москве и области. Здесь появится история нашей команды — Ани и Миши.'],
 combo:['Комбо выгоднее','Объедините поздравление, шоу и мастер-класс в одну программу. Состав, итоговую стоимость и возможную скидку рассчитываем индивидуально — с учётом даты, количества гостей и площадки.'],
 early:['Раннее бронирование — 10%','Предложение из нашего праздничного анонса: скидка 10% при бронировании до 1 декабря. Применимость к выбранной программе и суммирование с другими предложениями нужно подтвердить перед бронированием.'],
 friend:['Праздник для друзей — 15%','Скидка 15% за одного приведённого друга. Условия получения и применения скидки согласовываются при бронировании.'],
 video:['Живые моменты — скоро','Это предварительная версия сайта. Видео пока не загружено: здесь будет настоящий ролик с праздника.'],
 gallery:['Портфолио пополняется','Здесь появятся фотографии и видео наших поздравлений, шоу и мастер-классов. '],
 greeting:['Дед Мороз и Снегурочка','Поздравление под ваш праздник: игры, танцы, вручение подарков и фотографии. Продолжительность, состав артистов и стоимость согласовываем индивидуально.']
};
function showDialog(title,body,action=true){$('#dialog-title').textContent=title;$('#dialog-content').replaceChildren();const p=document.createElement('p');p.textContent=body;$('#dialog-content').append(p);$('#dialog-action').hidden=!action;info.showModal()}
document.querySelectorAll('[data-dialog]').forEach(b=>b.addEventListener('click',()=>showDialog(...texts[b.dataset.dialog])));
document.querySelectorAll('.close-dialog').forEach(b=>b.addEventListener('click',()=>b.closest('dialog').close()));
document.querySelectorAll('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close()}}));
$('#dialog-action').addEventListener('click',()=>{info.close();$('#calculator').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});budget.focus({preventScroll:true})});

// Carry the calculator criteria into the matching catalogue and enquiry draft.
$('#budget-form').addEventListener('submit',event=>{event.preventDefault();const filters=window.ProgramFilter.clean({date:$('#event-date').value,time:$('#event-time').value,age:$('#age').value,guests:$('#guests').value,budget:budget.value});let draft={};try{draft=JSON.parse(sessionStorage.getItem('teatr.draft.v1')||'{}')}catch{}Object.assign(draft,{date:filters.date,time:filters.time,age:window.ProgramFilter.ages[filters.age].label,guests:String(filters.guests),budget:String(filters.budget)});try{sessionStorage.setItem('teatr.draft.v1',JSON.stringify(draft))}catch{}location.href=window.ProgramFilter.url(filters)});
