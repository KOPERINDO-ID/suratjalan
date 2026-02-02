/**
 * =========================================
 * PENERIMAAN MANAGEMENT FUNCTIONS
 * =========================================
 * Fungsi untuk mengelola penerimaan barang partner
 * CATATAN: Helper functions ada di ./partner/utils.js
 */

// =========================================
// GLOBAL VARIABLES & CONSTANTS
// =========================================

let RECEIVING_STATE = {
    currentPartnerTransaksiId: null,
    currentPartnerTransaksiDetailId: null,
    currentPartnerName: null,
    currentSpkCode: null,
    currentQuantity: 0,
    receivingList: [],
    tempReceivingRow: null,
    tempReceivingData: null
};

// =========================================
// STATE MANAGEMENT FUNCTIONS
// =========================================

/**
 * Reset receiving state
 */
function resetReceivingState() {
    RECEIVING_STATE = {
        currentPartnerTransaksiId: null,
        currentPartnerTransaksiDetailId: null,
        currentPartnerName: null,
        currentSpkCode: null,
        currentQuantity: 0,
        receivingList: [],
        tempReceivingRow: null,
        tempReceivingData: null
    };
}

/**
 * Clear temporary receiving data
 */
function clearTempReceivingData() {
    RECEIVING_STATE.tempReceivingRow = null;
    RECEIVING_STATE.tempReceivingData = null;
}

// =========================================
// RECEIVING TABLE FUNCTIONS
// =========================================

/**
 * Membuka modal penerimaan dengan data dari API
 */
function openReceivingModal(id_partner_transaksi, partner_name = '') {

    if (!id_partner_transaksi) {
        showAlert('ID Partner Transaksi tidak valid', 'Error');
        return;
    }

    // Reset state sebelum load data baru
    resetReceivingState();

    // Load receiving data from API
    loadReceivingData(id_partner_transaksi);

    // Open modal
    if (typeof app !== 'undefined') {
        app.popup.open('.popup-penerimaan');
    }
}

/**
 * Close receiving modal and cleanup
 */
function closeReceivingModal() {
    // Remove any editing rows
    $('.editing-row').remove();

    // Clear temporary data
    clearTempReceivingData();

    // Close modal
    if (typeof app !== 'undefined') {
        app.popup.close('.popup-penerimaan');
    }
}

/**
 * Load data penerimaan dari API
 */
function loadReceivingData(id_partner_transaksi) {

    RECEIVING_STATE.currentPartnerTransaksiId = id_partner_transaksi;

    $.ajax({
        type: "POST",
        url: BASE_API + "/delivery",
        dataType: 'json',
        data: {
            id_partner_transaksi: id_partner_transaksi
        },
        beforeSend: function () {
            showLoading(true);
        },
        success: function (response) {

            if (response.success === true && response.data) {
                // Populate header info
                populateReceivingHeader(response.data.data);

                // Render receiving table
                renderReceivingTable(response.data.deliveries);

                // Update receiving count
                updateReceivingCount(response.total_deliveries || 0);

            } else {
                showAlert(response.message || 'Gagal memuat data penerimaan', 'Error');
                renderEmptyReceivingTable();
            }
        },
        error: function (xhr, status, error) {
            console.error('Error loading receiving data:', error);

            if (xhr.status === 404) {
                renderEmptyReceivingTable();
                updateReceivingCount(0);
            } else {
                showAlert('Terjadi kesalahan saat memuat data', 'Error');
            }
        },
        complete: function () {
            showLoading(false);
        }
    });
}

/**
 * Populate receiving header information
 */
function populateReceivingHeader(data) {

    // Data adalah array dari response.data
    const headerData = data[0] || {};

    RECEIVING_STATE.currentPartnerName = headerData.nama_partner || '-';
    RECEIVING_STATE.currentQuantity = parseInt(headerData.jumlah || 0);
    RECEIVING_STATE.currentPartnerTransaksiDetailId = headerData.id_partner_transaksi_detail || null;

    // Set partner name (dari material name)
    $('#receiving-partner-name').text(headerData.nama_partner || '-');

    // Set SPK code jika ada
    if (headerData.penjualan_id && headerData.penjualan_tanggal) {
        const spkCode = formatSPKCode(headerData.penjualan_id, headerData.penjualan_tanggal);
        RECEIVING_STATE.currentSpkCode = spkCode;
        $('#receiving-spk-code').text(spkCode);
    }

    // Set quantity badge
    $('#receiving-quantity').text((headerData.jumlah || 0) + ' pcs');
}

