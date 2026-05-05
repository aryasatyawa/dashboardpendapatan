function insertHTML(id, html) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
}

function loadTemplate(path, fallbackHtml) {
    if (location.protocol === 'file:') {
        insertHTML(path === 'sidebar.html' ? 'sidebar-placeholder' : 'topbar-placeholder', fallbackHtml);
        return Promise.resolve();
    }

    return fetch(path)
        .then(response => {
            if (!response.ok) throw new Error('Template fetch failed');
            return response.text();
        })
        .then(html => insertHTML(path === 'sidebar.html' ? 'sidebar-placeholder' : 'topbar-placeholder', html))
        .catch(() => insertHTML(path === 'sidebar.html' ? 'sidebar-placeholder' : 'topbar-placeholder', fallbackHtml));
}

function initSidebarInteractions() {

    // toggle sidebar - updated for mobile-friendly without overlay
    const toggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const main = document.querySelector('.flex-1.flex.flex-col');

    function updateMainShift() {
        if (!main) return;
        if (window.innerWidth < 768) {
            main.classList.toggle('main-shifted', sidebar && sidebar.classList.contains('sidebar-open'));
        } else {
            main.classList.remove('main-shifted');
        }
    }

    function toggleSidebar() {
        if (!sidebar) return;

        if (window.innerWidth >= 768) {
            sidebar.classList.toggle('sidebar-closed');
        } else {
            sidebar.classList.toggle('sidebar-open');
        }

        updateMainShift();
    }

    if (toggle && !toggle.dataset.bound) {
        toggle.dataset.bound = "true";
        toggle.addEventListener('click', toggleSidebar);
    }

    // Close sidebar when clicking outside on mobile
    if (!document.body.dataset.sidebarCloseBound) {
        document.body.dataset.sidebarCloseBound = 'true';
        document.body.addEventListener('click', (e) => {
            if (!sidebar || window.innerWidth >= 768) return;

            const isClickInsideSidebar = sidebar.contains(e.target);
            const isClickOnToggle = toggle && toggle.contains(e.target);

            if (!isClickInsideSidebar && !isClickOnToggle && sidebar.classList.contains('sidebar-open')) {
                sidebar.classList.remove('sidebar-open');
                updateMainShift();
            }
        });
    }

    // active menu sidebar (tetap sama)
    document.querySelectorAll('.nav-item').forEach(item => {

        if (item.dataset.bound) return;

        item.dataset.bound = "true";

        item.addEventListener('click', function () {
            updateActiveStyling(this);
        });

    });


    // init topbar filters baru
    initTopbarFilters();
}

function updateActiveStyling(activeItem) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active', 'bg-blue-50', 'text-blue-600', 'hover:bg-blue-400');
        item.classList.add('text-gray-600', 'hover:bg-gray-50');
    });
    activeItem.classList.add('active', 'bg-blue-50', 'text-blue-600', 'hover:bg-blue-400');
    activeItem.classList.remove('hover:bg-gray-50');
}

function setActiveSidebar() {
    const currentPath = window.location.pathname.split('/').pop(); // Get the current page filename
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        if (item.getAttribute('href') === currentPath) {
            updateActiveStyling(item);
            return;
        }
    });
}

function initTopbarFilters() {

    const uppd = document.getElementById('filterUppd');
    const tahun = document.getElementById('filterTahun');
    const bulan = document.getElementById('filterBulan');
    const jenis = document.getElementById('filterJenis');

    if (!uppd || !tahun || !bulan || !jenis) return;


    function applyFilter() {

        const params = new URLSearchParams(window.location.search);

        params.set('uppd', uppd.value);
        params.set('tahun', tahun.value);
        params.set('bulan', bulan.value);
        params.set('jenis', jenis.value);

        window.location.search = params.toString();
    }


    [uppd, tahun, bulan, jenis].forEach(el => {

        if (el.dataset.bound) return;

        el.dataset.bound = 'true';

        el.addEventListener(
            'change',
            applyFilter
        );

    });

}

