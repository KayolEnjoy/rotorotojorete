// Ambil elemen sidebar dan tombol toggle
const sidebar = document.getElementById('sidebar');
const toggleNavBtn = document.getElementById('toggle-nav-btn');
let isNavOpen = false;

// Fungsi untuk membuka/tutup navigasi
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

// Fungsi untuk mendeteksi swipe ke kanan/kiri
function handleSwipe() {
    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    document.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchStartX < touchEndX - 50) {
            // Swipe ke kanan (tampilkan navigasi)
            isNavOpen = true;
            sidebar.classList.remove('nav-hidden');
            sidebar.classList.add('nav-visible');
            toggleNavBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        } else if (touchStartX > touchEndX + 50) {
            // Swipe ke kiri (sembunyikan navigasi)
            isNavOpen = false;
            sidebar.classList.remove('nav-visible');
            sidebar.classList.add('nav-hidden');
            toggleNavBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        }
    });
}

// Panggil fungsi handleSwipe
handleSwipe();

// Data warga di localStorage
let dataWarga = JSON.parse(localStorage.getItem('dataWarga')) || [];

// Ambil referensi elemen DOM
const formWarga = document.getElementById('form-warga');
const anggotaContainer = document.getElementById('anggota-container');
const tambahAnggotaBtn = document.getElementById('tambah-anggota');
const cardContainer = document.getElementById('card-container');
const searchInput = document.getElementById('search-input');
const filterOption = document.getElementById('filter-option');
const dataCounter = document.getElementById('data-counter');
const exportBtn = document.getElementById('export-btn');
const importBtn = document.getElementById('import-btn');
const deleteAllBtn = document.getElementById('delete-all-btn');

// Fungsi untuk memperbarui penghitung jumlah data
function updateCounter() {
    dataCounter.textContent = `Jumlah Data: ${dataWarga.length}`;
}

// Fungsi untuk menampilkan data warga dalam bentuk cardbox
function displayData(filteredData = dataWarga) {
    cardContainer.innerHTML = ''; // Kosongkan container sebelum menampilkan data

    filteredData.forEach((warga, index) => {
        const card = document.createElement('div');
        card.classList.add('bg-white', 'p-4', 'rounded', 'shadow-lg');
        card.innerHTML = `
            <h2 class="text-xl font-bold">${warga.namaKepala}</h2>
            <p>Nomor KK: ${warga.nomorKK}</p>
            <ul class="mt-2">
                ${warga.anggotaList.map((anggota, i) => `
                    <li>${i + 1}. ${anggota.nama} (NIK: ${anggota.nik})</li>
                `).join('')}
            </ul>
            <p class="mt-2">Alamat: ${warga.alamat}</p>
            <p class="text-gray-500 dark:text-gray-400">Keterangan: ${warga.keterangan}</p>
            <button class="text-blue-500" onclick="editWarga(${index})">
                <i class="fas fa-edit"></i>
            </button>
            <button class="text-red-500" onclick="hapusWarga(${index})">
                <i class="fas fa-trash"></i>
            </button>
        `;

        cardContainer.appendChild(card);
    });

    // Perbarui penghitung
    updateCounter();
}

