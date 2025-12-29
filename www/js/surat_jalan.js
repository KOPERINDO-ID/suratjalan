
function getSuratJalanProduksi() {
	jQuery.ajax({
		type: 'POST',
		url: "" + BASE_API + "/get-surat-jalan-produksi",
		dataType: 'JSON',
		data: {
			karyawan_id: localStorage.getItem("user_id"),
			lokasi_pabrik: localStorage.getItem("lokasi_pabrik_surat")
		},
		beforeSend: function () {
		},
		success: function (data) {
			var data_produksi = '';
			console.log(data);
			if (data.data.length != 0) {
				var nota = '';
				var idx = 0;
				jQuery.each(data.data, function (i, val) {

					var kurang_bayar = parseFloat(val.penjualan_grandtotal - val.penjualan_jumlah_pembayaran);
					var kurang_bayar_bg = '';
					if (kurang_bayar <= 0) {
						if (nota != val.penjualan_id) {
							nota = val.penjualan_id;
							if (idx != 0) {
								data_produksi += ' &nbsp; &nbsp; <span style="color:black; font-weight:bold">|</span> &nbsp;  ';
							}
							idx++;


							//data_produksi += moment(val.penjualan_tanggal_kirim).format('DD-MMM') + ' - ';
							data_produksi += moment(val.penjualan_tanggal).format('DDMMYY') + '-' + val.penjualan_id.replace(/\INV_/g, '').replace(/^0+/, '') + ' - ';
							data_produksi += val.client_nama + '';
						} else {
							data_produksi += '';
						}
					}

				});
				jQuery("#data_surat_jalan_berjalan").html(data_produksi);

			} else {

				jQuery("#data_surat_jalan_berjalan").html('Tidak Ada Data');

			}
		},
		error: function (xmlhttprequest, textstatus, message) {
		}
	});
}

function SJValue() {
	jQuery('#no_surat_jalan').val('SJ_');
}

function SJEmptyValue(id) {
	console.log(id);
	jQuery('#jumlah_' + id + '').val('');
}

function detailPenjualanProduksiSj(penjualan_id) {
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
					if (val.keterangan != null) {
						var keterangan_fix = val.keterangan;
					} else {
						var keterangan_fix = '';
					}
					if (val.gambar.substring(0, 5) == "koper") {
						var path_image = 'https://tasindo-sale-webservice.digiseminar.id/product_image_new';
					} else {
						var path_image = 'https://tasindo-sale-webservice.digiseminar.id/performa_image';
					}
					detail_sales_data += ' <tr>';
					detail_sales_data += '   <td colspan="1" class="label-cell text-align-center" width="40%">' + val.penjualan_jenis + '<br><img data-image-src="' + path_image + '/' + val.gambar + '" class="pb-popup-dark" src="' + path_image + '/' + val.gambar + '" width="100%"></td>';
					detail_sales_data += '   <td colspan="2" class="label-cell text-align-center" width="60%" style="white-space: pre;">' + val.produk_keterangan_kustom + '<br><font color="red">' + keterangan_fix + '</font></td>';
					detail_sales_data += '</tr>';
					detail_sales_data += ' <tr class="">';
					detail_sales_data += '  <td colspan="3" class="label-cell text-align-center">Qty : ' + val.penjualan_qty + '</td>';
					detail_sales_data += ' </tr>';
					detail_sales_data += '</tbody>';
					detail_sales_data += '</table><br>';
				});

				detail_sales_data += '<table  width="100%" style="border-collapse: collapse; border:1px solid gray;" border="1">';
				detail_sales_data += '<tbody>';
				detail_sales_data += ' <tr class="bg-dark-gray-medium">';
				detail_sales_data += '  <td colspan="3" class="label-cell text-align-center">';
				detail_sales_data += '   Customer Logo';
				detail_sales_data += ' </td>';
				detail_sales_data += '</tr>';
				detail_sales_data += ' <tr >';
				detail_sales_data += '  <td colspan="3" class="label-cell text-align-center">';
				detail_sales_data += '  <img onclick="zoom_view(this.src);" width="70%" src="' + BASE_PATH_IMAGE_CUSTOMER + '/' + data.data[0].customer_logo + '" />';
				detail_sales_data += ' </td>';
				detail_sales_data += '</tr>';
				detail_sales_data += ' <tr class="bg-dark-gray-medium">';
				detail_sales_data += '  <td colspan="3" class="label-cell text-align-center">';
				detail_sales_data += '   Logo Bordir';
				detail_sales_data += ' </td>';
				detail_sales_data += '</tr>';
				detail_sales_data += ' <tr >';
				detail_sales_data += '  <td colspan="3" class="label-cell text-align-center">';
				detail_sales_data += '  <img onclick="zoom_view(this.src);" width="70%" src="' + BASE_PATH_IMAGE_CUSTOMER + '/' + data.data[0].customer_logo_bordir + '" />';
				detail_sales_data += ' </td>';
				detail_sales_data += '</tr>';

				if (data.data[0].customer_logo_tambahan != "") {
					detail_sales_data += ' <tr class="bg-dark-gray-medium">';
					detail_sales_data += '  <td colspan="3" class="label-cell text-align-center">';
					detail_sales_data += '   Logo Tambahan';
					detail_sales_data += ' </td>';
					detail_sales_data += '</tr>';
					detail_sales_data += ' <tr >';
					detail_sales_data += '  <td colspan="3" class="label-cell text-align-center">';
					detail_sales_data += '  <img onclick="zoom_view(this.src);" width="70%" src="' + BASE_PATH_IMAGE_CUSTOMER + '/' + data.data[0].customer_logo_tambahan + '" />';
					detail_sales_data += ' </td>';
					detail_sales_data += '</tr>';
				}
				detail_sales_data += '</table>';



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

function retur(kode_retur1, tgl_retur1, penerima1, keterangan1, retur1, kode_retur2, tgl_retur2, penerima2, keterangan2, retur2, kode_retur3, tgl_retur3, penerima3, keterangan3, retur3, kode_retur4, tgl_retur4, penerima4, keterangan4, retur4, kode_retur5, tgl_retur5, penerima5, keterangan5, retur5, kode_retur6, tgl_retur6, penerima6, keterangan6, retur6, kode_retur7, tgl_retur7, penerima7, keterangan7, retur7, kode_retur8, tgl_retur8, penerima8, keterangan8, retur8, kode_retur9, tgl_retur9, penerima9, keterangan9, retur9, kode_retur10, tgl_retur10, penerima10, keterangan10, retur10, client_id, type) {

	$$(".input1").prop('required', true);
	$$(".input2").removeAttr("required");
	$$(".input3").removeAttr("required");
	$$(".input4").removeAttr("required");
	$$(".input5").removeAttr("required");
	$$(".input6").removeAttr("required");

	if (number_format(retur1) != 0) {
		$$('.content_retur2').show();
		$$(".input2").prop('required', true);
		jQuery('#kode_retur1').val(kode_retur1);
		jQuery('#tanggal_retur1').html(moment(tgl_retur1).format('DD-MMM'));
		jQuery('#penerima1').val(penerima1);
		jQuery('#ket_retur1').val(keterangan1);
		jQuery('#retur_qty1').val(retur1);
		$$('#kode_retur1').attr('readonly', true);
		$$('#kode_retur1').prop("onclick", null).off("click");
		$$('#tanggal_retur1').attr('readonly', true);
		$$('#tanggal_retur1').prop("onclick", null).off("click");
		$$('#penerima1').attr('readonly', true);
		$$('#penerima1').prop("onclick", null).off("click");
		$$('#ket_retur1').attr('readonly', true);
		$$('#ket_retur1').prop("onclick", null).off("click");
		$$('#retur_qty1').attr('readonly', true);
		$$('#retur_qty1').prop("onclick", null).off("click");
	} else {
		$$('.content_retur2').hide();
		jQuery('#kode_retur1').val("");
		jQuery('#tanggal_retur1').html("Tanggal");
		jQuery('#penerima1').val("");
		jQuery('#ket_retur1').val("");
		jQuery('#retur_qty1').val("");
		$$('#kode_retur1').removeAttr("readonly");
		$$('#kode_retur1').attr('onClick', 'emptyValue("kode_retur1")');
		$$('#tanggal_retur1').removeAttr("readonly");
		$$('#tanggal_retur1').attr('onClick', 'emptyValue("tanggal_retur1")');
		$$('#penerima1').removeAttr('readonly');
		$$('#penerima1').attr('onClick', 'emptyValue("penerima1")');
		$$('#ket_retur1').removeAttr('readonly');
		$$('#ket_retur1').attr('onClick', 'emptyValue("ket_retur1")');
		$$('#retur_qty1').removeAttr("readonly");
		$$('#retur_qty1').attr('onClick', 'suratJalanValue("retur_qty1")');
	}

	if (number_format(retur2) != 0) {
		$$('.content_retur3').show();
		$$(".input3").prop('required', true);
		jQuery('#kode_retur2').val(kode_retur2);
		jQuery('#tanggal_retur2').html(moment(tgl_retur2).format('DD-MMM'));
		jQuery('#penerima2').val(penerima2);
		jQuery('#ket_retur2').val(keterangan2);
		jQuery('#retur_qty2').val(retur2);

		$$('#kode_retur2').attr('readonly', true);
		$$('#kode_retur2').prop("onclick", null).off("click");
		$$('#tanggal_retur2').attr('readonly', true);
		$$('#tanggal_retur2').prop("onclick", null).off("click");
		$$('#penerima2').attr('readonly', true);
		$$('#penerima2').prop("onclick", null).off("click");
		$$('#ket_retur2').attr('readonly', true);
		$$('#ket_retur2').prop("onclick", null).off("click");
		$$('#retur_qty2').attr('readonly', true);
		$$('#retur_qty2').prop("onclick", null).off("click");
	} else {
		$$('.content_retur3').hide();
		jQuery('#kode_retur2').val("");
		jQuery('#tanggal_retur2').html("Tanggal");
		jQuery('#penerima2').val("");
		jQuery('#ket_retur2').val("");
		jQuery('#retur_qty2').val("");
		$$('#kode_retur2').removeAttr("readonly");
		$$('#kode_retur2').attr('onClick', 'emptyValue("kode_retur2")');
		$$('#tanggal_retur2').removeAttr("readonly");
		$$('#tanggal_retur2').attr('onClick', 'emptyValue("tanggal_retur2")');
		$$('#penerima2').removeAttr('readonly');
		$$('#penerima2').attr('onClick', 'emptyValue("penerima2")');
		$$('#ket_retur2').removeAttr('readonly');
		$$('#ket_retur2').attr('onClick', 'emptyValue("ket_retur2")');
		$$('#retur_qty2').removeAttr("readonly");
		$$('#retur_qty2').attr('onClick', 'suratJalanValue("retur_qty2")');
	}

	if (number_format(retur3) != 0) {
		$$('.content_retur4').show();
		$$(".input4").prop('required', true);
		jQuery('#kode_retur3').val(kode_retur3);
		jQuery('#tanggal_retur3').html(moment(tgl_retur3).format('DD-MMM'));
		jQuery('#penerima3').val(penerima3);
		jQuery('#ket_retur3').val(keterangan3);
		jQuery('#retur_qty3').val(retur3);

		$$('#kode_retur3').attr('readonly', true);
		$$('#kode_retur3').prop("onclick", null).off("click");
		$$('#tanggal_retur3').attr('readonly', true);
		$$('#tanggal_retur3').prop("onclick", null).off("click");
		$$('#penerima3').attr('readonly', true);
		$$('#penerima3').prop("onclick", null).off("click");
		$$('#ket_retur3').attr('readonly', true);
		$$('#ket_retur3').prop("onclick", null).off("click");
		$$('#retur_qty3').attr('readonly', true);
		$$('#retur_qty3').prop("onclick", null).off("click");
	} else {
		$$('.content_retur4').hide();
		jQuery('#kode_retur3').val("");
		jQuery('#tanggal_retur3').html("Tanggal");
		jQuery('#penerima3').val("");
		jQuery('#ket_retur3').val("");
		jQuery('#retur_qty3').val("");
		$$('#kode_retur3').removeAttr("readonly");
		$$('#kode_retur3').attr('onClick', 'emptyValue("kode_retur3")');
		$$('#tanggal_retur3').removeAttr("readonly");
		$$('#tanggal_retur3').attr('onClick', 'emptyValue("tanggal_retur3")');
		$$('#penerima3').removeAttr('readonly');
		$$('#penerima3').attr('onClick', 'emptyValue("penerima3")');
		$$('#ket_retur3').removeAttr('readonly');
		$$('#ket_retur3').attr('onClick', 'emptyValue("ket_retur3")');
		$$('#retur_qty3').removeAttr("readonly");
		$$('#retur_qty3').attr('onClick', 'suratJalanValue("retur_qty3")');
	}


	if (number_format(retur4) != 0) {
		$$('.content_retur5').show();
		$$(".input5").prop('required', true);
		jQuery('#kode_retur4').val(kode_retur4);
		jQuery('#tanggal_retur4').html(moment(tgl_retur4).format('DD-MMM'));
		jQuery('#penerima4').val(penerima4);
		jQuery('#ket_retur4').val(keterangan4);
		jQuery('#retur_qty4').val(retur4);

		$$('#kode_retur4').attr('readonly', true);
		$$('#kode_retur4').prop("onclick", null).off("click");
		$$('#tanggal_retur4').attr('readonly', true);
		$$('#tanggal_retur4').prop("onclick", null).off("click");
		$$('#penerima4').attr('readonly', true);
		$$('#penerima4').prop("onclick", null).off("click");
		$$('#ket_retur4').attr('readonly', true);
		$$('#ket_retur4').prop("onclick", null).off("click");
		$$('#retur_qty4').attr('readonly', true);
		$$('#retur_qty4').prop("onclick", null).off("click");
	} else {
		$$('.content_retur5').hide();
		jQuery('#kode_retur4').val("");
		jQuery('#tanggal_retur4').html("Tanggal");
		jQuery('#penerima4').val("");
		jQuery('#ket_retur4').val("");
		jQuery('#retur_qty4').val("");
		$$('#kode_retur4').removeAttr("readonly");
		$$('#kode_retur4').attr('onClick', 'emptyValue("kode_retur4")');
		$$('#tanggal_retur4').removeAttr("readonly");
		$$('#tanggal_retur4').attr('onClick', 'emptyValue("tanggal_retur4")');
		$$('#penerima4').removeAttr('readonly');
		$$('#penerima4').attr('onClick', 'emptyValue("penerima4")');
		$$('#ket_retur4').removeAttr('readonly');
		$$('#ket_retur4').attr('onClick', 'emptyValue("ket_retur4")');
		$$('#retur_qty4').removeAttr("readonly");
		$$('#retur_qty4').attr('onClick', 'suratJalanValue("retur_qty4")');
	}

	if (number_format(retur5) != 0) {
		$$('.content_retur6').show();
		jQuery('#kode_retur5').val(kode_retur5);
		jQuery('#tanggal_retur5').html(moment(tgl_retur5).format('DD-MMM'));
		jQuery('#penerima5').val(penerima5);
		jQuery('#ket_retur5').val(keterangan5);
		jQuery('#retur_qty5').val(retur5);

		$$('#kode_retur5').attr('readonly', true);
		$$('#kode_retur5').prop("onclick", null).off("click");
		$$('#tanggal_retur5').attr('readonly', true);
		$$('#tanggal_retur5').prop("onclick", null).off("click");
		$$('#penerima5').attr('readonly', true);
		$$('#penerima5').prop("onclick", null).off("click");
		$$('#ket_retur5').attr('readonly', true);
		$$('#ket_retur5').prop("onclick", null).off("click");
		$$('#retur_qty5').attr('readonly', true);
		$$('#retur_qty5').prop("onclick", null).off("click");
	} else {
		$$('.content_retur6').hide();
		jQuery('#kode_retur5').val("");
		jQuery('#tanggal_retur5').html("Tanggal");
		jQuery('#penerima5').val("");
		jQuery('#ket_retur5').val("");
		jQuery('#retur_qty5').val("");
		$$('#kode_retur5').removeAttr("readonly");
		$$('#kode_retur5').attr('onClick', 'emptyValue("kode_retur5")');
		$$('#tanggal_retur5').removeAttr("readonly");
		$$('#tanggal_retur5').attr('onClick', 'emptyValue("tanggal_retur5")');
		$$('#penerima5').removeAttr('readonly');
		$$('#penerima5').attr('onClick', 'emptyValue("penerima5")');
		$$('#ket_retur5').removeAttr('readonly');
		$$('#ket_retur5').attr('onClick', 'emptyValue("ket_retur5")');
		$$('#retur_qty5').removeAttr("readonly");
		$$('#retur_qty5').attr('onClick', 'suratJalanValue("retur_qty5")');
	}

	jQuery('#client_id_retur').val(client_id);

}

function prosesRetur() {
	if (!$$('#retur_form')[0].checkValidity()) {
		app.dialog.alert('Cek Isian Retur Anda');
	} else {
		jQuery.ajax({
			type: 'POST',
			url: "" + BASE_API + "/retur-proses",
			dataType: 'JSON',
			data: {
				client_id: jQuery("#client_id_retur").val(),
				penerima1: jQuery("#penerima1").val(),
				retur_qty1: jQuery("#retur_qty1").val(),
				tanggal_retur1: jQuery("#tanggal_retur1").val(),
				ket_retur1: jQuery("#ket_retur1").val(),
				kode_retur1: jQuery("#kode_retur1").val(),
				penerima2: jQuery("#penerima2").val(),
				retur_qty2: jQuery("#retur_qty2").val(),
				tanggal_retur2: jQuery("#tanggal_retur2").val(),
				ket_retur2: jQuery("#ket_retur2").val(),
				kode_retur2: jQuery("#kode_retur2").val(),
				penerima3: jQuery("#penerima3").val(),
				retur_qty3: jQuery("#retur_qty3").val(),
				tanggal_retur3: jQuery("#tanggal_retur3").val(),
				ket_retur3: jQuery("#ket_retur3").val(),
				kode_retur3: jQuery("#kode_retur3").val(),
				penerima4: jQuery("#penerima4").val(),
				retur_qty4: jQuery("#retur_qty4").val(),
				tanggal_retur4: jQuery("#tanggal_retur4").val(),
				ket_retur4: jQuery("#ket_retur4").val(),
				kode_retur4: jQuery("#kode_retur4").val(),
				penerima5: jQuery("#penerima5").val(),
				retur_qty5: jQuery("#retur_qty5").val(),
				tanggal_retur5: jQuery("#tanggal_retur5").val(),
				ket_retur5: jQuery("#ket_retur5").val(),
				kode_retur5: jQuery("#kode_retur5").val()
			},
			beforeSend: function () {
				app.dialog.preloader('Harap Tunggu');
			},
			success: function (data) {
				getHeaderPenjualanKunjungan(1);
				app.dialog.close();
				app.popup.close();
				$$('#retur_field').empty();
				if (data.status == 'done') {
					app.dialog.alert('Berhasil Input Retur');
				} else if (data.status == 'failed') {
					app.dialog.alert('Gagal Input Retur');
				}
			},
			error: function (xmlhttprequest, textstatus, message) {
			}
		});
	}
}


function openPopupSales(nama, hp, alamat) {
	$$('#popup-td-karyawan_nama').html(nama);
	$$('#popup-td-karyawan_hp').html(hp);
	$$('#popup-td-karyawan_alamat').html(alamat);
}


