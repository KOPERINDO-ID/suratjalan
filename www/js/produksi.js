var calendarRangePenjualan;


function detailPenjualanProduksi(penjualan_id) {
	detail_sales_data = '';
	jQuery.ajax({
		type: 'POST',
		url: "" + BASE_API + "/get-penjualan-detail-performa",
		dataType: 'JSON',
		data: {
			karyawan_id: localStorage.getItem("user_id"),
			penjualan_id: penjualan_id
		},
		beforeSend: function () {
			$$('#detail_sales_data').html('');
			app.dialog.preloader('Harap Tunggu');
		},
		success: function (data) {


			app.dialog.close();
			console.log(data.data.length);
			if (data.data.length != 0) {
				jQuery.each(data.data, function (i, val) {
					var no = i + 1;
					detail_sales_data += '<table  width="100%" style="border-collapse: collapse; border:1px solid gray;" border="1">';
					detail_sales_data += '<tbody>';
					detail_sales_data += ' <tr class="bg-dark-gray-medium">';
					detail_sales_data += '  <td colspan="3" class="label-cell text-align-center">';
					detail_sales_data += '   Produk #' + no + '';
					detail_sales_data += ' </td>';
					detail_sales_data += '</tr>';
					detail_sales_data += ' <tr>';

					if (val.gambar.substring(0, 5) == "koper") {
						var path_image = 'https://tasindo-sale-webservice.digiseminar.id/product_image_new';
					} else {
						var path_image = 'https://tasindo-sale-webservice.digiseminar.id/performa_image';
					}

					detail_sales_data += '   <td colspan="1" class="label-cell text-align-center" width="40%">' + val.penjualan_jenis + '<br><img data-image-src="' + path_image + '/' + val.gambar + '" class="pb-popup-dark" src="' + path_image + '/' + val.gambar + '" width="100%"></td>';
					detail_sales_data += '   <td colspan="2" class="label-cell text-align-center" width="60%" style="white-space: pre;">' + val.produk_keterangan_kustom + '<br><font color="red">' + val.keterangan + '</font></td>';
					detail_sales_data += '</tr>';
					detail_sales_data += ' <tr class="">';
					detail_sales_data += '  <td colspan="3" class="label-cell text-align-center">Qty : ' + val.penjualan_qty + '</td>';
					detail_sales_data += ' </tr>';
					detail_sales_data += '</tbody>';
					detail_sales_data += '</table><br>';
				});


				$$('#detail_sales_data_produksi').html(detail_sales_data);
			} else {
				$$('#detail_sales_data_produksi').html('<center><h3>Tidak Ada Data</h3></center>');
			}

			$$('.pb-popup-dark').on('click', function () {
				console.log($$(this).attr("data-image-src"));
				var gambar_zoom = $$(this).attr("data-image-src");
				var myPhotoBrowserPopupDark = app.photoBrowser.create({
					photos: [
						'' + gambar_zoom + ''
					],
					theme: 'dark',
					type: 'popup'
				});
				myPhotoBrowserPopupDark.open();
			});
		},
		error: function (xmlhttprequest, textstatus, message) {
		}
	});

}

function detailPenjualanProduksiProses(penjualan_id) {
	detail_sales_data = '';
	jQuery.ajax({
		type: 'POST',
		url: "" + BASE_API + "/get-penjualan-detail-performa",
		dataType: 'JSON',
		data: {
			karyawan_id: localStorage.getItem("user_id"),
			penjualan_id: penjualan_id
		},
		beforeSend: function () {
			$$('#detail_sales_data_proses').html('');
			app.dialog.preloader('Harap Tunggu');
		},
		success: function (data) {


			app.dialog.close();
			console.log(data.data.length);
			if (data.data.length != 0) {
				jQuery.each(data.data, function (i, val) {
					var no = i + 1;
					detail_sales_data += '<table  width="100%" style="border-collapse: collapse; border:1px solid gray;" border="1">';
					detail_sales_data += '<tbody>';
					detail_sales_data += ' <tr class="bg-dark-gray-medium">';
					detail_sales_data += '  <td colspan="3" class="label-cell text-align-center">';
					detail_sales_data += '   Produk #' + no + '';
					detail_sales_data += ' </td>';
					detail_sales_data += '</tr>';

					if (val.gambar.substring(0, 5) == "koper") {
						var path_image = 'https://tasindo-sale-webservice.digiseminar.id/product_image_new';
					} else {
						var path_image = 'https://tasindo-sale-webservice.digiseminar.id/performa_image';
					}
					detail_sales_data += ' <tr>';
					detail_sales_data += '   <td colspan="1" class="label-cell text-align-center" width="40%">' + val.penjualan_jenis + '<br><img data-image-src-proses="' + path_image + '/' + val.gambar + '" class="pb-popup-dark-proses" src="' + path_image + '/' + val.gambar + '" width="100%"></td>';
					detail_sales_data += '   <td colspan="2" class="label-cell text-align-center" width="60%" style="white-space: pre;">' + val.produk_keterangan_kustom + '<br><font color="red">' + val.keterangan + '</font></td>';
					detail_sales_data += '</tr>';
					detail_sales_data += ' <tr class="">';
					detail_sales_data += '  <td colspan="3" class="label-cell text-align-center">Qty : ' + val.penjualan_qty + '</td>';
					detail_sales_data += ' </tr>';
					detail_sales_data += '</tbody>';
					detail_sales_data += '</table><br>';
				});


				$$('#detail_sales_data_produksi_proses').html(detail_sales_data);
			} else {
				$$('#detail_sales_data_produksi_proses').html('<center><h3>Tidak Ada Data</h3></center>');
			}

			$$('.pb-popup-dark-proses').on('click', function () {
				console.log($$(this).attr("data-image-src-proses"));
				var gambar_zoom = $$(this).attr("data-image-src-proses");
				var myPhotoBrowserPopupDark = app.photoBrowser.create({
					photos: [
						'' + gambar_zoom + ''
					],
					theme: 'dark',
					type: 'popup'
				});
				myPhotoBrowserPopupDark.open();
			});
		},
		error: function (xmlhttprequest, textstatus, message) {
		}
	});
}

function detailPenjualanProduksiSelesai(penjualan_id) {
	detail_sales_data = '';
	jQuery.ajax({
		type: 'POST',
		url: "" + BASE_API + "/get-penjualan-detail-performa",
		dataType: 'JSON',
		data: {
			karyawan_id: localStorage.getItem("user_id"),
			penjualan_id: penjualan_id
		},
		beforeSend: function () {
			$$('#detail_sales_data_selesai').html('');
			app.dialog.preloader('Harap Tunggu');
		},
		success: function (data) {


			app.dialog.close();
			console.log(data.data.length);
			if (data.data.length != 0) {
				jQuery.each(data.data, function (i, val) {
					var no = i + 1;
					detail_sales_data += '<table  width="100%" style="border-collapse: collapse; border:1px solid gray;" border="1">';
					detail_sales_data += '<tbody>';
					detail_sales_data += ' <tr class="bg-dark-gray-medium">';
					detail_sales_data += '  <td colspan="3" class="label-cell text-align-center">';
					detail_sales_data += '   Produk #' + no + '';
					detail_sales_data += ' </td>';
					detail_sales_data += '</tr>';

					if (val.gambar.substring(0, 5) == "koper") {
						var path_image = 'https://tasindo-sale-webservice.digiseminar.id/product_image_new';
					} else {
						var path_image = 'https://tasindo-sale-webservice.digiseminar.id/performa_image';
					}
					detail_sales_data += ' <tr>';
					detail_sales_data += '   <td colspan="1" class="label-cell text-align-center" width="40%">' + val.penjualan_jenis + '<br><img data-image-src-selesai="' + path_image + '/' + val.gambar + '" class="pb-popup-dark-selesai" src="' + path_image + '/' + val.gambar + '" width="100%"></td>';
					detail_sales_data += '   <td colspan="2" class="label-cell text-align-center" width="60%" style="white-space: pre;">' + val.produk_keterangan_kustom + '<br><font color="red">' + val.keterangan + '</font></td>';
					detail_sales_data += '</tr>';
					detail_sales_data += ' <tr class="">';
					detail_sales_data += '  <td colspan="3" class="label-cell text-align-center">Qty : ' + val.penjualan_qty + '</td>';
					detail_sales_data += ' </tr>';
					detail_sales_data += '</tbody>';
					detail_sales_data += '</table><br>';
				});


				$$('#detail_sales_data_produksi_selesai').html(detail_sales_data);
			} else {
				$$('#detail_sales_data_produksi_selesai').html('<center><h3>Tidak Ada Data</h3></center>');
			}

			$$('.pb-popup-dark-selesai').on('click', function () {
				console.log($$(this).attr("data-image-src-selesai"));
				var gambar_zoom = $$(this).attr("data-image-src-selesai");
				var myPhotoBrowserPopupDark = app.photoBrowser.create({
					photos: [
						'' + gambar_zoom + ''
					],
					theme: 'dark',
					type: 'popup'
				});
				myPhotoBrowserPopupDark.open();
			});
		},
		error: function (xmlhttprequest, textstatus, message) {
		}
	});
}

