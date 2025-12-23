function daysInThisMonth() {
  var now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
}

function daysNameInThisMonth() {
  var now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDay();
}

function abbreviateNumber(number) {
  var SI_PREFIXES = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: ' Ribu' },
    { value: 1e6, symbol: ' Juta' },
    { value: 1e9, symbol: ' Milyar' },
    { value: 1e12, symbol: ' Triliun' },
  ]
  if (number === 0) return number

  var tier = SI_PREFIXES.filter((n) => number >= n.value).pop()
  var numberFixed = (number / tier.value).toFixed(0)

  return numberFixed + tier.symbol
}


var $$ = Dom7;
var app = new Framework7({
  photoBrowser: {
    type: 'popup',
    toolbar: false
  },
  root: '#app', // App root element
  id: 'id.vertice.tasindosalesapp', // App bundle ID
  name: 'Sales App', // App name
  theme: 'md', // Automatic theme detection
  // App root data
  data: function () {
    return {
    };
  },
  // App root methods
  methods: {
  },
  // App routes
  routes: routes,

  // Input settings
  input: {
    scrollIntoViewOnFocus: Framework7.device.cordova && !Framework7.device.electron,
    scrollIntoViewCentered: Framework7.device.cordova && !Framework7.device.electron,
  },
  // Cordova Statusbar settings
  statusbar: {
    iosOverlaysWebView: true,
    androidOverlaysWebView: false,
  },
  on: {
    init: function () {




      var f7 = this;
      if (f7.device.cordova) {
        cordovaApp.init(f7);
      }

      if (localStorage.getItem("login") != "true") {
        setTimeout(function () {
          return app.views.main.router.navigate('/login');
        }, 300);
      } else {
        getMenuUser();
        var jabatan = localStorage.getItem("jabatan");
        if (jabatan == 'Sales') {
          getDashboardProspekLine();
          getDashboardProspek();
          startTimeMain();
          showLineGraph();
          getFee();
          getDashboardPenjualan();
          getDashboardBlockOrder();
        } else if (jabatan == 'Produksi') {
          setTimeout(function () {
            startTimeMain();
            return app.views.main.router.navigate('/produksi');
          }, 100);
        } else if (jabatan == 'Surat_jalan') {
          setTimeout(function () {
            startTimeMain();
            return app.views.main.router.navigate('/surat_jalan');
          }, 100);
        }


        // }
      }
    },
  },
});


// Page Kunjungan On load
$$(document).on('page:afterin', '.page[data-name="kunjungan"]', function (e) {
  checkLogin();
  getProspekHeader();
  dateRangeDeclarationProspek();
  checkConnection();
})

$$(document).on('page:afterin', '.page[data-name="prospek_input"]', function (e) {
  selectBoxClientKunjungan();
  var today = moment().format('YYYY-MM-DD');
  document.getElementsByName("tanggal_janjian")[0].setAttribute('min', today);
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      $$('#hasil_pertemuan1').val('');
      localStorage.setItem("lat_usr", position.coords.latitude);
      localStorage.setItem("lng_usr", position.coords.longitude);
    });
  } else {
    return app.views.main.router.navigate('/kunjungan');
  }
  checkConnection();
})

// Page Katalog On load
$$(document).on('page:afterin', '.page[data-name="katalog"]', function (e) {
  checkLogin();
  getProduk();
  checkConnection();
})

// Page Detail Product On load
$$(document).on('page:afterin', '.page[data-name="detail_product"]', function (e) {
  checkLogin();
  getProdukDetail();
  getProdukWarna();
  checkConnection();
  $$('.switch_frame').on('click', function () {
    jQuery("#main_frame").fadeOut('fast', function () {
      jQuery("#main_frame").fadeIn('fast');
    });
    jQuery("#main_frame").attr("src", jQuery(this).attr('data-src'));
  });
})

// Page Penjualan On load
$$(document).on('page:afterin', '.page[data-name="penjualan"]', function (e) {
  checkLogin();
  getPenjualanHeader();
  getPerformaHeaderPenjualan();
  dateRangeDeclarationPenjualan();
  selectBankPembayaran();
  checkConnection();
})

// Page Home / main On load
$$(document).on('page:afterin', '.page[data-name="home"]', function (e) {
  checkConnection();
  getDashboardProspekLine();
  showday();
  showLineGraph();
  getDashboardProspek();
  getFee();
  getDashboardPenjualan();
  getDashboardBlockOrder();
  getMenuUser();
});

// Page penjualan input On load
$$(document).on('page:afterin', '.page[data-name="penjualan_input"]', function (e) {
  checkLogin();
  selectBank();
  penjualanGetPerformaData();
  checkConnection();


  jQuery('#tanggal_pemesanan_1').val(moment().format('YYYY-MM-DD'));
});

$$(document).on('page:afterin', '.page[data-name="surat_jalan"]', function (e) {
  getMenuUser();
  $(".show_pabrik").hide();
  if (localStorage.getItem("lokasi_pabrik_surat") != 'Asia') {
    document.getElementById('table_surat_jalan').style.width = "775px";
  } else {
    document.getElementById('table_surat_jalan').style.width = "600px";
  }
  checkLogin();
  openDialogViewSj();
  getSuratJalanProduksi();
  getHeaderPenjualanKunjungan(1);
  checkConnection();
  selectMonthValues();
  getYearPointSj();
});

$$(document).on('page:afterin', '.page[data-name="produksi"]', function (e) {
  checkLogin();
  getDataProduksi();
  getDashboardProduksi();
  dateRangeDeclarationProduksi();
  checkConnection();
})

$$(document).on('page:afterin', '.page[data-name="produksi-proses"]', function (e) {
  checkLogin();
  getDataProduksiProses();
  getDashboardProduksi('proses');
  dateRangeDeclarationProduksiProses();
  checkConnection();
})

$$(document).on('page:afterin', '.page[data-name="produksi-selesai"]', function (e) {
  checkLogin();
  getDataProduksiSelesai();
  getDashboardProduksi('selesai');
  dateRangeDeclarationProduksiSelesai();
  checkConnection();
})

$$(document).on('page:afterin', '.page[data-name="produksi-harian"]', function (e) {
  checkLogin();
  getDataProduksiHarian();
  getDashboardProduksi('selesai');
  dateRangeDeclarationProduksiHarian();
  checkConnection();
})

// Page penjualan input On load
$$(document).on('page:afterin', '.page[data-name="login"]', function (e) {
  jQuery('#logout_logo').hide();
  checkConnection();
});

// Page performa input On load
$$(document).on('page:afterin', '.page[data-name="performa_input"]', function (e) {
  checkLogin();
  selectBoxClient();
  $$('#count_performa').val($$('.performa_group_field_count').length);
  jQuery('.input-item-price').mask('000,000,000,000', { reverse: false });
  checkConnection();
});


// Page Non performa input On load
$$(document).on('page:afterin', '.page[data-name="penjualan_input_non_performa"]', function (e) {
  checkLogin();
  addNonPerforma();
  checkConnection();
});