// Fungsi untuk menambahkan anggota keluarga baru di form
tambahAnggotaBtn.addEventListener('click', () => {
    const anggotaDiv = document.createElement('div');
    anggotaDiv.classList.add('flex', 'mb-2');
    anggotaDiv.innerHTML = `
        <input type="text" placeholder="Nama Anggota Keluarga" class="anggota-nama w-3/5 p-2 border rounded mr-2" style="text-transform: uppercase">
        <input type="number" placeholder="NIK" class="anggota-nik w-2/5 p-2 border rounded">
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

    // Tampilkan alert sukses
    Swal.fire({
        icon: 'success',
        title: 'Sukses!',
        text: 'Data warga berhasil ditambahkan.',
        confirmButtonText: 'OK'
    });
});

// Pencarian data warga
searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredData = dataWarga.filter(warga => 
        warga.namaKepala.toLowerCase().includes(searchTerm) ||
        warga.nomorKK.toLowerCase().includes(searchTerm) ||
        warga.alamat.toLowerCase().includes(searchTerm) ||
        warga.keterangan.toLowerCase().includes(searchTerm) ||
        warga.anggotaList.some(anggota => anggota.nama.toLowerCase().includes(searchTerm))
    );
    displayData(filteredData);
});

// Urutkan berdasarkan filter
filterOption.addEventListener('change', () => {
    if (filterOption.value === 'alphabet') {
        dataWarga.sort((a, b) => a.namaKepala.localeCompare(b.namaKepala));
    } else if (filterOption.value === 'date') {
        // Sorting berdasarkan tanggal update (butuh pengembangan tambahan untuk tracking update)
    }
    displayData();
});

// Fungsi untuk menghapus warga
function hapusWarga(index) {
    Swal.fire({
        title: 'Konfirmasi Hapus',
        text: 'Apakah Anda yakin ingin menghapus data ini?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Hapus',
        cancelButtonText: 'Batal'
    }).then((result) => {
        if (result.isConfirmed) {
            dataWarga.splice(index, 1); // Menghapus hanya satu cardbox
            localStorage.setItem('dataWarga', JSON.stringify(dataWarga));
            displayData();

            Swal.fire({
                icon: 'success',
                title: 'Sukses!',
                text: 'Data warga berhasil dihapus.',
                confirmButtonText: 'OK'
            });
        }
    });
}

// Fungsi hapus semua data
deleteAllBtn.addEventListener('click', () => {
    Swal.fire({
        title: 'Konfirmasi Hapus',
        text: 'Apakah Anda yakin ingin menghapus semua data?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Hapus',
        cancelButtonText: 'Batal'
    }).then((result) => {
        if (result.isConfirmed) {
            dataWarga = []; // Menghapus semua data
            localStorage.removeItem('dataWarga');
            displayData();

            Swal.fire({
                icon: 'success',
                title: 'Sukses!',
                text: 'Semua data berhasil dihapus.',
                confirmButtonText: 'OK'
            });
        }
    });
});

// Fungsi untuk mengimpor data dari file JSON
importBtn.addEventListener('change', (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
        try {
            const importedData = JSON.parse(event.target.result);
            dataWarga = importedData;
            localStorage.setItem('dataWarga', JSON.stringify(dataWarga));
            displayData();
            
            // Alert sukses setelah impor
            Swal.fire({
                icon: 'success',
                title: 'Sukses!',
                text: 'Data warga berhasil diimpor.',
                confirmButtonText: 'OK'
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Format file tidak valid.',
                confirmButtonText: 'OK'
            });
        }
    };

    reader.readAsText(file);
});

// Fungsi untuk mengekspor data ke file JSON
exportBtn.addEventListener('click', () => {
    const dataStr = JSON.stringify(dataWarga, null, 4);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data_warga.json';
    a.click();
    URL.revokeObjectURL(url);

    // Alert sukses setelah ekspor
    Swal.fire({
        icon: 'success',
        title: 'Sukses!',
        text: 'Data berhasil diekspor.',
        confirmButtonText: 'OK'
    });
});

// Fitur long-press untuk mengedit data
function editWarga(index) {
    const warga = dataWarga[index];
    
    // Mengisi data ke form
    document.getElementById('nama-kepala').value = warga.namaKepala;
    document.getElementById('nomor-kk').value = warga.nomorKK;
    document.getElementById('alamat').value = warga.alamat;
    document.getElementById('keterangan').value = warga.keterangan;
    anggotaContainer.innerHTML = '';

    warga.anggotaList.forEach(anggota => {
        const anggotaDiv = document.createElement('div');
        anggotaDiv.classList.add('flex', 'mb-2');
        anggotaDiv.innerHTML = `
            <input type="text" value="${anggota.nama}" class="anggota-nama w-3/5 p-2 border rounded mr-2">
            <input type="text" value="${anggota.nik}" class="anggota-nik w-2/5 p-2 border rounded">
        `;
        anggotaContainer.appendChild(anggotaDiv);
    });

    // Tambahkan event listener untuk menyimpan perubahan
    formWarga.onsubmit = (e) => {
        e.preventDefault();
        updateWarga(index);
    };
}

// Fungsi untuk memperbarui data warga
function updateWarga(index) {
    const namaKepala = document.getElementById('nama-kepala').value;
    const nomorKK = document.getElementById('nomor-kk').value;
    const alamat = document.getElementById('alamat').value;
    const keterangan = document.getElementById('keterangan').value;

    const anggotaList = [];
    document.querySelectorAll('.anggota-nama').forEach((el, index) => {
        const nik = document.querySelectorAll('.anggota-nik')[index].value;
        anggotaList.push({ nama: el.value, nik });
    });

    dataWarga[index] = { namaKepala, nomorKK, anggotaList, alamat, keterangan };
    localStorage.setItem('dataWarga', JSON.stringify(dataWarga));
    
    // Reset form dan tampilkan data terbaru
    formWarga.reset();
    anggotaContainer.innerHTML = '';
    displayData();

    Swal.fire({
        icon: 'success',
        title: 'Sukses!',
        text: 'Data warga berhasil diperbarui.',
        confirmButtonText: 'OK'
    });
}

// Panggil fungsi untuk menampilkan data awal saat halaman diakses
displayData();
