// script.js — handles saving, loading, rendering and export
// Data key used in localStorage
const STORAGE_KEY = 'vaishnavi_resume_data_v1';

// Save form data to localStorage and redirect to resume
function saveForm(ev){
  if(ev) ev.preventDefault();
  const form = document.getElementById('resumeForm') || ev?.target;
  const fd = new FormData(form);
  const data = {};
  for(const [k,v] of fd.entries()){
    data[k] = v;
  }
  // normalize multi-line fields
  data.skills = (data.skills||'').split(',').map(s=>s.trim()).filter(Boolean);
  data.certs = (data.certs||'').split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  // redirect to preview
  window.location.href = 'resume.html';
}

// Save partial form state (do not redirect)
function savePartial(form){
  const fd = new FormData(form);
  const data = {};
  for(const [k,v] of fd.entries()) data[k] = v;
  data.skills = (data.skills||'').split(',').map(s=>s.trim()).filter(Boolean);
  data.certs = (data.certs||'').split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Load data from localStorage (returns object or null)
function loadData(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  }catch(e){
    console.error('Failed to parse storage', e);
    return null;
  }
}

// Render resume in #resumeArea
function renderResume(){
  const container = document.getElementById('resumeArea');
  const data = loadData();
  if(!container) return;
  if(!data){
    container.innerHTML = `<div class="center muted"><p>No data found. <a href="form.html">Create your resume</a></p></div>`;
    return;
  }

  container.innerHTML = `
    <div class="resume-head">
      <div>
        <div class="resume-name">${escapeHtml(data.name||'Unnamed')}</div>
        <div class="muted">${escapeHtml(data.email||'')} • ${escapeHtml(data.phone||'')}</div>
      </div>
      <div class="muted">${escapeHtml(data.nationality||'')}</div>
    </div>

    <div class="section">
      <h4>Education</h4>
      <div class="muted">${nl2br(escapeHtml(data.education||'—'))}</div>
    </div>

    <div class="section">
      <h4>Skills</h4>
      <div class="list">${(data.skills||[]).map(s=>`<span class="tag">${escapeHtml(s)}</span>`).join(' ')}</div>
    </div>

    <div class="section">
      <h4>Projects</h4>
      <div class="muted">${nl2br(escapeHtml(data.projects||'—'))}</div>
    </div>

    <div class="section">
      <h4>Achievements</h4>
      <div class="muted">${nl2br(escapeHtml(data.achievements||'—'))}</div>
    </div>

    <div class="section">
      <h4>Certificates / Links</h4>
      <div class="muted">${(data.certs||[]).map(c=>`<div><a href="${escapeAttr(c)}" target="_blank">${escapeHtml(c)}</a></div>`).join('')}</div>
    </div>

    <div class="section">
      <h4>Hobbies</h4>
  <div class="muted" style="color:var(--text)">${nl2br(escapeHtml(data.hobbies||'—'))}</div>
    </div>

    <div class="section">
      <h4>Strengths</h4>
  <div class="muted" style="color:var(--text)">${nl2br(escapeHtml(data.strengths||'—'))}</div>
    </div>
  `;
}

// Render biodata in #biodataArea
function renderBiodata(){
  const container = document.getElementById('biodataArea');
  const data = loadData();
  if(!container) return;
  if(!data){
    container.innerHTML = `<div class="center muted"><p>No data found. <a href="form.html">Create your bio-data</a></p></div>`;
    return;
  }

  container.innerHTML = `
    <div class="resume-head">
      <div>
        <div class="resume-name">${escapeHtml(data.name||'Unnamed')}</div>
          <div class="muted" style="color:var(--text)">${escapeHtml(data.email||'')} • ${escapeHtml(data.phone||'')}</div>
      </div>
        <div class="muted" style="color:var(--text)">DOB: ${escapeHtml(data.dob||'–')}</div>
    </div>

    <div class="section"><h4>Personal Info</h4>
        <div class="muted" style="color:var(--text)">Gender: ${escapeHtml(data.gender||'–')} • Nationality: ${escapeHtml(data.nationality||'–')}</div>
    </div>

    <div class="section"><h4>Hobbies</h4>
      <div class="muted" style="color:var(--text)">${escapeHtml(data.hobbies||'–')}</div>
    </div>

    <div class="section"><h4>Strengths</h4>
      <div class="muted" style="color:var(--text)">${escapeHtml(data.strengths||'–')}</div>
    </div>
  `;
}

/* ------------------ Form Stepper & Persistence ------------------ */
function initFormSteps(){
  const form = document.getElementById('resumeForm');
  if(!form) return;
  const steps = Array.from(form.querySelectorAll('.step'));
  let current = 0;

  function show(i){
    steps.forEach((s,idx)=> s.style.display = idx===i ? 'block' : 'none');
    // update controls
    const prev = document.getElementById('prevBtn');
    const next = document.getElementById('nextBtn');
    const save = document.getElementById('saveBtn');
    if(prev) prev.style.display = i===0 ? 'none' : 'inline-block';
    if(next) next.style.display = i===steps.length-1 ? 'none' : 'inline-block';
    if(save) save.style.display = i===steps.length-1 ? 'inline-block' : 'none';
    updateProgress(i, steps.length);
  }

  function updateProgress(i, total){
    const pct = Math.round(((i+1)/total)*100);
    const bar = document.getElementById('formProgressBar');
    if(bar) bar.style.width = pct + '%';
  }

  document.getElementById('nextBtn')?.addEventListener('click', ()=>{
    // validate basic required fields on step
    const inputs = steps[current].querySelectorAll('input[required], textarea[required], select[required]');
    for(const inp of inputs){ if(!inp.value){ inp.focus(); return alert('Please complete required fields'); } }
    // save partial
    savePartial(form);
    if(current < steps.length-1) current++;
    show(current);
  });

  document.getElementById('prevBtn')?.addEventListener('click', ()=>{
    if(current>0) current--;
    show(current);
  });

  // load initial
  const saved = loadData();
  if(saved) populateForm(form, saved);
  show(current);
}