function detailPenjualanProduksiHarian(penjualan_id) {
	detail_sales_data = '';
	jQuery.ajax({
		type: 'POST',
		url: "" + BASE_API + "/get-penjualan-detail-performa",
		dataType: 'JSON',
		data: {
			karyawan_id: localStorage.getItem("user_id"),
			penjualan_id: penjualan_id
		},
		beforeSend: function () {
			$$('#detail_sales_data_harian').html('');
			app.dialog.preloader('Harap Tunggu');
		},
		success: function (data) {


			app.dialog.close();
			console.log(data.data.length);
			if (data.data.length != 0) {
				jQuery.each(data.data, function (i, val) {
					var no = i + 1;
					detail_sales_data += '<table  width="100%" style="border-collapse: collapse; border:1px solid gray;" border="1">';
					detail_sales_data += '<tbody>';
					detail_sales_data += ' <tr class="bg-dark-gray-medium">';
					detail_sales_data += '  <td colspan="3" class="label-cell text-align-center">';
					detail_sales_data += '   Produk #' + no + '';
					detail_sales_data += ' </td>';
					detail_sales_data += '</tr>';

					if (val.gambar.substring(0, 5) == "koper") {
						var path_image = 'https://tasindo-sale-webservice.digiseminar.id/product_image_new';
					} else {
						var path_image = 'https://tasindo-sale-webservice.digiseminar.id/performa_image';
					}
					detail_sales_data += ' <tr>';
					detail_sales_data += '   <td colspan="1" class="label-cell text-align-center" width="40%">' + val.penjualan_jenis + '<br><img data-image-src-harian="' + path_image + '/' + val.gambar + '" class="pb-popup-dark-harian" src="' + path_image + '/' + val.gambar + '" width="100%"></td>';
					detail_sales_data += '   <td colspan="2" class="label-cell text-align-center" width="60%" style="white-space: pre;">' + val.produk_keterangan_kustom + '<br><font color="red">' + val.keterangan + '</font></td>';
					detail_sales_data += '</tr>';
					detail_sales_data += ' <tr class="">';
					detail_sales_data += '  <td colspan="3" class="label-cell text-align-center">Qty : ' + val.penjualan_qty + '</td>';
					detail_sales_data += ' </tr>';
					detail_sales_data += '</tbody>';
					detail_sales_data += '</table><br>';
				});


				$$('#detail_sales_data_produksi_harian').html(detail_sales_data);
			} else {
				$$('#detail_sales_data_produksi_harian').html('<center><h3>Tidak Ada Data</h3></center>');
			}

			$$('.pb-popup-dark-harian').on('click', function () {
				console.log($$(this).attr("data-image-src-harian"));
				var gambar_zoom = $$(this).attr("data-image-src-harian");
				var myPhotoBrowserPopupDark = app.photoBrowser.create({
					photos: [
						'' + gambar_zoom + ''
					],
					theme: 'dark',
					type: 'popup'
				});
				myPhotoBrowserPopupDark.open();
			});
		},
		error: function (xmlhttprequest, textstatus, message) {
		}
	});
}

function detail_button(id, produksi) {
	if (jQuery('#button_proses_' + id + '').is(":visible")) {
		jQuery('#button_selesai_' + id + '').hide();
		jQuery('#button_proses_' + id + '').hide();
	} else {
		jQuery('#button_selesai_' + id + '').hide();
		jQuery('#button_proses_' + id + '').show();
	}
}

function detail_button2(id, produksi) {
	if (jQuery('#button_selesai2_' + id + '').is(":visible")) {
		jQuery('#button_selesai2_' + id + '').hide();
		jQuery('#button_proses2_' + id + '').hide();
	} else {
		jQuery('#button_selesai2_' + id + '').show();
		jQuery('#button_proses2_' + id + '').hide();
	}

}

function keteranganCustom(penjualan_detail_performa_id) {
	jQuery.ajax({
		type: 'POST',
		url: "" + BASE_API + "/get-detail-penjualan-id",
		dataType: 'JSON',
		data: {
			karyawan_id: localStorage.getItem("user_id"),
			penjualan_detail_performa_id: penjualan_detail_performa_id,
		},
		beforeSend: function () {
			app.dialog.preloader('Harap Tunggu');
		},
		success: function (data) {
			console.log(data.data[0].produk_keterangan_kustom);
			app.dialog.close();
			jQuery('#detail_custom_keterangan').html('-' + data.data[0].produk_keterangan_kustom.replace(/\r\n|\r|\n/g, "<br />-"));
		},
		error: function (xmlhttprequest, textstatus, message) {
		}
	});
}

function keteranganCustom2(penjualan_detail_performa_id) {
	jQuery.ajax({
		type: 'POST',
		url: "" + BASE_API + "/get-detail-penjualan-id",
		dataType: 'JSON',
		data: {
			karyawan_id: localStorage.getItem("user_id"),
			penjualan_detail_performa_id: penjualan_detail_performa_id,
		},
		beforeSend: function () {
			app.dialog.preloader('Harap Tunggu');
		},
		success: function (data) {
			console.log(data.data[0].produk_keterangan_kustom);
			app.dialog.close();
			jQuery('#detail_custom_keterangan2').html('-' + data.data[0].produk_keterangan_kustom.replace(/\r\n|\r|\n/g, "<br />-"));
		},
		error: function (xmlhttprequest, textstatus, message) {
		}
	});
}

function keteranganCustom3(penjualan_detail_performa_id) {
	jQuery.ajax({
		type: 'POST',
		url: "" + BASE_API + "/get-detail-penjualan-id",
		dataType: 'JSON',
		data: {
			karyawan_id: localStorage.getItem("user_id"),
			penjualan_detail_performa_id: penjualan_detail_performa_id,
		},
		beforeSend: function () {
			app.dialog.preloader('Harap Tunggu');
		},
		success: function (data) {
			console.log(data.data[0].produk_keterangan_kustom);
			app.dialog.close();
			jQuery('#detail_custom_keterangan3').html('-' + data.data[0].produk_keterangan_kustom.replace(/\r\n|\r|\n/g, "<br />-"));
		},
		error: function (xmlhttprequest, textstatus, message) {
		}
	});
}


function keterangan3(penjualan_detail_performa_id) {
	jQuery.ajax({
		type: 'POST',
		url: "" + BASE_API + "/get-detail-penjualan-id",
		dataType: 'JSON',
		data: {
			karyawan_id: localStorage.getItem("user_id"),
			penjualan_detail_performa_id: penjualan_detail_performa_id,
		},
		beforeSend: function () {
			app.dialog.preloader('Harap Tunggu');
		},
		success: function (data) {
			console.log(data.data[0].produk_keterangan_kustom);
			app.dialog.close();
			jQuery('#detail_keterangan3').html('-' + data.data[0].keterangan.replace(/\r\n|\r|\n/g, "<br />-"));
		},
		error: function (xmlhttprequest, textstatus, message) {
		}
	});
}

function keterangan2(penjualan_detail_performa_id) {
	jQuery.ajax({
		type: 'POST',
		url: "" + BASE_API + "/get-detail-penjualan-id",
		dataType: 'JSON',
		data: {
			karyawan_id: localStorage.getItem("user_id"),
			penjualan_detail_performa_id: penjualan_detail_performa_id,
		},
		beforeSend: function () {
			app.dialog.preloader('Harap Tunggu');
		},
		success: function (data) {
			console.log(data.data[0].produk_keterangan_kustom);
			app.dialog.close();
			jQuery('#detail_keterangan2').html('-' + data.data[0].keterangan.replace(/\r\n|\r|\n/g, "<br />-"));
		},
		error: function (xmlhttprequest, textstatus, message) {
		}
	});
}

function keterangan(penjualan_detail_performa_id) {
	jQuery.ajax({
		type: 'POST',
		url: "" + BASE_API + "/get-detail-penjualan-id",
		dataType: 'JSON',
		data: {
			karyawan_id: localStorage.getItem("user_id"),
			penjualan_detail_performa_id: penjualan_detail_performa_id,
		},
		beforeSend: function () {
			app.dialog.preloader('Harap Tunggu');
		},
		success: function (data) {
			console.log(data.data[0].produk_keterangan_kustom);
			app.dialog.close();
			jQuery('#detail_keterangan').html('-' + data.data[0].keterangan.replace(/\r\n|\r|\n/g, "<br />-"));
		},
		error: function (xmlhttprequest, textstatus, message) {
		}
	});
}

function emptyValue(id) {
	jQuery('#' + id + '').val('');
}

function piValue() {
	jQuery('#performa').val('PI_');
}

var delayTimer;
function doSearchProduksiByPerusahaan(text) {
	clearTimeout(delayTimer);
	delayTimer = setTimeout(function () {
		getDataProduksi();
	}, 100);
}

function doSearchProduksiProsesByPerusahaan(text) {
	clearTimeout(delayTimer);
	delayTimer = setTimeout(function () {
		getDataProduksiProses();
	}, 100);
}

function doSearchProduksiSelesaiByPerusahaan(text) {
	clearTimeout(delayTimer);
	delayTimer = setTimeout(function () {
		getDataProduksiSelesai();
	}, 100);
}

