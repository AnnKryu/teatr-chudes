// Content layer: future category pages can reuse the same records.
// Prices from the supplied 2026/27 programme grid; dates are local calendar dates.
window.PROGRAMS = [
 {id:'bubbles',category:'show',title:'Хрустальная сказка',description:'Шоу мыльных пузырей: длинные шлейфы, дымные пузыри и погружение в огромный пузырь.',minutes:30,artists:1,minAge:3,prices:[8000,10000,12000,14000,16900,18900,14000,10000]},
 {id:'cryo',category:'show',title:'Секреты зимней лаборатории',description:'Криоэксперименты с участием гостей, приготовление мороженого и дегустация.',minutes:60,artists:1,minAge:5,prices:[10000,12000,14000,16000,17900,19900,16000,12000]},
 {id:'paper',category:'show',title:'Снежный вихрь',description:'Бумажная дискотека, игры и общий салют. Два ведущих и 5 кг бумаги.',minutes:45,artists:2,minAge:3,prices:[16900,19900,22900,26900,28900,33900,26900,23900]},
 {id:'battle',category:'quiz',title:'Битва за Новый год',description:'Командные испытания, экранные квизы, ребусы и финальный баттл.',minutes:60,artists:2,minAge:9,prices:[17900,20900,23900,26900,28900,33900,26900,23900]},
 {id:'music',category:'quiz',title:'Музыкальная зима',description:'Угадываем песни, выполняем задания на экране и устраиваем танцевальные баттлы.',minutes:60,artists:2,minAge:5,prices:[17900,20900,23900,26900,28900,33900,26900,23900]},
 {id:'gingerbread',category:'workshop',title:'Роспись пряников',description:'Творческий мастер-класс: каждый участник украшает свой пряник.',minutes:60,minAge:3,groupPrices:{10:14000,20:26000}},
 {id:'candles',category:'workshop',title:'Свечи из вощины',description:'Создаём свечи из натуральной вощины и забираем их с собой.',minutes:60,minAge:5,groupPrices:{10:14000,20:26000}},
 {id:'snowglobe',category:'workshop',title:'Снежный шар',description:'Собираем свой маленький зимний мир внутри снежного шара.',minutes:60,minAge:5,groupPrices:{10:16000,20:30000}}
];
window.priceForDate = function(program,date,guests){
 if(program.groupPrices) return guests<=10?program.groupPrices[10]:guests<=20?program.groupPrices[20]:null;
 const [y,m,d]=date.split('-').map(Number);
 if(!y||!m||!d) return null;
 // December 2026 and January 2027 only. New dates need a confirmed price grid.
 let band;
 if(y===2026&&m===12) band=d<=19?0:d<=29?1:d===30?2:3;
 else if(y===2027&&m===1) band=d<=7?6:7;
 else return null;
 return program.prices[band];
};
