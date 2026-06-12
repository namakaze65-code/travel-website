// 1. Import Firebase SDK Modul (Menggunakan CDN Terpercaya)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// 2. Konfigurasi Firebase Sesuai dengan Database Project Online Lu
const firebaseConfig = {
    apiKey: "AIzaSyBcs415ovKAgtDgCKUr02p2G2Sc4Cv96u0",
    authDomain: "easybook-3cb32.firebaseapp.com",
    databaseURL: "https://easybook-3cb32-default-rtdb.firebaseio.com",
    projectId: "easybook-3cb32",
    storageBucket: "easybook-3cb32.firebasestorage.app",
    messagingSenderId: "182966871696",
    appId: "1:182966871696:web:5d4a7b0ac451c9f7879a15",
    measurementId: "G-G07YP6S0QR"
};

// 3. Inisialisasi Koneksi Firebase Database
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ==========================================
// 4. ANIMASI & NAVIGASI UI EFFECT
// ==========================================

// Inisialisasi AOS (Animate On Scroll)
if (typeof AOS !== 'undefined') {
    AOS.init({
        once: true,
        offset: 100,
        duration: 800,
    });
}

// Mobile Menu Toggle (Buka Tutup Menu HP)
const btn = document.getElementById('mobile-menu-btn');
const menu = document.getElementById('mobile-menu');
if (btn && menu) {
    btn.addEventListener('click', () => {
        menu.classList.toggle('hidden');
    });
}

// Navbar Scroll Shadow Effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (header) {
        if (window.scrollY > 50) {
            header.classList.add('shadow-lg');
        } else {
            header.classList.remove('shadow-lg');
        }
    }
});

// Back to Top Button Configuration
const backToTopBtn = document.getElementById("backToTop");
window.addEventListener('scroll', () => {
    if (backToTopBtn) {
        if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
            backToTopBtn.classList.remove('hidden');
        } else {
            backToTopBtn.classList.add('hidden');
        }
    }
});

window.scrollToTop = function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// ==========================================
// 5. FITUR SEARCH INTEGRATED FUNCTION
// ==========================================
window.handleSearch = function() {
    const dest = document.getElementById('search-dest').value.trim();
    const date = document.getElementById('search-date').value;
    const alertBox = document.getElementById('search-alert');

    // Validasi Form Input Kosong
    if (dest === "" || date === "") {
        if (alertBox) {
            alertBox.textContent = "Mohon isi Tujuan (Destinasi) dan Tanggal berangkat.";
            alertBox.classList.remove('hidden');
            setTimeout(() => alertBox.classList.add('hidden'), 3000);
        } else {
            alert("Mohon isi Tujuan (Destinasi) dan Tanggal berangkat.");
        }
        return;
    }

    // Tampilkan Notifikasi Fitur Pencarian Terintegrasi!
    alert("Fitur pencarian terintegrasi!");

    // Auto Scroll Halus Menuju Section Paket Wisata/Services
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
        servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
};

// ==========================================
// 6. FITUR REAL-TIME BOOKING FIREBASE
// ==========================================

// Buka Modal Pemesanan & Set Otomatis Detail Paket
window.openBooking = function(paket, harga) {
    document.getElementById('booking-package').value = paket;
    document.getElementById('booking-price').value = harga;
    
    document.getElementById('bookForm').reset();
    document.getElementById('booking-message').classList.add('hidden');
    
    const modal = document.getElementById('booking-modal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
    }
};

// Tutup Modal Pemesanan
window.closeBookingModal = function() {
    const modal = document.getElementById('booking-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.style.display = 'none';
    }
};

