// Inisialisasi AOS
AOS.init({
    once: true,
    offset: 100,
    duration: 800,
});

// Mobile Menu Toggle
const btn = document.getElementById('mobile-menu-btn');
const menu = document.getElementById('mobile-menu');

if (btn) {
    btn.addEventListener('click', () => {
        menu.classList.toggle('hidden');
    });
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('shadow-lg');
    } else {
        header.classList.remove('shadow-lg');
    }
});

// Search Function
function handleSearch() {
    const dest = document.getElementById('search-dest').value.trim();
    const date = document.getElementById('search-date').value;
    const guest = document.getElementById('search-guest').value;
    const alertBox = document.getElementById('search-alert');

    if (dest === "" || date === "") {
        alertBox.textContent = "Mohon isi Tujuan (Destinasi) dan Tanggal berangkat.";
        alertBox.classList.remove('hidden');
        setTimeout(() => alertBox.classList.add('hidden'), 3000);
        return;
    }

    const modal = document.getElementById('search-modal');
    const loading = document.getElementById('search-loading');
    const result = document.getElementById('search-result');
    const resultText = document.getElementById('search-result-text');

    modal.classList.remove('hidden');
    modal.style.display = 'flex';
    loading.classList.remove('hidden');
    result.classList.add('hidden');

    setTimeout(() => {
        loading.classList.add('hidden');
        result.classList.remove('hidden');
        resultText.innerHTML = `Kami menemukan rute dan ketersediaan hotel di <strong>${dest}</strong> untuk keberangkatan tanggal <strong>${date}</strong> (${guest}).`;
    }, 2000);
}

function closeSearchModal() {
    const modal = document.getElementById('search-modal');
    modal.classList.add('hidden');
    modal.style.display = 'none';
}

function closeSearchAndScroll() {
    closeSearchModal();
    document.getElementById('services').scrollIntoView({ behavior: 'smooth' });
}

// Booking Modal
function openBooking(paket, harga) {
    document.getElementById('booking-package').value = paket;
    document.getElementById('booking-price').value = harga;
    
    document.getElementById('bookForm').reset();
    document.getElementById('booking-message').classList.add('hidden');
    
    const modal = document.getElementById('booking-modal');
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
}

function closeBookingModal() {
    const modal = document.getElementById('booking-modal');
    modal.classList.add('hidden');
    modal.style.display = 'none';
}

// Process Booking
function processBooking(event) {
    event.preventDefault();

    const btnSubmit = document.querySelector('#bookForm button[type="submit"]');
    const originalText = btnSubmit.innerHTML;

    btnSubmit.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Memproses...';
    btnSubmit.disabled = true;

    const dataBooking = {
        id: "BKG" + Math.floor(Math.random() * 100000),
        paket: document.getElementById('booking-package').value,
        harga: document.getElementById('booking-price').value,
        nama: document.getElementById('book-nama').value,
        email: document.getElementById('book-email').value,
        telp: document.getElementById('book-telp').value,
        tanggalPesan: new Date().toLocaleDateString('id-ID')
    };

    setTimeout(() => {
        let savedBookings = JSON.parse(localStorage.getItem('easyBookData')) || [];
        savedBookings.push(dataBooking);
        localStorage.setItem('easyBookData', JSON.stringify(savedBookings));

        const msgBox = document.getElementById('booking-message');
        msgBox.classList.remove('hidden', 'bg-red-100', 'text-red-700');
        msgBox.classList.add('bg-green-100', 'text-green-700');
        msgBox.innerHTML = `<strong>Berhasil!</strong> Pesanan dengan ID ${dataBooking.id} telah tersimpan.`;

        btnSubmit.innerHTML = '<i class="fa-solid fa-check"></i> Selesai';

        setTimeout(() => {
            closeBookingModal();
            btnSubmit.innerHTML = originalText;
            btnSubmit.disabled = false;
        }, 3000);
    }, 1500);

    return false;
}

// Contact Form Validation
function validateForm(event) {
    event.preventDefault();

    const nama = document.getElementById('nama').value.trim();
    const email = document.getElementById('email').value.trim();
    const pesan = document.getElementById('pesan').value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (nama === "") return showMessage("Mohon isi Nama Lengkap Anda.", "error");
    if (email === "") return showMessage("Mohon isi Alamat Email Anda.", "error");
    if (!emailPattern.test(email)) return showMessage("Format email tidak valid.", "error");
    if (pesan === "") return showMessage("Pesan tidak boleh kosong.", "error");

    showMessage("Berhasil! Pesan Anda telah terkirim.", "success");
    document.getElementById('contactForm').reset();
    return false;
}

function showMessage(msg, type) {
    const messageDiv = document.getElementById('form-message');
    messageDiv.textContent = msg;
    messageDiv.classList.remove('hidden');

    if (type === "error") {
        messageDiv.classList.add('bg-red-100', 'text-red-700');
        messageDiv.classList.remove('bg-green-100', 'text-green-700');
    } else {
        messageDiv.classList.add('bg-green-100', 'text-green-700');
        messageDiv.classList.remove('bg-red-100', 'text-red-700');
    }

    setTimeout(() => {
        messageDiv.classList.add('hidden');
    }, 5000);
}

// Back to Top
const backToTopBtn = document.getElementById("backToTop");

window.onscroll = function() {
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        backToTopBtn.classList.remove('hidden');
    } else {
        backToTopBtn.classList.add('hidden');
    }
};

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Close modal when clicking outside
document.getElementById('search-modal').addEventListener('click', function(e) {
    if (e.target === this) closeSearchModal();
});

document.getElementById('booking-modal').addEventListener('click', function(e) {
    if (e.target === this) closeBookingModal();
});