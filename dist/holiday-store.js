/* Shared browser-local programme selection. Programme IDs and allowlisted costume choices persist here. */
(()=>{'use strict';
const key='teatr.holiday.v1',valid=new Set(Object.values(window.TEATR_CATALOG).flatMap(c=>c.programs.map(p=>p.id)));
let memory={cart:[],favorites:[]},unpersisted=false;
const clean=v=>{const out={cart:[...new Set(Array.isArray(v?.cart)?v.cart:[])].filter(id=>valid.has(id)),favorites:[...new Set(Array.isArray(v?.favorites)?v.favorites:[])].filter(id=>valid.has(id))};const costume=v?.options?.['crystal-story']?.costume;if(['elf','snow-maiden'].includes(costume))out.options={'crystal-story':{costume}};return out};
function read(){if(unpersisted)return clean(memory);try{memory=clean(JSON.parse(localStorage.getItem(key)||'null'))}catch{}return clean(memory)}
function write(next){memory=clean(next);try{localStorage.setItem(key,JSON.stringify(memory));unpersisted=false}catch{unpersisted=true}window.dispatchEvent(new Event('holidaychange'));return read()}
window.HolidayStore={read,costume(id){return id==='crystal-story'?(read().options?.[id]?.costume||'snow-maiden'):null},setCostume(id,costume){if(id!=='crystal-story'||!['elf','snow-maiden'].includes(costume))return;const v=read();v.options={[id]:{costume}};return write(v)},has:(type,id)=>read()[type]?.includes(id)||false,add(id){if(!valid.has(id))return;const v=read();if(!v.cart.includes(id))v.cart.push(id);if(id==='crystal-story'&&!v.options)v.options={'crystal-story':{costume:'snow-maiden'}};return write(v)},remove(id){const v=read();v.cart=v.cart.filter(x=>x!==id);return write(v)},favorite(id){if(!valid.has(id))return;const v=read();v.favorites=v.favorites.includes(id)?v.favorites.filter(x=>x!==id):[...v.favorites,id];return write(v)},clearCart(){const v=read();v.cart=[];return write(v)}};
window.addEventListener('storage',e=>{if(e.key===key)window.dispatchEvent(new Event('holidaychange'))});
})();
