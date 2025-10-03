function badgeClass(cat){
  if(cat==="موسيقى") return "bg-primary";
  if(cat==="سينما")  return "bg-danger";
  if(cat==="معارض")  return "bg-success";
  if(cat==="ثقافة")  return "bg-secondary";
  if(cat==="تعليم")  return "bg-info text-dark";
  return "bg-dark";
}

function cardHTML(e){
  return `
  <div class="card h-100 event-card position-relative" data-category="${e.category}">
    <img src="${e.img}" class="card-img-top w-100" alt="${e.title}">
    <div class="card-body d-flex flex-column">
      <span class="badge ${badgeClass(e.category)} mb-2">${e.category}</span>
      <h5 class="card-title">${e.title}</h5>
      <p class="mb-1">المكان: ${e.place}</p>
      <p class="mb-1">التاريخ: ${e.date}</p>
      <p class="text-muted mb-3">${e.desc||""}</p>
      <div class="mt-auto text-start">
        <a href="event.html?id=${e.id}" class="btn btn-primary btn-md">تفاصيل</a>
      </div>
    </div>
  </div>`;
}

function getParam(name){ const u=new URL(window.location.href); return u.searchParams.get(name); }
function debounce(fn,ms){ let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a),ms); }; }

function renderStaticSections(){
  const thisWeekEl=document.getElementById("thisWeek");
  const upcomingEl=document.getElementById("upcoming");
  if(!thisWeekEl || !upcomingEl) return;

  thisWeekEl.className="row g-3";
  thisWeekEl.innerHTML="";
  const heroCol=document.createElement("div");
  heroCol.className="col-12 col-sm-6 col-lg-4";
  heroCol.innerHTML=cardHTML(eventsData[0]);
  thisWeekEl.appendChild(heroCol);

  upcomingEl.innerHTML="";
  eventsData.slice(1,6).forEach(e=>{
    const col=document.createElement("div");
    col.className="col-12 col-sm-6 col-lg-4";
    col.innerHTML=cardHTML(e);
    upcomingEl.appendChild(col);
  });
}

let currentCat = "all";

function renderCategories(list){
  const categoriesEl=document.getElementById("categories");
  if(!categoriesEl) return;

  categoriesEl.innerHTML="";
  const items = (currentCat === "all") ? list : list.slice(0,4);

  if(!items.length){
    categoriesEl.innerHTML='<div class="col-12"><div class="alert alert-warning">لا توجد فعاليات لهذا التصنيف حالياً.</div></div>';
    return;
  }

  items.forEach(e=>{
    const col=document.createElement("div");
    col.className="col-12 col-sm-6 col-lg-3";
    col.innerHTML=cardHTML(e);
    categoriesEl.appendChild(col);
  });
}

function filterBy(cat){
  return cat==="all" ? eventsData : eventsData.filter(e=>e.category===cat);
}

function setActive(cat){
  const wrap=document.getElementById("categoryButtons");
  if(!wrap) return;
  wrap.querySelectorAll(".category-btn").forEach(btn=>{
    btn.classList.remove("btn-primary","text-white");
    btn.classList.add("btn-outline-primary");
  });
  const current=[...wrap.querySelectorAll(".category-btn")].find(b=>b.dataset.category===cat);
  if(current){
    current.classList.remove("btn-outline-primary");
    current.classList.add("btn-primary");
  }
}

function initIndexPage(){
  if(!document.getElementById("thisWeek")) return;

  renderStaticSections();

  currentCat = "all";
  setActive(currentCat);
  renderCategories(filterBy(currentCat));

  const wrap=document.getElementById("categoryButtons");
  if(wrap){
    wrap.addEventListener("click",e=>{
      const btn=e.target.closest(".category-btn");
      if(!btn) return;
      currentCat = btn.dataset.category;
      setActive(currentCat);
      renderCategories(filterBy(currentCat));
      document.getElementById("categories")?.scrollIntoView({behavior:"smooth",block:"start"});
    });
  }
}

function render(list){
  const grid=document.getElementById("eventsGrid");
  if(!grid) return;
  grid.innerHTML="";
  if(!list.length){
    grid.innerHTML='<div class="col-12"><div class="alert alert-warning">لا نتائج مطابقة للفلترة الحالية.</div></div>';
    return;
  }
  list.forEach(e=>{
    const col=document.createElement("div");
    col.className="col-12 col-md-6 col-lg-4";
    col.innerHTML=cardHTML(e);
    grid.appendChild(col);
  });
}

