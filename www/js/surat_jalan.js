// ========================================
// KATEGORI 1: FUNGSI PENGAMBILAN DATA
// ========================================

function getSuratJalanProduksi() {
	jQuery.ajax({
		type: 'POST',
		url: BASE_API + "/get-surat-jalan-produksi",
		dataType: 'JSON',
		data: {
			karyawan_id: localStorage.getItem("user_id"),
			lokasi_pabrik: localStorage.getItem("lokasi_pabrik_surat")
		},
		beforeSend: function () {
		},
		success: function (data) {
			var data_produksi = '';

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

function detailPenjualanProduksiSj(penjualan_id) {
	detail_sales_data = '';
	jQuery.ajax({
		type: 'POST',
		url: BASE_API + "/get-penjualan-detail-performa",
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


// ========================================
// KATEGORI 2: FUNGSI FORM UTILITIES
// ========================================

function SJValue() {
	jQuery('#no_surat_jalan').val('SJ_');
}

function SJEmptyValue(id) {
	jQuery('#jumlah_' + id + '').val('');
}

function doSearchByTypeEdit(text) {
	clearTimeout(delayTimer);
	delayTimer = setTimeout(function () {
		var tipe = jQuery('#jenis_edit_popup').val();
		getKatalogEdit(tipe);
	}, 2000);
}


// ========================================
// KATEGORI 3: FUNGSI RETUR
// ========================================

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
		$$(".input2").removeAttr("required");
		jQuery('#kode_retur1').val('');
		jQuery('#tanggal_retur1').html('');
		jQuery('#penerima1').val('');
		jQuery('#ket_retur1').val('');
		jQuery('#retur_qty1').val('');
		$$('#kode_retur1').removeAttr('readonly');
		$$('#tanggal_retur1').removeAttr('readonly');
		$$('#penerima1').removeAttr('readonly');
		$$('#ket_retur1').removeAttr('readonly');
		$$('#retur_qty1').removeAttr('readonly');
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
		$$(".input3").removeAttr("required");
		jQuery('#kode_retur2').val('');
		jQuery('#tanggal_retur2').html('');
		jQuery('#penerima2').val('');
		jQuery('#ket_retur2').val('');
		jQuery('#retur_qty2').val('');
		$$('#kode_retur2').removeAttr('readonly');
		$$('#tanggal_retur2').removeAttr('readonly');
		$$('#penerima2').removeAttr('readonly');
		$$('#ket_retur2').removeAttr('readonly');
		$$('#retur_qty2').removeAttr('readonly');
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
		$$(".input4").removeAttr("required");
		jQuery('#kode_retur3').val('');
		jQuery('#tanggal_retur3').html('');
		jQuery('#penerima3').val('');
		jQuery('#ket_retur3').val('');
		jQuery('#retur_qty3').val('');
		$$('#kode_retur3').removeAttr('readonly');
		$$('#tanggal_retur3').removeAttr('readonly');
		$$('#penerima3').removeAttr('readonly');
		$$('#ket_retur3').removeAttr('readonly');
		$$('#retur_qty3').removeAttr('readonly');
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
		$$(".input5").removeAttr("required");
		jQuery('#kode_retur4').val('');
		jQuery('#tanggal_retur4').html('');
		jQuery('#penerima4').val('');
		jQuery('#ket_retur4').val('');
		jQuery('#retur_qty4').val('');
		$$('#kode_retur4').removeAttr('readonly');
		$$('#tanggal_retur4').removeAttr('readonly');
		$$('#penerima4').removeAttr('readonly');
		$$('#ket_retur4').removeAttr('readonly');
		$$('#retur_qty4').removeAttr('readonly');
	}

	if (number_format(retur5) != 0) {
		$$('.content_retur6').show();
		$$(".input6").prop('required', true);
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
		$$(".input6").removeAttr("required");
		jQuery('#kode_retur5').val('');
		jQuery('#tanggal_retur5').html('');
		jQuery('#penerima5').val('');
		jQuery('#ket_retur5').val('');
		jQuery('#retur_qty5').val('');
		$$('#kode_retur5').removeAttr('readonly');
		$$('#tanggal_retur5').removeAttr('readonly');
		$$('#penerima5').removeAttr('readonly');
		$$('#ket_retur5').removeAttr('readonly');
		$$('#retur_qty5').removeAttr('readonly');
	}

	if (number_format(retur6) != 0) {
		$$('.content_retur7').show();
		jQuery('#kode_retur6').val(kode_retur6);
		jQuery('#tanggal_retur6').html(moment(tgl_retur6).format('DD-MMM'));
		jQuery('#penerima6').val(penerima6);
		jQuery('#ket_retur6').val(keterangan6);
		jQuery('#retur_qty6').val(retur6);
		$$('#kode_retur6').attr('readonly', true);
		$$('#kode_retur6').prop("onclick", null).off("click");
		$$('#tanggal_retur6').attr('readonly', true);
		$$('#tanggal_retur6').prop("onclick", null).off("click");
		$$('#penerima6').attr('readonly', true);
		$$('#penerima6').prop("onclick", null).off("click");
		$$('#ket_retur6').attr('readonly', true);
		$$('#ket_retur6').prop("onclick", null).off("click");
		$$('#retur_qty6').attr('readonly', true);
		$$('#retur_qty6').prop("onclick", null).off("click");
	} else {
		$$('.content_retur7').hide();
		jQuery('#kode_retur6').val('');
		jQuery('#tanggal_retur6').html('');
		jQuery('#penerima6').val('');
		jQuery('#ket_retur6').val('');
		jQuery('#retur_qty6').val('');
		$$('#kode_retur6').removeAttr('readonly');
		$$('#tanggal_retur6').removeAttr('readonly');
		$$('#penerima6').removeAttr('readonly');
		$$('#ket_retur6').removeAttr('readonly');
		$$('#retur_qty6').removeAttr('readonly');
	}

	if (number_format(retur7) != 0) {
		$$('.content_retur8').show();
		jQuery('#kode_retur7').val(kode_retur7);
		jQuery('#tanggal_retur7').html(moment(tgl_retur7).format('DD-MMM'));
		jQuery('#penerima7').val(penerima7);
		jQuery('#ket_retur7').val(keterangan7);
		jQuery('#retur_qty7').val(retur7);
		$$('#kode_retur7').attr('readonly', true);
		$$('#kode_retur7').prop("onclick", null).off("click");
		$$('#tanggal_retur7').attr('readonly', true);
		$$('#tanggal_retur7').prop("onclick", null).off("click");
		$$('#penerima7').attr('readonly', true);
		$$('#penerima7').prop("onclick", null).off("click");
		$$('#ket_retur7').attr('readonly', true);
		$$('#ket_retur7').prop("onclick", null).off("click");
		$$('#retur_qty7').attr('readonly', true);
		$$('#retur_qty7').prop("onclick", null).off("click");
	} else {
		$$('.content_retur8').hide();
		jQuery('#kode_retur7').val('');
		jQuery('#tanggal_retur7').html('');
		jQuery('#penerima7').val('');
		jQuery('#ket_retur7').val('');
		jQuery('#retur_qty7').val('');
		$$('#kode_retur7').removeAttr('readonly');
		$$('#tanggal_retur7').removeAttr('readonly');
		$$('#penerima7').removeAttr('readonly');
		$$('#ket_retur7').removeAttr('readonly');
		$$('#retur_qty7').removeAttr('readonly');
	}

	if (number_format(retur8) != 0) {
		$$('.content_retur9').show();
		jQuery('#kode_retur8').val(kode_retur8);
		jQuery('#tanggal_retur8').html(moment(tgl_retur8).format('DD-MMM'));
		jQuery('#penerima8').val(penerima8);
		jQuery('#ket_retur8').val(keterangan8);
		jQuery('#retur_qty8').val(retur8);
		$$('#kode_retur8').attr('readonly', true);
		$$('#kode_retur8').prop("onclick", null).off("click");
		$$('#tanggal_retur8').attr('readonly', true);
		$$('#tanggal_retur8').prop("onclick", null).off("click");
		$$('#penerima8').attr('readonly', true);
		$$('#penerima8').prop("onclick", null).off("click");
		$$('#ket_retur8').attr('readonly', true);
		$$('#ket_retur8').prop("onclick", null).off("click");
		$$('#retur_qty8').attr('readonly', true);
		$$('#retur_qty8').prop("onclick", null).off("click");
	} else {
		$$('.content_retur9').hide();
		jQuery('#kode_retur8').val('');
		jQuery('#tanggal_retur8').html('');
		jQuery('#penerima8').val('');
		jQuery('#ket_retur8').val('');
		jQuery('#retur_qty8').val('');
		$$('#kode_retur8').removeAttr('readonly');
		$$('#tanggal_retur8').removeAttr('readonly');
		$$('#penerima8').removeAttr('readonly');
		$$('#ket_retur8').removeAttr('readonly');
		$$('#retur_qty8').removeAttr('readonly');
	}

	if (number_format(retur9) != 0) {
		$$('.content_retur10').show();
		jQuery('#kode_retur9').val(kode_retur9);
		jQuery('#tanggal_retur9').html(moment(tgl_retur9).format('DD-MMM'));
		jQuery('#penerima9').val(penerima9);
		jQuery('#ket_retur9').val(keterangan9);
		jQuery('#retur_qty9').val(retur9);
		$$('#kode_retur9').attr('readonly', true);
		$$('#kode_retur9').prop("onclick", null).off("click");
		$$('#tanggal_retur9').attr('readonly', true);
		$$('#tanggal_retur9').prop("onclick", null).off("click");
		$$('#penerima9').attr('readonly', true);
		$$('#penerima9').prop("onclick", null).off("click");
		$$('#ket_retur9').attr('readonly', true);
		$$('#ket_retur9').prop("onclick", null).off("click");
		$$('#retur_qty9').attr('readonly', true);
		$$('#retur_qty9').prop("onclick", null).off("click");
	} else {
		$$('.content_retur10').hide();
		jQuery('#kode_retur9').val('');
		jQuery('#tanggal_retur9').html('');
		jQuery('#penerima9').val('');
		jQuery('#ket_retur9').val('');
		jQuery('#retur_qty9').val('');
		$$('#kode_retur9').removeAttr('readonly');
		$$('#tanggal_retur9').removeAttr('readonly');
		$$('#penerima9').removeAttr('readonly');
		$$('#ket_retur9').removeAttr('readonly');
		$$('#retur_qty9').removeAttr('readonly');
	}

	if (number_format(retur10) != 0) {
		$$('.content_retur11').show();
		jQuery('#kode_retur10').val(kode_retur10);
		jQuery('#tanggal_retur10').html(moment(tgl_retur10).format('DD-MMM'));
		jQuery('#penerima10').val(penerima10);
		jQuery('#ket_retur10').val(keterangan10);
		jQuery('#retur_qty10').val(retur10);
		$$('#kode_retur10').attr('readonly', true);
		$$('#kode_retur10').prop("onclick", null).off("click");
		$$('#tanggal_retur10').attr('readonly', true);
		$$('#tanggal_retur10').prop("onclick", null).off("click");
		$$('#penerima10').attr('readonly', true);
		$$('#penerima10').prop("onclick", null).off("click");
		$$('#ket_retur10').attr('readonly', true);
		$$('#ket_retur10').prop("onclick", null).off("click");
		$$('#retur_qty10').attr('readonly', true);
		$$('#retur_qty10').prop("onclick", null).off("click");
	} else {
		$$('.content_retur11').hide();
		jQuery('#kode_retur10').val('');
		jQuery('#tanggal_retur10').html('');
		jQuery('#penerima10').val('');
		jQuery('#ket_retur10').val('');
		jQuery('#retur_qty10').val('');
		$$('#kode_retur10').removeAttr('readonly');
		$$('#tanggal_retur10').removeAttr('readonly');
		$$('#penerima10').removeAttr('readonly');
		$$('#ket_retur10').removeAttr('readonly');
		$$('#retur_qty10').removeAttr('readonly');
	}

	jQuery.ajax({
		type: 'POST',
		url: BASE_API + "/get-detail-retur-client",
		dataType: 'JSON',
		data: {
			client_id: client_id,
			type: type
		},
		beforeSend: function () {
		},
		success: function (data) {

			if (data.data.length != 0) {
				if (number_format(retur1) != 0) {
					$$('.content_retur2').show();
				}
				if (number_format(retur2) != 0) {
					$$('.content_retur3').show();
				}
				if (number_format(retur3) != 0) {
					$$('.content_retur4').show();
				}
				if (number_format(retur4) != 0) {
					$$('.content_retur5').show();
				}
				if (number_format(retur5) != 0) {
					$$('.content_retur6').show();
				}
				if (number_format(retur6) != 0) {
					$$('.content_retur7').show();
				}
				if (number_format(retur7) != 0) {
					$$('.content_retur8').show();
				}
				if (number_format(retur8) != 0) {
					$$('.content_retur9').show();
				}
				if (number_format(retur9) != 0) {
					$$('.content_retur10').show();
				}
				if (number_format(retur10) != 0) {
					$$('.content_retur11').show();
				}

				$$(".input1").prop('required', true);
				$$(".input2").removeAttr("required");
				$$(".input3").removeAttr("required");
				$$(".input4").removeAttr("required");
				$$(".input5").removeAttr("required");
				$$(".input6").removeAttr("required");
				jQuery.each(data.data, function (i, val) {
					if (val.qty > 0) {
						if (i == '0') {
							$$(".input2").prop('required', true);
							jQuery('#kode_retur1').val(val.kode);
							jQuery('#tanggal_retur1').html(moment(val.tgl_kirim).format('DD-MMM'));
							jQuery('#penerima1').val(val.penerima);
							jQuery('#ket_retur1').val(val.ket);
							jQuery('#retur_qty1').val(val.qty);
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
						}
						if (i == '1') {
							$$(".input3").prop('required', true);
							jQuery('#kode_retur2').val(val.kode);
							jQuery('#tanggal_retur2').html(moment(val.tgl_kirim).format('DD-MMM'));
							jQuery('#penerima2').val(val.penerima);
							jQuery('#ket_retur2').val(val.ket);
							jQuery('#retur_qty2').val(val.qty);
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
						}
						if (i == '2') {
							$$(".input4").prop('required', true);
							jQuery('#kode_retur3').val(val.kode);
							jQuery('#tanggal_retur3').html(moment(val.tgl_kirim).format('DD-MMM'));
							jQuery('#penerima3').val(val.penerima);
							jQuery('#ket_retur3').val(val.ket);
							jQuery('#retur_qty3').val(val.qty);
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
						}
						if (i == '3') {
							$$(".input5").prop('required', true);
							jQuery('#kode_retur4').val(val.kode);
							jQuery('#tanggal_retur4').html(moment(val.tgl_kirim).format('DD-MMM'));
							jQuery('#penerima4').val(val.penerima);
							jQuery('#ket_retur4').val(val.ket);
							jQuery('#retur_qty4').val(val.qty);
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
						}
						if (i == '4') {
							$$(".input6").prop('required', true);
							jQuery('#kode_retur5').val(val.kode);
							jQuery('#tanggal_retur5').html(moment(val.tgl_kirim).format('DD-MMM'));
							jQuery('#penerima5').val(val.penerima);
							jQuery('#ket_retur5').val(val.ket);
							jQuery('#retur_qty5').val(val.qty);
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
						}
						if (i == '5') {
							jQuery('#kode_retur6').val(val.kode);
							jQuery('#tanggal_retur6').html(moment(val.tgl_kirim).format('DD-MMM'));
							jQuery('#penerima6').val(val.penerima);
							jQuery('#ket_retur6').val(val.ket);
							jQuery('#retur_qty6').val(val.qty);
							$$('#kode_retur6').attr('readonly', true);
							$$('#kode_retur6').prop("onclick", null).off("click");
							$$('#tanggal_retur6').attr('readonly', true);
							$$('#tanggal_retur6').prop("onclick", null).off("click");
							$$('#penerima6').attr('readonly', true);
							$$('#penerima6').prop("onclick", null).off("click");
							$$('#ket_retur6').attr('readonly', true);
							$$('#ket_retur6').prop("onclick", null).off("click");
							$$('#retur_qty6').attr('readonly', true);
							$$('#retur_qty6').prop("onclick", null).off("click");
						}
						if (i == '6') {
							jQuery('#kode_retur7').val(val.kode);
							jQuery('#tanggal_retur7').html(moment(val.tgl_kirim).format('DD-MMM'));
							jQuery('#penerima7').val(val.penerima);
							jQuery('#ket_retur7').val(val.ket);
							jQuery('#retur_qty7').val(val.qty);
							$$('#kode_retur7').attr('readonly', true);
							$$('#kode_retur7').prop("onclick", null).off("click");
							$$('#tanggal_retur7').attr('readonly', true);
							$$('#tanggal_retur7').prop("onclick", null).off("click");
							$$('#penerima7').attr('readonly', true);
							$$('#penerima7').prop("onclick", null).off("click");
							$$('#ket_retur7').attr('readonly', true);
							$$('#ket_retur7').prop("onclick", null).off("click");
							$$('#retur_qty7').attr('readonly', true);
							$$('#retur_qty7').prop("onclick", null).off("click");
						}
						if (i == '7') {
							jQuery('#kode_retur8').val(val.kode);
							jQuery('#tanggal_retur8').html(moment(val.tgl_kirim).format('DD-MMM'));
							jQuery('#penerima8').val(val.penerima);
							jQuery('#ket_retur8').val(val.ket);
							jQuery('#retur_qty8').val(val.qty);
							$$('#kode_retur8').attr('readonly', true);
							$$('#kode_retur8').prop("onclick", null).off("click");
							$$('#tanggal_retur8').attr('readonly', true);
							$$('#tanggal_retur8').prop("onclick", null).off("click");
							$$('#penerima8').attr('readonly', true);
							$$('#penerima8').prop("onclick", null).off("click");
							$$('#ket_retur8').attr('readonly', true);
							$$('#ket_retur8').prop("onclick", null).off("click");
							$$('#retur_qty8').attr('readonly', true);
							$$('#retur_qty8').prop("onclick", null).off("click");
						}
						if (i == '8') {
							jQuery('#kode_retur9').val(val.kode);
							jQuery('#tanggal_retur9').html(moment(val.tgl_kirim).format('DD-MMM'));
							jQuery('#penerima9').val(val.penerima);
							jQuery('#ket_retur9').val(val.ket);
							jQuery('#retur_qty9').val(val.qty);
							$$('#kode_retur9').attr('readonly', true);
							$$('#kode_retur9').prop("onclick", null).off("click");
							$$('#tanggal_retur9').attr('readonly', true);
							$$('#tanggal_retur9').prop("onclick", null).off("click");
							$$('#penerima9').attr('readonly', true);
							$$('#penerima9').prop("onclick", null).off("click");
							$$('#ket_retur9').attr('readonly', true);
							$$('#ket_retur9').prop("onclick", null).off("click");
							$$('#retur_qty9').attr('readonly', true);
							$$('#retur_qty9').prop("onclick", null).off("click");
						}
						if (i == '9') {
							jQuery('#kode_retur10').val(val.kode);
							jQuery('#tanggal_retur10').html(moment(val.tgl_kirim).format('DD-MMM'));
							jQuery('#penerima10').val(val.penerima);
							jQuery('#ket_retur10').val(val.ket);
							jQuery('#retur_qty10').val(val.qty);
							$$('#kode_retur10').attr('readonly', true);
							$$('#kode_retur10').prop("onclick", null).off("click");
							$$('#tanggal_retur10').attr('readonly', true);
							$$('#tanggal_retur10').prop("onclick", null).off("click");
							$$('#penerima10').attr('readonly', true);
							$$('#penerima10').prop("onclick", null).off("click");
							$$('#ket_retur10').attr('readonly', true);
							$$('#ket_retur10').prop("onclick", null).off("click");
							$$('#retur_qty10').attr('readonly', true);
							$$('#retur_qty10').prop("onclick", null).off("click");
						}
					}
				});
			}
		},
		error: function (xmlhttprequest, textstatus, message) {
		}
	});
}


// ========================================
// KATEGORI 4: FUNGSI POPUP PENJUALAN TAMBAH
// ========================================

function fillPenjualanTambahPopup(produk_detail_id, produk_grup_warna, produk_id) {

	$("#close-katalog-popup-tambah").click();
	$$('#color_penjualan_tambah_1').css("display", "inline");
	$$('#type_penjualan_tambah_1').removeClass('col-100');
	$$('#type_penjualan_tambah_1').addClass('col-70');

	$$('#color_tambah_popup_1').html('<div id="penjualan_color_tambah_popup_1" data-color="' + produk_grup_warna + '" style="margin:5px;text-align:center;height:25px;background-color:' + produk_grup_warna + '"></div>');
	$$('#penjualan_produk_detail_tambah_id_1').val(produk_detail_id);
	$$('#penjualan_produk_tambah_id_1').val(produk_id);
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


// ========================================
// KATEGORI 5: FUNGSI POPUP PENJUALAN EDIT
// ========================================

function fillPenjualanEdit(produk_detail_id, produk_grup_warna, produk_id) {
	$("#close-katalog-popup-edit").click();
	$$('#color_penjualan_edit_1').css("display", "inline");
	$$('#type_penjualan_edit_1').removeClass('col-100');
	$$('#type_penjualan_edit_1').addClass('col-70');

	$$('#color_edit_1').html('<div id="penjualan_color_edit_1" data-color="' + produk_grup_warna + '" style="margin:5px;text-align:center;height:25px;background-color:' + produk_grup_warna + '"></div>');
	$$('#penjualan_produk_detail_edit_id_1').val(produk_detail_id);
	$$('#penjualan_produk_id_edit_1').val(produk_id);
}

function gambarPenjualanEdit(penjualan_id) {
	if (jQuery('#file_edit_' + penjualan_id + '').val() == '' || jQuery('#file_edit_' + penjualan_id + '').val() == null) {
		$$('#value_penjualan_edit_' + penjualan_id + '').html('Gambar');
	} else {
		$$('#value_penjualan_edit_' + penjualan_id + '').html($$('#file_edit_' + penjualan_id + '').val().replace('fakepath', ''));
	}
}