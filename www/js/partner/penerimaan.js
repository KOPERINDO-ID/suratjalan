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
// RECEIVING TABLE FUNCTIONS
// =========================================

/**
 * Membuka modal penerimaan dengan data dari API
 */
function openReceivingModal(id_partner_transaksi, partner_name = '') {
    console.log('Opening receiving modal for partner transaksi:', id_partner_transaksi);

    if (!id_partner_transaksi) {
        showAlert('ID Partner Transaksi tidak valid', 'Error');
        return;
    }

    // Load receiving data from API
    loadReceivingData(id_partner_transaksi);

    // Open modal
    if (typeof app !== 'undefined') {
        app.popup.open('.popup-penerimaan');
    }
}

/**
 * Load data penerimaan dari API
 */
function loadReceivingData(id_partner_transaksi) {
    console.log('Loading receiving data for ID:', id_partner_transaksi);

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
            console.log('Receiving data loaded:', response);

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
                console.log('No receiving data found - rendering empty table');
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
    console.log('Populating receiving header:', data);

    // Data adalah array dari response.data
    const headerData = data[0] || {};

    RECEIVING_STATE.currentPartnerName = headerData.nama || '-';
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
    console.log('Rendering receiving table:', receivings);

    const tbody = $('#receiving_table_body');
    tbody.empty();

    if (!receivings || receivings.length === 0) {
        renderEmptyReceivingTable();
        return;
    }

    RECEIVING_STATE.receivingList = receivings;

    console.log('Populating', RECEIVING_STATE.receivingList);

    receivings.forEach((item, index) => {
        const row = createReceivingRow(item, index + 1);
        tbody.append(row);
    });

    console.log('Receiving table rendered with', receivings.length, 'rows');
}

/**
 * Render empty receiving table
 */
function renderEmptyReceivingTable() {
    const tbody = $('#receiving_table_body');
    tbody.empty();

    const emptyRow = `
        <tr id="empty_receiving_row">
            <td colspan="5" align="center" style="padding: 20px; border: 1px solid #ddd;">
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
                ${formatDateShow(item.tanggal_diterima)}
            </td>
            <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">
                ${formatNumber(item.jumlah_diterima)}
            </td>
            <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">
                ${formatNumber(item.jumlah_belum_diterima || remaining)}
            </td>
            <td class="display-flex justify-content-space-between align-items-center" 
                style="padding: 8px; border: 1px solid #ddd;">
                <button class="button button-small button-fill color-blue text-bold" 
                    onclick="viewBuktiPenerimaan('${item.id}')" 
                    style="width: 116px;">
                    BUKTI
                </button>
            </td>
        </tr>
    `;
}

/**
 * Update receiving count
 */
function updateReceivingCount(count) {
    $('#receiving_count').text(count + ' item');
}

/**
 * Refresh receiving data
 */
