/**
 * =========================================
 * MATERIAL MANAGEMENT FUNCTIONS
 * =========================================
 * Fungsi untuk mengelola material partner
 * CATATAN: Helper functions ada di partner-common.js
 */

// =========================================
// GLOBAL VARIABLES & CONSTANTS
// =========================================

let PURCHASE_STATE = {
    currentPerformaId: null,
    currentPenjualanId: null,
    currentClientId: null,
    currentSpkCode: null,
    currentClientName: null,
    currentQuantity: 0,
    currentItem: null,
    currentTanggalKirim: null,
    partnerList: [],
    purchaseList: [],
    purchaseDetailList: []
};

let MATERIAL_STATE = {
    currentPartnerTransaksiId: null,
    currentPartnerName: null,
    currentItem: null,
    currentJumlah: 0,
    materialList: [],
    tempMaterialRow: null
};

// =========================================
// MATERIAL TABLE FUNCTIONS
// =========================================

/**
 * Membuka modal material dengan data dari API
 */
function openMaterialModal(id_partner_transaksi, partner_name = '') {
    console.log('Opening material modal for partner transaksi:', id_partner_transaksi);

    // Validasi
    if (!id_partner_transaksi) {
        showAlert('ID Partner Transaksi tidak valid', 'Error');
        return;
    }

    // Load material data from API
    loadMaterialData(id_partner_transaksi);

    // Open modal
    if (typeof app !== 'undefined') {
        app.popup.open('.popup-material');
    }
}

/**
 * Load data material dari API
 */
