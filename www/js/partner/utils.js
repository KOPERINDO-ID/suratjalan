/**
 * =========================================
 * PARTNER COMMON HELPER FUNCTIONS
 * =========================================
 * Fungsi-fungsi helper yang digunakan di partner, material, dan penerimaan
 */

// =========================================
// FORMAT HELPERS
// =========================================

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
 * Format tanggal ke format dd/mm/yyyy
 */
function formatDate(dateString) {
    if (!dateString) return '-';

    let date = new Date(dateString);
    let day = ('0' + date.getDate()).slice(-2);
    let month = ('0' + (date.getMonth() + 1)).slice(-2);
    let year = date.getFullYear();

    return `${year}-${month}-${day}`;
}

/**
 * Format tanggal untuk ditampilkan (format: "10 Des 25")
 */
function formatDateShow(dateString) {
    if (!dateString) return '-';

    const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
        'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
    ];

    let date = new Date(dateString);
    let day = date.getDate();
    let month = monthNames[date.getMonth()];
    let year = date.getFullYear().toString().slice(-2);

    return `${day} ${month} ${year}`;
}

/**
 * Format tanggal ke format Indonesia: "10 Des 2024"
 */
function formatDateIndonesia(date) {
    if (!date) return '-';

    const bulanIndonesia = [
        'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
        'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
    ];

    try {
        if (typeof moment !== 'undefined') {
            const m = moment(date);
            if (!m.isValid()) return '-';

            const tanggal = m.date();
            const bulan = bulanIndonesia[m.month()];
            const tahun = m.year();

            return `${tanggal} ${bulan} ${tahun}`;
        }

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
 * Format SPK Code dari penjualan_id dan tanggal
 */
function formatSPKCode(penjualan_id, tanggal) {
    if (!penjualan_id || !tanggal) return '-';

    let id = String(penjualan_id).replace(/^INV_/i, '');
    id = parseInt(id, 10).toString();

    const date = new Date(tanggal);
    const dd = ('0' + date.getDate()).slice(-2);
    const mm = ('0' + (date.getMonth() + 1)).slice(-2);
    const yy = date.getFullYear().toString().slice(-2);

    return `${dd}${mm}${yy}-${id}`;
}

/**
 * Membersihkan prefix dari ID
 */
function removePrefix(str, prefix = 'INV_') {
    if (!str) return '-';
    return str.toString().replace(prefix, '').replace(/^0/, '');
}

// =========================================
// UI HELPERS
// =========================================

/**
 * Menampilkan loading indicator
 */
function showLoading(show = true) {
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

/**
 * Menampilkan alert dialog
 */
function showAlert(message, title = 'Perhatian') {
    if (typeof app !== 'undefined' && app.dialog) {
        app.dialog.alert(message, title);
    } else {
        alert(`${title}: ${message}`);
    }
}

/**
 * Menampilkan confirm dialog
 */
function showConfirm(message, title = 'Konfirmasi', callback) {
    if (typeof app !== 'undefined' && app.dialog) {
        app.dialog.confirm(message, title, callback);
    } else {
        if (confirm(`${title}: ${message}`)) {
            callback();
        }
    }
}

/**
 * Membersihkan string untuk pencarian
 */
function sanitizeString(str) {
    if (!str) return '';
    return str.toString().toLowerCase().trim();
}