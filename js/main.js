function badgeClass(cat) {
  // بترجع كلاس البادج حسب التصنيف
  if (cat === "موسيقى") return "bg-primary";
  if (cat === "سينما") return "bg-danger";
  if (cat === "معارض") return "bg-success";
  if (cat === "ثقافة") return "bg-secondary";
  if (cat === "تعليم") return "bg-info text-dark";
  return "bg-dark";
}
// ===== Dark Mode Functionality =====
function initDarkMode() {
    console.log('بدء تهيئة Dark Mode...');
    
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    
    if (!darkModeToggle) {
        console.error('❌ زر Dark Mode غير موجود في الصفحة!');
        return;
    }
    
    const toggleIcon = darkModeToggle.querySelector('.toggle-icon');
    
    // التحقق من الإعدادات المحفوظة
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    console.log('الحالة المحفوظة:', isDarkMode ? 'Dark Mode' : 'Light Mode');
    
    // تطبيق الوضع المحفوظ
    if (isDarkMode) {
        body.classList.add('dark-mode');
        toggleIcon.textContent = '☀️';
        darkModeToggle.title = 'التبديل إلى الوضع الفاتح';
    } else {
        body.classList.remove('dark-mode');
        toggleIcon.textContent = '🌙';
        darkModeToggle.title = 'التبديل إلى الوضع الداكن';
    }
    
    // تبديل الوضع عند النقر
    darkModeToggle.addEventListener('click', function() {
        console.log('تم النقر على زر Dark Mode');
        
        body.classList.toggle('dark-mode');
        
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('darkMode', 'true');
            toggleIcon.textContent = '☀️';
            darkModeToggle.title = 'التبديل إلى الوضع الفاتح';
            console.log('✅ تم تفعيل Dark Mode');
        } else {
            localStorage.setItem('darkMode', 'false');
            toggleIcon.textContent = '🌙';
            darkModeToggle.title = 'التبديل إلى الوضع الداكن';
            console.log('✅ تم تفعيل Light Mode');
        }
    });
    
    // الكشف عن تفضيلات النظام
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // تطبيق تفضيلات النظام إذا لم يكن هناك إعداد محفوظ
    if (localStorage.getItem('darkMode') === null && prefersDarkScheme.matches) {
        console.log('🔄 تطبيق تفضيلات النظام (Dark Mode)');
        body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'true');
        toggleIcon.textContent = '☀️';
        darkModeToggle.title = 'التبديل إلى الوضع الفاتح';
    }
    
    console.log('✅ تهيئة Dark Mode اكتملت');
}

// ثم تبدأ الدوال الحالية...
function badgeClass(cat) {
  // بترجع كلاس البادج حسب التصنيف
  if (cat === "موسيقى") return "bg-primary";
  // ... باقي الكود الحالي
}
function cardHTML(e) {
  const lang = currentLang();
  const isDark = getCurrentTheme ? getCurrentTheme() === 'dark' : false;
  
  const textClass = isDark ? 'text-light' : 'text-dark';
  const mutedClass = isDark ? 'text-light-muted' : 'text-muted';
  
  return `
  <div class="card h-100 event-card position-relative theme-aware" data-id="${e.id}" data-category="${e.category}">
    <img src="${e.img}" class="card-img-top w-100" alt="${e.title}">
    <div class="card-body d-flex flex-column">
      <span class="badge ${badgeClass(e.category)} mb-2">
        ${categoryLabel(e.category, lang)}
      </span>

      <h5 class="event-title ${textClass}">${e.title}</h5>

      <p class="event-place mb-1 ${textClass}">
        <strong class="place-label" data-i18n-place-label>المكان:</strong>
        <span class="place-text"> ${e.place}</span>
      </p>

      <p class="event-date mb-1 ${textClass}">
        <strong class="date-label" data-i18n-date-label>التاريخ:</strong>
        <span class="date-text"> ${e.date}</span>
      </p>

      <p class="event-desc ${mutedClass} mb-3">${e.desc || ""}</p>

      <div class="mt-auto text-start">
        <a href="event.html?id=${e.id}" class="btn btn-primary btn-md detailsBtn theme-aware-btn">تفاصيل</a>
      </div>
    </div>
  </div>`;
}

function getParam(name) {
  const u = new URL(window.location.href);
  return u.searchParams.get(name);
}
function debounce(fn, ms) {
  let t;
  return (...a) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...a), ms);
  };
}

function renderStaticSections() {
  // تجهيز أقسام الصفحة الرئيسية (هذا الأسبوع + القادمة)
  const thisWeekEl = document.getElementById("thisWeek");
  const upcomingEl = document.getElementById("upcoming");
  if (!thisWeekEl || !upcomingEl) return;

  thisWeekEl.className = "row g-3";
  thisWeekEl.innerHTML = "";
  const heroCol = document.createElement("div");
  heroCol.className = "col-12 col-sm-6 col-lg-4";
  heroCol.innerHTML = cardHTML(eventsData[0]);
  thisWeekEl.appendChild(heroCol);

  upcomingEl.innerHTML = "";
  eventsData.slice(1, 6).forEach((e) => {
    const col = document.createElement("div");
    col.className = "col-12 col-sm-6 col-lg-4";
    col.innerHTML = cardHTML(e);
    upcomingEl.appendChild(col);
  });
}

let currentCat = "all"; // التصنيف الحالي المختار