function norm(str){ return (str||"").toString().toLowerCase().trim(); }
function tryISO(e){
  if(e.startISO) return new Date(e.startISO);
  const maybe=new Date(e.date);
  return isNaN(maybe)?null:maybe;
}

function uniquePlaces(data){
  const set=new Set();
  data.forEach(e=>{ if(e.place) set.add(e.place); });
  return ["all",...Array.from(set)];
}

function activateButtons(cat){
  const wrap=document.getElementById("categoryButtons");
  if(!wrap) return;
  wrap.querySelectorAll("button").forEach(b=>{
    b.classList.remove("btn-primary"); b.classList.add("btn-outline-primary");
  });
  const btn=[...wrap.querySelectorAll("button")].find(b=>b.dataset.category===cat);
  if(btn){ btn.classList.remove("btn-outline-primary"); btn.classList.add("btn-primary"); }
  const sel=document.getElementById("catSelect");
  if(sel && sel.value!==cat) sel.value=cat;
}

function populatePlaces(){
  const sel=document.getElementById("placeSelect");
  if(!sel) return;
  sel.innerHTML="";
  uniquePlaces(eventsData).forEach(p=>{
    const opt=document.createElement("option");
    opt.value=p; opt.textContent=(p==="all"?"كل الأماكن":p);
    sel.appendChild(opt);
  });
}

function applyFilters(){
  if(!document.getElementById("eventsGrid")) return;

  const text=norm(document.getElementById("q")?.value);
  const cat=document.getElementById("catSelect")?.value || "all";
  const place=document.getElementById("placeSelect")?.value || "all";
  const dateStr=document.getElementById("dateSelect")?.value || "";
  const dateVal=dateStr?new Date(dateStr):null;

  let list=eventsData.slice();

  if(cat!=="all") list=list.filter(e=>e.category===cat);
  if(place!=="all") list=list.filter(e=>e.place===place);
  if(text){
    list=list.filter(e=>{
      const hay=(e.title+" "+(e.desc||"")+" "+(e.place||"")).toLowerCase();
      return hay.includes(text);
    });
  }
  if(dateVal){
    list=list.filter(e=>{
      const d=tryISO(e);
      if(!d) return true;
      return d.getFullYear()===dateVal.getFullYear()
          && d.getMonth()===dateVal.getMonth()
          && d.getDate()===dateVal.getDate();
    });
  }

  render(list);
  activateButtons(cat);
  history.replaceState(null,"",cat==="all"?"events.html":"?category="+encodeURIComponent(cat));
}

function initEventsPage(){
  if(!document.getElementById("eventsGrid")) return;

  populatePlaces();

  const initialCat=decodeURIComponent(getParam("category")||"all");
  const catSel=document.getElementById("catSelect");
  if(catSel) catSel.value=initialCat;
  activateButtons(initialCat);
  applyFilters();

  document.getElementById("q")?.addEventListener("input",debounce(applyFilters,250));
  document.getElementById("catSelect")?.addEventListener("change",applyFilters);
  document.getElementById("placeSelect")?.addEventListener("change",applyFilters);
  document.getElementById("dateSelect")?.addEventListener("change",applyFilters);

  document.getElementById("categoryButtons")?.addEventListener("click",e=>{
    if(e.target.matches("button[data-category]")){
      const cat=e.target.dataset.category;
      const sel=document.getElementById("catSelect");
      if(sel) sel.value=cat;
      applyFilters();
    }
  });
}