function suratJalan(kendaraan1, kendaraan2, kendaraan3, kendaraan4, kendaraan5, plat_no1, plat_no2, plat_no3, plat_no4, plat_no5, pengirim1, pengirim2, pengirim3, pengirim4, pengirim5, total_kirim, total_terkirim, penjualan_id, penjualan_detail_performa_id, kiriman_1, kiriman_2, kiriman_3, kiriman_4, kiriman_5, tgl_kirim1, tgl_kirim2, tgl_kirim3, tgl_kirim4, tgl_kirim5, surat_jalan1, surat_jalan2, surat_jalan3, surat_jalan4, surat_jalan5) {
	$$('#penjualan_detail_performa_id').val(penjualan_detail_performa_id);
	$$('#penjualan_id_surat_jalan').val(penjualan_id);
	$$('#stok_kirim_html').html(total_kirim);
	$$('#total_kirim_html').html(total_terkirim);
	var sisa = total_kirim - total_terkirim;
	$$('#sisa_kirim_html').html(sisa);

	$$(".input-sj-1").prop('required', true);
	$$(".input-sj-2").removeAttr("required");
	$$(".input-sj-3").removeAttr("required");
	$$(".input-sj-4").removeAttr("required");
	$$(".input-sj-5").removeAttr("required");
	$$(".input-sj-6").removeAttr("required");


	if (number_format(kiriman_1) != 0) {
		$$('.content_kirim2').show();
		$$(".input-sj-2").prop('required', true);
		$$('#kiriman_1').val(number_format(kiriman_1));
		$$('#surat_jalan1').val(surat_jalan1);
		$$('#kendaraan1').val(kendaraan1);
		$$('#plat_no1').val(plat_no1);
		$$('#pengirim1').val(pengirim1);
		$$('#popup-kirim-1').html(moment(tgl_kirim1).format('DD-MMM'));
		$$('#kiriman_1').attr('readonly', true);
		$$('#kiriman_1').prop("onclick", null).off("click");
		$$('#plat_no1').attr('readonly', true);
		$$('#plat_no1').prop("onclick", null).off("click");
		$$('#kendaraan1').attr('readonly', true);
		$$('#kendaraan1').prop("onclick", null).off("click");
		$$('#pengirim1').attr('readonly', true);
		$$('#pengirim1').prop("onclick", null).off("click");
		$$('#surat_jalan1').attr('readonly', true);
		$$('#surat_jalan1').prop("onclick", null).off("click");
	} else {
		$$('#kiriman_1').val(number_format(0));
		$$('#surat_jalan1').val("");
		$$('.content_kirim2').hide();
		$$('#popup-kirim-1').html("tgl");

		$$('#kiriman_1').val("");
		$$('#plat_no1').val("");
		$$('#kendaraan1').val("");
		$$('#pengirim1').val("");
		$$('#surat_jalan1').val("");

		$$('#kiriman_1').removeAttr("readonly");
		$$('#kiriman_1').attr('onClick', 'emptyValue("kiriman_1")');
		$$('#plat_no1').removeAttr("readonly");
		$$('#plat_no1').attr('onClick', 'emptyValue("plat_no1")');
		$$('#kendaraan1').removeAttr('readonly');
		$$('#kendaraan1').attr('onClick', 'emptyValue("kendaraan1")');
		$$('#pengirim1').removeAttr('readonly');
		$$('#pengirim1').attr('onClick', 'emptyValue("pengirim1")');
		$$('#surat_jalan1').removeAttr("readonly");
		$$('#surat_jalan1').attr('onClick', 'suratJalanValue("surat_jalan1")');
	}
	if (number_format(kiriman_2) != 0) {
		$$('.content_kirim3').show();
		$$(".input-sj-3").prop('required', true);
		$$('#kiriman_2').val(number_format(kiriman_2));
		$$('#surat_jalan2').val(surat_jalan2);
		$$('#kendaraan2').val(kendaraan2);
		$$('#plat_no2').val(plat_no2);
		$$('#pengirim2').val(pengirim2);
		$$('#popup-kirim-2').html(moment(tgl_kirim2).format('DD-MMM'));
		$$('#kiriman_2').attr('readonly', true);
		$$('#kiriman_2').prop("onclick", null).off("click");
		$$('#plat_no2').attr('readonly', true);
		$$('#plat_no2').prop("onclick", null).off("click");
		$$('#kendaraan2').attr('readonly', true);
		$$('#kendaraan2').prop("onclick", null).off("click");
		$$('#pengirim2').attr('readonly', true);
		$$('#pengirim2').prop("onclick", null).off("click");
		$$('#surat_jalan2').attr('readonly', true);
		$$('#surat_jalan2').prop("onclick", null).off("click");
	} else {
		$$('#kiriman_2').val(number_format(0));
		$$('#surat_jalan2').val("");
		$$('.content_kirim3').hide();
		$$('#popup-kirim-2').html("tgl");
		$$('#kiriman_2').val("");
		$$('#plat_no2').val("");
		$$('#kendaraan2').val("");
		$$('#pengirim2').val("");
		$$('#surat_jalan2').val("");

		$$('#kiriman_2').removeAttr("readonly");
		$$('#kiriman_2').attr('onClick', 'emptyValue("kiriman_2")');
		$$('#plat_no2').removeAttr("readonly");
		$$('#plat_no2').attr('onClick', 'emptyValue("plat_no2")');
		$$('#kendaraan2').removeAttr('readonly');
		$$('#kendaraan2').attr('onClick', 'emptyValue("kendaraan2")');
		$$('#pengirim2').removeAttr('readonly');
		$$('#pengirim2').attr('onClick', 'emptyValue("pengirim2")');
		$$('#surat_jalan2').removeAttr("readonly");
		$$('#surat_jalan2').attr('onClick', 'suratJalanValue("surat_jalan2")');
	}

	if (number_format(kiriman_3) != 0) {
		$$('#kiriman_3').val(number_format(kiriman_3));
		$$('#surat_jalan3').val(surat_jalan3);
		$$('#kendaraan3').val(kendaraan3);
		$$('#plat_no3').val(plat_no3);
		$$('#pengirim3').val(pengirim3);
		$$('#popup-kirim-3').html(moment(tgl_kirim3).format('DD-MMM'));
		$$('#kiriman_3').attr('readonly', true);
		$$('.content_kirim4').show();
		$$(".input-sj-4").prop('required', true);
		$$('#kiriman_3').prop("onclick", null).off("click");
		$$('#plat_no3').attr('readonly', true);
		$$('#plat_no3').prop("onclick", null).off("click");
		$$('#kendaraan3').attr('readonly', true);
		$$('#kendaraan3').prop("onclick", null).off("click");
		$$('#pengirim3').attr('readonly', true);
		$$('#pengirim3').prop("onclick", null).off("click");
		$$('#surat_jalan3').attr('readonly', true);
		$$('#surat_jalan3').prop("onclick", null).off("click");
	} else {
		$$('#kiriman_3').val(number_format(0));
		$$('#surat_jalan3').val("");
		$$('.content_kirim4').hide();
		$$('#kiriman_3').val("");
		$$('#plat_no3').val("");
		$$('#kendaraan3').val("");
		$$('#pengirim3').val("");
		$$('#surat_jalan3').val("");

		$$('#popup-kirim-3').html("tgl");
		$$('#kiriman_3').removeAttr("readonly");
		$$('#kiriman_3').attr('onClick', 'emptyValue("kiriman_3")');
		$$('#plat_no3').removeAttr("readonly");
		$$('#plat_no3').attr('onClick', 'emptyValue("plat_no3")');
		$$('#kendaraan3').removeAttr('readonly');
		$$('#kendaraan3').attr('onClick', 'emptyValue("kendaraan3")');
		$$('#pengirim3').removeAttr('readonly');
		$$('#pengirim3').attr('onClick', 'emptyValue("pengirim3")');
		$$('#surat_jalan3').removeAttr("readonly");
		$$('#surat_jalan3').attr('onClick', 'suratJalanValue("surat_jalan3")');
	}
	if (number_format(kiriman_4) != 0) {
		$$('#kiriman_4').val(number_format(kiriman_4));
		$$('#surat_jalan4').val(surat_jalan4);
		$$('#kendaraan4').val(kendaraan4);
		$$('#plat_no4').val(plat_no4);
		$$('#pengirim4').val(pengirim4);
		$$('#popup-kirim-4').html(moment(tgl_kirim4).format('DD-MMM'));
		$$('#kiriman_4').attr('readonly', true);
		$$('.content_kirim5').show();
		$$(".input-sj-5").prop('required', true);
		$$('#kiriman_4').prop("onclick", null).off("click");
		$$('#plat_no4').attr('readonly', true);
		$$('#plat_no4').prop("onclick", null).off("click");
		$$('#kendaraan4').attr('readonly', true);
		$$('#kendaraan4').prop("onclick", null).off("click");
		$$('#pengirim4').attr('readonly', true);
		$$('#pengirim4').prop("onclick", null).off("click");
		$$('#surat_jalan4').attr('readonly', true);
		$$('#surat_jalan4').prop("onclick", null).off("click");
	} else {
		$$('#kiriman_4').val(number_format(0));
		$$('#surat_jalan4').val("");
		$$('.content_kirim5').hide();
		$$('#popup-kirim-4').html("tgl");
		$$('#kiriman_4').val("");
		$$('#plat_no4').val("");
		$$('#kendaraan4').val("");
		$$('#pengirim4').val("");
		$$('#surat_jalan4').val("");

		$$('#kiriman_4').removeAttr("readonly");
		$$('#kiriman_4').attr('onClick', 'emptyValue("kiriman_4")');
		$$('#plat_no4').removeAttr("readonly");
		$$('#plat_no4').attr('onClick', 'emptyValue("plat_no4")');
		$$('#kendaraan4').removeAttr('readonly');
		$$('#kendaraan4').attr('onClick', 'emptyValue("kendaraan4")');
		$$('#pengirim4').removeAttr('readonly');
		$$('#pengirim4').attr('onClick', 'emptyValue("pengirim4")');
		$$('#surat_jalan4').removeAttr("readonly");
		$$('#surat_jalan4').attr('onClick', 'suratJalanValue("surat_jalan4")');
	}
	if (number_format(kiriman_5) != 0) {
		$$('#kiriman_5').val(number_format(kiriman_5));
		$$('#surat_jalan5').val(surat_jalan5);
		$$('#kendaraan5').val(kendaraan5);
		$$('#plat_no5').val(plat_no5);
		$$('#pengirim5').val(pengirim5);
		$$('#kiriman_5').attr('readonly', true);
		$$('#popup-kirim-5').html(moment(tgl_kirim5).format('DD-MMM'));
		$$('.content_kirim6').show();
		$$(".input-sj-6").prop('required', true);
		$$('#kiriman_5').prop("onclick", null).off("click");
		$$('#plat_no5').attr('readonly', true);
		$$('#plat_no5').prop("onclick", null).off("click");
		$$('#kendaraan5').attr('readonly', true);
		$$('#kendaraan5').prop("onclick", null).off("click");
		$$('#pengirim5').attr('readonly', true);
		$$('#pengirim5').prop("onclick", null).off("click");
		$$('#surat_jalan5').attr('readonly', true);
		$$('#surat_jalan5').prop("onclick", null).off("click");
	} else {
		$$('#kiriman_5').val(number_format(0));
		$$('#surat_jalan5').val("");
		$$('.content_kirim6').hide();
		$$('#popup-kirim-5').html("tgl");
		$$('#kiriman_5').val("");
		$$('#plat_no5').val("");
		$$('#kendaraan5').val("");
		$$('#pengirim5').val("");
		$$('#surat_jalan5').val("");

		$$('#kiriman_5').removeAttr("readonly");
		$$('#kiriman_5').attr('onClick', 'emptyValue("kiriman_5")');
		$$('#plat_no5').removeAttr("readonly");
		$$('#plat_no5').attr('onClick', 'emptyValue("plat_no5")');
		$$('#kendaraan5').removeAttr('readonly');
		$$('#kendaraan5').attr('onClick', 'emptyValue("kendaraan5")');
		$$('#pengirim5').removeAttr('readonly');
		$$('#pengirim5').attr('onClick', 'emptyValue("pengirim5")');
		$$('#surat_jalan5').removeAttr("readonly");
		$$('#surat_jalan5').attr('onClick', 'suratJalanValue("surat_jalan5")');
	}
}

function fotoSuratJalan(id, foto_surat_jalan) {
	console.log(id);
	console.log(foto_surat_jalan);
}

function lihatFotoSuratJalan(src) {
	console.log('KLIK');
	var gambar_zoom = BASE_PATH_IMAGE_SURAT_JALAN + '/' + src;
	var myPhotoBrowserPopupDark = app.photoBrowser.create({
		photos: [
			'' + gambar_zoom + ''
		],
		theme: 'dark',
		type: 'popup'
	});
	myPhotoBrowserPopupDark.open();
}

function getSuratJalanList(penjualan_id, penjualan_qty, client_nama, kode_spk) {
	jQuery.ajax({
		type: 'POST',
		url: "" + BASE_API + "/get-surat-jalan-list",
		dataType: 'JSON',
		data: {
			penjualan_id: penjualan_id
		},
		beforeSend: function () {
			app.dialog.preloader('Harap Tunggu');
			$$('#terkirim_sj').html('-');
			$$('#kurang_terkirim_sj').html('-');
		},
		success: function (data) {
			app.dialog.close();

			$$('#text_file_path_edit_sj').html('Foto');
			var penjualan_value = "";
			var total_qty = 0;
			var total_stok_sj = $$('#stok_sj').html();
			var no_transaksi = client_nama + ' - ' + kode_spk;
			if (data.data.length != 0) {
				$.each(data.data, function (i_qty, item_qty) {
					total_qty += item_qty.jumlah_kirim;
				});
				$$('#terkirim_sj').html(total_qty);
				$$('#kurang_terkirim_sj').html(total_stok_sj - total_qty);
			}

			$.each(data.data_distinct, function (i_d, item_d) {
				if (item_d.valid_cs == 2) {
					penjualan_value += '<tr>';
					penjualan_value += '<td  style="border-left:1px solid gray;  border-right:1px solid gray; border-bottom:1px solid gray;" align="center"  class="label-cell col col-border card-color-red">' + item_d.no_surat_jalan + '</td>';
					penjualan_value += '<td align="center" colspan="3" style="border-left:1px solid gray;  border-right:1px solid gray; border-bottom:1px solid gray;"  class="label-cell col col-border card-color-red">' + moment(item_d.tanggal).format('DD-MMM-YY hh:mm') + '</td>';
					if (item_d.foto_surat_jalan != null) {
						penjualan_value += '<td align="center"  style="  border-left:1px solid gray;  border-right:1px solid gray; border-bottom:1px solid gray;"  class="label-cell card-color-red">';
						penjualan_value += '	<div class="row no-gap">';
						penjualan_value += '		<div class="col-50">';
						penjualan_value += '			<button class="popup-open text-add-colour-black-soft bg-dark-gray-young button-small col button text-bold" data-popup=".edit-surat-jalan" onclick="editSuratJalan(\'' + item_d.no_surat_jalan + '\',\'' + no_transaksi + '\',\'' + penjualan_id + '\');">Edit</button>';
						penjualan_value += '		</div>';
						penjualan_value += '		<div class="col-50">';
						penjualan_value += '			<button style="background-color: blue; color:white;" class="text-add-colour-black-soft button-small col button text-bold"  onclick="lihatFotoSuratJalan(\'' + item_d.foto_surat_jalan + '\');">Foto</button>';
						penjualan_value += '		</div>';
						penjualan_value += '	</div>';
						penjualan_value += '</td>';
					} else {

						penjualan_value += '<td align="center"  style="  border-left:1px solid gray;  border-right:1px solid gray; border-bottom:1px solid gray;"  class="label-cell card-color-red">';
						penjualan_value += '	<div class="row no-gap">';
						penjualan_value += '		<div class="col-50">';
						penjualan_value += '			<button class="popup-open text-add-colour-black-soft bg-dark-gray-young button-small col button text-bold" data-popup=".edit-surat-jalan" onclick="editSuratJalan(\'' + item_d.no_surat_jalan + '\',\'' + no_transaksi + '\',\'' + penjualan_id + '\');">Edit</button>';
						penjualan_value += '		</div>';
						penjualan_value += '		<div class="col-50">';
						penjualan_value += '			<button  class="text-add-colour-black-soft bg-dark-gray-young button-small col button text-bold"  onclick="lihatFotoSuratJalan(\'' + item_d.foto_surat_jalan + '\');">Foto</button>';
						penjualan_value += '		</div>';
						penjualan_value += '	</div>';
						penjualan_value += '</td>';
					}
					penjualan_value += '</tr>';
				} else {
					penjualan_value += '<tr>';
					penjualan_value += '<td  style="border-left:1px solid gray;  border-right:1px solid gray; border-bottom:1px solid gray;" align="center"  class="label-cell col col-border bg-dark-gray-medium">' + item_d.no_surat_jalan + '</td>';
					penjualan_value += '<td align="center" colspan="3" style="border-left:1px solid gray;  border-right:1px solid gray; border-bottom:1px solid gray;"  class="label-cell col col-border bg-dark-gray-medium">' + moment(item_d.tanggal).format('DD-MMM-YY hh:mm') + '</td>';
					if (item_d.foto_surat_jalan != null) {
						penjualan_value += '<td align="center"  style="  border-left:1px solid gray;  border-right:1px solid gray; border-bottom:1px solid gray;"  class="label-cell"><button style="background-color: blue; color:white;" class="text-add-colour-black-soft button-small col button text-bold"  onclick="lihatFotoSuratJalan(\'' + item_d.foto_surat_jalan + '\');">Foto</button></td>';
					} else {
						penjualan_value += '<td align="center"  style="border-left:1px solid gray;  border-right:1px solid gray; border-bottom:1px solid gray;"  class="label-cell"><button  class="text-add-colour-black-soft bg-dark-gray-young button-small col button text-bold"  onclick="lihatFotoSuratJalan(\'' + item_d.foto_surat_jalan + '\');">Foto</button></td>';
					}
					penjualan_value += '</tr>';
				}
				penjualan_value += '<tr>';
				penjualan_value += '<td align="center" width="15%" style="border-left:1px solid gray;  border-right:1px solid gray; border-bottom:1px solid gray;"  class="label-cell bg-dark-gray-young">Jumlah</td>';
				penjualan_value += '<td align="center" width="25%" style="border-left:1px solid gray;  border-right:1px solid gray; border-bottom:1px solid gray;"  class="label-cell bg-dark-gray-young">Type</td>';
				penjualan_value += '<td align="center" width="18%" style="border-left:1px solid gray;  border-right:1px solid gray; border-bottom:1px solid gray;"  class="label-cell bg-dark-gray-young">Plat</td>';
				penjualan_value += '<td align="center" width="18%" style="border-left:1px solid gray;  border-right:1px solid gray; border-bottom:1px solid gray;"  class="label-cell bg-dark-gray-young">Kendaraan</td>';
				penjualan_value += '<td align="center" width="24%" style="border-left:1px solid gray;  border-right:1px solid gray; border-bottom:1px solid gray;"  class="label-cell bg-dark-gray-young">Pengirim</td>';

				penjualan_value += '</tr>';
				$.each(data.data, function (i, item) {
					if (item.jumlah_kirim != null && item.jumlah_kirim != 0) {
						if (item_d.tanggal == item.tanggal) {
							penjualan_value += '<tr>';
							penjualan_value += '<td align="center" width="12%" style="border-left:1px solid gray;  border-right:1px solid gray; border-bottom:1px solid gray;"  class="label-cell">' + item.jumlah_kirim + '</td>';
							penjualan_value += '<td align="center" width="18%" style="border-left:1px solid gray;  border-right:1px solid gray; border-bottom:1px solid gray;"  class="label-cell">' + item.penjualan_jenis + '</td>';
							penjualan_value += '<td align="center" width="17%" style="border-left:1px solid gray;  border-right:1px solid gray; border-bottom:1px solid gray;"  class="label-cell">' + item.plat + '</td>';
							penjualan_value += '<td align="center" width="20%" style="border-left:1px solid gray;  border-right:1px solid gray; border-bottom:1px solid gray;"  class="label-cell">' + item.kendaraan + '</td>';
							penjualan_value += '<td align="center" width="15%" style="border-left:1px solid gray;  border-right:1px solid gray; border-bottom:1px solid gray;"  class="label-cell">' + item.pengirim + '</td>';

							penjualan_value += '</tr>';
						}
					}
				});

			});


			$$('#detail_surat_jalan_history').html(penjualan_value);

		},
		error: function (xmlhttprequest, textstatus, message) {
		}
	});
}

function editSuratJalan(no_surat_jalan, no_transaksi, penjualan_id) {
	var penjualan_value = '';
	jQuery.ajax({
		type: 'POST',
		url: "" + BASE_API + "/get-surat-jalan-list-sj",
		dataType: 'JSON',
		data: {
			no_surat_jalan: no_surat_jalan,
		},
		beforeSend: function () {
			app.dialog.preloader('Harap Tunggu');
			$$('#detail_surat_jalan_history_notif').html('');
		},
		success: function (data) {
			app.dialog.close();

			$$("#detail_no_edit_sj").val(no_surat_jalan);
			$$("#nomer_sj").html('<h3>' + no_transaksi + '</h3>');
			$$("#penjualan_id_edit_sj").val(penjualan_id);
			$$("#uraian_reject_edit").val(penjualan_id);
			var no = 0;
			$.each(data.data_distinct, function (i_d, item_d) {

				penjualan_value += '<tr>';
				penjualan_value += '	<td style="border-left:1px solid gray;  border-right:1px solid gray; border-bottom:1px solid gray;" align="center" class="label-cell col col-border bg-dark-gray-medium">' + item_d.no_surat_jalan + '</td>';
				penjualan_value += '	<td align="center" colspan="3" style="border-left:1px solid gray;  border-right:1px solid gray; border-bottom:1px solid gray;" class="label-cell col col-border bg-dark-gray-medium">' + moment(item_d.tanggal).format('DD-MMM-YY hh:mm') + '</td>';
				if (item_d.foto_surat_jalan != null) {
					penjualan_value += '<td align="center"  style="  border-left:1px solid gray;  border-right:1px solid gray; border-bottom:1px solid gray;" class="label-cell"><a style="background-color: blue; color:white;" class="text-add-colour-black-soft button-small col button text-bold" onclick="lihatFotoSuratJalan(\'' + item_d.foto_surat_jalan + '\');">Foto</a></td>';
				} else {
					penjualan_value += '<td align="center"  style="border-left:1px solid gray;  border-right:1px solid gray; border-bottom:1px solid gray;" class="label-cell"><a class="text-add-colour-black-soft bg-dark-gray-young button-small col button text-bold" onclick="lihatFotoSuratJalan(\'' + item_d.foto_surat_jalan + '\');">Foto</a></td>';
				}
				penjualan_value += '</tr>';

				$$("#uraian_reject_edit").val(item_d.keterangan_valid_cs);
				penjualan_value += '<tr>';
				penjualan_value += '<td align="center" width="12%" style="border-left:1px solid gray;  border-right:1px solid gray; border-bottom:1px solid gray;"  class="label-cell bg-dark-gray-young">Jumlah</td>';
				penjualan_value += '<td align="center" width="18%" style="border-left:1px solid gray;  border-right:1px solid gray; border-bottom:1px solid gray;"  class="label-cell bg-dark-gray-young">Type</td>';
				penjualan_value += '<td align="center" width="17%" style="border-left:1px solid gray;  border-right:1px solid gray; border-bottom:1px solid gray;"  class="label-cell bg-dark-gray-young">Plat</td>';
				penjualan_value += '<td align="center" width="20%" style="border-left:1px solid gray;  border-right:1px solid gray; border-bottom:1px solid gray;"  class="label-cell bg-dark-gray-young">Kendaraan</td>';
				penjualan_value += '<td align="center" width="15%" style="border-left:1px solid gray;  border-right:1px solid gray; border-bottom:1px solid gray;"  class="label-cell bg-dark-gray-young">Pengirim</td>';

				penjualan_value += '</tr>';
				$.each(data.data, function (i, item) {
					if (item.jumlah_kirim != null && item.jumlah_kirim != 0) {
						if (item_d.tanggal == item.tanggal) {
							no++
							penjualan_value += '<tr class="jumlah_item_edit_sj">';
							penjualan_value += '<td align="center" style="border-left:1px solid gray;  border-right:1px solid gray; border-bottom:1px solid gray;"  class="label-cell"><input type="number" style="width:100%;" required validated id="jumlah_kirim_' + no + '" name="jumlah_kirim_' + no + '" value="' + item.jumlah_kirim + '"></td>';
							penjualan_value += '<td align="center" style="border-left:1px solid gray;  border-right:1px solid gray; border-bottom:1px solid gray;"  class="label-cell"><input type="hidden" required validated id="penjualan_jenis_' + no + '" name="penjualan_jenis_' + no + '" value="' + item.penjualan_detail_performa_id + '">' + item.penjualan_jenis + '</td>';
							penjualan_value += '<td align="center" style="border-left:1px solid gray;  border-right:1px solid gray; border-bottom:1px solid gray;"  class="label-cell"><input type="text" style="width:100%;" required validated id="plat_' + no + '" name="plat_' + no + '" value="' + item.plat + '"></td>';
							penjualan_value += '<td align="center" style="border-left:1px solid gray;  border-right:1px solid gray; border-bottom:1px solid gray;"  class="label-cell"><input type="text" style="width:100%;" required validated id="kendaraan_' + no + '" name="kendaraan_' + no + '" value="' + item.kendaraan + '"></td>';
							penjualan_value += '<td align="center" style="border-left:1px solid gray;  border-right:1px solid gray; border-bottom:1px solid gray;"  class="label-cell"><input type="text" style="width:100%;" required validated id="pengirim_' + no + '" name="pengirim_' + no + '" value="' + item.pengirim + '"></td>';
							penjualan_value += '</tr>';
						}
					}
				});

			});

			$$('#detail_surat_jalan_history_notif').html(penjualan_value);
		},
		error: function (xmlhttprequest, textstatus, message) {
		}
	});
}

//Config Get Image From Camera
function setOptions(srcType) {
	var options = {
		// Some common settings are 20, 50, and 100
		quality: 50,
		destinationType: Camera.DestinationType.FILE_URI,
		// In this app, dynamically set the picture source, Camera or photo gallery
		sourceType: srcType,
		encodingType: Camera.EncodingType.JPEG,
		mediaType: Camera.MediaType.PICTURE,
		allowEdit: false,
		correctOrientation: true  //Corrects Android orientation quirks
	}
	return options;
}


function getFileEntry(imgUri) {
	window.resolveLocalFileSystemURL(imgUri, function success(fileEntry) {

		// Do something with the FileEntry object, like write to it, upload it, etc.
		// writeFile(fileEntry, imgUri);
		alert("got file: " + fileEntry.nativeURL);
		// displayFileData(fileEntry.nativeURL, "Native URL");

	}, function () {
		// If don't get the FileEntry (which may happen when testing
		// on some emulators), copy to a new FileEntry.
		createNewFileEntry(imgUri);
	});
}

function createNewFileEntry(imgUri) {
	window.resolveLocalFileSystemURL(cordova.file.cacheDirectory, function success(dirEntry) {
		// JPEG file
		dirEntry.getFile("tempFile.jpeg", { create: true, exclusive: false }, function (fileEntry) {
			// Do something with it, like write to it, upload it, etc.
			// writeFile(fileEntry, imgUri);
			alert("got file file entry: " + fileEntry.fullPath);


			// displayFileData(fileEntry.fullPath, "File copied to");
		}, onErrorCreateFile);
	}, onErrorResolveUrl);
}


function getFileContentAsBase64(path, callback) {
	window.resolveLocalFileSystemURL(path, gotFile, fail);

	function fail(e) {
		alert('Cannot found requested file');
	}

	function gotFile(fileEntry) {
		fileEntry.file(function (file) {
			var reader = new FileReader();
			reader.onloadend = function (e) {
				var content = this.result;
				callback(content);
			};
			// The most important point, use the readAsDatURL Method from the file plugin
			reader.readAsDataURL(file);
		});
	}
}

function openCamera(selection) {

	var srcType = Camera.PictureSourceType.CAMERA;
	var options = setOptions(srcType);
	var func = createNewFileEntry;

	navigator.camera.getPicture(function cameraSuccess(imageUri) {

		// displayImage(imageUri);
		// // You may choose to copy the picture, save it somewhere, or upload.

		getFileContentAsBase64(imageUri, function (base64Image) {
			//window.open(base64Image);
			localStorage.setItem("file_foto_surat_jalan", base64Image);
			changeTextFoto(imageUri);
			// Then you'll be able to handle the myimage.png file as base64
		});

	}, function cameraError(error) {
		console.debug("Unable to obtain picture: " + error, "app");
		alert("Unable to obtain picture: ");

	}, options);



}


function openCameraEditSuratJalan(selection) {

	var srcType = Camera.PictureSourceType.CAMERA;
	var options = setOptions(srcType);
	var func = createNewFileEntry;

	navigator.camera.getPicture(function cameraSuccess(imageUri) {

		// displayImage(imageUri);
		// // You may choose to copy the picture, save it somewhere, or upload.

		getFileContentAsBase64(imageUri, function (base64Image) {
			//window.open(base64Image);
			localStorage.setItem("file_foto_edit_surat_jalan", base64Image);
			changeTextFotoEdit(imageUri);
			// Then you'll be able to handle the myimage.png file as base64
		});

	}, function cameraError(error) {
		console.debug("Unable to obtain picture: " + error, "app");
		alert("Unable to obtain picture: ");

	}, options);
}

function changeTextFoto(imageUri) {
	var arr = imageUri.split('/');
	$$('#text_file_path_sj').html(arr[8]);
}

function changeTextFotoEdit(imageUri) {
	var arr = imageUri.split('/');
	$$('#text_file_path_edit_sj').html(arr[8]);
}

function prosesSuratJalan() {

	var count_jumlah_item_sj = 0;
	$$('.jumlah_item_sj').each(function () {
		count_jumlah_item_sj++;
	});

	if (count_jumlah_item_sj == 0) {
		app.dialog.alert('Tidak Ada Jumlah Qty Kirim');
	} else {
		if (!$$('#surat_jalan_form')[0].checkValidity()) {
			app.dialog.alert('Cek Isian Surat Anda');
		} else {
			if (!$$('#surat_jalan_form')[0].checkValidity()) {
				app.dialog.alert('Cek Isian Surat Jalan Anda');
			} else {

				var formData = new FormData(jQuery("#surat_jalan_form")[0]);

				formData.append('jumlah_item_sj', count_jumlah_item_sj);
				formData.append('file_foto_surat_jalan', localStorage.getItem("file_foto_surat_jalan"));
				jQuery.ajax({
					type: 'POST',
					url: "" + BASE_API + "/surat-jalan-proses",
					dataType: 'JSON',
					data: formData,
					contentType: false,
					processData: false,
					beforeSend: function () {
						app.dialog.preloader('Harap Tunggu');
					},
					success: function (data) {
						getHeaderPenjualanKunjungan(1);
						app.dialog.close();
						app.popup.close();
						$$('#surat_jalan_field').empty();
						if (data.status == 'done') {
							app.dialog.alert('Berhasil Input Surat Jalan');
						} else if (data.status == 'failed') {
							app.dialog.alert('Gagal Input Surat Jalan');
						}
					},
					error: function (xmlhttprequest, textstatus, message) {
					}
				});

			}

		}
	}
}

