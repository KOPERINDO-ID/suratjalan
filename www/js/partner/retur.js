/**
 * =========================================
 * RETUR MANAGEMENT FUNCTIONS
 * =========================================
 * Fungsi untuk mengelola retur barang dari penerimaan partner.
 * Popup retur dibuka dari tombol RETUR di setiap baris data penerimaan.
 *
 * Depends on:
 *   - BASE_API          (global, base URL API)
 *   - showAlert()       (global helper)
 *   - showLoading()     (global helper)
 *   - showNotification()(global helper)
 *   - formatNumber()    (global helper)
 *   - RECEIVING_STATE   (dari penerimaan.js — dipakai untuk refresh setelah submit)
 *   - refreshReceivingData() (dari penerimaan.js)
 */

// =========================================
// GLOBAL STATE
// =========================================

let RETUR_STATE = {
    idDetailPengiriman: null,   // id row penerimaan yang akan diretur
    jumlahDiterima: 0,          // jumlah_diterima dari row tersebut
    jumlahReturAktif: 0,        // jumlah_retur yang sudah ada (untuk hitung sisa)
    maxRetur: 0                 // sisa yang boleh diretur = jumlahDiterima - jumlahReturAktif
};

// =========================================
// STATE HELPERS
// =========================================

function resetReturState() {
    RETUR_STATE = {
        idDetailPengiriman: null,
        jumlahDiterima: 0,
        jumlahReturAktif: 0,
        maxRetur: 0
    };
}

// =========================================
// MODAL OPEN / CLOSE
// =========================================

/**
 * Buka popup retur.
 * Dipanggil dari tombol RETUR di createReceivingRow (penerimaan.js).
 *
 * @param {string|number} idDetailPengiriman  – ID partner_detail_pengiriman
 * @param {number}        jumlahDiterima      – jumlah_diterima baris tersebut
 * @param {number}        jumlahReturAktif    – jumlah_retur yang sudah ada di baris tersebut
 */
function openReturModal(idDetailPengiriman, jumlahDiterima, jumlahReturAktif) {

    // Simpan state
    RETUR_STATE.idDetailPengiriman = idDetailPengiriman;
    RETUR_STATE.jumlahDiterima = parseInt(jumlahDiterima) || 0;
    RETUR_STATE.jumlahReturAktif = parseInt(jumlahReturAktif) || 0;
    RETUR_STATE.maxRetur = RETUR_STATE.jumlahDiterima - RETUR_STATE.jumlahReturAktif;

    // Reset form
    resetReturForm();

    // Update label max
    $('#retur-max-label').text('(maks: ' + formatNumber(RETUR_STATE.maxRetur) + ')');

    // Update header badge (jumlah diterima dari baris ini)
    $('#retur-jumlah-diterima').text(formatNumber(RETUR_STATE.jumlahDiterima) + ' pcs');

    // Salin header penerimaan ke header retur (SPK & partner name sudah ada di RECEIVING_STATE)
    if (typeof RECEIVING_STATE !== 'undefined') {
        $('#retur-spk-code').text(RECEIVING_STATE.currentSpkCode || '-');
        $('#retur-partner-name').text(RECEIVING_STATE.currentPartnerName || '-');
    }

    // Update max attribute input
    $('#input_jumlah_retur').attr('max', RETUR_STATE.maxRetur);

    // Open popup
    if (typeof app !== 'undefined') {
        app.popup.open('.popup-retur');
    }
}

/**
 * Tutup popup retur dan reset form
 */
function closeReturModal() {
    resetReturForm();
    resetReturState();

    if (typeof app !== 'undefined') {
        app.popup.close('.popup-retur');
    }
}

// =========================================
// FORM HELPERS
// =========================================

/**
 * Reset semua field form retur ke nilai awal
 */
function resetReturForm() {
    $('#input_alasan_retur').val('');
    $('#input_jumlah_retur').val('');
    $('#input_keterangan_retur').val('');
    clearFotoBuktiRetur();
    $('#btn_submit_retur').prop('disabled', false).text('SIMPAN');
}

// =========================================
// FOTO UPLOAD FUNCTIONS
// =========================================

/**
 * Pilih foto dari galeri (file picker)
 */
function uploadFromGalleryRetur() {
    const input = document.getElementById('input_foto_bukti_retur');
    if (input) {
        input.value = '';   // reset agar event change tetap trigger
        input.click();
    }
}

/**
 * Ambil foto dari kamera perangkat
 */
function captureFromCameraRetur() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';

    input.onchange = function (e) {
        const file = e.target.files[0];
        if (file) {
            handleFotoBuktiReturFile(file);
        }
    };

    input.click();
}

/**
 * Proses file foto yang dipilih: validasi, set ke hidden input, preview
 * @param {File} file
 */
