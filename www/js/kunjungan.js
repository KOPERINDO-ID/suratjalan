var calendarRangeProspek;
var delayTimer;
function doSearchByPerusahaanKunjungan(text) {
	clearTimeout(delayTimer);
	delayTimer = setTimeout(function () {
		getProspekHeader();
	}, 1000);
}


function updateStatus(tanggal_update_status, status_kunjungan, kunjungan_detail_id) {

	jQuery.ajax({
		type: 'POST',
		url: "" + BASE_API + "/update-prospek-status",
		dataType: 'JSON',
		data: {
			karyawan_id: localStorage.getItem("user_id"),
			kunjungan_detail_id: kunjungan_detail_id,
			status_kunjungan: jQuery('#status_prospek_' + kunjungan_detail_id + '').val()
		},
		beforeSend: function () {
			app.dialog.preloader('Harap Tunggu');
		},
		success: function (data) {
			app.dialog.close();
			getProspekHeader();
		},
		error: function (xmlhttprequest, textstatus, message) {
		}
	});
}

function exportProspekReport() {
	if (jQuery('#range-prospek').val() == '' || jQuery('#range-prospek').val() == null) {
		var startdate = "empty";
		var enddate = "empty";
	} else {
		var startdate_new = new Date(calendarRangeProspek.value[0]);
		var enddate_new = new Date(calendarRangeProspek.value[1]);
		var startdate = moment(startdate_new).format('YYYY-MM-DD');
		var enddate = moment(enddate_new).format('YYYY-MM-DD');
	}
	if (jQuery('#perusahaan_prospek_filter').val() == '' || jQuery('#perusahaan_prospek_filter').val() == null) {
		perusahaan_prospek_value = "empty";
	} else {
		perusahaan_prospek_value = jQuery('#perusahaan_prospek_filter').val();
	}
	var prospek_value = "";

	jQuery.ajax({
		type: 'POST',
		url: "" + BASE_API + "/get-prospek-report",
		dataType: 'JSON',
		data: {
			karyawan_id: localStorage.getItem("user_id"),
			startdate: startdate,
			enddate: enddate,
			perusahaan_prospek_value: perusahaan_prospek_value
		},
		beforeSend: function () {
			app.dialog.preloader('Harap Tunggu');
		},
		success: function (data) {
			app.dialog.close();
			var no = 0;
			$.each(data.data, function (i, item) {
				no = i + 1;
				if (item.tanggal_status1 == '' || item.tanggal_status1 == null) {
					tanggal_1 = '-';
				} else {
					tanggal_1 = moment(item.tanggal_status1).format('DD-MMM') + '';
				}

				if (item.tanggal_status2 == '' || item.tanggal_status2 == null) {
					tanggal_2 = '-';
				} else {
					tanggal_2 = moment(item.tanggal_status2).format('DD-MMM') + '';
				}

				if (item.tanggal_status3 == '' || item.tanggal_status3 == null) {
					tanggal_3 = '-';
				} else {
					tanggal_3 = moment(item.tanggal_status3).format('DD-MMM') + '';
				}

				if (item.tanggal_komunikasi == '' || item.tanggal_komunikasi == null) {
					tanggal_komunikasi = '-';
				} else {
					tanggal_komunikasi = moment(item.tanggal_komunikasi).format('DD-MMM');
				}

				if (item.hasil_pertemuan1 == '' || item.hasil_pertemuan1 == null) {
					hasil_pertemuan1 = '-';
				} else {
					hasil_pertemuan1 = item.hasil_pertemuan1;
				}

				if (item.hasil_pertemuan2 == '' || item.hasil_pertemuan2 == null) {
					hasil_pertemuan2 = '-';
				} else {
					hasil_pertemuan2 = item.hasil_pertemuan2;
				}

				if (item.hasil_pertemuan3 == '' || item.hasil_pertemuan3 == null) {
					hasil_pertemuan3 = '-';
				} else {
					hasil_pertemuan3 = item.hasil_pertemuan3;
				}

				if (item.hasil_komunikasi == '' || item.hasil_komunikasi == null) {
					hasil_komunikasi = '-';
				} else {
					hasil_komunikasi = item.hasil_komunikasi;
				}

				var keterangan;

				if (hasil_pertemuan1 != '-') {
					keterangan = hasil_pertemuan1;
				} else if (hasil_pertemuan2 != '-') {
					keterangan = hasil_pertemuan2;
				} else if (hasil_pertemuan3 != '-') {
					keterangan = hasil_pertemuan3;
				}


				if (item.status_kunjungan == 'LOSS') {
					var fontcolor = 'style="color:red;"';
				} else {
					var fontcolor = 'style="color:blue;"';
				}

				prospek_value += '<tr>';
				prospek_value += '<td class="label-cell" ' + fontcolor + '>' + tanggal_komunikasi + '</td>';
				prospek_value += '<td class="label-cell" ' + fontcolor + '>' + item.client_nama + '</td>';
				prospek_value += '<td class="label-cell" ' + fontcolor + '>' + item.client_cp + '</td>';
				prospek_value += '<td class="label-cell" ' + fontcolor + '>' + item.client_cp_posisi + '</td>';
				prospek_value += '<td class="label-cell" ' + fontcolor + '>' + item.client_telp + '</td>';
				prospek_value += '<td class="label-cell" ' + fontcolor + '>' + tanggal_1 + '</td>';
				prospek_value += '<td class="label-cell" ' + fontcolor + '>' + tanggal_2 + '</td>';
				prospek_value += '<td class="label-cell" ' + fontcolor + '>' + tanggal_3 + '</td>';
				prospek_value += '<td class="label-cell" ' + fontcolor + '>' + keterangan + '</td>';

			});


			let options = {
				documentSize: 'A4',
				type: 'share',
				fileName: 'Prospek.pdf'
			}
			var content = '';
			content += '<b>Absen : </b>' + localStorage.getItem("karyawan_nama") + '<br><br>';
			content += '<table border="1" width="100%">';
			content += '<tr>';
			content += '<td >';
			content += 'Tgl';
			content += '</td>';
			content += '<td>';
			content += 'PERUSAHAAN / TRAVEL';
			content += '</td>';
			content += '<td>';
			content += 'PERSON';
			content += '</td>';
			content += '<td>';
			content += 'POSISI';
			content += '</td>';
			content += '<td>';
			content += 'TLP/WA';
			content += '</td>';
			content += '<td>';
			content += '1';
			content += '</td>';
			content += '<td>';
			content += '2';
			content += '</td>';
			content += '<td>';
			content += '3';
			content += '</td>';
			content += '<td>';
			content += 'KETERANGAN';
			content += '</td>';
			content += '</tr>';
			content += prospek_value;
			content += '</table>';
			pdf.fromData(content, options)
				.then((stats) => console.log('status', stats))
				.catch((err) => console.err(err))
		},
		error: function (xmlhttprequest, textstatus, message) {
		}
	});
}

