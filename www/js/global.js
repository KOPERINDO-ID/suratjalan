

// Configuration APP
function checkConnection() {
	var networkState = navigator.connection.type;

	var states = {};
	states[Connection.UNKNOWN] = 'Unknown connection';
	states[Connection.ETHERNET] = 'Ethernet connection';
	states[Connection.WIFI] = 'WiFi connection';
	states[Connection.CELL_2G] = 'Cell 2G connection';
	states[Connection.CELL_3G] = 'Cell 3G connection';
	states[Connection.CELL_4G] = 'Cell 4G connection';
	states[Connection.CELL] = 'Cell generic connection';
	states[Connection.NONE] = 'no_network';

	if (states[networkState] == 'no_network') {
		app.dialog.alert('Internet Sangat Lambat, Cek Koneksi Lalu Klik Oke', function () {
			app.views.main.router.navigate(app.views.main.router.currentRoute.url, {
				ignoreCache: true,
				reloadCurrent: true
			});
		});
	}
}

var BASE_API = 'https://tasindo-sale-webservice.digiseminar.id/api';
// var BASE_API = 'https://tasindo-service-staging.digiseminar.id/api';
// var BASE_API = 'http://127.0.0.1:8000/api';

var BASE_PATH_IMAGE = 'https://tasindo-sale-webservice.digiseminar.id/kunjungan';
var BASE_PATH_IMAGE_PERFORMA = 'https://tasindo-sale-webservice.digiseminar.id/performa_image';
var BASE_PATH_IMAGE_CUSTOMER = 'https://tasindo-sale-webservice.digiseminar.id/customer_logo';
var BASE_PATH_IMAGE_PRODUCT = 'https://tasindo-sale-webservice.digiseminar.id/product_image';
var BASE_PATH_IMAGE_PRODUCT_NEW = 'https://tasindo-sale-webservice.digiseminar.id/product_image_new';
var BASE_PATH_IMAGE_SURAT_JALAN = 'https://tasindo-sale-webservice.digiseminar.id/foto_surat_jalan';
var BASE_PATH_IMAGE_FOTO_PEMBAYARAN = 'https://tasindo-sale-webservice.digiseminar.id/foto_pembayaran';
var BASE_PATH_IMAGE_BUKTI_PRODUKSI = 'https://tasindo-sale-webservice.digiseminar.id/foto_produksi';

function refreshPage() {
	return app.views.main.router.navigate(app.views.main.router.currentRoute.url, { reloadCurrent: true, ignoreCache: true, });
}

function checkInternet() {
	console.log(app.views.main.router.currentRoute.url);
	jQuery.ajax({
		type: 'POST',
		url: "" + BASE_API + "/check-internet-sj",
		dataType: 'JSON',
		data: {
			karyawan_id: localStorage.getItem("user_id"),
			password: localStorage.getItem("password")
		},
		beforeSend: function () {
			app.dialog.close();
		},
		success: function (data) {
			console.log(data.password);
			console.log(localStorage.getItem("password"));
			if (data.version.config_value_string == localStorage.getItem("versioon_app_now")) {
				if (localStorage.getItem("password") == data.password) {
					console.log('Password Accept')
				} else {
					app.dialog.alert('Password Anda Tidak Sesuai', function () {
						logOut();
					});
				}

				console.log('Version Accept');
			} else {
				app.dialog.alert(data.version.config_keterangan, function () {
					logOut();
				});
			}

			localStorage.setItem("internet_koneksi", "good");
			$("#box_internet").css("background-color", "green");
		},
		error: function (xmlhttprequest, textstatus, message) {
			if (textstatus === "timeout") {
				$("#box_internet").css("background-color", "red");
				localStorage.setItem("internet_koneksi", "fail")

			} else {
				$("#box_internet").css("background-color", "red");
				localStorage.setItem("internet_koneksi", "fail")

			}
		}
	});
}

function inputLog(id_transaksi, jenis, keterangan) {
	jQuery.ajax({
		type: 'POST',
		url: "" + BASE_API + "/input-log-proses",
		dataType: 'JSON',
		data: {
			id_transaksi: id_transaksi,
			jenis: jenis,
			keterangan: keterangan
		},
		beforeSend: function () {
		},
		success: function (data) {
		},
		error: function (xmlhttprequest, textstatus, message) {
		}
	});
}


function selectBank() {
	if (localStorage.getItem("user_location") == 'luar_pulau') {
		$(".input-item-bank option[value='BCA']").remove();
		$(".input-item-bank option[value='BRI']").remove();
		$(".input-item-bank option[value='Mandiri']").remove();
	} else {
		$(".input-item-bank option[value='Mandiri Bisnis']").remove();
	}
}

function selectBankPembayaran() {
	if (localStorage.getItem("user_location") == 'luar_pulau') {
		$(".bank_pembayaran option[value='BCA']").remove();
		$(".bank_pembayaran option[value='BRI']").remove();
		$(".bank_pembayaran option[value='Mandiri']").remove();
	} else {
		$(".bank_pembayaran option[value='Mandiri Bisnis']").remove();
	}
}

function checkLogin() {
	if (localStorage.getItem("login") != "true") {
		return app.views.main.router.navigate('/login');
	} else {
		console.log('is_login');
		console.log(localStorage.getItem("login"));
		console.log(localStorage.getItem("user_location"));
	}
}


function logOut() {
	localStorage.clear();
	return app.views.main.router.navigate('/login');
}

function writeLog(str) {
	if (!logOb) return;
	var log = str + " [" + (new Date()) + "]\n";
	logOb.createWriter(function (fileWriter) {
		fileWriter.seek(fileWriter.length);
		var blob = new Blob([log], { type: 'text/plain' });
		fileWriter.write(blob);
	}, fail);
}

function screenshot_me(client_nama) {
	jQuery('#button_invoice').remove();
	jQuery('.menu-detail-product').hide();
	jQuery('.navbar').hide();


	setTimeout(function () {
		navigator.screenshot.save(function (error, res) {
			if (error) {
				app.dialog.preloader('Gagal');
				setTimeout(function () {
					app.dialog.close();
					app.popup.close();
				}, 2000);
				jQuery('.menu-detail-product').show();
				jQuery('.navbar').show();
			} else {
				app.dialog.preloader('Berhasil');
				setTimeout(function () {
					app.dialog.close();
					app.popup.close();
				}, 2000);
				jQuery('.menu-detail-product').show();
				jQuery('.navbar').show();
			}
		}, 'jpg', 50, '' + client_nama + '_' + moment().format('DDMMYYYYHHmmss') + '');
	}, 1000);
}

function number_format(number, decimals, dec_point, thousands_sep) {

	number = (number + '').replace(/[^0-9+\-Ee.]/g, '');

	var n = !isFinite(+number) ? 0 : +number,

		prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),

		sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,

		dec = (typeof dec_point === 'undefined') ? '.' : dec_point,

		s = '',

		toFixedFix = function (n, prec) {

			var k = Math.pow(10, prec);

			return '' + Math.round(n * k) / k;

		};

	// Fix for IE parseFloat(0.55).toFixed(0) = 0;

	s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');

	if (s[0].length > 3) {

		s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);

	}

	if ((s[1] || '').length < prec) {

		s[1] = s[1] || '';

		s[1] += new Array(prec - s[1].length + 1).join('0');

	}

	return s.join(dec);

}



setInterval(function () {
	checkInternet();
}, 3000);