function doSearchProduksiSelesaiHarianByPerusahaan(text) {
	clearTimeout(delayTimer);
	delayTimer = setTimeout(function () {
		getDataProduksiHarian();
	}, 100);
}


function dateRangeDeclarationProduksi() {
	calendarRangeProduksi = app.calendar.create({
		inputEl: '#range-produksi',
		rangePicker: true,
		dateFormat: 'dd-mm-yyyy',
		closeOnSelect: true,
		rangePickerMinDays: 7,
		on: {
			close: function () {
				getDataProduksi();
			}
		}
	});
}

function dateRangeDeclarationProduksiProses() {
	calendarRangeProduksiProses = app.calendar.create({
		inputEl: '#range-produksi-proses',
		rangePicker: true,
		dateFormat: 'dd-mm-yyyy',
		closeOnSelect: true,
		rangePickerMinDays: 7,
		on: {
			close: function () {
				getDataProduksiProses();
			}
		}
	});
}

function dateRangeDeclarationProduksiHarian() {
	calendarRangeProduksiSelesai = app.calendar.create({
		inputEl: '#range-produksi-selesai-harian',
		rangePicker: true,
		dateFormat: 'dd-mm-yyyy',
		closeOnSelect: true,
		rangePickerMinDays: 7,
		on: {
			close: function () {
				getDataProduksiHarian();
			}
		}
	});
}

function dateRangeDeclarationProduksiSelesai() {
	calendarRangeProduksiSelesai = app.calendar.create({
		inputEl: '#range-produksi-selesai',
		rangePicker: true,
		dateFormat: 'dd-mm-yyyy',
		closeOnSelect: true,
		rangePickerMinDays: 7,
		on: {
			close: function () {
				getDataProduksiSelesai();
			}
		}
	});
}

function prosesProduksi(id) {
	jQuery('.tooltiptext').attr("visibility", "visible");

}
function updateStatusProduksi(id, status, jenis = 0) {
	if (status == 1) {
		status = 'selesai';
	} else {
		status = 'proses';
	}
	jQuery.ajax({
		type: 'POST',
		url: "" + BASE_API + "/update-produksi-status",
		dataType: 'JSON',
		data: {
			karyawan_id: localStorage.getItem("user_id"),
			id: id,
			status_produksi: status
		},
		beforeSend: function () {
			app.dialog.preloader('Harap Tunggu');
		},
		success: function (data) {
			app.popover.close();
			app.dialog.close();
			app.popup.close();
			if (jenis == 0) {
				getDataProduksi();
			} else {
				getDataProduksiProses();
			}
		},
		error: function (xmlhttprequest, textstatus, message) {
		}
	});
}
function getDataProduksi() {
	if (jQuery('#perusahaan_produksi_filter').val() == '' || jQuery('#perusahaan_produksi_filter').val() == null) {
		perusahaan_produksi_value = "empty";
	} else {
		perusahaan_produksi_value = jQuery('#perusahaan_produksi_filter').val();
	}

	if (jQuery('#range-produksi').val() == '' || jQuery('#range-produksi').val() == null) {
		var startdate = "empty";
		var enddate = "empty";
	} else {
		var startdate_new = new Date(calendarRangeProduksi.value[0]);
		var enddate_new = new Date(calendarRangeProduksi.value[1]);
		var startdate = moment(startdate_new).add(5, 'days').format('YYYY-MM-DD');
		var enddate = moment(enddate_new).add(5, 'days').format('YYYY-MM-DD');
	}
	var data_produksi = '';
	jQuery.ajax({
		type: 'POST',
		url: "" + BASE_API + "/get-produksi",
		dataType: 'JSON',
		data: {
			karyawan_id: localStorage.getItem("user_id"),
			perusahaan_produksi_value: perusahaan_produksi_value,
			startdate: startdate,
			enddate: enddate
		},
		beforeSend: function () {
			app.dialog.preloader('Mengambil Data Produksi, Harap Tunggu');
			jQuery('#produk_data').html('');
		},
		success: function (data) {
			app.dialog.close();
			console.log(data.data);
			if (data.data.length != 0) {
				var nota = '';
				var nomor = 1;
				var warna = '';
				var warna_telat = '';
				var warna_button_packing = '';
				var now = moment();
				jQuery.each(data.data, function (i, val) {

					warna = "";
					warna_telat = "";
					if (val.status_produksi == 'proses') {
						warna = "linear-gradient(#4a8a4a , forestgreen); /* Standard syntax */ background: -webkit-linear-gradient(#4a8a4a , forestgreen); /* For Safari 5.1 to 6.0 */ background: -o-linear-gradient(#4a8a4a , forestgreen); /* For Opera 11.1 to 12.0 */ background: -moz-linear-gradient(#4a8a4a , forestgreen); /* For Firefox 3.6 to 15 */ color:white;";
					} else if (val.status_produksi == 'selesai') {
						warna = "linear-gradient(#067afb , #002b46); /* Standard syntax */ background: -webkit-linear-gradient(#067afb , #002b46); /* For Safari 5.1 to 6.0 */ background: -o-linear-gradient(#067afb , #002b46); /* For Opera 11.1 to 12.0 */ background: -moz-linear-gradient(#067afb , #002b46); /* For Firefox 3.6 to 15 */ color:white;";
					}

					if (nota != val.penjualan_id) {
						if (now >= moment(val.penjualan_tanggal_kirim).subtract(5, 'days')) {
							data_produksi += ' <tr>';
							warna_telat = 'background: linear-gradient(#b53737 , #b20000); /* Standard syntax */ background: -webkit-linear-gradient(#b53737 , #b20000); /* For Safari 5.1 to 6.0 */ background: -o-linear-gradient(#b53737 , #b20000); /* For Opera 11.1 to 12.0 */ background: -moz-linear-gradient(#b53737 , #b20000); /* For Firefox 3.6 to 15 */ background-color:#b20000; color:white;';
						} else {
							data_produksi += ' <tr ">';
						}
						console.log(warna);
						nota = val.penjualan_id;
						if (val.packing == 'plastik') {
							warna_button_packing = '<button class="text-add-colour-black-soft bg-dark-gray-young button-small col button text-bold"></button>';
						} else if (val.packing == 'kardus') {
							warna_button_packing = '<button class="card-color-brown button-small col button text-bold"></button>';
						} else {
							warna_button_packing = '';
						}

						data_produksi += '  <td  style="border-bottom: solid gray 1px; border-top: solid 1px; border-right: solid 1px;  border-color:gray;" class="label-cell"  align="left" >';
						data_produksi += '    ' + warna_button_packing + '  ';
						data_produksi += '  </td>';

						data_produksi += '  <td style="padding:4px !important; border-bottom: solid 1px; border-top: solid 1px; border-left: solid 1px;  border-color:gray; ' + warna_telat + '" class="label-cell" width="5.4%" ><center>' + (nomor++) + '</center></td>';
						data_produksi += '  <td style="border-top: solid 1px; border-left: solid 1px;  border-color:gray; ' + warna_telat + '" class="label-cell"  width="7.9%"><center>' + moment(val.penjualan_tanggal_kirim).subtract(5, 'days').format('DD-MMM') + '</center></td>';
						data_produksi += '  <td style="border-top: solid 1px; border-left: solid 1px;  border-color:gray; ' + warna_telat + '" class="label-cell"  width="9.9%"><center><font  style="color:white;" class="text-add-colour-black-soft popup-open" data-popup=".detail-sales-produksi" onclick="detailPenjualanProduksi(\'' + val.penjualan_id + '\')"><b>' + moment(val.penjualan_tanggal).format('DDMMYY') + '-' + val.penjualan_id.replace(/\INV_/g, '').replace(/^0+/, '') + '</b></font></center></td>';
						data_produksi += '  <td style="border-top: solid 1px; border-left: solid 1px;  border-color:gray; ' + warna_telat + '" class="label-cell"  align="left" width="18.8%">' + val.client_nama + '</td>';
					} else {
						data_produksi += ' <tr>';
						data_produksi += '  <td style="  border-color:gray;" class="label-cell"  colspan="4"></td>';
					}

					if (now >= moment(val.penjualan_tanggal_kirim).subtract(5, 'days')) {
						var warna_telat2 = 'background: linear-gradient(#b53737 , #b20000); /* Standard syntax */ background: -webkit-linear-gradient(#b53737 , #b20000); /* For Safari 5.1 to 6.0 */ background: -o-linear-gradient(#b53737 , #b20000); /* For Opera 11.1 to 12.0 */ background: -moz-linear-gradient(#b53737 , #b20000); /* For Firefox 3.6 to 15 */ background-color:#b20000; color:white;';
					} else {
						var warna_telat2 = '';

					}


					data_produksi += '  <td  style="border-bottom: solid gray 1px; border-top: solid 1px; border-left: solid 1px; ' + warna_telat2 + ' border-color:gray;" class="label-cell"  onclick="detail_button(\'' + i + '\',\'produksi\');" align="left" width="11,3%">' + val.penjualan_jenis + '';

					data_produksi += '<br><button id="button_proses_' + i + '" onclick="updateStatusProduksi(\'' + val.penjualan_detail_performa_id + '\',0)" style=" display:none; border-radius: 10px;background-color: green; color:white;';
					data_produksi += '"> <center>Proses</center> </button>';
					data_produksi += '<button  id="button_selesai_' + i + '" onclick="updateStatusProduksi(\'' + val.penjualan_detail_performa_id + '\',1,1)" style=" display:none; background-color: blue; border-radius: 10px; color:white;"> <center>Selesai</center> </button> ';

					data_produksi += '</td>';


					data_produksi += '  <td  style="border-bottom: solid 1px; border-left: solid 1px; border-color:gray;" class="label-cell" align="right" width="7%">' + val.penjualan_qty + '</td>';
					data_produksi += '  <td style="border-bottom: solid 1px; border-left: solid 1px;  border-color:gray;  background:' + warna + ';" class="label-cell"  align="left" width="18%" ><font  style="color:white;" class="text-add-colour-black-soft popup-open" data-popup=".detail-custom-keterangan" onclick="keteranganCustom(\'' + val.penjualan_detail_performa_id + '\')">' + val.produk_keterangan_kustom.split('\n')[0] + '</font></td>';
					if (val.keterangan == null || val.keterangan == "") {
						data_produksi += '  <td style="border-bottom: solid 1px; border-left: solid 1px; border-color:gray; border-right: solid 1px; border-bottom: solid 1px;" class="label-cell"  align="center" width="18%">-</td>';

					} else {
						data_produksi += '  <td style="border-bottom: solid 1px; border-right: solid 1px; border-bottom: solid 1px; border-left: solid 1px; border-color:gray;" class="label-cell"  align="left"  width="18%" ><font  style="color:white;" class="text-add-colour-black-soft popup-open" data-popup=".detail-keterangan" onclick="keterangan(\'' + val.penjualan_detail_performa_id + '\')" >' + val.keterangan.split('\n')[0] + '</font></td>';

					}
					data_produksi += ' </tr>';

				});
			} else {
				data_produksi += ' <tr>';
				data_produksi += ' <td colspan="8">';
				data_produksi += ' <center> Data Kosong </center>';
				data_produksi += ' </td>';
				data_produksi += ' </tr>';

			}
			jQuery('#produk_data').html(data_produksi);
			jQuery('#total_data').html(data.data.length);


			app.dialog.close();
		},
		error: function (xmlhttprequest, textstatus, message) {

			jQuery('#total_data').html(0);
		}
	});
}