function refreshReceivingData() {
    console.log('Refreshing receiving data...');

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
    console.log('Adding new receiving row...');

    // Remove any existing editing row
    $('.editing-row').remove();

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
            <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">-</td>
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
                    style="width: 100%; padding: 4px; border: 1px solid #ddd; border-radius: 4px;" />
            </td>
            <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">
                ${formatNumber(remaining)}
            </td>
            <td class="display-flex flex-direction-row justify-content-space-between align-items-center" style="padding: 8px; border: 1px solid #ddd;">
                <button class="button button-small button-fill bg-color-green" 
                    onclick="saveReceivingRow()" 
                    style="margin-right: 4px;">
                    <i class="f7-icons">checkmark</i>
                </button>
                <button class="button button-small button-fill bg-color-red" 
                    onclick="cancelReceivingRow()" >
                    <i class="f7-icons">xmark</i>
                </button>
            </td>
        </tr>
    `;

    $('#receiving_table_body').prepend(newRow);
    $('#input_jumlah_terima').focus();
}

/**
 * Cancel receiving row
 */
function cancelReceivingRow() {
    $('.editing-row').remove();
}

/**
 * Save new receiving row - Open upload popup
 */
function saveReceivingRow() {
    console.log('Preparing receiving data for upload...');

    const tanggal = $('#input_tanggal_terima').val();
    const jumlah = $('#input_jumlah_terima').val();

    // Validation
    if (!tanggal) {
        showAlert('Tanggal harus diisi', 'Perhatian');
        return;
    }

    if (!jumlah || parseInt(jumlah) <= 0) {
        showAlert('Jumlah harus lebih dari 0', 'Perhatian');
        return;
    }

    // Calculate remaining
    const totalReceived = RECEIVING_STATE.receivingList
        .reduce((sum, r) => sum + parseInt(r.jumlah_diterima || 0), 0);
    const remaining = RECEIVING_STATE.currentQuantity - totalReceived;

    if (parseInt(jumlah) > remaining) {
        showAlert(`Jumlah tidak boleh lebih dari ${remaining}`, 'Perhatian');
        return;
    }

    // Check if we have id_partner_transaksi_detail
    if (!RECEIVING_STATE.currentPartnerTransaksiId) {
        showAlert('ID Partner Transaksi tidak ditemukan', 'Error');
        return;
    }

    // Get username dari localStorage untuk nama_penerima
    const namaPenerima = localStorage.getItem('username') || 'Unknown';

    // Calculate jumlah_belum_diterima
    const jumlahDiterima = parseInt(jumlah);
    const jumlahBelumDiterima = remaining - jumlahDiterima;

    // Store temp data
    RECEIVING_STATE.tempReceivingData = {
        id_partner_transaksi: RECEIVING_STATE.currentPartnerTransaksiId,
        tanggal_diterima: tanggal,
        jumlah_diterima: jumlahDiterima,
        jumlah_belum_diterima: jumlahBelumDiterima,
        nama_penerima: namaPenerima
    };

    console.log('Temp data stored:', RECEIVING_STATE.tempReceivingData);

    // Populate upload popup
    $('#upload_tanggal_display').text(formatDateShow(tanggal));
    $('#upload_jumlah_display').text(formatNumber(jumlahDiterima) + ' pcs');
    $('#upload_penerima_display').text(namaPenerima);

    // Reset file inputs
    clearBuktiPenerimaan();
    clearBuktiDokumen();

    // Open upload popup
    if (typeof app !== 'undefined') {
        app.popup.open('.popup-upload-penerimaan');
    }
}

// =========================================
// UPLOAD FUNCTIONS
// =========================================

/**
 * Handle bukti penerimaan file selection
 */
$(document).on('change', '#input_bukti_penerimaan', function (e) {
    const file = e.target.files[0];

    if (!file) {
        return;
    }

    console.log('Bukti penerimaan selected:', file.name);

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
        showAlert('File harus berformat JPG, JPEG, atau PNG', 'Error');
        $(this).val('');
        return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
        showAlert('Ukuran file maksimal 5MB', 'Error');
        $(this).val('');
        return;
    }

    // Preview image
    const reader = new FileReader();
    reader.onload = function (e) {
        $('#preview_bukti_penerimaan_img').attr('src', e.target.result);
        $('#preview_bukti_penerimaan_empty').hide();
        $('#preview_bukti_penerimaan_area').show();
    };
    reader.readAsDataURL(file);
});

/**
 * Handle bukti dokumen file selection
 */
$(document).on('change', '#input_bukti_dokumen_penerimaan', function (e) {
    const file = e.target.files[0];

    if (!file) {
        return;
    }

    console.log('Bukti dokumen selected:', file.name);

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
        showAlert('File harus berformat JPG, PNG, atau PDF', 'Error');
        $(this).val('');
        return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
        showAlert('Ukuran file maksimal 5MB', 'Error');
        $(this).val('');
        return;
    }

    // Show file info
    $('#preview_bukti_dokumen_name').text(file.name);
    $('#preview_bukti_dokumen_empty').hide();
    $('#preview_bukti_dokumen_area').show();
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
    console.log('Submitting penerimaan with files...');

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
        console.log('Bukti penerimaan attached:', buktiFotoInput.files[0].name);
    }

    // Add bukti dokumen if selected
    const buktiDokumenInput = document.getElementById('input_bukti_dokumen_penerimaan');
    if (buktiDokumenInput && buktiDokumenInput.files[0]) {
        formData.append('bukti_dokumen_penerimaan', buktiDokumenInput.files[0]);
        console.log('Bukti dokumen attached:', buktiDokumenInput.files[0].name);
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
            console.log('Save response:', response);

            if (response.success === true) {
                showNotification('Penerimaan berhasil ditambahkan', 'success');

                // Close upload popup
                if (typeof app !== 'undefined') {
                    app.popup.close('.popup-upload-penerimaan');
                }

                // Remove editing row from main table
                $('.editing-row').remove();

                // Clear temp data
                RECEIVING_STATE.tempReceivingData = null;

                // Refresh data
                setTimeout(() => {
                    refreshReceivingData();
                }, 300);

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
            $('#btn_submit_penerimaan').prop('disabled', false);
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
    console.log('Viewing bukti penerimaan for ID:', id_detail_pengiriman);
    console.log('Current receiving list:', RECEIVING_STATE.receivingList);

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