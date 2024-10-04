// Fungsi untuk mendeteksi apakah perangkat adalah desktop (dengan lebar layar > 1024px)
function isDesktop() {
    return window.innerWidth > 1024;
}

// Jika perangkat adalah desktop, tampilkan SweetAlert dan blur halaman
if (isDesktop()) {
    // Tampilkan pesan peringatan
    Swal.fire({
        title: 'Tidak berfungsi di desktop',
        text: 'Aplikasi ini hanya bisa diakses di tablet atau smartphone.',
        icon: 'warning',
        confirmButtonText: 'Tutup',
        allowOutsideClick: false,
        backdrop: `
            rgba(0,0,0,0.8)
            url("https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif")
            center top
            no-repeat
        `,
        customClass: {
            popup: 'blur-lg'
        }
    }).then(() => {
        document.body.innerHTML = ""; // Hapus konten halaman setelah alert
    });
}

// Ambil referensi elemen formulir
const formWarga = document.getElementById('form-warga');
const anggotaContainer = document.getElementById('anggota-container');
const tambahAnggotaBtn = document.getElementById('tambah-anggota');
const cardContainer = document.getElementById('card-container');

// Data warga
let dataWarga = JSON.parse(localStorage.getItem('dataWarga')) || [];

// Fungsi untuk menambah anggota keluarga
tambahAnggotaBtn.addEventListener('click', () => {
    const anggotaDiv = document.createElement('div');
    anggotaDiv.classList.add('flex', 'mb-2');
    anggotaDiv.innerHTML = `
        <input type="text" placeholder="Nama Anggota Keluarga" class="anggota-nama w-3/5 p-2 border rounded mr-2">
        <input type="text" placeholder="NIK" class="anggota-nik w-2/5 p-2 border rounded">
    `;
    anggotaContainer.appendChild(anggotaDiv);
});

// Fungsi untuk menyimpan data ke localStorage
formWarga.addEventListener('submit', (e) => {
    e.preventDefault();

    const namaKepala = document.getElementById('nama-kepala').value;
    const nomorKK = document.getElementById('nomor-kk').value;
    const alamat = document.getElementById('alamat').value;
    const keterangan = document.getElementById('keterangan').value;

    const anggotaList = [];
    document.querySelectorAll('.anggota-nama').forEach((el, index) => {
        const nik = document.querySelectorAll('.anggota-nik')[index].value;
        anggotaList.push({ nama: el.value, nik });
    });

    const warga = { namaKepala, nomorKK, anggotaList, alamat, keterangan };

    dataWarga.push(warga);
    localStorage.setItem('dataWarga', JSON.stringify(dataWarga));

    // Reset form dan tampilkan data terbaru
    formWarga.reset();
    anggotaContainer.innerHTML = '';
    displayData();
});


// Ambil elemen sidebar dan tombol toggle
const sidebar = document.getElementById('sidebar');
const toggleNavBtn = document.getElementById('toggle-nav-btn');
let isNavOpen = false;

// Fungsi untuk membuka/tutup navigasi dengan smooth
function toggleNav() {
    isNavOpen = !isNavOpen;
    if (isNavOpen) {
        sidebar.classList.remove('nav-hidden');
        sidebar.classList.add('nav-visible');
        toggleNavBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    } else {
        sidebar.classList.remove('nav-visible');
        sidebar.classList.add('nav-hidden');
        toggleNavBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    }
}

// Tambahkan event listener untuk tombol toggle
toggleNavBtn.addEventListener('click', toggleNav);

// Swipe detection for mobile (touch events)
let touchStartX = 0;
let touchEndX = 0;

// Fungsi untuk mendeteksi swipe ke kanan atau kiri
function handleSwipe() {
    if (touchStartX < touchEndX - 50) {
        // Geser ke kanan (tampilkan navigasi)
        isNavOpen = true;
        sidebar.classList.remove('nav-hidden');
        sidebar.classList.add('nav-visible');
        toggleNavBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    } else if (touchStartX > touchEndX + 50) {
        // Geser ke kiri (sembunyikan navigasi)
        isNavOpen = false;
        sidebar.classList.remove('nav-visible');
        sidebar.classList.add('nav-hidden');
        toggleNavBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    }
}

// Event listener untuk swipe (mobile)
document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});