const toInt = v => {
	v = (v || '').toString().replace(/[.,\s]/g, ''); // hapus koma, titik, spasi
	return v ? parseInt(v, 10) : null;               // kirim null jika kosong
};

function updateSuratJalan() {

	var jumlah_item_edit_sj = 0;
	$$('.jumlah_item_edit_sj').each(function () {
		jumlah_item_edit_sj++;
	});

	if (jumlah_item_edit_sj == 0) {
		app.dialog.alert('Tidak Ada Jumlah Qty Kirim');
	} else {
		if (!$$('#edit_surat_jalan_form')[0].checkValidity()) {
			app.dialog.alert('Cek Isian Surat Jalan Anda');
		} else {

			var formData = new FormData(jQuery("#edit_surat_jalan_form")[0]);

			formData.append('jumlah_item_sj', jumlah_item_edit_sj);
			formData.append('file_foto_surat_jalan', localStorage.getItem("file_foto_edit_surat_jalan"));
			jQuery.ajax({
				type: 'POST',
				url: "" + BASE_API + "/surat-jalan-proses-edit",
				dataType: 'JSON',
				data: formData,
				contentType: false,
				processData: false,
				beforeSend: function () {
					app.dialog.preloader('Harap Tunggu');
				},
				success: function (data) {
					app.dialog.close();
					if (data.status == 'success') {
						app.dialog.alert('Berhasil Input Surat Jalan');
						getHeaderPenjualanKunjungan(1);
						jQuery("#back-edit-surat-jalan").click();
						app.popup.close();
					} else if (data.status == 'failed') {
						app.dialog.alert('Gagal Input Surat Jalan');
						jQuery("#back-edit-surat-jalan").click();
						app.popup.close();
					}
				},
				error: function (xmlhttprequest, textstatus, message) {
				}
			});

		}
	}
}

function prosesTglKirim() {
	if (!$$('#tgl_kirim_form')[0].checkValidity()) {
		app.dialog.alert('Cek Isian Jalan Anda');
	} else {

		var formData = new FormData(jQuery("#tgl_kirim_form")[0]);
		jQuery.ajax({
			type: 'POST',
			url: "" + BASE_API + "/tgl-kirim-jalan-proses",
			dataType: 'JSON',
			data: formData,
			contentType: false,
			processData: false,
			beforeSend: function () {
				app.dialog.preloader('Harap Tunggu');
			},
			success: function (data) {
				getHeaderPenjualanKunjungan(1);
				app.dialog.close();
				app.popup.close();
				if (data.status == 'done') {
					app.dialog.alert('Berhasil Update Tgl di Kirim');
				} else if (data.status == 'failed') {
					app.dialog.alert('Gagal Update Tgl di Kirim');
				}
			},
			error: function (xmlhttprequest, textstatus, message) {
			}
		});
	}

}

function getTglKirimSj(penjualan_id) {

	jQuery.ajax({
		type: 'POST',
		url: "" + BASE_API + "/get-tgl-kirim-sj",
		dataType: 'JSON',
		data: {
			penjualan_id: penjualan_id,
		},
		beforeSend: function () {
			jQuery('#tgl_kirim_sj').val('');
			jQuery('#tgl_kirim_penjualan_id').val('');
			app.dialog.preloader('Harap Tunggu');
		},
		success: function (data) {
			app.dialog.close();
			$("#tgl_kirim_sj").val(moment(data.data.tgl_di_kirim).format('YYYY-MM-DD'))
			jQuery('#tgl_kirim_penjualan_id').val(data.data.penjualan_id);

		},
		error: function (xmlhttprequest, textstatus, message) {
		}
	});
}



function getSuratJalanDetail(penjualan_id, penjualan_qty, client_nama, kode_spk, tgl_di_kirim) {

	jQuery('#popup-surat-jalan-td-client_nama').html(client_nama + ' - ' + kode_spk);

	$('#file_foto_surat_jalan').val('');

	jQuery.ajax({
		type: 'POST',
		url: "" + BASE_API + "/get-penjualan-surat-jalan",
		dataType: 'JSON',
		data: {
			penjualan_id: penjualan_id
		},
		beforeSend: function () {
		},
		success: function (data) {

			var total_stock = 0;
			$.each(data.data, function (i_pjl_qty, item_pjl_qty) {
				total_stock += item_pjl_qty.penjualan_qty;
			});

			$$('#stok_sj').html(total_stock);
			getSuratJalanList(penjualan_id, penjualan_qty, client_nama, kode_spk);
			var penjualan_value = "";
			var penjualan_value_2 = "";
			penjualan_value_2 += '<tr>';
			penjualan_value_2 += '<td width="50%" style="border-left:1px solid gray;  border-right:1px solid gray; border-bottom:1px solid gray;"  class="label-cell"><input style="height:28px; width:100%;" type="hidden" id="penjualan_total_qty_detail" name="penjualan_total_qty_detail" placeholder="penjualan_total_qty_detail" value="' + total_stock + '" required validate/> <input type="hidden" id="penjualan_id_sj" name="penjualan_id_sj" placeholder="penjualan_id_sj" value="' + penjualan_id + '" required validate/> <input type="text" style="width:100%; height:28px;" id="kendaraan" name="kendaraan" placeholder="kendaraan" required validate/></td>';
			penjualan_value_2 += '<td width="50%" style="border-left:1px solid gray;  border-right:1px solid gray; border-bottom:1px solid gray;"  class="label-cell"><input style="height:28px; width:100%;" type="text" id="plat" name="plat" placeholder="Plat" required validate/></td>';
			penjualan_value_2 += '</tr>';
			penjualan_value_2 += '<tr>';
			penjualan_value_2 += '<td width="50%" style="border-left:1px solid gray;  border-right:1px solid gray; border-bottom:1px solid gray;"  class="label-cell"><input style="height:28px; width:100%;" type="text" id="pengirim" name="pengirim" placeholder="pengirim" required validate/></td>';
			penjualan_value_2 += '<td width="50%" style="border-left:1px solid gray;  border-right:1px solid gray; border-bottom:1px solid gray;"  class="label-cell"><input style="height:28px; width:100%;" type="text" onclick="SJValue();" id="no_surat_jalan" name="no_surat_jalan" placeholder="No Surat Jalan" required validate/></td>';
			penjualan_value_2 += '</tr>';


			penjualan_value_2 += '</tr>';

			penjualan_value_2 += '</tr>';
			penjualan_value_2 += '<tr>';
			penjualan_value_2 += '<td width="100%" style="border-left:1px solid gray;  border-right:1px solid gray; border-bottom:1px solid gray;"  class="label-cell" colspan="2"><label>Tgl Kirim Surat Jalan :</label><br><input style="height:28px; width:100%;" type="date" id="tgl_kirim_penjualan_id" name="tgl_kirim_penjualan_id" required validate/></td>';
			penjualan_value_2 += '<tr>';
			penjualan_value_2 += '<tr >';
			penjualan_value_2 += '<td colspan="2">';

			penjualan_value_2 += '  <div class="card">';
			penjualan_value_2 += '<center>';
			// penjualan_value_2 += ' <input   type="file" name="file_foto_surat_jalan" id="file_foto_surat_jalan" accept="image/*;capture=camera" required validate /></center>';

			penjualan_value_2 += '	<label onclick="openCamera();"  class="text-add-colour-black-soft bg-dark-gray-young button-large button text-bold" id="text_file_path_sj"></label>';
			penjualan_value_2 += '</center>';



			penjualan_value_2 += '  </div>';

			penjualan_value_2 += '</td>';
			penjualan_value_2 += '</tr>';
			var total_fix_qty_kirim = 0;
			$.each(data.data, function (i2, item2) {
				jQuery.ajax({
					type: 'POST',
					url: "" + BASE_API + "/get-surat-jalan-detail",
					dataType: 'JSON',
					data: {
						penjualan_detail_performa_id: item2.penjualan_detail_performa_id
					},
					beforeSend: function () {
					},
					success: function (data) {
						var stock_item = 0;
						var jumlah_pesanan = 0;

						$.each(data.data, function (stok_detail_qty, item_stok_detail) {
							stock_item += item_stok_detail.jumlah_kirim;
						});

						$.each(data.data_sj, function (stok_detail_qty_2, item_stok_detail_2) {
							jumlah_pesanan += item_stok_detail_2.penjualan_qty;
						});
						var total_fix = parseInt(jumlah_pesanan) - parseInt(stock_item);
						total_fix_qty_kirim += total_fix;
						//	console.log(total_fix_qty_kirim);
						$('#jumlah_stok_item_' + item2.penjualan_detail_performa_id + '').html(total_fix);
						$('#kirim_stok_item_' + item2.penjualan_detail_performa_id + '').html(stock_item);
						$('#total_stok_item_' + item2.penjualan_detail_performa_id + '').html(jumlah_pesanan);
						if (total_fix <= 0) {
							$('#jumlah_' + i2 + '').css("background-color", "blue");
							$('.td_jumlah_' + i2 + '').css("background-color", "blue");
							$('#jumlah_' + i2 + '').attr('readonly', true);
							$('#jumlah_' + i2 + '').val(0);
							$('#jumlah_' + i2 + '').prop("onclick", null).off("click");

						}
					},
					error: function (xmlhttprequest, textstatus, message) {
					}
				});

				penjualan_value += '<tr>';
				penjualan_value += '<td width="28%" style="border-left:1px solid gray;  border-right:1px solid gray; border-bottom:1px solid gray;"  class="label-cell">' + item2.penjualan_jenis + '</td>';
				penjualan_value += '<td align="center" width="18%" style="border-left:1px solid gray;  border-right:1px solid gray; border-bottom:1px solid gray;"  class="label-cell" id="total_stok_item_' + item2.penjualan_detail_performa_id + '" ></td>';
				penjualan_value += '<td align="center" width="18%" style="border-left:1px solid gray;  border-right:1px solid gray; border-bottom:1px solid gray;"  class="label-cell" id="kirim_stok_item_' + item2.penjualan_detail_performa_id + '" ></td>';
				penjualan_value += '<td align="center" width="18%" style="border-left:1px solid gray;  border-right:1px solid gray; border-bottom:1px solid gray;"  class="label-cell" id="jumlah_stok_item_' + item2.penjualan_detail_performa_id + '" ></td>';

				console.log(localStorage.getItem('total_fix_qty_sisa'));
				// if (item2.status_produksi == 'selesai') {
				// 	penjualan_value += '<td width="18%" style="border-left:1px solid gray;  border-right:1px solid gray; border-bottom:1px solid gray;"  class="label-cell td_jumlah_' + i2 + '"><input style="width:100%; height:28px; background-color:white; color:black;" type="number" class="jumlah_item_sj" id="jumlah_' + i2 + '" name="jumlah_' + i2 + '" placeholder="Jumlah" value="0" onclick="SJEmptyValue(' + i2 + ');" required validate/><input  type="hidden" id="kode_' + i2 + '" value="' + item2.penjualan_detail_performa_id + '" name="kode_' + i2 + '" /></td>';
				// } else {
				// 	penjualan_value += '<td width="18%" style="border-left:1px solid gray;  border-right:1px solid gray; border-bottom:1px solid gray;"  class="label-cell td_jumlah_' + i2 + '"><input style="width:100%; height:28px; background-color:red; color:white;" type="number" class="jumlah_item_sj" id="jumlah_' + i2 + '" name="jumlah_' + i2 + '" placeholder="Jumlah" value="0"  required validate readonly/><input  type="hidden" id="kode_' + i2 + '" value="' + item2.penjualan_detail_performa_id + '" name="kode_' + i2 + '" /></td>';
				// }
				penjualan_value += '<td width="18%" style="border-left:1px solid gray;  border-right:1px solid gray; border-bottom:1px solid gray;"  class="label-cell td_jumlah_' + i2 + '"><input style="width:100%; height:28px; background-color:white; color:black;" type="number" class="jumlah_item_sj" id="jumlah_' + i2 + '" name="jumlah_' + i2 + '" placeholder="Jumlah" value="0" onclick="SJEmptyValue(' + i2 + ');" required validate/><input  type="hidden" id="kode_' + i2 + '" value="' + item2.penjualan_detail_performa_id + '" name="kode_' + i2 + '" /></td>';

			});


			$$('#detail_surat_jalan').html(penjualan_value);
			$$('#detail_surat_jalan2').html(penjualan_value_2);
			$('.jumlah_item_sj').val("");

			$$('#text_file_path_sj').html('Foto');
		},
		error: function (xmlhttprequest, textstatus, message) {
		}
	});
}

var delayTimer;
function doSearchByPerusahaanSuratJalan(text) {
	clearTimeout(delayTimer);
	delayTimer = setTimeout(function () {
		getHeaderPenjualanKunjungan(1);
	}, 1000);
}

var delayTimer;
function doSearchBySalesSuratJalan(text) {
	clearTimeout(delayTimer);
	delayTimer = setTimeout(function () {
		getHeaderPenjualanKunjungan(1);
	}, 1000);
}


function refreshHeaderPenjualanKunjungan() {
	jQuery('#perusahaan_penjualan_filter').val("");
	getHeaderPenjualanKunjungan(1);
}

