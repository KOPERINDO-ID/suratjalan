/**
 * =========================================
 * RETUR MANAGEMENT FUNCTIONS
 * =========================================
 * Fungsi untuk mengelola retur barang dari penerimaan partner.
 * Popup retur dibuka dari tombol RETUR di setiap baris data penerimaan.
 */

// =========================================
// GLOBAL STATE
// =========================================

let RETUR_STATE = {
    idDetailPengiriman: null,
    jumlahDiterima: 0,
    jumlahReturAktif: 0,
    maxRetur: 0
};

let PENERIMAAN_RETUR_STATE = {
    idRetur: null,
    idDetailPengiriman: null,
    jumlahRetur: 0,
    jumlahSudahDiterima: 0,
    maxPenerimaan: 0,
    statusRetur: null
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

function resetPenerimaanReturState() {
    PENERIMAAN_RETUR_STATE = {
        idRetur: null,
        idDetailPengiriman: null,
        jumlahRetur: 0,
        jumlahSudahDiterima: 0,
        maxPenerimaan: 0,
        statusRetur: null
    };
}

// =========================================
// FORMAT HELPERS
// =========================================
// NOTE: formatNumber, parseNumberFromDisplay, formatDateToDisplay, parseDateFromDisplay
// sudah ada di utils.js - tidak perlu duplikat di sini

/**
 * Format input jumlah penerimaan retur saat user mengetik
 */
function formatJumlahPenerimaanReturInput(input) {
    let value = input.value.replace(/\D/g, '');
    if (value) {
        input.value = formatNumber(value);
    } else {
        input.value = '';
    }
}

/**
 * Buka date picker untuk tanggal penerimaan retur
 */
function openDatePickerPenerimaanRetur() {
    if (typeof app === 'undefined') return;

    const today = new Date();

    app.calendar.create({
        inputEl: '#input_tanggal_penerimaan_retur',
        openIn: 'customModal',
        header: true,
        footer: true,
        dateFormat: 'dd-M-yy',
        value: [today],
        on: {
            change: function (calendar, value) {
                if (value && value.length > 0) {
                    const formattedDate = formatDateToDisplay(value[0]);
                    $('#input_tanggal_penerimaan_retur').val(formattedDate);
                }
            }
        }
    }).open();
}

/**
 * Format input jumlah retur saat user mengetik
 */
function formatJumlahReturInput(input) {
    let value = input.value.replace(/\D/g, '');
    if (value) {
        input.value = formatNumber(value);
    } else {
        input.value = '';
    }
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

    // Update header badge dengan format display
    $('#retur-jumlah-diterima').text(formatNumber(RETUR_STATE.jumlahDiterima) + ' pcs');

    // Salin header penerimaan ke header retur (SPK & partner name sudah ada di RECEIVING_STATE)
    if (typeof RECEIVING_STATE !== 'undefined') {
        $('#retur-spk-code').text(RECEIVING_STATE.currentSpkCode || '-');
        $('#retur-partner-name').text(RECEIVING_STATE.currentPartnerName || '-');
    }

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

/**
 * Buka popup penerimaan retur.
 * Dipanggil dari tombol RETUR (green state) di createReceivingRow (penerimaan.js).
 *
 * @param {string|number} idDetailPengiriman - ID partner_detail_pengiriman
 */
function openPenerimaanReturModal(idDetailPengiriman) {

    // Ambil data retur dari receivingList
    const item = (typeof RECEIVING_STATE !== 'undefined' && RECEIVING_STATE.receivingList)
        ? RECEIVING_STATE.receivingList.find(function (r) { return r.id == idDetailPengiriman; })
        : null;

    if (!item) {
        showAlert('Data penerimaan tidak ditemukan', 'Error');
        return;
    }

    // Validasi: harus ada retur dan status PROSES
    const jumlahRetur = parseInt(item.jumlah_retur || 0);
    if (jumlahRetur === 0) {
        showAlert('Belum ada data retur untuk item ini', 'Warning');
        return;
    }

    // Ambil detail retur dari API
    loadDetailReturForPenerimaan(idDetailPengiriman);
}

/**
 * Load detail retur dari API untuk penerimaan
 */
function loadDetailReturForPenerimaan(idDetailPengiriman) {

    $.ajax({
        type: 'GET',
        url: BASE_API + '/retur/get-retur-by-pengiriman/' + idDetailPengiriman,
        beforeSend: function () {
            showLoading(true);
        },
        success: function (response) {

            if (response.status === true && response.data && response.data.length > 0) {
                // Ambil retur pertama yang statusnya PROSES
                const returData = response.data.find(r => r.status === 'PROSES');

                if (!returData) {
                    showAlert('Tidak ada retur dengan status PROSES', 'Warning');
                    return;
                }

                // Simpan state
                PENERIMAAN_RETUR_STATE.idRetur = returData.id_retur;
                PENERIMAAN_RETUR_STATE.idDetailPengiriman = idDetailPengiriman;
                PENERIMAAN_RETUR_STATE.jumlahRetur = parseInt(returData.jumlah_retur || 0);
                PENERIMAAN_RETUR_STATE.jumlahSudahDiterima = parseInt(returData.jumlah_diterima || 0);
                PENERIMAAN_RETUR_STATE.maxPenerimaan = PENERIMAAN_RETUR_STATE.jumlahRetur - PENERIMAAN_RETUR_STATE.jumlahSudahDiterima;
                PENERIMAAN_RETUR_STATE.statusRetur = returData.status;

                // Reset form
                resetPenerimaanReturForm();

                // Update header info
                if (typeof RECEIVING_STATE !== 'undefined') {
                    $('#penerimaan_retur_spk_code').text(RECEIVING_STATE.currentSpkCode || '-');
                    $('#penerimaan_retur_partner_name').text(RECEIVING_STATE.currentPartnerName || '-');
                }
                $('#penerimaan_retur_jumlah_retur').text(formatNumber(PENERIMAAN_RETUR_STATE.jumlahRetur) + ' pcs');

                // Update label max dengan format display
                $('#penerimaan_retur_max_label').text('(maks: ' + formatNumber(PENERIMAAN_RETUR_STATE.maxPenerimaan) + ')');

                // Set tanggal hari ini dalam format display DD-MMM-YY
                $('#input_tanggal_penerimaan_retur').val(formatDateToDisplay(new Date()));

                // Buka popup
                if (typeof app !== 'undefined') {
                    app.popup.open('.popup-penerimaan-retur');
                }

            } else {
                showAlert('Data retur tidak ditemukan', 'Error');
            }
        },
        error: function (xhr, status, error) {
            console.error('Error loading retur detail:', error);
            showAlert('Gagal memuat data retur', 'Error');
        },
        complete: function () {
            showLoading(false);
        }
    });
}

/**
 * Tutup popup penerimaan retur dan reset form
 */
function closePenerimaanReturModal() {
    resetPenerimaanReturForm();
    resetPenerimaanReturState();

    if (typeof app !== 'undefined') {
        app.popup.close('.popup-penerimaan-retur');
    }
}

// =========================================
// RETUR BUTTON RENDERER
// =========================================

/**
 * Mengembalikan HTML tombol RETUR yang sesuai dengan state data.
 *
 * Tiga state:
 *   1. jumlah_retur == 0               → Gray  → onclick buka popup-retur (input baru)
 *   2. jumlah_retur > 0, status BELUM/PROSES → Green → onclick buka popup-penerimaan-retur
 *   3. jumlah_retur > 0, status SELESAI → Blue → onclick buka popup-viewer-retur
 *
 * @param {Object} item – data satu baris dari receivingList (dari API delivery)
 * @returns {string} HTML string tombol
 */
function renderReturButton(item) {
    // Parse jumlah_retur dengan handling berbagai format
    let jumlahRetur = 0;

    // Coba dari berbagai field yang mungkin
    if (item.jumlah_retur !== undefined && item.jumlah_retur !== null) {
        jumlahRetur = parseInt(item.jumlah_retur) || 0;
    }

    // Cek juga apakah ada id_retur sebagai indikator ada retur
    const adaRetur = jumlahRetur > 0 || (item.id_retur !== undefined && item.id_retur !== null);

    // State 1: belum ada retur → Gray, buka form input retur
    if (!adaRetur) {
        return `<button class="button button-small bg-dark-gray-young text-add-colour-white text-bold"
                    onclick="openReturModal('${item.id}', ${item.jumlah_diterima || 0}, 0)"
                    style="width: 72px;">
                    RETUR
                </button>`;
    }

    // Ada retur - cek status retur (dari API: status_retur)
    // Handle berbagai kemungkinan: status_retur, status, atau default BELUM
    let statusRetur = 'BELUM';

    if (item.status_retur) {
        statusRetur = String(item.status_retur).toUpperCase().trim();
    } else if (item.status && jumlahRetur > 0) {
        // Fallback ke item.status jika status_retur tidak ada
        statusRetur = String(item.status).toUpperCase().trim();
    }

    // State 3: Status SELESAI → Blue, buka popup-viewer-retur (merged)
    if (statusRetur === 'SELESAI') {
        return `<button class="button button-small button-fill color-blue text-bold"
                    onclick="viewReturDetail('${item.id}')"
                    style="width: 72px;">
                    RETUR
                </button>`;
    }

    // State 2: Status BELUM atau PROSES (default) → Green, buka popup-penerimaan-retur
    return `<button class="button button-small button-fill color-green text-bold"
                onclick="openPenerimaanReturModal('${item.id}')"
                style="width: 72px;">
                RETUR
            </button>`;
}

/**
 * Isi popup-viewer-retur dan buka.
 * Data diambil dari RECEIVING_STATE.receivingList yang sudah ada di memori.
 *
 * @param {string|number} idDetailPengiriman – ID partner_detail_pengiriman
 */
function viewReturDetail(idDetailPengiriman) {

    // Ambil data dari receivingList yang sudah di-load
    const item = (typeof RECEIVING_STATE !== 'undefined' && RECEIVING_STATE.receivingList)
        ? RECEIVING_STATE.receivingList.find(function (r) { return r.id == idDetailPengiriman; })
        : null;

    if (!item) {
        showAlert('Data penerimaan tidak ditemukan', 'Error');
        return;
    }

    // Isi header info (SPK, Partner, Badge Jumlah)
    if (typeof RECEIVING_STATE !== 'undefined') {
        $('#viewer_retur_spk_code').text(RECEIVING_STATE.currentSpkCode || '-');
        $('#viewer_retur_partner_name').text(RECEIVING_STATE.currentPartnerName || '-');
    }

    // Badge jumlah retur
    $('#viewer_retur_jumlah_badge').text(formatNumber(item.jumlah_retur) + ' pcs');

    // Isi tabel detail retur
    $('#viewer_retur_tanggal').text(formatDateToDisplay(item.tanggal_retur) || '-');
    $('#viewer_retur_jumlah').text(formatNumber(item.jumlah_retur) + ' pcs');
    $('#viewer_retur_keterangan').text(item.keterangan_retur || '-');

    // Foto Bukti Retur (support multiple field names)
    const fotoBuktiReturUrl = item.foto_bukti_retur_url || item.bukti_kirim_retur_url || '';
    if (fotoBuktiReturUrl) {
        $('#viewer_retur_foto_bukti_img').attr('src', fotoBuktiReturUrl).show();
        $('#viewer_retur_foto_bukti_empty').hide();
    } else {
        $('#viewer_retur_foto_bukti_img').attr('src', '').hide();
        $('#viewer_retur_foto_bukti_empty').show();
    }

    // Foto Bukti Terima Retur
    const fotoBuktiTerimaUrl = item.foto_bukti_terima_retur_url || '';
    if (fotoBuktiTerimaUrl) {
        $('#viewer_retur_foto_terima_img').attr('src', fotoBuktiTerimaUrl).show();
        $('#viewer_retur_foto_terima_empty').hide();
    } else {
        $('#viewer_retur_foto_terima_img').attr('src', '').hide();
        $('#viewer_retur_foto_terima_empty').show();
    }

    // Setup Framework7 Photo Browser untuk zoom foto
    if (typeof app !== 'undefined') {
        // Buat array foto yang tersedia
        const photos = [];
        if (fotoBuktiReturUrl) {
            photos.push({
                url: fotoBuktiReturUrl,
                caption: 'Foto Bukti Retur'
            });
        }
        if (fotoBuktiTerimaUrl) {
            photos.push({
                url: fotoBuktiTerimaUrl,
                caption: 'Foto Bukti Terima Retur'
            });
        }

        // Jika ada foto, setup photo browser
        if (photos.length > 0) {
            const photoBrowser = app.photoBrowser.create({
                photos: photos,
                theme: 'dark',
                type: 'standalone',
                navbar: true,
                toolbar: true,
                backLinkText: 'Tutup'
            });

            // Bind click event untuk foto retur
            $('#viewer_retur_foto_bukti_img').off('click').on('click', function () {
                photoBrowser.open(0); // Open first photo
            });

            // Bind click event untuk foto terima
            $('#viewer_retur_foto_terima_img').off('click').on('click', function () {
                const index = fotoBuktiReturUrl ? 1 : 0; // Jika foto retur ada, terima di index 1
                photoBrowser.open(index);
            });
        }
    }

    // Buka popup
    if (typeof app !== 'undefined') {
        app.popup.open('.popup-viewer-retur');
    }
}


// =========================================
// FORM HELPERS
// =========================================

/**
 * Reset semua field form retur ke nilai awal
 */
function resetReturForm() {
    $('#input_jumlah_retur').val('');
    $('#input_keterangan_retur').val('');
    clearFotoBuktiRetur();
    $('#btn_submit_retur').prop('disabled', false).text('SIMPAN');
}

/**
 * Reset form penerimaan retur
 */
function resetPenerimaanReturForm() {
    $('#input_tanggal_penerimaan_retur').val('');
    $('#input_jumlah_penerimaan_retur').val('');
    clearFotoBuktiTerimaRetur();
    $('#btn_submit_penerimaan_retur').prop('disabled', false).text('SIMPAN');
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

    // Validasi ukuran (max 10 MB — sesuai controller: max:10240)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
        showAlert('Ukuran file maksimal 10 MB', 'Error');
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
// FOTO UPLOAD FUNCTIONS - PENERIMAAN RETUR
// =========================================

/**
 * Pilih foto bukti terima retur dari galeri
 */
function uploadFromGalleryPenerimaanRetur() {
    const input = document.getElementById('input_foto_bukti_terima_retur');
    if (input) {
        input.value = '';   // reset agar event change tetap trigger
        input.click();
    }
}

/**
 * Ambil foto bukti terima retur dari kamera
 */
function captureFromCameraPenerimaanRetur() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';

    input.onchange = function (e) {
        const file = e.target.files[0];
        if (file) {
            handleFotoBuktiTerimaReturFile(file);
        }
    };

    input.click();
}

/**
 * Proses file foto bukti terima retur yang dipilih
 * @param {File} file
 */
function handleFotoBuktiTerimaReturFile(file) {
    // Validasi type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
        showAlert('File harus berformat JPG, JPEG, atau PNG', 'Error');
        return;
    }

    // Validasi ukuran (max 2 MB)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
        showAlert('Ukuran file maksimal 2 MB', 'Error');
        return;
    }

    // Set file ke hidden input
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    const input = document.getElementById('input_foto_bukti_terima_retur');
    if (input) {
        input.files = dataTransfer.files;
    }

    // Preview
    const reader = new FileReader();
    reader.onload = function (e) {
        $('#preview_foto_terima_retur_img').attr('src', e.target.result);
        $('#preview_foto_terima_retur_empty').hide();
        $('#preview_foto_terima_retur_area').show();
    };
    reader.onerror = function () {
        showAlert('Gagal membaca file', 'Error');
    };
    reader.readAsDataURL(file);
}