function populateForm(form, data){
  if(!form || !data) return;
  for(const key in data){
    const el = form.querySelector(`[name="${key}"]`);
    if(!el) continue;
    if(el.tagName==='INPUT' || el.tagName==='SELECT' || el.tagName==='TEXTAREA'){
      if(Array.isArray(data[key])) el.value = (data[key]||[]).join(', ');
      else el.value = data[key];
    }
  }
}

/* ------------------ Theme Toggle ------------------ */
function initThemeToggle(){
  const btns = document.querySelectorAll('.theme-toggle');
  const saved = localStorage.getItem('resume_theme') || 'blue';
  applyTheme(saved);
  btns.forEach(b=> b.addEventListener('click', ()=>{
    const cur = document.body.getAttribute('data-theme') || 'blue';
    const next = cur === 'blue' ? 'light' : 'blue';
    applyTheme(next);
  }));
}

function applyTheme(name){
  document.body.setAttribute('data-theme', name);
  localStorage.setItem('resume_theme', name);
  // for now we only toggle a CSS class; style variables are mainly set in style.css
  if(name === 'blue') document.body.classList.add('blue-theme');
  else document.body.classList.remove('blue-theme');
}

/* ------------------ Utility: populate form on page load ------------------ */
function loadFormIfPresent(){
  const form = document.getElementById('resumeForm');
  if(!form) return;
  const data = loadData();
  if(data) populateForm(form, data);
}

// Utilities
function nl2br(s){ return s.replace(/\n/g,'<br>'); }
function escapeHtml(s){ if(!s) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function escapeAttr(s){ return (s||'').replace(/"/g,'&quot;'); }

// PDF Export helpers
function downloadResumePDF(){
  const el = document.getElementById('resumeArea');
  if(!el) return alert('Nothing to export');
  // prefer html2pdf if present
  if(window.html2pdf){
    const opt = { margin:0.4, filename: (getNameSafe()||'resume') + '.pdf', image:{type:'jpeg',quality:0.98}, html2canvas:{scale:2}, jsPDF:{unit:'in',format:'a4',orientation:'portrait'} };
    html2pdf().set(opt).from(el).save().then(()=> showDownloadSuccess());
    return;
  }
  // fallback: print (user can save as PDF)
  showDownloadSuccess();
  window.print();
}

function downloadBiodataPDF(){
  const el = document.getElementById('biodataArea');
  if(!el) return alert('Nothing to export');
  if(window.html2pdf){
    const opt = { margin:0.4, filename: (getNameSafe()||'biodata') + '.pdf', image:{type:'jpeg',quality:0.98}, html2canvas:{scale:2}, jsPDF:{unit:'in',format:'a4',orientation:'portrait'} };
    html2pdf().set(opt).from(el).save().then(()=> showDownloadSuccess());
    return;
  }
  showDownloadSuccess();
  window.print();
}

// DOCX export using docx + FileSaver
// DOCX export removed to avoid CDN dependencies; PDF / print is supported above.

function showDownloadSuccess(){
  // small toast
  let t = document.createElement('div');
  t.className = 'download-toast';
  t.textContent = 'Download started — saved to your device.';
  Object.assign(t.style, {position:'fixed',right:'20px',bottom:'20px',background:'var(--secondary)',color:'#fff',padding:'10px 14px',borderRadius:'8px',boxShadow:'0 6px 18px rgba(15,23,42,0.12)'});
  document.body.appendChild(t);
  setTimeout(()=> t.remove(), 3500);
}

function getNameSafe(){ const data = loadData(); return data && data.name ? data.name.replace(/\s+/g,'_') : 'vaishnavi'; }

// expose functions for inline onClick usage
window.saveForm = saveForm;
window.renderResume = renderResume;
window.renderBiodata = renderBiodata;
window.downloadResumePDF = downloadResumePDF;
window.downloadBiodataPDF = downloadBiodataPDF;

// UI enhancements: ripple on buttons, page transitions, add fade-in on load
document.addEventListener('DOMContentLoaded', ()=>{
  // add fade-in to main if not already
  document.querySelectorAll('.fade-in').forEach(el=> el.classList.add('fade-in'));

  // initialize theme toggle on pages
  try{ initThemeToggle(); }catch(e){/*ignore*/}

  // initialize form stepper if form exists, else load form data if present
  try{ initFormSteps(); }catch(e){ loadFormIfPresent(); }

  // ripple effect for buttons
  document.body.addEventListener('click', function(e){
    const btn = e.target.closest('.btn');
    if(!btn) return;
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.left = (e.clientX - rect.left) + 'px';
    ripple.style.top = (e.clientY - rect.top) + 'px';
    btn.appendChild(ripple);
    setTimeout(()=> ripple.remove(), 600);
  });

  // page transition: intercept internal link clicks
  document.querySelectorAll('a[href]').forEach(a=>{
    const href = a.getAttribute('href');
    if(href && href.startsWith('http')) return; // external
    a.addEventListener('click', function(ev){
      // allow anchor on-page links
      if(href.startsWith('#')) return;
      ev.preventDefault();
      document.documentElement.style.transition = 'opacity .35s ease';
      document.documentElement.style.opacity = '0';
      setTimeout(()=> window.location.href = href, 350);
    });
  });
});