function detailPembayaran(penjualan_tanggal_choose, performa_id_relation, bank_1, bank_2, bank_3, bank_4, bank_5, bank_6, bank_7, bank_8, bank_9, bank_10, pembayaran1_tgl, pembayaran2_tgl, pembayaran3_tgl, pembayaran4_tgl, pembayaran5_tgl, pembayaran6_tgl, pembayaran7_tgl, pembayaran8_tgl, pembayaran9_tgl, pembayaran10_tgl, bank, pembayaran_1, pembayaran_2, pembayaran_3, pembayaran_4, pembayaran_5, pembayaran_6, pembayaran_7, pembayaran_8, pembayaran_9, pembayaran_10, client_nama, penjualan_jumlah_pembayaran, penjualan_total_qty, penjualan_grandtotal, penjualan_id, client_id, penjualan_status_pembayaran) {
	jQuery('#history_pembayaran_multiple').html("");
	if (performa_id_relation != "single") {
		jQuery('.pembayaran_single_div').hide();
		jQuery.ajax({
			type: 'POST',
			url: "" + BASE_API + "/detail-pembayaran-multiple",
			dataType: 'JSON',
			data: {
				performa_id: performa_id_relation
			},
			beforeSend: function () {
				app.dialog.preloader('Harap Tunggu');
			},
			success: function (data) {
				app.dialog.close();

				jQuery("#bayar_pembayaran").val('');
				$$('#popup-pembayaran-td-client_nama').html(client_nama + ', PT');
				$$('#popup-pembayaran-bank').html(bank);
				$$(".bank_pembayaran").val(bank);
				$$('#popup-pembayaran-penjualan_jumlah_pembayaran').html(number_format(data.penjualan_jumlah_pembayaran) + ' ,-');
				$$('#popup-pembayaran-penjualan_grandtotal').html(number_format(data.penjualan_grandtotal) + ' ,-');
				$$('#popup-pembayaran-penjualan_kekurangan').html(number_format(data.penjualan_grandtotal - data.penjualan_jumlah_pembayaran) + ' ,-');

				if ((data.penjualan_grandtotal - data.penjualan_jumlah_pembayaran) <= 0) {
					$$('#popup-pembayaran-penjualan_status_pembayaran').html('<b>Lunas</b>');
					$$('#popup-pembayaran-penjualan_status_pembayaran').removeClass('card-color-green').removeClass('card-color-blue').addClass('card-color-blue');


				} else {
					$$('#popup-pembayaran-penjualan_status_pembayaran').html('<b>Belum Lunas</b>');
					$$('#popup-pembayaran-penjualan_status_pembayaran').removeClass('card-color-green').removeClass('card-color-blue').addClass('card-color-green');


				}

				var history_pembayaran_multiple = "";
				var no = 1;
				var total_jumlah_pembayaran = 0;

				jQuery.each(data.pembayaran_data, function (i, val) {
					var no = i++;
					pembayaran_1 = number_format(val.pembayaran_1).replace(/\,/g, '');
					pembayaran_2 = number_format(val.pembayaran_2).replace(/\,/g, '');
					pembayaran_3 = number_format(val.pembayaran_3).replace(/\,/g, '');
					pembayaran_4 = number_format(val.pembayaran_4).replace(/\,/g, '');
					pembayaran_5 = number_format(val.pembayaran_5).replace(/\,/g, '');
					pembayaran_6 = number_format(val.pembayaran_6).replace(/\,/g, '');
					pembayaran_7 = number_format(val.pembayaran_7).replace(/\,/g, '');
					pembayaran_8 = number_format(val.pembayaran_8).replace(/\,/g, '');
					pembayaran_9 = number_format(val.pembayaran_9).replace(/\,/g, '');
					pembayaran_10 = number_format(val.pembayaran_10).replace(/\,/g, '');

					total_jumlah_pembayaran = parseInt(pembayaran_1) + parseInt(pembayaran_2) + parseInt(pembayaran_3) + parseInt(pembayaran_4) + parseInt(pembayaran_5) + parseInt(pembayaran_6) + parseInt(pembayaran_7) + parseInt(pembayaran_8) + parseInt(pembayaran_9) + parseInt(pembayaran_10);

					if (parseInt(val.penjualan_grandtotal) <= parseInt(total_jumlah_pembayaran)) {
						var background_multiple = "#133788";
						var status_lunas = "lunas";
					} else {
						var background_multiple = "";
						var status_lunas = "belum_lunas";
					}



					history_pembayaran_multiple += '<table  align="center" width="650px" border="0" style="border-collapse: collapse; border:1px solid white;">';
					history_pembayaran_multiple += '<tr style="background-color:' + background_multiple + '">';
					history_pembayaran_multiple += '<td align="left" colspan="7">';
					history_pembayaran_multiple += '<input type="hidden" id="status_lunas_' + i + '" value="' + status_lunas + '" name="status_lunas_' + i + '"  /><input type="hidden" id="total_harus_bayar_' + val.pembayaran_id + '" value="' + val.penjualan_grandtotal + '" name="total_harus_bayar_' + val.pembayaran_id + '"  /><input type="hidden" id="sudah_bayar_' + val.pembayaran_id + '" value="' + total_jumlah_pembayaran + '" name="sudah_bayar_' + val.pembayaran_id + '"  />Deadline ' + i + ' : ' + moment(val.penjualan_tanggal_kirim).format('DD-MMM-YYYY') + ' <font style="float:right;">Total : ' + number_format(val.penjualan_grandtotal) + '</font>';
					history_pembayaran_multiple += '</td>';
					history_pembayaran_multiple += '</tr>';
					history_pembayaran_multiple += '<tr>';
					history_pembayaran_multiple += '<td align="left" colspan="7">';
					history_pembayaran_multiple += '<font style="float:right;">Terbayar : ' + number_format(total_jumlah_pembayaran) + '</font>';
					history_pembayaran_multiple += '</td>';
					history_pembayaran_multiple += '</tr>';
					history_pembayaran_multiple += '<tr class="bg-dark-gray-medium">';
					history_pembayaran_multiple += '<td width="12%" style="border-collapse: collapse; border:1px solid white;" colspan="2"';
					history_pembayaran_multiple += ' class="numeric-cell text-align-center">Bayar';
					history_pembayaran_multiple += '</td>';
					history_pembayaran_multiple += '<td width="14%" style="border-collapse: collapse; border:1px solid white;"';
					history_pembayaran_multiple += ' class="numeric-cell text-align-center">Tanggal</td>';
					history_pembayaran_multiple += '<td width="13%" style="border-collapse: collapse; border:1px solid white;"';
					history_pembayaran_multiple += '  class="numeric-cell text-align-center">Bank</td>';
					history_pembayaran_multiple += '<td width="23%" style="border-collapse: collapse; border:1px solid white;"';
					history_pembayaran_multiple += ' class="numeric-cell text-align-center">Jumlah</td>';
					history_pembayaran_multiple += '<td width="22%" style="border-collapse: collapse; border:1px solid white;"';
					history_pembayaran_multiple += ' class="numeric-cell text-align-center">Keterangan</td>';
					history_pembayaran_multiple += '<td width="14%" style="border-collapse: collapse; border:1px solid white;"';
					history_pembayaran_multiple += ' class="numeric-cell text-align-center">Opsi</td>';

					history_pembayaran_multiple += '  </tr>';
					history_pembayaran_multiple += '<tbody id="table_num_' + i + '">';
					if (val.pembayaran_1 != null && val.pembayaran_1 != 0) {
						history_pembayaran_multiple += '<tr>';
						history_pembayaran_multiple += '<td width="15%" style="border-collapse: collapse; border:1px solid white;" colspan="2"';
						history_pembayaran_multiple += ' class="numeric-cell text-align-center">Bayar 1';
						history_pembayaran_multiple += '</td>';
						history_pembayaran_multiple += '<td width="18%" style="border-collapse: collapse; border:1px solid white;"';
						history_pembayaran_multiple += ' class="numeric-cell text-align-center">' + moment(val.pembayaran1_tgl).format('DD-MMM-YYYY') + '</td>';
						history_pembayaran_multiple += '<td width="15%" style="border-collapse: collapse; border:1px solid white;"';
						history_pembayaran_multiple += '  class="numeric-cell text-align-center">' + val.bank_1 + '</td>';
						history_pembayaran_multiple += '<td width="18%" style="border-collapse: collapse; border:1px solid white;"';
						history_pembayaran_multiple += ' class="total_jumlah_pembayaran_' + i + ' numeric-cell text-align-center">' + number_format(val.pembayaran_1) + '</td>';
						history_pembayaran_multiple += '<td width="18%" style="border-collapse: collapse; border:1px solid white;"';
						if (val.keterangan_1 != null) {
							history_pembayaran_multiple += ' class="numeric-cell text-align-center">' + val.keterangan_1 + '</td>';
						} else {
							history_pembayaran_multiple += ' class="numeric-cell text-align-center">-</td>';
						}

						history_pembayaran_multiple += '<td width="10%" style="border-collapse: collapse; border:1px solid white;"';

						if (val.foto_1 != null) {
							history_pembayaran_multiple += ' class="numeric-cell text-align-center"><button data-popup=".upload-foto-pembayaran" onclick="uploadFotoPembayaran(\'foto_1\',\'' + val.pembayaran_id + '\',\'' + val.foto_1 + '\')" class="popup-open text-add-colour-black-soft  card-color-blue button-small col button text-bold" style="color:white;">Foto</button></td>';
						} else {
							history_pembayaran_multiple += ' class="numeric-cell text-align-center"><button data-popup=".upload-foto-pembayaran" onclick="uploadFotoPembayaran(\'foto_1\',\'' + val.pembayaran_id + '\',\'' + val.foto_1 + '\')" class="popup-open text-add-colour-black-soft button-small col button text-bold bg-dark-gray-young">Foto</button></td>';
						}

						history_pembayaran_multiple += ' </tr>';
					}

					if (val.pembayaran_2 != null && val.pembayaran_2 != 0) {
						history_pembayaran_multiple += '<tr>';
						history_pembayaran_multiple += '<td width="15%" style="border-collapse: collapse; border:1px solid white;" colspan="2"';
						history_pembayaran_multiple += ' class="numeric-cell text-align-center">Bayar 2';
						history_pembayaran_multiple += '</td>';
						history_pembayaran_multiple += '<td width="18%" style="border-collapse: collapse; border:1px solid white;"';
						history_pembayaran_multiple += ' class="numeric-cell text-align-center">' + moment(val.pembayaran2_tgl).format('DD-MMM-YYYY') + '</td>';
						history_pembayaran_multiple += '<td width="18%" style="border-collapse: collapse; border:1px solid white;"';
						history_pembayaran_multiple += '  class="numeric-cell text-align-center">' + val.bank_2 + '</td>';
						history_pembayaran_multiple += '<td width="18%" style="border-collapse: collapse; border:1px solid white;"';
						history_pembayaran_multiple += ' class="numeric-cell text-align-center">' + number_format(val.pembayaran_2) + '</td>';
						history_pembayaran_multiple += '<td width="18%" style="border-collapse: collapse; border:1px solid white;"';
						if (val.keterangan_2 != null) {
							history_pembayaran_multiple += ' class="numeric-cell text-align-center">' + val.keterangan_2 + '</td>';
						} else {
							history_pembayaran_multiple += ' class="numeric-cell text-align-center"></td>';
						}

						history_pembayaran_multiple += '<td width="10%" style="border-collapse: collapse; border:1px solid white;"';

						if (val.foto_2 != null) {
							history_pembayaran_multiple += ' class="numeric-cell text-align-center"><button data-popup=".upload-foto-pembayaran" onclick="uploadFotoPembayaran(\'foto_2\',\'' + val.pembayaran_id + '\',\'' + val.foto_2 + '\')" class="popup-open text-add-colour-black-soft  card-color-blue button-small col button text-bold" style="color:white;">Foto</button></td>';
						} else {
							history_pembayaran_multiple += ' class="numeric-cell text-align-center"><button data-popup=".upload-foto-pembayaran" onclick="uploadFotoPembayaran(\'foto_2\',\'' + val.pembayaran_id + '\',\'' + val.foto_2 + '\')" class="popup-open text-add-colour-black-soft button-small col button text-bold bg-dark-gray-young">Foto</button></td>';
						}

						history_pembayaran_multiple += ' </tr>';
					}

					if (val.pembayaran_3 != null && val.pembayaran_3 != 0) {
						history_pembayaran_multiple += '<tr>';
						history_pembayaran_multiple += '<td width="15%" style="border-collapse: collapse; border:1px solid white;" colspan="2"';
						history_pembayaran_multiple += ' class="numeric-cell text-align-center">Bayar 3';
						history_pembayaran_multiple += '</td>';
						history_pembayaran_multiple += '<td width="18%" style="border-collapse: collapse; border:1px solid white;"';
						history_pembayaran_multiple += ' class="numeric-cell text-align-center">' + moment(val.pembayaran3_tgl).format('DD-MMM-YYYY') + '</td>';
						history_pembayaran_multiple += '<td width="18%" style="border-collapse: collapse; border:1px solid white;"';
						history_pembayaran_multiple += '  class="numeric-cell text-align-center">' + val.bank_3 + '</td>';
						history_pembayaran_multiple += '<td width="18%" style="border-collapse: collapse; border:1px solid white;"';
						history_pembayaran_multiple += ' class="numeric-cell text-align-center">' + number_format(val.pembayaran_3) + '</td>';
						history_pembayaran_multiple += '<td width="18%" style="border-collapse: collapse; border:1px solid white;"';
						if (val.keterangan_3 != null) {
							history_pembayaran_multiple += ' class="numeric-cell text-align-center">' + val.keterangan_3 + '</td>';
						} else {
							history_pembayaran_multiple += ' class="numeric-cell text-align-center">-</td>';
						}

						history_pembayaran_multiple += '<td width="10%" style="border-collapse: collapse; border:1px solid white;"';

						if (val.foto_3 != null) {
							history_pembayaran_multiple += ' class="numeric-cell text-align-center"><button data-popup=".upload-foto-pembayaran" onclick="uploadFotoPembayaran(\'foto_3\',\'' + val.pembayaran_id + '\',\'' + val.foto_3 + '\')" class="popup-open text-add-colour-black-soft  card-color-blue button-small col button text-bold" style="color:white;">Foto</button></td>';
						} else {
							history_pembayaran_multiple += ' class="numeric-cell text-align-center"><button data-popup=".upload-foto-pembayaran" onclick="uploadFotoPembayaran(\'foto_3\',\'' + val.pembayaran_id + '\',\'' + val.foto_3 + '\')" class="popup-open text-add-colour-black-soft button-small col button text-bold bg-dark-gray-young">Foto</button></td>';
						}

						history_pembayaran_multiple += ' </tr>';
					}


					if (val.pembayaran_4 != null && val.pembayaran_4 != 0) {
						history_pembayaran_multiple += '<tr>';
						history_pembayaran_multiple += '<td width="15%" style="border-collapse: collapse; border:1px solid white;" colspan="2"';
						history_pembayaran_multiple += ' class="numeric-cell text-align-center">Bayar 4';
						history_pembayaran_multiple += '</td>';
						history_pembayaran_multiple += '<td width="18%" style="border-collapse: collapse; border:1px solid white;"';
						history_pembayaran_multiple += ' class="numeric-cell text-align-center">' + moment(val.pembayaran4_tgl).format('DD-MMM-YYYY') + '</td>';
						history_pembayaran_multiple += '<td width="18%" style="border-collapse: collapse; border:1px solid white;"';
						history_pembayaran_multiple += '  class="numeric-cell text-align-center">' + val.bank_4 + '</td>';
						history_pembayaran_multiple += '<td width="18%" style="border-collapse: collapse; border:1px solid white;"';
						history_pembayaran_multiple += ' class="numeric-cell text-align-center">' + number_format(val.pembayaran_4) + '</td>';
						history_pembayaran_multiple += '<td width="18%" style="border-collapse: collapse; border:1px solid white;"';
						if (val.keterangan_4 != null) {
							history_pembayaran_multiple += ' class="numeric-cell text-align-center">' + val.keterangan_4 + '</td>';
						} else {
							history_pembayaran_multiple += ' class="numeric-cell text-align-center">-</td>';
						}
						history_pembayaran_multiple += '<td width="10%" style="border-collapse: collapse; border:1px solid white;"';

						if (val.foto_4 != null) {
							history_pembayaran_multiple += ' class="numeric-cell text-align-center"><button data-popup=".upload-foto-pembayaran" onclick="uploadFotoPembayaran(\'foto_4\',\'' + val.pembayaran_id + '\',\'' + val.foto_4 + '\')" class="popup-open text-add-colour-black-soft  card-color-blue button-small col button text-bold" style="color:white;">Foto</button></td>';
						} else {
							history_pembayaran_multiple += ' class="numeric-cell text-align-center"><button data-popup=".upload-foto-pembayaran" onclick="uploadFotoPembayaran(\'foto_4\',\'' + val.pembayaran_id + '\',\'' + val.foto_4 + '\')" class="popup-open text-add-colour-black-soft button-small col button text-bold bg-dark-gray-young">Foto</button></td>';
						}

						history_pembayaran_multiple += ' </tr>';
					}

					if (val.pembayaran_5 != null && val.pembayaran_5 != 0) {
						history_pembayaran_multiple += '<tr>';
						history_pembayaran_multiple += '<td width="15%" style="border-collapse: collapse; border:1px solid white;" colspan="2"';
						history_pembayaran_multiple += ' class="numeric-cell text-align-center">Bayar 5';
						history_pembayaran_multiple += '</td>';
						history_pembayaran_multiple += '<td width="18%" style="border-collapse: collapse; border:1px solid white;"';
						history_pembayaran_multiple += ' class="numeric-cell text-align-center">' + moment(val.pembayaran5_tgl).format('DD-MMM-YYYY') + '</td>';
						history_pembayaran_multiple += '<td width="18%" style="border-collapse: collapse; border:1px solid white;"';
						history_pembayaran_multiple += '  class="numeric-cell text-align-center">' + val.bank_5 + '</td>';
						history_pembayaran_multiple += '<td width="18%" style="border-collapse: collapse; border:1px solid white;"';
						history_pembayaran_multiple += ' class="numeric-cell text-align-center">' + number_format(val.pembayaran_5) + '</td>';
						history_pembayaran_multiple += '<td width="18%" style="border-collapse: collapse; border:1px solid white;"';

						if (val.keterangan_5 != null) {
							history_pembayaran_multiple += ' class="numeric-cell text-align-center">' + val.keterangan_5 + '</td>';
						} else {
							history_pembayaran_multiple += ' class="numeric-cell text-align-center">-</td>';
						}
						history_pembayaran_multiple += '<td width="10%" style="border-collapse: collapse; border:1px solid white;"';

						if (val.foto_5 != null) {
							history_pembayaran_multiple += ' class="numeric-cell text-align-center"><button data-popup=".upload-foto-pembayaran" onclick="uploadFotoPembayaran(\'foto_5\',\'' + val.pembayaran_id + '\',\'' + val.foto_5 + '\')" class="popup-open text-add-colour-black-soft  card-color-blue button-small col button text-bold" style="color:white;">Foto</button></td>';
						} else {
							history_pembayaran_multiple += ' class="numeric-cell text-align-center"><button data-popup=".upload-foto-pembayaran" onclick="uploadFotoPembayaran(\'foto_5\',\'' + val.pembayaran_id + '\',\'' + val.foto_5 + '\')" class="popup-open text-add-colour-black-soft button-small col button text-bold bg-dark-gray-young">Foto</button></td>';
						}

						history_pembayaran_multiple += ' </tr>';
					}


					if (val.pembayaran_6 != null && val.pembayaran_6 != 0) {
						history_pembayaran_multiple += '<tr>';
						history_pembayaran_multiple += '<td width="15%" style="border-collapse: collapse; border:1px solid white;" colspan="2"';
						history_pembayaran_multiple += ' class="numeric-cell text-align-center">Bayar 6';
						history_pembayaran_multiple += '</td>';
						history_pembayaran_multiple += '<td width="18%" style="border-collapse: collapse; border:1px solid white;"';
						history_pembayaran_multiple += ' class="numeric-cell text-align-center">' + moment(val.pembayaran6_tgl).format('DD-MMM-YYYY') + '</td>';
						history_pembayaran_multiple += '<td width="18%" style="border-collapse: collapse; border:1px solid white;"';
						history_pembayaran_multiple += '  class="numeric-cell text-align-center">' + val.bank_6 + '</td>';
						history_pembayaran_multiple += '<td width="18%" style="border-collapse: collapse; border:1px solid white;"';
						history_pembayaran_multiple += ' class="numeric-cell text-align-center">' + number_format(val.pembayaran_6) + '</td>';
						history_pembayaran_multiple += '<td width="18%" style="border-collapse: collapse; border:1px solid white;"';
						if (val.keterangan_6 != null) {
							history_pembayaran_multiple += ' class="numeric-cell text-align-center">' + val.keterangan_6 + '</td>';
						} else {
							history_pembayaran_multiple += ' class="numeric-cell text-align-center">-</td>';
						}
						history_pembayaran_multiple += '<td width="10%" style="border-collapse: collapse; border:1px solid white;"';

						if (val.foto_6 != null) {
							history_pembayaran_multiple += ' class="numeric-cell text-align-center"><button data-popup=".upload-foto-pembayaran" onclick="uploadFotoPembayaran(\'foto_6\',\'' + val.pembayaran_id + '\',\'' + val.foto_6 + '\')" class="popup-open text-add-colour-black-soft  card-color-blue button-small col button text-bold" style="color:white;">Foto</button></td>';
						} else {
							history_pembayaran_multiple += ' class="numeric-cell text-align-center"><button data-popup=".upload-foto-pembayaran" onclick="uploadFotoPembayaran(\'foto_6\',\'' + val.pembayaran_id + '\',\'' + val.foto_6 + '\')" class="popup-open text-add-colour-black-soft button-small col button text-bold bg-dark-gray-young">Foto</button></td>';
						}

						history_pembayaran_multiple += ' </tr>';
					}

					if (val.pembayaran_7 != null && val.pembayaran_7 != 0) {
						history_pembayaran_multiple += '<tr>';
						history_pembayaran_multiple += '<td width="15%" style="border-collapse: collapse; border:1px solid white;" colspan="2"';
						history_pembayaran_multiple += ' class="numeric-cell text-align-center">Bayar 7';
						history_pembayaran_multiple += '</td>';
						history_pembayaran_multiple += '<td width="25%" style="border-collapse: collapse; border:1px solid white;"';
						history_pembayaran_multiple += ' class="numeric-cell text-align-center">' + moment(val.pembayaran7_tgl).format('DD-MMM-YYYY') + '</td>';
						history_pembayaran_multiple += '<td width="30%" style="border-collapse: collapse; border:1px solid white;"';
						history_pembayaran_multiple += '  class="numeric-cell text-align-center">' + val.bank_7 + '</td>';
						history_pembayaran_multiple += '<td width="20%" style="border-collapse: collapse; border:1px solid white;"';
						history_pembayaran_multiple += ' class="numeric-cell text-align-center">' + number_format(val.pembayaran_7) + '</td>';
						history_pembayaran_multiple += '<td width="20%" style="border-collapse: collapse; border:1px solid white;"';
						if (val.keterangan_7 != null) {
							history_pembayaran_multiple += ' class="numeric-cell text-align-center">' + val.keterangan_7 + '</td>';
						} else {
							history_pembayaran_multiple += ' class="numeric-cell text-align-center">-</td>';
						}
						history_pembayaran_multiple += '<td width="10%" style="border-collapse: collapse; border:1px solid white;"';

						if (val.foto_7 != null) {
							history_pembayaran_multiple += ' class="numeric-cell text-align-center"><button data-popup=".upload-foto-pembayaran" onclick="uploadFotoPembayaran(\'foto_7\',\'' + val.pembayaran_id + '\',\'' + val.foto_7 + '\')" class="popup-open text-add-colour-black-soft  card-color-blue button-small col button text-bold" style="color:white;">Foto</button></td>';
						} else {
							history_pembayaran_multiple += ' class="numeric-cell text-align-center"><button data-popup=".upload-foto-pembayaran" onclick="uploadFotoPembayaran(\'foto_7\',\'' + val.pembayaran_id + '\',\'' + val.foto_7 + '\')" class="popup-open text-add-colour-black-soft button-small col button text-bold bg-dark-gray-young">Foto</button></td>';
						}

						history_pembayaran_multiple += ' </tr>';
					}


					if (val.pembayaran_8 != null && val.pembayaran_8 != 0) {
						history_pembayaran_multiple += '<tr>';
						history_pembayaran_multiple += '<td width="25%" style="border-collapse: collapse; border:1px solid white;" colspan="2"';
						history_pembayaran_multiple += ' class="numeric-cell text-align-center">Bayar 8';
						history_pembayaran_multiple += '</td>';
						history_pembayaran_multiple += '<td width="25%" style="border-collapse: collapse; border:1px solid white;"';
						history_pembayaran_multiple += ' class="numeric-cell text-align-center">' + moment(val.pembayaran8_tgl).format('DD-MMM-YYYY') + '</td>';
						history_pembayaran_multiple += '<td width="30%" style="border-collapse: collapse; border:1px solid white;"';
						history_pembayaran_multiple += '  class="numeric-cell text-align-center">' + val.bank_8 + '</td>';
						history_pembayaran_multiple += '<td width="20%" style="border-collapse: collapse; border:1px solid white;"';

						if (val.keterangan_8 != null) {
							history_pembayaran_multiple += ' class="numeric-cell text-align-center">' + val.keterangan_8 + '</td>';
						} else {
							history_pembayaran_multiple += ' class="numeric-cell text-align-center">-</td>';
						}
						history_pembayaran_multiple += '<td width="10%" style="border-collapse: collapse; border:1px solid white;"';

						if (val.foto_8 != null) {
							history_pembayaran_multiple += ' class="numeric-cell text-align-center"><button data-popup=".upload-foto-pembayaran" onclick="uploadFotoPembayaran(\'foto_8\',\'' + val.pembayaran_id + '\',\'' + val.foto_8 + '\')" class="popup-open text-add-colour-black-soft  card-color-blue button-small col button text-bold" style="color:white;">Foto</button></td>';
						} else {
							history_pembayaran_multiple += ' class="numeric-cell text-align-center"><button data-popup=".upload-foto-pembayaran" onclick="uploadFotoPembayaran(\'foto_8\',\'' + val.pembayaran_id + '\',\'' + val.foto_8 + '\')" class="popup-open text-add-colour-black-soft button-small col button text-bold bg-dark-gray-young">Foto</button></td>';
						}

						history_pembayaran_multiple += ' </tr>';
					}

					if (val.pembayaran_9 != null && val.pembayaran_9 != 0) {
						history_pembayaran_multiple += '<tr>';
						history_pembayaran_multiple += '<td width="25%" style="border-collapse: collapse; border:1px solid white;" colspan="2"';
						history_pembayaran_multiple += ' class="numeric-cell text-align-center">Bayar 9';
						history_pembayaran_multiple += '</td>';
						history_pembayaran_multiple += '<td width="25%" style="border-collapse: collapse; border:1px solid white;"';
						history_pembayaran_multiple += ' class="numeric-cell text-align-center">' + moment(val.pembayaran9_tgl).format('DD-MMM-YYYY') + '</td>';
						history_pembayaran_multiple += '<td width="30%" style="border-collapse: collapse; border:1px solid white;"';
						history_pembayaran_multiple += '  class="numeric-cell text-align-center">' + val.bank_9 + '</td>';
						history_pembayaran_multiple += '<td width="20%" style="border-collapse: collapse; border:1px solid white;"';
						history_pembayaran_multiple += ' class="numeric-cell text-align-center">' + number_format(val.pembayaran_9) + '</td>';
						history_pembayaran_multiple += ' </tr>';
					}

					if (val.pembayaran_10 != null && val.pembayaran_10 != 0) {
						history_pembayaran_multiple += '<tr>';
						history_pembayaran_multiple += '<td width="25%" style="border-collapse: collapse; border:1px solid white;" colspan="2"';
						history_pembayaran_multiple += ' class="numeric-cell text-align-center">Bayar 10';
						history_pembayaran_multiple += '</td>';
						history_pembayaran_multiple += '<td width="25%" style="border-collapse: collapse; border:1px solid white;"';
						history_pembayaran_multiple += ' class="numeric-cell text-align-center">' + moment(val.pembayaran10_tgl).format('DD-MMM-YYYY') + '</td>';
						history_pembayaran_multiple += '<td width="30%" style="border-collapse: collapse; border:1px solid white;"';
						history_pembayaran_multiple += '  class="numeric-cell text-align-center">' + val.bank_10 + '</td>';
						history_pembayaran_multiple += '<td width="20%" style="border-collapse: collapse; border:1px solid white;"';
						history_pembayaran_multiple += ' class="numeric-cell text-align-center">' + number_format(val.pembayaran_10) + '</td>';
						history_pembayaran_multiple += ' </tr>';
					}
					history_pembayaran_multiple += '<tbody>';
					history_pembayaran_multiple += '</table><br>';
				});

				jQuery('#history_pembayaran_multiple').html(history_pembayaran_multiple);
				jQuery('#table_num_1').show()
				jQuery('#table_num_2').hide()
				jQuery('#table_num_3').hide()
				jQuery('#table_num_4').hide()
				jQuery('#table_num_5').hide()
				jQuery('#table_num_6').hide()
				jQuery('#table_num_7').hide()
				jQuery('#table_num_8').hide()
				jQuery('#table_num_9').hide()
				jQuery('#table_num_10').hide()
				if (jQuery('#status_lunas_1').val() == 'lunas') {
					jQuery('#table_num_1').show()
					jQuery('#table_num_2').show()
					jQuery('#table_num_3').hide()
					jQuery('#table_num_4').hide()
					jQuery('#table_num_5').hide()
					jQuery('#table_num_6').hide()
					jQuery('#table_num_7').hide()
					jQuery('#table_num_8').hide()
					jQuery('#table_num_9').hide()
					jQuery('#table_num_10').hide()
				} else if (jQuery('#status_lunas_2').val() == 'lunas') {
					jQuery('#table_num_1').show()
					jQuery('#table_num_2').show()
					jQuery('#table_num_3').show()
					jQuery('#table_num_4').hide()
					jQuery('#table_num_5').hide()
					jQuery('#table_num_6').hide()
					jQuery('#table_num_7').hide()
					jQuery('#table_num_8').hide()
					jQuery('#table_num_9').hide()
					jQuery('#table_num_10').hide()
				} else if (jQuery('#status_lunas_3').val() == 'lunas') {
					jQuery('#table_num_1').show()
					jQuery('#table_num_2').show()
					jQuery('#table_num_3').show()
					jQuery('#table_num_4').show()
					jQuery('#table_num_5').hide()
					jQuery('#table_num_6').hide()
					jQuery('#table_num_7').hide()
					jQuery('#table_num_8').hide()
					jQuery('#table_num_9').hide()
					jQuery('#table_num_10').hide()
				} else if (jQuery('#status_lunas_4').val() == 'lunas') {
					jQuery('#table_num_1').show()
					jQuery('#table_num_2').show()
					jQuery('#table_num_3').show()
					jQuery('#table_num_4').show()
					jQuery('#table_num_5').show()
					jQuery('#table_num_6').hide()
					jQuery('#table_num_7').hide()
					jQuery('#table_num_8').hide()
					jQuery('#table_num_9').hide()
					jQuery('#table_num_10').hide()
				} else if (jQuery('#status_lunas_5').val() == 'lunas') {
					jQuery('#table_num_1').show()
					jQuery('#table_num_2').show()
					jQuery('#table_num_3').show()
					jQuery('#table_num_4').show()
					jQuery('#table_num_5').show()
					jQuery('#table_num_6').show()
					jQuery('#table_num_7').hide()
					jQuery('#table_num_8').hide()
					jQuery('#table_num_9').hide()
					jQuery('#table_num_10').hide()
				} else if (jQuery('#status_lunas_6').val() == 'lunas') {
					jQuery('#table_num_1').show()
					jQuery('#table_num_2').show()
					jQuery('#table_num_3').show()
					jQuery('#table_num_4').show()
					jQuery('#table_num_5').show()
					jQuery('#table_num_6').show()
					jQuery('#table_num_7').show()
					jQuery('#table_num_8').hide()
					jQuery('#table_num_9').hide()
					jQuery('#table_num_10').hide()
				} else if (jQuery('#status_lunas_7').val() == 'lunas') {
					jQuery('#table_num_1').show()
					jQuery('#table_num_2').show()
					jQuery('#table_num_3').show()
					jQuery('#table_num_4').show()
					jQuery('#table_num_5').show()
					jQuery('#table_num_6').show()
					jQuery('#table_num_7').show()
					jQuery('#table_num_8').show()
					jQuery('#table_num_9').hide()
					jQuery('#table_num_10').hide()
				} else if (jQuery('#status_lunas_8').val() == 'lunas') {
					jQuery('#table_num_1').show()
					jQuery('#table_num_2').show()
					jQuery('#table_num_3').show()
					jQuery('#table_num_4').show()
					jQuery('#table_num_5').show()
					jQuery('#table_num_6').show()
					jQuery('#table_num_7').show()
					jQuery('#table_num_8').show()
					jQuery('#table_num_9').show()
					jQuery('#table_num_10').hide()
				} else if (jQuery('#status_lunas_9').val() == 'lunas') {
					jQuery('#table_num_1').show()
					jQuery('#table_num_2').show()
					jQuery('#table_num_3').show()
					jQuery('#table_num_4').show()
					jQuery('#table_num_5').show()
					jQuery('#table_num_6').show()
					jQuery('#table_num_7').show()
					jQuery('#table_num_8').show()
					jQuery('#table_num_9').show()
					jQuery('#table_num_10').show()
				}


				var today = moment().format('YYYY-MM-DD');

			},
			error: function (xmlhttprequest, textstatus, message) {
			}
		});

	} else {
		jQuery('.pembayaran_single_div').show();

		jQuery("#bayar_pembayaran").val('');
		$$('#popup-pembayaran-td-client_nama').html(client_nama + ', PT');
		$$('#popup-pembayaran-bank').html(bank);
		$$(".bank_pembayaran").val(bank);
		$$('#popup-pembayaran-penjualan_grandtotal').html(number_format(penjualan_grandtotal) + ' ,-');
		$$('#popup-pembayaran-penjualan_jumlah_pembayaran').html(number_format(penjualan_jumlah_pembayaran) + ' ,-');
		$$('#popup-pembayaran-penjualan_kekurangan').html(number_format(penjualan_grandtotal - penjualan_jumlah_pembayaran) + ' ,-');
		$$('#popup-pembayaran-penjualan_status_pembayaran').html('<b>' + penjualan_status_pembayaran + '</b>');

		if (penjualan_status_pembayaran == 'Lunas') {
			$$('#popup-pembayaran-penjualan_status_pembayaran').removeClass('card-color-green').removeClass('card-color-blue').addClass('card-color-blue');
		} else {
			$$('#popup-pembayaran-penjualan_status_pembayaran').removeClass('card-color-green').removeClass('card-color-blue').addClass('card-color-green');
		}
	}



	$$('#tanggal_pembayaran_choose').html(moment(penjualan_tanggal_choose).format('DD-MMM-YYYY'));

	if (number_format(pembayaran_1) != 0) {
		$$('#content_bayar2').show();
		$$('#pembayaran_1_dp_awal').val(number_format(pembayaran_1));
		$$('#popup-pembayaran-tgl1').html(moment(pembayaran1_tgl).format('DD-MMM-YYYY'));
		$$('#pembayaran_1_dp_awal').attr('readonly', true);
		$$('#pembayaran_1_dp_awal').prop("onclick", null).off("click");
		$$('#bank_1').val(bank);

	} else {
		$$('#pembayaran_1_dp_awal').val(number_format(0));
		$$('#content_bayar2').hide();
		$$('#popup-pembayaran-tgl1').html("");
		$$('#pembayaran_1_dp_awal').removeAttr("readonly");
		$$('#pembayaran_1_dp_awal').attr('onClick', 'emptyValue("pembayaran_1")');
		$$('#bank_1').val(bank);
	}
	if (number_format(pembayaran_2) != 0) {
		$$('#content_bayar3').show();
		$$('#pembayaran_2').val(number_format(pembayaran_2));
		$$('#popup-pembayaran-tgl2').html(moment(pembayaran2_tgl).format('DD-MMM-YYYY'));
		$$('#pembayaran_2').attr('readonly', true);
		$$('#pembayaran_2').prop("onclick", null).off("click");
		$$('#bank_2').val(bank_2);

	} else {
		$$('#pembayaran_2').val(number_format(0));
		$$('#content_bayar3').hide();
		$$('#popup-pembayaran-tgl2').html("");
		$$('#pembayaran_2').removeAttr("readonly");
		$$('#pembayaran_2').attr('onClick', 'emptyValue("pembayaran_2")');
		$$('#bank_2').val(bank);
	}

	if (number_format(pembayaran_3) != 0) {
		$$('#pembayaran_3').val(number_format(pembayaran_3));
		$$('#popup-pembayaran-tgl3').html(moment(pembayaran3_tgl).format('DD-MMM-YYYY'));
		$$('#pembayaran_3').attr('readonly', true);
		$$('#content_bayar4').show();
		$$('#pembayaran_3').prop("onclick", null).off("click");
		$$('#bank_3').val(bank_3);
	} else {
		$$('#pembayaran_3').val(number_format(0));
		$$('#content_bayar4').hide();
		$$('#popup-pembayaran-tgl3').html("");
		$$('#pembayaran_3').removeAttr("readonly");
		$$('#pembayaran_3').attr('onClick', 'emptyValue("pembayaran_3")');
		$$('#bank_3').val(bank);
	}
	if (number_format(pembayaran_4) != 0) {
		$$('#pembayaran_4').val(number_format(pembayaran_4));
		$$('#popup-pembayaran-tgl4').html(moment(pembayaran4_tgl).format('DD-MMM-YYYY'));
		$$('#pembayaran_4').attr('readonly', true);
		$$('#content_bayar5').show();
		$$('#pembayaran_4').prop("onclick", null).off("click");
		$$('#bank_4').val(bank_4);
	} else {
		$$('#pembayaran_4').val(number_format(0));
		$$('#content_bayar5').hide();
		$$('#popup-pembayaran-tgl4').html("");
		$$('#pembayaran_4').removeAttr("readonly");
		$$('#pembayaran_4').attr('onClick', 'emptyValue("pembayaran_4")');
		$$('#bank_4').val(bank);
	}
	if (number_format(pembayaran_5) != 0) {
		$$('#pembayaran_5').val(number_format(pembayaran_5));
		$$('#pembayaran_5').attr('readonly', true);
		$$('#popup-pembayaran-tgl5').html(moment(pembayaran5_tgl).format('DD-MMM-YYYY'));
		$$('#content_bayar6').show();
		$$('#pembayaran_5').prop("onclick", null).off("click");
		$$('#bank_5').val(bank_5);
	} else {
		$$('#pembayaran_5').val(number_format(0));
		$$('#content_bayar6').hide();
		$$('#popup-pembayaran-tgl5').html("");
		$$('#pembayaran_5').removeAttr("readonly");
		$$('#pembayaran_5').attr('onClick', 'emptyValue("pembayaran_5")');
		$$('#bank_5').val(bank);
	}
	if (number_format(pembayaran_6) != 0) {
		$$('#pembayaran_6').val(number_format(pembayaran_6));
		$$('#pembayaran_6').attr('readonly', true);
		$$('#popup-pembayaran-tgl6').html(moment(pembayaran6_tgl).format('DD-MMM-YYYY'));
		$$('#content_bayar7').show();
		$$('#pembayaran_6').prop("onclick", null).off("click");
		$$('#bank_6').val(bank_6);
	} else {
		$$('#pembayaran_6').val(number_format(0));
		$$('#content_bayar7').hide();
		$$('#popup-pembayaran-tgl6').html("");
		$$('#pembayaran_6').removeAttr("readonly");
		$$('#pembayaran_6').attr('onClick', 'emptyValue("pembayaran_6")');
		$$('#bank_6').val(bank);
	}
	if (number_format(pembayaran_7) != 0) {
		$$('#pembayaran_7').val(number_format(pembayaran_7));
		$$('#pembayaran_7').attr('readonly', true);
		$$('#popup-pembayaran-tgl7').html(moment(pembayaran7_tgl).format('DD-MMM-YYYY'));
		$$('#content_bayar8').show();
		$$('#pembayaran_7').prop("onclick", null).off("click");
		$$('#bank_7').val(bank_7);
	} else {
		$$('#pembayaran_7').val(number_format(0));
		$$('#content_bayar8').hide();
		$$('#popup-pembayaran-tgl7').html("");
		$$('#pembayaran_7').removeAttr("readonly");
		$$('#pembayaran_7').attr('onClick', 'emptyValue("pembayaran_7")');
		$$('#bank_7').val(bank);
	}
	if (number_format(pembayaran_8) != 0) {
		$$('#pembayaran_8').val(number_format(pembayaran_8));
		$$('#pembayaran_8').attr('readonly', true);
		$$('#popup-pembayaran-tgl8').html(moment(pembayaran8_tgl).format('DD-MMM-YYYY'));
		$$('#content_bayar9').show();
		$$('#pembayaran_8').prop("onclick", null).off("click");
		$$('#bank_8').val(bank_8);
	} else {
		$$('#pembayaran_8').val(number_format(0));
		$$('#content_bayar9').hide();
		$$('#popup-pembayaran-tgl8').html("");
		$$('#pembayaran_8').removeAttr("readonly");
		$$('#pembayaran_8').attr('onClick', 'emptyValue("pembayaran_8")');
		$$('#bank_8').val(bank);
	}
	if (number_format(pembayaran_9) != 0) {
		$$('#pembayaran_9').val(number_format(pembayaran_9));
		$$('#pembayaran_9').attr('readonly', true);
		$$('#popup-pembayaran-tgl9').html(moment(pembayaran9_tgl).format('DD-MMM-YYYY'));
		$$('#content_bayar10').show();
		$$('#pembayaran_9').prop("onclick", null).off("click");
		$$('#bank_9').val(bank_9);
	} else {
		$$('#pembayaran_9').val(number_format(0));
		$$('#content_bayar10').hide();
		$$('#popup-pembayaran-tgl9').html("");
		$$('#pembayaran_9').removeAttr("readonly");
		$$('#pembayaran_9').attr('onClick', 'emptyValue("pembayaran_9")');
		$$('#bank_9').val(bank);
	}
	if (number_format(pembayaran_10) != 0) {
		$$('#pembayaran_10').val(number_format(pembayaran_10));
		$$('#pembayaran_10').prop("onclick", null).off("click");
		$$('#pembayaran_10').attr('readonly', true);
		$$('#popup-pembayaran-tgl10').html(moment(pembayaran10_tgl).format('DD-MMM-YYYY'));
	} else {
		$$('#pembayaran_10').val(number_format(0));
		$$('#popup-pembayaran-tgl10').html("");
		$$('#pembayaran_10').removeAttr("readonly");
		$$('#pembayaran_10').attr('onClick', 'emptyValue("pembayaran_10")');
	}

	$$('#pembayaran-penjualan_id').val(penjualan_id);
	$$('#pembayaran-client_id').val(client_id);
}