function handleFotoBuktiReturFile(file) {
    // Validasi type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
        showAlert('File harus berformat JPG, JPEG, atau PNG', 'Error');
        return;
    }

    // Validasi ukuran (max 2 MB — sesuai controller: max:2048)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
        showAlert('Ukuran file maksimal 2 MB', 'Error');
        return;
    }

    // Set file ke hidden input (diambil saat submit lewat FormData)
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    const input = document.getElementById('input_foto_bukti_retur');
    if (input) {
        input.files = dataTransfer.files;
    }

    // Preview
    const reader = new FileReader();
    reader.onload = function (e) {
        $('#preview_foto_retur_img').attr('src', e.target.result);
        $('#preview_foto_retur_empty').hide();
        $('#preview_foto_retur_area').show();
    };
    reader.onerror = function () {
        showAlert('Gagal membaca file', 'Error');
    };
    reader.readAsDataURL(file);
}

/**
 * Event listener: perubahan pada hidden file input (dari galeri)
 */
$(document).off('change', '#input_foto_bukti_retur').on('change', '#input_foto_bukti_retur', function (e) {
    const file = e.target.files[0];
    if (!file) return;
    handleFotoBuktiReturFile(file);
});

/**
 * Hapus foto yang sudah dipilih
 */
function clearFotoBuktiRetur() {
    $('#input_foto_bukti_retur').val('');
    $('#preview_foto_retur_img').attr('src', '');
    $('#preview_foto_retur_area').hide();
    $('#preview_foto_retur_empty').show();
}

// =========================================
// SUBMIT
// =========================================

/**
 * Validasi form, buat FormData, kirim ke API inputRetur
 */
function submitRetur() {

    // --- Validasi client-side ---
    const alasan = $('#input_alasan_retur').val();
    const jumlah = parseInt($('#input_jumlah_retur').val()) || 0;
    const keterangan = $('#input_keterangan_retur').val().trim();

    if (!alasan) {
        showAlert('Alasan retur harus dipilih', 'Warning');
        return;
    }

    if (jumlah <= 0) {
        showAlert('Jumlah retur harus lebih dari 0', 'Warning');
        return;
    }

    if (jumlah > RETUR_STATE.maxRetur) {
        showAlert('Jumlah retur tidak boleh lebih dari sisa (' + formatNumber(RETUR_STATE.maxRetur) + ' pcs)', 'Warning');
        return;
    }

    // --- Bangun FormData (sesuai field yang divalidasi controller) ---
    const formData = new FormData();

    formData.append('id_detail_pengiriman', RETUR_STATE.idDetailPengiriman);
    formData.append('tanggal_retur', formatDate(new Date()));   // hari ini
    formData.append('jumlah_retur', jumlah);
    formData.append('alasan_retur', alasan);
    formData.append('keterangan', keterangan);
    formData.append('username', localStorage.getItem('username') || '');

    // Foto bukti (optional)
    const fotoInput = document.getElementById('input_foto_bukti_retur');
    if (fotoInput && fotoInput.files[0]) {
        formData.append('foto_bukti_retur', fotoInput.files[0]);
    }

    // --- Kirim AJAX ---
    $('#btn_submit_retur').prop('disabled', true).text('Menyimpan...');

    $.ajax({
        type: 'POST',
        url: BASE_API + '/retur/input-retur',
        data: formData,
        processData: false,
        contentType: false,
        beforeSend: function () {
            showLoading(true);
        },
        success: function (response) {

            if (response.status === true) {
                showNotification('Retur berhasil disimpan', 'success');

                // Tutup popup retur
                closeReturModal();

                // Refresh tabel penerimaan agar kolom Retur terupdate
                if (typeof refreshReceivingData === 'function') {
                    setTimeout(function () {
                        refreshReceivingData();
                    }, 800);
                }

            } else {
                showAlert(response.message || 'Gagal menyimpan retur', 'Error');
            }
        },
        error: function (xhr, status, error) {
            console.error('Retur submit error:', error);
            console.error('Response:', xhr.responseText);

            let errorMessage = 'Terjadi kesalahan saat menyimpan retur';
            try {
                const errorResponse = JSON.parse(xhr.responseText);
                if (errorResponse.message) {
                    errorMessage = errorResponse.message;
                }
            } catch (e) {
                console.error('Error parsing response:', e);
            }

            showAlert(errorMessage, 'Error');
        },
        complete: function () {
            showLoading(false);
            $('#btn_submit_retur').prop('disabled', false).text('SIMPAN');
        }
    });
}

// =========================================
// POPUP EVENT LISTENER
// =========================================

/**
 * Cleanup otomatis saat popup retur ditutup (misal via back / close button)
 */
$(document).ready(function () {
    if (typeof app !== 'undefined') {
        app.popup.on('closed', '.popup-retur', function () {
            resetReturForm();
            resetReturState();
        });
    }
});