function detailProspek(tanggal_komunikasi, hasil_komunikasi, client_alamat, person, posisi, client_id, client_kota, client_nama, telpon, kunjungan_detail_id, karyawan_id, status, tanggal_janjian, tanggal_status1, tanggal_status2, tanggal_status3, hasil_pertemuan1, hasil_pertemuan2, hasil_pertemuan3) {



	$$('#popup-prospek-tgl-komunikasi').html(tanggal_komunikasi);
	$$('#popup-prospek-td-client_nama').html(client_nama);
	$$('#popup-prospek-client_person').html(person);
	$$('#popup-prospek-client_kota').html(client_kota);
	$$('#popup-prospek-client_posisi').html(posisi);
	$$('#popup-prospek-client_telpon').html(telpon);
	$$('#popup-prospek-status1').html(tanggal_status1);
	$$('#popup-prospek-status2').html(tanggal_status2);
	$$('#popup-prospek-status3').html(tanggal_status3);
	$$('#popup-prospek-hasil-komunikasi').html('Hasil Pertemuan:&#10;"' + hasil_komunikasi + '"');
	$$('#popup-prospek-keterangan1').html('Hasil Pertemuan:&#10;"' + hasil_pertemuan1 + '"');
	$$('#popup-prospek-keterangan2').html('Hasil Pertemuan:&#10;"' + hasil_pertemuan2 + '"');
	$$('#popup-prospek-keterangan3').html('Hasil Pertemuan:&#10;"' + hasil_pertemuan3 + '"');
}