// Data awal contoh untuk testing
const wargaData = [
    {
        namaKepala: "Jono Kabalan",
        nomorKK: "3225 3234 3213 321",
        anggotaKeluarga: [
            { nama: "Jono Kabalan", nik: "90927391739" },
            { nama: "Tanaka Putri Dewi", nik: "90927391740" },
            { nama: "Budi Setiawan", nik: "90927391741" }
        ],
        alamat: "Pringlangu gg4 no.9",
        keterangan: "Rumah warna hijau samping makam"
    },
    // Data lainnya...
];

// Fungsi untuk menampilkan data warga dalam bentuk cardbox
function renderWarga(data) {
    const container = document.getElementById('card-container');
    container.innerHTML = ''; // Bersihkan kontainer sebelum render
    data.forEach((warga, index) => {
        const card = document.createElement('div');
        card.classList.add('bg-white', 'p-4', 'rounded', 'shadow-lg');

        // Tambahkan konten cardbox
        card.innerHTML = `
            <h2 class="text-xl font-bold">${warga.namaKepala}</h2>
            <p class="text-gray-600">Nomor KK: ${warga.nomorKK}</p>
            <ul class="mt-2">
                ${warga.anggotaKeluarga.map((anggota, i) => `
                    <li>${i+1}. ${anggota.nama} (NIK: ${anggota.nik})</li>
                `).join('')}
            </ul>
            <p class="mt-2 text-gray-600">Alamat: ${warga.alamat}</p>
            <p class="mt-2 text-gray-600">Keterangan: ${warga.keterangan}</p>
        `;

        container.appendChild(card);
    });
}

// Filter data berdasarkan input pencarian
document.getElementById('search').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredData = wargaData.filter(warga => 
        warga.namaKepala.toLowerCase().includes(searchTerm) ||
        warga.nomorKK.includes(searchTerm) ||
        warga.anggotaKeluarga.some(anggota => anggota.nama.toLowerCase().includes(searchTerm) || anggota.nik.includes(searchTerm)) ||
        warga.alamat.toLowerCase().includes(searchTerm)
    );
    renderWarga(filteredData);
});

// Render awal data warga
renderWarga(wargaData);

// Fungsi untuk menampilkan data warga
function displayData() {
    cardContainer.innerHTML = '';

    dataWarga.forEach((warga, index) => {
        const card = document.createElement('div');
        card.classList.add('bg-white', 'p-4', 'rounded', 'shadow', 'mb-4', 'relative');

        card.innerHTML = `
            <h3 class="text-xl font-bold">${warga.namaKepala}</h3>
            <p class="text-sm text-gray-500">Nomor KK: ${warga.nomorKK}</p>
            <ul class="list-disc pl-5 mt-2">
                ${warga.anggotaList.map((anggota, i) => `<li>${i + 1}. ${anggota.nama} - NIK: ${anggota.nik}</li>`).join('')}
            </ul>
            <p class="mt-2">Alamat: ${warga.alamat}</p>
            <p class="text-sm text-gray-500">Keterangan: ${warga.keterangan}</p>
            <button class="text-red-500 absolute top-2 right-2" onclick="hapusWarga(${index})"><i class="fas fa-trash"></i></button>
        `;

        cardContainer.appendChild(card);
    });
}

// Panggil fungsi untuk memuat data saat halaman pertama kali diakses
displayData();

// Fungsi untuk menghapus data warga
function hapusWarga(index) {
    dataWarga.splice(index, 1);
    localStorage.setItem('dataWarga', JSON.stringify(dataWarga));
    displayData();
}

// Fungsi untuk mengekspor data sebagai file JSON
function eksporData() {
    const dataStr = JSON.stringify(dataWarga, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data_warga.json';
    a.click();
}

// Fungsi untuk mengimpor data dari file JSON
document.getElementById('import-btn').addEventListener('change', (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (event) => {
        const importedData = JSON.parse(event.target.result);
        dataWarga = importedData;
        localStorage.setItem('dataWarga', JSON.stringify(dataWarga));
        displayData();
    };

    reader.readAsText(file);
});

// Fungsi untuk menyimpan cardbox sebagai gambar
function saveCardAsImage(cardElement) {
    html2canvas(cardElement).then(canvas => {
        const link = document.createElement('a');
        link.download = 'warga-card.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
}