function renderCategories(list) {
  // شبكة التصنيفات على الرئيسية
  const categoriesEl = document.getElementById("categories");
  if (!categoriesEl) return;

  categoriesEl.innerHTML = "";
  const items = currentCat === "all" ? list : list.slice(0, 4); // عند تصنيف محدد، بنخفف العدد

  if (!items.length) {
    categoriesEl.innerHTML =
      '<div class="col-12"><div class="alert alert-warning">لا توجد فعاليات لهذا التصنيف حالياً.</div></div>';
    return;
  }

  items.forEach((e) => {
    const col = document.createElement("div");
    col.className = "col-12 col-sm-6 col-lg-3";
    col.innerHTML = cardHTML(e);
    categoriesEl.appendChild(col);
  });
}

function filterBy(cat) {
  // فلترة سريعة حسب التصنيف
  return cat === "all"
    ? eventsData
    : eventsData.filter((e) => e.category === cat);
}

function setActive(cat) {
  // تمييز زر التصنيف النشط
  const wrap = document.getElementById("categoryButtons");
  if (!wrap) return;
  wrap.querySelectorAll(".category-btn").forEach((btn) => {
    btn.classList.remove("btn-primary", "text-white");
    btn.classList.add("btn-outline-primary");
  });
  const current = [...wrap.querySelectorAll(".category-btn")].find(
    (b) => b.dataset.category === cat
  );
  if (current) {
    current.classList.remove("btn-outline-primary");
    current.classList.add("btn-primary");
  }
}

