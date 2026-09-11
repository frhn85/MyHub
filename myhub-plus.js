/* MyHub Plus - global navigation, profile, search, favorites, dashboard, achievements, PIN and media helpers */
(function(){
'use strict';
const depth = '';

const ACCOUNT_STORE = 'myhubAccounts';
const SESSION_STORE = 'myhubCurrentAccount';
const ACCOUNT_DATA_KEYS = ['myhubName','myhubBio','myhubProfilePhoto','myhubProfileBanner','myhubFavorites','myhubNotes','myhubTodos','myhubFinance','myhubCertificates','myhubAccent','myhubAnimation','myhubDarkMode','myhubNotifications','myhubPin','myhubLocked'];
function accountKey(key){const account=localStorage.getItem(SESSION_STORE);return account?'myhub:'+account+':'+key:key;}
function getAccounts(){try{return JSON.parse(localStorage.getItem(ACCOUNT_STORE)||'{}')}catch(e){return{}}}
function saveAccounts(a){localStorage.setItem(ACCOUNT_STORE,JSON.stringify(a))}
function currentAccount(){return localStorage.getItem(SESSION_STORE)||''}
function accountDisplay(){const a=currentAccount(),all=getAccounts();return all[a]||a||'Pengguna'}
function defaultContent(){return {
 games:[
  {name:'Free Fire',url:'https://play.google.com/store/apps/details?id=com.dts.freefireth',scheme:'freefire://',package:'com.dts.freefireth',icon:'https://play-lh.googleusercontent.com/JT88XmsHoGDio7FxONwh382DhuTxuccfMmWFDtRBFjilySzNqWOCxUhqm8IhBKzQSwVrW2HWp_XvSgKFwi3ETA%3Dw240-h480'},
  {name:'Mobile Legends',url:'https://play.google.com/store/apps/details?id=com.mobile.legends',scheme:'mobilelegends://',package:'com.mobile.legends',icon:'https://play-lh.googleusercontent.com/MztmLpB1-_eFbHnqNzzvzl5zjiOH2BEb0D71uBxZYf_4BEmW3QEPWODhRtyqY7Qz4wRLwQ--Rg1RAjOFqtHSs-o%3Dw240-h480'},
  {name:'Magic Chess',url:'https://play.google.com/store/apps/details?id=com.mobilechess.gp',scheme:'magicchess://',package:'com.mobilechess.gp',icon:'https://play-lh.googleusercontent.com/uCoc4iwT9cUgSVK47Zvnbyu10JDudzNnNkky-9Suz5tU9cGKat4A23YfohUXzJh-wnlz0VWI-G58XHBFM2OBdA%3Dw240-h480'},
  {name:'Block Blast',url:'https://play.google.com/store/apps/details?id=com.block.juggle',scheme:'blockblast://',package:'com.block.juggle',icon:'https://play-lh.googleusercontent.com/5FLR-EBlfNvoV9ydZkOMDqRF10nV64XcKdZzW_oQzmz2e8Me9PS5Zncnvviki0J3XumjO2a_lg6_IdwOqwnV%3Dw240-h480'}
 ],
 gallery:['frhn1.jpeg','frhn2.jpeg','frhn3.jpeg','frhn4.jpeg','frhn5.jpeg','frhn6.jpeg','frhn7.jpeg','frhn8.jpeg','frhn9.jpeg','frhn10.jpeg','frhn11.jpeg','frhn12.jpeg'],
 music:['3rPtS4nfpy7PsARctAWpzd','48BWWtyjFE2le9sIqJitoL','3AAAGS7iM1ekDywqdYMJG2','5gkTGkjFB5wAd3mSBEcQPY']
}}
function contentKey(type){return accountKey('myhub:'+type)}
function getContent(type){try{const raw=localStorage.getItem(contentKey(type));return raw?JSON.parse(raw):null}catch(e){return null}}
function saveContent(type,val){localStorage.setItem(contentKey(type),JSON.stringify(val))}
function ensureAccountContent(){if(!currentAccount())return;const d=defaultContent();if(!getContent('games'))saveContent('games',d.games);if(!getContent('gallery'))saveContent('gallery',d.gallery);if(!getContent('music'))saveContent('music',d.music)}
function spotifyId(v){const m=String(v||'').match(/track\/([A-Za-z0-9]+)/);return m?m[1]:String(v||'').trim()}
function safeAccountId(name){return String(name||'').trim().toLowerCase().replace(/[^a-z0-9_-]+/g,'-').replace(/^-+|-+$/g,'').slice(0,32)}
function migrateLegacyData(account){ACCOUNT_DATA_KEYS.forEach(k=>{const old=localStorage.getItem(k);if(old!==null&&localStorage.getItem('myhub:'+account+':'+k)===null)localStorage.setItem('myhub:'+account+':'+k,old);});}
function setSession(account){localStorage.setItem(SESSION_STORE,account)}
function clearSession(){localStorage.removeItem(SESSION_STORE)}
function accountGate(){
 if(document.getElementById('myhubAccountGate'))return;
 document.body.classList.add('myhub-account-locked');
 const accounts=getAccounts(),names=Object.keys(accounts),hasAccounts=names.length>0;
 const el=document.createElement('div');el.id='myhubAccountGate';el.className='myhub-account-gate';
 el.innerHTML=`<div class="account-card"><div class="account-logo"><i class="fa-solid fa-cube"></i></div><div class="account-kicker">MYHUB</div><h1>Masuk ke MyHub</h1><p class="account-sub">Pilih akun untuk membuka data MyHub lu.</p><div class="account-existing">${hasAccounts?names.map(n=>`<button class="account-choice" data-account="${esc(n)}"><span class="account-choice-avatar">${esc((accounts[n]||n).slice(0,1).toUpperCase())}</span><span><b>${esc(accounts[n]||n)}</b><small>@${esc(n)}</small></span><i class="fa-solid fa-chevron-right"></i></button>`).join(''):''}</div><form id="accountForm" class="account-form"><label>${hasAccounts?'Nama akun baru':'Nama akun'}<input id="accountNameInput" autocomplete="username" maxlength="24" placeholder="Contoh: Frhn" required></label><label>Password <span class="account-optional">opsional</span><input id="accountPasswordInput" type="password" autocomplete="new-password" maxlength="40" placeholder="Boleh dikosongkan"></label><button type="submit" class="account-primary"><i class="fa-solid fa-right-to-bracket"></i>${hasAccounts?'Tambah & Masuk':'Buat Akun & Masuk'}</button></form><p class="account-note">Akun tersimpan di perangkat/browser ini. Ini bukan login server online.</p></div>`;
 document.body.appendChild(el);
 el.querySelector('#accountForm').addEventListener('submit',e=>{e.preventDefault();const raw=el.querySelector('#accountNameInput').value.trim(),id=safeAccountId(raw),pass=el.querySelector('#accountPasswordInput').value;if(id.length<2){alert('Nama akun minimal 2 karakter.');return}const all=getAccounts();if(all[id]){alert('Nama akun itu sudah ada.');return}const first=Object.keys(all).length===0;all[id]=raw;saveAccounts(all);if(first)migrateLegacyData(id);if(!localStorage.getItem('myhub:'+id+':myhubName'))localStorage.setItem('myhub:'+id+':myhubName',raw);if(pass)localStorage.setItem('myhub:'+id+':myhubAccountPassword',pass);setSession(id);location.reload();});
 el.querySelectorAll('.account-choice').forEach(btn=>btn.addEventListener('click',()=>{const id=btn.dataset.account,saved=localStorage.getItem('myhub:'+id+':myhubAccountPassword')||'';if(saved){const p=prompt('Masukkan password akun '+(accounts[id]||id)+':');if(p!==saved)return}setSession(id);location.reload();}));
}
function accountMenu(){const all=getAccounts(),names=Object.keys(all),cur=currentAccount();modal(`<div class="modal-kicker">AKUN</div><h2>Kelola Akun</h2><p class="modal-sub">Akun aktif: <b>${esc(accountDisplay())}</b></p><div class="account-modal-list">${names.map(n=>`<button class="account-modal-item ${n===cur?'active':''}" data-switch-account="${esc(n)}"><span>${esc((all[n]||n).slice(0,1).toUpperCase())}</span><b>${esc(all[n]||n)}</b><small>${n===cur?'Sedang digunakan':'Ganti akun'}</small><i class="fa-solid fa-chevron-right"></i></button>`).join('')}</div><div class="account-modal-actions"><button data-account-logout><i class="fa-solid fa-right-from-bracket"></i> Keluar dari akun</button></div>`);document.querySelectorAll('[data-switch-account]').forEach(b=>b.onclick=()=>{const id=b.dataset.switchAccount;if(id===cur){closeModal();return}const saved=localStorage.getItem('myhub:'+id+':myhubAccountPassword')||'';if(saved){const p=prompt('Masukkan password akun '+(all[id]||id)+':');if(p!==saved)return}setSession(id);location.reload()});const out=document.querySelector('[data-account-logout]');if(out)out.onclick=()=>{clearSession();location.reload()}}
function injectAccountSettings(){const box=document.querySelector('.settings-box');if(!box||document.getElementById('myhubAccountSettings'))return;const sec=document.createElement('section');sec.id='myhubAccountSettings';sec.className='myhub-account-settings';sec.innerHTML=`<div class="section-title"><p>ACCOUNT</p><h2>Akun MyHub</h2></div><div class="account-setting-card"><div class="account-setting-avatar">${esc(accountDisplay().slice(0,1).toUpperCase())}</div><div class="account-setting-info"><b>${esc(accountDisplay())}</b><small>@${esc(currentAccount())}</small></div><div class="account-setting-buttons"><button id="customizeMyHub"><i class="fa-solid fa-sliders"></i> Atur Isi</button><button id="manageMyHubAccount"><i class="fa-solid fa-users"></i> Kelola</button></div></div>`;box.parentNode.insertBefore(sec,box);document.getElementById('manageMyHubAccount').onclick=accountMenu;document.getElementById('customizeMyHub').onclick=accountCustomizer}

const home = depth + 'index.html';
const links = [
 ['Profil','profile.html','fa-user'],['Beranda','index.html','fa-house'],['Game','game.html','fa-gamepad'],['Music','music.html','fa-music'],['Gallery','gallery.html','fa-images'],['Notes','notes.html','fa-note-sticky'],['To-Do','todo.html','fa-list-check'],['Calendar','calendar.html','fa-calendar-days'],['Prestasi & Sertifikat','certificates.html','fa-trophy'],['Finance','finance.html','fa-wallet'],['Pengaturan','settings.html','fa-gear']
];
function esc(s){return String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
function count(key){try{return JSON.parse(localStorage.getItem(accountKey(key))||'[]').length}catch(e){return 0}}
function profile(){return {name:localStorage.getItem(accountKey('myhubName'))||'Frhn',bio:localStorage.getItem(accountKey('myhubBio'))||'Welcome to my personal space.',photo:localStorage.getItem(accountKey('myhubProfilePhoto'))||depth+'frhn12.jpeg'};}
function favs(){try{return JSON.parse(localStorage.getItem(accountKey('myhubFavorites'))||'[]')}catch(e){return[]}}
function saveFavs(v){localStorage.setItem(accountKey('myhubFavorites'),JSON.stringify(v));}
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
function dashboard(){modal(`<div class="modal-kicker">MYHUB</div><h2>Dashboard</h2><p class="modal-sub">Ringkasan aktivitas MyHub lu.</p><div class="stats-grid"><div><b>${count('myhubNotes')}</b><span>Notes</span></div><div><b>${count('myhubTodos')}</b><span>To-Do</span></div><div><b>${count('myhubFinance')}</b><span>Transaksi</span></div><div><b>${count('myhubCertificates')}</b><span>Sertifikat</span></div><div><b>${favs().length}</b><span>Favorit</span></div><div><b>${localStorage.getItem(accountKey('myhubName'))?'✓':'—'}</b><span>Profil</span></div></div><div class="quick-links"><a href="${depth}todo.html">Buka To-Do <i class="fa-solid fa-arrow-right"></i></a><a href="${depth}notes.html">Buka Notes <i class="fa-solid fa-arrow-right"></i></a></div>`)}
function achievements(){const n=count('myhubNotes'),t=count('myhubTodos'),f=count('myhubFinance'),c=count('myhubCertificates'),fav=favs().length;const list=[['Profil pertama','Isi nama profil MyHub',!!localStorage.getItem(accountKey('myhubName')),'fa-user'],['Penulis','Buat 1 catatan',n>=1,'fa-note-sticky'],['Produktif','Punya 5 To-Do',t>=5,'fa-list-check'],['Keuangan','Catat 3 transaksi',f>=3,'fa-wallet'],['Kolektor','Simpan 1 sertifikat',c>=1,'fa-trophy'],['Favorit','Simpan 5 item favorit',fav>=5,'fa-star']];modal(`<div class="modal-kicker">MYHUB</div><h2>Achievement</h2><p class="modal-sub">Kumpulkan pencapaian dari aktivitas lu.</p><div class="achievement-list">${list.map(x=>`<div class="achievement ${x[2]?'done':''}"><div><i class="fa-solid ${x[3]}"></i></div><span><b>${x[0]}</b><small>${x[1]}</small></span><strong>${x[2]?'✓':'🔒'}</strong></div>`).join('')}</div>`)}
function search(){modal(`<div class="modal-kicker">MYHUB</div><h2>Cari di MyHub</h2><div class="search-wrap"><i class="fa-solid fa-magnifying-glass"></i><input id="globalSearch" autofocus placeholder="Cari fitur, game, music..." autocomplete="off"></div><div id="searchResults" class="search-results">${links.map(x=>`<a href="${depth+x[1]}"><i class="fa-solid ${x[2]}"></i><span>${x[0]}</span><i class="fa-solid fa-chevron-right"></i></a>`).join('')}</div>`);const input=document.getElementById('globalSearch');input.oninput=()=>{const q=input.value.toLowerCase();document.querySelectorAll('#searchResults a').forEach(a=>a.style.display=a.textContent.toLowerCase().includes(q)?'flex':'none')};}
function modal(content){const m=document.getElementById('myhubModal');document.getElementById('myhubModalContent').innerHTML=content;m.classList.add('show')}
function closeModal(){const m=document.getElementById('myhubModal');if(m)m.classList.remove('show')}
function lock(){let pin=localStorage.getItem(accountKey('myhubPin'));if(!pin){const p=prompt('Buat PIN 4 digit untuk mengunci MyHub:');if(!/^\d{4}$/.test(p||'')){toast('PIN harus 4 digit');return}localStorage.setItem(accountKey('myhubPin'),p);toast('PIN dibuat. MyHub dikunci 🔒')}document.getElementById('myhubLock').classList.add('show');}
function setupLock(){const btn=document.getElementById('unlockBtn');const input=document.getElementById('unlockPin');if(!btn)return;const unlock=()=>{if(input.value===localStorage.getItem(accountKey('myhubPin'))){document.getElementById('myhubLock').classList.remove('show');input.value='';document.getElementById('unlockError').textContent='';}else document.getElementById('unlockError').textContent='PIN salah.'};btn.onclick=unlock;input.onkeydown=e=>{if(e.key==='Enter')unlock()}}
function setupFavorites(){document.querySelectorAll('.menu-card,.game-app').forEach((card,i)=>{if(card.querySelector('.myhub-fav'))return;let id=card.getAttribute('href')||card.textContent.trim()||('item'+i);const s=document.createElement('span');s.className='myhub-fav'+(isFav(id)?' active':'');s.innerHTML=isFav(id)?'<i class="fa-solid fa-star"></i>':'<i class="fa-regular fa-star"></i>';s.title='Favorit';s.onclick=e=>{e.preventDefault();e.stopPropagation();toggleFav(id,s)};card.style.position='relative';card.appendChild(s);});}
function setupSearchKeys(){document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();search()}if(e.key==='Escape'){closeModal();const d=document.getElementById('myhubDrawer');if(d)d.classList.remove('open');const o=document.getElementById('myhubOverlay');if(o)o.classList.remove('show')}})}
function setupGallery(){document.querySelectorAll('.gallery-item img').forEach(img=>{img.style.cursor='zoom-in';img.addEventListener('dblclick',()=>{const lb=document.getElementById('lightbox');if(lb){lb.classList.add('show');const li=document.getElementById('lightboxImage');if(li)li.src=img.src}})});}
function renderAccountContent(){
 const page=location.pathname.split('/').pop()||'index.html';
 ensureAccountContent();
 if(page==='game.html'){
  const grid=document.querySelector('.game-grid'); if(!grid)return;
  const games=getContent('games')||[];
  grid.innerHTML=games.map((g,i)=>`<a href="${esc(g.url||'#')}" class="game-app" data-game-scheme="${esc(g.scheme||'')}" data-game-package="${esc(g.package||'')}" data-custom-game="${i}"><div class="game-icon"><img src="${esc(g.icon||'')}" alt="Ikon ${esc(g.name)}"></div><h3>${esc(g.name)}</h3></a>`).join('') || '<p class="myhub-empty">Belum ada game. Tambahkan dari Pengaturan.</p>';
  grid.querySelectorAll('.game-app').forEach(card=>card.addEventListener('click',e=>{const scheme=card.dataset.gameScheme,pkg=card.dataset.gamePackage,fallback=card.getAttribute('href');if(!scheme&&!pkg)return; e.preventDefault(); let done=false; const fb=()=>{if(!done){done=true;location.href=fallback}}; document.addEventListener('visibilitychange',()=>{if(document.hidden)done=true},{once:true}); if(/Android/i.test(navigator.userAgent)&&pkg)location.href='intent://launch#Intent;scheme='+scheme.replace('://','')+';package='+pkg+';end';else if(scheme)location.href=scheme;else fb();setTimeout(()=>{if(!document.hidden&&!done)fb()},1200)}));
 }
 if(page==='gallery.html'){
  const grid=document.querySelector('.gallery-grid'); if(!grid)return; const imgs=getContent('gallery')||[];
  grid.innerHTML=imgs.map((src,i)=>`<div class="gallery-item"><img src="${esc(src)}" alt="Foto ${i+1}"></div>`).join('') || '<p class="myhub-empty">Belum ada foto. Tambahkan dari Pengaturan.</p>';
  const lb=document.getElementById('lightbox'),li=document.getElementById('lightboxImage'); if(lb&&li)grid.querySelectorAll('img').forEach(im=>im.addEventListener('click',()=>{li.src=im.src;lb.classList.add('show')}));
 }
 if(page==='music.html'){
  const sec=document.querySelector('.music-section'); if(!sec)return; const ids=getContent('music')||[];
  const title=sec.querySelector('.section-title')?.outerHTML||'<div class="section-title"><p>MY PLAYLIST</p><h2>Playlist Favorit</h2></div>';
  sec.innerHTML=title+(ids.length?ids.map(id=>`<div class="spotify-box"><iframe src="https://open.spotify.com/embed/track/${esc(spotifyId(id))}" width="100%" height="152" frameborder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe></div>`).join(''):'<p class="myhub-empty">Belum ada lagu. Tambahkan dari Pengaturan.</p>');
 }
}
function accountCustomizer(){
 ensureAccountContent();
 const games=getContent('games')||[], gallery=getContent('gallery')||[], music=getContent('music')||[];
 modal(`<div class="modal-kicker">PERSONALISASI</div><h2>Atur Isi Akun</h2><p class="modal-sub">Setiap akun punya isi sendiri. Perubahan hanya berlaku untuk akun <b>${esc(accountDisplay())}</b>.</p>
 <div class="custom-tabs"><button class="active" data-tab="games">Game</button><button data-tab="gallery">Gallery</button><button data-tab="music">Music</button></div>
 <div class="custom-panel" data-panel="games"><div class="custom-list">${games.map((g,i)=>`<div class="custom-row"><span class="custom-thumb">${g.icon?`<img src="${esc(g.icon)}" alt="">`:''}</span><div><b>${esc(g.name)}</b><small>${esc(g.url||'')}</small></div><button data-del-game="${i}" aria-label="Hapus"><i class="fa-solid fa-trash"></i></button></div>`).join('')}</div><form id="addGameForm" class="custom-form"><input name="name" placeholder="Nama game" maxlength="30" required><input name="url" placeholder="Link game / Play Store" required><input name="icon" placeholder="Link ikon (opsional)"><button>Tambah Game</button></form></div>
 <div class="custom-panel" data-panel="gallery" hidden><div class="custom-list">${gallery.map((src,i)=>`<div class="custom-row"><span class="custom-thumb"><img src="${esc(src)}" alt=""></span><div><b>Foto ${i+1}</b><small>Foto akun ini</small></div><button data-del-gallery="${i}" aria-label="Hapus"><i class="fa-solid fa-trash"></i></button></div>`).join('')}</div><label class="upload-custom">Tambah foto dari perangkat<input id="customGalleryInput" type="file" accept="image/*" multiple></label></div>
 <div class="custom-panel" data-panel="music" hidden><div class="custom-list">${music.map((id,i)=>`<div class="custom-row"><span class="custom-thumb"><i class="fa-solid fa-music"></i></span><div><b>Lagu ${i+1}</b><small>${esc(id)}</small></div><button data-del-music="${i}" aria-label="Hapus"><i class="fa-solid fa-trash"></i></button></div>`).join('')}</div><form id="addMusicForm" class="custom-form"><input name="link" placeholder="Link Spotify / ID track" required><button>Tambah Lagu</button></form></div>`);
 document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-tab]').forEach(x=>x.classList.toggle('active',x===b));document.querySelectorAll('[data-panel]').forEach(x=>x.hidden=x.dataset.panel!==b.dataset.tab)});
 document.querySelectorAll('[data-del-game]').forEach(b=>b.onclick=()=>{let a=getContent('games')||[];a.splice(+b.dataset.delGame,1);saveContent('games',a);accountCustomizer()});
 document.querySelectorAll('[data-del-gallery]').forEach(b=>b.onclick=()=>{let a=getContent('gallery')||[];a.splice(+b.dataset.delGallery,1);saveContent('gallery',a);accountCustomizer()});
 document.querySelectorAll('[data-del-music]').forEach(b=>b.onclick=()=>{let a=getContent('music')||[];a.splice(+b.dataset.delMusic,1);saveContent('music',a);accountCustomizer()});
 const gf=document.getElementById('addGameForm'); if(gf)gf.onsubmit=e=>{e.preventDefault();const f=new FormData(gf),a=getContent('games')||[];a.push({name:f.get('name').trim(),url:f.get('url').trim(),icon:f.get('icon').trim(),scheme:'',package:''});saveContent('games',a);accountCustomizer()};
 const mf=document.getElementById('addMusicForm'); if(mf)mf.onsubmit=e=>{e.preventDefault();const f=new FormData(mf),id=spotifyId(f.get('link'));if(!id){toast('Link Spotify tidak valid');return}const a=getContent('music')||[];a.push(id);saveContent('music',a);accountCustomizer()};
 const gi=document.getElementById('customGalleryInput'); if(gi)gi.onchange=()=>{const files=[...gi.files];if(!files.length)return;const a=getContent('gallery')||[];let done=0;files.forEach(file=>{const r=new FileReader();r.onload=()=>{a.push(r.result);done++;if(done===files.length){saveContent('gallery',a);accountCustomizer()}};r.readAsDataURL(file)})};
}
function setupProfileBanner(){if(!location.pathname.endsWith('profile.html')||document.getElementById('myhubBanner'))return;const box=document.querySelector('.profile-box');if(!box)return;const b=document.createElement('div');b.id='myhubBanner';b.className='profile-banner';b.style.backgroundImage=`url("${profile().photo}")`;b.innerHTML='<div class="banner-shade"></div><label class="banner-edit"><i class="fa-solid fa-image"></i> Ganti Banner<input id="bannerInput" type="file" accept="image/*"></label>';box.parentNode.insertBefore(b,box);document.getElementById('bannerInput').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{localStorage.setItem(accountKey('myhubProfileBanner'),r.result);b.style.backgroundImage=`url("${r.result}")`;toast('Banner profil diperbarui ✨')};r.readAsDataURL(f)};const saved=localStorage.getItem(accountKey('myhubProfileBanner'));if(saved)b.style.backgroundImage=`url("${saved}")`;}
document.addEventListener('click',e=>{if(e.target.closest('[data-close-modal]'))closeModal()});
document.addEventListener('DOMContentLoaded',()=>{if(!currentAccount()){accountGate();return}ensureAccountContent();inject();setupLock();injectAccountSettings();renderAccountContent();if(localStorage.getItem(accountKey('myhubLocked'))==='true'&&localStorage.getItem(accountKey('myhubPin')))document.getElementById('myhubLock').classList.add('show');});
})();
