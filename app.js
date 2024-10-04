// Fungsi untuk mendeteksi apakah perangkat adalah desktop (dengan lebar layar > 1024px)
function isDesktop() {
    return window.innerWidth > 1024;
}

// Jika perangkat adalah desktop, tampilkan peringatan
if (isDesktop()) {
    Swal.fire({
        title: 'Tidak berfungsi di desktop',
        text: 'Aplikasi ini hanya bisa diakses di tablet atau smartphone.',
        icon: 'warning',
        confirmButtonText: 'Tutup',
        allowOutsideClick: false,
        backdrop: `rgba(0,0,0,0.8)`,
        customClass: {
            popup: 'blur-lg'
        }
    }).then(() => {
        document.body.innerHTML = ""; // Hapus konten halaman setelah peringatan
    });
}

// Data Warga di localStorage
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
        card.classList.add('bg-white', 'p-4', 'rounded', 'shadow-lg', 'long-press');
        card.innerHTML = `
            <h2 class="text-xl font-bold">${warga.namaKepala}</h2>
            <p>Nomor KK: ${warga.nomorKK}</p>
            <ul class="mt-2">
                ${warga.anggotaList.map((anggota, i) => `
                    <li>${i + 1}. ${anggota.nama} (NIK: ${anggota.nik})</li>
                `).join('')}
            </ul>
            <p class="mt-2">Alamat: ${warga.alamat}</p>
            <p>Keterangan: ${warga.keterangan}</p>
        `;

        // Tombol hapus dengan swipe (akan dikembangkan nanti)
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('text-red-500', 'absolute', 'top-2', 'right-2');
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.addEventListener('click', () => hapusWarga(index));
        card.appendChild(deleteBtn);

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
            dataWarga.splice(index, 1);
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

// Panggil fungsi untuk menampilkan data awal saat halaman diakses
displayData();

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
document.addEventListener('mousedown', handleMouseDown);
document.addEventListener('mouseup', handleMouseUp);

let pressTimer;

function handleMouseDown(e) {
    if (e.target.classList.contains('long-press')) {
        pressTimer = setTimeout(() => {
            const index = Array.from(cardContainer.children).indexOf(e.target);
            editWarga(index);
        }, 4000); // 4 detik
    }
}

function handleMouseUp() {
    clearTimeout(pressTimer);
}

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

// Fitur hapus semua data
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
            dataWarga = [];
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