function updateProspek(lat_1, lng_1, lat_2, lng_2, lat_3, lng_3, file_selfie_card_1, file_selfie_card_2, file_selfie_card_3, file_id_card_1, file_id_card_2, file_id_card_3, tanggal_komunikasi, hasil_komunikasi, client_alamat, person, posisi, client_id, client_kota, client_nama, telpon, kunjungan_detail_id, karyawan_id, status, tanggal_janjian, tanggal_status1, tanggal_status2, tanggal_status3, hasil_pertemuan1, hasil_pertemuan2, hasil_pertemuan3) {
	var today = moment().format('YYYY-MM-DD');
	document.getElementsByName("tanggal_janjian_update")[0].setAttribute('min', today);

	jQuery('#tanggal_janjian_update').val("");
	jQuery('#keterangan_janjian_update').val("");

	jQuery('#btn_update_proses').show();
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function (position) {
			localStorage.setItem("lat_usr", position.coords.latitude);
			localStorage.setItem("lng_usr", position.coords.longitude);

			$$('#popup-prospek-tgl-komunikasi').html(tanggal_komunikasi);
			$$('#popup-prospek-td-client_nama').html(client_nama);
			$$('#popup-prospek-client_person').html(person);
			$$('#popup-prospek-client_kota').html(client_kota);
			$$('#popup-prospek-client_posisi').html(posisi);
			$$('#popup-prospek-client_telpon').html(telpon);
			$$('#popup-prospek-hasil-komunikasi').html(hasil_komunikasi);
			$$('#kunjungan_detail_id_update').val(kunjungan_detail_id);
			$$('#tanggal_status1_update').val(moment(tanggal_status1).format('YYYY-MM-DD'));
			$$('#tanggal_status2_update').val(moment(tanggal_status2).format('YYYY-MM-DD'));
			$$('#tanggal_status3_update').val(moment(tanggal_status3).format('YYYY-MM-DD'));

			if (lat_1 == "null" && lat_2 == "null" && lat_3 == "null") {
				localStorage.setItem("lat_1", position.coords.latitude);
				localStorage.setItem("lng_1", position.coords.longitude);
				localStorage.setItem("lat_2", "-");
				localStorage.setItem("lng_2", "-");
				localStorage.setItem("lat_3", "-");
				localStorage.setItem("lng_3", "-");
			} else if (lat_1 != "-" && lat_2 == "-" && lat_3 == "-") {
				localStorage.setItem("lat_1", lat_1);
				localStorage.setItem("lng_1", lng_1);
				localStorage.setItem("lat_2", position.coords.latitude);
				localStorage.setItem("lng_2", position.coords.longitude);
				localStorage.setItem("lat_3", "-");
				localStorage.setItem("lng_3", "-");
			} else if (lat_1 != "-" && lat_2 != "-" && lat_3 == "-") {
				localStorage.setItem("lat_1", lat_1);
				localStorage.setItem("lng_1", lng_1);
				localStorage.setItem("lat_2", lat_2);
				localStorage.setItem("lng_2", lng_2);
				localStorage.setItem("lat_3", position.coords.latitude);
				localStorage.setItem("lng_3", position.coords.longitude);
			} else if (lat_1 != "-" && lat_2 != "-" && lat_3 != "-") {
				localStorage.setItem("lat_1", lat_1);
				localStorage.setItem("lng_1", lng_1);
				localStorage.setItem("lat_2", lat_2);
				localStorage.setItem("lng_2", lng_2);
				localStorage.setItem("lat_3", position.coords.latitude);
				localStorage.setItem("lng_3", position.coords.longitude);
				jQuery('#btn_update_proses').hide();
			}

			if (file_id_card_1 != "-") {
				localStorage.setItem("file_id_card_1", file_id_card_1);
			} else {
				localStorage.setItem("file_id_card_1", 'null');
			}

			if (file_selfie_card_1 != "-") {
				localStorage.setItem("file_selfie_card_1", file_selfie_card_1);
			} else {
				localStorage.setItem("file_selfie_card_1", 'null');
			}

			if (file_id_card_2 != "-") {
				localStorage.setItem("file_id_card_2", file_id_card_2);
			} else {
				localStorage.setItem("file_id_card_2", 'null');
			}

			if (file_selfie_card_2 != "-") {
				localStorage.setItem("file_selfie_card_2", file_selfie_card_2);
			} else {
				localStorage.setItem("file_selfie_card_2", 'null');
			}


			if (file_id_card_3 != "-") {
				localStorage.setItem("file_id_card_3", file_id_card_3);
			} else {
				localStorage.setItem("file_id_card_3", 'null');
			}

			if (file_selfie_card_3 != "-") {
				localStorage.setItem("file_selfie_card_3", file_selfie_card_3);
			} else {
				localStorage.setItem("file_selfie_card_3", 'null');
			}

			$$('.pertemuan_1_section').hide();
			$$('.pertemuan_2_section').hide();
			$$('.pertemuan_3_section').hide();
			$('#hasil_pertemuan1_update').removeClass('required');
			$('#tanggal_status1_update').removeClass('required');
			$('#hasil_pertemuan2_update').removeClass('required');
			$('#tanggal_status2_update').removeClass('required');
			$('#hasil_pertemuan3_update').removeClass('required');
			$('#tanggal_status3_update').removeClass('required');

			if (hasil_pertemuan1 != "-") {
				$$('.pertemuan_2_section').show();
				$('#hasil_pertemuan2_update').addClass('required');
				$('#tanggal_status2_update').addClass('required');
				$$("#file_id_card_1_view").attr("src", "");
				$$("#file_selfie_card_1_view").attr("src", "");
				$('#hasil_pertemuan1_update').val(hasil_pertemuan1);
				$('#hasil_pertemuan1_update').prop('readonly', true);
				$('#tanggal_status1_update').prop('readonly', true);
				$('#file_id_card_1').hide();
				$('#file_selfie_card_1').hide();
				$$("#file_id_card_1_view").attr("src", BASE_PATH_IMAGE + '/' + file_id_card_1);
				$$("#file_selfie_card_1_view").attr("src", BASE_PATH_IMAGE + '/' + file_selfie_card_1);
				$('.keterangan_foto1').show();

			} else {
				$$("#file_id_card_1_view").attr("src", "");
				$$("#file_selfie_card_1_view").attr("src", "");
				$('#hasil_pertemuan1_update').val('');
				$('#hasil_pertemuan1_update').addClass('required');
				$('#tanggal_status1_update').addClass('required');
				$('#hasil_pertemuan1_update').prop('readonly', false);
				$('#tanggal_status1_update').prop('readonly', true);
				document.getElementById('tanggal_status1_update').value = moment().format('YYYY-MM-DD');
				$('#file_id_card_1').show();
				$('#file_selfie_card_1').show();
				$('.keterangan_foto1').hide();
				$$("#file_selfie_card_1_view").attr("src", "");
			}

			if (hasil_pertemuan2 != "-") {
				$$('.pertemuan_3_section').show();
				$('#hasil_pertemuan3_update').addClass('required');
				$('#tanggal_status3_update').addClass('required');
				$$("#file_selfie_card_2_view").attr("src", "");
				$$("#file_id_card_2_view").attr("src", "");
				$('#hasil_pertemuan2_update').val(hasil_pertemuan2);
				$('#hasil_pertemuan2_update').prop('readonly', true);
				$('#tanggal_status2_update').prop('readonly', true);
				$('#file_id_card_2').hide();
				$('#file_selfie_card_2').hide();
				$$("#file_id_card_2_view").attr("src", BASE_PATH_IMAGE + '/' + file_id_card_2);
				$$("#file_selfie_card_2_view").attr("src", BASE_PATH_IMAGE + '/' + file_selfie_card_2);
				$('.keterangan_foto2').show();
				$('#hasil_pertemuan2_update').removeClass('required');
				$('#tanggal_status2_update').removeClass('required');
			} else {
				$$("#file_id_card_2_view").attr("src", "");
				$$("#file_selfie_card_2_view").attr("src", "");
				$('#hasil_pertemuan2_update').val('');
				$('#hasil_pertemuan2_update').prop('readonly', false);
				$('#tanggal_status2_update').prop('readonly', true);
				document.getElementById('tanggal_status2_update').value  = moment().format('YYYY-MM-DD');
				$('#file_id_card_2').show();
				$('#file_selfie_card_2').show();
				$('.keterangan_foto2').hide();
				$$("#file_selfie_card_2_view").attr("src", "");
			}

			if (hasil_pertemuan3 != "-") {
				$$("#file_id_card_3_view").attr("src", "");
				$$("#file_selfie_card_3_view").attr("src", "");
				$('#hasil_pertemuan3_update').val(hasil_pertemuan3);
				$('#hasil_pertemuan3_update').prop('readonly', true);
				$('#tanggal_status3_update').prop('readonly', true);
				$('#file_id_card_3').hide();
				$('#file_selfie_card_3').hide();
				$$("#file_id_card_3_view").attr("src", BASE_PATH_IMAGE + '/' + file_id_card_3);
				$$("#file_selfie_card_3_view").attr("src", BASE_PATH_IMAGE + '/' + file_selfie_card_3);
				$('.keterangan_foto3').show();
				$$('#hasil_pertemuan3_update').removeClass('required');
				$$('#tanggal_status3_update').removeClass('required');
				$$(".div_janjian").hide();
			} else {
				$$("#file_id_card_3_view").attr("src", "");
				$$("#file_selfie_card_3_view").attr("src", "");
				$('#hasil_pertemuan3_update').val('');
				$('#hasil_pertemuan3_update').prop('readonly', false);
				$('#tanggal_status3_update').prop('readonly', true);
				document.getElementById('tanggal_status3_update').value = moment().format('YYYY-MM-DD');
				$$(".div_janjian").show();
				$('#file_id_card_3').show();
				$('#file_selfie_card_3').show();
				$('.keterangan_foto3').hide();
				$$("#file_selfie_card_3_view").attr("src", "");
			}
			console.log();

		});
	} else {
		return app.views.main.router.navigate('/kunjungan');
	}

}