/**
 * Render receiving table
 */
function renderReceivingTable(receivings) {

    const tbody = $('#receiving_table_body');
    tbody.empty();

    if (!receivings || receivings.length === 0) {
        renderEmptyReceivingTable();
        return;
    }

    RECEIVING_STATE.receivingList = receivings;


    receivings.forEach((item, index) => {
        const row = createReceivingRow(item, index + 1);
        tbody.append(row);
    });

}

/**
 * Render empty receiving table
 */
function renderEmptyReceivingTable() {
    const tbody = $('#receiving_table_body');
    tbody.empty();

    const emptyRow = `
        <tr id="empty_receiving_row">
            <td colspan="6" align="center" style="padding: 20px; border: 1px solid #ddd;">
                <i class="f7-icons" style="font-size: 40px; color: #999;">cube_box</i>
                <p style="color: #999; margin-top: 10px;">Belum ada data penerimaan</p>
            </td>
        </tr>
    `;

    tbody.append(emptyRow);
}

/**
 * Create receiving table row
 */
function createReceivingRow(item, no) {
    // Hitung total yang sudah diterima dari semua delivery
    const totalReceived = RECEIVING_STATE.receivingList
        .reduce((sum, r) => sum + parseInt(r.jumlah_diterima || 0), 0);
    const remaining = RECEIVING_STATE.currentQuantity - totalReceived;

    return `
        <tr class="receiving-data-row" data-id="${item.id}">
            <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">${no}</td>
            <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">
                ${formatDateIndonesia(item.tanggal_diterima)}
            </td>
            <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">
                ${formatNumber(item.jumlah_diterima)}
            </td>
            <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">
                ${formatNumber(item.jumlah_retur || 0)}
            </td>
            <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">
                ${formatNumber(item.jumlah_belum_diterima || remaining)}
            </td>
            <td class="display-flex justify-content-space-between align-items-center" 
                style="padding: 8px; border: 1px solid #ddd; gap: 4px;">
                <button class="button button-small button-fill color-blue text-bold" 
                    onclick="viewBuktiPenerimaan('${item.id}')" 
                    style="width: 72px;">
                    BUKTI
                </button>
                ${renderReturButton(item)}
            </td>
        </tr>
    `;
}

/**
 * Update receiving count
 */
function updateReceivingCount(count) {
    $('#receiving_count').text(count + ' data');
}

/**
 * Refresh receiving data
 */
function refreshReceivingData() {

    if (!RECEIVING_STATE.currentPartnerTransaksiId) {
        showAlert('ID Partner Transaksi tidak tersedia', 'Error');
        return;
    }

    loadReceivingData(RECEIVING_STATE.currentPartnerTransaksiId);
    showNotification('Data penerimaan diperbarui', 'success');
}

/**
 * Add new receiving row
 */