function openPopupALamat(client_telp, client_cp, client_nama, client_alamat) {

	$('#popup-alamat-client-td').html(client_nama);
	$('#alamat_client_sj').html(client_alamat);
	$('#pic_sj').html(client_cp);
	$('#no_hp_sj').html(client_telp);
}

function uploadFotoPembayaran(foto_urutan, pembayaran_id, isi_foto) {
	jQuery('#penjualan_id_foto_pembayaran').val(pembayaran_id);
	jQuery('#foto_urutan').val(foto_urutan);

	jQuery('#file_foto_pembayaran').val('');
	localStorage.removeItem('file_foto_pembayaran');
	$('#file_foto_pembayaran_view').attr('src', '');
	$('#file_foto_pembayaran_view_now').attr('src', '');
	$$(".custom-file-upload-foto-pembayaran").show();
	if (isi_foto != 'null') {
		jQuery('#file_foto_pembayaran_view_now').attr('src', BASE_PATH_IMAGE_FOTO_PEMBAYARAN + '/' + isi_foto);
	} else {
		jQuery('#file_foto_pembayaran_view_now').attr('src', 'https://tasindo-sale-webservice.digiseminar.id/noimage.jpg');
	}
}

function getHeaderPenjualanKunjungan(page) {

	if (localStorage.getItem("jabatan_kantor") == 'gudang') {
		$('.sj-menu').hide();
	} else {
		$('.sj-menu').show();
	}

	if (page == '' || page == null) {
		var page_now = 1;
	} else {
		var page_now = page;
	}

	if (jQuery('#range-penjualan').val() == '' || jQuery('#range-penjualan').val() == null) {
		var startdate = "empty";
		var enddate = "empty";
	} else {
		var startdate_new = new Date(calendarRangePenjualan.value[0]);
		var enddate_new = new Date(calendarRangePenjualan.value[1]);
		var startdate = moment(startdate_new).format('YYYY-MM-DD');
		var enddate = moment(enddate_new).format('YYYY-MM-DD');
	}
	if (jQuery('#perusahaan_penjualan_filter').val() == '' || jQuery('#perusahaan_penjualan_filter').val() == null) {
		perusahaan_penjualan_value = "empty";
	} else {
		perusahaan_penjualan_value = jQuery('#perusahaan_penjualan_filter').val();
	}

	if (jQuery('#sales_filter').val() == '' || jQuery('#sales_filter').val() == null) {
		sales_filter = "empty";
	} else {
		sales_filter = jQuery('#sales_filter').val();
	}
	var penjualan_value = "";
	var pagination_button = "";


	jQuery.ajax({
		type: 'POST',
		url: "" + BASE_API + "/get-surat-jalan?page=" + page_now + "",
		dataType: 'JSON',
		data: {
			karyawan_id: localStorage.getItem("user_id"),
			startdate: startdate,
			enddate: enddate,
			sales_filter: sales_filter,
			perusahaan_penjualan_value: perusahaan_penjualan_value,
			lokasi_pabrik: localStorage.getItem("lokasi_pabrik_surat")
		},
		beforeSend: function () {
			// app.dialog.preloader('Harap Tunggu');
		},
		success: function (data) {
			var nota2 = '';
			var nota = '';
			app.dialog.close();
			no = 1;
			for (i = 0; i < data.data.last_page; i++) {
				no = i + 1;
				pagination_button += '<i onclick="getHeaderPenjualanKunjungan(' + no + ');"  style="border-radius:2px; width:40px; height:40px; background-color:#4c5269; padding-left:8px; padding-right:8px; margin:2px;">' + no + '</i>';
			}
			var warna_button_packing = '';
			var num = 1;
			$.each(data.data.data, function (i2, item2) {
				if (item2.penjualan_total_qty_detail == 0) {
					var sisa_kirim_sj = parseFloat(item2.penjualan_total_qty) - parseFloat(data.surat_jalan_count[item2.penjualan_id]);
				} else {
					var sisa_kirim_sj = parseFloat(item2.penjualan_total_qty_detail) - parseFloat(data.surat_jalan_count[item2.penjualan_id]);
				}

				// kasi warna SPK
				if (item2.penjualan_total_qty_detail != 0) {
					var kurang_kirim = item2.penjualan_total_qty_detail - item2.penjualan_total_kirim;


				} else {
					var kurang_kirim = 999;
				}
				var warna_spk_kirim = "";
				if (kurang_kirim <= 0) {
					warna_spk_kirim += 'background-color:#000080;';

				} else {
					warna_spk_kirim += '';

				}

				var produksi_selesai = '';
				if (item2.produksi_selesai == 'selesai') {
					produksi_selesai += 'background-color:#000080;';

				} else {
					produksi_selesai += '';

				}

				var kurang_bayar = parseFloat(item2.penjualan_grandtotal - item2.penjualan_jumlah_pembayaran);
				var kurang_bayar_bg = '';
				if (kurang_bayar <= 0) {
					kurang_bayar_bg += 'background-color:#000080;';

				} else {
					kurang_bayar_bg += '';

				}

				var bbgselesaiprodsj = '';
				if ((item2.produksi_selesai == 'selesai') && (parseFloat(kurang_bayar)) <= 0) {
					bbgselesaiprodsj += 'background-color:#000080;';
				} else {
					bbgselesaiprodsj += '';
				}

				var alamat_kirim_penjualan = '';
				var btn_alamat_kirim_penjualan = "";
				var nama_kirim = "";
				if (item2.alamat_kirim_penjualan != null) {
					alamat_kirim_penjualan = item2.alamat_kirim_penjualan;
					if (item2.packing == 'polos') {
						btn_alamat_kirim_penjualan = "btn-color-greenWhite";
					} else if (item2.packing == 'plastik') {
						nama_kirim = item2.packing;
						btn_alamat_kirim_penjualan = "btn-color-greenWhite";
					} else if (item2.packing == 'kardus') {
						nama_kirim = item2.packing;
						btn_alamat_kirim_penjualan = "card-color-brown";
					}
				} else {
					alamat_kirim_penjualan = "-";
					if (item2.packing == 'polos') {
						btn_alamat_kirim_penjualan = "bg-dark-gray-young text-add-colour-black-soft";
					} else if (item2.packing == 'plastik') {
						nama_kirim = item2.packing;
						btn_alamat_kirim_penjualan = "bg-dark-gray-young text-add-colour-black-soft";
					} else if (item2.packing == 'kardus') {
						nama_kirim = item2.packing;
						btn_alamat_kirim_penjualan = "card-color-brown";
					}
				}

				console.log(data.bantuan_cabang[item2.penjualan_id]);
				// if (data.bantuan_cabang[item2.penjualan_id][0].bantuan_cabang == 'Jakarta') {
				// 	var cabang = 'Xinyao';
				// } else if (data.bantuan_cabang[item2.penjualan_id][0].bantuan_cabang != null) {
				// 	var cabang = data.bantuan_cabang[item2.penjualan_id][0].bantuan_cabang;
				// } else if (data.bantuan_cabang[item2.penjualan_id][0].bantuan_cabang == null) {
				// 	var cabang = 'Asia';
				// }


				if (sisa_kirim_sj <= 0) {
					if (data.valid_count[item2.penjualan_id] > 0) {
						var color_btn_sj_id = "card-color-red";
						var color_row = "announcement card-color-red";
					} else {
						var color_btn_sj_id = "btn-color-blueWhite";
					}
				} else if (item2.penjualan_total_kirim == null) {
					if (data.valid_count[item2.penjualan_id] > 0) {
						var color_btn_sj_id = "card-color-red";
						var color_row = "announcement card-color-red";
					} else {
						var color_btn_sj_id = "bg-dark-gray-young text-add-colour-black-soft";
					}
				} else if (sisa_kirim_sj > 0) {
					if (data.valid_count[item2.penjualan_id] > 0) {
						var color_btn_sj_id = "card-color-red";
						var color_row = "announcement card-color-red";
					} else {
						var color_btn_sj_id = "btn-color-greenWhite";
					}
				}

				if (item2.karyawan_id == 13) {
					num++
					penjualan_value += '<tr class="' + color_row + '">';
					penjualan_value += '<td style="border-bottom:1px solid gray;" class="label-cell">';
					penjualan_value += '   <button  class="' + btn_alamat_kirim_penjualan + ' button-small col button popup-open text-bold" data-popup=".input-alamat-kirim-support-sj" onclick="kirimAlamatSupportSj(\'' + item2.penjualan_id + '\',\'' + item2.bantuan_cabang + '\');">' + nama_kirim + '</button>';
					penjualan_value += '</td>';
					penjualan_value += '<td align="left" data-popup=".detail-sales-surat-jalan" onclick="detailPenjualanProduksiSj(\'' + item2.penjualan_id + '\')" style="' + bbgselesaiprodsj + ' border-bottom:1px solid gray; border-left:1px solid gray; min-width: 100px !important;"  class="label-cell popup-open"><font style="color:white;" class="text-add-colour-black-soft"  >' + moment(item2.penjualan_tanggal).format('DDMMYY') + '-' + item2.penjualan_id.replace(/\INV_/g, '').replace(/^0+/, '') + '</font></td>';
					penjualan_value += '<td align="left" onclick="detailPenjualanTolltip(\'' + item2.penjualan_id + '\');"  style="' + produksi_selesai + ' border-right:1px solid gray; border-bottom:1px solid gray; border-left:1px solid gray;" >' + item2.client_nama + '<br><div class="detail_sales_data_tooltip_' + item2.penjualan_id + '"></div>';

					// penjualan_value += '<td align="left"  class="popup-open" onclick="openPopupALamat(\'' + item2.client_telp + '\',\'' + item2.client_cp + '\',\'' + item2.client_nama + '\',\'' + item2.client_alamat + '\');" style="' + kurang_bayar_bg + ' border-bottom:1px solid gray;  border-bottom:1px solid gray; " data-popup=".popup-alamat" >' + item2.client_kota + '';
					// penjualan_value += '</td>';

					penjualan_value += '<td align="left" style="border-bottom:1px solid gray;  border-bottom:1px solid gray; " class="label-cell">' + item2.client_kota + '';
					penjualan_value += '</td>';
					// if (localStorage.getItem("lokasi_pabrik_surat") != 'Asia') {
					// 	$(".show_pabrik").show();
					// 	penjualan_value += '<td align="left" onclick="detailBantuanTolltip(\'' + item2.penjualan_id + '\');" style="border-left:1px solid gray;border-bottom:1px solid gray;  border-bottom:1px solid gray; ">' + cabang + '<br><div class="detail_bantuan_data_tooltip_' + item2.penjualan_id + '"></td>';
					// } else {
					// 	$(".show_pabrik").hide();
					// }

					// penjualan_value += '<td align="left" data-popup=".detail-karyawan-sales" onclick="openPopupSales(\'' + item2.karyawan_nama + '\',\'' + item2.karyawan_hp + '\',\'' + item2.karyawan_alamat + '\');" style="' + bbgselesaiprodsj + ' border-bottom:1px solid gray; border-left:1px solid gray;"  class="label-cell  popup-open"  ><font style="color:white;" class="text-add-colour-black-soft"  >' + item2.karyawan_nama + '</font></td>';
					// penjualan_value += '</td>';


					// if (localStorage.getItem("jabatan_kantor") != 'gudang') {
					// 	penjualan_value += '<td style="border-right:1px solid gray; border-bottom:1px solid gray;" class="label-cell">';
					// 	penjualan_value += '   <button  class="text-add-colour-black-soft bg-dark-gray-young button-small col button popup-open text-bold" data-popup=".detail-pembayaran" onclick="detailPembayaran(\'' + item2.penjualan_tanggal + '\',\'' + item2.performa_id_relation + '\',\'' + item2.bank_1 + '\',\'' + item2.bank_2 + '\',\'' + item2.bank_3 + '\',\'' + item2.bank_4 + '\',\'' + item2.bank_5 + '\',\'' + item2.bank_6 + '\',\'' + item2.bank_7 + '\',\'' + item2.bank_8 + '\',\'' + item2.bank_9 + '\',\'' + item2.bank_10 + '\',\'' + item2.pembayaran1_tgl + '\',\'' + item2.pembayaran2_tgl + '\',\'' + item2.pembayaran3_tgl + '\',\'' + item2.pembayaran4_tgl + '\',\'' + item2.pembayaran5_tgl + '\',\'' + item2.pembayaran6_tgl + '\',\'' + item2.pembayaran7_tgl + '\',\'' + item2.pembayaran8_tgl + '\',\'' + item2.pembayaran9_tgl + '\',\'' + item2.pembayaran10_tgl + '\',\'' + item2.bank + '\',\'' + item2.pembayaran_1 + '\',\'' + item2.pembayaran_2 + '\',\'' + item2.pembayaran_3 + '\',\'' + item2.pembayaran_4 + '\',\'' + item2.pembayaran_5 + '\',\'' + item2.pembayaran_6 + '\',\'' + item2.pembayaran_7 + '\',\'' + item2.pembayaran_8 + '\',\'' + item2.pembayaran_9 + '\',\'' + item2.pembayaran_10 + '\',\'' + item2.client_nama + '\',\'' + item2.penjualan_jumlah_pembayaran + '\',\'' + item2.penjualan_total_qty + '\',\'' + item2.penjualan_grandtotal + '\',\'' + item2.penjualan_id + '\',\'' + item2.client_id + '\',\'' + item2.penjualan_status_pembayaran + '\');">Bayar</button>';
					// 	penjualan_value += '</td>';
					// }



					penjualan_value += '<td style="border-left:1px solid gray;border-right:1px solid gray; border-bottom:1px solid gray;" class="label-cell">';
					penjualan_value += '   <button class="' + color_btn_sj_id + ' button-small col button popup-open text-bold" data-popup=".surat-jalan" onclick="getSuratJalanDetail(\'' + item2.penjualan_id + '\',\'' + item2.penjualan_total_qty + '\',\'' + item2.client_nama + '\',\'' + moment(item2.penjualan_tanggal).format('DDMMYY') + '-' + item2.penjualan_id.replace(/\INV_/g, '').replace(/^0+/, '') + '\',\'' + item2.tgl_di_kirim + '\');">S.Jalan</button>';
					penjualan_value += '</td>';

					penjualan_value += '<td style="border-right:1px solid gray; border-bottom:1px solid gray;" class="label-cell">';
					penjualan_value += '  <button class="text-add-colour-black-soft bg-dark-gray-young button-small col button popup-open text-bold" data-popup=".retur" onclick="retur(\'' + item2.kode_retur1 + '\',\'' + item2.tgl_retur1 + '\',\'' + item2.penerima1 + '\',\'' + item2.keterangan1 + '\',\'' + item2.retur1 + '\',\'' + item2.kode_retur2 + '\',\'' + item2.tgl_retur2 + '\',\'' + item2.penerima2 + '\',\'' + item2.keterangan2 + '\',\'' + item2.retur2 + '\',\'' + item2.kode_retur3 + '\',\'' + item2.tgl_retur3 + '\',\'' + item2.penerima3 + '\',\'' + item2.keterangan3 + '\',\'' + item2.retur3 + '\',\'' + item2.kode_retur4 + '\',\'' + item2.tgl_retur4 + '\',\'' + item2.penerima4 + '\',\'' + item2.keterangan4 + '\',\'' + item2.retur4 + '\',\'' + item2.kode_retur5 + '\',\'' + item2.tgl_retur5 + '\',\'' + item2.penerima5 + '\',\'' + item2.keterangan5 + '\',\'' + item2.retur5 + '\',\'' + item2.kode_retur6 + '\',\'' + item2.tgl_retur6 + '\',\'' + item2.penerima6 + '\',\'' + item2.keterangan6 + '\',\'' + item2.retur6 + '\',\'' + item2.kode_retur7 + '\',\'' + item2.tgl_retur7 + '\',\'' + item2.penerima7 + '\',\'' + item2.keterangan7 + '\',\'' + item2.retur7 + '\',\'' + item2.kode_retur8 + '\',\'' + item2.tgl_retur8 + '\',\'' + item2.penerima8 + '\',\'' + item2.keterangan8 + '\',\'' + item2.retur8 + '\',\'' + item2.kode_retur9 + '\',\'' + item2.tgl_retur9 + '\',\'' + item2.penerima9 + '\',\'' + item2.keterangan9 + '\',\'' + item2.retur9 + '\',\'' + item2.kode_retur10 + '\',\'' + item2.tgl_retur10 + '\',\'' + item2.penerima10 + '\',\'' + item2.keterangan10 + '\',\'' + item2.retur10 + '\',\'' + item2.client_id + '\',\'' + item2.penjualan_jenis + '\');">Retur</button>';
					penjualan_value += '</td>';
					penjualan_value += '</tr>';
				} else {
					// if ((item2.penjualan_grandtotal - item2.penjualan_jumlah_pembayaran) <= 0) {
					num++
					penjualan_value += '<tr class="' + color_row + '">';

					penjualan_value += '<td style="border-bottom:1px solid gray;" class="label-cell">';
					penjualan_value += '   <button  class="' + btn_alamat_kirim_penjualan + ' button-small col button popup-open text-bold" data-popup=".input-alamat-kirim-support-sj" onclick="kirimAlamatSupportSj(\'' + item2.penjualan_id + '\',\'' + item2.bantuan_cabang + '\');">' + nama_kirim + '</button>';
					penjualan_value += '</td>';
					penjualan_value += '<td align="left" data-popup=".detail-sales-surat-jalan" onclick="detailPenjualanProduksiSj(\'' + item2.penjualan_id + '\')" style="' + bbgselesaiprodsj + ' border-bottom:1px solid gray; border-left:1px solid gray; min-width: 100px !important;"  class="label-cell popup-open"><font style="color:white;" class="text-add-colour-black-soft">' + moment(item2.penjualan_tanggal).format('DDMMYY') + '-' + item2.penjualan_id.replace(/\INV_/g, '').replace(/^0/, '') + '</font></td>';
					penjualan_value += '<td align="left" onclick="detailPenjualanTolltip(\'' + item2.penjualan_id + '\');"  style="' + produksi_selesai + ' border-right:1px solid gray; border-bottom:1px solid gray; border-left:1px solid gray;" >' + item2.client_nama + '<br><div class="detail_sales_data_tooltip_' + item2.penjualan_id + '"></div>';

					// penjualan_value += '<td align="left"  class="popup-open" onclick="openPopupALamat(\'' + item2.client_telp + '\',\'' + item2.client_cp + '\',\'' + item2.client_nama + '\',\'' + item2.client_alamat + '\');" style="' + kurang_bayar_bg + ' border-bottom:1px solid gray;  border-bottom:1px solid gray; " data-popup=".popup-alamat" >' + item2.client_kota + '';
					// penjualan_value += '</td>';

					penjualan_value += '<td align="left" style="border-bottom:1px solid gray;  border-bottom:1px solid gray; " class="label-cell">' + item2.client_kota + '';
					penjualan_value += '</td>';

					// if (localStorage.getItem("lokasi_pabrik_surat") != 'Asia') {
					// 	$(".show_pabrik").show();
					// 	penjualan_value += '<td align="left" onclick="detailBantuanTolltip(\'' + item2.penjualan_id + '\');" style="border-left:1px solid gray;border-bottom:1px solid gray;  border-bottom:1px solid gray; ">' + cabang + '<br><div class="detail_bantuan_data_tooltip_' + item2.penjualan_id + '"></td>';
					// } else {
					// 	$(".show_pabrik").hide();
					// }


					// penjualan_value += '<td align="left" data-popup=".detail-karyawan-sales" onclick="openPopupSales(\'' + item2.karyawan_nama + '\',\'' + item2.karyawan_hp + '\',\'' + item2.karyawan_alamat + '\');" style="' + bbgselesaiprodsj + ' border-bottom:1px solid gray; border-left:1px solid gray;"  class="label-cell  popup-open"  ><font style="color:white;" class="text-add-colour-black-soft"  >' + item2.karyawan_nama + '</font></td>';
					// penjualan_value += '</td>';


					// if (localStorage.getItem("jabatan_kantor") != 'gudang') {
					// 	penjualan_value += '<td style="border-right:1px solid gray; border-bottom:1px solid gray;" class="label-cell">';
					// 	penjualan_value += '   <button  class="text-add-colour-black-soft bg-dark-gray-young button-small col button popup-open text-bold" data-popup=".detail-pembayaran" onclick="detailPembayaran(\'' + item2.penjualan_tanggal + '\',\'' + item2.performa_id_relation + '\',\'' + item2.bank_1 + '\',\'' + item2.bank_2 + '\',\'' + item2.bank_3 + '\',\'' + item2.bank_4 + '\',\'' + item2.bank_5 + '\',\'' + item2.bank_6 + '\',\'' + item2.bank_7 + '\',\'' + item2.bank_8 + '\',\'' + item2.bank_9 + '\',\'' + item2.bank_10 + '\',\'' + item2.pembayaran1_tgl + '\',\'' + item2.pembayaran2_tgl + '\',\'' + item2.pembayaran3_tgl + '\',\'' + item2.pembayaran4_tgl + '\',\'' + item2.pembayaran5_tgl + '\',\'' + item2.pembayaran6_tgl + '\',\'' + item2.pembayaran7_tgl + '\',\'' + item2.pembayaran8_tgl + '\',\'' + item2.pembayaran9_tgl + '\',\'' + item2.pembayaran10_tgl + '\',\'' + item2.bank + '\',\'' + item2.pembayaran_1 + '\',\'' + item2.pembayaran_2 + '\',\'' + item2.pembayaran_3 + '\',\'' + item2.pembayaran_4 + '\',\'' + item2.pembayaran_5 + '\',\'' + item2.pembayaran_6 + '\',\'' + item2.pembayaran_7 + '\',\'' + item2.pembayaran_8 + '\',\'' + item2.pembayaran_9 + '\',\'' + item2.pembayaran_10 + '\',\'' + item2.client_nama + '\',\'' + item2.penjualan_jumlah_pembayaran + '\',\'' + item2.penjualan_total_qty + '\',\'' + item2.penjualan_grandtotal + '\',\'' + item2.penjualan_id + '\',\'' + item2.client_id + '\',\'' + item2.penjualan_status_pembayaran + '\');">Bayar</button>';
					// 	penjualan_value += '</td>';
					// }

					penjualan_value += '<td style="border-left:1px solid gray;border-right:1px solid gray; border-bottom:1px solid gray;" class="label-cell">';
					penjualan_value += '   <button class="' + color_btn_sj_id + ' button-small col button popup-open text-bold" data-popup=".surat-jalan" onclick="getSuratJalanDetail(\'' + item2.penjualan_id + '\',\'' + item2.penjualan_total_qty + '\',\'' + item2.client_nama + '\',\'' + moment(item2.penjualan_tanggal).format('DDMMYY') + '-' + item2.penjualan_id.replace(/\INV_/g, '').replace(/^0+/, '') + '\',\'' + item2.tgl_di_kirim + '\');">S.Jalan</button>';
					penjualan_value += '</td>';

					penjualan_value += '<td style="border-right:1px solid gray; border-bottom:1px solid gray;" class="label-cell">';
					penjualan_value += '  <button class="text-add-colour-black-soft bg-dark-gray-young button-small col button popup-open text-bold" data-popup=".retur" onclick="retur(\'' + item2.kode_retur1 + '\',\'' + item2.tgl_retur1 + '\',\'' + item2.penerima1 + '\',\'' + item2.keterangan1 + '\',\'' + item2.retur1 + '\',\'' + item2.kode_retur2 + '\',\'' + item2.tgl_retur2 + '\',\'' + item2.penerima2 + '\',\'' + item2.keterangan2 + '\',\'' + item2.retur2 + '\',\'' + item2.kode_retur3 + '\',\'' + item2.tgl_retur3 + '\',\'' + item2.penerima3 + '\',\'' + item2.keterangan3 + '\',\'' + item2.retur3 + '\',\'' + item2.kode_retur4 + '\',\'' + item2.tgl_retur4 + '\',\'' + item2.penerima4 + '\',\'' + item2.keterangan4 + '\',\'' + item2.retur4 + '\',\'' + item2.kode_retur5 + '\',\'' + item2.tgl_retur5 + '\',\'' + item2.penerima5 + '\',\'' + item2.keterangan5 + '\',\'' + item2.retur5 + '\',\'' + item2.kode_retur6 + '\',\'' + item2.tgl_retur6 + '\',\'' + item2.penerima6 + '\',\'' + item2.keterangan6 + '\',\'' + item2.retur6 + '\',\'' + item2.kode_retur7 + '\',\'' + item2.tgl_retur7 + '\',\'' + item2.penerima7 + '\',\'' + item2.keterangan7 + '\',\'' + item2.retur7 + '\',\'' + item2.kode_retur8 + '\',\'' + item2.tgl_retur8 + '\',\'' + item2.penerima8 + '\',\'' + item2.keterangan8 + '\',\'' + item2.retur8 + '\',\'' + item2.kode_retur9 + '\',\'' + item2.tgl_retur9 + '\',\'' + item2.penerima9 + '\',\'' + item2.keterangan9 + '\',\'' + item2.retur9 + '\',\'' + item2.kode_retur10 + '\',\'' + item2.tgl_retur10 + '\',\'' + item2.penerima10 + '\',\'' + item2.keterangan10 + '\',\'' + item2.retur10 + '\',\'' + item2.client_id + '\',\'' + item2.penjualan_jenis + '\');">Retur</button>';
					penjualan_value += '</td>';
					penjualan_value += '</tr>';
					// }
				}

			});


			$$('#penjualan_value').html(penjualan_value);
			$$('#pagination_button').html(pagination_button);
			$$('#current_page').html(data.data.total);
			$$('#from_data').html(data.data.from);
			$$('#to_data').html(data.data.to);
			$$('#total_data').html(data.data.total);
			$.each(data.data_teratas, function (i3, item3) {
				$$(".tr_" + item3.penjualan_id + "").remove();
			});



		},
		error: function (xmlhttprequest, textstatus, message) {
		}
	});
}