function getDataProduksiProses() {
	if (jQuery('#perusahaan_produksi_proses_filter').val() == '' || jQuery('#perusahaan_produksi_proses_filter').val() == null) {
		perusahaan_produksi_value = "empty";
	} else {
		perusahaan_produksi_value = jQuery('#perusahaan_produksi_proses_filter').val();
	}
	if (jQuery('#range-produksi-proses').val() == '' || jQuery('#range-produksi-proses').val() == null) {
		var startdate = "empty";
		var enddate = "empty";
	} else {
		var startdate_new = new Date(calendarRangeProduksiProses.value[0]);
		var enddate_new = new Date(calendarRangeProduksiProses.value[1]);
		var startdate = moment(startdate_new).add(5, 'days').format('YYYY-MM-DD');
		var enddate = moment(enddate_new).add(5, 'days').format('YYYY-MM-DD');
	}

	var data_produksi1 = '';
	jQuery.ajax({
		type: 'POST',
		url: "" + BASE_API + "/get-produksi-proses",
		dataType: 'JSON',
		data: {
			karyawan_id: localStorage.getItem("user_id"),
			perusahaan_produksi_value: perusahaan_produksi_value,
			startdate: startdate,
			enddate: enddate,
			akses: 'tabel'
		},
		beforeSend: function () {
			app.dialog.preloader('Mengambil Data Proses Produksi, Harap Tunggu');
			jQuery('#produk_data_proses').html('');
		},
		success: function (data) {
			app.dialog.close();

			if (data.data.length != 0) {
				var nota = '';
				var warna_telat = '';
				var nomor = 1;
				var now = moment();
				jQuery.each(data.data, function (i, val) {
					warna_telat = "";
					if (nota != val.penjualan_id) {
						if (now >= moment(val.penjualan_tanggal_kirim).subtract(5, 'days')) {
							data_produksi1 += ' <tr>';
							warna_telat = 'background: linear-gradient(#b53737 , #b20000); /* Standard syntax */ background: -webkit-linear-gradient(#b53737 , #b20000); /* For Safari 5.1 to 6.0 */ background: -o-linear-gradient(#b53737 , #b20000); /* For Opera 11.1 to 12.0 */ background: -moz-linear-gradient(#b53737 , #b20000); /* For Firefox 3.6 to 15 */ background-color:#b20000; color:white;';
						} else {
							data_produksi1 += ' <tr >';
						}
						nota = val.penjualan_id;
						data_produksi1 += '  <td style="padding:4px !important; border-bottom: solid gray 1px; border-top: solid 1px; border-left: solid 1px;  border-color:gray; ' + warna_telat + '" class="label-cell" ><center>' + (nomor++) + '</center></td>';
						data_produksi1 += '  <td style="border-bottom: solid gray 1px; border-top: solid 1px; border-left: solid 1px;  border-color:gray; ' + warna_telat + '" class="label-cell"  ><center>' + moment(val.penjualan_tanggal_kirim).subtract(5, 'days').format('DD-MM') + '</center></td>';
						data_produksi1 += '  <td style="border-bottom: solid gray 1px; border-top: solid 1px; border-left: solid 1px;  border-color:gray; ' + warna_telat + '" class="label-cell"  ><center><font style="color:white;" class="text-add-colour-black-soft popup-open" data-popup=".detail-sales-produksi-proses" onclick="detailPenjualanProduksiProses(\'' + val.penjualan_id + '\')">' + moment(val.penjualan_tanggal).format('DDMMYY') + '-' + val.penjualan_id.replace(/\INV_/g, '').replace(/^0+/, '') + '</font></center></td>';
						data_produksi1 += '  <td style="border-bottom: solid gray 1px; border-top: solid 1px; border-left: solid 1px;  border-color:gray; ' + warna_telat + '" class="label-cell"  align="left">' + val.client_nama + '</td>';
					} else {
						data_produksi1 += ' <tr>';
						data_produksi1 += '  <td style=" ' + warna_telat + ' border-color:gray;" class="label-cell"  colspan="4"></td>';
					}


					if (now >= moment(val.penjualan_tanggal_kirim).subtract(5, 'days')) {
						var warna_telat2 = 'background: linear-gradient(#b53737 , #b20000); /* Standard syntax */ background: -webkit-linear-gradient(#b53737 , #b20000); /* For Safari 5.1 to 6.0 */ background: -o-linear-gradient(#b53737 , #b20000); /* For Opera 11.1 to 12.0 */ background: -moz-linear-gradient(#b53737 , #b20000); /* For Firefox 3.6 to 15 */ background-color:#b20000; color:white;';
					} else {
						var warna_telat2 = '';

					}
					data_produksi1 += '  <td  style="' + warna_telat2 + 'border-bottom: solid gray 1px; border-top: solid 1px; border-left: solid 1px; ' + warna_telat2 + ' border-color:gray;" class="label-cell"  onclick="detail_button2(\'' + i + '\',\'proses_produksi\');" align="left">' + val.penjualan_jenis + '';

					data_produksi1 += '<button id="button_proses2_' + i + '" onclick="updateStatusProduksi(\'' + val.penjualan_detail_performa_id + '\',0)" style=" display:none; border-radius: 10px;background-color: green; color:white;';
					data_produksi1 += '"> <center>Proses</center> </button><br>';
					data_produksi1 += '<button  id="button_selesai2_' + i + '" onclick="updateStatusProduksi(\'' + val.penjualan_detail_performa_id + '\',1,1)" style=" display:none; background-color: blue; border-radius: 10px; color:white;"> <center>Selesai</center> </button> ';

					data_produksi1 += '</td>';
					data_produksi1 += '  <td class="label-cell" style="border-bottom: solid gray 1px; border-top: solid 1px; border-left: solid 1px;  border-color:gray;" align="right">' + val.penjualan_qty + '</td>';
					data_produksi1 += '  <td style="border-bottom: solid gray 1px; border-top: solid 1px; border-left: solid 1px;  border-color:gray;" class="label-cell"  align="left" ><font  style="color:white;" class="text-add-colour-black-soft popup-open" data-popup=".detail-custom-keterangan2" onclick="keteranganCustom2(\'' + val.penjualan_detail_performa_id + '\')" >' + val.produk_keterangan_kustom.split('\n')[0] + '</font></td>';
					if (val.keterangan == null || val.keterangan == "") {
						data_produksi1 += '  <td style="border-bottom: solid gray 1px; border-top: solid 1px; border-left: solid 1px; border-color:gray;" class="label-cell"  align="center" >-</td>';

					} else {
						data_produksi1 += '  <td style="border-right: solid 1px; border-bottom: solid 1px; border-top: solid 1px; border-left: solid 1px; border-color:gray;" class="label-cell"  align="left" ><font  style="color:white;" class="text-add-colour-black-soft popup-open" data-popup=".detail-keterangan2" onclick="keterangan2(\'' + val.penjualan_detail_performa_id + '\')" >' + val.keterangan.split('\n')[0] + '</font></td>';

					}

					data_produksi1 += ' </tr>';
				});
			} else {

				data_produksi1 += ' <tr>';
				data_produksi1 += ' <td colspan="8">';
				data_produksi1 += ' <center> Data Kosong </center>';
				data_produksi1 += ' </td>';
				data_produksi1 += ' </tr>';
			}

			jQuery('#produk_data_proses').html(data_produksi1);
			jQuery('#total_data_produk_proses').html(data.data.length);

			app.dialog.close();
		},
		error: function (xmlhttprequest, textstatus, message) {
		}
	});
}