function dateRangeDeclarationProspek() {
	calendarRangeProspek = app.calendar.create({
		inputEl: '#range-prospek',
		rangePicker: true,
		dateFormat: 'dd-mm-yyyy',
		closeOnSelect: true,
		rangePickerMinDays: 7,
		on: {
			close: function () {
				getProspekHeader();
			}
		}
	});
}

function updateProspekProcess() {
	var count_empty = 0;
	$('.required').each(function () {
		if ($(this).val() == "") {
			count_empty += 1;
		}
	});
	var count_label_foto = $('.custom-file-upload').is(":visible");
	if (!$$('#update_prospek_form')[0].checkValidity()) {
		app.dialog.alert('Cek Isian Prospek Anda');
	} else {
		if (count_empty == 0) {
			if (count_label_foto == false) {
				var formData = new FormData(jQuery("#update_prospek_form")[0]);
				formData.append('file_id_card_1', localStorage.getItem("file_id_card_1"));
				formData.append('file_id_card_2', localStorage.getItem("file_id_card_2"));
				formData.append('file_id_card_3', localStorage.getItem("file_id_card_3"));
				formData.append('file_selfie_card_1', localStorage.getItem("file_selfie_card_1"));
				formData.append('file_selfie_card_2', localStorage.getItem("file_selfie_card_2"));
				formData.append('file_selfie_card_3', localStorage.getItem("file_selfie_card_3"));

				formData.append('lat_1', localStorage.getItem("lat_1"));
				formData.append('lat_2', localStorage.getItem("lat_2"));
				formData.append('lat_3', localStorage.getItem("lat_3"));

				formData.append('lng_1', localStorage.getItem("lng_1"));
				formData.append('lng_2', localStorage.getItem("lng_2"));
				formData.append('lng_3', localStorage.getItem("lng_3"));

				jQuery.ajax({
					type: "POST",
					url: "" + BASE_API + "/prospek-update",
					dataType: "JSON",
					data: formData,
					contentType: false,
					processData: false,
					xhr: function () {
						var dialog = app.dialog.progress('Loading ', 0);
						dialog.setText('0%');
						var xhr = new window.XMLHttpRequest();
						xhr.upload.addEventListener("progress", function (evt) {

							if (evt.lengthComputable) {
								var percentComplete = evt.loaded / evt.total;
								dialog.setProgress(Math.round(percentComplete * 100));
								dialog.setText('' + (Math.round(percentComplete * 100)) + '%');
							}

						}, false);
						return xhr;
					},
					success: function (data) {
						$$('.prospek-update').val('');
						getProspekHeader();
						app.popup.close();
						app.dialog.close();
						if (data.status == 'done') {
							app.dialog.alert('Berhasil update Prospek');
						} else if (data.status == 'failed') {
							app.dialog.alert('Gagal Input Prospek');
						}
					}
				});
			} else {
				app.dialog.alert('Harap Upload Bukti Foto Selfie Dan ID card');
			}
		} else {
			app.dialog.alert('Harap Isi Semua Input Prospek');
		}
	}
}