// Eksekusi Form Kirim Data ke Firebase Realtime Database
window.processBooking = function(event) {
    event.preventDefault();

    const btnSubmit = document.querySelector('#bookForm button[type="submit"]');
    const originalText = btnSubmit.innerHTML;

    // Visual Loading Spinner Button
    btnSubmit.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Memproses...';
    btnSubmit.disabled = true;

    // Dapatkan Waktu Pemesanan secara Real-time saat ini
    const sekarang = new Date();
    const formatWaktu = `${sekarang.getDate()}/${sekarang.getMonth() + 1}/${sekarang.getFullYear()}, ${sekarang.getHours().toString().padStart(2, '0')}.${sekarang.getMinutes().toString().padStart(2, '0')}.${sekarang.getSeconds().toString().padStart(2, '0')}`;

    // Payload Data Terstruktur Sesuai Kebutuhan Database
    const payloadBooking = {
        nama: document.getElementById('book-nama').value.trim(),
        email: document.getElementById('book-email').value.trim(),
        telp: document.getElementById('book-telp').value.trim(),
        paket: document.getElementById('booking-package').value,
        harga: document.getElementById('booking-price').value,
        waktu: formatWaktu
    };

    // GASS KIRIM LANGSUNG KE FIREBASE FOLDER 'pesanan_booking'
    push(ref(db, 'pesanan_booking'), payloadBooking)
        .then(() => {
            const msgBox = document.getElementById('booking-message');
            if (msgBox) {
                msgBox.classList.remove('hidden', 'bg-red-100', 'text-red-700');
                msgBox.classList.add('bg-green-100', 'text-green-700');
                msgBox.innerHTML = `<strong>Berhasil!</strong> Pesanan atas nama ${payloadBooking.nama} sukses terkirim ke Cloud Database.`;
            }

            btnSubmit.innerHTML = '<i class="fa-solid fa-check"></i> Selesai';

            setTimeout(() => {
                closeBookingModal();
                btnSubmit.innerHTML = originalText;
                btnSubmit.disabled = false;
                document.getElementById('bookForm').reset();
            }, 2500);
        })
        .catch((error) => {
            console.error("Firebase Error: ", error);
            const msgBox = document.getElementById('booking-message');
            if (msgBox) {
                msgBox.classList.remove('hidden', 'bg-green-100', 'text-green-700');
                msgBox.classList.add('bg-red-100', 'text-red-700');
                msgBox.textContent = "Gagal menyimpan ke database cloud. Cek jaringan Anda.";
            }
            btnSubmit.innerHTML = 'Coba Lagi';
            btnSubmit.disabled = false;
        });

    return false;
};

// ==========================================
// 7. FITUR CONTACT VALIDATION & REVIEW
// ==========================================
window.validateForm = function(event) {
    event.preventDefault();

    const nama = document.getElementById('nama').value.trim();
    const email = document.getElementById('email').value.trim();
    const pesan = document.getElementById('pesan').value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (nama === "") return showMessage("Mohon isi Nama Lengkap Anda.", "error");
    if (email === "") return showMessage("Mohon isi Alamat Email Anda.", "error");
    if (!emailPattern.test(email)) return showMessage("Format email tidak valid.", "error");
    if (pesan === "") return showMessage("Pesan tidak boleh kosong.", "error");

    // Format ulasan kirim ke folder 'ulasan_penilaian' di Firebase
    const payloadUlasan = {
        nama: nama,
        email: email,
        pesan: pesan,
        waktuInbound: new Date().toLocaleString('id-ID')
    };

    push(ref(db, 'ulasan_penilaian'), payloadUlasan)
        .then(() => {
            showMessage("Berhasil! Ulasan Anda telah terkirim live ke database cloud.", "success");
            document.getElementById('contactForm').reset();
        })
        .catch(() => {
            showMessage("Terjadi gangguan pengiriman ulasan online.", "error");
        });

    return false;
};

function showMessage(msg, type) {
    const messageDiv = document.getElementById('form-message');
    if (!messageDiv) return;
    
    messageDiv.textContent = msg;
    messageDiv.classList.remove('hidden');

    if (type === "error") {
        messageDiv.add('bg-red-100', 'text-red-700');
        messageDiv.remove('bg-green-100', 'text-green-700');
    } else {
        messageDiv.add('bg-green-100', 'text-green-700');
        messageDiv.remove('bg-red-100', 'text-red-700');
    }

    setTimeout(() => {
        messageDiv.classList.add('hidden');
    }, 5000);
}

// Close Modal Event (Klik Di Luar Area Kotak Modal Otomatis Tutup)
const searchModal = document.getElementById('search-modal');
if (searchModal) {
    searchModal.addEventListener('click', function(e) {
        if (e.target === this) {
            if (typeof closeSearchModal === 'function') closeSearchModal();
        }
    });
}

const bookingModal = document.getElementById('booking-modal');
if (bookingModal) {
    bookingModal.addEventListener('click', function(e) {
        if (e.target === this) {
            if (typeof closeBookingModal === 'function') closeBookingModal();
        }
    });
}