function yyyymmdd(d){ return d.toISOString().slice(0,10).replace(/-/g,""); }
function buildICS(ev){
  let s = ev.startISO ? new Date(ev.startISO) : new Date(ev.date);
  let e = ev.endISO   ? new Date(ev.endISO)   : new Date(ev.date);
  if(isNaN(s)) s = new Date();
  if(isNaN(e)) e = s;

  const DTSTART = "DTSTART;VALUE=DATE:"+yyyymmdd(s);
  const endPlus = new Date(e.getTime()); endPlus.setDate(endPlus.getDate()+1);
  const DTEND   = "DTEND;VALUE=DATE:"+yyyymmdd(endPlus);

  const SUMMARY = "SUMMARY:"+ev.title.replace(/\r?\n/g," ");
  const LOCATION= "LOCATION:"+(ev.place||"");
  const DESCRIPTION = "DESCRIPTION:"+(ev.desc||"");
  const UID = "UID:"+(ev.id || (Date.now()+"@cityevents"));

  const ics = [
    "BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//City Events//AR//",
    "CALSCALE:GREGORIAN","METHOD:PUBLISH",
    "BEGIN:VEVENT",UID,DTSTART,DTEND,SUMMARY,LOCATION,DESCRIPTION,"END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  return "data:text/calendar;charset=utf-8,"+encodeURIComponent(ics);
}

async function shareEvent(ev){
  const url = window.location.href;
  const title = ev.title;
  const text = ev.desc || ev.title;
  if(navigator.share){
    try{ await navigator.share({title, text, url}); }catch(_){}
  }else{
    try{ await navigator.clipboard.writeText(url); alert("تم نسخ رابط الفعالية إلى الحافظة ✅"); }
    catch(_){ prompt("انسخ الرابط:", url); }
  }
}

function miniCard(e){
  return `
  <div class="card h-100">
    <img src="${e.img}" class="card-img-top" alt="${e.title}" style="max-height:160px;object-fit:cover;">
    <div class="card-body">
      <span class="badge ${badgeClass(e.category)} mb-2">${e.category}</span>
      <h6 class="card-title mb-1">${e.title}</h6>
      <div class="small text-muted mb-2">${e.place}</div>
      <a href="event.html?id=${e.id}" class="btn btn-sm btn-primary">تفاصيل</a>
    </div>
  </div>`;
}

function renderRelated(ev){
  const box = document.getElementById("relatedEvents");
  const sec = document.getElementById("relatedSection");
  if(!box || !sec) return;

  const related = eventsData
    .filter(e => e.category === ev.category && e.id !== ev.id)
    .slice(0,3);

  if(!related.length){ sec.style.display="none"; return; }

  box.innerHTML = "";
  related.forEach(e=>{
    const col = document.createElement("div");
    col.className = "col-12 col-sm-6 col-lg-4";
    col.innerHTML = miniCard(e);
    box.appendChild(col);
  });
  sec.style.display = "";
}

const COORDS = {
  "دار الأوبرا":                { lat: 33.5097, lng: 36.2783 },
  "دار الأوبرا بدمشق":          { lat: 33.5097, lng: 36.2783 },
  "مدينة المعارض – دمشق":       { lat: 33.4606, lng: 36.3676 },
  "جامعة دمشق":                 { lat: 33.5131, lng: 36.2785 },
  "المركز الثقافي العربي بدمشق": { lat: 33.5129, lng: 36.2838 },
  "حديقة تشرين، دمشق":          { lat: 33.5215, lng: 36.2812 },
  "مسرح الحمراء - دمشق":        { lat: 33.5117, lng: 36.3021 },
  "مركز التدريب بجامعة دمشق":   { lat: 33.5111, lng: 36.2780 }
};



function getCoords(ev){
  if (ev.coords && typeof ev.coords.lat === "number" && typeof ev.coords.lng === "number") {
    return ev.coords;
  }
  const keys = Object.keys(COORDS);
  const place = (ev.place || "").trim();
  for (const k of keys){
    if (place.includes(k)) return COORDS[k];
  }
  return { lat: 33.5138, lng: 36.2765 };
}


function buildStaticMapURLs(ev){
  const {lat, lng} = getCoords(ev);
  const zoom = 14;
  const size = { w: 800, h: 400 };

  return [
    `https://maps.wikimedia.org/img/osm-intl,${lng},${lat},${zoom},${size.w}x${size.h}.png`,
    `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lng}&zoom=${zoom}&size=${size.w}x${size.h}&markers=${lat},${lng},red-pushpin`,
  ];
}

function loadImageWithFallback(imgEl, urls){
  if (!imgEl || !urls.length) return;
  let i = 0;
  const tryNext = () => {
    if (i >= urls.length){
      const box = document.createElement("div");
      box.className = "border rounded p-3 text-muted";
      box.textContent = "تعذّر تحميل الخريطة الثابتة.";
      imgEl.replaceWith(box);
      return;
    }
    imgEl.src = urls[i++];
    imgEl.onerror = tryNext;
  };
  tryNext();
}


function renderEvent(ev){
  const crumbTitle = document.getElementById("crumbTitle");
  const eventTitle = document.getElementById("eventTitle");
  const eventTitleMain = document.getElementById("eventTitleMain");
  const eventSubtitle = document.getElementById("eventSubtitle");

  if(crumbTitle) crumbTitle.textContent = ev.title;
  if(eventTitle) eventTitle.textContent = ev.title;
  if(eventTitleMain) eventTitleMain.textContent = ev.title;
  if(eventSubtitle) eventSubtitle.textContent = ev.place;

  const img = document.getElementById("eventImage");
  if(img){ img.src = ev.img; img.alt = ev.title; }

  const placeEl = document.getElementById("eventPlace");
  const dateEl  = document.getElementById("eventDate");
  const descEl  = document.getElementById("eventDesc");
  const longEl  = document.getElementById("eventLongDesc");
  if(placeEl) placeEl.textContent = ev.place;
  if(dateEl)  dateEl.textContent  = ev.date;
  if(descEl)  descEl.textContent  = ev.desc || "";
  if(longEl)  longEl.textContent  = ev.longDesc || "";

  const cat = document.getElementById("eventCategoryBadge");
  if(cat){ cat.className = "badge " + badgeClass(ev.category); cat.textContent = ev.category; }
  const dateBadge = document.getElementById("eventDateBadge");
  if(dateBadge) dateBadge.textContent = ev.date;

  const q = encodeURIComponent((ev.place||"") + " دمشق");
  const map = document.getElementById("mapLink");
  if(map) map.href = "https://www.google.com/maps/search/?api=1&query=" + q;

const mapFrame = document.getElementById("staticMapFrame");
if (mapFrame){
  const {lat, lng} = getCoords(ev);
  const dLat = 0.01, dLng = 0.015;
  const bbox = [
    (lng - dLng).toFixed(6), (lat - dLat).toFixed(6),
    (lng + dLng).toFixed(6), (lat + dLat).toFixed(6)
  ].join("%2C");

  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;
  mapFrame.src = src;
  mapFrame.title = `خريطة: ${ev.place || ev.title}`;
}


  const addBtn = document.getElementById("addToCalBtn");
  if(addBtn){ addBtn.href = buildICS(ev); addBtn.download = (ev.id||"event")+".ics"; }

  const shareBtn = document.getElementById("shareBtn");
  if(shareBtn){ shareBtn.onclick = ()=>shareEvent(ev); }

  renderRelated(ev);

  const content = document.getElementById("eventContent");
  if(content) content.style.display = "";
}

function initEventPage(){
  if(!document.getElementById("eventContent") && !document.getElementById("notFound")) return;

  const id = getParam("id");
  const ev = eventsData.find(e => e.id === id);

  if(!ev){
    document.getElementById("notFound")?.classList.remove("d-none");
    return;
  }
  renderEvent(ev);
}

const GOOGLE_STATIC_KEY   = "YOUR_GOOGLE_MAPS_STATIC_API_KEY";
const GEOAPIFY_STATIC_KEY = "YOUR_GEOAPIFY_KEY";

function buildStaticMapUrlFromCoords(lat, lng){
  return `https://maps.geoapify.com/v1/staticmap?style=osm-carto&width=800&height=400`
       + `&center=lonlat:${lng},${lat}&zoom=14`
       + `&marker=lonlat:${lng},${lat};color:%23ff0000;size:medium`
       + `&apiKey=${GEOAPIFY_STATIC_KEY}`;
}

function buildStaticMapUrlFromQuery(query){
  const q = encodeURIComponent(query);
  return `https://maps.googleapis.com/maps/api/staticmap?center=${q}`
       + `&zoom=14&size=800x400&language=ar&scale=2`
       + `&markers=color:red|${q}&key=${GOOGLE_STATIC_KEY}`;
}

const DEFAULT_DMASCUS = { lat:33.5138, lng:36.2765 };

function osmStaticMapUrl(lat, lng, w=800, h=400, zoom=14){
  return `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lng}&zoom=${zoom}&size=${w}x${h}&markers=${lat},${lng},red-pushpin`;
}

function staticMapUrl(ev){
  const c = (ev.coords && typeof ev.coords.lat==="number" && typeof ev.coords.lng==="number")
    ? ev.coords
    : DEFAULT_DMASCUS;
  return osmStaticMapUrl(c.lat, c.lng);
}


document.addEventListener("DOMContentLoaded", ()=>{
  initIndexPage();
  initEventsPage();
  initEventPage();
});


function showAlert(message, type) {
  const box = document.getElementById("alertPlaceholder");
  if (!box) return;
  box.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show mt-3" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  `;
}

function setupContactForm(){
  const form = document.querySelector("form");
  if (!form || !document.getElementById("name")) return; // يعني ما في فورم بالصفحة

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name    = document.getElementById("name").value.trim();
    const email   = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
      showAlert("الرجاء ملء جميع الحقول المطلوبة.", "danger");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!emailPattern.test(email)) {
      showAlert("صيغة البريد الإلكتروني غير صحيحة.", "warning");
      return;
    }

    showAlert("تم إرسال رسالتك بنجاح! ✅", "success");
    form.reset();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initIndexPage();
  initEventsPage();
  initEventPage();

  setupContactForm();
});