function getProspekHeader(page) {
	if (page == '' || page == null) {
		var page_now = 1;
	} else {
		var page_now = page;
	}

	if (jQuery('#range-prospek').val() == '' || jQuery('#range-prospek').val() == null) {
		var startdate = "empty";
		var enddate = "empty";
	} else {
		var startdate_new = new Date(calendarRangeProspek.value[0]);
		var enddate_new = new Date(calendarRangeProspek.value[1]);
		var startdate = moment(startdate_new).format('YYYY-MM-DD');
		var enddate = moment(enddate_new).format('YYYY-MM-DD');
	}
	if (jQuery('#perusahaan_prospek_filter').val() == '' || jQuery('#perusahaan_prospek_filter').val() == null) {
		perusahaan_prospek_value = "empty";
	} else {
		perusahaan_prospek_value = jQuery('#perusahaan_prospek_filter').val();
	}
	var prospek_value = "";
	var pagination_button = "";
	jQuery.ajax({
		type: 'POST',
		url: "" + BASE_API + "/get-prospek-header?page=" + page_now + "",
		dataType: 'JSON',
		data: {
			karyawan_id: localStorage.getItem("user_id"),
			startdate: startdate,
			enddate: enddate,
			perusahaan_prospek_value: perusahaan_prospek_value
		},
		beforeSend: function () {
			app.dialog.preloader('Harap Tunggu');
		},
		success: function (data) {
			app.dialog.close();
			no = 1;
			for (i = 0; i < data.data.last_page; i++) {
				no = i + 1;
				pagination_button += '<i onclick="getProspekHeader(' + no + ');"  style="border-radius:2px; width:40px; height:40px; background-color:#4c5269; padding-left:8px; padding-right:8px; margin:2px;">' + no + '</i>';
			}

			$.each(data.data.data, function (i, item) {

				if (item.tanggal_komunikasi == '' || item.tanggal_komunikasi == null) {
					tanggal_komunikasi = '-';
				} else {
					tanggal_komunikasi = moment(item.tanggal_komunikasi).format('DD-MMM');
				}

				if (item.hasil_pertemuan1 == '' || item.hasil_pertemuan1 == null) {
					hasil_pertemuan1 = '-';
					tanggal_1 = '-';
				} else {
					hasil_pertemuan1 = item.hasil_pertemuan1;
					tanggal_1 = moment(item.tanggal_status1).format('DD-MMM');
				}

				if (item.hasil_pertemuan2 == '' || item.hasil_pertemuan2 == null) {
					hasil_pertemuan2 = '-';
					tanggal_2 = '-';
				} else {
					hasil_pertemuan2 = item.hasil_pertemuan2;
					tanggal_2 = moment(item.tanggal_status2).format('DD-MMM');
				}

				if (item.hasil_pertemuan3 == '' || item.hasil_pertemuan3 == null) {
					hasil_pertemuan3 = '-';
					tanggal_3 = '-';
				} else {
					hasil_pertemuan3 = item.hasil_pertemuan3;
					tanggal_3 = moment(item.tanggal_status3).format('DD-MMM');
				}

				if (item.hasil_komunikasi == '' || item.hasil_komunikasi == null) {
					hasil_komunikasi = '-';
				} else {
					hasil_komunikasi = item.hasil_komunikasi;
				}
				if (item.status_kunjungan == 'LOSS') {
					var LOSS = "selected";
					var OK = "";
				} else {
					var OK = "selected";
					var LOSS = "";
				}



				prospek_value += '<tr>';
				prospek_value += '<td align="left" class="label-cell" style="border-bottom :1px solid gray; border-left :1px solid gray;">' + item.client_nama + ', PT</td>';
				prospek_value += '<td class="label-cell" style="border-bottom :1px solid gray; border-left :1px solid gray; border-bottom :1px solid gray;  background-color:forestgreen; ">' + moment(item.tanggal_janjian).format('DD-MMM') + '</td>';
				//prospek_value += '<td class="label-cell">'+item.client_id+'</td>';
				prospek_value += '<td style="border-left :1px solid gray; border-right :1px solid gray; border-bottom :1px solid gray;" class="label-cell ">' + tanggal_komunikasi + '</td>';
				prospek_value += '<td style="border-right :1px solid gray; border-bottom :1px solid gray;" class="label-cell ">' + tanggal_1 + '</td>';
				prospek_value += '<td style="border-right :1px solid gray; border-bottom :1px solid gray;" class="label-cell">' + tanggal_2 + '</td>';
				prospek_value += '<td style="border-right :1px solid gray; border-bottom :1px solid gray;" class="label-cell">' + tanggal_3 + '</td>';
				prospek_value += '<td style="border-right :1px solid gray; border-bottom :1px solid gray;" class="label-cell">';

				var a = moment([moment(item.tanggal_update_status).format('YYYY'), moment(item.tanggal_update_status).format('MM'), moment(item.tanggal_update_status).format('DD')]);
				var b = moment([moment().format('YYYY'), moment().format('MM'), moment().format('DD')]);


				if (item.status_kunjungan == "LOSS") {

					if (a.diff(b, 'days') >= 60) {
						prospek_value += '<select onchange="updateStatus(\'' + item.tanggal_update_status + '\',\'' + item.status_kunjungan + '\',\'' + item.kunjungan_detail_id + '\');" style="text-align-last: center; border-radius:3px; height:100%; width:100%; background-color:gray;" id="status_prospek_' + item.kunjungan_detail_id + '" name="status_prospek_' + item.kunjungan_detail_id + '" value="" >';
						prospek_value += '<option value="OK" ' + OK + '>OK</option>';
						prospek_value += '<option value="LOSS" ' + LOSS + '>LOSS</option>';
						prospek_value += '</select>';
					} else {
						prospek_value += '<select onchange="updateStatus(\'' + item.tanggal_update_status + '\',\'' + item.status_kunjungan + '\',\'' + item.kunjungan_detail_id + '\');" style="text-align-last: center; border-radius:3px; height:100%; width:100%; background-color:gray;" id="status_prospek_' + item.kunjungan_detail_id + '" name="status_prospek_' + item.kunjungan_detail_id + '" value="" disabled>';
						prospek_value += '<option value="OK" ' + OK + '>OK</option>';
						prospek_value += '<option value="LOSS" ' + LOSS + '>LOSS</option>';
						prospek_value += '</select>';
					}

				} else {
					prospek_value += '<select onchange="updateStatus(\'' + item.tanggal_update_status + '\',\'' + item.status_kunjungan + '\',\'' + item.kunjungan_detail_id + '\');" style="text-align-last: center; border-radius:3px; height:100%; width:100%; background-color:gray;" id="status_prospek_' + item.kunjungan_detail_id + '" name="status_prospek_' + item.kunjungan_detail_id + '" value="">';
					prospek_value += '<option value="OK" ' + OK + '>OK</option>';
					prospek_value += '<option value="LOSS" ' + LOSS + '>LOSS</option>';
					prospek_value += '</select>';
				}

				prospek_value += '</td>';
				prospek_value += '<td style="border-right :1px solid gray; border-bottom :1px solid gray;" class="label-cell">';
				prospek_value += '<button onclick="updateProspek(\'' + item.lat_1 + '\',\'' + item.lng_1 + '\',\'' + item.lat_2 + '\',\'' + item.lng_2 + '\',\'' + item.lat_3 + '\',\'' + item.lng_3 + '\',\'' + item.file_selfie_card_1 + '\',\'' + item.file_selfie_card_2 + '\',\'' + item.file_selfie_card_3 + '\',\'' + item.file_id_card_1 + '\',\'' + item.file_id_card_2 + '\',\'' + item.file_id_card_3 + '\',\'' + tanggal_komunikasi + '\',\'' + hasil_komunikasi.replace(/\s/g, " ") + '\',\'' + item.client_alamat + '\',\'' + item.client_cp + '\',\'' + item.client_cp_posisi + '\',\'' + item.client_id + '\',\'' + item.client_kota + '\',\'' + item.client_nama + '\',\'' + item.client_telp + '\',\'' + item.kunjungan_detail_id + '\',\'' + item.karyawan_id + '\',\'' + item.status + '\',\'' + item.tanggal_janjian + '\',\'' + item.tanggal_status1 + '\',\'' + item.tanggal_status2 + '\',\'' + item.tanggal_status3 + '\',\'' + hasil_pertemuan1.replace(/\s/g, " ") + '\',\'' + hasil_pertemuan2.replace(/\s/g, " ") + '\',\'' + hasil_pertemuan3.replace(/\s/g, " ") + '\')" class="text-add-colour-black-soft bg-dark-gray-young button-small col button popup-open text-bold" data-popup=".update-prospek">Update</button>';
				prospek_value += '</td>';
				prospek_value += '</tr>';
			});
			$$('#prospek_value').html(prospek_value);
			$$('#pagination_button').html(pagination_button);
			$$('#current_page').html(data.data.current_page);
			$$('#from_data').html(data.data.from);
			$$('#to_data').html(data.data.to);
			$$('#total_data').html(data.data.total);
		},
		error: function (xmlhttprequest, textstatus, message) {
		}
	});
}

function zoom_view(src) {
	var gambar_zoom = src;
	var myPhotoBrowserPopupDark = app.photoBrowser.create({
		photos: [
			'' + gambar_zoom + ''
		],
		theme: 'dark',
		type: 'popup'
	});
	myPhotoBrowserPopupDark.open();
}