function detailBantuanTolltip(penjualan_id) {
	detail_bantuan_data = '';
	if ($$('.detail_bantuan_data_tooltip_' + penjualan_id + '').hasClass("open-detail")) {
		$$('.detail_bantuan_data_tooltip_' + penjualan_id + '').html(detail_bantuan_data);
		$$('.detail_bantuan_data_tooltip_' + penjualan_id + '').removeClass('open-detail');
	} else {
		jQuery.ajax({
			type: 'POST',
			url: "" + BASE_API + "/get-penjualan-detail-performa",
			dataType: 'JSON',
			data: {
				karyawan_id: localStorage.getItem("user_id"),
				penjualan_id: penjualan_id,
			},
			beforeSend: function () {
				$$('#detail_sales_data').html('');
				app.dialog.preloader('Harap Tunggu');
			},
			success: function (data) {
				app.dialog.close();
				detail_bantuan_data += '<table  width="100%" style="border-collapse: collapse; border:1px solid gray;" border="1">';
				detail_bantuan_data += '<tbody>';
				jQuery.each(data.data, function (i, val) {
					var no = i + 1;
					if (val.bantuan_cabang == 'Jakarta') {
						var cabang = 'Xinyao';
					} else if (val.bantuan_cabang != null) {
						var cabang = val.bantuan_cabang;
					} else if (val.bantuan_cabang == null) {
						var cabang = 'Pusat';
					}
					detail_bantuan_data += ' <tr>';
					detail_bantuan_data += '  <td class="label-cell text-align-left" width="100%">' + val.penjualan_jenis + ' : ' + cabang + '</td>';
					detail_bantuan_data += '</tr>';

				});
				detail_bantuan_data += '</tbody>';
				detail_bantuan_data += '</table>';
				$$('.detail_bantuan_data_tooltip_' + penjualan_id + '').html(detail_bantuan_data);
				$$('.detail_bantuan_data_tooltip_' + penjualan_id + '').addClass('open-detail');



			},
			error: function (xmlhttprequest, textstatus, message) {
			}
		});
	}

}

function kirimAlamatSupportSj(penjualan_id, bantuan_cabang) {
	jQuery.ajax({
		type: 'POST',
		url: "" + BASE_API + "/get-data-Alamat",
		dataType: 'JSON',
		data: {
			penjualan_id: penjualan_id,
		},
		beforeSend: function () {
			app.dialog.preloader('Harap Tunggu');
			$("#input_alamat_kirim_popup_support_sj")[0].reset();
		},
		success: function (data) {
			app.dialog.close();
			var alamat_client = "";
			var alamat_kirim = "";
			var client_nama = "";
			var hp_alamat = "";
			var bantuan_cabang1 = "";
			if (data.data != null) {
				alamat_client = data.data.client_alamat;
				alamat_kirim = data.data.alamat_kirim_penjualan;
				client_nama = data.data.client_nama;
				hp_alamat = data.data.client_telp;
				if (localStorage.getItem("lokasi_pabrik_surat") == 'Asia') {
					bantuan_cabang1 = 'Asia';
				} else {
					if (bantuan_cabang1 != undefined) {
						bantuan_cabang1 = bantuan_cabang;
					} else {
						bantuan_cabang1 = '-';
					}
				}

			} else {
				alamat_client = '-';
				alamat_kirim = '-';
				client_nama = '-';
				hp_alamat = '-';
				bantuan_cabang1 = '-';
			}

			if (data.data.foto_produksi_selesai != null) {
				jQuery('#file_foto_produksi_selesai_support_sj_view').attr('src', BASE_PATH_IMAGE_BUKTI_PRODUKSI + '/' + data.data.foto_produksi_selesai);
			} else {
				jQuery('#file_foto_produksi_selesai_support_sj_view').attr('src', 'https://tasindo-sale-webservice.digiseminar.id/noimage.jpg');
			}
			$$('#alamat_sekarang_popup_support_sj').val(alamat_client);
			$$('#alamat_kirim_popup_support_sj').val(alamat_kirim);
			$$('#nama-client-alamat-support-sj').html(client_nama);
			$$('#hp_alamat_support_sj').val(hp_alamat);
			$$('#pabrik_kirim_popup_support_sj').val(bantuan_cabang1);
		},
		error: function (xmlhttprequest, textstatus, message) {
		}
	});
}

function selectMonthValues() {
	$('#point_bulan_sales').append($('<option>', {
		value: moment().format('M'),
		text: moment().format('MMMM')
	}));

	$('#point_bulan_sales').append($('<option>', {
		value: moment().subtract(1, 'months').format('M'),
		text: moment().subtract(1, 'months').format('MMMM')
	}));

	$('#point_bulan_sales').append($('<option>', {
		value: moment().subtract(2, 'months').format('M'),
		text: moment().subtract(2, 'months').format('MMMM')
	}));

	$('#point_bulan_sales').append($('<option>', {
		value: moment().subtract(3, 'months').format('M'),
		text: moment().subtract(3, 'months').format('MMMM')
	}));

	$('#point_bulan_sales').append($('<option>', {
		value: moment().subtract(4, 'months').format('M'),
		text: moment().subtract(4, 'months').format('MMMM')
	}));
}


function getYearPointSj() {
	let startYear = 2010;
	let endYear = new Date().getFullYear();
	for (i = endYear; i > startYear; i--) {
		if (i == endYear) {
			$('.point_years_sj').append($('<option selected />').val(i).html(i));
		} else {
			$('.point_years_sj').append($('<option />').val(i).html(i));
		}
	}
}


function donwloadPoint() {


	jQuery('#karyawan_nama_point').html(localStorage.getItem("karyawan_nama"));

	jQuery.ajax({
		type: 'POST',
		url: "" + BASE_API + "/donwload-point-sj",
		dataType: 'JSON',
		data: {
			month: jQuery('#point_bulan_sales').val(),
			year: jQuery('#point_year_sj').val(),
			lokasi_pabrik: localStorage.getItem("lokasi_pabrik_surat")
		},
		beforeSend: function () {
			app.dialog.preloader('Harap Tunggu');
			$('#point_popup').html("");
		},
		success: function (data) {
			app.dialog.close();
			var point_popup = '';



			var point_popup_total = 0;
			$.each(data.data, function (i, item) {

				if (item.penjualan_jenis.indexOf("HC") != -1) {
					var point = 50;
				} else {
					var point = 50;
				}

				if (item.bantuan_cabang != null) {
					var cabang = item.bantuan_cabang;
				} else {
					var cabang = '-';
				}

				var sisa_kirim_sj = parseFloat(item.penjualan_qty) - parseFloat(data.surat_jalan_count[item.penjualan_detail_performa_id]);


				if (sisa_kirim_sj <= 0) {
					point_popup += '<tr>';
					point_popup += '<td align="left" style=" border-right:1px solid gray; padding:5px; border-bottom:1px solid gray; border-left:1px solid gray;" class="label-cell">' + moment(item.penjualan_tanggal_kirim).format('DD-MMM') + '</td>';
					point_popup += '<td align="left" class="popup-open" data-popup=".detail-penjualan-point-produksi" onclick="detailPenjualanPointProduksi(\'' + item.penjualan_id + '\')" style="border-bottom:1px solid gray; "  ><b>' + moment(item.dt_record).format('DDMMYY') + '-' + item.penjualan_id.replace(/\INV_/g, '').replace(/^0+/, '') + '</b></td>';
					point_popup += '<td align="left"  style="border-right:1px solid gray; border-bottom:1px solid gray; border-left:1px solid gray; " >' + item.client_nama + '<br><div class="detail_sales_data_tooltip_' + item.penjualan_id + '"></div>';
					point_popup += '<td align="left" style="border-right:1px solid gray; border-bottom:1px solid gray;" class="label-cell">' + item.penjualan_jenis + '</td>';

					point_popup += '<td align="right" style="border-right:1px solid gray; border-bottom:1px solid gray;" class="label-cell">' + point + '</td>';
					point_popup += '<td align="right" style="border-right:1px solid gray; border-bottom:1px solid gray;" class="label-cell">' + item.penjualan_qty + '</td>';
					point_popup += '<td align="right" style="border-right:1px solid gray; border-bottom:1px solid gray;" class="label-cell">' + number_format(parseFloat(item.penjualan_qty) * point) + '</td>';

					point_popup += '</tr>';
					point_popup_total += parseFloat(item.penjualan_qty) * point;
				}
			});
			point_popup += '<tr>';
			point_popup += '<td colspan="5"  align="center"><b></b></td>';
			point_popup += '<td align="center" style="border-right:1px solid gray; border-bottom:1px solid gray;border-left:1px solid gray;" class="label-cell"><b>Total</b></td>';
			point_popup += '<td align="right" style="border-right:1px solid gray; border-bottom:1px solid gray;" class="label-cell"><b>' + number_format(point_popup_total) + '</b></td>';
			point_popup += '</tr>';


			$('#point_popup').html(point_popup);
		},
		error: function (xmlhttprequest, textstatus, message) {
		}
	});
}

function downloadPointPdf() {
	jQuery.ajax({
		type: 'POST',
		url: "" + BASE_API + "/donwload-point-sj",
		dataType: 'JSON',
		data: {
			month: jQuery('#point_bulan_sales').val(),
			year: jQuery('#point_year_sj').val(),
			lokasi_pabrik: localStorage.getItem("lokasi_pabrik_surat")
		},
		beforeSend: function () {
			app.dialog.preloader('Harap Tunggu');
		},
		success: function (data) {
			app.dialog.close();
			var point_popup_pdf = '';
			if (localStorage.getItem("lokasi_pabrik_surat") == 'Asia') {
				header_koper = 'PT. ARTHA MAPAN BERSAMA';
				header_web = 'Jl. Raya Perancis No. 2 Komp.Pergudangan Pantai Indah Dadap<br>Blok HD No.8 Kosambi Timur Kec. Kosambi, Kab. Tangerang<br>No. Telp : (021) 5596 3906';
				header_style = 'color:#0066ff;font-size: 36px;';
			} else {
				header_koper = '<b>KOPERINDO</b><br>Industri Tas & Koper';
				header_web = 'www.koperindo.id';
				header_style = '';
			}
			point_popup_pdf += '<table width="100%" border="0">';
			point_popup_pdf += '	<tr>';
			point_popup_pdf += '		<td colspan="7"  align="center" style="' + header_style + '"><b>' + header_koper + '</b></td>';
			point_popup_pdf += '	</tr>';
			point_popup_pdf += '	<tr>';
			point_popup_pdf += '		<td colspan="7" align="center">' + header_web + '';
			point_popup_pdf += '			<hr style:"height:7px;border-top:2px solid black;border-bottom:4px solid black;">';
			point_popup_pdf += '		</td>';
			point_popup_pdf += '	</tr>';
			point_popup_pdf += '<tr>';
			point_popup_pdf += '<td colspan="7"  align="center"><b>Point Surat Jalan | Bulan ' + $("#point_bulan_sales option:selected").text(); + '</b></td>';
			point_popup_pdf += '</tr>';
			point_popup_pdf += '<tr>';
			point_popup_pdf += '	<th class="label-cell" style="border-bottom:1px solid gray; border-left:1px solid gray;  border-top:1px solid gray;" width="13%">Tgl</th>';
			point_popup_pdf += '    <th class="label-cell" style="border-bottom:1px solid gray; border-left:1px solid gray;    border-top:1px solid gray;" width="21%">SPK</th>';
			point_popup_pdf += '    <th class="label-cell" style="border-bottom:1px solid gray; border-left:1px solid gray;    border-top:1px solid gray;" width="27%">Perusahaan</th>';
			point_popup_pdf += '    <th class="label-cell" style="border-bottom:1px solid gray; border-left:1px solid gray;    border-top:1px solid gray;" width="26%">Jenis</th>';
			point_popup_pdf += '    <th class="label-cell" style="border-bottom:1px solid gray; border-left:1px solid gray;   border-top:1px solid gray;" width="7%">Point</th>';
			point_popup_pdf += '    <th class="label-cell" style="border-bottom:1px solid gray; border-left:1px solid gray;  border-top:1px solid gray;" width="9%">Qty</th>';
			point_popup_pdf += '    <th class="label-cell" style="border-bottom:1px solid gray; border-left:1px solid gray;  border-right:1px solid gray;  border-top:1px solid gray;" width="13%">Total</th>';
			point_popup_pdf += '</tr>';
			point_popup_pdf += '</thead>';
			point_popup_pdf += '<tbody>';


			var point = 50;
			var point_popup_total = 0;
			$.each(data.data, function (i, item) {
				if (item.bantuan_cabang != null) {
					var cabang = item.bantuan_cabang;
				} else {
					var cabang = '-';
				}

				var sisa_kirim_sj = parseFloat(item.penjualan_qty) - parseFloat(data.surat_jalan_count[item.penjualan_detail_performa_id]);


				if (sisa_kirim_sj <= 0) {
					point_popup_pdf += '<tr>';
					point_popup_pdf += '<td align="left" style=" border-left:1px solid gray; padding:5px; border-bottom:1px solid gray; border-left:1px solid gray;" class="label-cell">' + moment(item.penjualan_tanggal_kirim).format('DD-MMM') + '</td>';
					point_popup_pdf += '<td align="left" class="popup-open" data-popup=".detail-penjualan-point-produksi" onclick="detailPenjualanPointProduksi(\'' + item.penjualan_id + '\')" style="border-bottom:1px solid gray; "  >' + moment(item.dt_record).format('DDMMYY') + '-' + item.penjualan_id.replace(/\INV_/g, '').replace(/^0+/, '') + '</td>';
					point_popup_pdf += '<td align="left"  style="border-left:1px solid gray; border-bottom:1px solid gray; border-left:1px solid gray; " >' + item.client_nama + '<br><div class="detail_sales_data_tooltip_' + item.penjualan_id + '"></div>';
					point_popup_pdf += '<td align="left" style="border-left:1px solid gray; border-bottom:1px solid gray;" class="label-cell">' + item.penjualan_jenis + '</td>';

					point_popup_pdf += '<td align="right" style="border-left:1px solid gray; border-bottom:1px solid gray;" class="label-cell">' + point + '</td>';
					point_popup_pdf += '<td align="right" style="border-left:1px solid gray; border-bottom:1px solid gray;" class="label-cell">' + item.penjualan_qty + '</td>';
					point_popup_pdf += '<td align="right" style="border-left:1px solid gray;  border-right:1px solid gray; border-bottom:1px solid gray;" class="label-cell">' + number_format(parseFloat(item.penjualan_qty) * point) + '</td>';

					point_popup_pdf += '</tr>';
					point_popup_total += parseFloat(item.penjualan_qty) * point;
				}
			});

			point_popup_pdf += '<tr>';
			point_popup_pdf += '<td colspan="5"  align="center"><b></b></td>';
			point_popup_pdf += '<td align="center" ><b>Total</b></td>';
			point_popup_pdf += '<td align="right" ><b>' + number_format(point_popup_total) + '</b></td>';
			point_popup_pdf += '</tr>';

			point_popup_pdf += '</tbody>';



			point_popup_pdf += '</table>';

			console.log(point_popup_pdf);

			let options = {
				documentSize: 'A4',
				type: 'share',
				fileName: 'report_point_' + moment().format('M') + '.pdf'
			}

			pdf.fromData(point_popup_pdf, options)
				.then((stats) => console.log('status', stats))
				.catch((err) => console.err(err))
		},
		error: function (xmlhttprequest, textstatus, message) {
		}
	})
}


function updateStatusViewKirimSj(penjualan_id, status_view) {
	app.dialog.create({
		title: 'Ubah Status View',
		text: 'Apakah Anda Yakin Ubah Status View SPK ? ',
		cssClass: 'custom-dialog',
		closeByBackdropClick: 'true',
		buttons: [
			{
				text: 'Ya',
				onClick: function () {
					jQuery.ajax({
						type: 'POST',
						url: "" + BASE_API + "/update-status-view-kirim-sj",
						dataType: 'JSON',
						data: {
							penjualan_id: penjualan_id,
							status_view: status_view
						},
						beforeSend: function () {
							app.dialog.preloader('Harap Tunggu');
						},
						success: function (data) {
							app.dialog.close();
							app.popup.close();
							openDialogViewSj();
						},
						error: function (xmlhttprequest, textstatus, message) {
						}
					});
				},
			},
			{
				text: 'Tidak',
				onClick: function () {

				},
			},
		],
	}).open();

}


function openDialogViewSj() {

	var popup;
	jQuery.ajax({
		type: 'POST',
		url: "" + BASE_API + "/get-count-status-view-sj",
		dataType: 'JSON',
		data: {
		},
		beforeSend: function () {
		},
		success: function (data) {
			if (data.data > 0 || data.data_performa > 0 || data.data_kirim > 0 || data.data_prospek > 0) {
				// app.popup.open('.status-view-manager');
				// Create popup

				if (!popup) {
					popup = app.popup.create({
						el: '.status-view-manager',
						closeByBackdropClick: false,
						closeOnEscape: false,
						swipeToClose: false,
					});

					// Open it
					// popup.open();
					// getViewSjKirim(1);
				}
			}

			// if (data.data > 0) {
			// 	$$('#merah-sales').removeClass("card-color-red-important");
			// 	$$('#merah-sales').addClass("card-color-red-important");
			// } else {
			// 	$$('#merah-sales').removeClass("card-color-red-important");
			// }

			if (data.data_kirim > 0) {
				$$('#merah-kirim').removeClass("card-color-red-important");
				$$('#merah-kirim').addClass("card-color-red-important");

			} else {
				$$('#merah-kirim').removeClass("card-color-red-important");
			}


		},
		error: function (xmlhttprequest, textstatus, message) {
		}
	});
}