const sidebarTemplate = `<aside id="sidebar" class="w-64 flex-shrink-0 bg-white flex flex-col h-full shadow-lg z-20 fixed md:relative inset-y-0 left-0 transform -translate-x-full md:translate-x-0 transition-transform duration-300 ease-in-out sidebar-open:translate-x-0">

    <!-- Brand -->
    <div class="px-5 py-5 border-b border-gray-100">
        <div class="flex items-center gap-3">
            <!-- Logo Jateng -->
                <div class="w-11 h-11 flex-shrink-0">
                    <img 
                        src="img/logojateng.png"
                        alt="Logo Jawa Tengah"
                        class="w-full h-full object-contain"
                    />
                </div>
            <div>
                <p class="font-extrabold text-primary text-sm leading-tight">BAPENDA JATENG</p>
                <p class="text-[10px] text-gray-500 leading-tight">Dashboard Monitoring<br />Pendapatan Daerah</p>
            </div>
        </div>
    </div>

    <nav class="flex-1 overflow-y-auto px-3 py-4 space-y-1">

    <a href="index.html"
        class="nav-item flex items-start gap-3 rounded-xl px-3 py-2.5 cursor-pointer transition-colors text-gray-600 hover:bg-gray-50">
        <svg class="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
        <div>
            <p class="font-semibold text-sm leading-tight">Dashboard Utama</p>
            <p class="text-[11px] opacity-75 leading-tight">Ringkasan Realisasi Pajak</p>
        </div>
    </a>

    <a href="summary.html"
        class="nav-item flex items-start gap-3 rounded-xl px-3 py-2.5 cursor-pointer transition-colors text-gray-600 hover:bg-gray-50">
        <svg class="w-5 h-5 mt-0.5 flex-shrink-0 stroke-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01m-.01 4h.01" />
        </svg>
        <div>
            <p class="font-medium text-sm leading-tight">Ringkasan</p>
            <p class="text-[11px] text-gray-400 leading-tight">Ringkasan Realisasi Pajak</p>
        </div>
    </a>

    <a href="pkb.html"
        class="nav-item flex items-start gap-3 rounded-xl px-3 py-2.5 cursor-pointer transition-colors text-gray-600 hover:bg-gray-50">
        <svg class="w-5 h-5 mt-0.5 flex-shrink-0 stroke-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M7 17a2 2 0 100-4 2 2 0 000 4zM17 17a2 2 0 100-4 2 2 0 000 4z" />
            <path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2" />
            <path d="M5 12h14m-9-9v9m-4-9l4 9m5-9l-4 9" />
        </svg>
        <div>
            <p class="font-medium text-sm leading-tight">Pajak Kendaraan Bermotor</p>
            <p class="text-[11px] text-gray-400 leading-tight">Dashboard PKB</p>
        </div>
    </a>

    <a href="bbnkb.html"
        class="nav-item flex items-start gap-3 rounded-xl px-3 py-2.5 cursor-pointer transition-colors text-gray-600 hover:bg-gray-50">
        <svg class="w-5 h-5 mt-0.5 flex-shrink-0 stroke-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
        <div>
            <p class="font-medium text-sm leading-tight">Bea Balik Nama Kendaraan Bermotor</p>
            <p class="text-[11px] text-gray-400 leading-tight">Dashboard BBNKB</p>
        </div>
    </a>

    <a href="transaksi-provinsi.html"
        class="nav-item flex items-start gap-3 rounded-xl px-3 py-2.5 cursor-pointer transition-colors text-gray-600 hover:bg-gray-50">
        <svg class="w-5 h-5 mt-0.5 flex-shrink-0 stroke-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
            <p class="font-medium text-sm leading-tight">Transaksi Real-Time</p>
            <p class="text-[11px] text-gray-400 leading-tight">Real-Time Hari Ini</p>
        </div>
    </a>

    <a href="tren-realisasi-pad.html"
        class="nav-item flex items-start gap-3 rounded-xl px-3 py-2.5 cursor-pointer transition-colors text-gray-600 hover:bg-gray-50">
        <svg class="w-5 h-5 mt-0.5 flex-shrink-0 stroke-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
        <div>
            <p class="font-medium text-sm leading-tight">Tren Realisasi PAD</p>
            <p class="text-[11px] text-gray-400 leading-tight">Pajak, Retribusi & Lain-lain</p>
        </div>
    </a>

    <a href="tren-penerimaan.html"
        class="nav-item flex items-start gap-3 rounded-xl px-3 py-2.5 cursor-pointer transition-colors text-gray-600 hover:bg-gray-50">
        <svg class="w-5 h-5 mt-0.5 flex-shrink-0 stroke-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <div>
            <p class="font-medium text-sm leading-tight">Tren Target dan Realisasi</p>
            <p class="text-[11px] text-gray-400 leading-tight">Penerimaan</p>
        </div>
    </a>

    <a href="tren-pkb-bbkb.html"
        class="nav-item flex items-start gap-3 rounded-xl px-3 py-2.5 cursor-pointer transition-colors text-gray-600 hover:bg-gray-50">
        <svg class="w-5 h-5 mt-0.5 flex-shrink-0 stroke-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M16 8v8m-4-5v5M8 11v5m4-11L4 12m16-5l-8 7-4-4-6 6" />
        </svg>
        <div>
            <p class="font-medium text-sm leading-tight">Tren Target dan Realisasi</p>
            <p class="text-[11px] text-gray-400 leading-tight">PKB, BBNKB dan PAD</p>
        </div>
    </a>

    <a href="tren-jenis-transaksi.html"
        class="nav-item flex items-start gap-3 rounded-xl px-3 py-2.5 cursor-pointer transition-colors text-gray-600 hover:bg-gray-50">
        <svg class="w-5 h-5 mt-0.5 flex-shrink-0 stroke-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
            <path d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
        <div>
            <p class="font-medium text-sm leading-tight">Tren Jenis Transaksi Samsat</p>
        </div>
    </a>

    <a href="tren-loket.html"
        class="nav-item flex items-start gap-3 rounded-xl px-3 py-2.5 cursor-pointer transition-colors text-gray-600 hover:bg-gray-50">
        <svg class="w-5 h-5 mt-0.5 flex-shrink-0 stroke-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        <div>
            <p class="font-medium text-sm leading-tight">Tren Jenis Loket Layanan Samsat</p>
        </div>
    </a>
</nav>

</aside>`;
const topbarTemplate = `
<header id="topbar"
class="bg-white border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-6 py-3.5 flex-shrink-0 z-10 shadow-sm">

<div class="flex items-center gap-4 flex-1 min-w-0">
<button id="sidebarToggle"
class="text-gray-500 hover:text-primary transition-colors flex-shrink-0 relative z-10">
<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
<line x1="3" y1="6" x2="21" y2="6"/>
<line x1="3" y1="12" x2="21" y2="12"/>
<line x1="3" y1="18" x2="21" y2="18"/>
</svg>
</button>

<div class="flex-1 min-w-0">
<h1 class="font-extrabold text-xl text-gray-800 leading-tight">
Dashboard Utama
</h1>

<p class="text-xs text-gray-400 leading-tight truncate">
Ringkasan realisasi pajak kendaraan bermotor Provinsi Jawa Tengah
</p>
</div>
</div>


<div class="filter-row flex flex-row gap-2 w-full md:w-auto overflow-x-auto md:overflow-visible justify-start md:justify-end min-w-0">

<select id="filterUppd"
class="flex-shrink-0 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 bg-white min-w-[120px]">
<option value="">Semua UPPD</option>
<option value="semarang1">UPPD Semarang I</option>
<option value="semarang2">UPPD Semarang II</option>
<option value="surakarta1">UPPD Surakarta I</option>
<option value="purwokerto1">UPPD Purwokerto I</option>
<option value="tegal1">UPPD Tegal I</option>
</select>

<select id="filterTahun"
class="flex-shrink-0 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 bg-white min-w-[80px]">
<option value="2026">2026</option>
<option value="2025">2025</option>
<option value="2024">2024</option>
</select>

<select id="filterBulan"
class="flex-shrink-0 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 bg-white min-w-[100px]">
<option value="1">Januari</option>
<option value="2">Februari</option>
<option value="3">Maret</option>
<option value="4" selected>April</option>
<option value="5">Mei</option>
<option value="6">Juni</option>
<option value="7">Juli</option>
<option value="8">Agustus</option>
<option value="9">September</option>
<option value="10">Oktober</option>
<option value="11">November</option>
<option value="12">Desember</option>
</select>

<select id="filterJenis"
class="flex-shrink-0 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 bg-white min-w-[120px]">
<option value="perubahan">Perubahan</option>
<option value="target_murni">Target Murni</option>
</select>

</div>

</header>
`;

function loadLayouts(title, subtitle = '') {
    return Promise.all([
        loadTemplate('sidebar.html', sidebarTemplate),
        loadTemplate('topbar.html', topbarTemplate),
    ]).then(() => {
        setActiveSidebar();
        const titleEl = document.querySelector('#topbar h1');
        if (titleEl && title) titleEl.textContent = title;
        const subtitleEl = document.querySelector('#topbar p');
        if (subtitleEl && subtitle !== null) subtitleEl.textContent = subtitle;
        initSidebarInteractions();
    });
}
