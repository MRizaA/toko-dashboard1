/* ============================================================
   Berkah Store — Admin Dashboard (demo project)
   Data dummy disimpan di localStorage (seed sekali di kunjungan pertama),
   semua CRUD (tambah/edit/hapus) beneran mengubah data & recalculate.
   ============================================================ */
(function(){
  'use strict';

  const LS_PRODUCTS = 'berkah_products_v1';
  const LS_TX = 'berkah_transactions_v1';

  /* ---------- seed data ---------- */
  const SEED_PRODUCTS = [
    { id:'p1', name:'Speaker Bluetooth Mini', category:'Elektronik', price:145000, stock:8 },
    { id:'p2', name:'Earphone Wireless X1', category:'Elektronik', price:189000, stock:3 },
    { id:'p3', name:'Powerbank 10000mAh', category:'Elektronik', price:165000, stock:0 },
    { id:'p4', name:'Kabel Data USB-C', category:'Aksesoris', price:25000, stock:40 },
    { id:'p5', name:'Case HP Universal', category:'Aksesoris', price:35000, stock:22 },
    { id:'p6', name:'Tumbler Stainless 500ml', category:'Rumah Tangga', price:55000, stock:15 },
    { id:'p7', name:'Rak Organizer Meja', category:'Rumah Tangga', price:89000, stock:2 },
    { id:'p8', name:'Lampu Meja LED', category:'Rumah Tangga', price:120000, stock:6 },
    { id:'p9', name:'Mouse Wireless', category:'Elektronik', price:95000, stock:12 },
    { id:'p10', name:'Keyboard Mini Bluetooth', category:'Elektronik', price:210000, stock:4 },
    { id:'p11', name:'Tas Selempang Kanvas', category:'Aksesoris', price:78000, stock:9 },
    { id:'p12', name:'Botol Minum Sport', category:'Rumah Tangga', price:42000, stock:0 }
  ];

  function tx(id,date,customer,productId,qty,status){
    const p = SEED_PRODUCTS.find(x=>x.id===productId);
    return { id, date, customer, productId, productName:p.name, unitPrice:p.price, qty, total:p.price*qty, status };
  }

  const SEED_TX = [
    tx('t1','2026-02-03','Dedi Kurniawan','p1',2,'Lunas'),
    tx('t2','2026-02-10','Siti Amalia','p4',3,'Lunas'),
    tx('t3','2026-02-18','Budi Santoso','p9',1,'Lunas'),
    tx('t4','2026-03-02','Rina Wijaya','p2',1,'Lunas'),
    tx('t5','2026-03-09','Agus Salim','p6',2,'Pending'),
    tx('t6','2026-03-20','Maya Putri','p5',4,'Lunas'),
    tx('t7','2026-04-01','Fajar Nugroho','p10',1,'Lunas'),
    tx('t8','2026-04-11','Dewi Lestari','p7',1,'Dibatalkan'),
    tx('t9','2026-04-19','Hendra Gunawan','p1',1,'Lunas'),
    tx('t10','2026-05-05','Nadia Putri','p11',2,'Lunas'),
    tx('t11','2026-05-14','Yusuf Hakim','p8',1,'Lunas'),
    tx('t12','2026-05-22','Lina Marlina','p4',5,'Lunas'),
    tx('t13','2026-06-03','Rizky Ramadhan','p9',2,'Pending'),
    tx('t14','2026-06-15','Citra Ayu','p2',1,'Lunas'),
    tx('t15','2026-06-25','Doni Prasetyo','p6',3,'Lunas'),
    tx('t16','2026-07-05','Wulan Sari','p10',1,'Lunas'),
    tx('t17','2026-07-14','Eka Saputra','p5',2,'Lunas'),
    tx('t18','2026-07-20','Fitri Handayani','p1',1,'Lunas')
  ];

  /* ---------- storage ---------- */
  function loadProducts(){
    const raw = localStorage.getItem(LS_PRODUCTS);
    if (raw){ try{ return JSON.parse(raw); }catch(e){} }
    localStorage.setItem(LS_PRODUCTS, JSON.stringify(SEED_PRODUCTS));
    return JSON.parse(JSON.stringify(SEED_PRODUCTS));
  }
  function loadTx(){
    const raw = localStorage.getItem(LS_TX);
    if (raw){ try{ return JSON.parse(raw); }catch(e){} }
    localStorage.setItem(LS_TX, JSON.stringify(SEED_TX));
    return JSON.parse(JSON.stringify(SEED_TX));
  }
  let products = loadProducts();
  let transactions = loadTx();
  function saveProducts(){ localStorage.setItem(LS_PRODUCTS, JSON.stringify(products)); }
  function saveTx(){ localStorage.setItem(LS_TX, JSON.stringify(transactions)); }

  function resetDemo(){
    if (!confirm('Kembalikan semua data ke kondisi awal (data yang kamu tambah/ubah akan hilang)?')) return;
    localStorage.removeItem(LS_PRODUCTS);
    localStorage.removeItem(LS_TX);
    location.reload();
  }

  function uid(prefix){ return prefix + Date.now().toString(36) + Math.floor(Math.random()*1000); }
  function formatIDR(n){ return 'Rp ' + Number(n||0).toLocaleString('id-ID'); }
  function formatDate(iso){
    const d = new Date(iso+'T00:00:00');
    return d.toLocaleDateString('id-ID',{ day:'numeric', month:'short', year:'numeric' });
  }
  function shortIDR(n){
    if (n >= 1000000) return (n % 1000000 === 0 ? (n/1000000) : (n/1000000).toFixed(1)) + 'jt';
    if (n >= 1000) return Math.round(n/1000) + 'rb';
    return String(n);
  }
  function stockStatus(stock){
    if (stock <= 0) return { label:'Habis', cls:'badge--red' };
    if (stock < 5) return { label:'Menipis', cls:'badge--amber' };
    return { label:'Aman', cls:'badge--green' };
  }
  function txStatusBadge(status){
    if (status === 'Lunas') return 'badge--green';
    if (status === 'Pending') return 'badge--amber';
    return 'badge--red';
  }

  /* ---------- toast ---------- */
  let toastTimer = null;
  function showToast(message){
    const toast = document.getElementById('toast');
    toast.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg><span>'+message+'</span>';
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(()=>toast.classList.remove('is-visible'), 2600);
  }

  /* ============================================================
     DASHBOARD
     ============================================================ */
  function renderDashboard(){
    const paidTx = transactions.filter(t=>t.status==='Lunas');
    const totalRevenue = paidTx.reduce((s,t)=>s+t.total,0);
    const totalOrders = transactions.length;
    const unitsSold = paidTx.reduce((s,t)=>s+t.qty,0);
    const lowStock = products.filter(p=>p.stock < 5);

    document.getElementById('kpiRevenue').textContent = formatIDR(totalRevenue);
    document.getElementById('kpiOrders').textContent = totalOrders;
    document.getElementById('kpiUnits').textContent = unitsSold + ' unit';
    renderStockCard(lowStock.length);

    renderRevenueChart(paidTx);
    renderTopProducts(paidTx);
    renderLowStockList(lowStock);
    renderRecentTx();
  }

  function renderStockCard(count){
    const card = document.getElementById('kpiStockCard');
    if (count > 1){
      card.innerHTML =
        '<p class="kpi-card__label">Stok Menipis</p>'+
        '<div style="display: flex;"> <p class="kpi-card__value">'+count+'</p> <span class="kpi-card__icon kpi-card__icon--warn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/></svg></span></div>';
    } else {
      card.innerHTML =
        '<p class="kpi-card__label">Stok</p>'+
        '<span class="kpi-card__icon kpi-card__icon--ok"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span>>';
    }
  }

  function last6Months(){
    const out = [];
    const now = new Date();
    for (let i=5;i>=0;i--){
      const d = new Date(now.getFullYear(), now.getMonth()-i, 1);
      out.push({ key: d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0'), label: d.toLocaleDateString('id-ID',{month:'short'}) });
    }
    return out;
  }

  function renderRevenueChart(paidTx){
    const months = last6Months();
    const totals = months.map(m => paidTx
      .filter(t => t.date.slice(0,7) === m.key)
      .reduce((s,t)=>s+t.total,0));
    const max = Math.max.apply(null, totals.concat([1]));

    const w = 620, h = 170, padTop = 22, padBottom = 26, padSide = 14;
    const usableH = h - padTop - padBottom;
    const usableW = w - padSide*2;
    const n = totals.length;
    const stepX = n > 1 ? usableW/(n-1) : 0;

    const points = totals.map((val,i)=>{
      const x = padSide + i*stepX;
      const y = padTop + usableH - (val/max)*usableH;
      return { x:x, y:y, val:val };
    });

    let grid = '';
    [0, 0.33, 0.66, 1].forEach(f=>{
      const y = padTop + usableH*(1-f);
      grid += '<line x1="'+padSide+'" y1="'+y+'" x2="'+(w-padSide)+'" y2="'+y+'" stroke="#E3E6EB" stroke-width="1"/>';
    });

    const linePath = points.map((p,i)=> (i===0?'M':'L')+p.x.toFixed(1)+' '+p.y.toFixed(1)).join(' ');
    const baseline = (padTop+usableH).toFixed(1);
    const areaPath = linePath+' L'+points[points.length-1].x.toFixed(1)+' '+baseline+' L'+points[0].x.toFixed(1)+' '+baseline+' Z';

    let dots = '', labels = '';
    points.forEach((p,i)=>{
      dots += '<circle cx="'+p.x+'" cy="'+p.y+'" r="4" fill="#2455D6" stroke="#fff" stroke-width="2"><title>'+months[i].label+': '+formatIDR(p.val)+'</title></circle>';
      if (p.val > 0) dots += '<text x="'+p.x+'" y="'+(p.y-11)+'" text-anchor="middle" font-size="11" font-weight="800" fill="#0B1830" font-family="Manrope,sans-serif">'+shortIDR(p.val)+'</text>';
      labels += '<text x="'+p.x+'" y="'+(h-9)+'" text-anchor="middle" font-size="11" fill="#8991A0" font-family="Manrope,sans-serif">'+months[i].label+'</text>';
    });

    document.getElementById('revenueChart').innerHTML =
      '<svg viewBox="0 0 '+w+' '+h+'" style="width:100%;height:100%;">'+
        '<defs><linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">'+
          '<stop offset="0%" stop-color="#2455D6" stop-opacity="0.22"/>'+
          '<stop offset="100%" stop-color="#2455D6" stop-opacity="0"/>'+
        '</linearGradient></defs>'+
        grid+
        '<path d="'+areaPath+'" fill="url(#revGrad)"/>'+
        '<path d="'+linePath+'" fill="none" stroke="#2455D6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>'+
        dots+labels+
      '</svg>';
  }

  function renderTopProducts(paidTx){
    const soldMap = {};
    paidTx.forEach(t=>{ soldMap[t.productId] = (soldMap[t.productId]||0) + t.qty; });
    const ranked = Object.keys(soldMap).map(id=>{
      const p = products.find(x=>x.id===id);
      return { name: p ? p.name : '(dihapus)', qty: soldMap[id] };
    }).sort((a,b)=>b.qty-a.qty).slice(0,5);

    const el = document.getElementById('topProductsList');
    if (ranked.length === 0){ el.innerHTML = '<p class="empty-hint">Belum ada transaksi lunas.</p>'; return; }
    el.innerHTML = ranked.map((r,i)=>
      '<div class="mini-row"><span class="mini-row__rank">'+(i+1)+'</span>'+
      '<span class="mini-row__name">'+r.name+'</span>'+
      '<span class="mini-row__value">'+r.qty+' unit</span></div>'
    ).join('');
  }

  function renderLowStockList(lowStock){
    const el = document.getElementById('lowStockList');
    if (lowStock.length === 0){ el.innerHTML = '<p class="empty-hint">Semua stok dalam kondisi aman 👍</p>'; return; }
    el.innerHTML = lowStock.slice(0,6).map(p=>{
      const st = stockStatus(p.stock);
      return '<div class="mini-row mini-row--alert"><span class="mini-row__rank">!</span>'+
        '<span class="mini-row__name">'+p.name+'<span class="mini-row__sub"> · '+p.category+'</span></span>'+
        '<span class="badge '+st.cls+'">'+p.stock+' pcs</span></div>';
    }).join('');
  }

  function renderRecentTx(){
    const el = document.getElementById('recentTxBody');
    const recent = [...transactions].sort((a,b)=> b.date.localeCompare(a.date)).slice(0,5);
    if (recent.length === 0){ el.innerHTML = '<tr><td colspan="5" class="empty-hint">Belum ada transaksi.</td></tr>'; return; }
    el.innerHTML = recent.map(t=>
      '<tr><td>'+formatDate(t.date)+'</td><td class="cell-strong">'+t.customer+'</td>'+
      '<td>'+t.productName+' <span class="cell-sub">× '+t.qty+'</span></td>'+
      '<td class="cell-strong">'+formatIDR(t.total)+'</td>'+
      '<td><span class="badge '+txStatusBadge(t.status)+'">'+t.status+'</span></td></tr>'
    ).join('');
  }

  /* ============================================================
     PRODUK
     ============================================================ */
  let produkSearch = '';

  function renderProduk(){
    const el = document.getElementById('produkBody');
    const filtered = products.filter(p =>
      p.name.toLowerCase().includes(produkSearch) || p.category.toLowerCase().includes(produkSearch));
    if (filtered.length === 0){ el.innerHTML = '<tr><td colspan="5" class="empty-hint">Produk tidak ditemukan.</td></tr>'; return; }
    el.innerHTML = filtered.map(p=>{
      const st = stockStatus(p.stock);
      return '<tr>'+
        '<td class="cell-strong">'+p.name+'</td>'+
        '<td>'+p.category+'</td>'+
        '<td>'+formatIDR(p.price)+'</td>'+
        '<td>'+p.stock+' pcs</td>'+
        '<td><span class="badge '+st.cls+'">'+st.label+'</span></td>'+
        '<td class="cell-actions">'+
          '<button class="btn btn--icon" data-action="edit-produk" data-id="'+p.id+'" aria-label="Edit"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg></button>'+
          '<button class="btn btn--icon is-danger" data-action="delete-produk" data-id="'+p.id+'" aria-label="Hapus"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg></button>'+
        '</td>'+
      '</tr>';
    }).join('');
  }

  function openProdukModal(id){
    const isEdit = !!id;
    const p = isEdit ? products.find(x=>x.id===id) : null;
    document.getElementById('produkModalTitle').textContent = isEdit ? 'Edit Produk' : 'Tambah Produk';
    document.getElementById('produkId').value = id || '';
    document.getElementById('produkNama').value = p ? p.name : '';
    document.getElementById('produkKategori').value = p ? p.category : '';
    document.getElementById('produkHarga').value = p ? p.price : '';
    document.getElementById('produkStok').value = p ? p.stock : '';
    document.getElementById('produkModal').classList.add('is-visible');
  }
  function closeProdukModal(){ document.getElementById('produkModal').classList.remove('is-visible'); }

  function saveProdukForm(e){
    e.preventDefault();
    const id = document.getElementById('produkId').value;
    const name = document.getElementById('produkNama').value.trim();
    const category = document.getElementById('produkKategori').value.trim() || 'Umum';
    const price = Number(document.getElementById('produkHarga').value) || 0;
    const stock = Number(document.getElementById('produkStok').value) || 0;
    if (!name){ return; }

    if (id){
      const p = products.find(x=>x.id===id);
      p.name = name; p.category = category; p.price = price; p.stock = stock;
      transactions.forEach(t=>{ if (t.productId === id) t.productName = name; });
      saveTx();
      showToast('Produk berhasil diperbarui');
    } else {
      products.push({ id: uid('p'), name, category, price, stock });
      showToast('Produk baru berhasil ditambahkan');
    }
    saveProducts();
    closeProdukModal();
    renderProduk();
    renderDashboard();
  }

  function deleteProduk(id){
    if (!confirm('Hapus produk ini? Transaksi lama yang mereferensikannya tetap tersimpan.')) return;
    products = products.filter(p=>p.id!==id);
    saveProducts();
    renderProduk();
    renderDashboard();
    showToast('Produk dihapus');
  }

  /* ============================================================
     TRANSAKSI
     ============================================================ */
  let txSearch = '';
  let txFilterStatus = '';

  function fillProdukOptions(selectedId){
    const sel = document.getElementById('txProduk');
    sel.innerHTML = products.map(p=>
      '<option value="'+p.id+'"'+(p.id===selectedId?' selected':'')+'>'+p.name+' — '+formatIDR(p.price)+'</option>'
    ).join('');
  }

  function renderTransaksi(){
    const el = document.getElementById('txBody');
    let filtered = transactions.filter(t =>
      t.customer.toLowerCase().includes(txSearch) || t.productName.toLowerCase().includes(txSearch));
    if (txFilterStatus) filtered = filtered.filter(t=>t.status===txFilterStatus);
    filtered = [...filtered].sort((a,b)=> b.date.localeCompare(a.date));

    if (filtered.length === 0){ el.innerHTML = '<tr><td colspan="7" class="empty-hint">Transaksi tidak ditemukan.</td></tr>'; return; }
    el.innerHTML = filtered.map(t=>
      '<tr>'+
        '<td>'+formatDate(t.date)+'</td>'+
        '<td class="cell-strong">'+t.customer+'</td>'+
        '<td>'+t.productName+'</td>'+
        '<td>'+t.qty+' pcs</td>'+
        '<td class="cell-strong">'+formatIDR(t.total)+'</td>'+
        '<td><span class="badge '+txStatusBadge(t.status)+'">'+t.status+'</span></td>'+
        '<td class="cell-actions">'+
          '<button class="btn btn--icon" data-action="edit-tx" data-id="'+t.id+'" aria-label="Edit"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg></button>'+
          '<button class="btn btn--icon is-danger" data-action="delete-tx" data-id="'+t.id+'" aria-label="Hapus"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg></button>'+
        '</td>'+
      '</tr>'
    ).join('');
  }

  function openTxModal(id){
    const isEdit = !!id;
    const t = isEdit ? transactions.find(x=>x.id===id) : null;
    document.getElementById('txModalTitle').textContent = isEdit ? 'Edit Transaksi' : 'Tambah Transaksi';
    document.getElementById('txId').value = id || '';
    document.getElementById('txTanggal').value = t ? t.date : new Date().toISOString().slice(0,10);
    document.getElementById('txCustomer').value = t ? t.customer : '';
    document.getElementById('txQty').value = t ? t.qty : 1;
    document.getElementById('txStatus').value = t ? t.status : 'Lunas';
    fillProdukOptions(t ? t.productId : (products[0] && products[0].id));
    document.getElementById('txModal').classList.add('is-visible');
  }
  function closeTxModal(){ document.getElementById('txModal').classList.remove('is-visible'); }

  function saveTxForm(e){
    e.preventDefault();
    const id = document.getElementById('txId').value;
    const date = document.getElementById('txTanggal').value;
    const customer = document.getElementById('txCustomer').value.trim();
    const productId = document.getElementById('txProduk').value;
    const qty = Math.max(1, Number(document.getElementById('txQty').value) || 1);
    const status = document.getElementById('txStatus').value;
    const product = products.find(p=>p.id===productId);
    if (!customer || !product) return;

    if (id){
      const old = transactions.find(x=>x.id===id);
      const oldProduct = products.find(p=>p.id===old.productId);
      if (oldProduct) oldProduct.stock += old.qty; // kembalikan stok lama
      old.date = date; old.customer = customer; old.productId = productId;
      old.productName = product.name; old.unitPrice = product.price; old.qty = qty;
      old.total = product.price * qty; old.status = status;
      product.stock = Math.max(0, product.stock - qty);
      showToast('Transaksi berhasil diperbarui');
    } else {
      transactions.push({ id: uid('t'), date, customer, productId, productName: product.name, unitPrice: product.price, qty, total: product.price*qty, status });
      product.stock = Math.max(0, product.stock - qty);
      showToast('Transaksi baru berhasil ditambahkan');
    }
    saveProducts();
    saveTx();
    closeTxModal();
    renderTransaksi();
    renderProduk();
    renderDashboard();
  }

  function deleteTx(id){
    if (!confirm('Hapus transaksi ini? Stok produk terkait akan dikembalikan.')) return;
    const t = transactions.find(x=>x.id===id);
    const p = products.find(x=>x.id===t.productId);
    if (p) p.stock += t.qty;
    transactions = transactions.filter(x=>x.id!==id);
    saveProducts();
    saveTx();
    renderTransaksi();
    renderProduk();
    renderDashboard();
    showToast('Transaksi dihapus, stok dikembalikan');
  }

  /* ============================================================
     NAVIGATION / VIEW SWITCH
     ============================================================ */
  const VIEW_TITLES = { dashboard:'Dashboard', produk:'Produk', transaksi:'Transaksi' };

  function switchView(view){
    document.querySelectorAll('.view').forEach(v=>v.classList.remove('is-active'));
    document.getElementById('view-'+view).classList.add('is-active');
    document.querySelectorAll('.sidebar__link').forEach(l=>l.classList.toggle('is-active', l.dataset.view===view));
    document.getElementById('topbarTitle').textContent = VIEW_TITLES[view];
    document.getElementById('sidebar').classList.remove('is-open');
    document.getElementById('sidebarBackdrop').classList.remove('is-open');
    if (view==='dashboard') renderDashboard();
    if (view==='produk') renderProduk();
    if (view==='transaksi') renderTransaksi();
  }

  /* ============================================================
     INIT
     ============================================================ */
  document.addEventListener('DOMContentLoaded', function(){
    document.getElementById('topbarDate').textContent = new Date().toLocaleDateString('id-ID',{ weekday:'long', day:'numeric', month:'long', year:'numeric' });

    document.querySelectorAll('.sidebar__link').forEach(link=>{
      link.addEventListener('click', ()=> switchView(link.dataset.view));
    });
    document.getElementById('sidebarReset').addEventListener('click', resetDemo);
    document.getElementById('topbarMenu').addEventListener('click', ()=>{
      document.getElementById('sidebar').classList.toggle('is-open');
      document.getElementById('sidebarBackdrop').classList.toggle('is-open');
    });
    document.getElementById('sidebarBackdrop').addEventListener('click', ()=>{
      document.getElementById('sidebar').classList.remove('is-open');
      document.getElementById('sidebarBackdrop').classList.remove('is-open');
    });

    // produk
    document.getElementById('produkAddBtn').addEventListener('click', ()=>openProdukModal(null));
    document.getElementById('produkForm').addEventListener('submit', saveProdukForm);
    document.getElementById('produkModalClose').addEventListener('click', closeProdukModal);
    document.getElementById('produkModalCancel').addEventListener('click', closeProdukModal);
    document.getElementById('produkModal').addEventListener('click', (e)=>{ if (e.target.id==='produkModal') closeProdukModal(); });
    document.getElementById('produkSearch').addEventListener('input', (e)=>{ produkSearch = e.target.value.toLowerCase(); renderProduk(); });
    document.getElementById('produkBody').addEventListener('click', (e)=>{
      const btn = e.target.closest('button[data-action]');
      if (!btn) return;
      if (btn.dataset.action==='edit-produk') openProdukModal(btn.dataset.id);
      if (btn.dataset.action==='delete-produk') deleteProduk(btn.dataset.id);
    });

    // transaksi
    document.getElementById('txAddBtn').addEventListener('click', ()=>openTxModal(null));
    document.getElementById('txForm').addEventListener('submit', saveTxForm);
    document.getElementById('txModalClose').addEventListener('click', closeTxModal);
    document.getElementById('txModalCancel').addEventListener('click', closeTxModal);
    document.getElementById('txModal').addEventListener('click', (e)=>{ if (e.target.id==='txModal') closeTxModal(); });
    document.getElementById('txSearch').addEventListener('input', (e)=>{ txSearch = e.target.value.toLowerCase(); renderTransaksi(); });
    document.getElementById('txFilterStatus').addEventListener('change', (e)=>{ txFilterStatus = e.target.value; renderTransaksi(); });
    document.getElementById('txBody').addEventListener('click', (e)=>{
      const btn = e.target.closest('button[data-action]');
      if (!btn) return;
      if (btn.dataset.action==='edit-tx') openTxModal(btn.dataset.id);
      if (btn.dataset.action==='delete-tx') deleteTx(btn.dataset.id);
    });

    switchView('dashboard');
  });
})();