function getDataProduksiSelesai() {
	if (jQuery('#perusahaan_produksi_selesai_filter').val() == '' || jQuery('#perusahaan_produksi_selesai_filter').val() == null) {
		perusahaan_produksi_value = "empty";
	} else {
		perusahaan_produksi_value = jQuery('#perusahaan_produksi_selesai_filter').val();
	}

	if (jQuery('#range-produksi-selesai').val() == '' || jQuery('#range-produksi-selesai').val() == null) {
		var startdate = "empty";
		var enddate = "empty";
	} else {
		var startdate_new = new Date(calendarRangeProduksiSelesai.value[0]);
		var enddate_new = new Date(calendarRangeProduksiSelesai.value[1]);
		var startdate = moment(startdate_new).add(5, 'days').format('YYYY-MM-DD');
		var enddate = moment(enddate_new).add(5, 'days').format('YYYY-MM-DD');
	}

	var data_produksi2 = '';
	jQuery.ajax({
		type: 'POST',
		url: "" + BASE_API + "/get-produksi-selesai",
		dataType: 'JSON',
		data: {
			karyawan_id: localStorage.getItem("user_id"),
			perusahaan_produksi_value: perusahaan_produksi_value,
			startdate: startdate,
			enddate: enddate,
			akses: 'tabel'
		},
		beforeSend: function () {
			app.dialog.preloader('Mengambil Data Produksi Selesai, Harap Tunggu');
			jQuery('#produk_data_selesai').html('');
		},
		success: function (data) {
			app.dialog.close();

			if (data.data.length != 0) {
				var nota = '';
				var nomor = 1;
				jQuery.each(data.data, function (i, val) {

					data_produksi2 += ' <tr>';
					if (nota != val.penjualan_id) {
						if (nomor % 2 == 1) {
							warna = '#4c2b2b';
						} else {
							warna = '#121212';
						}
						nota = val.penjualan_id;
						data_produksi2 += '  <td class="label-cell" style="padding:4px !important; border-bottom: solid 1px; border-top: solid 1px; border-left: solid 1px;  border-color:gray;" ><center>' + (nomor++) + '</center></td>';
						data_produksi2 += '  <td class="label-cell" style="border-bottom: solid 1px; border-top: solid 1px; border-left: solid 1px;  border-color:gray;"  ><center>' + moment(val.penjualan_tanggal_kirim).format('DD-MM') + '</center></td>';
						data_produksi2 += '  <td style="border-bottom: solid 1px; border-top: solid 1px; border-left: solid 1px;  border-color:gray;" class="label-cell"  ><center><font style="color:white;" class="text-add-colour-black-soft popup-open" data-popup=".detail-sales-produksi-selesai" onclick="detailPenjualanProduksiSelesai(\'' + val.penjualan_id + '\')">' + moment(val.penjualan_tanggal).format('DDMMYY') + '-' + val.penjualan_id.replace(/\INV_/g, '').replace(/^0+/, '') + '</font></center></td>';
						data_produksi2 += '  <td class="label-cell" style="border-top: solid 1px; border-left: solid 1px; border-bottom: solid 1px;  border-color:gray;" align="left" >' + val.client_nama + '</td>';
					} else {

						data_produksi2 += '  <td class="label-cell" style="border-color:gray;" colspan="4"></td>';

					}

					data_produksi2 += '  <td  style="border-bottom: solid 1px; border-top: solid 1px; border-left: solid 1px;  border-color:gray;" class="label-cell popover-open " data-popover=".popover-links2' + i + '" align="left">' + val.penjualan_jenis + '';
					data_produksi2 += '</td>';
					data_produksi2 += '  <td class="label-cell" style="border-bottom: solid 1px; border-top: solid 1px; border-left: solid 1px;  border-color:gray;" align="right">' + val.penjualan_qty + '</td>';
					data_produksi2 += '  <td style="border-bottom: solid 1px; border-top: solid 1px; border-left: solid 1px;  border-color:gray;" class="label-cell"  align="left" ><font  style="color:white;" class="text-add-colour-black-soft popup-open" data-popup=".detail-custom-keterangan3" onclick="keteranganCustom3(\'' + val.penjualan_detail_performa_id + '\')" >' + val.produk_keterangan_kustom.split('\n')[0] + '</font></td>';
					if (val.keterangan == null || val.keterangan == "") {
						data_produksi2 += '  <td style="border-right: solid 1px; border-bottom: solid 1px; border-top: solid 1px; border-left: solid 1px; border-color:gray;" class="label-cell"  align="center" >-</td>';

					} else {
						data_produksi2 += '  <td style="border-right: solid 1px; border-bottom: solid 1px; border-top: solid 1px; border-left: solid 1px; border-color:gray;" class="label-cell"  align="left" ><font  style="color:white;" class="text-add-colour-black-soft popup-open" data-popup=".detail-keterangan3" onclick="keterangan3(\'' + val.penjualan_detail_performa_id + '\')" >' + val.keterangan.split('\n')[0] + '</font></td>';

					}
				});
			} else {

				data_produksi2 += ' <tr>';
				data_produksi2 += ' <td colspan="8">';
				data_produksi2 += ' <center> Data Kosong </center>';
				data_produksi2 += ' </td>';
				data_produksi2 += ' </tr>';
			}

			jQuery('#produk_data_selesai').html(data_produksi2);
			jQuery('#total_data_produk_selesai').html(data.data.length);

			app.dialog.close();
		},
		error: function (xmlhttprequest, textstatus, message) {
		}
	});
}