function getViewSjKirim(page) {

	if (page == '' || page == null) {
		var page_now = 1;

	} else {
		var page_now = page;
	}

	var user_id = ""
	if (jQuery("#sales_id").val() == "" || jQuery("#sales_id").val() == null) {
		user_id = 'empty';
	} else {
		user_id = jQuery("#sales_id").val();
	}

	if (jQuery('#range-penjualan').val() == '' || jQuery('#range-penjualan').val() == null) {
		var startdate = "empty";
		var enddate = "empty";
	} else {
		var startdate_new = new Date(calendarRangePenjualan.value[0]);
		var enddate_new = new Date(calendarRangePenjualan.value[1]);
		var startdate = moment(startdate_new).format('YYYY-MM-DD');
		var enddate = moment(enddate_new).format('YYYY-MM-DD');
	}
	if (jQuery('#perusahaan_penjualan_filter').val() == '' || jQuery('#perusahaan_penjualan_filter').val() == null) {
		perusahaan_penjualan_value = "empty";
	} else {
		perusahaan_penjualan_value = jQuery('#perusahaan_penjualan_filter').val();
	}
	var penjualan_value = "";
	var pagination_button = "";

	jQuery.ajax({
		type: 'POST',
		url: "" + BASE_API + "/get-data-status-view-kirim-sj?page=" + page_now + "",
		dataType: 'JSON',
		data: {
			karyawan_id: user_id,
			startdate: startdate,
			enddate: enddate,
			perusahaan_penjualan_value: perusahaan_penjualan_value,
		},
		beforeSend: function () {
			app.dialog.preloader('Harap Tunggu');
		},
		success: function (data) {
			app.dialog.close();
			no = 1;
			for (i = 0; i < data.data.last_page; i++) {
				no = i + 1;
				pagination_button += '<i onclick="getViewSjKirim(' + no + ');"  style="border-radius:2px; width:40px; height:40px; background-color:#4c5269; padding-left:8px; padding-right:8px; margin:2px;">' + no + '</i>';
			}
			var no_row = 0;
			$.each(data.data.data, function (i, item) {

				var btn_alamat_kirim_penjualan = "";
				var nama_kirim = "";
				if (item.alamat_kirim_penjualan != null) {
					alamat_kirim_penjualan = item.alamat_kirim_penjualan;
					if (item.packing == 'polos') {
						btn_alamat_kirim_penjualan = "btn-color-greenWhite";
					} else if (item.packing == 'plastik') {
						nama_kirim = item.packing;
						btn_alamat_kirim_penjualan = "bg-dark-gray-young text-add-colour-black-soft";
					} else if (item.packing == 'kardus') {
						nama_kirim = item.packing;
						btn_alamat_kirim_penjualan = "card-color-brown";
					}
				} else {
					alamat_kirim_penjualan = "-";
					if (item.packing == 'polos') {
						btn_alamat_kirim_penjualan = "bg-dark-gray-young text-add-colour-black-soft";
					} else if (item.packing == 'plastik') {
						nama_kirim = item.packing;
						btn_alamat_kirim_penjualan = "bg-dark-gray-young text-add-colour-black-soft";
					} else if (item.packing == 'kardus') {
						nama_kirim = item.packing;
						btn_alamat_kirim_penjualan = "card-color-brown";
					}
				}
				if (item.karyawan_id == 13) {
					no_row++
					penjualan_value += '<tr>';
					penjualan_value += '<td align="center" style="border-right:1px solid gray; border-bottom:1px solid gray; border-left:1px solid gray;" class="label-cell">' + no_row + '</td>';
					penjualan_value += '  <td style="border-right:1px solid gray;border-bottom:1px solid gray;"><center><b>' + moment(item.penjualan_tanggal_kirim).format('DD-MMM') + '</b></center></td>';
					penjualan_value += '  <td style="border-bottom:1px solid gray;"><center><b>' + moment(item.dt_record).format('DDMMYY') + '-' + item.penjualan_id.replace(/\INV_/g, '').replace(/^0+/, '') + '</b></center></td>';
					penjualan_value += '<td align="left" style="border-right:1px solid gray; border-bottom:1px solid gray; border-left:1px solid gray;" >' + item.client_nama + '</div>';
					// penjualan_value += '<td align="left" style="border-right:1px solid gray; border-bottom:1px solid gray; border-left:1px solid gray;" >' + item.karyawan_nama + '</div>';


					penjualan_value += '<td style="border-right:1px solid gray; border-bottom:1px solid gray;" class="label-cell">';
					penjualan_value += '   <button  class="' + btn_alamat_kirim_penjualan + ' button-small col button popup-open text-bold" data-popup=".input-alamat-kirim-support-sj" onclick="kirimAlamatSupportSj(\'' + item.penjualan_id + '\');">Kirim</button>';
					penjualan_value += '</td>';
					penjualan_value += '<td style="border-right:1px solid gray; border-bottom:1px solid gray;" class="label-cell">';
					penjualan_value += '   <button  class="text-add-colour-black-soft bg-dark-gray-young button-small col button popup-open text-bold"  onclick="spkPo(\'' + item.penjualan_id_primary + '\',\'' + item.performa_id_relation + '\',\'' + item.performa_id_relation + '\',\'' + item.biaya_kirim + '\',\'' + item.client_alamat + '\',\'' + item.client_cp + '\',\'' + item.client_cp_posisi + '\',\'' + item.client_id + '\',\'' + item.client_kota + '\',\'' + item.client_nama + '\',\'' + item.client_telp + '\',\'' + item.jenis_penjualan + '\',\'' + item.karyawan_id + '\',\'' + item.penjualan_global_diskon + '\',\'' + item.penjualan_grandtotal + '\',\'' + item.penjualan_id + '\',\'' + item.penjualan_jumlah_pembayaran + '\',\'' + item.penjualan_keterangan + '\',\'' + item.penjualan_status + '\',\'' + item.penjualan_status_pembayaran + '\',\'' + item.penjualan_tanggal + '\',\'' + item.penjualan_tanggal_kirim + '\',\'' + item.penjualan_total + '\',\'' + item.penjualan_void_keterangan + '\',\'' + item.penjualan_total_qty + '\',\'' + item.extra + '\');">Spk PO</button>';
					penjualan_value += '</td>';
					penjualan_value += '<td align="center" style="border-right:1px solid gray; border-bottom:1px solid gray;" class="label-cell">';
					penjualan_value += '   <label class="text-add-colour-white"><i style="margin-right:5px;" class="f7-icons" onclick="updateStatusViewKirimSj(\'' + item.penjualan_id + '\',1);">eye</i></label>';
					penjualan_value += '</td>';
					penjualan_value += '</tr>';
				} else {
					if ((item.penjualan_grandtotal - item.penjualan_jumlah_pembayaran) <= 0) {
						no_row++
						penjualan_value += '<tr>';
						penjualan_value += '<td align="center" style="border-right:1px solid gray; border-bottom:1px solid gray; border-left:1px solid gray;" class="label-cell">' + no_row + '</td>';
						penjualan_value += '  <td style="border-right:1px solid gray;border-bottom:1px solid gray;"><center><b>' + moment(item.penjualan_tanggal_kirim).format('DD-MMM') + '</b></center></td>';
						penjualan_value += '  <td style="border-bottom:1px solid gray;"><center><b>' + moment(item.dt_record).format('DDMMYY') + '-' + item.penjualan_id.replace(/\INV_/g, '').replace(/^0+/, '') + '</b></center></td>';
						penjualan_value += '<td align="left" style="border-right:1px solid gray; border-bottom:1px solid gray; border-left:1px solid gray;" >' + item.client_nama + '</div>';
						// penjualan_value += '<td align="left" style="border-right:1px solid gray; border-bottom:1px solid gray; border-left:1px solid gray;" >' + item.karyawan_nama + '</div>';

						penjualan_value += '<td style="border-right:1px solid gray; border-bottom:1px solid gray;" class="label-cell">';
						penjualan_value += '   <button  class="' + btn_alamat_kirim_penjualan + ' button-small col button popup-open text-bold" data-popup=".input-alamat-kirim-support-sj" onclick="kirimAlamatSupportSj(\'' + item.penjualan_id + '\');">Kirim</button>';
						penjualan_value += '</td>';
						penjualan_value += '<td style="border-right:1px solid gray; border-bottom:1px solid gray;" class="label-cell">';
						penjualan_value += '   <button  class="text-add-colour-black-soft bg-dark-gray-young button-small col button popup-open text-bold"  onclick="spkPo(\'' + item.penjualan_id_primary + '\',\'' + item.performa_id_relation + '\',\'' + item.performa_id_relation + '\',\'' + item.biaya_kirim + '\',\'' + item.client_alamat + '\',\'' + item.client_cp + '\',\'' + item.client_cp_posisi + '\',\'' + item.client_id + '\',\'' + item.client_kota + '\',\'' + item.client_nama + '\',\'' + item.client_telp + '\',\'' + item.jenis_penjualan + '\',\'' + item.karyawan_id + '\',\'' + item.penjualan_global_diskon + '\',\'' + item.penjualan_grandtotal + '\',\'' + item.penjualan_id + '\',\'' + item.penjualan_jumlah_pembayaran + '\',\'' + item.penjualan_keterangan + '\',\'' + item.penjualan_status + '\',\'' + item.penjualan_status_pembayaran + '\',\'' + item.penjualan_tanggal + '\',\'' + item.penjualan_tanggal_kirim + '\',\'' + item.penjualan_total + '\',\'' + item.penjualan_void_keterangan + '\',\'' + item.penjualan_total_qty + '\',\'' + item.extra + '\');">Spk PO</button>';
						penjualan_value += '</td>';
						penjualan_value += '<td align="center" style="border-right:1px solid gray; border-bottom:1px solid gray;" class="label-cell">';
						penjualan_value += '   <label class="text-add-colour-white"><i style="margin-right:5px;" class="f7-icons" onclick="updateStatusViewKirimSj(\'' + item.penjualan_id + '\',1);">eye</i></label>';
						penjualan_value += '</td>';
						penjualan_value += '</tr>';
					}
				}

			});

			jQuery('#data_status_view_kirim_manager').html(penjualan_value);

		},
		error: function (xmlhttprequest, textstatus, message) {
		}
	});
}


function spkPo(penjualan_id_primary, performa_id_relation, performa_header_id, biaya_kirim, client_alamat, client_cp, client_cp_posisi, client_id, client_kota, client_nama, client_telp, jenis_penjualan, karyawan_id, penjualan_global_diskon, penjualan_grandtotal, penjualan_id, penjualan_jumlah_pembayaran, penjualan_keterangan, penjualan_status, penjualan_status_pembayaran, penjualan_tanggal, penjualan_tanggal_kirim, penjualan_total, penjualan_void_keterangan, penjualan_total_qty, extra) {
	var invoice_penjualan = '';
	var no_invoice_penjualan = 0;
	var header_koper = "";
	var header_web = "";
	var tipe_grosir = "";

	if (extra != 1) {
		header_koper = 'KOPERINDO';
		header_web = 'www.koperindo.id';
		tipe_grosir = "Xtra"
	} else {
		header_koper = 'INDOKOPER';
		header_web = '';
		tipe_grosir = "Grosir"
	}
	jQuery.ajax({
		type: 'POST',
		url: "" + BASE_API + "/spk-po-manager",
		dataType: 'JSON',
		data: {
			karyawan_id: jQuery("#sales_id").val(),
			performa_header_id: performa_header_id,
			jenis_penjualan: jenis_penjualan,
			penjualan_id_primary: penjualan_id
		},
		beforeSend: function () {
			app.dialog.preloader('Mengambil Data Po');
			invoice_penjualan += '<table width="100%" border="0">';
			invoice_penjualan += '<tr>';
			invoice_penjualan += '		<td colspan="6"  align="center"><b>' + header_koper + '</b><br>Industri Tas & Koper</td>';
			invoice_penjualan += '	</tr>';
			invoice_penjualan += '	<tr>';
			invoice_penjualan += '		<td colspan="6" align="center">' + header_web + '';
			invoice_penjualan += '			<hr>';
			invoice_penjualan += '		</td>';
			invoice_penjualan += '	</tr>';
			invoice_penjualan += '	<tr>';
			invoice_penjualan += '		<td colspan="6" align="center"><h2>SPK</h2><h3 style="color:red;margin-top:-10px">' + tipe_grosir + '</h3></td>';
			invoice_penjualan += '	</tr>';
			invoice_penjualan += '	<tr>';
			invoice_penjualan += '		<td colspan="4" align="left" >Kepada Yth :  ' + client_nama.replace(/\PT. /g, '').replace(/\PT/g, '').replace(/\CV. /g, '').replace(/\CV/g, '').replace(/\UD. /g, '').replace(/\UD/g, '') + ' <br> <font style="padding:94px;">' + client_kota + '</font></td>';
			invoice_penjualan += '		<td colspan="2" align="right">' + moment(penjualan_tanggal).format('DDMMYY') + '-' + penjualan_id.replace(/\INV_/g, '').replace(/^0+/, '') + '</td>';
			invoice_penjualan += '	</tr>';
			invoice_penjualan += '	<tr>';
			invoice_penjualan += '		<td style="border-top: solid 1px; border-left: solid 1px; font-weight:bold;" align="center">No</td>';
			invoice_penjualan += '		<td colspan="2" style="border-top: solid 1px; border-left: solid 1px; font-weight:bold;" align="center">Spesifikasi</td>';
			invoice_penjualan += '		<td style="border-top: solid 1px; border-left: solid 1px; font-weight:bold;" align="center">Qty</td>';
			invoice_penjualan += '		<td style="border-top: solid 1px; border-left: solid 1px; font-weight:bold;" align="center">Price Rp.</td>';
			invoice_penjualan += '		<td style="border-top: solid 1px; border-right: solid 1px; border-left: solid 1px; font-weight:bold;" align="center">Total Rp.</td>';
			invoice_penjualan += '	</tr>';
		},
		success: function (data) {
			app.dialog.close();

			if (data.data.length != 0) {

				var penjualan_total = 0;
				var invest_molding = data.data[0].invest_molding;

				invoice_penjualan += '<tbody>';
				jQuery.each(data.data, function (i, val) {
					if (!val.keterangan) {
						var ket_item = '';
					} else {

						var ket_item = '<font color="red"><br>KET :<br>' + val.keterangan + '</font>';

					}


					if (val.gambar.substring(0, 5) == "koper") {
						var path_image = 'https://tasindo-sale-webservice.digiseminar.id/product_image_new';
					} else {
						var path_image = 'https://tasindo-sale-webservice.digiseminar.id/performa_image';
					}

					invoice_penjualan += '		<tr>';
					invoice_penjualan += '			<td width="5%" class="label-cell text-align-left" style="border-top: solid 1px; border-left: solid 1px; "><center>' + (no_invoice_penjualan += 1) + '</center></td>';
					invoice_penjualan += '			<td width="25%" class="label-cell text-align-left" style="border-top: solid 1px; border-left: solid 1px; "><center>' + val.penjualan_jenis + '<br><img src="' + path_image + '/' + val.gambar + '" width="70%"></center></td>';
					invoice_penjualan += '			<td width="20%" class="label-cell" align="left" style="border-top: solid 1px; white-space: pre;">SPESIFIKASI<br>' + val.produk_keterangan_kustom + '<br>' + ket_item + '</td>';
					invoice_penjualan += '				<td width="10%" class="label-cell" style="border-top: solid 1px; border-left: solid 1px;">';
					invoice_penjualan += '					<center>' + val.penjualan_qty + '</center>';
					invoice_penjualan += '				</td>';
					invoice_penjualan += '				<td width="20%" class="label-cell" style="border-top: solid 1px; border-left: solid 1px;">';
					invoice_penjualan += '					<center>' + number_format(val.penjualan_harga) + '</center>';
					invoice_penjualan += '				</td>';
					invoice_penjualan += '				<td width="20%" colspan="2" class="label-cell text-align-center" style="border-top:  solid 1px; border-right: solid 1px; border-left: solid 1px;">';
					invoice_penjualan += '					<center>' + number_format(val.penjualan_detail_grandtotal) + '</center>';
					invoice_penjualan += '				</td>';
					invoice_penjualan += '			</tr>';

					penjualan_total += parseInt(val.penjualan_detail_grandtotal);
				});
				invoice_penjualan += '</tbody>';
				invoice_penjualan += '		<tr>';
				invoice_penjualan += '			<td colspan="4" style=" border-top: solid 1px; font-weight:bold;" align="right"></td>';
				invoice_penjualan += '			<td colspan="1" style="border-top: solid 1px; border-left: solid 1px; font-weight:bold;" align="left">';
				invoice_penjualan += '				Total';
				invoice_penjualan += '			</td>';
				invoice_penjualan += '			<td colspan="1" style=" border-top: solid 1px; border-left: solid 1px; border-right: solid 1px; font-weight:bold;" align="left">';
				invoice_penjualan += '			<font style="float:right;">' + number_format(penjualan_total) + '</font>';
				invoice_penjualan += '			</td>';
				invoice_penjualan += '		</tr>';
				if (number_format(data.data[0].invest_molding) != 0) {
					invoice_penjualan += '		<tr>';
					invoice_penjualan += '			<td colspan="4" style="font-weight:bold;" align="right"></td>';
					invoice_penjualan += '			<td colspan="1" style="border-top: solid 1px; border-left: solid 1px; font-weight:bold;" align="left">';
					invoice_penjualan += '				Molding';
					invoice_penjualan += '			</td>';
					invoice_penjualan += '			<td colspan="1" style=" border-top: solid 1px; border-left: solid 1px; border-right: solid 1px; font-weight:bold;" align="left">';
					invoice_penjualan += '				 <font style="float:right; ">' + number_format(invest_molding) + '</font>';
					invoice_penjualan += '			</td>';
					invoice_penjualan += '		</tr>';
				}
				if (number_format(data.data[0].pembayaran_1) != 0) {
					invoice_penjualan += '		<tr>';
					invoice_penjualan += '			<td colspan="4" style="  font-weight:bold;" align="right"></td>';
					invoice_penjualan += '			<td colspan="1" style=" border-top: solid 1px; border-left: solid 1px; font-weight:bold;" align="left">';
					invoice_penjualan += '				Deposit';
					invoice_penjualan += '			</td>';
					invoice_penjualan += '			<td colspan="1" style=" border-top: solid 1px; border-left: solid 1px; border-right: solid 1px; font-weight:bold;" align="left">';
					invoice_penjualan += '			<font style="float:right; ">' + number_format(data.data[0].pembayaran_1) + '</font>';
					invoice_penjualan += '			</td>';
					invoice_penjualan += '		</tr>';
				}
				if (number_format(data.data[0].biaya_kirim) != 0) {
					//invoice_penjualan += '		<tr>';
					//invoice_penjualan += '			<td colspan="4" style="font-weight:bold;" align="right"></td>';
					//invoice_penjualan += '			<td colspan="1" style="border-top: solid 1px; border-left: solid 1px; font-weight:bold;" align="left">';
					//invoice_penjualan += '				Biaya Kirim';
					//invoice_penjualan += '			</td>';
					//invoice_penjualan += '			<td colspan="1" style="border-top: solid 1px; border-left: solid 1px; border-right: solid 1px;  font-weight:bold;" align="left">';
					//invoice_penjualan += '			<font style="float:right;">' + number_format(biaya_kirim) + '</font>';
					//invoice_penjualan += '			</td>';
					//invoice_penjualan += '		</tr>';
				}


				invoice_penjualan += '		<tr>';
				invoice_penjualan += '			<td colspan="4" style="font-weight:bold;" align="right"></td>';
				invoice_penjualan += '			<td colspan="1" style="border-top: solid 1px; border-left: solid 1px; border-bottom: solid 1px; font-weight:bold;" align="left">';
				invoice_penjualan += '				Jumlah';
				invoice_penjualan += '			</td>';
				invoice_penjualan += '			<td colspan="1" style=" border-top: solid 1px; border-left: solid 1px; border-right: solid 1px; border-bottom: solid 1px; font-weight:bold;" align="left">';
				if (number_format(data.data[0].pembayaran_1) != 0) {
					invoice_penjualan += '			 <font style="float:right;">' + number_format(parseFloat(penjualan_total) - parseFloat(data.data[0].pembayaran_1)) + '</font>';
				} else {
					invoice_penjualan += '			 <font style="float:right;">' + number_format(parseFloat(penjualan_total)) + '</font>';

				}
				invoice_penjualan += '			</td>';
				invoice_penjualan += '		</tr>'

				invoice_penjualan += '		<tr>';
				invoice_penjualan += '			<td colspan="5"></td>';
				invoice_penjualan += '		</tr>';
				invoice_penjualan += '	</table>';

				invoice_penjualan += '	<table width="100%" border="0">';
				invoice_penjualan += '      <tr>';
				invoice_penjualan += '          <td style="border-top: solid 1px; border-left: solid 1px; border-right: solid 1px; border-bottom: solid 1px; font-weight:bold;" width="33%" align="center">Logo Emblem</td>';
				invoice_penjualan += '          <td style="border-top: solid 1px; border-right: solid 1px; border-bottom: solid 1px; font-weight:bold;" width="34%" align="center">Logo Bordir</td>';
				invoice_penjualan += '          <td style="border-top: solid 1px;  border-right: solid 1px; border-bottom: solid 1px; font-weight:bold;" width="33%" align="center">Logo Tambah</td>';
				invoice_penjualan += '      </tr>';
				invoice_penjualan += '      <tr>';
				invoice_penjualan += '          <td style=" border-left: solid 1px; border-right: solid 1px; border-bottom: solid 1px; font-weight:bold;" width="33%" align="center"><img src="https://tasindo-sale-webservice.digiseminar.id/customer_logo/' + data.data[0].customer_logo + '" width="80%" /></td>';

				if (data.data[0].customer_logo_bordir != "") {
					invoice_penjualan += '          <td style=" border-right: solid 1px; border-bottom: solid 1px; font-weight:bold;" width="33%" align="center"><img src="https://tasindo-sale-webservice.digiseminar.id/customer_logo/' + data.data[0].customer_logo_bordir + '" width="80%" /> </td>';
				} else {
					invoice_penjualan += '          <td style=" border-right: solid 1px; border-bottom: solid 1px; font-weight:bold;" width="33%" align="center">Tidak Ada Gambar</td>';

				}

				if (data.data[0].customer_logo_tambahan != "") {
					invoice_penjualan += '          <td style=" border-right: solid 1px; border-bottom: solid 1px; font-weight:bold;" width="33%" align="center"><img src="https://tasindo-sale-webservice.digiseminar.id/customer_logo/' + data.data[0].customer_logo_tambahan + '" width="80%" /> </td>';
				} else {
					invoice_penjualan += '          <td style=" border-right: solid 1px; border-bottom: solid 1px; font-weight:bold;" width="33%" align="center">Tidak Ada Gambar</td>';

				}

				invoice_penjualan += '      </tr>';
				invoice_penjualan += '	</table>';



			}


			let options = {
				documentSize: 'A4',
				type: 'share',
				fileName: 'report_' + client_nama + '.pdf'
			}

			pdf.fromData(invoice_penjualan, options)
				.then((stats) => console.log('status', stats))
				.catch((err) => console.err(err))

			console.log(invoice_penjualan);
		},
		error: function (xmlhttprequest, textstatus, message) {
		}
	});
}



function editDetailOwnerPenjualanProses() {
	if (!$$('#edit_penjualan_detail_manager_form')[0].checkValidity()) {
		app.dialog.alert('Cek Isian Form Anda');
	} else {
		var formData = new FormData(jQuery("#edit_penjualan_detail_manager_form")[0]);
		formData.append('penjualan_id', $('#penjualan_id_edit_2').val());
		jQuery.ajax({
			type: 'POST',
			url: "" + BASE_API + "/edit-detail-manager-penjualan-proses",
			dataType: 'JSON',
			data: formData,
			contentType: false,
			processData: false,
			beforeSend: function () {
				app.dialog.preloader('Harap Tunggu');
			},
			success: function (data) {
				app.dialog.close();
				$("#color_penjualan_edit_1").css("display", "none");
				$("#gambar_penjualan_edit_1").css("display", "none");
				$('#backbutton_owner').click();
				$('#edit_penjualan_detail_manager_form')[0].reset();
				getDetailPenjualanOwner($('#penjualan_id_edit_2').val());
				getPenjualanHeader(1);
			},
			error: function (xmlhttprequest, textstatus, message) {
			}
		});
	}
}

function hapusDetailPenjualanOwner(penjualan_detail_performa_id_hapus, penjualan_id_hapus) {
	app.dialog.create({
		title: 'Hapus Client',
		text: 'Apakah Anda Yakin Menghapus Item Penjualan ini ? ',
		cssClass: 'custom-dialog',
		closeByBackdropClick: 'true',
		buttons: [
			{
				text: 'Ya',
				onClick: function () {
					jQuery.ajax({
						type: 'POST',
						url: "" + BASE_API + "/hapus-detail-penjualan-manager",
						dataType: 'JSON',
						data: {
							penjualan_detail_performa_id_hapus: penjualan_detail_performa_id_hapus,
							penjualan_id_hapus: penjualan_id_hapus
						},
						beforeSend: function () {
							app.dialog.preloader('Harap Tunggu');
						},
						success: function (data) {
							app.dialog.close();
							getDetailPenjualanOwner(penjualan_id_hapus);
							getPenjualanHeader(1);

						},
						error: function (xmlhttprequest, textstatus, message) {
						}
					});
				},
			},
			{
				text: 'Tidak',
				onClick: function () {

				},
			},
		],
	}).open();
}