function initIndexPage() {
  // تهيئة الصفحة الرئيسية فقط إذا موجودة عناصرها
  if (!document.getElementById("thisWeek")) return;

  renderStaticSections();
  localizeEventCardStatics(currentLang());

  currentCat = "all";
  setActive(currentCat);
  renderCategories(filterBy(currentCat));
  localizeEventCardStatics(currentLang());

  const wrap = document.getElementById("categoryButtons");
  if (wrap) {
    wrap.addEventListener("click", (e) => {
      const btn = e.target.closest(".category-btn");
      if (!btn) return;
      currentCat = btn.dataset.category; // تحديث الحالة
      setActive(currentCat);
      renderCategories(filterBy(currentCat));
      localizeEventCardStatics(currentLang());
      document
        .getElementById("categories")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
}

function render(list) {
  //events
  const grid = document.getElementById("eventsGrid");
  if (!grid) return;
  grid.innerHTML = "";
  if (!list.length) {
    grid.innerHTML =
      '<div class="col-12"><div class="alert alert-warning">لا نتائج مطابقة للفلترة الحالية.</div></div>';
    return;
  }
  list.forEach((e) => {
    const col = document.createElement("div");
    col.className = "col-12 col-md-6 col-lg-4";
    col.innerHTML = cardHTML(e);
    grid.appendChild(col);
  });
  localizeEventCardStatics();
}

function norm(str) {
  return (str || "").toString().toLowerCase().trim();
}
function tryISO(e) {
  if (e.startISO) return new Date(e.startISO);
  const maybe = new Date(e.date);
  return isNaN(maybe) ? null : maybe;
}

function uniquePlaces() {
  const data = window.eventsData || [];
  const set = new Set();
  data.forEach((e) => {
     if (e.place) set.add(e.place);
   });
   return ["all", ...Array.from(set)];
}

function activateButtons(cat) {
  // مزامنة أزرار التصنيف مع السيلكت بوكس
  const wrap = document.getElementById("categoryButtons");
  if (!wrap) return;
  wrap.querySelectorAll("button").forEach((b) => {
    b.classList.remove("btn-primary");
    b.classList.add("btn-outline-primary");
  });
  const btn = [...wrap.querySelectorAll("button")].find(
    (b) => b.dataset.category === cat
  );
  if (btn) {
    btn.classList.remove("btn-outline-primary");
    btn.classList.add("btn-primary");
  }
  const sel = document.getElementById("catSelect");
  if (sel && sel.value !== cat) sel.value = cat;
}

function populatePlaces() {
  const sel = document.getElementById("placeSelect");
  if (!sel) return;
  sel.innerHTML = "";

  uniquePlaces().forEach((p) => {
    const opt = document.createElement("option");
    opt.value = p;
    opt.textContent = p === "all" ? "كل الأماكن" : p;
    sel.appendChild(opt);
  });
}

function applyFilters() {
  if (!document.getElementById("eventsGrid")) return;

  const text  = norm(document.getElementById("q")?.value);
  const cat   = document.getElementById("catSelect")?.value || "all";
  const place = document.getElementById("placeSelect")?.value || "all";
  const dateStr = document.getElementById("dateSelect")?.value || "";
  const dateVal = dateStr ? new Date(dateStr) : null;

  const base = window.eventsData || [];
  let list = base.slice();

  if (cat   !== "all") list = list.filter((e) => e.category === cat);
  if (place !== "all") list = list.filter((e) => e.place === place);

  if (text) {
    list = list.filter((e) => {
      const hay = (
        e.title + " " + (e.desc || "") + " " + (e.place || "")
      ).toLowerCase();
      return hay.includes(text);
    });
  }

  if (dateVal) {
    list = list.filter((e) => {
      const d = tryISO(e);
      if (!d) return true;
      return (
        d.getFullYear() === dateVal.getFullYear() &&
        d.getMonth()    === dateVal.getMonth() &&
        d.getDate()     === dateVal.getDate()
      );
    });
  }

  render(list);
  activateButtons(cat);
  history.replaceState(null, "", cat === "all" ? "events.html" : "?category=" + encodeURIComponent(cat));
}

function initEventsPage() {
  // تهيئة صفحة جميع الفعاليات
  if (!document.getElementById("eventsGrid")) return;

  populatePlaces();

  const initialCat = decodeURIComponent(getParam("category") || "all");
  const catSel = document.getElementById("catSelect");
  if (catSel) catSel.value = initialCat;
  activateButtons(initialCat);
  applyFilters();

  document
    .getElementById("q")
    ?.addEventListener("input", debounce(applyFilters, 250));
  document
    .getElementById("catSelect")
    ?.addEventListener("change", applyFilters);
  document
    .getElementById("placeSelect")
    ?.addEventListener("change", applyFilters);
  document
    .getElementById("dateSelect")
    ?.addEventListener("change", applyFilters);

  document.getElementById("categoryButtons")?.addEventListener("click", (e) => {
    if (e.target.matches("button[data-category]")) {
      const cat = e.target.dataset.category;
      const sel = document.getElementById("catSelect");
      if (sel) sel.value = cat;
      applyFilters();
      localizeEventCardStatics();
    }
  });
}

function yyyymmdd(d) {
  return d.toISOString().slice(0, 10).replace(/-/g, "");
}
function buildICS(ev) {
  // توليد ملف iCalendar بسيط للفعالية
  let s = ev.startISO ? new Date(ev.startISO) : new Date(ev.date);
  let e = ev.endISO ? new Date(ev.endISO) : new Date(ev.date);
  if (isNaN(s)) s = new Date();
  if (isNaN(e)) e = s;

  const DTSTART = "DTSTART;VALUE=DATE:" + yyyymmdd(s);
  const endPlus = new Date(e.getTime());
  endPlus.setDate(endPlus.getDate() + 1); // نهاية اليوم
  const DTEND = "DTEND;VALUE=DATE:" + yyyymmdd(endPlus);

  const SUMMARY = "SUMMARY:" + ev.title.replace(/\r?\n/g, " ");
  const LOCATION = "LOCATION:" + (ev.place || "");
  const DESCRIPTION = "DESCRIPTION:" + (ev.desc || "");
  const UID = "UID:" + (ev.id || Date.now() + "@cityevents");

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//City Events//AR//",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    UID,
    DTSTART,
    DTEND,
    SUMMARY,
    LOCATION,
    DESCRIPTION,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return "data:text/calendar;charset=utf-8," + encodeURIComponent(ics);
}

async function shareEvent(ev) {
  // مشاركة سريعة
  const url = window.location.href;
  const title = ev.title;
  const text = ev.desc || ev.title;
  if (navigator.share) {
    try {
      await navigator.share({ title, text, url });
    } catch (_) {
      /* تجاهل */
    }
  } else {
    try {
      await navigator.clipboard.writeText(url);
      alert("تم نسخ رابط الفعالية إلى الحافظة ✅");
    } catch (_) {
      prompt("انسخ الرابط:", url);
    }
  }
}

function miniCard(e) {
  const lang = currentLang();
  const ep = (window.I18N && window.I18N[lang] && window.I18N[lang].eventsPage) || {};
  const detailsTxt = ep.detailsButton || (lang === 'en' ? 'Details' : 'تفاصيل');
  const badgeTxt   = categoryLabel(e.category, lang);

  return `
  <div class="card h-100">
    ${e.img ? `<img src="${e.img}" class="card-img-top" alt="${e.title}" style="max-height:160px;object-fit:cover;">` : ''}
    <div class="card-body">
      <span class="badge ${badgeClass(e.category)} mb-2">${badgeTxt}</span>
      <h6 class="card-title mb-1">${e.title}</h6>
      <div class="small text-muted mb-2">${e.place}</div>
      <a href="event.html?id=${encodeURIComponent(e.id)}" class="btn btn-sm btn-primary detailsBtn">${detailsTxt}</a>
    </div>
  </div>`;
}

function renderRelated(ev) {
  const box = document.getElementById("relatedEvents");
  const sec = document.getElementById("relatedSection");
  if (!box || !sec) return;

  // خُد البيانات من النسخة المترجمة:
  const src = (window.eventsData && window.eventsData.length ? window.eventsData : eventsData) || [];

  const related = src
    .filter(e => e.category === ev.category && e.id !== ev.id)
    .slice(0, 3);

  if (!related.length) {
    sec.style.display = "none";
    return;
  }

  box.innerHTML = "";
  related.forEach(e => {
    const col = document.createElement("div");
    col.className = "col-12 col-sm-6 col-lg-4";
    col.innerHTML = miniCard(e);   // ← البطاقة المعرّبة
    box.appendChild(col);
  });

  sec.style.display = "";
}

// أماكن مع إحداثيات جاهزة للاستخدام
const COORDS = {
  "دار الأوبرا": { lat: 33.5097, lng: 36.2783 },
  "دار الأوبرا بدمشق": { lat: 33.5097, lng: 36.2783 },
  "مدينة المعارض – دمشق": { lat: 33.4606, lng: 36.3676 },
  "جامعة دمشق": { lat: 33.5131, lng: 36.2785 },
  "المركز الثقافي العربي بدمشق": { lat: 33.5129, lng: 36.2838 },
  "حديقة تشرين، دمشق": { lat: 33.5215, lng: 36.2812 },
  "مسرح الحمراء - دمشق": { lat: 33.5117, lng: 36.3021 },
  "مركز التدريب بجامعة دمشق": { lat: 33.5111, lng: 36.278 },
};
// إرجاع الإحذاثيات
function getCoords(ev) {
  if (
    ev.coords &&
    typeof ev.coords.lat === "number" &&
    typeof ev.coords.lng === "number"
  ) {
    return ev.coords;
  }
  const keys = Object.keys(COORDS);
  const place = (ev.place || "").trim();
  for (const k of keys) {
    if (place.includes(k)) return COORDS[k];
  }
  return { lat: 33.5138, lng: 36.2765 }; // افتراضي: دمشق
}

function buildStaticMapURLs(ev) {
  const { lat, lng } = getCoords(ev);
  const zoom = 14;
  const size = { w: 800, h: 400 };

  return [
    `https://maps.wikimedia.org/img/osm-intl,${lng},${lat},${zoom},${size.w}x${size.h}.png`,
    `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lng}&zoom=${zoom}&size=${size.w}x${size.h}&markers=${lat},${lng},red-pushpin`,
  ];
}

function loadImageWithFallback(imgEl, urls) {
  if (!imgEl || !urls.length) return;
  let i = 0;
  const tryNext = () => {
    if (i >= urls.length) {
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

function renderEvent(ev) {
  // تعبئة صفحة تفاصيل الفعالية
  const crumbTitle = document.getElementById("crumbTitle");
  const eventTitle = document.getElementById("eventTitle");
  const eventTitleMain = document.getElementById("eventTitleMain");
  const eventSubtitle = document.getElementById("eventSubtitle");

  if (crumbTitle) crumbTitle.textContent = ev.title;
  if (eventTitle) eventTitle.textContent = ev.title;
  if (eventTitleMain) eventTitleMain.textContent = ev.title;
  if (eventSubtitle) eventSubtitle.textContent = ev.place;

  const img = document.getElementById("eventImage");
  if (img) {
    img.src = ev.img;
    img.alt = ev.title;
  }

  const placeEl = document.getElementById("eventPlace");
  const dateEl = document.getElementById("eventDate");
  const descEl = document.getElementById("eventDesc");
  const longEl = document.getElementById("eventLongDesc");
  if (placeEl) placeEl.textContent = ev.place;
  if (dateEl) dateEl.textContent = ev.date;
  if (descEl) descEl.textContent = ev.desc || "";
  if (longEl) longEl.textContent = ev.longDesc || "";

  const cat = document.getElementById("eventCategoryBadge");
  if (cat) {
    cat.className = "badge " + badgeClass(ev.category);
    cat.textContent = categoryLabel(ev.category, currentLang());
  }
  const dateBadge = document.getElementById("eventDateBadge");
  if (dateBadge) dateBadge.textContent = ev.date;

  const q = encodeURIComponent((ev.place || "") + " دمشق");
  const map = document.getElementById("mapLink");
  if (map) map.href = "https://www.google.com/maps/search/?api=1&query=" + q;

  const mapFrame = document.getElementById("staticMapFrame");
  if (mapFrame) {
    const { lat, lng } = getCoords(ev);
    const dLat = 0.01, dLng = 0.015;
    const bbox = [
      (lng - dLng).toFixed(6),
      (lat - dLat).toFixed(6),
      (lng + dLng).toFixed(6),
      (lat + dLat).toFixed(6),
    ].join("%2C");

    const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;
    mapFrame.src = src;
    mapFrame.title = `خريطة: ${ev.place || ev.title}`;
  }

  const addBtn = document.getElementById("addToCalBtn");
  if (addBtn) {
    addBtn.href = buildICS(ev);
    addBtn.download = (ev.id || "event") + ".ics";
  }

  const shareBtn = document.getElementById("shareBtn");
  if (shareBtn) {
    shareBtn.onclick = () => shareEvent(ev);
  }

  renderRelated(ev);

  const content = document.getElementById("eventContent");
  if (content) content.style.display = "";
}

function initEventPage() {
  // تهيئة صفحة تفاصيل الحدث
  if (
    !document.getElementById("eventContent") &&
    !document.getElementById("notFound")
  ) return;

  const id = getParam("id");
  const ev = eventsData.find((e) => e.id === id);

  if (!ev) {
    document.getElementById("notFound")?.classList.remove("d-none");
    return;
  }
  renderEvent(ev);
}

// مفاتيح لخدمات خرائط
const GOOGLE_STATIC_KEY = "YOUR_GOOGLE_MAPS_STATIC_API_KEY";
const GEOAPIFY_STATIC_KEY = "YOUR_GEOAPIFY_KEY";

function buildStaticMapUrlFromCoords(lat, lng) {
  return (
    `https://maps.geoapify.com/v1/staticmap?style=osm-carto&width=800&height=400` +
    `&center=lonlat:${lng},${lat}&zoom=14` +
    `&marker=lonlat:${lng},${lat};color:%23ff0000;size:medium` +
    `&apiKey=${GEOAPIFY_STATIC_KEY}`
  );
}

function buildStaticMapUrlFromQuery(query) {
  const q = encodeURIComponent(query);
  return (
    `https://maps.googleapis.com/maps/api/staticmap?center=${q}` +
    `&zoom=14&size=800x400&language=ar&scale=2` +
    `&markers=color:red|${q}&key=${GOOGLE_STATIC_KEY}`
  );
}

const DEFAULT_DMASCUS = { lat: 33.5138, lng: 36.2765 };

function osmStaticMapUrl(lat, lng, w = 800, h = 400, zoom = 14) {
  return `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lng}&zoom=${zoom}&size=${w}x${h}&markers=${lat},${lng},red-pushpin`;
}

function staticMapUrl(ev) {
  // اختيار خريطة افتراضية إذا ما في إحداثيات
  const c =
    ev.coords &&
    typeof ev.coords.lat === "number" &&
    typeof ev.coords.lng === "number"
      ? ev.coords
      : DEFAULT_DMASCUS;
  return osmStaticMapUrl(c.lat, c.lng);
}

// ========= DOMContentLoaded (واحد فقط) =========
document.addEventListener("DOMContentLoaded", () => {
  const savedLang = localStorage.getItem("selectedLang") || "ar";
  setLanguage(savedLang);     // حمّل الترجمة وبدّل window.eventsData

  initIndexPage();
  initEventsPage();
  initEventPage();
  setupContactForm();

  // تهيئة نظام الثيم بعد تحميل كل شيء
  if (typeof initThemeSystem === 'function') {
    initThemeSystem();
  }
});

// ألارم بسيط مع bootstrap
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

function setupContactForm() {
  const form = document.querySelector("form");
  if (!form || !document.getElementById("name")) return; // يعني ما في فورم بالصفحة

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
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

if (!window._eventsDataBase && Array.isArray(window.eventsData)) {
  window._eventsDataBase = window.eventsData.slice();
}

// ترجمة eventsData اعتماداً على I18N[lang].events
function getLocalizedEvents(lang) {
  const base = window._eventsDataBase || [];
  const dict = (window.I18N && window.I18N[lang] && window.I18N[lang].events) || {};
  return base.map(ev => {
    const t = dict[ev.id];
    return t ? {
      ...ev,
      title:    t.title    ?? ev.title,
      place:    t.place    ?? ev.place,
      date:     t.date     ?? ev.date,
      desc:     t.desc     ?? ev.desc,
      longDesc: t.longDesc ?? ev.longDesc
    } : ev;
  });
}

// استبدل كل دالة setLanguage القديمة بهي:
function setLanguage(lang) {
  localStorage.setItem("selectedLang", lang);

  const data = window.I18N && window.I18N[lang];
  if (!data) {
    alert("تعذّر تحميل الترجمة: تأكدي من ملفات اللغة أو اسم اللغة المختارة.");
    console.error("I18N:", window.I18N);
    return;
  }

  // ===== النافبار
  const navMap = {
    ".navbar-brand": data.title,
    '.nav-link[href="index.html"]': data.navHome,
    '.nav-link[href="events.html"]': data.navEvents,
    '.nav-link[href="about.html"]': data.navAbout,
    '.nav-link[href="contact.html"]': data.navContact,
  };
  for (const [sel, val] of Object.entries(navMap)) {
    const el = document.querySelector(sel);
    if (el && typeof val === "string") el.textContent = val;
  }

  // ===== الهيرو + عناوين أقسام الصفحة الرئيسية
  const ht = document.querySelector('.hero-title');
  const hx = document.querySelector('.hero-text');
  const hb = document.querySelector('.hero-button');
  if (ht && data.heroTitle)  ht.textContent = data.heroTitle;
  if (hx && data.heroText)   hx.textContent = data.heroText;
  if (hb && data.heroButton) hb.textContent = data.heroButton;

  const thisWeekTitleEl = document.querySelector('.this-week-title');
  const upcomingTitleEl = document.querySelector('.upcoming-title');
  const catsTitleEl     = document.querySelector('.categories-title');
  if (thisWeekTitleEl && data.thisWeekTitle) thisWeekTitleEl.textContent = data.thisWeekTitle;
  if (upcomingTitleEl && data.upcomingTitle) upcomingTitleEl.textContent = data.upcomingTitle;
  if (catsTitleEl     && data.categoriesTitle) catsTitleEl.textContent   = data.categoriesTitle;

  // ===== صفحة About
  const a = data.about || {};
  text(".aboutGuideTitle", a.aboutGuide);
  text(".aboutGuideContent", a.aboutGuideContent);
  text(".ourVisionTitle", a.ourVision);
  text(".ourVisionContent", a.ourVisionContent);
  text(".ourMassageTitle", a.ourmassage);
  text(".ourMassageContent", a.ourmassagecontent);
  text(".jobGroupTitle", a.jopgroub);
  text(".policyTitle", a.policy);
  if (a.policydetails) {
    text(".policyDetail-1", a.policydetails["1"]);
    text(".policyDetail-2", a.policydetails["2"]);
    text(".policyDetail-3", a.policydetails["3"]);
    text(".policyDetail-4", a.policydetails["4"]);
    text(".policyDetail-5", a.policydetails["5"]);
  }

  // ===== صفحة Contact
  const c = data.contact || {};
  text('.contactMainTitle', c.main);
  text('.callUsTitle', c.callas);
  text('.callUsContent', c.callascontent);
  text('.sendMessageTitle', c.sendmassage);
  text('.fullNameLabel', c.fullname);
  text('.emailLabel', c.email);
  text('.messageLabel', c.massage);
  text('.sendButton', c.send);
  text('.contactInfoTitle', c.contactinfo);
  text('.contactPhoneInfo', c.phone);
  text('.contactMailInfo', c.mail);
  text('.contactAddressInfo', c.address);
  text('.socialMediaTitle', c.socialmedia);

  // ===== صفحة EVENTS (شبكة)
  const e = (data.eventsPage || {});
  text('.eventsPageTitle', e.pageTitle);
  const q = document.getElementById('q');
  if (q && e.searchPlaceholder) q.setAttribute('placeholder', e.searchPlaceholder);
  const date = document.getElementById('dateSelect');
  if (date && e.datePlaceholder) date.setAttribute('placeholder', e.datePlaceholder);
  const catAllOpt = document.querySelector('#catSelect .catAllOption');
  if (catAllOpt) catAllOpt.textContent = e.selectCategoryAll;
  const placeAllOpt = document.querySelector('#placeSelect .placeAllOption');
  if (placeAllOpt) placeAllOpt.textContent = e.selectPlaceAll;
  text('.upcomingHeading', e.upcomingHeading);

  // تبديل تسميات أزرار التصنيفات (نفس data-category)
  const btnLabels = {
    'all': e.categoryAll,
    'موسيقى': e.categoryMusic,
    'سينما': e.categoryCinema,
    'معارض': e.categoryExhibitions,
    'ثقافة': e.categoryCulture,
    'تعليم': e.categoryEducation
  };
  document.querySelectorAll('#categoryButtons [data-category]').forEach(btn => {
    const key = btn.getAttribute('data-category');
    if (btnLabels[key]) btn.textContent = btnLabels[key];
    if (key === 'all' && btnLabels['all']) btn.textContent = btnLabels['all'];
  });

  if (e.detailsButton) {
    document.querySelectorAll('.detailsBtn').forEach(b => b.textContent = e.detailsButton);
  }
  if (e.labels) {
    document.querySelectorAll('[data-i18n-place-label]').forEach(el => el.textContent = e.labels.place);
    document.querySelectorAll('[data-i18n-date-label]').forEach(el => el.textContent = e.labels.date);
  }

  // ===== الفوتر
  text(".footer-contact-title", data.footerContactTitle);
  text(".footer-phone",        data.footerPhone);
  text(".footer-email",        data.footerEmail);
  text(".footer-rights",       data.footerRights);
  text(".footer-team",         data.footerTeam);

  // ===== تحديد الصفحة الحالية
  const isIndexPage    = !!document.getElementById('thisWeek');
  const isEventsList   = !!document.getElementById('eventsGrid');
  const isEventDetails = !!document.getElementById('eventContent');

  // ===== بناء نسخة مترجمة من البيانات وتطبيقها
  const localized = getLocalizedEvents(lang);
  window.eventsData = localized;

  // شبكة الفعاليات
  if (isEventsList) {
    renderEventsGridFromGlobal();
    const ep = (window.I18N && window.I18N[lang] && window.I18N[lang].eventsPage) || {};
    if (ep.labels) {
      document.querySelectorAll('[data-i18n-place-label]').forEach(el => el.textContent = ep.labels.place || el.textContent);
      document.querySelectorAll('[data-i18n-date-label]').forEach(el  => el.textContent = ep.labels.date  || el.textContent);
    }
    if (ep.detailsButton) {
      document.querySelectorAll('.detailsBtn').forEach(b => b.textContent = ep.detailsButton);
    }
  }

  // صفحة التفاصيل
  if (isEventDetails && typeof window.renderEvent === 'function') {
    localizeEventDetailsStatics(lang);
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    const ev = (window.eventsData || []).find(x => x.id === id) || (window.eventsData || [])[0];
    if (ev) window.renderEvent(ev);
  }

  // ⭐ الصفحة الرئيسية: إعادة الرسم بعد تبديل اللغة/البيانات
  if (isIndexPage) {
    renderStaticSections();                     // يعيد “هذا الأسبوع” و“أحداث قادمة” من البيانات المترجمة
    renderCategories(filterBy(currentCat));     // يعيد شبكة التصنيفات
    localizeEventCardStatics(lang);             // يحدّث لابل المكان/التاريخ + زر "تفاصيل"

    // إعادة تسميات أزرار التصنيفات على الرئيسية أيضاً
    const ep = (window.I18N && window.I18N[lang] && window.I18N[lang].eventsPage) || {};
    const labels2 = {
      'all': ep.categoryAll,
      'موسيقى': ep.categoryMusic,
      'سينما': ep.categoryCinema,
      'معارض': ep.categoryExhibitions,
      'ثقافة': ep.categoryCulture,
      'تعليم': ep.categoryEducation
    };
    document.querySelectorAll('#categoryButtons [data-category]').forEach(btn => {
      const key = btn.getAttribute('data-category');
      if (labels2[key]) btn.textContent = labels2[key];
      if (key === 'all' && labels2['all']) btn.textContent = labels2['all'];
    });
  }

  // اتجاه الصفحة
  document.documentElement.lang = lang;
  document.documentElement.dir  = (lang === 'ar' ? 'rtl' : 'ltr');
}


// هيلبر صغير
function text(sel, val) {
  const el = document.querySelector(sel);
  if (el && typeof val === "string") el.textContent = val;
}

function renderEventsGridFromGlobal() {
  const grid = document.getElementById('eventsGrid');
  if (!grid) return;

  const e = (window.I18N && window.I18N[document.documentElement.lang] && window.I18N[document.documentElement.lang].eventsPage) || {};
  const labels = e.labels || { place: 'المكان', date: 'التاريخ' };

  grid.innerHTML = '';
  (window.eventsData || []).forEach(ev => {
    const col = document.createElement('div');
    col.className = 'col-12 col-md-6 col-lg-4';

    col.innerHTML = `
      <div class="card h-100 shadow-sm">
        ${ev.img ? `<img class="card-img-top" src="${ev.img}" alt="${ev.title}">` : ''}
        <div class="card-body">
          <span class="badge ${badgeClass(ev.category)} mb-2">
             ${categoryLabel(ev.category, currentLang())}
          </span>

          <h5 class="card-title">${ev.title}</h5>

          <p class="mb-1"><strong data-i18n-place-label>${labels.place}</strong> <span>${ev.place}</span></p>
          <p class="mb-2"><strong data-i18n-date-label>${labels.date}</strong> <span>${ev.date}</span></p>

          ${ev.desc ? `<p class="text-muted">${ev.desc}</p>` : ''}

          <a class="btn btn-primary btn-sm detailsBtn" href="event.html?id=${encodeURIComponent(ev.id)}">
            ${e.detailsButton || 'تفاصيل'}
          </a>
        </div>
      </div>
    `;
    grid.appendChild(col);
  });
}

function currentLang() {
  return localStorage.getItem('selectedLang') || document.documentElement.lang || 'ar';
}

function localizeEventCardStatics(lang = currentLang()) {
  // ناخد نصوص الكروت من ملف اللغة
  const t = (window.I18N && window.I18N[lang] && window.I18N[lang].eventsPage) || {};
  const placeTxt = (t.labels && t.labels.place) || (lang === 'en' ? 'Place:' : 'المكان:');
  const dateTxt  = (t.labels && t.labels.date ) || (lang === 'en' ? 'Date:'  : 'التاريخ:');
  const details  = t.detailsButton || (lang === 'en' ? 'Details' : 'تفاصيل');

  // 1) لابل المكان
  document.querySelectorAll('[data-i18n-place-label], .place-label')
    .forEach(el => { el.textContent = placeTxt; });

  // 2) لابل التاريخ
  document.querySelectorAll('[data-i18n-date-label], .date-label')
    .forEach(el => { el.textContent = dateTxt; });

  // 3) زر التفاصيل
  document.querySelectorAll('.detailsBtn')
    .forEach(b => { b.textContent = details; });
}


function localizeEventDetailsStatics(lang) {
  var t = (window.I18N && window.I18N[lang] && window.I18N[lang].eventPage) || {};

  // breadcrumb
  var el;
  el = document.querySelector('.breadcrumb-home');
  if (el) el.textContent = t.breadcrumbHome || "الرئيسية";

  el = document.querySelector('.breadcrumb-events');
  if (el) el.textContent = t.breadcrumbEvents || "الأحداث";

  // labels
  el = document.querySelector('.placeLabel');
  if (el) el.textContent = t.placeLabel || "المكان:";

  el = document.querySelector('.dateLabel');
  if (el) el.textContent = t.dateLabel || "التاريخ:";

  el = document.querySelector('.longDescTitle');
  if (el) el.textContent = t.longDescTitle || "نبذة موسّعة";

  el = document.querySelector('.relatedTitle');
  if (el) el.textContent = t.relatedTitle || "فعاليات ذات صلة";

  // buttons
  var back  = document.getElementById('backToEventsBtn');
  var map   = document.getElementById('mapLink');
  var add   = document.getElementById('addToCalBtn');
  var share = document.getElementById('shareBtn');

  if (back)  back.textContent  = t.backBtn  || back.textContent;
  if (map)   map.textContent   = t.openMap  || map.textContent;
  if (add)   add.textContent   = t.addToCal || add.textContent;
  if (share) share.textContent = t.share    || share.textContent;

  const mapTitle    = document.getElementById('staticMapTitle');
  const mapCaption  = document.getElementById('staticMapCaption');
  if (mapTitle)   mapTitle.textContent  = t.mapTitle   ?? "الخريطة (صورة ثابتة)";
  if (mapCaption) mapCaption.textContent= t.mapCaption ?? "خريطة ثابتة للعرض فقط — للخريطة التفاعلية استخدم زر \"الموقع على الخريطة\".";
}

function categoryLabel(cat, lang) {
  const ep = window.I18N && window.I18N[lang] && window.I18N[lang].eventsPage;
  if (!ep) return cat;
  const map = {
    "موسيقى": ep.categoryMusic,
    "سينما": ep.categoryCinema,
    "معارض": ep.categoryExhibitions,
    "ثقافة": ep.categoryCulture,
    "تعليم": ep.categoryEducation,
    "all": ep.categoryAll
  };
  return map[cat] || cat;
}
// ==================== نظام الدارك مود ====================

// دالة لتحديث الألوان في الخرائط الثابتة عند تغيير الوضع
function updateStaticMapsForTheme() {
  if (!document.body.classList.contains('dark-mode')) return;
  
  document.querySelectorAll('img[src*="openstreetmap"], img[src*="staticmap"]').forEach(img => {
    const src = img.src;
    if (src.includes('openstreetmap') || src.includes('staticmap')) {
      img.style.filter = 'invert(0.9) hue-rotate(180deg) brightness(0.8)';
    }
  });
}

// دالة لتحديث ألوان البطاقات الديناميكية
function updateDynamicCardsForTheme() {
  const cards = document.querySelectorAll('.card, .alert, .btn');
  cards.forEach(card => {
    if (document.body.classList.contains('dark-mode')) {
      card.classList.add('dark-mode-element');
    } else {
      card.classList.remove('dark-mode-element');
    }
  });
}

// دالة لتحديث النصوص حسب الوضع
function updateTextColorsForTheme() {
  const textElements = document.querySelectorAll('.text-muted, .text-dark, .text-body');
  textElements.forEach(el => {
    if (document.body.classList.contains('dark-mode')) {
      if (el.classList.contains('text-muted')) {
        el.classList.add('text-light-muted');
      }
      if (el.classList.contains('text-dark')) {
        el.classList.add('text-light');
      }
    } else {
      el.classList.remove('text-light-muted', 'text-light');
    }
  });
}

// دالة رئيسية لتحديث كل العناصر عند تغيير الوضع
function updateUIForTheme() {
  updateStaticMapsForTheme();
  updateDynamicCardsForTheme();
  updateTextColorsForTheme();
  updateCategoryButtonsForTheme();
}

// دالة محدثة لأزرار التصنيفات
function updateCategoryButtonsForTheme() {
  const buttons = document.querySelectorAll('.category-btn');
  buttons.forEach(btn => {
    if (document.body.classList.contains('dark-mode')) {
      if (!btn.classList.contains('btn-primary')) {
        btn.classList.add('btn-outline-light');
        btn.classList.remove('btn-outline-primary');
      }
    } else {
      if (!btn.classList.contains('btn-primary')) {
        btn.classList.remove('btn-outline-light');
        btn.classList.add('btn-outline-primary');
      }
    }
  });
}

// دالة لمعالجة تغيير الوضع
function handleThemeChange() {
  updateUIForTheme();
  
  const mapFrames = document.querySelectorAll('iframe[src*="openstreetmap"]');
  mapFrames.forEach(frame => {
    if (document.body.classList.contains('dark-mode')) {
      frame.style.filter = 'invert(0.9) hue-rotate(180deg)';
    } else {
      frame.style.filter = 'none';
    }
  });
}

// تهيئة النظام عند تحميل الصفحة
function initThemeSystem() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'class' && mutation.target === document.body) {
        handleThemeChange();
      }
    });
  });
  
  observer.observe(document.body, { attributes: true });
  setTimeout(handleThemeChange, 100);
}

// دالة مساعدة للحصول على الوضع الحالي
function getCurrentTheme() {
  return document.body.classList.contains('dark-mode') ? 'dark' : 'light';
}

// جعل الدوال متاحة globally لملف theme.js
window.updateUIForTheme = updateUIForTheme;
window.getCurrentTheme = getCurrentTheme;
window.handleThemeChange = handleThemeChange;
window.initThemeSystem = initThemeSystem;

// ========= DOMContentLoaded (واحد فقط) =========
document.addEventListener("DOMContentLoaded", () => {
    console.log('🏁 بدء تحميل الصفحة...');
    
    const savedLang = localStorage.getItem("selectedLang") || "ar";
    setLanguage(savedLang);

    initDarkMode(); // هذا السطر مهم جداً
    initIndexPage();
    initEventsPage();
    initEventPage();
    setupContactForm();
    
    console.log('✅ جميع المكونات اكتمل تحميلها');
});

// ===== تلوين شارات التصنيفات تلقائياً =====
(function () {
  function paintCategoryBadges() {
    var badges = document.querySelectorAll('.card .badge');
    badges.forEach(function (badge) {
      // نظّف أي ستايل/كلاسات قديمة من محاولات سابقة
      badge.style.backgroundColor = '';
      badge.style.color = '';
      badge.classList.remove('event-category', 'cat-music', 'cat-cinema', 'cat-culture', 'cat-education', 'cat-exhibit',
                             'bg-primary','bg-info','bg-secondary','bg-success','bg-warning','bg-dark','text-white','text-dark');

      // أعطِ كلاس موحّد (لو حابة تستخدميه لاحقاً بالـCSS)
      badge.classList.add('event-category');

      // اقرأ النص (عربي/إنكليزي) وطبّق لون مناسب
      var t = (badge.textContent || '').trim().replace(/\s+/g, '');

      // خريطة التصنيفات
      switch (t) {
        case 'موسيقى':
        case 'Music':
          // أزرق (Bootstrap)
          badge.classList.add('bg-primary', 'text-white', 'cat-music');
          break;

        case 'سينما':
        case 'Cinema':
          // سماوي فاتح: خلّيه غامق للنص لقراءة أفضل
          // ممكن Bootstrap: bg-info + text-dark
          badge.classList.add('bg-info', 'text-dark', 'cat-cinema');
          break;

        case 'ثقافة':
        case 'Culture':
          badge.classList.add('bg-secondary', 'text-white', 'cat-culture');
          break;

        case 'تعليم':
        case 'Education':
          badge.classList.add('bg-success', 'text-white', 'cat-education');
          break;

        case 'معارض':
        case 'معرض':
        case 'Exhibitions':
          // بنفسجي (مش موجود بBootstrap… منضبطه inline)
          badge.classList.add('cat-exhibit');
          badge.style.backgroundColor = '#6f42c1';
          badge.style.color = '#fff';
          break;

        default:
          // لون افتراضي إذا كان في تصنيف جديد
          badge.classList.add('bg-dark', 'text-white');
      }
    });
  }

  // شغّلها عند جاهزية المستند
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', paintCategoryBadges);
  } else {
    paintCategoryBadges();
  }

  // راقب أي تغييرات على القوائم لأن الكروت عم تنبنى ديناميكياً
  ['#upcoming', '#thisWeek', '#eventsGrid', '#categories'].forEach(function (sel) {
    var root = document.querySelector(sel);
    if (!root) return;
    new MutationObserver(paintCategoryBadges).observe(root, { childList: true, subtree: true });
  });

  // إذا عندك دوال فلترة/ترجمة بتعيد بناء البطاقات، فيك تناديها هيك بعد ما تخلّص:
  // window.paintCategoryBadges = paintCategoryBadges;  // اختياري: توفّرها للاستخدام اليدوي
})();