function addReceivingRow() {

    // Remove any existing editing row
    $('.editing-row').remove();

    // Clear temp data
    clearTempReceivingData();

    if ($('#empty_receiving_row')) {
        $('#empty_receiving_row').remove();
    }

    // Calculate total received and remaining
    const totalReceived = RECEIVING_STATE.receivingList
        .reduce((sum, r) => sum + parseInt(r.jumlah_diterima || 0), 0);
    const remaining = RECEIVING_STATE.currentQuantity - totalReceived;

    // Get today's date
    const today = new Date();
    const todayFormatted = formatDate(today);

    const newRow = `
        <tr class="editing-row">
            <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">
                <i class="f7-icons" style="color: #2cd048;">checkmark_alt_circle_fill</i>
            </td>
            <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">
                <input type="date" 
                    id="input_tanggal_terima" 
                    value="${todayFormatted}"
                    style="width: 100%; padding: 4px; border: 1px solid #ddd; border-radius: 4px;" />
            </td>
            <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">
                <input type="number" 
                    id="input_jumlah_terima" 
                    placeholder="0"
                    min="1"
                    max="${remaining}"
                    value=""
                    style="width: 100%; padding: 4px; border: 1px solid #ddd; border-radius: 4px;" />
            </td>
            <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">
                <span id="editing_row_retur_value">0</span>
            </td>
            <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">
                <input type="text" 
                    id="input_sisa" 
                    value="${formatNumber(remaining)}"
                    readonly
                    style="width: 100%; padding: 4px; border: 1px solid #ddd; border-radius: 4px; background-color: #f5f5f5;" />
            </td>
            <td class="display-flex justify-content-space-between align-items-center" 
                style="padding: 8px; border: 1px solid #ddd; gap: 4px;">
                <button class="button button-small button-fill color-green text-bold" 
                    onclick="saveReceiving()" 
                    style="flex: 1; max-width: 70px;">
                    <i class="f7-icons">checkmark</i>
                </button>
                <button class="button button-small button-fill color-red text-bold" 
                    onclick="cancelReceiving()" 
                    style="flex: 1; max-width: 70px;">
                    <i class="f7-icons">xmark</i>
                </button>
            </td>
        </tr>
    `;

    $('#receiving_table_body').prepend(newRow);

    // Add input event listener to update remaining
    $('#input_jumlah_terima').on('input', function () {
        const jumlahTerima = parseInt($(this).val()) || 0;
        const sisa = remaining - jumlahTerima;
        $('#input_sisa').val(formatNumber(Math.max(0, sisa)));
    });
}

/**
 * Cancel receiving row
 */
function cancelReceiving() {
    $('.editing-row').remove();
    clearTempReceivingData();
}

/**
 * Save receiving data
 */
function saveReceiving() {

    // Get input values
    const tanggalTerima = $('#input_tanggal_terima').val();
    const jumlahTerima = parseInt($('#input_jumlah_terima').val()) || 0;

    // Validation
    if (!tanggalTerima) {
        showAlert('Tanggal penerimaan harus diisi', 'Warning');
        return;
    }

    if (jumlahTerima <= 0) {
        showAlert('Jumlah penerimaan harus lebih dari 0', 'Warning');
        return;
    }

    // Calculate total received and remaining
    const totalReceived = RECEIVING_STATE.receivingList
        .reduce((sum, r) => sum + parseInt(r.jumlah_diterima || 0), 0);
    const remaining = RECEIVING_STATE.currentQuantity - totalReceived;

    if (jumlahTerima > remaining) {
        showAlert(`Jumlah penerimaan tidak boleh lebih dari sisa (${formatNumber(remaining)} pcs)`, 'Warning');
        return;
    }

    // Calculate new remaining
    const jumlahBelumTerima = remaining - jumlahTerima;

    const username = localStorage.getItem('username');

    // Store temp data
    RECEIVING_STATE.tempReceivingData = {
        tanggal_diterima: formatDateIndonesia(tanggalTerima),
        jumlah_diterima: jumlahTerima,
        jumlah_belum_diterima: jumlahBelumTerima,
        nama_penerima: username
    };

    // Open upload popup for files
    openUploadPopup();
}

/**
 * Open upload popup
 */
function openUploadPopup() {
    $('#upload_tanggal_display').text(RECEIVING_STATE.tempReceivingData.tanggal_diterima);
    $('#upload_jumlah_display').text(RECEIVING_STATE.tempReceivingData.jumlah_diterima);
    $('#upload_penerima_display').text(RECEIVING_STATE.tempReceivingData.nama_penerima);

    // Reset upload form
    $('#input_nama_penerima').val('');
    clearBuktiPenerimaan();
    clearBuktiDokumen();

    // Reset submit button
    $('#btn_submit_penerimaan').prop('disabled', false).text('SIMPAN');

    // Open upload popup
    if (typeof app !== 'undefined') {
        app.popup.open('.popup-upload-penerimaan');
    }
}

/**
 * Close upload popup and cleanup
 */
function closeUploadPopup() {
    // Clear form
    $('#input_nama_penerima').val('');
    clearBuktiPenerimaan();
    clearBuktiDokumen();

    // Close popup
    if (typeof app !== 'undefined') {
        app.popup.close('.popup-upload-penerimaan');
    }
}

// =========================================
// PHOTO UPLOAD FUNCTIONS 
// =========================================

/**
 * Upload dari Galeri (File Picker)
 */
