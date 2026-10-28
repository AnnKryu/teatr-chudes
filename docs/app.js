const $=s=>document.querySelector(s);const money=n=>new Intl.NumberFormat('ru-RU').format(n)+' ₽';
const budget=$('#budget'),output=$('#budget-output'),info=$('#info-dialog');
function updateBudget(){output.value=money(Number(budget.value));budget.style.setProperty('--progress',((budget.value-10000)/190000*100)+'%')}
budget.addEventListener('input',updateBudget);updateBudget();
const texts={
 about:['Мы создаём праздники','Дед Мороз и Снегурочка, шоу, творческие мастер-классы и командные игры в Москве и области. Здесь появится история нашей команды — Ани и Миши.'],
 combo:['Вместе выгоднее','Объедините поздравление, шоу и мастер-класс в одну программу. Состав, итоговую стоимость и возможную скидку рассчитываем индивидуально — с учётом даты, количества гостей и площадки.'],
 early:['Раннее бронирование — 10%','Предложение из нашего праздничного анонса: скидка 10% при бронировании до 1 декабря. Применимость к выбранной программе и суммирование с другими предложениями нужно подтвердить перед бронированием.'],
 friend:['Праздник для друзей — 15%','Скидка 15% за одного приведённого друга. Условия получения и применения скидки согласовываются при бронировании.'],
 video:['Живые моменты — скоро','Это предварительная версия сайта. Видео пока не загружено: здесь будет настоящий ролик с праздника.'],
 gallery:['Портфолио пополняется','Здесь появятся фотографии и видео наших поздравлений, шоу и мастер-классов. Две фотографии в разделе выше уже можно открыть крупнее.'],
 greeting:['Дед Мороз и Снегурочка','Поздравление под ваш праздник: игры, танцы, вручение подарков и фотографии. Продолжительность, состав артистов и стоимость согласовываем индивидуально.']
};
function showDialog(title,body,action=true){$('#dialog-title').textContent=title;$('#dialog-content').replaceChildren();const p=document.createElement('p');p.textContent=body;$('#dialog-content').append(p);$('#dialog-action').hidden=!action;info.showModal()}
document.querySelectorAll('[data-dialog]').forEach(b=>b.addEventListener('click',()=>showDialog(...texts[b.dataset.dialog])));
document.querySelectorAll('.close-dialog').forEach(b=>b.addEventListener('click',()=>b.closest('dialog').close()));
document.querySelectorAll('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close()}}));
$('#dialog-action').addEventListener('click',()=>{info.close();$('#calculator').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});budget.focus({preventScroll:true})});
document.querySelectorAll('[data-photo]').forEach(b=>b.addEventListener('click',()=>{const im=$('#large-photo');im.src=`assets/photo-${b.dataset.photo}.webp`;im.alt=b.querySelector('img').alt;$('#photo-dialog').showModal()}));
const results=$('#results');
function renderPrograms(category=null){
 const amount=Number(budget.value),age=Number($('#age').value),guests=Number($('#guests').value),date=$('#event-date').value;
 if(!date||!$('#event-date').checkValidity()){$('#event-date').reportValidity();return}
 let items=PROGRAMS.map(p=>({...p,price:priceForDate(p,date,guests)})).filter(p=>(!category||p.category===category)&&p.minAge<=age);
 if(!category)items=items.filter(p=>p.price!==null&&p.price<=amount);
 results.hidden=false;$('#results-grid').replaceChildren();
 $('#results-summary').textContent=category?'Программы выбранной категории. Цена зависит от даты и количества участников.':`Бюджет ${money(amount)} · гостей: ${guests}. ${items.length?'Подходящие варианты:':'По этим параметрам нет подтверждённых вариантов. Попробуйте изменить дату, бюджет или количество гостей.'}`;
 if(date==='2026-12-31')$('#results-summary').textContent+=' На 31 декабря показан дневной тариф 09:00–18:00; вечер и ночь рассчитываются отдельно.';
 for(const p of items){const card=document.createElement('article');card.className='program-card';const title=document.createElement('h4');title.textContent=p.title;const desc=document.createElement('p');desc.textContent=p.description;const meta=document.createElement('small');meta.textContent=`${p.minutes} мин${p.artists?' · артистов: '+p.artists:''}`;const price=document.createElement('strong');price.textContent=p.price===null?'Индивидуальный расчёт':money(p.price);const note=document.createElement('small');note.textContent=p.groupPrices?'Стоимость за группу; свыше 20 участников — индивидуально.':'Базовая стоимость шоу. Доплаты за выезд и условия площадки уточняются.';const btn=document.createElement('button');btn.textContent='Подробнее ↗';btn.addEventListener('click',()=>showDialog(p.title,p.description+' '+meta.textContent+'. '+price.textContent+'. Это предварительная оценка. Выезд за МКАД и состав программы согласовываются отдельно.'));card.append(title,desc,meta,price,note,btn);$('#results-grid').append(card)}
 if(!items.length){const p=document.createElement('p');p.textContent='Стоимость на даты вне декабря 2026 и января 2027, а также для больших групп согласовывается индивидуально.';$('#results-grid').append(p)}
 results.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
}
$('#budget-form').addEventListener('submit',e=>{e.preventDefault();renderPrograms()});$('#reset-results').addEventListener('click',()=>{results.hidden=true;$('#calculator-title').scrollIntoView({behavior:'smooth'})});
document.querySelectorAll('[data-category]').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.category==='greeting'){showDialog(...texts.greeting)}else renderPrograms(b.dataset.category)}));
