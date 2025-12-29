/**
 * =========================================
 * PARTNER PAGE MANAGEMENT
 * =========================================
 */

// =========================================
// VARIABLES & CONSTANTS
// =========================================
const CONFIG = {
    itemsPerPage: 20,
    apiEndpoint: '/api/partner',
    apiMaterialEndpoint: '/api/partner/material',
    apiDeleteEndpoint: '/api/partner/delete',
    apiAddMaterialEndpoint: '/api/partner/material/add',
    refreshInterval: 30000,
    maxPaginationButtons: 5
};

let STATE = {
    currentPage: 1,
    totalData: 0,
    partnerData: [],
    filteredData: [],
    isLoading: false,
    currentPartnerId: null,
    materialData: [],
    // State untuk form tambah material
    materialForm: {
        id_partner_transaksi: null,
        nama_partner: null,
        spk: null
    }
};

// =========================================
// HELPER FUNCTIONS
// =========================================

/**
 * Membersihkan string untuk pencarian
 */
function sanitizeString(str) {
    if (!str) return '';
    return str.toString().toLowerCase().trim();
}

/**
 * Format nomor urut dengan padding
 */
function formatNumber(num) {
    return num.toString().padStart(3, '0');
}

/**
 * Membersihkan prefix dari ID
 */
function removePrefix(str, prefix = 'INV_') {
    if (!str) return '-';
    return str.toString().replace(prefix, '').replace(/^0/, '');
}

/**
 * Format angka dengan separator ribuan
 */