function getDataProduksiHarian() {
	if (jQuery('#perusahaan_produksi_selesai_filter_harian').val() == '' || jQuery('#perusahaan_produksi_selesai_filter_harian').val() == null) {
		perusahaan_produksi_value = "empty";
	} else {
		perusahaan_produksi_value = jQuery('#perusahaan_produksi_selesai_filter_harian').val();
	}

	if (jQuery('#range-produksi-selesai-harian').val() == '' || jQuery('#range-produksi-selesai-harian').val() == null) {
		var startdate = "empty";
		var enddate = "empty";
	} else {
		var startdate_new = new Date(calendarRangeProduksiSelesai.value[0]);
		var enddate_new = new Date(calendarRangeProduksiSelesai.value[1]);
		var startdate = moment(startdate_new).format('YYYY-MM-DD');
		var enddate = moment(enddate_new).format('YYYY-MM-DD');
	}

	var data_produksi2 = '';
	jQuery.ajax({
		type: 'POST',
		url: "" + BASE_API + "/get-produksi-harian",
		dataType: 'JSON',
		data: {
			karyawan_id: localStorage.getItem("user_id"),
			perusahaan_produksi_value: perusahaan_produksi_value,
			startdate: startdate,
			enddate: enddate,
			akses: 'tabel'
		},
		beforeSend: function () {
			app.dialog.preloader('Mengambil Data Produksi Selesai, Harap Tunggu');
			jQuery('#produk_data_selesai').html('');
		},
		success: function (data) {
			app.dialog.close();

			if (data.data.length != 0) {
				var nota = '';
				var nomor = 1;
				jQuery.each(data.data, function (i, val) {

					data_produksi2 += ' <tr>';
					if (nota != val.penjualan_id) {
						if (nomor % 2 == 1) {
							warna = '#4c2b2b';
						} else {
							warna = '#121212';
						}
						nota = val.penjualan_id;
						if (moment(val.produksi_tanggal_selesai).format('dddd') == "Sunday") {
							var hari = "Minggu";
						} else if (moment(val.produksi_tanggal_selesai).format('dddd') == "Monday") {
							var hari = "Senin";
						} else if (moment(val.produksi_tanggal_selesai).format('dddd') == "Tuesday") {
							var hari = "Selasa";
						} else if (moment(val.produksi_tanggal_selesai).format('dddd') == "Wednesday") {
							var hari = "Rabu";
						} else if (moment(val.produksi_tanggal_selesai).format('dddd') == "Thursday") {
							var hari = "Kamis";
						} else if (moment(val.produksi_tanggal_selesai).format('dddd') == "Friday") {
							var hari = "Jumat";
						} else if (moment(val.produksi_tanggal_selesai).format('dddd') == "Saturday") {
							var hari = "Sabtu";
						}

						data_produksi2 += '  <td class="label-cell" style="padding:4px !important; border-bottom: solid 1px; border-top: solid 1px; border-left: solid 1px;  border-color:gray;" ><center>' + (nomor++) + '</center></td>';
						data_produksi2 += '  <td class="label-cell" style="border-bottom: solid 1px; border-top: solid 1px; border-left: solid 1px;  border-color:gray;"  ><center>' + hari + ', ' + moment(val.produksi_tanggal_selesai).format('DD-MM-YYYY') + '</center></td>';
						data_produksi2 += '  <td style="border-bottom: solid 1px; border-top: solid 1px; border-left: solid 1px;  border-color:gray;" class="label-cell"  ><center><font style="color:white;" class="text-add-colour-black-soft popup-open" data-popup=".detail-sales-produksi-harian" onclick="detailPenjualanProduksiHarian(\'' + val.penjualan_id + '\')">' + moment(val.penjualan_tanggal).format('DDMMYY') + '-' + val.penjualan_id.replace(/\INV_/g, '').replace(/^0+/, '') + '</font></center></td>';
						data_produksi2 += '  <td class="label-cell" style="border-top: solid 1px; border-left: solid 1px; border-bottom: solid 1px;  border-color:gray;" align="left" >' + val.client_nama + '</td>';
					} else {

						data_produksi2 += '  <td class="label-cell" style="border-color:gray;" colspan="4"></td>';

					}

					data_produksi2 += '  <td  style="border-bottom: solid 1px; border-top: solid 1px; border-left: solid 1px;  border-color:gray;" class="label-cell popover-open " data-popover=".popover-links2' + i + '" align="left">' + val.penjualan_jenis + '';
					data_produksi2 += '</td>';
					data_produksi2 += '  <td class="label-cell" style="border-bottom: solid 1px; border-top: solid 1px; border-left: solid 1px;  border-color:gray;" align="right">' + val.penjualan_qty + '</td>';
					data_produksi2 += '  <td style="border-bottom: solid 1px; border-top: solid 1px; border-left: solid 1px;  border-color:gray;" class="label-cell"  align="left" ><font  style="color:white;" class="text-add-colour-black-soft popup-open" data-popup=".detail-custom-keterangan3" onclick="keteranganCustom3(\'' + val.penjualan_detail_performa_id + '\')" >' + val.produk_keterangan_kustom.split('\n')[0] + '</font></td>';
					if (val.keterangan == null || val.keterangan == "") {
						data_produksi2 += '  <td style="border-bottom: solid 1px; border-top: solid 1px; border-left: solid 1px; border-color:gray;" class="label-cell"  align="center" >-</td>';

					} else {
						data_produksi2 += '  <td style="border-bottom: solid 1px; border-top: solid 1px; border-left: solid 1px; border-color:gray;" class="label-cell"  align="left" ><font  style="color:white;" class="text-add-colour-black-soft popup-open" data-popup=".detail-keterangan3" onclick="keterangan3(\'' + val.penjualan_detail_performa_id + '\')" >' + val.keterangan.split('\n')[0] + '</font></td>';

					}
				});
			} else {

				data_produksi2 += ' <tr>';
				data_produksi2 += ' <td colspan="8">';
				data_produksi2 += ' <center> Data Kosong </center>';
				data_produksi2 += ' </td>';
				data_produksi2 += ' </tr>';
			}

			jQuery('#produk_data_selesai_harian').html(data_produksi2);
			jQuery('#total_data_produk_selesai_harian').html(data.data.length);

			app.dialog.close();
		},
		error: function (xmlhttprequest, textstatus, message) {
		}
	});
}

// -------------------------------------------------  Report / Laporan

function reportProduksi() {
	if (jQuery('#perusahaan_produksi_filter').val() == '' || jQuery('#perusahaan_produksi_filter').val() == null) {
		perusahaan_produksi_value = "empty";
	} else {
		perusahaan_produksi_value = jQuery('#perusahaan_produksi_filter').val();
	}

	if (jQuery('#range-produksi').val() == '' || jQuery('#range-produksi').val() == null) {
		var startdate = "empty";
		var enddate = "empty";
	} else {
		var startdate_new = new Date(calendarRangeProduksi.value[0]);
		var enddate_new = new Date(calendarRangeProduksi.value[1]);
		var startdate = moment(startdate_new).add(5, 'days').format('YYYY-MM-DD');
		var enddate = moment(enddate_new).add(5, 'days').format('YYYY-MM-DD');
	}
	var data_produksi = '';
	jQuery.ajax({
		type: 'POST',
		url: "" + BASE_API + "/get-produksi",
		dataType: 'JSON',
		data: {
			perusahaan_produksi_value: perusahaan_produksi_value,
			startdate: startdate,
			enddate: enddate
		},
		beforeSend: function () {
			app.dialog.preloader('Mengambil Data Produksi, Harap Tunggu');
			data_produksi += ' <center><h3>Data SPK</h3></center>';
			data_produksi += '<table  border="1" width="100%" style="border-spacing: 0; background-color:white; color:black;">';
			data_produksi += ' <tr>';
			data_produksi += ' <th width="5%">No</th>';
			data_produksi += ' <th width="10%">Dateline</th>';
			data_produksi += ' <th width="15%">SPK</th>';
			data_produksi += ' <th width="18%">Nama</th>';
			data_produksi += ' <th width="11%">Type</th>';
			data_produksi += ' <th width="18%">Spesifikasi</th>';
			data_produksi += ' <th width="18%">Keterangan</th>';
			data_produksi += ' <th width="5%">Jumlah</th>';
			data_produksi += '</tr>';
			data_produksi += '<tbody>';
		},
		success: function (data) {
			app.dialog.close();
			if (data.data.length != 0) {

				var nota = '';
				var nomor = 1;
				var warna = '';
				var warna_telat = '';
				var now = moment();
				jQuery.each(data.data, function (i, val) {

					warna = "";
					warna_telat = "";
					if (val.status_produksi == 'proses') {
						warna = "linear-gradient(#4a8a4a , forestgreen); /* Standard syntax */ background: -webkit-linear-gradient(#4a8a4a , forestgreen); /* For Safari 5.1 to 6.0 */ background: -o-linear-gradient(#4a8a4a , forestgreen); /* For Opera 11.1 to 12.0 */ background: -moz-linear-gradient(#4a8a4a , forestgreen); /* For Firefox 3.6 to 15 */ color:white;";
					} else if (val.status_produksi == 'selesai') {
						warna = "linear-gradient(#067afb , #002b46); /* Standard syntax */ background: -webkit-linear-gradient(#067afb , #002b46); /* For Safari 5.1 to 6.0 */ background: -o-linear-gradient(#067afb , #002b46); /* For Opera 11.1 to 12.0 */ background: -moz-linear-gradient(#067afb , #002b46); /* For Firefox 3.6 to 15 */ color:white;";
					}

					if (nota != val.penjualan_id) {
						if (now >= moment(val.penjualan_tanggal_kirim).subtract(5, 'days')) {
							data_produksi += ' <tr>';
							warna_telat = 'background: linear-gradient(#b53737 , #b20000); /* Standard syntax */ background: -webkit-linear-gradient(#b53737 , #b20000); /* For Safari 5.1 to 6.0 */ background: -o-linear-gradient(#b53737 , #b20000); /* For Opera 11.1 to 12.0 */ background: -moz-linear-gradient(#b53737 , #b20000); /* For Firefox 3.6 to 15 */ background-color:#b20000; color:white;';
						} else {
							data_produksi += ' <tr >';
						}
						nota = val.penjualan_id;
						data_produksi += '  <td style="' + warna_telat + '" ><center>' + (nomor++) + '</center></td>';
						data_produksi += '  <td style="' + warna_telat + '"  ><center>' + moment(val.penjualan_tanggal_kirim).subtract(5, 'days').format('DD-MMM') + '</center></td>';
						data_produksi += '  <td style="' + warna_telat + '"  ><center><b>' + moment(val.penjualan_tanggal).format('DDMMYY') + '-' + val.penjualan_id.replace(/\INV_/g, '').replace(/^0+/, '') + '</b></center></td>';
						data_produksi += '  <td style="' + warna_telat + '"  ><center>' + val.client_nama + '</center></td>';
					} else {
						data_produksi += ' <tr>';
						data_produksi += '  <td style="border-top: solid 1px;  border-color:gray;"  colspan="4"></td>';
					}

					data_produksi += '  <td  style="' + warna_telat + '" ><center>' + val.penjualan_jenis + '</center>';
					data_produksi += '</td>';



					data_produksi += '  <td  align="left" style=" background:' + warna + ';"  >' + val.produk_keterangan_kustom.replace(/[\r\n]+/g, ", "); +'</td>';
					data_produksi += '  <td  align="left" style=""  >' + val.keterangan + '</td>';

					data_produksi += '  <td><center>' + val.penjualan_qty + '</center></td>';
					data_produksi += ' </tr>';
				});

				data_produksi += '</tbody>';
				data_produksi += '</table>';
				let options = {
					documentSize: 'A4',
					type: 'share',
					fileName: 'Report_produksi.pdf'
				}
				console.log(data_produksi);
				pdf.fromData(data_produksi, options)
					.then((stats) => console.log('status', stats))
					.catch((err) => console.err(err));

			}

			app.dialog.close();
		},
		error: function (xmlhttprequest, textstatus, message) {

			jQuery('#total_data').html(0);
		}
	});
}


