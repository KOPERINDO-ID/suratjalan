/**
 * =========================================
 * PARTNER PAGE MANAGEMENT
 * =========================================
 */

// =========================================
// GLOBAL VARIABLES & CONSTANTS
// =========================================
const CONFIG = {
    itemsPerPage: 20,
    apiEndpoint: '/partner',
    apiMaterialEndpoint: '/material',
    apiAddMaterialEndpoint: '/material/add-partner-material',
    refreshInterval: 30000,
    maxPaginationButtons: 5
};

let STATE = {
    currentPage: 1,
    totalData: 0,
    partnerData: [],
    filteredData: [],
    historyData: [],
    isLoading: false,
    currentPartnerId: null,
    materialData: [],
    materialForm: {
        id_partner_transaksi: null,
        nama_partner: null,
        spk: null
    },
    materialSementara: []
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
function formatNumberPadding(num) {
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
            <td class="label-cell text-no-wrap" style="text-align: left !important; min-width: 150px !important;">${data.client_nama || '-'}</td>
            <td class="label-cell text-no-wrap" style="text-align: left !important; min-width: 150px !important;">${data.nama_partner || '-'}</td>
            <td class="label-cell text-no-wrap" style="min-width: 100px !important;">${formatDateIndonesia(data.tgl_deadline)}</td>
            <td class="label-cell display-flex justify-content-space-between align-items-center">
                ${data.jumlah != data.jumlah_diterima ? `
                    <button class="popup-open text-add-colour-black-soft bg-dark-gray-young button-small button text-bold" 
                    data-popup=".popup-material" style="width: 116px; margin-right: 4px;"
                    onclick="openMaterialModal('${data.id_partner_transaksi}', '${data.nama_partner}')">
                    Material
                </button>
                ` : ''}
                <button class="button-small button text-bold ${data.jumlah == data.jumlah_diterima ? 'text-add-colour-white bg-color-blue' : 'text-add-colour-black-soft bg-dark-gray-young'}" style="width: 116px;"
                    onclick="openReceivingModal('${data.id_partner_transaksi}', '${data.nama_partner}')">
                    ${data.jumlah == data.jumlah_diterima ? 'Bukti' : 'Terima'}
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

    let html = '<div class="segmented segmented-raised" style="margin-top: 8px; width: 100%; display: flex; justify-content: space-between;">';

    // Tombol Previous
    if (currentPage > 1) {
        html += `<button class="button button-outline text-add-colour-white" style="display: flex; align-items: center; border-color: #686665 !important; flex: 1;" onclick="goToPage(${currentPage - 1})">
            <i class="f7-icons">chevron_left</i> Previous
        </button>`;
    } else {
        html += `<button class="button button-outline text-add-colour-white disabled" style="opacity: 0.3; display: flex; align-items: center; border-color: #686665 !important; flex: 1;">
            <i class="f7-icons">chevron_left</i> Previous
        </button>`;
    }

    // Info halaman
    html += `<button class="button text-add-colour-white" style="background-color: #686665; flex: 1;">${currentPage} / ${totalPages}</button>`;

    // Tombol Next
    if (currentPage < totalPages) {
        html += `<button class="button button-outline text-add-colour-white" style="display: flex; align-items: center; border-color: #686665 !important; flex: 1;" onclick="goToPage(${currentPage + 1})">
            Next <i class="f7-icons">chevron_right</i>
        </button>`;
    } else {
        html += `<button class="button button-outline text-add-colour-white disabled" style="opacity: 0.3; display: flex; align-items: center; border-color: #686665 !important; flex: 1;">
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
        console.log(message);
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
        url: BASE_API + CONFIG.apiEndpoint,
        method: 'GET',
        contentType: 'application/json',
        success: function (result) {
            console.log('Data partner berhasil dimuat:', result);

            // Hitung tanggal 1 tahun yang lalu dari sekarang
            const sekarang = moment();
            const satuTahunLalu = moment().subtract(1, 'years');

            console.log('Tahun sekarang:', sekarang.year());
            console.log('Satu tahun lalu:', satuTahunLalu.format('YYYY-MM-DD'));

            // Filter data yang dt_record-nya dalam 1 tahun terakhir (tahun ini dan tahun lalu)
            const allData = result.data || [];
            STATE.partnerData = allData.filter(data => {
                if (!data.dt_record) return false;

                const dtRecord = moment(data.dt_record);
                // Data valid jika dt_record >= 1 tahun yang lalu
                return dtRecord.isAfter(satuTahunLalu) || dtRecord.isSame(satuTahunLalu);
            });

            console.log('Total data dari server:', allData.length);
            console.log('Data 1 tahun terakhir:', STATE.partnerData.length);

            // Pisahkan data aktif dan history berdasarkan filter
            STATE.filteredData = STATE.partnerData.filter(data => data.jumlah != data.jumlah_diterima);
            STATE.historyData = STATE.partnerData.filter(data => data.jumlah == data.jumlah_diterima);

            STATE.totalData = STATE.filteredData.length;

            console.log('Filtered data (aktif):', STATE.filteredData.length);
            console.log('History data (selesai):', STATE.historyData.length);

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
 * Render data ke tabel
 */
function renderData() {
    const tbody = $$('#data_partner');
    const jumlahDataCounter = $$('#jumlah_data_partner');
    const paginationContainer = $$('#tombol_paginasi');

    if (!tbody.length) {
        console.error('Element #data_partner tidak ditemukan');
        return;
    }

    // Hitung paginasi
    const totalPages = Math.ceil(STATE.totalData / CONFIG.itemsPerPage);
    const startIndex = (STATE.currentPage - 1) * CONFIG.itemsPerPage;
    const endIndex = Math.min(startIndex + CONFIG.itemsPerPage, STATE.totalData);

    // Ambil data untuk halaman saat ini
    const currentPageData = STATE.filteredData.slice(startIndex, endIndex);

    // Update counter jumlah data
    if (jumlahDataCounter.length) {
        jumlahDataCounter.text(STATE.totalData);
    }

    // Render rows
    if (currentPageData.length === 0) {
        tbody.html(`
            <tr>
                <td colspan="5" style="padding: 20px; text-align: center; color: #999;">
                    Tidak ada data partner
                </td>
            </tr>
        `);
    } else {
        let html = '';
        currentPageData.forEach((data, index) => {
            html += createTableRow(data, startIndex + index);
        });
        tbody.html(html);
    }

    // Render pagination
    if (paginationContainer.length) {
        paginationContainer.html(createPaginationButtons(STATE.currentPage, totalPages));
    }
}

/**
 * Fungsi untuk menampilkan popup history
 */
function historyData() {
    console.log('Opening history popup, data count:', STATE.historyData.length);

    // Update jumlah data history
    $$('#jumlah_history_data').text(STATE.historyData.length);

    // Render data history ke tabel
    const tbody = $$('#data_history_partner');

    if (STATE.historyData.length === 0) {
        tbody.html(`
            <tr>
                <td colspan="5" style="padding: 20px; text-align: center; color: #999;">
                    Tidak ada data history
                </td>
            </tr>
        `);
    } else {
        let html = '';
        STATE.historyData.forEach((data, index) => {
            html += createTableRow(data, index);
        });
        tbody.html(html);
    }

    // Buka popup
    if (typeof app !== 'undefined') {
        app.popup.open('.popup-history');
    }
}

/**
 * Pindah ke halaman tertentu
 */
function goToPage(page) {
    const totalPages = Math.ceil(STATE.totalData / CONFIG.itemsPerPage);

    if (page < 1 || page > totalPages) return;

    STATE.currentPage = page;
    renderData();

    // Scroll ke atas tabel
    const tableCard = $$('.card.border-actived');
    if (tableCard.length) {
        tableCard[0].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

/**
 * Pencarian/filter perusahaan
 */
function cariPerusahaan() {
    const searchTerm = sanitizeString($$('#filter_perusahaan_partner').val());

    if (!searchTerm) {
        // Jika search kosong, kembalikan ke data yang sudah difilter (tanpa history)
        STATE.filteredData = STATE.partnerData.filter(data => data.jumlah != data.jumlah_diterima);
    } else {
        // Filter data aktif (bukan history) berdasarkan pencarian
        const activeData = STATE.partnerData.filter(data => data.jumlah != data.jumlah_diterima);

        STATE.filteredData = activeData.filter(data => {
            const perusahaan = sanitizeString(data.client_nama);
            const partner = sanitizeString(data.nama_partner);
            const spk = sanitizeString(data.penjualan_id);

            return perusahaan.includes(searchTerm) ||
                partner.includes(searchTerm) ||
                spk.includes(searchTerm);
        });
    }

    STATE.totalData = STATE.filteredData.length;
    STATE.currentPage = 1;
    renderData();
}

/**
 * Muat ulang data
 */
function muatUlangData() {
    // Reset search input
    $$('#filter_perusahaan_partner').val('');

    // Reset ke halaman pertama
    STATE.currentPage = 1;

    // Fetch data baru
    fetchPartnerData();
}

// =========================================
// MATERIAL MANAGEMENT FUNCTIONS
// =========================================

/**
 * Mengambil data material partner dari server
 */
function fetchMaterialData(partnerId) {
    if (!partnerId) {
        console.error('Partner ID tidak valid');
        return;
    }

    showLoading(true);

    jQuery.ajax({
        url: `${BASE_API}${CONFIG.apiMaterialEndpoint}/${partnerId}`,
        method: 'GET',
        contentType: 'application/json',
        success: function (result) {
            console.log('Material data loaded:', result);

            STATE.materialData = result.data || [];
            renderMaterialData();
        },
        error: function (xhr, status, error) {
            console.error('Error fetching material:', error);
            console.error('Response:', xhr.responseText);

            // Tetap render tabel kosong
            STATE.materialData = [];
            renderMaterialData();

            showNotification('Gagal memuat data material', 'error');
        },
        complete: function () {
            showLoading(false);
        }
    });
}

/**
 * Render data material ke tabel popup
 */
function renderMaterialData() {
    const tbody = $$('#data_material_partner');
    const totalCounter = $$('#total_material_partner');

    if (!tbody.length) {
        console.error('Element #data_material_partner tidak ditemukan');
        return;
    }

    // Update jumlah total material
    if (totalCounter.length) {
        totalCounter.text(STATE.materialData.length);
    }

    // Render rows
    if (STATE.materialData.length === 0) {
        tbody.html(`
            <tr>
                <td colspan="5" style="padding: 20px; text-align: center; color: #999;">
                    Tidak ada data material
                </td>
            </tr>
        `);
    } else {
        let html = '';
        STATE.materialData.forEach((material, index) => {
            html += createMaterialRow(material, index);
        });
        tbody.html(html);
    }
}

/**
 * Buka modal material
 */
function openMaterialModal(partnerId, partnerName) {
    console.log('Opening material modal for partner:', partnerId, partnerName);

    STATE.currentPartnerId = partnerId;

    // Update judul modal dengan nama partner
    $$('#nama_partner_material').text(partnerName || '-');

    // Fetch dan tampilkan data material
    fetchMaterialData(partnerId);

    // Popup akan otomatis terbuka karena button memiliki class "popup-open"
}

/**
 * Buka popup tambah material
 */
function bukaPopupTambahMaterial() {
    console.log('Opening add material popup');

    // Ambil data partner yang sedang aktif
    const partnerData = STATE.partnerData.find(p => p.id_partner_transaksi === STATE.currentPartnerId);

    if (partnerData) {
        STATE.materialForm.id_partner_transaksi = partnerData.id_partner_transaksi;
        STATE.materialForm.nama_partner = partnerData.nama_partner;
        STATE.materialForm.spk = moment(partnerData.penjualan_tanggal).format('DDMMYY') + '-' + removePrefix(partnerData.penjualan_id);

        // Update info di popup
        $$('#info_nama_partner').text(STATE.materialForm.nama_partner || '-');
        $$('#info_spk').text(STATE.materialForm.spk || '-');
    }

    // Reset form dan material sementara
    resetFormMaterial();
    STATE.materialSementara = [];
    renderMaterialSementara();

    // Fokus ke input pertama setelah popup terbuka
    setTimeout(() => {
        $$('#input_nama_material').focus();
    }, 300);
}

/**
 * Tutup popup tambah material
 */
function tutupPopupTambahMaterial() {
    if (typeof app !== 'undefined') {
        app.popup.close('.popup-tambah-material');
    }

    // Reset state setelah popup ditutup
    setTimeout(() => {
        STATE.materialSementara = [];
        resetFormMaterial();
        renderMaterialSementara();
    }, 300);
}

/**
 * Buka modal penerimaan material
 */
function openReceivingModal(partnerId, partnerName) {
    console.log('Opening receiving modal for partner:', partnerId, partnerName);

    STATE.currentPartnerId = partnerId;

    // Update judul modal
    $$('#nama_partner_receiving').text(partnerName || '-');

    // Fetch data material untuk receiving
    fetchMaterialDataForReceiving(partnerId);

    // Buka popup menggunakan Framework7
    if (typeof app !== 'undefined') {
        app.popup.open('.popup-receiving');
    }
}

/**
 * Fetch material data untuk receiving modal
 */
function fetchMaterialDataForReceiving(partnerId) {
    if (!partnerId) return;

    showLoading(true);

    jQuery.ajax({
        url: `${BASE_API}${CONFIG.apiMaterialEndpoint}/${partnerId}`,
        method: 'GET',
        contentType: 'application/json',
        success: function (result) {
            STATE.materialData = result.data || [];
            renderReceivingMaterialData();
        },
        error: function (xhr, status, error) {
            console.error('Error fetching material for receiving:', error);
            STATE.materialData = [];
            renderReceivingMaterialData();
            showNotification('Gagal memuat data material', 'error');
        },
        complete: function () {
            showLoading(false);
        }
    });
}

/**
 * Render material data di receiving modal
 */
function renderReceivingMaterialData() {
    const tbody = $$('#data_receiving_material');

    if (!tbody.length) {
        console.error('Element #data_receiving_material tidak ditemukan');
        return;
    }

    if (STATE.materialData.length === 0) {
        tbody.html(`
            <tr>
                <td colspan="5" style="padding: 20px; text-align: center; color: #999;">
                    Tidak ada data material untuk diterima
                </td>
            </tr>
        `);
        return;
    }

    let html = '';
    STATE.materialData.forEach((material, index) => {
        const sisaBelumDiterima = (material.jumlah || 0) - (material.jumlah_diterima || 0);

        html += `
            <tr>
                <td class="label-cell text-align-center">${index + 1}</td>
                <td class="label-cell">${material.nama_material || '-'}</td>
                <td class="label-cell text-align-center">${formatNumber(material.jumlah || 0)}</td>
                <td class="label-cell text-align-center">${formatNumber(material.jumlah_diterima || 0)}</td>
                <td class="label-cell text-align-center">
                    <input type="number" 
                        class="input-receiving-qty" 
                        data-material-id="${material.id_partner_material}"
                        data-max-qty="${sisaBelumDiterima}"
                        min="0" 
                        max="${sisaBelumDiterima}"
                        value="0"
                        style="width: 80px; text-align: center; padding: 4px; border: 1px solid #ccc; border-radius: 4px;">
                </td>
            </tr>
        `;
    });

    tbody.html(html);
}

/**
 * Simpan data penerimaan material
 */
function simpanPenerimaanMaterial() {
    const receivingInputs = $$('.input-receiving-qty');

    if (receivingInputs.length === 0) {
        showNotification('Tidak ada material untuk diterima', 'error');
        return;
    }

    // Kumpulkan data penerimaan
    const receivingData = [];
    let hasData = false;

    receivingInputs.each(function () {
        const input = $$(this);
        const materialId = input.data('material-id');
        const qty = parseInt(input.val()) || 0;

        if (qty > 0) {
            hasData = true;
            receivingData.push({
                id_partner_material: materialId,
                jumlah_diterima: qty
            });
        }
    });

    if (!hasData) {
        showNotification('Belum ada material yang akan diterima', 'error');
        return;
    }

    // Konfirmasi
    if (typeof app !== 'undefined') {
        app.dialog.confirm(
            `Konfirmasi penerimaan ${receivingData.length} material?`,
            'Konfirmasi Penerimaan',
            function () {
                executeSavePenerimaan(receivingData);
            }
        );
    } else {
        executeSavePenerimaan(receivingData);
    }
}

/**
 * Eksekusi penyimpanan penerimaan material
 */
function executeSavePenerimaan(receivingData) {
    showLoading(true);

    const promises = receivingData.map(data => {
        return jQuery.ajax({
            url: `${BASE_API}/material/receive`,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data)
        });
    });

    Promise.all(promises)
        .then(results => {
            const successCount = results.filter(r => r.success).length;

            showNotification(
                `${successCount} material berhasil diterima`,
                'success'
            );

            // Tutup popup
            if (typeof app !== 'undefined') {
                app.popup.close('.popup-receiving');
            }

            // Refresh data
            setTimeout(() => {
                fetchPartnerData();
            }, 300);
        })
        .catch(error => {
            console.error('Error saving receiving:', error);
            showNotification('Gagal menyimpan penerimaan', 'error');
        })
        .finally(() => {
            showLoading(false);
        });
}

/**
 * Cancel receiving (placeholder function)
 */
function cancelReceiving() {
    // Function untuk compatibility dengan HTML yang ada
    console.log('Cancel receiving clicked');
}

// =========================================
// MATERIAL FORM FUNCTIONS
// =========================================

/**
 * Setup event listeners untuk form material
 */
function setupMaterialFormListeners() {
    // Event listener untuk input harga - format currency saat blur
    $$('#input_harga_material').on('blur', function () {
        const value = parseInt(this.value.replace(/\D/g, '')) || 0;
        this.value = value;
    });

    // Event listener untuk enter key di form
    $$('#input_nama_material, #input_jumlah_material, #input_harga_material').on('keypress', function (e) {
        if (e.which === 13) { // Enter key
            e.preventDefault();
            tambahMaterialKeList();
        }
    });
}

/**
 * Reset form material
 */
function resetFormMaterial() {
    $$('#input_nama_material').val('');
    $$('#input_jumlah_material').val('');
    $$('#input_harga_material').val('');
    $$('#input_keterangan_material').val('');
}

/**
 * Tambah material ke list sementara
 */
function tambahMaterialKeList() {
    // Ambil nilai dari form
    const namaMaterial = $$('#input_nama_material').val().trim();
    const jumlah = parseInt($$('#input_jumlah_material').val()) || 0;
    const harga = parseInt($$('#input_harga_material').val().replace(/\D/g, '')) || 0;
    const keterangan = $$('#input_keterangan_material').val().trim();

    // Validasi
    if (!namaMaterial) {
        showNotification('Nama material harus diisi', 'error');
        $$('#input_nama_material').focus();
        return;
    }

    if (jumlah <= 0) {
        showNotification('Jumlah harus lebih dari 0', 'error');
        $$('#input_jumlah_material').focus();
        return;
    }

    if (harga <= 0) {
        showNotification('Harga harus lebih dari 0', 'error');
        $$('#input_harga_material').focus();
        return;
    }

    // Hitung total
    const total = jumlah * harga;

    // Buat object material
    const material = {
        id: Date.now(), // Temporary ID
        nama: namaMaterial,
        jumlah: jumlah,
        harga: harga,
        total: total,
        keterangan: keterangan
    };

    // Tambahkan ke array sementara
    STATE.materialSementara.push(material);

    console.log('Material added to list:', material);

    // Render ulang tabel
    renderMaterialSementara();

    // Reset form untuk input berikutnya
    resetFormMaterial();

    // Fokus ke input nama material
    $$('#input_nama_material').focus();

    showNotification('Material ditambahkan ke list', 'success');
}

/**
 * Render tabel material sementara
 */
function renderMaterialSementara() {
    const tbody = $$('#tbody_material_sementara');
    const totalCounter = $$('#total_material_sementara');
    const grandTotal = $$('#grand_total_material');

    if (STATE.materialSementara.length === 0) {
        tbody.html(`
            <tr>
                <td colspan="6" style="padding: 20px; color: #999;">
                    Belum ada material ditambahkan
                </td>
            </tr>
        `);
        totalCounter.text('0 item');
        grandTotal.text('Rp 0');
        return;
    }

    let html = '';
    let totalKeseluruhan = 0;

    STATE.materialSementara.forEach((material, index) => {
        totalKeseluruhan += material.total;

        html += `
            <tr>
                <td style="padding: 8px;">${index + 1}</td>
                <td style="padding: 8px; text-align: left;">
                    ${material.nama}
                    ${material.keterangan ? '<br><small style="color: #999;">' + material.keterangan + '</small>' : ''}
                </td>
                <td style="padding: 8px;">${formatNumber(material.jumlah)}</td>
                <td style="padding: 8px; text-align: right;">${formatCurrency(material.harga)}</td>
                <td style="padding: 8px; text-align: right;">${formatCurrency(material.total)}</td>
                <td style="padding: 8px;">
                    <button class="button button-small button-fill bg-color-red" 
                        onclick="hapusMaterialSementara(${material.id})" 
                        style="margin: 0;">
                        <i class="f7-icons">trash</i>
                    </button>
                </td>
            </tr>
        `;
    });

    tbody.html(html);
    totalCounter.text(`${STATE.materialSementara.length} item`);
    grandTotal.text(formatCurrency(totalKeseluruhan));
}

/**
 * Hapus material dari list sementara
 */
function hapusMaterialSementara(materialId) {
    console.log('Deleting material:', materialId);

    // Cari index material
    const index = STATE.materialSementara.findIndex(m => m.id === materialId);

    if (index === -1) {
        showNotification('Material tidak ditemukan', 'error');
        return;
    }

    // Hapus dari array
    STATE.materialSementara.splice(index, 1);

    // Render ulang
    renderMaterialSementara();

    showNotification('Material dihapus dari list', 'success');
}

/**
 * Simpan semua material sementara ke server
 */
function simpanSemuaMaterial() {
    console.log('Saving all materials:', STATE.materialSementara);

    // Cek apakah ada material
    if (STATE.materialSementara.length === 0) {
        showNotification('Belum ada material yang ditambahkan', 'error');
        return;
    }

    // Pastikan id_partner_transaksi ada
    if (!STATE.materialForm.id_partner_transaksi) {
        showNotification('ID Partner Transaksi tidak ditemukan', 'error');
        return;
    }

    // Hitung grand total
    const grandTotal = STATE.materialSementara.reduce((sum, m) => sum + m.total, 0);

    // Konfirmasi sebelum simpan
    if (typeof app !== 'undefined') {
        app.dialog.confirm(
            `Simpan ${STATE.materialSementara.length} material ke database?<br>` +
            `Grand Total: ${formatCurrency(grandTotal)}`,
            'Konfirmasi Simpan',
            function () {
                // User klik OK
                executeSaveSemuaMaterial();
            }
        );
    } else {
        executeSaveSemuaMaterial();
    }
}

/**
 * Eksekusi penyimpanan semua material ke server
 */
function executeSaveSemuaMaterial() {
    showLoading(true);

    // Prepare data untuk dikirim (kirim satu per satu)
    const promises = STATE.materialSementara.map(material => {
        const postData = {
            id_partner_transaksi: STATE.materialForm.id_partner_transaksi,
            nama: material.nama,
            jumlah: material.jumlah,
            harga: material.harga
        };

        // Tambahkan keterangan jika ada
        if (material.keterangan) {
            postData.keterangan = material.keterangan;
        }

        return jQuery.ajax({
            url: BASE_API + CONFIG.apiAddMaterialEndpoint,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(postData)
        });
    });

    // Tunggu semua request selesai
    Promise.all(promises)
        .then(results => {
            console.log('Save results:', results);

            const successCount = results.filter(r => r.success).length;

            showNotification(
                `${successCount} dari ${STATE.materialSementara.length} material berhasil disimpan`,
                'success'
            );

            // Reset state
            STATE.materialSementara = [];
            resetFormMaterial();
            renderMaterialSementara();

            // Tutup popup tambah material
            tutupPopupTambahMaterial();

            // Refresh data material di popup detail setelah popup ditutup
            setTimeout(() => {
                if (STATE.materialForm.id_partner_transaksi) {
                    fetchMaterialData(STATE.materialForm.id_partner_transaksi);
                }
            }, 400);
        })
        .catch(error => {
            console.error('Error saving materials:', error);

            let errorMessage = 'Gagal menyimpan beberapa material';

            try {
                const response = JSON.parse(error.responseText);
                if (response.message) {
                    errorMessage = response.message;
                }
            } catch (e) {
                console.error('Error parsing response:', e);
            }

            showNotification(errorMessage, 'error');
        })
        .finally(() => {
            showLoading(false);
        });
}

// =========================================
// INITIALIZATION
// =========================================

/**
 * Inisialisasi halaman partner
 */
function initPartnerPage() {
    console.log('Initializing partner page...');

    // Reset state
    STATE.currentPage = 1;
    STATE.partnerData = [];
    STATE.filteredData = [];
    STATE.historyData = [];
    STATE.totalData = 0;
    STATE.currentPartnerId = null;
    STATE.materialData = [];
    STATE.materialForm = {
        id_partner_transaksi: null,
        nama_partner: null,
        spk: null
    };
    STATE.materialSementara = [];

    // Fetch data
    fetchPartnerData();

    // Setup event listeners
    const searchInput = $$('#filter_perusahaan_partner');
    if (searchInput.length > 0) {
        searchInput.off('keyup').on('keyup', cariPerusahaan);
    }

    // Setup material form listeners
    setupMaterialFormListeners();

    console.log('Partner page initialized');
}