function formatNumber(num) {
    if (!num) return '0';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/**
 * Format mata uang Rupiah
 */
function formatCurrency(amount) {
    if (!amount) return 'Rp 0';
    return 'Rp ' + formatNumber(amount);
}

/**
 * Format tanggal ke format Indonesia: "10 Des 2024"
 * @param {string|Date} date - Tanggal yang akan diformat (format: YYYY-MM-DD atau Date object)
 * @returns {string} Tanggal dalam format "10 Des 2024"
 */
function formatDateIndonesia(date) {
    if (!date) return '-';

    // Array nama bulan dalam bahasa Indonesia (singkat)
    const bulanIndonesia = [
        'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
        'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
    ];

    try {
        // Parse tanggal menggunakan moment.js jika tersedia
        if (typeof moment !== 'undefined') {
            const m = moment(date);
            if (!m.isValid()) return '-';

            const tanggal = m.date();
            const bulan = bulanIndonesia[m.month()];
            const tahun = m.year();

            return `${tanggal} ${bulan} ${tahun}`;
        }

        // Fallback jika moment.js tidak tersedia
        const d = new Date(date);
        if (isNaN(d.getTime())) return '-';

        const tanggal = d.getDate();
        const bulan = bulanIndonesia[d.getMonth()];
        const tahun = d.getFullYear();

        return `${tanggal} ${bulan} ${tahun}`;
    } catch (error) {
        console.error('Error formatting date:', error);
        return '-';
    }
}

/**
 * Membuat HTML untuk baris tabel
 */
function createTableRow(data, index) {
    return `
        <tr>
            <td class="label-cell text-align-left text-no-wrap" style="min-width: 100px !important;">${(moment(data.penjualan_tanggal).format('DDMMYY') + '-' + removePrefix(data.penjualan_id)) || '-'}</td>
            <td class="label-cell">${data.nama_partner || '-'}</td>
            <td class="label-cell text-no-wrap" style="min-width: 100px !important;">${formatDateIndonesia(data.tgl_deadline)}</td>
            <td class="label-cell display-flex justify-content-space-between align-items-center">
                <button class="popup-open text-add-colour-black-soft bg-dark-gray-young button-small button text-bold" 
                    data-popup=".popup-material" style="width: 116px; margin-right: 4px;"
                    onclick="lihatMaterial('${data.id_partner_transaksi}', '${data.nama_partner}', '${removePrefix(data.penjualan_id)}')">
                    Material
                </button>
                <button class="text-add-colour-black-soft bg-dark-gray-young button-small button text-bold" style="width: 116px;"
                    onclick="hapusData('${data.id_partner_transaksi}', '${data.nama_partner}')">
                    Penerimaan
                </button>
            </td>
        </tr>
    `;
}

/**
 * Membuat HTML untuk baris material
 */
function createMaterialRow(material, index) {
    return `
        <tr>
            <td class="label-cell text-align-center">${index + 1}</td>
            <td class="label-cell">${material.nama_material || '-'}</td>
            <td class="label-cell text-align-center">${formatNumber(material.jumlah || 0)}</td>
            <td class="label-cell text-align-right">${formatCurrency(material.harga || 0)}</td>
            <td class="label-cell text-align-right">${formatCurrency(material.total || 0)}</td>
        </tr>
    `;
}

/**
 * Membuat HTML untuk tombol paginasi sederhana
 */
function createPaginationButtons(currentPage, totalPages) {
    if (totalPages <= 1) return '';

    let html = '<div class="segmented segmented-raised" style="margin: 10px 0; min-width: max-content; display: inline-flex;">';

    // Tombol Previous
    if (currentPage > 1) {
        html += `<button class="button button-outline text-add-colour-white" style="display: flex; align-items: center; border-color: #686665 !important;" onclick="goToPage(${currentPage - 1})">
            <i class="f7-icons">chevron_left</i> Previous
        </button>`;
    } else {
        html += `<button class="button button-outline text-add-colour-white disabled" style="opacity: 0.3; display: flex; align-items: center; border-color: #686665 !important;">
            <i class="f7-icons">chevron_left</i> Previous
        </button>`;
    }

    // Info halaman
    html += `<button class="button text-add-colour-white" style="background-color: #686665;">${currentPage} / ${totalPages}</button>`;

    // Tombol Next
    if (currentPage < totalPages) {
        html += `<button class="button button-outline text-add-colour-white" style="display: flex; align-items: center; border-color: #686665 !important;" onclick="goToPage(${currentPage + 1})">
            Next <i class="f7-icons">chevron_right</i>
        </button>`;
    } else {
        html += `<button class="button button-outline text-add-colour-white disabled" style="opacity: 0.3; display: flex; align-items: center; border-color: #686665 !important;">
            Next <i class="f7-icons">chevron_right</i>
        </button>`;
    }

    html += '</div>';
    return html;
}

/**
 * Menampilkan loading indicator
 */
function showLoading(show = true) {
    STATE.isLoading = show;
    if (typeof app !== 'undefined' && app.preloader) {
        if (show) {
            app.preloader.show();
        } else {
            app.preloader.hide();
        }
    }
}

/**
 * Menampilkan notifikasi
 */
function showNotification(message, type = 'success') {
    if (typeof app !== 'undefined' && app.toast) {
        const color = type === 'success' ? 'green' : 'red';
        app.toast.create({
            text: message,
            position: 'center',
            closeTimeout: 2000,
            cssClass: `bg-color-${color}`
        }).open();
    } else {
        console.log(`[${type.toUpperCase()}] ${message}`);
    }
}

// =========================================
// DATA MANAGEMENT FUNCTIONS
// =========================================

/**
 * Mengambil data partner dari server
 */
function fetchPartnerData() {
    showLoading(true);

    jQuery.ajax({
        url: BASE_API_DEV + CONFIG.apiEndpoint,
        method: 'GET',
        contentType: 'application/json',
        success: function (result) {
            console.log("Raw Response:", result);

            STATE.partnerData = result.data || [];
            STATE.filteredData = [...STATE.partnerData];
            STATE.totalData = STATE.partnerData.length;

            console.log("Partner Data Length:", STATE.partnerData.length);

            renderData();
            showNotification('Data berhasil dimuat', 'success');
        },
        error: function (xhr, status, error) {
            console.error('Error Status:', status);
            console.error('Error Message:', error);
            console.error('Response:', xhr.responseText);
            showNotification('Gagal memuat data', 'error');
        },
        complete: function () {
            showLoading(false);
        }
    });
}

/**
 * Mengambil data material partner
 */
function fetchMaterialData(partnerId) {
    showLoading(true);

    jQuery.ajax({
        url: BASE_API_DEV + CONFIG.apiMaterialEndpoint + '/' + partnerId,
        method: 'GET',
        contentType: 'application/json',
        success: function (result) {
            console.log("Material Response:", result);

            STATE.materialData = result.data || [];
            renderMaterialPopup();
            showNotification('Data material berhasil dimuat', 'success');
        },
        error: function (xhr, status, error) {
            console.error('Error fetching material:', error);
            STATE.materialData = [];
            renderMaterialPopup();
            showNotification('Gagal memuat data material', 'error');
        },
        complete: function () {
            showLoading(false);
        }
    });
}

/**
 * Filter data berdasarkan pencarian perusahaan
 */
function filterDataByCompany(searchTerm) {
    const search = sanitizeString(searchTerm);

    if (search === '') {
        STATE.filteredData = [...STATE.partnerData];
    } else {
        STATE.filteredData = STATE.partnerData.filter(item => {
            const company = sanitizeString(item.nama_partner || '');
            const kota = sanitizeString(item.kota || '');
            const spk = sanitizeString(item.penjualan_id || '');

            return company.includes(search) ||
                kota.includes(search) ||
                spk.includes(search);
        });
    }

    STATE.currentPage = 1;
    renderData();
}

/**
 * Mendapatkan data untuk halaman tertentu
 */
function getPageData(page) {
    const startIndex = (page - 1) * CONFIG.itemsPerPage;
    const endIndex = startIndex + CONFIG.itemsPerPage;
    return STATE.filteredData.slice(startIndex, endIndex);
}

/**
 * Menghitung total halaman
 */
function getTotalPages() {
    return Math.ceil(STATE.filteredData.length / CONFIG.itemsPerPage);
}

// =========================================
// RENDERING FUNCTIONS
// =========================================

/**
 * Render data ke tabel
 */
function renderData() {
    const tableBody = $$('#data_partner');
    const paginationContainer = $$('#tombol_paginasi');
    const dataCountElement = $$('#jumlah_data_partner');

    if (tableBody.length === 0) {
        console.error('Element data_partner tidak ditemukan!');
        return;
    }

    if (dataCountElement.length > 0) {
        dataCountElement.text(`${STATE.filteredData.length} Partner`);
    }

    const totalPages = getTotalPages();
    const pageData = getPageData(STATE.currentPage);
    const startIndex = (STATE.currentPage - 1) * CONFIG.itemsPerPage;

    // Render tabel
    if (pageData.length === 0) {
        tableBody.html(`
            <tr>
                <td colspan="4" class="text-align-center" style="padding: 40px;">
                    ${STATE.partnerData.length === 0 ?
                `<div class="text-color-gray">
                    <i class="f7-icons" style="font-size: 64px; display: block; margin-bottom: 10px;">tray</i>
                    <p style="font-size: 16px; margin: 0;">Tidak ada data</p>
                </div>` :
                `<div class="text-color-gray">
                    <i class="f7-icons" style="font-size: 64px; display: block; margin-bottom: 10px;">magnifyingglass</i>
                    <p style="font-size: 16px; margin: 0;">Tidak ada hasil pencarian</p>
                </div>`}
                </td>
            </tr>
        `);
    } else {
        tableBody.html(pageData.map((item, index) =>
            createTableRow(item, startIndex + index)
        ).join(''));
    }

    // Render pagination
    if (paginationContainer.length > 0) {
        if (totalPages > 1) {
            const paginationHTML = createPaginationButtons(STATE.currentPage, totalPages);
            paginationContainer.html(`
                ${paginationHTML}
                <div class="block-footer" style="margin-top: 5px;">
                    <p style="margin: 0; color: #8e8e93;">
                        Menampilkan ${startIndex + 1}-${Math.min(startIndex + pageData.length, STATE.filteredData.length)} 
                        dari ${STATE.filteredData.length} data
                    </p>
                </div>
            `);
        } else {
            paginationContainer.html(`
                <div class="block-footer" style="margin: 10px 0;">
                    ${STATE.filteredData.length > 0 ?
                    `<p style="margin: 0; color: #8e8e93;">Menampilkan ${STATE.filteredData.length} data</p>` :
                    ''}
                </div>
            `);
        }
    }

    console.log(`Rendered page ${STATE.currentPage}/${totalPages} with ${pageData.length} items`);
}

/**
 * Render popup material
 */
function renderMaterialPopup() {
    // Cari container untuk konten material
    const popupContent = $$('.popup-material .card-content .list');

    if (popupContent.length === 0) {
        console.error('Popup material content tidak ditemukan!');
        return;
    }

    // Hitung total
    const totalAmount = STATE.materialData.reduce((sum, item) => sum + (item.total || 0), 0);

    // Generate baris material
    const materialRows = STATE.materialData.length > 0
        ? STATE.materialData.map((item, index) => createMaterialRow(item, index)).join('')
        : `<tr><td colspan="5" class="text-align-center" style="padding: 20px; color: #999;">
            <i class="f7-icons" style="font-size: 48px;">cube_box</i><br>
            Tidak ada data material
           </td></tr>`;

    // Footer total
    const footerHTML = STATE.materialData.length > 0 ? `
        <tfoot>
            <tr class="bg-dark-gray-young">
                <td colspan="4" class="label-cell text-align-right"><strong>TOTAL KESELURUHAN</strong></td>
                <td class="label-cell text-align-right"><strong>${formatCurrency(totalAmount)}</strong></td>
            </tr>
        </tfoot>
    ` : '';

    // HTML lengkap untuk konten popup
    const contentHTML = `
        <ul>
            <li class="item-content">
                <div class="item-inner">
                    <div class="item-title">Nama Partner</div>
                    <div class="item-after"><strong id="popup_nama_partner">-</strong></div>
                </div>
            </li>
            <li class="item-content">
                <div class="item-inner">
                    <div class="item-title">No. SPK</div>
                    <div class="item-after"><strong id="popup_spk_partner">-</strong></div>
                </div>
            </li>
        </ul>
        
        <div class="card-content margin-half" style="overflow-x: auto;">
            <button class="popup-open button button-small text-add-colour-black-soft bg-dark-gray-young text-bold margin-bottom-half" style="height: 36px !important;" data-popup=".popup-tambah-material">Tambah Material</button>
            <table align="center" cellspacing="1" cellpadding="1" style="width: 100%;">
                <thead class="bg-dark-gray-medium text-align-center">
                    <tr>
                        <th class="label-cell text-align-center" style="width: 60px;">No</th>
                        <th class="label-cell text-align-center">Material</th>
                        <th class="label-cell text-align-center" style="width: 100px;">Qty</th>
                        <th class="label-cell text-align-center" style="width: 150px;">Harga</th>
                        <th class="label-cell text-align-center" style="width: 150px;">Total</th>
                    </tr>
                </thead>
                <tbody id="material_table_body">
                    ${materialRows}
                </tbody>
                ${footerHTML}
            </table>
        </div>
    `;

    // Update konten popup
    popupContent.html(contentHTML);
}

/**
 * Update marquee
 */
function initMarqueeText() {
    // Cek apakah BASE_API terdefinisi, jika tidak gunakan BASE_API_DEV
    const apiUrl = typeof BASE_API !== 'undefined';

    jQuery.ajax({
        type: 'POST',
        url: apiUrl + "/get-surat-jalan-produksi",
        dataType: 'JSON',
        data: {
            karyawan_id: localStorage.getItem("user_id"),
            lokasi_pabrik: localStorage.getItem("lokasi_pabrik_surat")
        },
        beforeSend: function () {
            // Set loading text saat request dimulai
            jQuery("#data_surat_jalan_berjalan").html('Memuat data...');
        },
        success: function (data) {
            console.log("Marquee Data Response:", data);

            var data_produksi = '';

            // Cek apakah data valid dan ada isinya
            if (data && data.data && data.data.length > 0) {
                var nota = '';
                var idx = 0;

                jQuery.each(data.data, function (i, val) {
                    var kurang_bayar = parseFloat(val.penjualan_grandtotal - val.penjualan_jumlah_pembayaran);

                    if (kurang_bayar <= 0) {
                        if (nota != val.penjualan_id) {
                            nota = val.penjualan_id;

                            // Tambah separator jika bukan data pertama
                            if (idx != 0) {
                                data_produksi += ' &nbsp; &nbsp; <span style="color:black; font-weight:bold">|</span> &nbsp;  ';
                            }
                            idx++;

                            // Format tanggal dengan cek moment.js
                            var tanggal = '';
                            if (typeof moment !== 'undefined') {
                                tanggal = moment(val.penjualan_tanggal).format('DDMMYY') + '-';
                            } else {
                                // Fallback manual jika moment.js tidak ada
                                var date = new Date(val.penjualan_tanggal);
                                tanggal = ('0' + date.getDate()).slice(-2) +
                                    ('0' + (date.getMonth() + 1)).slice(-2) +
                                    date.getFullYear().toString().slice(-2) + '-';
                            }

                            // Format ID - PERBAIKAN: hapus backslash di regex
                            var formattedId = val.penjualan_id.replace(/INV_/g, '').replace(/^0+/, '');

                            // Gabungkan semua data
                            data_produksi += tanggal + formattedId + ' - ' + val.client_nama;
                        }
                    }
                });

                // Update marquee dengan hasil atau "Tidak Ada Data" jika kosong
                jQuery("#data_surat_jalan_berjalan").html(data_produksi || 'Tidak Ada Data');
            } else {
                jQuery("#data_surat_jalan_berjalan").html('Tidak Ada Data');
            }
        },
        error: function (xhr, status, error) {
            console.error('Error loading marquee:', {
                status: status,
                error: error,
                response: xhr.responseText
            });
            jQuery("#data_surat_jalan_berjalan").html('Gagal memuat data');
        }
    });
}

// =========================================
// EVENT HANDLERS
// =========================================

/**
 * Handler untuk pencarian perusahaan
 */
function cariPerusahaan() {
    const input = $$('#filter_perusahaan_partner');
    if (input.length > 0) {
        filterDataByCompany(input.val());
    }
}

/**
 * Handler untuk muat ulang data
 */
function muatUlangData() {
    const input = $$('#filter_perusahaan_partner');
    if (input.length > 0) {
        input.val('');
    }
    fetchPartnerData();
}

/**
 * Handler untuk pindah halaman
 */
function goToPage(page) {
    const totalPages = getTotalPages();

    if (page < 1 || page > totalPages) {
        console.warn(`Invalid page: ${page}. Valid range: 1-${totalPages}`);
        return;
    }

    STATE.currentPage = page;
    renderData();

    // Smooth scroll ke atas
    $$('html, body').animate({ scrollTop: 0 }, 300);
}

/**
 * Handler untuk melihat material partner
 */
function lihatMaterial(partnerId, namaPartner, spk) {
    STATE.currentPartnerId = partnerId;

    // Fetch data material dan update popup
    fetchMaterialData(partnerId);

    // Set info partner di popup setelah render
    setTimeout(() => {
        $$('#popup_nama_partner').text(namaPartner || '-');
        $$('#popup_spk_partner').text(spk || '-');
    }, 1000);
}

// =========================================
// POPUP CONTROL FUNCTIONS
// =========================================

/**
 * Tutup popup material detail (parent popup)
 */
function tutupPopupMaterial() {
    if (typeof app !== 'undefined') {
        // Tutup hanya popup material
        app.popup.close('.popup-material', true);
        console.log('Popup material ditutup');
    }
}

/**
 * Tutup popup tambah material (child popup)
 */
function tutupPopupTambahMaterial() {
    if (typeof app !== 'undefined') {
        // Tutup hanya popup tambah material
        app.popup.close('.popup-tambah-material', true);
        console.log('Popup tambah material ditutup');
    }
}

/**
 * Tutup semua popup yang terbuka
 */
function tutupSemuaPopup() {
    if (typeof app !== 'undefined') {
        // Tutup popup tambah material dulu (yang paling atas)
        app.popup.close('.popup-tambah-material', false);
        // Kemudian tutup popup material
        setTimeout(() => {
            app.popup.close('.popup-material', false);
        }, 300); // Delay untuk smooth animation
        console.log('Semua popup ditutup');
    }
}

// =========================================
// TAMBAH MATERIAL FUNCTIONS
// =========================================

/**
 * Buka popup tambah material
 */
function bukaFormTambahMaterial(partnerId, namaPartner, spk) {
    console.log('Buka form tambah material:', { partnerId, namaPartner, spk });

    // Simpan state
    STATE.materialForm.id_partner_transaksi = partnerId;
    STATE.materialForm.nama_partner = namaPartner;
    STATE.materialForm.spk = spk;

    // Update info partner di form
    $$('#form_nama_partner').text(namaPartner || '-');
    $$('#form_spk_partner').text(spk || '-');

    // Reset form
    resetFormMaterial();

    // Buka popup
    if (typeof app !== 'undefined') {
        app.popup.open('.popup-tambah-material');
    }
}

/**
 * Reset form tambah material
 */
function resetFormMaterial() {
    $$('#input_nama_material').val('');
    $$('#input_jumlah_material').val('1');
    $$('#input_harga_material').val('0');
    $$('#input_kategori_material').val('');
    $$('#preview_total_harga').text('Rp 0');
}

/**
 * Hitung dan update preview total harga
 */
function updatePreviewTotalHarga() {
    const jumlah = parseInt($$('#input_jumlah_material').val()) || 0;
    const harga = parseInt($$('#input_harga_material').val()) || 0;
    const total = jumlah * harga;

    $$('#preview_total_harga').text(formatCurrency(total));
}

/**
 * Validasi form material
 */
function validateFormMaterial() {
    const namaMaterial = $$('#input_nama_material').val().trim();
    const jumlah = parseInt($$('#input_jumlah_material').val()) || 0;
    const harga = parseInt($$('#input_harga_material').val()) || 0;

    const errors = [];

    if (!namaMaterial) {
        errors.push('Nama material harus diisi');
    }

    if (namaMaterial.length > 255) {
        errors.push('Nama material maksimal 255 karakter');
    }

    if (jumlah < 1) {
        errors.push('Jumlah minimal 1');
    }

    if (harga < 0) {
        errors.push('Harga tidak boleh negatif');
    }

    return {
        valid: errors.length === 0,
        errors: errors
    };
}

/**
 * Simpan material baru
 */
function simpanMaterial() {
    console.log('Simpan material...');

    // Validasi form
    const validation = validateFormMaterial();

    if (!validation.valid) {
        showNotification(validation.errors.join('<br>'), 'error');
        return;
    }

    // Pastikan id_partner_transaksi ada
    if (!STATE.materialForm.id_partner_transaksi) {
        showNotification('ID Partner Transaksi tidak ditemukan', 'error');
        return;
    }

    // Ambil data dari form
    const namaMaterial = $$('#input_nama_material').val().trim();
    const jumlah = parseInt($$('#input_jumlah_material').val());
    const harga = parseInt($$('#input_harga_material').val());
    const kategori = $$('#input_kategori_material').val().trim();

    // Prepare data untuk dikirim
    const postData = {
        id_partner_transaksi: STATE.materialForm.id_partner_transaksi,
        nama: namaMaterial,
        jumlah: jumlah,
        harga: harga
    };

    // Tambahkan kategori jika ada
    if (kategori && !isNaN(parseInt(kategori))) {
        postData.id_kategori_material = parseInt(kategori);
    }

    console.log('Data yang akan dikirim:', postData);

    // Konfirmasi sebelum simpan
    if (typeof app !== 'undefined') {
        app.dialog.confirm(
            `Simpan material: <strong>${namaMaterial}</strong><br>` +
            `Jumlah: ${formatNumber(jumlah)}<br>` +
            `Harga: ${formatCurrency(harga)}<br>` +
            `Total: ${formatCurrency(jumlah * harga)}`,
            'Konfirmasi Simpan',
            function () {
                // User klik OK
                executeSaveMaterial(postData);
            }
        );
    } else {
        executeSaveMaterial(postData);
    }
}

/**
 * Eksekusi penyimpanan material ke server
 */
function executeSaveMaterial(postData) {
    showLoading(true);

    jQuery.ajax({
        url: BASE_API_DEV + CONFIG.apiAddMaterialEndpoint,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(postData),
        success: function (result) {
            console.log('Save material response:', result);

            if (result.success) {
                showNotification('Material berhasil ditambahkan', 'success');

                // Reset form terlebih dahulu
                resetFormMaterial();

                // Tutup popup tambah material dengan benar
                tutupPopupTambahMaterial();

                // Refresh data material di popup detail setelah popup ditutup
                setTimeout(() => {
                    if (STATE.materialForm.id_partner_transaksi) {
                        fetchMaterialData(STATE.materialForm.id_partner_transaksi);
                    }
                }, 400); // Delay untuk menunggu popup close animation selesai
            } else {
                showNotification(result.message || 'Gagal menyimpan material', 'error');
            }
        },
        error: function (xhr, status, error) {
            console.error('Error saving material:', error);
            console.error('Response:', xhr.responseText);

            let errorMessage = 'Gagal menyimpan material';

            try {
                const response = JSON.parse(xhr.responseText);
                if (response.message) {
                    errorMessage = response.message;
                }
                if (response.errors) {
                    const errorList = Object.values(response.errors).flat();
                    errorMessage += '<br>' + errorList.join('<br>');
                }
            } catch (e) {
                console.error('Error parsing response:', e);
            }

            showNotification(errorMessage, 'error');
        },
        complete: function () {
            showLoading(false);
        }
    });
}

/**
 * Setup event listeners untuk form material
 */
function setupMaterialFormListeners() {
    // Auto calculate total harga saat input berubah
    $$('#input_jumlah_material, #input_harga_material').on('input', function () {
        updatePreviewTotalHarga();
    });

    // Prevent negative values
    $$('#input_jumlah_material').on('input', function () {
        const val = parseInt($$(this).val());
        if (val < 1) {
            $$(this).val(1);
        }
    });

    $$('#input_harga_material').on('input', function () {
        const val = parseInt($$(this).val());
        if (val < 0) {
            $$(this).val(0);
        }
    });

    console.log('Material form listeners setup complete');
}

/**
 * Handler untuk hapus data partner
 */
function hapusData(partnerId, namaPartner) {
    console.log('Hapus data partner:', partnerId);

    if (typeof app === 'undefined') {
        console.error('Framework7 app tidak tersedia');
        return;
    }

    // Konfirmasi hapus
    app.dialog.confirm(
        `Apakah Anda yakin ingin menghapus data partner:<br><strong>${namaPartner}</strong>?`,
        'Konfirmasi Hapus',
        function () {
            // User klik OK
            executeDelete(partnerId, namaPartner);
        },
        function () {
            // User klik Cancel
            console.log('Hapus dibatalkan');
        }
    );
}

/**
 * Eksekusi penghapusan data
 */
function executeDelete(partnerId, namaPartner) {
    showLoading(true);

    jQuery.ajax({
        url: BASE_API_DEV + CONFIG.apiDeleteEndpoint + '/' + partnerId,
        method: 'DELETE',
        contentType: 'application/json',
        success: function (result) {
            console.log('Delete response:', result);

            showNotification(`Data partner ${namaPartner} berhasil dihapus`, 'success');

            // Refresh data
            fetchPartnerData();
        },
        error: function (xhr, status, error) {
            console.error('Error deleting:', error);
            console.error('Response:', xhr.responseText);

            showNotification('Gagal menghapus data', 'error');
        },
        complete: function () {
            showLoading(false);
        }
    });
}

// =========================================
// INITIALIZATION
// =========================================

/**
 * Inisialisasi halaman partner
 */
function initPartnerPage() {
    console.log('Initializing Partner Page...');

    // Reset state
    STATE.currentPage = 1;
    STATE.partnerData = [];
    STATE.filteredData = [];
    STATE.totalData = 0;
    STATE.currentPartnerId = null;
    STATE.materialData = [];
    STATE.materialForm = {
        id_partner_transaksi: null,
        nama_partner: null,
        spk: null
    };

    // Update marquee
    initMarqueeText();

    // Fetch data
    fetchPartnerData();

    // Setup event listeners
    const searchInput = $$('#filter_perusahaan_partner');
    if (searchInput.length > 0) {
        searchInput.off('keyup').on('keyup', cariPerusahaan);
    }

    // Setup material form listeners
    setupMaterialFormListeners();

    console.log('Partner Page initialized successfully');
}

// Auto initialize jika DOM sudah ready
jQuery(document).ready(function () {
    if (jQuery('[data-name="partner-page"]').length > 0) {
        initPartnerPage();
    }
});