function reportProduksiProses() {
	if (jQuery('#perusahaan_produksi_proses_filter').val() == '' || jQuery('#perusahaan_produksi_proses_filter').val() == null) {
		perusahaan_produksi_value = "empty";
	} else {
		perusahaan_produksi_value = jQuery('#perusahaan_produksi_proses_filter').val();
	}

	if (jQuery('#range-produksi-proses').val() == '' || jQuery('#range-produksi-proses').val() == null) {
		var startdate = "empty";
		var enddate = "empty";
	} else {
		var startdate_new = new Date(calendarRangeProduksiProses.value[0]);
		var enddate_new = new Date(calendarRangeProduksiProses.value[1]);
		var startdate = moment(startdate_new).add(5, 'days').format('YYYY-MM-DD');
		var enddate = moment(enddate_new).add(5, 'days').format('YYYY-MM-DD');
	}
	var data_produksi = '';
	jQuery.ajax({
		type: 'POST',
		url: "" + BASE_API + "/get-produksi-proses",
		dataType: 'JSON',
		data: {
			perusahaan_produksi_value: perusahaan_produksi_value,
			startdate: startdate,
			enddate: enddate,
			akses: 'tabel'
		},
		beforeSend: function () {
			app.dialog.preloader('Mengambil Data Produksi, Harap Tunggu');
			data_produksi += ' <center><h3>Data SPK / Proses Produksi</h3></center>';
			data_produksi += '<table  border="1" width="100%" style="border-spacing: 0; background-color:white; color:black;">';
			data_produksi += ' <tr>';
			data_produksi += ' <th width="5%">No</th>';
			data_produksi += ' <th width="10%">Dateline</th>';
			data_produksi += ' <th width="15%">SPK</th>';
			data_produksi += ' <th width="18%">Nama</th>';
			data_produksi += ' <th width="11%">Type</th>';
			data_produksi += ' <th width="18%">Spesifikasi</th>';
			data_produksi += ' <th width="18%">Keterangan</th>';
			data_produksi += ' <th width="5%">Jumlah</th>';
			data_produksi += '</tr>';
			data_produksi += '<tbody>';
		},
		success: function (data) {
			app.dialog.close();
			if (data.data.length != 0) {

				var nota = '';
				var warna_telat = '';
				var nomor = 1;
				var now = moment();
				jQuery.each(data.data, function (i, val) {
					warna_telat = "";
					if (nota != val.penjualan_id) {
						if (now >= moment(val.penjualan_tanggal_kirim).subtract(5, 'days')) {
							data_produksi += ' <tr>';
							warna_telat = 'background: linear-gradient(#b53737 , #b20000); /* Standard syntax */ background: -webkit-linear-gradient(#b53737 , #b20000); /* For Safari 5.1 to 6.0 */ background: -o-linear-gradient(#b53737 , #b20000); /* For Opera 11.1 to 12.0 */ background: -moz-linear-gradient(#b53737 , #b20000); /* For Firefox 3.6 to 15 */ background-color:#b20000; color:white;';
						} else {
							data_produksi += ' <tr >';
						}
						nota = val.penjualan_id;
						data_produksi += '  <td style=" ' + warna_telat + '" class="label-cell" ><center>' + (nomor++) + '</center></td>';
						data_produksi += '  <td style=" ' + warna_telat + '" class="label-cell"  ><center>' + moment(val.penjualan_tanggal_kirim).subtract(5, 'days').format('DD-MM') + '</center></td>';
						data_produksi += '  <td style="' + warna_telat + '"  ><center><b>' + moment(val.penjualan_tanggal).format('DDMMYY') + '-' + val.penjualan_id.replace(/\INV_/g, '').replace(/^0+/, '') + '</b></center></td>';
						data_produksi += '  <td style=" ' + warna_telat + '" class="label-cell"  ><center>' + val.client_nama + '</center></td>';
					} else {
						data_produksi += ' <tr>';
						data_produksi += '  <td style="border-top: solid 1px;  border-color:gray;" class="label-cell"  colspan="4"></td>';
					}

					data_produksi += '  <td  class="label-cell popover-open " ><center>' + val.penjualan_jenis + '</center>';
					data_produksi += '</td>';

					data_produksi += '  <td class="label-cell" align="left">' + val.produk_keterangan_kustom.replace(/[\r\n]+/g, ", "); +'</td>';
					data_produksi += '  <td  align="left" style=""  >' + val.keterangan + '</td>';

					data_produksi += '  <td class="label-cell" ><center>' + val.penjualan_qty + '</center></td>';
					data_produksi += ' </tr>';
				});

				data_produksi += '</tbody>';
				data_produksi += '</table>';
				let options = {
					documentSize: 'A4',
					type: 'share',
					fileName: 'Report_produksi_proses.pdf'
				}
				console.log(data_produksi);
				pdf.fromData(data_produksi, options)
					.then((stats) => console.log('status', stats))
					.catch((err) => console.err(err));

			}

			app.dialog.close();
		},
		error: function (xmlhttprequest, textstatus, message) {

			jQuery('#total_data').html(0);
		}
	});
}


function reportProduksiSelesai() {
	if (jQuery('#perusahaan_produksi_selesai_filter').val() == '' || jQuery('#perusahaan_produksi_selesai_filter').val() == null) {
		perusahaan_produksi_value = "empty";
	} else {
		perusahaan_produksi_value = jQuery('#perusahaan_produksi_selesai_filter').val();
	}

	if (jQuery('#range-produksi-selesai').val() == '' || jQuery('#range-produksi-selesai').val() == null) {
		var startdate = "empty";
		var enddate = "empty";
	} else {
		var startdate_new = new Date(calendarRangeProduksiSelesai.value[0]);
		var enddate_new = new Date(calendarRangeProduksiSelesai.value[1]);
		var startdate = moment(startdate_new).add(5, 'days').format('YYYY-MM-DD');
		var enddate = moment(enddate_new).add(5, 'days').format('YYYY-MM-DD');
	}
	var data_produksi = '';
	jQuery.ajax({
		type: 'POST',
		url: "" + BASE_API + "/get-produksi-selesai",
		dataType: 'JSON',
		data: {
			perusahaan_produksi_value: perusahaan_produksi_value,
			startdate: startdate,
			enddate: enddate,
			akses: 'tabel'
		},
		beforeSend: function () {
			app.dialog.preloader('Mengambil Data Produksi, Harap Tunggu');
			data_produksi += ' <center><h3>Data Hasil Produksi Selesai</h3></center>';
			data_produksi += '<table  border="1" width="100%" style="border-spacing: 0; background-color:white; color:black;">';
			data_produksi += ' <tr>';
			data_produksi += ' <th width="5%">No</th>';
			data_produksi += ' <th width="10%">Tanggal Pengiriman</th>';
			data_produksi += ' <th width="15%">SPK</th>';
			data_produksi += ' <th width="20%">Nama</th>';
			data_produksi += ' <th width="15%">Type</th>';
			data_produksi += ' <th width="30%">Spesifikasi</th>';
			data_produksi += ' <th width="5%">Jumlah</th>';
			data_produksi += '</tr>';
			data_produksi += '<tbody>';
		},
		success: function (data) {
			app.dialog.close();
			if (data.data.length != 0) {

				var nota = '';
				var warna_telat = '';
				var nomor = 1;
				var now = moment();
				jQuery.each(data.data, function (i, val) {
					warna_telat = "";
					if (nota != val.penjualan_id) {
						if (now >= moment(val.penjualan_tanggal_kirim)) {
							data_produksi += ' <tr>';
							warna_telat = 'background: linear-gradient(#b53737 , #b20000); /* Standard syntax */ background: -webkit-linear-gradient(#b53737 , #b20000); /* For Safari 5.1 to 6.0 */ background: -o-linear-gradient(#b53737 , #b20000); /* For Opera 11.1 to 12.0 */ background: -moz-linear-gradient(#b53737 , #b20000); /* For Firefox 3.6 to 15 */ background-color:#b20000; color:white;';
						} else {
							data_produksi += ' <tr >';
						}
						nota = val.penjualan_id;
						data_produksi += '  <td style=" ' + warna_telat + '" class="label-cell" ><center>' + (nomor++) + '</center></td>';
						data_produksi += '  <td style=" ' + warna_telat + '" class="label-cell"  ><center>' + moment(val.penjualan_tanggal_kirim).format('DD-MM') + '</center></td>';
						data_produksi += '  <td style="' + warna_telat + '"  ><center><b>' + moment(val.penjualan_tanggal).format('DDMMYY') + '-' + val.penjualan_id.replace(/\INV_/g, '').replace(/^0+/, '') + '</b></center></td>';
						data_produksi += '  <td style=" ' + warna_telat + '" class="label-cell"  ><center>' + val.client_nama + '</center></td>';
					} else {
						data_produksi += ' <tr>';
						data_produksi += '  <td style="border-top: solid 1px;  border-color:gray;" class="label-cell"  colspan="4"></td>';
					}

					data_produksi += '  <td  class="label-cell popover-open " ><center>' + val.penjualan_jenis + '</center>';
					data_produksi += '</td>';

					data_produksi += '  <td class="label-cell" align="left">' + val.produk_keterangan_kustom.replace(/[\r\n]+/g, ", "); +'</td>';
					data_produksi += '  <td class="label-cell"  align="left" >' + val.keterangan + '</td>';

					data_produksi += '  <td class="label-cell" ><center>' + val.penjualan_qty + '</center></td>';
					data_produksi += ' </tr>';
				});

				data_produksi += '</tbody>';
				data_produksi += '</table>';
				let options = {
					documentSize: 'A4',
					type: 'share',
					fileName: 'Report_produksi_proses.pdf'
				}
				console.log(data_produksi);
				pdf.fromData(data_produksi, options)
					.then((stats) => console.log('status', stats))
					.catch((err) => console.err(err));

			}

			app.dialog.close();
		},
		error: function (xmlhttprequest, textstatus, message) {

			jQuery('#total_data').html(0);
		}
	});
}


