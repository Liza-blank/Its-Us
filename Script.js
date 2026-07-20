/* =========================================================
   CONFIG - edit this if the start date ever needs adjusting
========================================================= */
const START_DATE = new Date(2023, 4, 21); // May 21, 2023 (month is 0-indexed)

/* =========================================================
   AMBIENT PETALS
========================================================= */
(function petals(){
  const field = document.getElementById('petalField');
  const count = 18;
  for(let i=0;i<count;i++){
    const p = document.createElement('div');
    p.className = 'petal-fall';
    p.style.left = Math.random()*100 + 'vw';
    p.style.setProperty('--drift', (Math.random()*80-40)+'px');
    p.style.animationDuration = (8 + Math.random()*10) + 's';
    p.style.animationDelay = (Math.random()*10) + 's';
    p.style.transform = `scale(${0.6 + Math.random()*0.8})`;
    field.appendChild(p);
  }
})();

/* =========================================================
   GATE
========================================================= */
const gate = document.getElementById('gate');
const gateForm = document.getElementById('gateForm');
const gateInput = document.getElementById('gateInput');
const site = document.getElementById('site');

gateForm.addEventListener('submit', function(e){
  e.preventDefault();
  const val = gateInput.value.trim().toLowerCase();
  if(val === 'love' || val === 'Love'.toLowerCase()){
    unlockSite();
  } else {
    gateInput.classList.remove('shake');
    void gateInput.offsetWidth; // restart animation
    gateInput.classList.add('shake');
  }
});

function unlockSite(){
  gate.classList.add('leaving');
  document.body.style.overflow = 'auto';
  setTimeout(()=>{
    gate.classList.remove('active');
  }, 900);
  initTimeline();
}

/* =========================================================
   NAV / PAGE SWITCHING
========================================================= */
const navLinks = document.querySelectorAll('.nav-link, .nav-rose');
const sitePages = document.querySelectorAll('.site-page');
const ctaBtns = document.querySelectorAll('[data-target]');

function goTo(target){
  sitePages.forEach(p => p.classList.toggle('active', p.id === target));
  document.querySelectorAll('.nav-link').forEach(l =>
    l.classList.toggle('active', l.dataset.target === target) 
  );
  window.scrollTo({top:0, behavior:'smooth'});  
}

ctaBtns.forEach(btn => {
  btn.addEventListener('click', () => goTo(btn.dataset.target));
});

/* =========================================================
   TIMELINE / LIVE COUNTER + MINI CALENDAR
========================================================= */
function diffYMD(start, end){
  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();

  if(months < 0){
    years -= 1;
    months += 12;
  }

  let days = end.getDate() - start.getDate();
  if(days < 0){
    const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
    days += prevMonth.getDate();
  }

  return {years, months, days};
}

function initTimeline(){
  const today = new Date();
  const {years, months, days} = diffYMD(START_DATE, today);
  const totalDays = Math.floor((today - START_DATE) / (1000*60*60*24));

  animateCount('countYears', years);
  animateCount('countMonths', months);
  animateCount('countDays', days);
  animateCount('totalDays', totalDays);

  buildTimelineStrip(today, years);
  buildMiniCalendar(today);
}

function animateCount(id, target){
  const el = document.getElementById(id);
  let current = 0;
  const step = Math.max(1, Math.ceil(target / 40));
  const timer = setInterval(()=>{
    current += step;
    if(current >= target){ current = target; clearInterval(timer); }
    el.textContent = current;
  }, 18);
}

function buildTimelineStrip(today, yearsElapsed){
  const strip = document.getElementById('timelineStrip');
  strip.innerHTML = '';
  const totalYears = Math.max(yearsElapsed, 1);

  for(let i=0; i<=totalYears; i++){
    const markDate = new Date(START_DATE);
    markDate.setFullYear(START_DATE.getFullYear() + i);
    const isToday = i === totalYears;
    const el = document.createElement('div');
    el.className = 'milestone' + (isToday ? ' today' : '');
    el.innerHTML = `
      <span class="milestone-dot"></span>
      <span class="milestone-label">${isToday ? 'Today' : 'Year ' + i}</span>
    `;
    strip.appendChild(el);
  }
}

function buildMiniCalendar(today){
  const cal = document.getElementById('miniCalendar');
  const monthNames = ['January','February','March','April','May','June','July',
    'August','September','October','November','December'];
  const dayNames = ['S','M','T','W','T','F','S'];

  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const isAnniversaryMonth = month === START_DATE.getMonth();

  let html = `<div class="mc-header">${monthNames[month]} ${year}</div><div class="mc-grid">`;
  dayNames.forEach(d => html += `<div class="mc-day-name">${d}</div>`);
  for(let i=0;i<firstDay;i++) html += `<div class="mc-day empty"></div>`;
  for(let d=1; d<=daysInMonth; d++){
    const isAnniv = isAnniversaryMonth && d === START_DATE.getDate();
    const isToday = d === today.getDate();
    html += `<div class="mc-day${isAnniv ? ' anniversary' : ''}" title="${isAnniv ? 'Our anniversary' : ''}">${d}${isToday && !isAnniv ? '' : ''}</div>`;
  }
  html += `</div>`;
  cal.innerHTML = html;
}

/* =========================================================
   GALLERY LIGHTBOX
========================================================= */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');

function openLightbox(figureEl){
  const img = figureEl.querySelector('img');
  lightboxImg.src = img.src;
  lightbox.classList.add('open');
}
function closeLightbox(){
  lightbox.classList.remove('open');
}
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;

/* =========================================================
   ENVELOPE / LOVE LETTER
========================================================= */
const envelope = document.getElementById('envelope');
const waxSeal = document.getElementById('waxSeal');
const envelopeHint = document.getElementById('envelopeHint');

waxSeal.addEventListener('click', function(e){
  e.stopPropagation();
  if(envelope.classList.contains('open')) return;
  envelope.classList.add('open');
  envelopeHint.textContent = 'with all my love';
});