/**
 * Event listener: perubahan pada hidden file input foto terima retur (dari galeri)
 */
$(document).off('change', '#input_foto_bukti_terima_retur').on('change', '#input_foto_bukti_terima_retur', function (e) {
    const file = e.target.files[0];
    if (!file) return;
    handleFotoBuktiTerimaReturFile(file);
});

/**
 * Hapus foto bukti terima retur yang sudah dipilih
 */
function clearFotoBuktiTerimaRetur() {
    $('#input_foto_bukti_terima_retur').val('');
    $('#preview_foto_terima_retur_img').attr('src', '');
    $('#preview_foto_terima_retur_area').hide();
    $('#preview_foto_terima_retur_empty').show();
}

// =========================================
// SUBMIT
// =========================================

/**
 * Validasi form, buat FormData, kirim ke API inputRetur
 */
function submitRetur() {

    // Ambil value dari input (dalam format display)
    const jumlahDisplay = $('#input_jumlah_retur').val();
    const keterangan = $('#input_keterangan_retur').val().trim();

    // Parse ke format asli
    const alasan = 'LAINNYA';
    const jumlah = parseNumberFromDisplay(jumlahDisplay);

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
    formData.append('jumlah_retur', jumlah);  // Angka tanpa separator
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

/**
 * Submit penerimaan retur
 */
function submitPenerimaanRetur() {

    // Ambil value dari input (dalam format display)
    const tanggalDisplay = $('#input_tanggal_penerimaan_retur').val();
    const jumlahDisplay = $('#input_jumlah_penerimaan_retur').val();

    // Parse ke format asli
    const tanggalDiterima = parseDateFromDisplay(tanggalDisplay);
    const jumlahDiterima = parseNumberFromDisplay(jumlahDisplay);

    // Validasi
    if (!tanggalDisplay || !tanggalDiterima) {
        showAlert('Tanggal diterima harus diisi', 'Warning');
        return;
    }

    if (jumlahDiterima <= 0) {
        showAlert('Jumlah diterima harus lebih dari 0', 'Warning');
        return;
    }

    if (jumlahDiterima > PENERIMAAN_RETUR_STATE.maxPenerimaan) {
        showAlert('Jumlah diterima tidak boleh lebih dari sisa (' + formatNumber(PENERIMAAN_RETUR_STATE.maxPenerimaan) + ' pcs)', 'Warning');
        return;
    }

    // Bangun FormData (untuk support upload file)
    const formData = new FormData();

    formData.append('id_retur', PENERIMAAN_RETUR_STATE.idRetur);
    formData.append('tanggal_diterima', tanggalDiterima);  // Format: YYYY-MM-DD
    formData.append('jumlah_diterima', jumlahDiterima);     // Format: angka tanpa separator
    formData.append('username', localStorage.getItem('username') || '');

    // Tambahkan foto bukti terima retur jika ada
    const fotoInput = document.getElementById('input_foto_bukti_terima_retur');
    if (fotoInput && fotoInput.files[0]) {
        formData.append('foto_bukti_terima_retur', fotoInput.files[0]);
    }

    // Disable button
    $('#btn_submit_penerimaan_retur').prop('disabled', true).text('Menyimpan...');

    // Kirim AJAX
    $.ajax({
        type: 'POST',
        url: BASE_API + '/retur/input-penerimaan-retur',
        data: formData,
        processData: false,  // Penting untuk FormData
        contentType: false,  // Penting untuk FormData
        beforeSend: function () {
            showLoading(true);
        },
        success: function (response) {

            if (response.status === true) {
                showNotification('Penerimaan retur berhasil disimpan', 'success');

                // Tutup popup
                closePenerimaanReturModal();

                // Refresh tabel penerimaan
                if (typeof refreshReceivingData === 'function') {
                    setTimeout(function () {
                        refreshReceivingData();
                    }, 800);
                }

            } else {
                showAlert(response.message || 'Gagal menyimpan penerimaan retur', 'Error');
            }
        },
        error: function (xhr, status, error) {
            console.error('Penerimaan retur submit error:', error);
            console.error('Response:', xhr.responseText);

            let errorMessage = 'Terjadi kesalahan saat menyimpan penerimaan retur';
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
            $('#btn_submit_penerimaan_retur').prop('disabled', false).text('SIMPAN');
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

/**
 * Cleanup otomatis saat popup penerimaan retur ditutup
 */
$(document).ready(function () {
    if (typeof app !== 'undefined') {
        app.popup.on('closed', '.popup-penerimaan-retur', function () {
            resetPenerimaanReturForm();
            resetPenerimaanReturState();
        });
    }
});