function reportProduksiHarian() {
	if (jQuery('#perusahaan_produksi_selesai_filter_harian').val() == '' || jQuery('#perusahaan_produksi_selesai_filter_harian').val() == null) {
		perusahaan_produksi_value = "empty";
	} else {
		perusahaan_produksi_value = jQuery('#perusahaan_produksi_selesai_filter_harian').val();
	}

	if (jQuery('#range-produksi-selesai-harian').val() == '' || jQuery('#range-produksi-selesai-harian').val() == null) {
		var startdate = "empty";
		var enddate = "empty";
	} else {
		var startdate_new = new Date(calendarRangeProduksiSelesai.value[0]);
		var enddate_new = new Date(calendarRangeProduksiSelesai.value[1]);
		var startdate = moment(startdate_new).format('YYYY-MM-DD');
		var enddate = moment(enddate_new).format('YYYY-MM-DD');
	}
	var data_produksi = '';
	jQuery.ajax({
		type: 'POST',
		url: "" + BASE_API + "/get-produksi-harian",
		dataType: 'JSON',
		data: {
			perusahaan_produksi_value: perusahaan_produksi_value,
			startdate: startdate,
			enddate: enddate,
			akses: 'tabel'
		},
		beforeSend: function () {



			app.dialog.preloader('Mengambil Data Produksi, Harap Tunggu');
			data_produksi += ' <center><h3>Data Hasil Produksi Harian</h3></center>';
			data_produksi += '<table  border="1" width="100%" style="border-spacing: 0; background-color:white; color:black;">';
			data_produksi += ' <tr>';
			data_produksi += ' <th width="3%">No</th>';
			data_produksi += ' <th width="10%">Tanggal Selesai</th>';
			data_produksi += ' <th width="10%">SPK</th>';
			data_produksi += ' <th width="14%">Nama</th>';
			data_produksi += ' <th width="10%">Type</th>';
			data_produksi += ' <th width="25%">Spesifikasi</th>';
			data_produksi += ' <th width="25%">Keterangan</th>';
			data_produksi += ' <th width="3%">Jumlah</th>';
			data_produksi += '</tr>';
			data_produksi += '<tbody>';
		},
		success: function (data) {
			app.dialog.close();
			if (data.data.length != 0) {

				var nota = '';
				var warna_telat = '';
				var nomor = 1;
				var now = moment();
				jQuery.each(data.data, function (i, val) {
					if (moment(val.produksi_tanggal_selesai).format('dddd') == "Sunday") {
						var hari = "Minggu";
					} else if (moment(val.produksi_tanggal_selesai).format('dddd') == "Monday") {
						var hari = "Senin";
					} else if (moment(val.produksi_tanggal_selesai).format('dddd') == "Tuesday") {
						var hari = "Selasa";
					} else if (moment(val.produksi_tanggal_selesai).format('dddd') == "Wednesday") {
						var hari = "Rabu";
					} else if (moment(val.produksi_tanggal_selesai).format('dddd') == "Thursday") {
						var hari = "Kamis";
					} else if (moment(val.produksi_tanggal_selesai).format('dddd') == "Friday") {
						var hari = "Jumat";
					} else if (moment(val.produksi_tanggal_selesai).format('dddd') == "Saturday") {
						var hari = "Sabtu";
					}


					warna_telat = "";
					if (nota != val.penjualan_id) {
						if (now >= moment(val.penjualan_tanggal_kirim)) {
							data_produksi += ' <tr>';
							warna_telat = 'background: linear-gradient(#b53737 , #b20000); /* Standard syntax */ background: -webkit-linear-gradient(#b53737 , #b20000); /* For Safari 5.1 to 6.0 */ background: -o-linear-gradient(#b53737 , #b20000); /* For Opera 11.1 to 12.0 */ background: -moz-linear-gradient(#b53737 , #b20000); /* For Firefox 3.6 to 15 */ background-color:#b20000; color:white;';
						} else {
							data_produksi += ' <tr >';
						}

						nota = val.penjualan_id;
						data_produksi += '  <td style=" ' + warna_telat + '" class="label-cell" ><center>' + (nomor++) + '</center></td>';
						data_produksi += '  <td style=" ' + warna_telat + '" class="label-cell"  ><center>' + hari + ', ' + moment(val.produksi_tanggal_selesai).format('DD-MM-YYYY') + '</center></td>';
						data_produksi += '  <td style="' + warna_telat + '"  ><center><b>' + moment(val.penjualan_tanggal).format('DDMMYY') + '-' + val.penjualan_id.replace(/\INV_/g, '').replace(/^0+/, '') + '</b></center></td>';
						data_produksi += '  <td style=" ' + warna_telat + '" class="label-cell"  ><center>' + val.client_nama + '</center></td>';
					} else {
						data_produksi += ' <tr>';
						data_produksi += '  <td style="border-top: solid 1px;  border-color:gray;" class="label-cell"  colspan="4"></td>';
					}

					data_produksi += '  <td  class="label-cell popover-open " ><center>' + val.penjualan_jenis + '</center>';
					data_produksi += '</td>';

					data_produksi += '  <td class="label-cell" align="left">' + val.produk_keterangan_kustom.replace(/[\r\n]+/g, ", "); +'</td>';
					data_produksi += '  <td class="label-cell"  align="left" >' + val.keterangan + '</td>';

					data_produksi += '  <td class="label-cell" ><center>' + val.penjualan_qty + '</center></td>';
					data_produksi += ' </tr>';
				});

				data_produksi += '</tbody>';
				data_produksi += '</table>';
				let options = {
					documentSize: 'A4',
					type: 'share',
					fileName: 'Report_produksi_proses.pdf'
				}
				console.log(data_produksi);
				pdf.fromData(data_produksi, options)
					.then((stats) => console.log('status', stats))
					.catch((err) => console.err(err));

			}

			app.dialog.close();
		},
		error: function (xmlhttprequest, textstatus, message) {

			jQuery('#total_data').html(0);
		}
	});
}

function getDashboardProduksi(jenis = null) {
	jQuery.ajax({
		type: 'POST',
		url: "" + BASE_API + "/get-dashboard-produksi",
		dataType: 'JSON',
		data: {
			karyawan_id: localStorage.getItem("user_id")
		},
		beforeSend: function () {
		},
		success: function (data) {
			var data_produksi = '';
			console.log(data);
			if (data.data.length != 0) {
				var nota = '';
				var now = moment();
				var idx = 0;
				jQuery.each(data.data, function (i, val) {
					if (now >= moment(val.penjualan_tanggal_kirim).subtract(8, 'days')) {
						if (nota != val.penjualan_id) {
							nota = val.penjualan_id;
							if (idx != 0) {
								data_produksi += ' &nbsp; &nbsp; <span style="color:black; font-weight:bold">|</span> &nbsp; &nbsp;  ';
							}
							idx++;

							data_produksi += moment(val.penjualan_tanggal_kirim).subtract(5, 'days').format('DD-MMM') + ' - ';
							data_produksi += moment(val.penjualan_tanggal).format('DDMMYY') + '-' + val.penjualan_id.replace(/\INV_/g, '').replace(/^0+/, '') + ' - ';
							data_produksi += val.client_nama + ' - ';
						} else {
							data_produksi += ', ';
						}
						data_produksi += val.penjualan_jenis;
					}
				});
				if (jenis == 'proses') {
					jQuery("#data_produksi_telat2").html(data_produksi);
				} else if (jenis == 'selesai') {
					jQuery("#data_produksi_telat3").html(data_produksi);
					jQuery("#data_produksi_telat4").html(data_produksi);
				} else {
					jQuery("#data_produksi_telat").html(data_produksi);
				}

			} else {
				if (jenis == 'proses') {
					jQuery("#data_produksi_telat2").html('Tidak Ada Produksi Terlambat');
				} else if (jenis == 'selesai') {
					jQuery("#data_produksi_telat3").html('Tidak Ada Produksi Terlambat');
					jQuery("#data_produksi_telat4").html('Tidak Ada Produksi Terlambat');
				} else {
					jQuery("#data_produksi_telat").html('Tidak Ada Produksi Terlambat');
				}
			}
		},
		error: function (xmlhttprequest, textstatus, message) {
		}
	});
}