function uploadFromGalleryPenerimaan() {
    const input = document.getElementById('input_bukti_penerimaan');
    if (input) {
        // Reset input untuk memastikan event change tetap trigger meski pilih file yang sama
        input.value = '';
        input.click();
    }
}

/**
 * Capture dari Kamera
 */
function captureFromCameraPenerimaan() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment'; // Gunakan kamera belakang

    input.onchange = function (e) {
        const file = e.target.files[0];
        if (file) {
            handleBuktiPenerimaanFile(file);
        }
    };

    input.click();
}

/**
 * Handle file bukti penerimaan yang dipilih
 */
function handleBuktiPenerimaanFile(file) {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
        showAlert('File harus berformat JPG, JPEG, atau PNG', 'Error');
        return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
        showAlert('Ukuran file maksimal 5MB', 'Error');
        return;
    }

    // Set file ke input (untuk FormData nanti)
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    const input = document.getElementById('input_bukti_penerimaan');
    if (input) {
        input.files = dataTransfer.files;
    }

    // Preview image
    const reader = new FileReader();
    reader.onload = function (e) {
        $('#preview_bukti_penerimaan_img').attr('src', e.target.result);
        $('#preview_bukti_penerimaan_empty').hide();
        $('#preview_bukti_penerimaan_area').show();
    };
    reader.onerror = function () {
        showAlert('Gagal membaca file', 'Error');
    };
    reader.readAsDataURL(file);
}

/**
 * Event listener untuk input file (ketika dipilih dari galeri via uploadFromGalleryPenerimaan)
 */
$(document).off('change', '#input_bukti_penerimaan').on('change', '#input_bukti_penerimaan', function (e) {
    const file = e.target.files[0];
    if (!file) return;
    handleBuktiPenerimaanFile(file);
});

/**
 * Clear bukti penerimaan
 */
function clearBuktiPenerimaan() {
    $('#input_bukti_penerimaan').val('');
    $('#preview_bukti_penerimaan_img').attr('src', '');
    $('#preview_bukti_penerimaan_area').hide();
    $('#preview_bukti_penerimaan_empty').show();
}

/**
 * Clear bukti dokumen
 */
function clearBuktiDokumen() {
    $('#input_bukti_dokumen_penerimaan').val('');
    $('#preview_bukti_dokumen_name').text('');
    $('#preview_bukti_dokumen_area').hide();
    $('#preview_bukti_dokumen_empty').show();
}

/**
 * Submit penerimaan with files using FormData
 */
function submitPenerimaanWithFiles() {

    if (!RECEIVING_STATE.tempReceivingData) {
        showAlert('Data penerimaan tidak ditemukan', 'Error');
        return;
    }

    // Create FormData
    const formData = new FormData();

    // Add basic data
    formData.append('id_partner_transaksi', RECEIVING_STATE.currentPartnerTransaksiId);
    formData.append('tanggal_diterima', RECEIVING_STATE.tempReceivingData.tanggal_diterima);
    formData.append('jumlah_diterima', RECEIVING_STATE.tempReceivingData.jumlah_diterima);
    formData.append('jumlah_belum_diterima', RECEIVING_STATE.tempReceivingData.jumlah_belum_diterima);
    formData.append('nama_penerima', RECEIVING_STATE.tempReceivingData.nama_penerima);

    // Add bukti penerimaan if selected
    const buktiFotoInput = document.getElementById('input_bukti_penerimaan');
    if (buktiFotoInput && buktiFotoInput.files[0]) {
        formData.append('bukti_penerimaan', buktiFotoInput.files[0]);
    }

    // Add bukti dokumen if selected
    const buktiDokumenInput = document.getElementById('input_bukti_dokumen_penerimaan');
    if (buktiDokumenInput && buktiDokumenInput.files[0]) {
        formData.append('bukti_dokumen_penerimaan', buktiDokumenInput.files[0]);
    }

    // Disable submit button
    $('#btn_submit_penerimaan').prop('disabled', true).text('Menyimpan...');

    $.ajax({
        type: 'POST',
        url: BASE_API + '/delivery/add-delivery',
        data: formData,
        processData: false,
        contentType: false,
        beforeSend: function () {
            showLoading(true);
        },
        success: function (response) {

            if (response.success === true) {
                showNotification('Penerimaan berhasil ditambahkan', 'success');

                // Close upload popup
                closeUploadPopup();

                // Remove editing row from main table
                $('.editing-row').remove();

                // Clear temp data
                clearTempReceivingData();

                // Refresh data
                setTimeout(() => {
                    refreshReceivingData();
                    muatUlangData();
                }, 1000);

            } else {
                showAlert(response.message || 'Gagal menambahkan penerimaan', 'Error');
            }
        },
        error: function (xhr, status, error) {
            console.error('Save error:', error);
            console.error('Response:', xhr.responseText);

            // Parse error response
            let errorMessage = 'Terjadi kesalahan saat menyimpan';
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
            $('#btn_submit_penerimaan').prop('disabled', false).text('SIMPAN');
        }
    });
}