function getViewSalesSj(page) {

	if (page == '' || page == null) {
		var page_now = 1;

	} else {
		var page_now = page;
	}

	var user_id = ""
	if (jQuery("#sales_id").val() == "" || jQuery("#sales_id").val() == null) {
		user_id = 'empty';
	} else {
		user_id = jQuery("#sales_id").val();
	}

	if (jQuery('#range-penjualan').val() == '' || jQuery('#range-penjualan').val() == null) {
		var startdate = "empty";
		var enddate = "empty";
	} else {
		var startdate_new = new Date(calendarRangePenjualan.value[0]);
		var enddate_new = new Date(calendarRangePenjualan.value[1]);
		var startdate = moment(startdate_new).format('YYYY-MM-DD');
		var enddate = moment(enddate_new).format('YYYY-MM-DD');
	}
	if (jQuery('#perusahaan_penjualan_filter').val() == '' || jQuery('#perusahaan_penjualan_filter').val() == null) {
		perusahaan_penjualan_value = "empty";
	} else {
		perusahaan_penjualan_value = jQuery('#perusahaan_penjualan_filter').val();
	}
	var penjualan_value = "";
	var pagination_button = "";

	jQuery.ajax({
		type: 'POST',
		url: "" + BASE_API + "/get-data-status-view-notif-sj?page=" + page_now + "",
		dataType: 'JSON',
		data: {
			karyawan_id: user_id,
			startdate: startdate,
			enddate: enddate,
			perusahaan_penjualan_value: perusahaan_penjualan_value,
		},
		beforeSend: function () {
			app.dialog.preloader('Harap Tunggu');
		},
		success: function (data) {
			app.dialog.close();
			no = 1;
			for (i = 0; i < data.data.last_page; i++) {
				no = i + 1;
				pagination_button += '<i onclick="getViewManager(' + no + ');"  style="border-radius:2px; width:40px; height:40px; background-color:#4c5269; padding-left:8px; padding-right:8px; margin:2px;">' + no + '</i>';
			}
			var no_row = 0;
			jQuery.each(data.data.data, function (i, item) {
				no_row++
				var wilayah = "";
				var nama_kota = "";
				if (item.wilayah_header == null) {
					wilayah = '-';
				} else {
					wilayah = item.wilayah_header;
				}
				if (item.nama_kota == null) {
					nama_kota = '-';
				} else {
					nama_kota = item.nama_kota;
				}
				penjualan_value += '<tr>';
				penjualan_value += '<td align="center" style="border-right:1px solid gray; border-bottom:1px solid gray; border-left:1px solid gray;" class="label-cell">' + no_row + '</td>';
				penjualan_value += '<td style="border-bottom:1px solid gray; "  ><center><b>' + moment(item.dt_record).format('DDMMYY') + '-' + item.penjualan_id.replace(/\INV_/g, '').replace(/^0+/, '') + '</b></center></td>';
				penjualan_value += '<td align="left" style="border-right:1px solid gray; border-bottom:1px solid gray; border-left:1px solid gray;" >' + item.client_nama + '</td>';
				penjualan_value += '<td align="left" style="border-right:1px solid gray; border-bottom:1px solid gray; border-left:1px solid gray;" >' + item.karyawan_nama + '</td>';
				penjualan_value += '<td style="border-right:1px solid gray; border-bottom:1px solid gray;" class="label-cell">';
				penjualan_value += '   <button  class="text-add-colour-black-soft bg-dark-gray-young button-small col button popup-open text-bold"  onclick="spkPo(\'' + item.penjualan_id_primary + '\',\'' + item.performa_id_relation + '\',\'' + item.performa_id_relation + '\',\'' + item.biaya_kirim + '\',\'' + item.client_alamat + '\',\'' + item.client_cp + '\',\'' + item.client_cp_posisi + '\',\'' + item.client_id + '\',\'' + item.client_kota + '\',\'' + item.client_nama + '\',\'' + item.client_telp + '\',\'' + item.jenis_penjualan + '\',\'' + item.karyawan_id + '\',\'' + item.penjualan_global_diskon + '\',\'' + item.penjualan_grandtotal + '\',\'' + item.penjualan_id + '\',\'' + item.penjualan_jumlah_pembayaran + '\',\'' + item.penjualan_keterangan + '\',\'' + item.penjualan_status + '\',\'' + item.penjualan_status_pembayaran + '\',\'' + item.penjualan_tanggal + '\',\'' + item.penjualan_tanggal_kirim + '\',\'' + item.penjualan_total + '\',\'' + item.penjualan_void_keterangan + '\',\'' + item.penjualan_total_qty + '\',\'' + item.extra + '\');">Spk PO</button>';
				penjualan_value += '</td>';
				// penjualan_value += '<td align="left" style="border-right:1px solid gray; border-bottom:1px solid gray; border-left:1px solid gray;" >' + nama_kota + '</td>';
				penjualan_value += '<td align="left" style="border-right:1px solid gray; border-bottom:1px solid gray; border-left:1px solid gray;" >' + wilayah + '</td>';
				// penjualan_value += '<td style="border-right:1px solid gray; border-bottom:1px solid gray;" class="label-cell">';
				// penjualan_value += '   <button  class="text-add-colour-black-soft bg-dark-gray-young button-small col button popup-open text-bold" data-popup=".edit-penjualan" onclick="editPenjualan(\'' + item.penjualan_id + '\',\'' + item.penjualan_tanggal + '\',\'' + item.penjualan_tanggal_kirim + '\',\'' + item.client_id + '\',\'' + item.karyawan_id + '\',\'' + item.client_nama + '\',\'' + item.performa_header_id + '\');">Edit</button>';
				// penjualan_value += '</td>';
				penjualan_value += '<td align="center" style="border-right:1px solid gray; border-bottom:1px solid gray;" class="label-cell">';
				penjualan_value += '   <label class="text-add-colour-white"><i style="margin-right:5px;" class="f7-icons" onclick="updateStatusViewSalesSj(\'' + item.penjualan_id + '\',1);">eye</i></label>';
				penjualan_value += '</td>';
				penjualan_value += '</tr>';
			});

			jQuery('#data_status_view_manager').html(penjualan_value);

		},
		error: function (xmlhttprequest, textstatus, message) {
		}
	});
}

function updateStatusViewSalesSj(penjualan_id, status_view) {
	jQuery.ajax({
		type: 'POST',
		url: "" + BASE_API + "/update-status-view-notif-sj",
		dataType: 'JSON',
		data: {
			penjualan_id: penjualan_id,
			status_view: status_view
		},
		beforeSend: function () {
			app.dialog.preloader('Harap Tunggu');
		},
		success: function (data) {
			app.dialog.close();
			app.popup.close();
			openDialogViewSj();
		},
		error: function (xmlhttprequest, textstatus, message) {
		}
	});
}

function editPenjualan(penjualan_id, penjualan_tanggal, penjualan_tanggal_kirim, client_id, karyawan_id, client_nama, performa) {
	localStorage.setItem("penjualan_id", penjualan_id);
	localStorage.setItem("performa", performa);
	$('#id_penjualan_edit').val(penjualan_id);
	$('#penjualan_tanggal_edit').val(moment(penjualan_tanggal).format('YYYY-MM-DD'));
	$('#penjualan_tanggal_kirim_edit').val(moment(penjualan_tanggal_kirim).format('YYYY-MM-DD'));
	getClientEditPenjualan(client_id, client_nama);
	getDetailPenjualanOwner(penjualan_id);

}

function getClientEditPenjualan(client_id, client_nama) {
	jQuery.ajax({
		type: "POST",
		url: "" + BASE_API + "/get-client-owner",
		dataType: "JSON",
		data: {
			user_id: localStorage.getItem("user_id")
		},
		beforeSend: function () {
			app.dialog.preloader('Harap Tunggu');
		},
		success: function (data) {
			app.dialog.close();
			var select_box_client_id;
			jQuery.each(data.data, function (i, val) {
				if (client_id == val.client_id) {
					select_box_client_id += '<option selected value="' + val.client_id + '">' + val.client_nama + ' | ' + val.client_kota + '</option>';
				} else {
					select_box_client_id += '<option value="' + val.client_id + '">' + val.client_nama + ' | ' + val.client_kota + '</option>';
				}

				if (client_id == val.client_id) {
					$$('.item-title-edit-penjualan').html(val.client_nama + ' | ' + val.client_kota);
				}
			});
			$$('#client_id_edit_penjualan').html(select_box_client_id);
		}
	});

}


function getDetailPenjualanOwner(penjualan_id) {
	jQuery.ajax({
		type: "POST",
		url: "" + BASE_API + "/get-detail-penjualan-owner",
		dataType: "JSON",
		data: {
			penjualan_id: penjualan_id
		},
		beforeSend: function () {
		},
		success: function (data) {
			var detail_penjualan_val = "";
			jQuery.each(data.data, function (i, item) {
				detail_penjualan_val += '<tr>';

				detail_penjualan_val += '<td align="left" class="label-cell" style="border-bottom :1px solid gray; border-left :1px solid gray;" width="20%">' + item.penjualan_jenis + '</td>';
				detail_penjualan_val += '<td align="left" class="label-cell" style="border-bottom :1px solid gray; border-left :1px solid gray;" width="7%">' + item.penjualan_qty + '</td>';
				detail_penjualan_val += '<td align="left" class="label-cell" style="border-bottom :1px solid gray; border-left :1px solid gray;" width="15%">' + number_format(item.penjualan_harga) + '</td>';
				detail_penjualan_val += '<td align="left" class="label-cell" style="border-bottom :1px solid gray; border-left :1px solid gray;" width="15%">' + number_format(item.penjualan_detail_grandtotal) + '</td>';
				detail_penjualan_val += '<td style="border-right:1px solid gray; border-bottom:1px solid gray;" class="label-cell" width="8%">';
				detail_penjualan_val += '   <button  class="text-add-colour-black-soft bg-dark-gray-young button-small col button text-bold popup-open" data-popup=".edit-detail-manager-penjualan"  onclick="editDetailOwnerPenjualan(\'' + item.penjualan_detail_performa_id + '\');">Edit</button>';
				detail_penjualan_val += '</td>';
				detail_penjualan_val += '<td style="border-right:1px solid gray; border-bottom:1px solid gray;" class="label-cell" width="8%">';
				detail_penjualan_val += '   <button  class="text-add-colour-black-soft bg-dark-gray-young button-small col button text-bold popup-open"   onclick="hapusDetailPenjualanOwner(\'' + item.penjualan_detail_performa_id + '\',\'' + item.penjualan_id + '\');">Hapus</button>';
				detail_penjualan_val += '</td>';
				detail_penjualan_val += '</tr>';

			});
			$$('#detail_penjualan_val').html(detail_penjualan_val);

		}
	});

}


function editDetailOwnerPenjualan(penjualan_detail_performa_id) {
	jQuery('#penjualan_harga_edit').mask('000,000,000,000', { reverse: true });
	jQuery('#penjualan_detail_grandtotal_edit').mask('000,000,000,000', { reverse: true });

	jQuery('#jenis_edit').val("");
	jQuery('#penjualan_id_edit_2').val("");
	jQuery('#penjualan_detail_performa_id_edit').val("");
	jQuery('#penjualan_qty_edit').val("");
	jQuery('#penjualan_harga_edit').val("");
	jQuery('#penjualan_detail_grandtotal_edit').val("");
	jQuery('#produk_keterangan_custom_edit').val("");
	jQuery('#keterangan_edit').val("");

	jQuery.ajax({
		type: 'POST',
		url: "" + BASE_API + "/edit-detail-owner-penjualan-notif-produksi",
		dataType: 'JSON',
		data: {
			penjualan_detail_performa_id: penjualan_detail_performa_id
		},
		beforeSend: function () {
			app.dialog.preloader('Harap Tunggu');
		},
		success: function (data) {
			app.dialog.close();
			jQuery('#jenis_edit_popup').val(data.data.penjualan_jenis);
			jQuery('#penjualan_id_edit_2').val(data.data.penjualan_id);
			jQuery('#penjualan_detail_performa_id_edit').val(data.data.penjualan_detail_performa_id);
			jQuery('#penjualan_qty_edit').val(data.data.penjualan_qty);
			jQuery('#penjualan_harga_edit').val(number_format(data.data.penjualan_harga));
			jQuery('#penjualan_detail_grandtotal_edit').val(number_format(data.data.penjualan_qty * data.data.penjualan_harga));

			if (data.data.produk_keterangan_kustom != null) {
				jQuery('#produk_keterangan_custom_edit').val(data.data.produk_keterangan_kustom);
			} else {
				jQuery('#produk_keterangan_custom_edit').val("");
			}
			if (data.data.keterangan != null) {
				jQuery('#keterangan_edit').val(data.data.keterangan);
			} else {
				jQuery('#keterangan_edit').val("");
			}
		},
		error: function (xmlhttprequest, textstatus, message) {
		}
	});
}

// Tambah Penjualan
function doSearchByTypeTambahPopup(text) {
	clearTimeout(delayTimer);
	delayTimer = setTimeout(function () {
		var tipe = jQuery('#jenis_tambah_popup').val();
		getKatalogTambahPopup(tipe);
	}, 2000);
}

function getKatalogTambahPopup(tipe) {
	if (tipe == "") {
		$$('#gambar_penjualan_tambah_1').css("display", "initial");
		$$('#color_penjualan_tambah_1').css("display", "none");
		$$('#type_penjualan_tambah_1').removeClass('col-100');
		$$('#type_penjualan_tambah_1').addClass('col-70');
	} else {
		var count = 1;
		jQuery.ajax({
			type: 'POST',
			url: "" + BASE_API + "/get-produk-proforma",
			dataType: 'JSON',
			data: {
				jenis_1: tipe.substr(3, 3)
			},
			beforeSend: function () {
				app.dialog.preloader('Harap Tunggu');
			},
			success: function (data) {
				app.dialog.close();

				if (tipe.indexOf("HCC") != -1) {
					$$('#gambar_penjualan_tambah_1').css("display", "initial");
					$$('#color_penjualan_tambah_1').css("display", "none");
					$$('#type_penjualan_tambah_1').removeClass('col-100');
					$$('#type_penjualan_tambah_1').addClass('col-70');
					$$('#file_tambah_1').prop('required', true)
					$$('#file_tambah_1').prop('validate', true)
				} else if (tipe.indexOf("HC") != -1) {
					if (tipe.length >= 9) {
						if (data.data.length != 0) {
							$("#openPopupTambah_1").click();
							getKatalogPopupTambah(tipe.substr(3, 3));
							$$('#color_penjualan_tambah_1').css("display", "none");
							$$('#gambar_penjualan_tambah_1').css("display", "none");
							$$('#file_tambah_1').prop('required', false)
							$$('#file_tambah_1').prop('validate', false)
						} else {
							app.dialog.alert('Tidak Ada HC Dengan Tipe Ini');
							$$('#color_penjualan_tambah_1').css("display", "none");
							$$('#gambar_penjualan_tambah_1').css("display", "none");
							$$('#file_tambah_1').prop('required', false)
							$$('#file_tambah_1').prop('validate', false)
						}
					} else {
						app.dialog.alert('Panjang Huruf Tipe HC 9 Digit, Contoh : (HC-112.18)');
						$$('#gambar_penjualan_tambah_1').css("display", "initial");
						$$('#color_penjualan_tambah_1').css("display", "none");
						$$('#type_penjualan_tambah_1').removeClass('col-100');
						$$('#type_penjualan_tambah_1').addClass('col-70');
						$$('#jenis_tambah_popup').val("");
						$$('#file_tambah_1').prop('required', true)
						$$('#file_tambah_1').prop('validate', true)

					}
				} else {
					$$('#gambar_penjualan_tambah_1').css("display", "initial");
					$$('#color_penjualan_tambah_1').css("display", "none");
					$$('#type_penjualan_tambah_1').removeClass('col-100');
					$$('#type_penjualan_tambah_1').addClass('col-70');
					$$('#file_tambah_1').prop('required', true)
					$$('#file_tambah_1').prop('validate', true)
				}


			},
			error: function (xmlhttprequest, textstatus, message) {
			}
		});
	}
}

function getKatalogPopupTambah(tipe) {
	var katalog_data = '';
	jQuery.ajax({
		type: 'POST',
		url: "" + BASE_API + "/get-produk-proforma",
		dataType: 'JSON',
		data: {
			jenis_1: tipe
		},
		beforeSend: function () {
			app.dialog.preloader('Harap Tunggu');
		},
		success: function (data) {
			$.each(data.data, function (i, item) {

				katalog_data += '<div class="col-50" style="margin:4px;">';
				katalog_data += '<div class="text-bold block-title text-align-center" style="background-color:white; color:black;  padding:-20px; margin: 0px;  border-radius:14px;">';
				katalog_data += '   <img onclick="fillPenjualanTambahPopup(\'' + item.produk_detail_id + '\',\'' + item.produk_grup_warna + '\',\'' + item.produk_id + '\');" src="' + BASE_PATH_IMAGE_PRODUCT_NEW + '/' + item.foto_depan + '" height="100%" width="100%" />';
				katalog_data += '  <h3 style="margin-top:2px;margin-bottom:5px;">' + item.produk_id + '</h3>';
				katalog_data += '  <h3 style="margin-top:2px;margin-bottom:5px;">' + item.nama_warna + '</h3>';
				katalog_data += ' <div style="margin-left:auto;margin-right:auto;">';
				katalog_data += '  <div style="margin-left:auto;margin-right:auto;margin-bottom:10px;width:100px;height:20px;background-color:' + item.produk_grup_warna + '"></div>';
				katalog_data += ' </div>';
				katalog_data += '</div>';
				katalog_data += ' </div>';

			});

			app.dialog.close();
			jQuery('#katalog_data_tambah').html(katalog_data);
		},
		error: function (xmlhttprequest, textstatus, message) {
		}
	});
}

function fillPenjualanTambahPopup(produk_detail_id, produk_grup_warna, produk_id) {

	$("#close-katalog-popup-tambah").click();
	$$('#color_penjualan_tambah_1').css("display", "inline");
	$$('#type_penjualan_tambah_1').removeClass('col-100');
	$$('#type_penjualan_tambah_1').addClass('col-70');

	$$('#color_tambah_popup_1').html('<div id="penjualan_color_tambah_popup_1" data-color="' + produk_grup_warna + '" style="margin:5px;text-align:center;height:25px;background-color:' + produk_grup_warna + '"></div>');
	$$('#penjualan_produk_detail_tambah_id_1').val(produk_detail_id);
	$$('#penjualan_produk_tambah_id_1').val(produk_id);
	// $$('#jenis_1').val(produk_id);

}

function gambarPenjualanTambahPopup(penjualan_table_id) {
	if (jQuery('#file_tambah_' + penjualan_table_id + '').val() == '' || jQuery('#file_tambah_' + penjualan_table_id + '').val() == null) {
		$$('#value_penjualan_tambah_' + penjualan_table_id + '').html('Gambar');
	} else {
		$$('#value_penjualan_tambah_' + penjualan_table_id + '').html($$('#file_tambah_' + penjualan_table_id + '').val().replace('fakepath', ''));
	}
}


function tambaHeaderPenjualanProses() {
	var formData = new FormData(jQuery("#tambah_header_penjualan_popup")[0]);
	formData.append('penjualan_id', localStorage.getItem("penjualan_id"));
	formData.append('performa', localStorage.getItem("penjualan_id"));
	if (localStorage.getItem("internet_koneksi") == 'fail') {
		app.dialog.alert('<font style="font-size:22px; color:white; font-weight:bold;">Gagal,Internet Tidak Stabil,Box Koneksi Harus Berwarna Hijau', function () {

		});
	} else {
		if (!$$('#tambah_header_penjualan_popup')[0].checkValidity()) {
			app.dialog.alert('Cek Isi Form Anda');
		} else {

			jQuery.ajax({
				type: 'POST',
				url: "" + BASE_API + "/tambah-penjualan-proses",
				dataType: 'JSON',
				data: formData,
				contentType: false,
				processData: false,
				beforeSend: function () {
					app.dialog.preloader('Harap Tunggu');
				},
				success: function (data) {
					app.dialog.close();
					$("#color_penjualan_tambah_1").css("display", "none");
					$("#gambar_penjualan_tambah_1").css("display", "none");
					$('#back_button_tambah_penjualan').trigger('click');
					$('#tambah_header_penjualan_popup')[0].reset();
					getDetailPenjualanOwner(localStorage.getItem("penjualan_id"));
					getPenjualanHeader(1);
				},
				error: function (xmlhttprequest, textstatus, message) {
				}
			});
		}
	}
}

//edit

function doSearchByTypeEdit(text) {
	clearTimeout(delayTimer);
	delayTimer = setTimeout(function () {
		var tipe = jQuery('#jenis_edit_popup').val();
		getKatalogEdit(tipe);
	}, 2000);
}
function getKatalogEdit(tipe) {
	if (tipe == "") {
		$$('#gambar_penjualan_input_1').css("display", "initial");
		$$('#color_penjualan_input_1').css("display", "none");
		$$('#type_penjualan_input_1').removeClass('col-100');
		$$('#type_penjualan_input_1').addClass('col-70');
	} else {
		var count = 1;
		jQuery.ajax({
			type: 'POST',
			url: "" + BASE_API + "/get-produk-proforma",
			dataType: 'JSON',
			data: {
				jenis_1: tipe.substr(3, 3)
			},
			beforeSend: function () {
				app.dialog.preloader('Harap Tunggu');
			},
			success: function (data) {
				app.dialog.close();

				if (tipe.indexOf("HCC") != -1) {
					$$('#gambar_penjualan_edit_1').css("display", "initial");
					$$('#color_penjualan_edit_1').css("display", "none");
					$$('#type_penjualan_edit_1').removeClass('col-100');
					$$('#type_penjualan_edit_1').addClass('col-70');
					$$('#file_edit_1').prop('required', true)
					$$('#file_edit_1').prop('validate', true)
				} else if (tipe.indexOf("HC") != -1) {
					if (tipe.length >= 9) {
						if (data.data.length != 0) {
							$("#openPopupEdit_1").click();
							getKatalogPopupEdit(tipe.substr(3, 3));
							$$('#color_penjualan_edit_1').css("display", "none");
							$$('#gambar_penjualan_edit_1').css("display", "none");
							$$('#file_edit_1').prop('required', false)
							$$('#file_edit_1').prop('validate', false)
						} else {
							app.dialog.alert('Tidak Ada HC Dengan Tipe Ini');
							$$('#color_penjualan_edit_1').css("display", "none");
							$$('#gambar_penjualan_edit_1').css("display", "none");
							$$('#file_edit_1').prop('required', false)
							$$('#file_edit_1').prop('validate', false)
						}
					} else {
						app.dialog.alert('Panjang Huruf Tipe HC 9 Digit, Contoh : (HC-112.18)');
						$$('#gambar_penjualan_edit_1').css("display", "initial");
						$$('#color_penjualan_edit_1').css("display", "none");
						$$('#type_penjualan_edit_1').removeClass('col-100');
						$$('#type_penjualan_edit_1').addClass('col-70');
						$$('#jenis_edit_popup').val("");
						$$('#file_edit_1').prop('required', true)
						$$('#file_edit_1').prop('validate', true)

					}
				} else {
					$$('#gambar_penjualan_edit_1').css("display", "initial");
					$$('#color_penjualan_edit_1').css("display", "none");
					$$('#type_penjualan_edit_1').removeClass('col-100');
					$$('#type_penjualan_edit_1').addClass('col-70');
					$$('#file_edit_1').prop('required', true)
					$$('#file_edit_1').prop('validate', true)
				}


			},
			error: function (xmlhttprequest, textstatus, message) {
			}
		});
	}
}

function getKatalogPopupEdit(tipe) {
	var katalog_data = '';
	jQuery.ajax({
		type: 'POST',
		url: "" + BASE_API + "/get-produk-proforma",
		dataType: 'JSON',
		data: {
			jenis_1: tipe
		},
		beforeSend: function () {
			app.dialog.preloader('Harap Tunggu');
		},
		success: function (data) {
			$.each(data.data, function (i, item) {

				katalog_data += '<div class="col-50" style="margin:4px;">';
				katalog_data += '<div class="text-bold block-title text-align-center" style="background-color:white; color:black;  padding:-20px; margin: 0px;  border-radius:14px;">';
				katalog_data += '   <img onclick="fillPenjualanEdit(\'' + item.produk_detail_id + '\',\'' + item.produk_grup_warna + '\',\'' + item.produk_id + '\');" src="' + BASE_PATH_IMAGE_PRODUCT_NEW + '/' + item.foto_depan + '" height="100%" width="100%" />';
				katalog_data += '  <h3 style="margin-top:2px;margin-bottom:5px;">' + item.produk_id + '</h3>';
				katalog_data += '  <h3 style="margin-top:2px;margin-bottom:5px;">' + item.nama_warna + '</h3>';
				katalog_data += ' <div style="margin-left:auto;margin-right:auto;">';
				katalog_data += '  <div style="margin-left:auto;margin-right:auto;margin-bottom:10px;width:100px;height:20px;background-color:' + item.produk_grup_warna + '"></div>';
				katalog_data += ' </div>';
				katalog_data += '</div>';
				katalog_data += ' </div>';

			});

			app.dialog.close();
			jQuery('#katalog_data_edit').html(katalog_data);
		},
		error: function (xmlhttprequest, textstatus, message) {
		}
	});
}

function fillPenjualanEdit(produk_detail_id, produk_grup_warna, produk_id) {

	$("#close-katalog-popup-edit").click();
	$$('#color_penjualan_edit_1').css("display", "inline");
	$$('#type_penjualan_edit_1').removeClass('col-100');
	$$('#type_penjualan_edit_1').addClass('col-70');

	$$('#color_edit_1').html('<div id="penjualan_color_edit_1" data-color="' + produk_grup_warna + '" style="margin:5px;text-align:center;height:25px;background-color:' + produk_grup_warna + '"></div>');
	$$('#penjualan_produk_detail_edit_id_1').val(produk_detail_id);
	$$('#penjualan_produk_id_edit_1').val(produk_id);
	// $$('#jenis_1').val(produk_id);

}

function gambarPenjualanEdit(penjualan_id) {
	if (jQuery('#file_edit_' + penjualan_id + '').val() == '' || jQuery('#file_edit_' + penjualan_id + '').val() == null) {
		$$('#value_penjualan_edit_' + penjualan_id + '').html('Gambar');
	} else {
		$$('#value_penjualan_edit_' + penjualan_id + '').html($$('#file_edit_' + penjualan_id + '').val().replace('fakepath', ''));
	}
}