function loadMaterialData(id_partner_transaksi) {
    console.log('Loading material data for ID:', id_partner_transaksi);

    MATERIAL_STATE.currentPartnerTransaksiId = id_partner_transaksi;

    $.ajax({
        type: "POST",
        url: BASE_API + "/material",
        dataType: 'json',
        data: {
            id_partner_transaksi: id_partner_transaksi
        },
        beforeSend: function () {
            showLoading(true);
        },
        success: function (response) {
            console.log('Material data loaded:', response);

            PURCHASE_STATE.currentItem = response.data.partner_info?.item || '-';
            PURCHASE_STATE.currentQuantity = response.data.partner_info?.penjualan_qty || 0;

            if (response.success === true && response.data) {
                // Populate header info
                populateMaterialHeader(response.data);

                // Render material table
                renderMaterialTable(response.data.material);

                // Update material count
                updateMaterialCount(response.data.total_items || 0);

            } else {
                showAlert(response.message || 'Gagal memuat data material', 'Error');
                // Render empty table
                renderEmptyMaterialTable();
            }
        },
        error: function (xhr, status, error) {
            console.error('Error loading material data:', error);
            console.error('Response:', xhr.responseText);

            // Check if 404 (no data found)
            if (xhr.status === 404) {
                console.log('No material data found - rendering empty table');
                renderEmptyMaterialTable();
                updateMaterialCount(0);
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
 * Populate material header information
 */
function populateMaterialHeader(data) {
    console.log('Populating material header:', data);

    if (data.partner_info) {
        const partnerInfo = data.partner_info;

        console.log('Partner Info:', partnerInfo);

        MATERIAL_STATE.currentPartnerName = partnerInfo.nama_partner || '-';
        PURCHASE_STATE.currentItem = partnerInfo.item || '-';

        // Set partner name
        $('#material-partner-name').text(partnerInfo.nama_partner || '-');

        // Set SPK code from penjualan_id
        if (partnerInfo.penjualan_id) {
            // Assuming you have the date from somewhere, otherwise use today's date
            const spkCode = formatSPKCode(partnerInfo.penjualan_id, new Date());

            PURCHASE_STATE.currentSpkCode = spkCode;

            $('#material-spk-code').text(spkCode);
        }
    }

    // Set quantity badge (could be sum of material quantities or from partner_info)
    // const totalQty = data.material ? data.material.reduce((sum, item) => sum + parseInt(item.jumlah || 0), 0) : 0;
    const totalQty = data.partner_info.penjualan_qty || 0;
    $('#material-quantity').text(totalQty + ' pcs');
}

/**
 * Render material table
 */
function renderMaterialTable(materials) {
    console.log('Rendering material table:', materials);

    const tbody = $('#material_table_body');
    tbody.empty();

    if (!materials || materials.length === 0) {
        renderEmptyMaterialTable();
        return;
    }

    materials.forEach((item, index) => {
        const row = createMaterialRow(item, index + 1);
        tbody.append(row);
    });

    console.log('Material table rendered with', materials.length, 'rows');
}

/**
 * Render empty material table
 */
function renderEmptyMaterialTable() {
    const tbody = $('#material_table_body');
    tbody.empty();

    const emptyRow = `
        <tr>
            <td colspan="6" align="center" style="padding: 20px; border: 1px solid #ddd;">
                <i class="f7-icons" style="font-size: 40px; color: #999;">cube_box</i>
                <p style="color: #999; margin-top: 10px;">Belum ada data material</p>
            </td>
        </tr>
    `;

    tbody.append(emptyRow);
}

/**
 * Create material table row
 */
function createMaterialRow(item, rowNumber) {
    const tanggal = formatDateShow(item.dt_created);
    const materialName = item.nama || '-';
    const jumlah = formatNumber(item.jumlah || 0);
    const harga = formatNumber(item.harga || 0);
    const total = formatNumber(item.total_harga || 0);

    // ========== PHOTO BUTTON - SIMPLIFIED ==========
    let photoButton = '';
    if (item.foto_bukti_material) {
        const photoUrl = item.foto_bukti_material;

        photoButton = `
            <button class="button button-small button-fill color-blue text-bold" 
                    onclick="viewMaterialPhoto('${photoUrl}')" 
                    style="margin-right: 4px; width: 116px;">
                        DETAIL
            </button>
        `;
    }

    const row = `
        <tr data-id="${item.id}">
            <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">${rowNumber}</td>
            <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">${tanggal}</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${materialName}</td>
            <td style="padding: 8px; text-align: right; border: 1px solid #ddd;">${jumlah}</td>
            <td style="padding: 8px; text-align: right; border: 1px solid #ddd;">${harga}</td>
            <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">
                ${photoButton}
            </td>
        </tr>
    `;

    return row;
}
/**
 * Update material count
 */
function updateMaterialCount(count) {
    $('#material_count').text(count + ' item');
}

/**
 * Add new material row (inline editing)
 */
function addMaterialRow() {
    console.log('Adding new material row');

    // Validasi
    if (!MATERIAL_STATE.currentPartnerTransaksiId) {
        showAlert('ID Partner Transaksi tidak tersedia', 'Error');
        return;
    }

    // Check if there's already an editing row
    if ($('.editing-row').length > 0) {
        showAlert('Selesaikan penambahan material yang sedang berlangsung', 'Perhatian');
        return;
    }

    // Remove empty placeholder if exists
    $('#material_table_body tr').each(function () {
        if ($(this).find('td[colspan="6"]').length > 0) {
            $(this).remove();
        }
    });

    // Create new editable row
    const newRow = createEditableMaterialRow();
    $('#material_table_body').prepend(newRow);

    // Focus on first input
    $('#input_material_nama').focus();

    console.log('Editable row added');
}

/**
 * Create editable material row for adding new material
 */
function createEditableMaterialRow(item = null) {
    const isEdit = item !== null;
    const rowId = isEdit ? item.id : 'new';

    const tanggal = isEdit ? formatDate(item.dt_created) : formatDate(new Date());
    const materialName = isEdit ? item.nama : '';
    const jumlah = isEdit ? item.jumlah : '';
    const harga = isEdit ? item.harga : '';

    const row = `
        <tr class="editing-row" data-id="${rowId}">
            <td style="padding: 8px; text-align: center; border: 1px solid #ddd; background-color: #FFF9E6;">
                <i class="f7-icons" style="color: #FFA500;">pencil_circle_fill</i>
            </td>
            <td style="padding: 8px; border: 1px solid #ddd; background-color: #FFF9E6;">
                <input type="date" 
                       class="form-control" 
                       id="input_material_tanggal" 
                       value="${tanggal}"
                       style="width: 100%; padding: 4px; border: 1px solid #ccc; border-radius: 4px;">
            </td>
            <td style="padding: 8px; border: 1px solid #ddd; background-color: #FFF9E6;">
                <input type="text" 
                       class="form-control" 
                       id="input_material_nama" 
                       placeholder="Nama Material"
                       value="${materialName}"
                       style="width: 100%; padding: 4px; border: 1px solid #ccc; border-radius: 4px;">
            </td>
            <td style="padding: 8px; border: 1px solid #ddd; background-color: #FFF9E6;">
                <input type="number" 
                       class="form-control" 
                       id="input_material_jumlah" 
                       placeholder="Jumlah"
                       value="${jumlah}"
                       min="0"
                       style="width: 100%; padding: 4px; border: 1px solid #ccc; border-radius: 4px;">
            </td>
            <td style="padding: 8px; border: 1px solid #ddd; background-color: #FFF9E6;">
                <input type="number" 
                       class="form-control" 
                       id="input_material_harga" 
                       placeholder="Harga"
                       value="${harga}"
                       min="0"
                       style="width: 100%; padding: 4px; border: 1px solid #ccc; border-radius: 4px;">
            </td>
            <td class="display-flex flex-direction-row justify-content-space-between align-items-center" style="padding: 8px; text-align: center; border: 1px solid #ddd; background-color: #FFF9E6;">
                <button class="button button-small button-fill color-green" style="margin-right: 4px;"
                        onclick="saveMaterialRow()">
                    <i class="f7-icons" style="font-size: 16px;">checkmark</i>
                </button>
                <button class="button button-small button-fill color-red" 
                        onclick="cancelMaterialRow()">
                    <i class="f7-icons" style="font-size: 16px;">xmark</i>
                </button>
            </td>
        </tr>
    `;

    return row;
}

/**
 * Save material row (add new or update existing)
 */
function saveMaterialRow() {
    console.log('Saving material row');

    // Get values
    const nama = $('#input_material_nama').val().trim();
    const jumlah = parseInt($('#input_material_jumlah').val()) || 0;
    const harga = parseInt($('#input_material_harga').val()) || 0;

    // Validation
    if (!nama) {
        showAlert('Nama material harus diisi', 'Perhatian');
        $('#input_material_nama').focus();
        return;
    }

    if (jumlah <= 0) {
        showAlert('Jumlah harus lebih dari 0', 'Perhatian');
        $('#input_material_jumlah').focus();
        return;
    }

    if (harga <= 0) {
        showAlert('Harga harus lebih dari 0', 'Perhatian');
        $('#input_material_harga').focus();
        return;
    }

    // Calculate total
    const total_harga = jumlah * harga;

    // Prepare data
    const materialData = {
        id_partner_transaksi: MATERIAL_STATE.currentPartnerTransaksiId,
        nama: nama,
        jumlah: jumlah,
        harga: harga,
        total_harga: total_harga
    };

    console.log('Material data to save:', materialData);

    // Check if editing existing row
    const rowId = $('.editing-row').data('id');
    if (rowId && rowId !== 'new') {
        materialData.id = rowId;
        updateMaterialToServer(materialData);
    } else {
        // Open photo upload popup
        openPhotoUploadPopup(materialData);
    }
}

/**
 * Open photo upload popup
 */
function openPhotoUploadPopup(materialData) {
    console.log('Opening photo upload popup');

    // Save temp data
    MATERIAL_STATE.tempMaterialRow = materialData;

    // Initialize Header Data
    $('#photo-spk-code').text(PURCHASE_STATE.currentSpkCode);
    $('#photo-partner-name').text(MATERIAL_STATE.currentPartnerName);
    $('#photo-purchase-qty').text(PURCHASE_STATE.currentQuantity + ' pcs');

    // Initialize Table Data
    $('#photo_type_purchase_tbl').text(PURCHASE_STATE.currentItem);
    $('#photo_qty_purchase_tbl').text(PURCHASE_STATE.currentQuantity);
    $('#photo_selesai_purchase_tbl').text(MATERIAL_STATE.currentJumlah);

    // Reset upload form
    $('#photo_upload_input').val('');
    $('#photo_preview').attr('src', '');
    $('#photo_empty_placeholder').show();
    $('#photo_preview_area').hide();
    $('#btn_upload_photo').hide();

    // Open popup
    if (typeof app !== 'undefined') {
        app.popup.open('.popup-photo-upload');
    }
}

/**
 * Cancel material row editing
 */
function cancelMaterialRow() {
    console.log('Canceling material row');

    showConfirm(
        'Batalkan penambahan material?',
        'Konfirmasi',
        function () {
            $('.editing-row').remove();

            // Check if table is empty
            if ($('#material_table_body tr').length === 0) {
                renderEmptyMaterialTable();
            }

            console.log('Material row cancelled');
        }
    );
}

/**
 * Edit material row
 */
function editMaterialRow(id) {
    console.log('Editing material row:', id);

    // Check if there's already an editing row
    if ($('.editing-row').length > 0) {
        showAlert('Selesaikan pengeditan yang sedang berlangsung', 'Perhatian');
        return;
    }

    // Find material in state
    const material = MATERIAL_STATE.materialList.find(item => item.id === id);

    if (!material) {
        showAlert('Data material tidak ditemukan', 'Error');
        return;
    }

    console.log('Material to edit:', material);

    // Find and replace the row
    const targetRow = $(`#material_table_body tr[data-id="${id}"]`);
    if (targetRow.length > 0) {
        const editableRow = createEditableMaterialRow(material);
        targetRow.replaceWith(editableRow);
        $('#input_material_nama').focus();
    }
}

/**
 * Update material to server
 */
function updateMaterialToServer(materialData) {
    console.log('Updating material to server:', materialData);

    $.ajax({
        type: 'POST',
        url: BASE_API + '/material/update-partner-material',
        data: materialData,
        dataType: 'json',
        beforeSend: function () {
            showLoading(true);
        },
        success: function (response) {
            console.log('Update response:', response);

            if (response.status == 1 || response.success === true) {
                showNotification('Material berhasil diupdate', 'success');

                // Remove editing row
                $('.editing-row').remove();

                // Refresh material data
                refreshMaterialData();
            } else {
                showAlert(response.message || 'Gagal mengupdate material', 'Error');
            }
        },
        error: function (xhr, status, error) {
            console.error('Update error:', error);
            showAlert('Terjadi kesalahan saat mengupdate material', 'Error');
        },
        complete: function () {
            showLoading(false);
        }
    });
}

/**
 * Delete material row
 */
function deleteMaterialRow(id) {
    console.log('Deleting material row:', id);

    showConfirm(
        'Hapus material ini?',
        'Konfirmasi Hapus',
        function () {
            $.ajax({
                type: 'POST',
                url: BASE_API + '/material/delete-partner-material',
                data: {
                    id: id
                },
                dataType: 'json',
                beforeSend: function () {
                    showLoading(true);
                },
                success: function (response) {
                    console.log('Delete response:', response);

                    if (response.status == 1 || response.success === true) {
                        showNotification('Material berhasil dihapus', 'success');

                        // Refresh material data
                        refreshMaterialData();
                    } else {
                        showAlert(response.message || 'Gagal menghapus material', 'Error');
                    }
                },
                error: function (xhr, status, error) {
                    console.error('Delete error:', error);
                    showAlert('Terjadi kesalahan saat menghapus material', 'Error');
                },
                complete: function () {
                    showLoading(false);
                }
            });
        }
    );
}

// =========================================
// PHOTO UPLOAD FUNCTIONS
// =========================================

/**
 * Handle photo selection
 */
$(document).on('change', '#photo_upload_input', function (e) {
    console.log('=== PHOTO SELECTED ===');

    const file = e.target.files[0];

    if (!file) {
        console.log('✗ No file selected');
        return;
    }

    console.log('File:', file.name, file.size, file.type);

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
        console.log('✗ Invalid file type:', file.type);
        showAlert('File harus berformat JPG, JPEG, atau PNG', 'Error');
        $(this).val('');
        return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
        console.log('✗ File too large:', file.size);
        showAlert('Ukuran file maksimal 5MB', 'Error');
        $(this).val('');
        return;
    }

    console.log('✓ File validation passed');

    // Preview image
    const reader = new FileReader();

    reader.onload = function (e) {
        console.log('✓ File loaded for preview');
        $('#photo_preview').attr('src', e.target.result);
        $('#photo_empty_placeholder').hide();
        $('#photo_preview_area').show();
        $('#btn_upload_photo').show();
        console.log('✓ Preview displayed');
    };

    reader.onerror = function (e) {
        console.error('✗ Error reading file:', e);
        showAlert('Gagal membaca file', 'Error');
    };

    reader.readAsDataURL(file);
    console.log('Reading file...');
});

/**
 * Upload material with photo
 */
function uploadMaterialPhoto() {
    console.log('=== UPLOAD MATERIAL PHOTO ===');

    const fileInput = document.getElementById('photo_upload_input');
    const file = fileInput ? fileInput.files[0] : null;

    if (!file) {
        console.log('✗ No file selected');
        showAlert('Pilih foto terlebih dahulu', 'Perhatian');
        return;
    }

    if (!MATERIAL_STATE.tempMaterialRow) {
        console.error('✗ No temp material data');
        showAlert('Data material tidak tersedia', 'Error');
        return;
    }

    console.log('File:', file.name);
    console.log('Temp data:', MATERIAL_STATE.tempMaterialRow);

    // Prepare form data
    const formData = new FormData();
    formData.append('id_partner_transaksi', MATERIAL_STATE.tempMaterialRow.id_partner_transaksi);
    formData.append('nama', MATERIAL_STATE.tempMaterialRow.nama);
    formData.append('jumlah', MATERIAL_STATE.tempMaterialRow.jumlah);
    formData.append('harga', MATERIAL_STATE.tempMaterialRow.harga);
    formData.append('total_harga', MATERIAL_STATE.tempMaterialRow.total_harga);
    formData.append('foto_bukti_material', file);

    console.log('FormData prepared');

    // Upload
    $.ajax({
        type: 'POST',
        url: BASE_API + '/material/add-partner-material',
        data: formData,
        processData: false,
        contentType: false,
        dataType: 'json',
        beforeSend: function (xhr) {
            console.log('Sending upload request...');
            showLoading(true);
            $('#btn_upload_photo').prop('disabled', true).text('Uploading...');
        },
        success: function (response) {
            console.log('=== UPLOAD SUCCESS ===');
            console.log('Response:', response);

            if (response.status == 1 || response.success === true) {
                console.log('✓ Material saved successfully');
                showNotification('Material berhasil ditambahkan', 'success');

                // Close upload popup
                if (typeof app !== 'undefined' && app.popup) {
                    console.log('Closing upload popup...');
                    app.popup.close('.popup-photo-upload');
                }

                // Remove editing row
                $('.editing-row').remove();
                console.log('✓ Editing row removed');

                // Clear temp data
                MATERIAL_STATE.tempMaterialRow = null;
                console.log('✓ Temp data cleared');

                // Refresh material data
                console.log('Refreshing material data...');
                refreshMaterialData();

            } else {
                console.error('✗ Save failed:', response.message);
                showAlert(response.message || 'Gagal menambahkan material', 'Error');
            }
        },
        error: function (xhr, status, error) {
            console.error('=== UPLOAD ERROR ===');
            console.error('Status:', status);
            console.error('Error:', error);
            console.error('Response:', xhr.responseText);

            showAlert('Terjadi kesalahan saat upload', 'Error');
        },
        complete: function () {
            console.log('Upload request complete');
            showLoading(false);
            $('#btn_upload_photo').prop('disabled', false).text('Upload Foto');
        }
    });
}

/**
 * View material photo
 */
function viewMaterialPhoto(photoUrl) {
    console.log('=== VIEW MATERIAL PHOTO ===');
    console.log('Photo URL:', photoUrl);

    if (!photoUrl) {
        showAlert('Foto tidak tersedia', 'Info');
        return;
    }

    const url = BASE_API.slice(0, -3) + photoUrl;

    // ✅ URL sudah lengkap dari backend, tidak perlu concat lagi
    $('#photo_viewer_image').attr('src', url);

    // Set download link
    $('#photo_download_link').attr('href', url);

    // Open popup
    if (typeof app !== 'undefined' && app.popup) {
        app.popup.open('.popup-photo-viewer');
    } else {
        window.open(url, '_blank');
    }
}
/**
 * Refresh material data
 * VERSI YANG SUDAH DIPERBAIKI
 */
function refreshMaterialData() {
    console.log('=== REFRESH MATERIAL DATA ===');

    if (!MATERIAL_STATE.currentPartnerTransaksiId) {
        console.error('✗ No currentPartnerTransaksiId');
        showAlert('ID Partner Transaksi tidak tersedia', 'Error');
        return;
    }

    console.log('Refreshing for ID:', MATERIAL_STATE.currentPartnerTransaksiId);

    // Call loadMaterialData
    loadMaterialData(MATERIAL_STATE.currentPartnerTransaksiId);

    // Show notification
    showNotification('Data material diperbarui', 'success');

    console.log('=== REFRESH MATERIAL DATA COMPLETE ===');
}