// =========================================
// VIEW BUKTI FUNCTIONS
// =========================================

/**
 * View bukti penerimaan
 */
function viewBuktiPenerimaan(id_detail_pengiriman) {

    // Find the delivery data
    const delivery = RECEIVING_STATE.receivingList.find(r => r.id == id_detail_pengiriman);

    if (!delivery) {
        showAlert('Data penerimaan tidak ditemukan', 'Error');
        return;
    }

    // Populate viewer popup
    $('#viewer_tanggal_penerimaan').text(formatDateShow(delivery.tanggal_diterima));
    $('#viewer_jumlah_penerimaan').text(formatNumber(delivery.jumlah_diterima) + ' pcs');
    $('#viewer_nama_penerima').text(delivery.nama_penerima || '-');

    // Handle bukti penerimaan (foto)
    if (delivery.bukti_penerimaan_url) {
        $('#viewer_bukti_penerimaan_img').attr('src', delivery.bukti_penerimaan_url);
        $('#viewer_bukti_penerimaan_download').attr('href', delivery.bukti_penerimaan_url);
        $('#viewer_bukti_penerimaan_area').show();
        $('#viewer_bukti_penerimaan_empty').hide();
    } else {
        $('#viewer_bukti_penerimaan_area').hide();
        $('#viewer_bukti_penerimaan_empty').show();
    }

    // Handle bukti dokumen
    if (delivery.bukti_dokumen_penerimaan_url) {
        const fileName = delivery.bukti_dokumen_penerimaan_url.split('/').pop();
        const fileExt = fileName.split('.').pop().toLowerCase();

        $('#viewer_bukti_dokumen_name').text(fileName);
        $('#viewer_bukti_dokumen_download').attr('href', delivery.bukti_dokumen_penerimaan_url);

        // Show preview if image, show icon if PDF
        if (['jpg', 'jpeg', 'png'].includes(fileExt)) {
            $('#viewer_bukti_dokumen_img').attr('src', delivery.bukti_dokumen_penerimaan_url).show();
            $('#viewer_bukti_dokumen_icon').hide();
        } else {
            $('#viewer_bukti_dokumen_img').hide();
            $('#viewer_bukti_dokumen_icon').show();
        }

        $('#viewer_bukti_dokumen_area').show();
        $('#viewer_bukti_dokumen_empty').hide();
    } else {
        $('#viewer_bukti_dokumen_area').hide();
        $('#viewer_bukti_dokumen_empty').show();
    }

    // Open viewer popup
    if (typeof app !== 'undefined') {
        app.popup.open('.popup-viewer-penerimaan');
    }
}

// =========================================
// EVENT LISTENERS FOR POPUP CLOSE
// =========================================

/**
 * Initialize popup event listeners
 * Panggil fungsi ini saat aplikasi dimulai
 */
function initializeReceivingPopupListeners() {
    if (typeof app !== 'undefined') {
        // Listen to popup close events
        app.popup.on('closed', '.popup-penerimaan', function () {
            // Cleanup when main popup closes
            $('.editing-row').remove();
            clearTempReceivingData();
        });

        app.popup.on('closed', '.popup-upload-penerimaan', function () {
            // Cleanup when upload popup closes without saving
            $('#input_nama_penerima').val('');
            clearBuktiPenerimaan();
            clearBuktiDokumen();
        });
    }
}

// Auto-initialize when document is ready
$(document).ready(function () {
    initializeReceivingPopupListeners();
});