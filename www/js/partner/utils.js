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
 * Format angka untuk display dengan separator ribuan (1.234.567)
 * @param {number|string} num - Angka yang akan diformat
 * @returns {string} - Angka terformat dengan separator titik
 */
function formatNumberToDisplay(num) {
    if (!num && num !== 0) return '';
    // Hapus semua karakter non-digit
    let cleanNum = num.toString().replace(/\D/g, '');
    // Format dengan separator titik
    return cleanNum.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/**
 * Parse angka dari format display (1.234.567) ke angka biasa
 * @param {string} displayNum - Angka dalam format display dengan separator titik
 * @returns {number} - Angka tanpa separator
 */
function parseNumberFromDisplay(displayNum) {
    if (!displayNum) return 0;
    // Hapus semua titik separator
    let cleanNum = displayNum.toString().replace(/\./g, '');
    return parseInt(cleanNum, 10) || 0;
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
 * Format tanggal ke format display DD-MMM-YY (24-Des-25)
 * @param {string|Date} dateString - Tanggal yang akan diformat (format: YYYY-MM-DD)
 * @returns {string} - Tanggal dalam format "DD-MMM-YY"
 */
function formatDateToDisplay(dateString) {
    if (!dateString) return '';

    const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
        'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
    ];

    let date = new Date(dateString);
    let day = ('0' + date.getDate()).slice(-2);
    let month = monthNames[date.getMonth()];
    let year = date.getFullYear().toString().slice(-2);

    return `${day}-${month}-${year}`;
}

/**
 * Parse tanggal dari format display DD-MMM-YY ke YYYY-MM-DD
 * @param {string} displayDate - Tanggal dalam format "DD-MMM-YY" (24-Des-25)
 * @returns {string} - Tanggal dalam format "YYYY-MM-DD"
 */
function parseDateFromDisplay(displayDate) {
    if (!displayDate) return '';

    const monthNames = {
        'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'Mei': 4, 'Jun': 5,
        'Jul': 6, 'Agu': 7, 'Sep': 8, 'Okt': 9, 'Nov': 10, 'Des': 11
    };

    try {
        const parts = displayDate.split('-');
        if (parts.length !== 3) return '';

        const day = parseInt(parts[0], 10);
        const monthIndex = monthNames[parts[1]];
        const year = parseInt('20' + parts[2], 10); // Tambahkan '20' di depan tahun

        if (monthIndex === undefined) return '';

        const date = new Date(year, monthIndex, day);

        // Format ke YYYY-MM-DD
        const yyyy = date.getFullYear();
        const mm = ('0' + (date.getMonth() + 1)).slice(-2);
        const dd = ('0' + date.getDate()).slice(-2);

        return `${yyyy}-${mm}-${dd}`;
    } catch (error) {
        console.error('Error parsing date:', error);
        return '';
    }
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