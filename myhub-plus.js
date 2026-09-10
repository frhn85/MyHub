/* MyHub Plus - global navigation, profile, search, favorites, dashboard, achievements, PIN and media helpers */
(function(){
'use strict';
const depth = '';
const home = depth + 'index.html';
const links = [
 ['Profil','profile.html','fa-user'],['Beranda','index.html','fa-house'],['Game','game.html','fa-gamepad'],['Music','music.html','fa-music'],['Gallery','gallery.html','fa-images'],['Notes','notes.html','fa-note-sticky'],['To-Do','todo.html','fa-list-check'],['Calendar','calendar.html','fa-calendar-days'],['Prestasi & Sertifikat','certificates.html','fa-trophy'],['Finance','finance.html','fa-wallet'],['Pengaturan','settings.html','fa-gear']
];
function esc(s){return String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
function count(key){try{return JSON.parse(localStorage.getItem(key)||'[]').length}catch(e){return 0}}
function profile(){return {name:localStorage.getItem('myhubName')||'Frhn',bio:localStorage.getItem('myhubBio')||'Welcome to my personal space.',photo:localStorage.getItem('myhubProfilePhoto')||depth+'frhn12.jpeg'};}
function favs(){try{return JSON.parse(localStorage.getItem('myhubFavorites')||'[]')}catch(e){return[]}}
function saveFavs(v){localStorage.setItem('myhubFavorites',JSON.stringify(v));}
function isFav(id){return favs().includes(id)}
function toggleFav(id,el){let a=favs();a=a.includes(id)?a.filter(x=>x!==id):a.concat(id);saveFavs(a);if(el){el.classList.toggle('active',a.includes(id));el.innerHTML=a.includes(id)?'<i class="fa-solid fa-star"></i>':'<i class="fa-regular fa-star"></i>';} toast(a.includes(id)?'Ditambahkan ke Favorit ⭐':'Dihapus dari Favorit');}
function toast(msg){let t=document.getElementById('myhubToast');if(!t){t=document.createElement('div');t.id='myhubToast';document.body.appendChild(t)}t.textContent=msg;t.classList.add('show');clearTimeout(window.__myhubToast);window.__myhubToast=setTimeout(()=>t.classList.remove('show'),1800)}
function inject(){
 if(document.getElementById('myhubGlobal'))return;
 const p=profile();
 const isHome = /(^|\/)index\.html?$/.test(location.pathname) || location.pathname.endsWith('/');
 const menuItems=links.map(([n,h,i])=>`<a href="${depth+h}" data-myhub-link="${n.toLowerCase()}"><i class="fa-solid ${i}"></i><span>${n}</span></a>`).join('');
 const el=document.createElement('div');el.id='myhubGlobal';el.innerHTML=`
 <header class="myhub-topbar ${isHome?'is-home':'not-home'}">
   <a class="myhub-brand" style="min-width:0;flex:1 1 auto" href="${depth}index.html" aria-label="MyHub Home"><span class="myhub-brand-mark"><i class="fa-solid fa-cube"></i></span><strong>MyHub</strong></a>
   <div class="myhub-top-actions">
     <button class="myhub-top-btn" data-action="search" aria-label="Cari"><i class="fa-solid fa-magnifying-glass"></i></button>
     <button class="myhub-top-btn" aria-label="Notifikasi"><i class="fa-regular fa-bell"></i></button>
     ${isHome?`<button class="myhub-avatar-btn" id="myhubAvatarBtn" aria-label="Buka menu profil"><img src="${esc(p.photo)}" alt="Profil"><span class="avatar-status"></span></button>`:''}
   </div>
 </header>
 ${isHome?`<div class="myhub-overlay" id="myhubOverlay"></div>
 <aside class="myhub-drawer" id="myhubDrawer" aria-hidden="true">
  <div class="drawer-head"><a href="${depth}profile.html" class="drawer-profile"><img id="drawerPhoto" src="${esc(p.photo)}" alt="Profil"><div><strong id="drawerName">${esc(p.name)}</strong><small>@myhub</small></div></a><button id="drawerClose" aria-label="Tutup"><i class="fa-solid fa-xmark"></i></button></div>
  <div class="drawer-actions"><button data-action="dashboard"><i class="fa-solid fa-chart-pie"></i><span>Dashboard</span></button><button data-action="search"><i class="fa-solid fa-magnifying-glass"></i><span>Cari</span></button><button data-action="achievements"><i class="fa-solid fa-medal"></i><span>Achievement</span></button></div>
  <nav class="drawer-nav">${menuItems}</nav>
  <div class="drawer-bottom"><button data-action="lock"><i class="fa-solid fa-lock"></i><span>Kunci MyHub</span></button><a href="${depth}settings.html"><i class="fa-solid fa-gear"></i><span>Pengaturan</span></a></div>
 </aside>`:''}
 <div class="myhub-modal" id="myhubModal"><div class="modal-card"><button class="modal-close" data-close-modal><i class="fa-solid fa-xmark"></i></button><div id="myhubModalContent"></div></div></div>
 <div class="myhub-lock" id="myhubLock"><div class="lock-card"><div class="lock-icon"><i class="fa-solid fa-lock"></i></div><h2>MyHub Terkunci</h2><p>Masukkan PIN untuk membuka.</p><input id="unlockPin" type="password" inputmode="numeric" maxlength="4" placeholder="••••"><button id="unlockBtn">Buka MyHub</button><small id="unlockError"></small></div></div>
 <div class="myhub-toast" id="myhubToast"></div>
 <div class="mini-player" id="miniPlayer"><i class="fa-solid fa-music"></i><div><b>MyHub Music</b><small>Spotify playlist</small></div><a href="${depth}music.html" aria-label="Buka Music"><i class="fa-solid fa-play"></i></a></div>`;
 document.body.appendChild(el);
 const drawer=document.getElementById('myhubDrawer'), overlay=document.getElementById('myhubOverlay');
 const open=()=>{if(!drawer)return;drawer.classList.add('open');overlay.classList.add('show');drawer.setAttribute('aria-hidden','false')};
 const close=()=>{if(!drawer)return;drawer.classList.remove('open');overlay.classList.remove('show');drawer.setAttribute('aria-hidden','true')};
 const avatar=document.getElementById('myhubAvatarBtn');
 if(avatar)avatar.onclick=open;
 const dc=document.getElementById('drawerClose'); if(dc)dc.onclick=close;
 if(overlay)overlay.onclick=close;
 document.querySelectorAll('[data-action]').forEach(b=>b.addEventListener('click',()=>{const a=b.dataset.action;close(); if(a==='dashboard')dashboard(); if(a==='search')search(); if(a==='achievements')achievements(); if(a==='lock')lock();}));
 updateProfileUI(); setupFavorites(); setupSearchKeys(); setupGallery(); setupProfileBanner();
}
function updateProfileUI(){const p=profile();document.querySelectorAll('#drawerPhoto,.myhub-avatar-btn img').forEach(i=>i.src=p.photo);const n=document.getElementById('drawerName');if(n)n.textContent=p.name;}
function dashboard(){modal(`<div class="modal-kicker">MYHUB</div><h2>Dashboard</h2><p class="modal-sub">Ringkasan aktivitas MyHub lu.</p><div class="stats-grid"><div><b>${count('myhubNotes')}</b><span>Notes</span></div><div><b>${count('myhubTodos')}</b><span>To-Do</span></div><div><b>${count('myhubFinance')}</b><span>Transaksi</span></div><div><b>${count('myhubCertificates')}</b><span>Sertifikat</span></div><div><b>${favs().length}</b><span>Favorit</span></div><div><b>${localStorage.getItem('myhubName')?'✓':'—'}</b><span>Profil</span></div></div><div class="quick-links"><a href="${depth}todo.html">Buka To-Do <i class="fa-solid fa-arrow-right"></i></a><a href="${depth}notes.html">Buka Notes <i class="fa-solid fa-arrow-right"></i></a></div>`)}
function achievements(){const n=count('myhubNotes'),t=count('myhubTodos'),f=count('myhubFinance'),c=count('myhubCertificates'),fav=favs().length;const list=[['Profil pertama','Isi nama profil MyHub',!!localStorage.getItem('myhubName'),'fa-user'],['Penulis','Buat 1 catatan',n>=1,'fa-note-sticky'],['Produktif','Punya 5 To-Do',t>=5,'fa-list-check'],['Keuangan','Catat 3 transaksi',f>=3,'fa-wallet'],['Kolektor','Simpan 1 sertifikat',c>=1,'fa-trophy'],['Favorit','Simpan 5 item favorit',fav>=5,'fa-star']];modal(`<div class="modal-kicker">MYHUB</div><h2>Achievement</h2><p class="modal-sub">Kumpulkan pencapaian dari aktivitas lu.</p><div class="achievement-list">${list.map(x=>`<div class="achievement ${x[2]?'done':''}"><div><i class="fa-solid ${x[3]}"></i></div><span><b>${x[0]}</b><small>${x[1]}</small></span><strong>${x[2]?'✓':'🔒'}</strong></div>`).join('')}</div>`)}
function search(){modal(`<div class="modal-kicker">MYHUB</div><h2>Cari di MyHub</h2><div class="search-wrap"><i class="fa-solid fa-magnifying-glass"></i><input id="globalSearch" autofocus placeholder="Cari fitur, game, music..." autocomplete="off"></div><div id="searchResults" class="search-results">${links.map(x=>`<a href="${depth+x[1]}"><i class="fa-solid ${x[2]}"></i><span>${x[0]}</span><i class="fa-solid fa-chevron-right"></i></a>`).join('')}</div>`);const input=document.getElementById('globalSearch');input.oninput=()=>{const q=input.value.toLowerCase();document.querySelectorAll('#searchResults a').forEach(a=>a.style.display=a.textContent.toLowerCase().includes(q)?'flex':'none')};}
function modal(content){const m=document.getElementById('myhubModal');document.getElementById('myhubModalContent').innerHTML=content;m.classList.add('show')}
function closeModal(){const m=document.getElementById('myhubModal');if(m)m.classList.remove('show')}
function lock(){let pin=localStorage.getItem('myhubPin');if(!pin){const p=prompt('Buat PIN 4 digit untuk mengunci MyHub:');if(!/^\d{4}$/.test(p||'')){toast('PIN harus 4 digit');return}localStorage.setItem('myhubPin',p);toast('PIN dibuat. MyHub dikunci 🔒')}document.getElementById('myhubLock').classList.add('show');}
function setupLock(){const btn=document.getElementById('unlockBtn');const input=document.getElementById('unlockPin');if(!btn)return;const unlock=()=>{if(input.value===localStorage.getItem('myhubPin')){document.getElementById('myhubLock').classList.remove('show');input.value='';document.getElementById('unlockError').textContent='';}else document.getElementById('unlockError').textContent='PIN salah.'};btn.onclick=unlock;input.onkeydown=e=>{if(e.key==='Enter')unlock()}}
function setupFavorites(){document.querySelectorAll('.menu-card,.game-app').forEach((card,i)=>{if(card.querySelector('.myhub-fav'))return;let id=card.getAttribute('href')||card.textContent.trim()||('item'+i);const s=document.createElement('span');s.className='myhub-fav'+(isFav(id)?' active':'');s.innerHTML=isFav(id)?'<i class="fa-solid fa-star"></i>':'<i class="fa-regular fa-star"></i>';s.title='Favorit';s.onclick=e=>{e.preventDefault();e.stopPropagation();toggleFav(id,s)};card.style.position='relative';card.appendChild(s);});}
function setupSearchKeys(){document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();search()}if(e.key==='Escape'){closeModal();const d=document.getElementById('myhubDrawer');if(d)d.classList.remove('open');const o=document.getElementById('myhubOverlay');if(o)o.classList.remove('show')}})}
function setupGallery(){document.querySelectorAll('.gallery-item img').forEach(img=>{img.style.cursor='zoom-in';img.addEventListener('dblclick',()=>{const lb=document.getElementById('lightbox');if(lb){lb.classList.add('show');const li=document.getElementById('lightboxImage');if(li)li.src=img.src}})});}
function setupProfileBanner(){if(!location.pathname.endsWith('profile.html')||document.getElementById('myhubBanner'))return;const box=document.querySelector('.profile-box');if(!box)return;const b=document.createElement('div');b.id='myhubBanner';b.className='profile-banner';b.style.backgroundImage=`url("${profile().photo}")`;b.innerHTML='<div class="banner-shade"></div><label class="banner-edit"><i class="fa-solid fa-image"></i> Ganti Banner<input id="bannerInput" type="file" accept="image/*"></label>';box.parentNode.insertBefore(b,box);document.getElementById('bannerInput').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{localStorage.setItem('myhubProfileBanner',r.result);b.style.backgroundImage=`url("${r.result}")`;toast('Banner profil diperbarui ✨')};r.readAsDataURL(f)};const saved=localStorage.getItem('myhubProfileBanner');if(saved)b.style.backgroundImage=`url("${saved}")`;}
document.addEventListener('click',e=>{if(e.target.closest('[data-close-modal]'))closeModal()});
document.addEventListener('DOMContentLoaded',()=>{inject();setupLock();if(localStorage.getItem('myhubLocked')==='true'&&localStorage.getItem('myhubPin'))document.getElementById('myhubLock').classList.add('show');});
})();
