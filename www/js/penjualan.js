var calendarRangePenjualan;
jQuery('.input-item-price').mask('000,000,000,000', { reverse: true });
jQuery('.input-pembayaran-multiple').mask('000,000,000,000', { reverse: true });
jQuery('.pembayaran_1_dp').mask('000,000,000,000', { reverse: true });

jQuery('#invest_molding').mask('000,000,000,000', { reverse: true });

jQuery('#bayar_pembayaran').mask('000.000.000', { reverse: false });
jQuery('#pembayaran_1').mask('000,000,000,000', { reverse: true });
jQuery('#pembayaran_2').mask('000,000,000,000', { reverse: true });
jQuery('#pembayaran_3').mask('000,000,000,000', { reverse: true });
jQuery('#pembayaran_4').mask('000,000,000,000', { reverse: true });
jQuery('#pembayaran_5').mask('000,000,000,000', { reverse: true });
jQuery('#pembayaran_6').mask('000,000,000,000', { reverse: true });
jQuery('#pembayaran_7').mask('000,000,000,000', { reverse: true });
jQuery('#pembayaran_8').mask('000,000,000,000', { reverse: true });
jQuery('#pembayaran_9').mask('000,000,000,000', { reverse: true });
jQuery('#pembayaran_10').mask('000,000,000,000', { reverse: true });


function spkPo(penjualan_id_primary, performa_id_relation, performa_header_id, biaya_kirim, client_alamat, client_cp, client_cp_posisi, client_id, client_kota, client_nama, client_telp, jenis_penjualan, karyawan_id, penjualan_global_diskon, penjualan_grandtotal, penjualan_id, penjualan_jumlah_pembayaran, penjualan_keterangan, penjualan_status, penjualan_status_pembayaran, penjualan_tanggal, penjualan_tanggal_kirim, penjualan_total, penjualan_void_keterangan, penjualan_total_qty) {
	var invoice_penjualan = '';
	var no_invoice_penjualan = 0;
	jQuery.ajax({
		type: 'POST',
		url: "" + BASE_API + "/spk-po",
		dataType: 'JSON',
		data: {
			karyawan_id: localStorage.getItem("user_id"),
			performa_header_id: performa_header_id,
			jenis_penjualan: jenis_penjualan,
			penjualan_id_primary:penjualan_id
		},
		beforeSend: function () {
			invoice_penjualan += '<table width="100%" border="0">';
			invoice_penjualan += '	<tr>';
			invoice_penjualan += '		<td colspan="6" align="center"><h2>SPK</h2></td>';
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

					invoice_penjualan += '		<tr>';
					invoice_penjualan += '			<td width="5%" class="label-cell text-align-left" style="border-top: solid 1px; border-left: solid 1px; "><center>' + (no_invoice_penjualan += 1) + '</center></td>';
					invoice_penjualan += '			<td width="25%" class="label-cell text-align-left" style="border-top: solid 1px; border-left: solid 1px; "><center>' + val.penjualan_jenis + '<br><img src="' + BASE_PATH_IMAGE_PERFORMA + '/' + val.gambar + '" width="70%"></center></td>';
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
				}else{
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
				invoice_penjualan += '          <td style=" border-right: solid 1px; border-bottom: solid 1px; font-weight:bold;" width="34%" align="center"><img src="https://tasindo-sale-webservice.digiseminar.id/customer_logo/' + data.data[0].customer_logo_bordir + '" width="80%" /> </td>';
				if (data.data[0].customer_logo_tambahan != "") {
					invoice_penjualan += '          <td style=" border-right: solid 1px; border-bottom: solid 1px; font-weight:bold;" width="33%" align="center"><img src="https://tasindo-sale-webservice.digiseminar.id/customer_logo/' + data.data[0].customer_logo_tambahan + '" width="80%" /> </td>';
				} else {
					invoice_penjualan += '          <td style=" border-right: solid 1px; border-bottom: solid 1px; font-weight:bold;" width="33%" align="center">Tidak Ada Gambar</td>';

				}
				invoice_penjualan += '      </tr>';
				invoice_penjualan += '	</table>';



			}

			console.log(invoice_penjualan);
			let options = {
				documentSize: 'A4',
				type: 'share',
				fileName: 'report_' + client_nama + '.pdf'
			}

			pdf.fromData(invoice_penjualan, options)
				.then((stats) => console.log('status', stats))
				.catch((err) => console.err(err))
		},
		error: function (xmlhttprequest, textstatus, message) {
		}
	});
}

function fullReport(penjualan_id_primary, performa_id_relation, performa_header_id, biaya_kirim, client_alamat, client_cp, client_cp_posisi, client_id, client_kota, client_nama, client_telp, jenis_penjualan, karyawan_id, penjualan_global_diskon, penjualan_grandtotal, penjualan_id, penjualan_jumlah_pembayaran, penjualan_keterangan, penjualan_status, penjualan_status_pembayaran, penjualan_tanggal, penjualan_tanggal_kirim, penjualan_total, penjualan_void_keterangan, penjualan_total_qty) {
	var invoice_penjualan = '';
	var pembayaran_1 = '';
	var sj_content = '';
	jQuery.ajax({
		type: 'POST',
		url: "" + BASE_API + "/full-report",
		dataType: 'JSON',
		data: {
			karyawan_id: localStorage.getItem("user_id"),
			performa_header_id: performa_header_id,
			jenis_penjualan: jenis_penjualan
		},
		beforeSend: function () {
			app.dialog.preloader('Mengambil Data Penjualan');
			if (penjualan_status_pembayaran == "Lunas") {
				var style_table = "background-image:url('https://tasindo-sale-webservice.digiseminar.id/lunas/lunas.jpg'); border:none;  background-position: center;  background-size:45% auto; margin:0px; background-repeat:no-repeat";
			} else {
				var style_table = "border-spacing: 0; background-color:white; color:black;";
			}
			invoice_penjualan += '<table width="100%" border="0" style="' + style_table + '">';
			invoice_penjualan += '<tr>';
			invoice_penjualan += '<td colspan="6" style="font-weight:bold;" align="right">' + moment().format('DD-MMM-YYYY') + '</td>';
			invoice_penjualan += '</tr>';
			invoice_penjualan += '<tr>';
			invoice_penjualan += '<td colspan="6" style="font-weight:bold;" align="center">RINCIAN TRANSAKSI <br> </td>';
			invoice_penjualan += '</tr>';
			invoice_penjualan += '	<tr>';
			invoice_penjualan += '		<td colspan="6"  align="center"><b>KOPERINDO</b><br>Industri Tas & Koper</td>';
			invoice_penjualan += '	</tr>';
			invoice_penjualan += '	<tr>';
			invoice_penjualan += '		<td colspan="6" align="center">www.koperindo.id';
			invoice_penjualan += '			<hr>';
			invoice_penjualan += '		</td>';
			invoice_penjualan += '	</tr>';
			invoice_penjualan += '<tr>';
			invoice_penjualan += '<td colspan="6" align="left">Kepada Yth : ' + client_nama.replace(/\PT. /g, '').replace(/\PT/g, '').replace(/\CV. /g, '').replace(/\CV/g, '').replace(/\UD. /g, '').replace(/\UD/g, '') + '<br>';
			invoice_penjualan += '<font style="padding:94px;">' + client_kota + '</font>';
			invoice_penjualan += '</td>';
			invoice_penjualan += '<td colspan="3" align="right"></td>';
			invoice_penjualan += '</tr>';
			invoice_penjualan += '<tr>';
			invoice_penjualan += '<td colspan="6" align="center" style="font-size:20px; font-weight:bold;">';
			invoice_penjualan += 'Order';
			invoice_penjualan += '</td>';
			invoice_penjualan += '</tr>';
			invoice_penjualan += '<tr>';
			invoice_penjualan += '<td style=" border-top: solid 1px; border-bottom: solid 1px; border-left: solid 1px; font-weight:bold;" align="center">';
			invoice_penjualan += 'No</td>';
			invoice_penjualan += '<td style="border-top: solid 1px; border-left: solid 1px; border-bottom: solid 1px; font-weight:bold;" align="center">';
			invoice_penjualan += 'No Invoice</td>';
			invoice_penjualan += '<td style="border-top: solid 1px; border-left: solid 1px; border-bottom: solid 1px; font-weight:bold;" align="center">';
			invoice_penjualan += 'Jenis</td>';
			invoice_penjualan += '<td style="border-top: solid 1px; border-left: solid 1px; border-bottom: solid 1px; font-weight:bold;" align="center">Qty</td>';
			invoice_penjualan += '<td style="border-top: solid 1px; border-left: solid 1px; font-weight:bold;" align="center">Price Rp.</td>';
			invoice_penjualan += '<td  style="border-top: solid 1px; border-right: solid 1px; border-left: solid 1px; font-weight:bold;"';
			invoice_penjualan += 'align="center">Total Rp.</td>';
			invoice_penjualan += '</tr>';
		},
		success: function (data) {

			app.dialog.close();

			if (data.data.length != 0) {

				var penjualan_total = 0;
				var invest_molding = data.data[0].invest_molding;
				pembayaran_1 += data.data[0].pembayaran_1;

				invoice_penjualan += '<tbody>';
				jQuery.each(data.data, function (i, val) {
					if (!val.keterangan) {
						var ket_item = '';
					} else {

						var ket_item = '<font color="red"><br>KET :<br>' + val.keterangan + '</font>';

					}

					invoice_penjualan += '<tr>';
					invoice_penjualan += '<td width="5%" class="label-cell text-align-left" style="border-bottom: solid 1px;   border-left: solid 1px; ">';
					invoice_penjualan += '<center>1</center>';
					invoice_penjualan += '</td>';
					invoice_penjualan += '<td width="19%" class="label-cell text-align-left" style="border-bottom: solid 1px; border-left: solid 1px; ">';
					invoice_penjualan += '<center>' + moment(val.pembayaran1_tgl).format('DDMMYY') + '-' + val.penjualan_id.replace(/\INV_/g, '').replace(/^0+/, '') + '</center>';
					invoice_penjualan += '</td>';
					invoice_penjualan += '<td width="19%" class="label-cell text-align-left" style="border-bottom: solid 1px; border-left: solid 1px; ">';
					invoice_penjualan += '<center>' + val.penjualan_jenis + '</center>';
					invoice_penjualan += '</td>';
					invoice_penjualan += '<td width="19%" class="label-cell" style="border-bottom: solid 1px; border-left: solid 1px;">';
					invoice_penjualan += '<center>' + val.penjualan_qty + '</center>';
					invoice_penjualan += '</td>';
					invoice_penjualan += '<td width="19%" align="right" class="label-cell" style="border-top: solid 1px; border-left: solid 1px;">';
					invoice_penjualan += '' + number_format(val.penjualan_harga) + '';
					invoice_penjualan += '</td>';
					invoice_penjualan += '<td width="19%" align="right"  class="label-cell "';
					invoice_penjualan += 'style="border-top:  solid 1px; border-right: solid 1px; border-left: solid 1px;">';
					invoice_penjualan += '' + number_format(val.penjualan_detail_grandtotal) + '';
					invoice_penjualan += '</td>';
					invoice_penjualan += '</tr>';



					penjualan_total += parseInt(val.penjualan_detail_grandtotal);
				});

				if (number_format(data.data[0].invest_molding) != 0) {
					invoice_penjualan += '		<tr>';
					invoice_penjualan += '			<td colspan="4" style="border-top:solid 1px; font-weight:bold;" align="right"></td>';
					invoice_penjualan += '			<td colspan="1" style="border-top: solid 1px; border-left: solid 1px; font-weight:bold;" align="left">';
					invoice_penjualan += '				Molding';
					invoice_penjualan += '			</td>';
					invoice_penjualan += '			<td colspan="1" style="border-top: solid 1px; border-left: solid 1px; border-right: solid 1px; font-weight:bold;" align="left">';
					invoice_penjualan += '				<font style="float:right; ">' + number_format(data.data[0].invest_molding) + '</font>';
					invoice_penjualan += '			</td>';
					invoice_penjualan += '		</tr>';
				}
				invoice_penjualan += '		<tr>';
				invoice_penjualan += '			<td colspan="4" style="font-weight:bold;" align="right"></td>';
				invoice_penjualan += '			<td colspan="1" style="border-top: solid 1px; border-left: solid 1px; font-weight:bold;" align="left">';
				invoice_penjualan += '				Total';
				invoice_penjualan += '			</td>';
				invoice_penjualan += '			<td colspan="1" style=" border-top: solid 1px; border-left: solid 1px; border-right: solid 1px; font-weight:bold;" align="left">';
				invoice_penjualan += '			<font style="float:right;">' + number_format(penjualan_total) + '</font>';
				invoice_penjualan += '			</td>';
				invoice_penjualan += '		</tr>';
				if (number_format(data.data[0].pembayaran_1) != 0) {
					invoice_penjualan += '		<tr>';
					invoice_penjualan += '			<td colspan="4" style="  font-weight:bold;" align="right"></td>';
					invoice_penjualan += '			<td colspan="1" style=" border-top: solid 1px; border-left: solid 1px; font-weight:bold;" align="left">';
					invoice_penjualan += '				Deposit';
					invoice_penjualan += '			</td>';
					invoice_penjualan += '			<td colspan="1" style="border-top: solid 1px; border-left: solid 1px; border-right: solid 1px; font-weight:bold;" align="left">';
					invoice_penjualan += '			<font style="float:right;">' + number_format(data.data[0].pembayaran_1) + '</font>';
					invoice_penjualan += '			</td>';
					invoice_penjualan += '		</tr>';
				}
				if (number_format(data.data[0].biaya_kirim) != 0) {
					//	invoice_penjualan += '		<tr>';
					//	invoice_penjualan += '			<td colspan="4" style="font-weight:bold;" align="right"></td>';
					//	invoice_penjualan += '			<td colspan="1" style="border-top: solid 1px; border-left: solid 1px; font-weight:bold;" align="left">';
					//	invoice_penjualan += '				Biaya Kirim';
					//	invoice_penjualan += '			</td>';
					//	invoice_penjualan += '			<td colspan="1" style=" border-top: solid 1px; border-left: solid 1px; border-right: solid 1px;  font-weight:bold;" align="left">';
					//	invoice_penjualan += '				<font style="float:right; ">' + number_format(biaya_kirim) + '</font>';
					//	invoice_penjualan += '			</td>';
					//	invoice_penjualan += '		</tr>';
				}

				invoice_penjualan += '<tr>';
				invoice_penjualan += '<td colspan="4" style="font-weight:bold;" align="right"></td>';
				invoice_penjualan += '<td colspan="1"';
				invoice_penjualan += '	style="border-top: solid 1px; border-left: solid 1px;  border-left: solid 1px;  border-bottom: solid 1px; font-weight:bold;"';
				invoice_penjualan += '	align="left"> Jumlah </td>';
				invoice_penjualan += '<td colspan="1"';
				invoice_penjualan += '	style="padding-left:10px; border-bottom: solid 1px;  border-top: solid 1px; border-left: solid 1px; border-right: solid 1px; font-weight:bold;"';
				invoice_penjualan += '	align="right">';
				invoice_penjualan += '	<font style="">' + number_format(parseInt(penjualan_total) - parseInt(pembayaran_1)) + '</font>';
				invoice_penjualan += '</td>';
				invoice_penjualan += '</tr>';
				invoice_penjualan += '</tbody>';
				invoice_penjualan += '	</table>';

				jQuery.ajax({
					type: 'POST',
					url: "" + BASE_API + "/detail-pembayaran-multiple",
					dataType: 'JSON',
					data: {
						performa_id: performa_id_relation
					},
					beforeSend: function () {
						app.dialog.preloader('Mengambil Data Pembayaran');
					},
					success: function (data) {
						app.dialog.close();
						invoice_penjualan += '<table width="100%" style="border-spacing: 0; background-color:white; color:black; padding-top:10px;">';
						invoice_penjualan += '<tr>';
						invoice_penjualan += '<td colspan="6" align="center" style="font-size:20px; font-weight:bold;">';
						invoice_penjualan += 'Bayar';
						invoice_penjualan += '</td>';
						invoice_penjualan += '</tr>';
						invoice_penjualan += '<tr>';
						invoice_penjualan += '<td width="5%" class="label-cell text-align-left" style="border-top: solid 1px; border-left: solid 1px; ">';
						invoice_penjualan += '<center>No</center>';
						invoice_penjualan += '</td>';
						invoice_penjualan += '<td width="19%" align="center" style=" border-top: solid 1px; border-left: solid 1px; font-weight:bold;"';
						invoice_penjualan += 'class="numeric-cell ">No Invoice</td>';
						invoice_penjualan += '<td width="19%" align="center" style="border-top: solid 1px; border-left: solid 1px; font-weight:bold;"';
						invoice_penjualan += 'class="numeric-cell ">Tanggal</td>';
						invoice_penjualan += '<td width="19%" align="center" style="border-top: solid 1px; border-left: solid 1px; font-weight:bold;"';
						invoice_penjualan += 'class="numeric-cell ">Bank</td>';
						invoice_penjualan += '<td width="19%" align="center" style="border-top: solid 1px; border-left: solid 1px; font-weight:bold;"';
						invoice_penjualan += 'class="numeric-cell ">Jumlah</td>';
						invoice_penjualan += '<td width="19%" align="center"';
						invoice_penjualan += 'style="border-top: solid 1px; border-left: solid 1px; font-weight:bold; border-right: solid 1px; "';
						invoice_penjualan += 'class="numeric-cell ">Keterangan</td>';
						invoice_penjualan += '</tr>';

						var no_pembayaran = 0;
						jQuery.each(data.pembayaran_data, function (i, item2) {

							if (item2.pembayaran_1 != null) {
								invoice_penjualan += '<tr>';
								invoice_penjualan += '	<td width="5%" class="label-cell text-align-left" style="border-top: solid 1px; border-left: solid 1px; ">';
								invoice_penjualan += '	<center>' + (no_pembayaran += 1) + '</center>';
								invoice_penjualan += '</td>';
								invoice_penjualan += '	<td align="center" width="19%" style="border-top: solid 1px; border-left: solid 1px; " class="numeric-cell ">';
								invoice_penjualan += '		' + moment(item2.pembayaran_tanggal).format('DDMMYY') + '-' + item2.penjualan_id.replace(/\INV_/g, '').replace(/^0+/, '') + '</td>';
								invoice_penjualan += '	<td align="center" width="19%" style="border-top: solid 1px; border-left: solid 1px; " class="numeric-cell ">';
								invoice_penjualan += '		' + moment(item2.pembayaran1_tgl).format('DD-MMM-YY') + '</td>';
								invoice_penjualan += '	<td align="center" width="19%" style="border-top: solid 1px; border-left: solid 1px; " class="numeric-cell ">';
								invoice_penjualan += '		' + item2.bank_1 + '</td>';
								invoice_penjualan += '	<td align="right" width="19%" style="border-top: solid 1px; border-left: solid 1px; " class="numeric-cell ">';
								invoice_penjualan += '		' + number_format(item2.pembayaran_1) + '</td>';
								invoice_penjualan += '	<td align="center" width="19%" style="border-top: solid 1px; border-left: solid 1px; border-right: solid 1px; "';
								invoice_penjualan += '		class="numeric-cell ">' + item2.keterangan_1 + '</td>';
								invoice_penjualan += '</tr>';
							}
							if (item2.pembayaran_2 != null) {
								invoice_penjualan += '<tr>';
								invoice_penjualan += '	<td width="5%" class="label-cell text-align-left" style="border-top: solid 1px; border-left: solid 1px; ">';
								invoice_penjualan += '	<center>' + (no_pembayaran += 1) + '</center>';
								invoice_penjualan += '</td>';
								invoice_penjualan += '	<td align="center" width="19%" style="border-top: solid 1px; border-left: solid 1px; " class="numeric-cell ">';
								invoice_penjualan += '		' + moment(item2.pembayaran_tanggal).format('DDMMYY') + '-' + item2.penjualan_id.replace(/\INV_/g, '').replace(/^0+/, '') + '</td>';
								invoice_penjualan += '	<td align="center" width="19%" style="border-top: solid 1px; border-left: solid 1px; " class="numeric-cell ">';
								invoice_penjualan += '		' + moment(item2.pembayaran2_tgl).format('DD-MMM-YY') + '</td>';
								invoice_penjualan += '	<td align="center" width="19%" style="border-top: solid 1px; border-left: solid 1px; " class="numeric-cell ">';
								invoice_penjualan += '		' + item2.bank_2 + '</td>';
								invoice_penjualan += '	<td align="right" width="19%" style="border-top: solid 1px; border-left: solid 1px; " class="numeric-cell ">';
								invoice_penjualan += '		' + number_format(item2.pembayaran_2) + '</td>';
								invoice_penjualan += '	<td align="center" width="19%" style="border-top: solid 1px; border-left: solid 1px; border-right: solid 1px; "';
								invoice_penjualan += '		class="numeric-cell ">' + item2.keterangan_2 + '</td>';
								invoice_penjualan += '</tr>';
							}

							if (item2.pembayaran_3 != null) {
								invoice_penjualan += '<tr>';
								invoice_penjualan += '	<td width="5%" class="label-cell text-align-left" style="border-top: solid 1px; border-left: solid 1px; ">';
								invoice_penjualan += '	<center>' + (no_pembayaran += 1) + '</center>';
								invoice_penjualan += '</td>';
								invoice_penjualan += '	<td align="center" width="19%" style="border-top: solid 1px; border-left: solid 1px; " class="numeric-cell ">';
								invoice_penjualan += '		' + moment(item2.penjualan_tanggal).format('DDMMYY') + '-' + item2.penjualan_id.replace(/\INV_/g, '').replace(/^0+/, '') + '</td>';
								invoice_penjualan += '	<td align="center" width="19%" style="border-top: solid 1px; border-left: solid 1px; " class="numeric-cell ">';
								invoice_penjualan += '		' + moment(item2.pembayaran3_tgl).format('DD-MMM-YY') + '</td>';
								invoice_penjualan += '	<td align="center" width="19%" style="border-top: solid 1px; border-left: solid 1px; " class="numeric-cell ">';
								invoice_penjualan += '		' + item2.bank_3 + '</td>';
								invoice_penjualan += '	<td align="right" width="19%" style="border-top: solid 1px; border-left: solid 1px; " class="numeric-cell ">';
								invoice_penjualan += '		' + number_format(item2.pembayaran_3) + '</td>';
								invoice_penjualan += '	<td align="center" width="19%" style="border-top: solid 1px; border-left: solid 1px; border-right: solid 1px; "';
								invoice_penjualan += '		class="numeric-cell ">' + item2.keterangan_3 + '</td>';
								invoice_penjualan += '</tr>';
							}

							if (item2.pembayaran_4 != null) {
								invoice_penjualan += '<tr>';
								invoice_penjualan += '	<td width="5%" class="label-cell text-align-left" style="border-top: solid 1px; border-left: solid 1px; ">';
								invoice_penjualan += '	<center>' + (no_pembayaran += 1) + '</center>';
								invoice_penjualan += '</td>';
								invoice_penjualan += '	<td align="center" width="19%" style="border-top: solid 1px; border-left: solid 1px; " class="numeric-cell ">';
								invoice_penjualan += '		131220-1-1</td>';
								invoice_penjualan += '	<td align="center" width="19%" style="border-top: solid 1px; border-left: solid 1px; " class="numeric-cell ">';
								invoice_penjualan += '		' + moment(item2.pembayaran4_tgl).format('DD-MMM-YY') + '</td>';
								invoice_penjualan += '	<td align="center" width="19%" style="border-top: solid 1px; border-left: solid 1px; " class="numeric-cell ">';
								invoice_penjualan += '		' + item2.bank_4 + '</td>';
								invoice_penjualan += '	<td align="right" width="19%" style="border-top: solid 1px; border-left: solid 1px; " class="numeric-cell ">';
								invoice_penjualan += '		' + number_format(item2.pembayaran_4) + '</td>';
								invoice_penjualan += '	<td align="center" width="19%" style="border-top: solid 1px; border-left: solid 1px; border-right: solid 1px; "';
								invoice_penjualan += '		class="numeric-cell ">' + item2.keterangan_4 + '</td>';
								invoice_penjualan += '</tr>';
							}

							if (item2.pembayaran_5 != null) {
								invoice_penjualan += '<tr>';
								invoice_penjualan += '	<td width="5%" class="label-cell text-align-left" style="border-top: solid 1px; border-left: solid 1px; ">';
								invoice_penjualan += '	<center>' + (no_pembayaran += 1) + '</center>';
								invoice_penjualan += '</td>';
								invoice_penjualan += '	<td align="center" width="19%" style="border-top: solid 1px; border-left: solid 1px; " class="numeric-cell ">';
								invoice_penjualan += '		131220-1-1</td>';
								invoice_penjualan += '	<td align="center" width="19%" style="border-top: solid 1px; border-left: solid 1px; " class="numeric-cell ">';
								invoice_penjualan += '		' + moment(item2.pembayaran5_tgl).format('DD-MMM-YY') + '</td>';
								invoice_penjualan += '	<td align="center" width="19%" style="border-top: solid 1px; border-left: solid 1px; " class="numeric-cell ">';
								invoice_penjualan += '		' + item2.bank_5 + '</td>';
								invoice_penjualan += '	<td align="right" width="19%" style="border-top: solid 1px; border-left: solid 1px; " class="numeric-cell ">';
								invoice_penjualan += '		' + number_format(item2.pembayaran_5) + '</td>';
								invoice_penjualan += '	<td align="center" width="19%" style="border-top: solid 1px; border-left: solid 1px; border-right: solid 1px; "';
								invoice_penjualan += '		class="numeric-cell ">' + item2.keterangan_5 + '</td>';
								invoice_penjualan += '</tr>';
							}

						});
						invoice_penjualan += '<tr>';
						invoice_penjualan += '<td align="center" colspan="6" width="10%" style="border-top: solid 1px; " class="numeric-cell ">';
						invoice_penjualan += '</td>';
						invoice_penjualan += '</tr>';
						invoice_penjualan += '</table>';


						//Surat Jalan
						invoice_penjualan += '<table width="100%" style="border-spacing: 0; background-color:white; color:black; padding-top:10px;">';
						invoice_penjualan += '<tr>';
						invoice_penjualan += '<td colspan="7" align="center" style="font-size:20px; font-weight:bold;">';
						invoice_penjualan += 'Kirim';
						invoice_penjualan += '</td>';
						invoice_penjualan += '</tr>';

						invoice_penjualan += '<tr>';
						invoice_penjualan += '<td width="5%" class="label-cell text-align-left" style="border-top: solid 1px; border-left: solid 1px; ">';
						invoice_penjualan += '<center>No</center>';
						invoice_penjualan += '</td>';
						invoice_penjualan += '<td width="19%" align="center" style="border-top: solid 1px; border-left: solid 1px; font-weight:bold;"';
						invoice_penjualan += 'class="numeric-cell ">No Invoice</td>';
						invoice_penjualan += '<td width="19%" align="center" style="border-top: solid 1px; border-left: solid 1px; font-weight:bold;"';
						invoice_penjualan += 'class="numeric-cell ">Tanggal</td>';
						invoice_penjualan += '<td width="19%" align="center" style="border-top: solid 1px; border-left: solid 1px; font-weight:bold;"';
						invoice_penjualan += 'class="numeric-cell ">No Sj</td>';
						invoice_penjualan += '<td width="19%" align="center" style="border-top: solid 1px; border-left: solid 1px; font-weight:bold;"';
						invoice_penjualan += 'class="numeric-cell ">Jumlah</td>';
						invoice_penjualan += '<td width="19%" align="center"';
						invoice_penjualan += 'style="border-right: solid 1px; border-top: solid 1px; border-left: solid 1px; font-weight:bold;"';
						invoice_penjualan += 'class="numeric-cell ">Plat</td>';
						invoice_penjualan += '</tr>';


						var test2 = "";
						jQuery.each(data.pembayaran_data, function (i3, item3) {
							jQuery.ajax({
								type: 'POST',
								url: "" + BASE_API + "/get-penjualan-surat-jalan",
								dataType: 'JSON',
								data: {
									penjualan_id: item3.penjualan_id
								},
								beforeSend: function () {
									app.dialog.preloader('Mengambil Data Surat Jalan');

								},
								success: function (data) {
									app.dialog.close();
									$.each(data.data, function (ij1, sj2) {
										jQuery.ajax({
											type: 'POST',
											url: "" + BASE_API + "/get-surat-jalan-detail",
											dataType: 'JSON',
											data: {
												penjualan_detail_performa_id: sj2.penjualan_detail_performa_id
											},
											beforeSend: function () {
											},
											success: function (data) {

												var no_surat = 0;
												jQuery.each(data.data, function (i, val) {
													if (val.no_surat_jalan != null) {

														sj_content += '<tr>';
														sj_content += '<td  align="left" style="vertical-align:top;" width="47%">' + val.penjualan_jenis + '</td>';
														sj_content += '<td align="center"  style="vertical-align:top;" width="6%">:</td>';
														sj_content += '<td align="right" style="vertical-align:top;" width="47%">' + val.jumlah_kirim + '</td>';
														sj_content += '</tr>';


														invoice_penjualan += '<tr>';
														invoice_penjualan += '<td width="5%" class="label-cell text-align-left" style="border-top: solid 1px; border-left: solid 1px; ">';
														invoice_penjualan += '<center>' + (no_surat += 1) + '</center>';
														invoice_penjualan += '</td>';
														invoice_penjualan += '<td width="19%" align="center" style="border-top: solid 1px; border-left: solid 1px; " class="numeric-cell ">';
														invoice_penjualan += '' + item3.penjualan_id + '</td>';
														invoice_penjualan += '<td width="19%" align="center" style="border-top: solid 1px; border-left: solid 1px; " class="numeric-cell ">';
														invoice_penjualan += '' + moment(val.tanggal).format('DD-MMM-YY') + '</td>';
														invoice_penjualan += '<td width="19%" align="center" style="border-top: solid 1px; border-left: solid 1px; " class="numeric-cell ">';
														invoice_penjualan += '' + val.no_surat_jalan + '</td>';
														invoice_penjualan += '<td width="19%" align="center" style="border-top: solid 1px; border-left: solid 1px; " class="numeric-cell ">' + val.jumlah_kirim + '';
														invoice_penjualan += '</td>';
														invoice_penjualan += '<td width="19%" align="center" style="border-right: solid 1px; border-top: solid 1px; border-left: solid 1px; "';
														invoice_penjualan += 'class="numeric-cell ">';
														invoice_penjualan += '' + val.plat + '</td>';
														invoice_penjualan += '</tr>';

													}
												});


											},
											error: function (xmlhttprequest, textstatus, message) {
											}
										});
									});
								},
								error: function (xmlhttprequest, textstatus, message) {
								}
							});

						});


						app.dialog.preloader('Cetak Data');
						setTimeout(function () {
							app.dialog.close();
							invoice_penjualan += '<tr>';
							invoice_penjualan += '<td align="center" colspan="7" width="10%" style="border-top: solid 1px; " class="numeric-cell ">';
							invoice_penjualan += '</td>';
							invoice_penjualan += '</tr>';
							invoice_penjualan += '</table>';


							invoice_penjualan += '<table width="100%" style="padding-top:15px;">';
							invoice_penjualan += '<tr>';
							invoice_penjualan += '<td width="50%" align="left" style="vertical-align:top;">';
							invoice_penjualan += '<table border="0" width="80%" style="border-spacing: 0; background-color:white; color:black; padding-top:10px;">';
							invoice_penjualan += '<tr>';
							invoice_penjualan += '<td  width="100%" align="center"  colspan="3"><b>Nilai Transaksi</b></td>';
							invoice_penjualan += '</tr>';
							invoice_penjualan += '<tr>';
							invoice_penjualan += '<td  align="left" width="47%">';
							invoice_penjualan += 'Total Nilai Order';
							invoice_penjualan += '</td>';
							invoice_penjualan += '<td  align="center"  width="6%">';
							invoice_penjualan += ':';
							invoice_penjualan += '</td>';
							invoice_penjualan += '<td  align="right"   width="47%">';
							invoice_penjualan += '' + number_format(data.penjualan_grandtotal) + '';
							invoice_penjualan += '</td>';
							invoice_penjualan += '</tr>';
							invoice_penjualan += '<tr>';
							invoice_penjualan += '<td  align="left"  width="47%">';
							invoice_penjualan += 'Total Nilai Bayar';
							invoice_penjualan += '</td>';
							invoice_penjualan += '<td align="center"   width="6%">';
							invoice_penjualan += ':';
							invoice_penjualan += '</td>';
							invoice_penjualan += '<td  align="right" width="47%">';
							invoice_penjualan += '' + number_format(data.penjualan_jumlah_pembayaran) + '';
							invoice_penjualan += '</td>';
							invoice_penjualan += '</tr>';
							invoice_penjualan += '<tr>';
							invoice_penjualan += '<td align="left"  width="47%">';
							invoice_penjualan += 'Sisa Pembayaran';
							invoice_penjualan += '</td>';
							invoice_penjualan += '<td align="center"  width="6%">';
							invoice_penjualan += ':';
							invoice_penjualan += '</td>';
							invoice_penjualan += '<td align="right"   width="47%">';
							invoice_penjualan += '' + number_format(parseFloat(data.penjualan_grandtotal) - parseFloat(data.penjualan_jumlah_pembayaran)) + '';
							invoice_penjualan += '</td>';
							invoice_penjualan += '</tr>';
							invoice_penjualan += '</table>';
							invoice_penjualan += '</td>';
							invoice_penjualan += '<td width="50%"  align="right" style="vertical-align:top;">';
							invoice_penjualan += '<table border="0" width="80%" style="border-spacing: 0; background-color:white; color:black; padding-top:10px;">';
							invoice_penjualan += '<tr>';
							invoice_penjualan += '<td  align="center" colspan="3"><b>Total Terkirim</b></td>';
							invoice_penjualan += '</tr>';
							invoice_penjualan += '' + sj_content + '';

							invoice_penjualan += '</table>';
							invoice_penjualan += '</td>';
							invoice_penjualan += '</tr>';
							invoice_penjualan += '</table>';

							console.log(invoice_penjualan);
							console.log('cobavariable: ' + test2 + '');
							let options = {
								documentSize: 'A4',
								type: 'share',
								fileName: 'report_' + client_nama + '.pdf'
							}

							pdf.fromData(invoice_penjualan, options)
								.then((stats) => console.log('status', stats))
								.catch((err) => console.err(err))
						}, 5000);
					},
					error: function (xmlhttprequest, textstatus, message) {
					}
				});
			}
		},
		error: function (xmlhttprequest, textstatus, message) {
		}
	});

}

function deletePerformaHeaderPenjualanPage(performa_header_id, status) {
	if (status == 'tidak_aktif') {
		jQuery.ajax({
			type: "POST",
			url: "" + BASE_API + "/delete-performa",
			dataType: 'JSON',
			data: { performa_header_id: performa_header_id },
			beforeSend: function () {
				app.dialog.progress();
			},
			success: function (data) {
				app.dialog.close();
				if (data.status == 1) {
					app.dialog.alert('Berhasil Menghapus Performa', function () {
						getPerformaHeaderPenjualan();
					});
				} else {
					app.dialog.alert('Gagal Menghapus Performa', function () {
						getPerformaHeaderPenjualan();
					});
				}
			},
			error: function (xmlhttprequest, textstatus, message) {
				app.dialog.close();
				app.dialog.alert('Internet Tidak Stabil / Gangguan Server', function () {
					app.views.main.router.navigate(app.views.main.router.currentRoute.url, {
						ignoreCache: true,
						reloadCurrent: true
					});
				});
			}
		});
	} else {
		app.dialog.create({
			title: 'Hapus Proforma',
			text: 'Apakah Anda Yakin Menghapus Proforma ini ? ',
			cssClass: 'custom-dialog',
			closeByBackdropClick: 'true',
			buttons: [
				{
					text: 'Ya',
					onClick: function () {
						jQuery.ajax({
							type: "POST",
							url: "" + BASE_API + "/delete-performa",
							dataType: 'JSON',
							data: { performa_header_id: performa_header_id },
							beforeSend: function () {
								app.dialog.progress();
							},
							success: function (data) {
								app.dialog.close();
								if (data.status == 1) {
									app.dialog.alert('Berhasil Menghapus Performa', function () {
										getPerformaHeaderPenjualan();
									});
								} else {
									app.dialog.alert('Gagal Menghapus Performa', function () {
										getPerformaHeaderPenjualan();
									});
								}
							},
							error: function (xmlhttprequest, textstatus, message) {
								app.dialog.close();
								app.dialog.alert('Internet Tidak Stabil / Gangguan Server', function () {
									app.views.main.router.navigate(app.views.main.router.currentRoute.url, {
										ignoreCache: true,
										reloadCurrent: true
									});
								});
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
}

function penjualanGetPerformaDownload(performa_header_id, client_kota, client_nama, performa_tanggal_kirim, performa_total_qty) {
	var proforma_data = "";
	jQuery.ajax({
		type: 'POST',
		url: "" + BASE_API + "/get-performa",
		dataType: 'JSON',
		data: {
			karyawan_id: localStorage.getItem("user_id"),
			performa_header_id: performa_header_id
		},
		beforeSend: function () {
			proforma_data += '<table width="100%" border="0">';
			proforma_data += '	<tr>';
			proforma_data += '		<td colspan="6"  align="center"><b>KOPERINDO</b><br>Industri Tas & Koper</td>';
			proforma_data += '	</tr>';
			proforma_data += '	<tr>';
			proforma_data += '		<td colspan="6" align="center">www.koperindo.id';
			proforma_data += '			<hr>';
			proforma_data += '		</td>';
			proforma_data += '	</tr>';
			proforma_data += '	<tr>';
			proforma_data += '		<td colspan="5" align="center">Proforma</td>';
			proforma_data += '	</tr>';
			proforma_data += '	<tr>';
			proforma_data += '		<td colspan="3" align="left" >Kepada Yth :  ' + client_nama.replace(/\PT. /g, '').replace(/\PT/g, '').replace(/\CV. /g, '').replace(/\CV/g, '').replace(/\UD. /g, '').replace(/\UD/g, '') + ' <br><font style="padding:94px;"> ' + client_kota + '</font></td>';
			proforma_data += '		<td colspan="2" align="right">' + moment(performa_tanggal_kirim).format('DDMMYY') + '-' + performa_header_id.replace(/\PI_/g, '').replace(/^0+/, '') + '</td>';
			proforma_data += '	</tr>';
			proforma_data += '	<tr>';
			proforma_data += '		<td colspan="2" style="border-top: solid 1px; border-left: solid 1px; font-weight:bold;" align="center">Spesifikasi</td>';
			proforma_data += '		<td style="border-top: solid 1px; border-left: solid 1px; font-weight:bold;" align="center">Qty</td>';
			proforma_data += '		<td style="border-top: solid 1px; border-left: solid 1px; font-weight:bold;" align="center">Price Rp.</td>';
			proforma_data += '		<td style="border-top: solid 1px; border-right: solid 1px; border-left: solid 1px; font-weight:bold;" align="center">Total Rp.</td>';
			proforma_data += '	</tr>';
		},
		success: function (data) {

			if (data.data.length != 0) {

				var penjualan_total = 0;

				proforma_data += '<tbody>';
				jQuery.each(data.data, function (i, val) {
					if (!val.keterangan) {
						var ket_item = '';
					} else {

						var ket_item = '<font color="red"><br>KET :<br>' + val.keterangan + '</font>';

					}

					proforma_data += '		<tr>';
					proforma_data += '			<td width="30%" class="label-cell text-align-left" style="border-top: solid 1px; border-left: solid 1px; "><center>' + val.jenis + '<br><img src="' + BASE_PATH_IMAGE_PERFORMA + '/' + val.gambar + '" width="70%"></center></td>';
					proforma_data += '			<td width="20%" class="label-cell" align="left" style="border-top: solid 1px; white-space: pre;">SPESIFIKASI<br>' + val.spesifikasi + '<br>' + ket_item + '</td>';
					proforma_data += '				<td width="10%" class="label-cell" style="border-top: solid 1px; border-left: solid 1px;">';
					proforma_data += '					<center>' + val.qty + '</center>';
					proforma_data += '				</td>';
					proforma_data += '				<td width="20%" class="label-cell" style="border-top: solid 1px; border-left: solid 1px;">';
					proforma_data += '					<center>' + number_format(val.price) + '</center>';
					proforma_data += '				</td>';
					proforma_data += '				<td width="20%" colspan="2" class="label-cell text-align-center" style="border-top:  solid 1px; border-right: solid 1px; border-left: solid 1px;">';
					proforma_data += '					<center>' + number_format(val.total) + '</center>';
					proforma_data += '				</td>';
					proforma_data += '			</tr>';

					penjualan_total += parseInt(val.total);
				});
				proforma_data += '</tbody>';
				proforma_data += '		<tr>';
				proforma_data += '			<td colspan="3" style=" border-top: solid 1px;  font-weight:bold;" align="right"></td>';
				proforma_data += '			<td colspan="1" style="border-bottom: solid 1px; border-top: solid 1px; border-left: solid 1px; font-weight:bold;" align="left">';
				proforma_data += '				Total';
				proforma_data += '			</td>';
				proforma_data += '			<td colspan="1" style="border-bottom: solid 1px; padding-left:10px; border-top: solid 1px; border-left: solid 1px; border-right: solid 1px; font-weight:bold;" align="left">';
				proforma_data += '				<font style="float:right; padding-right:10px;">' + number_format(penjualan_total) + '</font>';
				proforma_data += '			</td>';
				proforma_data += '		</tr>';


				if (number_format(data.data[0].biaya_kirim) != 0) {
					//	proforma_data += '		<tr>';
					//	proforma_data += '			<td colspan="3" style="font-weight:bold;" align="right"></td>';
					//	proforma_data += '			<td colspan="1" style="border-top: solid 1px; border-left: solid 1px; font-weight:bold;" align="left">';
					//	proforma_data += '				Biaya Kirim';
					//	proforma_data += '			</td>';
					//	proforma_data += '			<td colspan="1" style="padding-left:10px; border-top: solid 1px; border-left: solid 1px; border-right: solid 1px;  font-weight:bold;" align="left">';
					//	proforma_data += '				<font style="float:right; padding-right:10px;">' + number_format(data.data[0].biaya_kirim) + '</font>';
					//	proforma_data += '			</td>';
					//	proforma_data += '		</tr>';
				}

				//	proforma_data += '		<tr>';
				//	proforma_data += '			<td colspan="3" style="font-weight:bold;" align="right"></td>';
				//	proforma_data += '			<td colspan="1" style="border-top: solid 1px; border-left: solid 1px; border-bottom: solid 1px; font-weight:bold;" align="left">';
				//	proforma_data += '				Jumlah';
				//	proforma_data += '			</td>';
				//	proforma_data += '			<td colspan="1" style="padding-left:10px; border-top: solid 1px; border-left: solid 1px; border-right: solid 1px; border-bottom: solid 1px; font-weight:bold;" align="left">';
				//	proforma_data += '				 <font style="float:right; padding-right:10px;">' + number_format((parseInt(penjualan_total))) + '</font>';
				//	proforma_data += '			</td>';
				//	proforma_data += '		</tr>'
				proforma_data += '		<tr>';
				proforma_data += '			<td colspan="5">Ket :</td>';
				proforma_data += '		</tr>';
				proforma_data += '	</table>';
				proforma_data += '	<table width="100%" border="0">';
				proforma_data += '      <tr>';
				proforma_data += '          <td width="1%">-</td>';
				proforma_data += '          <td width="70%">Packing finishing plastic</td>';
				proforma_data += '          <td width="16%" align="center"></td>';
				proforma_data += '          <td width="13%" align="center"></td>';
				proforma_data += '      </tr>';
				proforma_data += '      <tr>';
				proforma_data += '          <td width="1%">-</td>';
				proforma_data += '          <td width="70%">Harga produk belum termasuk biaya kirim</td>';
				proforma_data += '          <td width="16%" align="center"></td>';
				proforma_data += '          <td width="13%" align="center"></td>';
				proforma_data += '      </tr>';
				proforma_data += '      <tr>';
				proforma_data += '          <td width="1%">-</td>';
				proforma_data += '          <td width="70%">Komplain lebih 3 hari setelah barang di terima tidak dapat di layani</td>';
				proforma_data += '          <td width="16%" align="center"></td>';
				proforma_data += '          <td width="13%" align="center"></td>';
				proforma_data += '      </tr>';
				proforma_data += '      <tr>';
				proforma_data += '          <td width="1%">-</td>';
				proforma_data += '          <td width="70%">DP 50% sebagai deposit, 50% untuk pelunasan Sebelum Shipping </td>';
				proforma_data += '          <td width="16%" align="center" style="">Sales</td>';
				proforma_data += '          <td width="13%" align="center" style="">Customer</td>';
				proforma_data += '      </tr>';
				proforma_data += '		<tr>';
				proforma_data += '			<td colspan="1"></td>';
				proforma_data += '			<td colspan="2"></td>';
				proforma_data += '		</tr>';
				proforma_data += '	</table>';
				proforma_data += '	<table border="0" width="100%" style="border-spacing: 0;">';
				proforma_data += '      <tr>';
				proforma_data += '          <td width="50%" align="left" colspan="3" class=""><b>Rekening</b></td>';
				proforma_data += '          <td width="20%" align="left"  class=""><b></b></td>';
				proforma_data += '          <td width="15%" align="center" class=""></td>';
				proforma_data += '          <td width="15%" align="center" class=""></td>';
				proforma_data += '      </tr>';
				proforma_data += '      <tr>';
				proforma_data += '          <td style="border-top: solid 1px; border-left: solid 1px; padding:4px;" width="2%" align="left" class="">BCA</td>';
				proforma_data += '          <td style="border-top: solid 1px; padding:4px;" width="1%" align="left" class="">:</td>';
				proforma_data += '          <td style="border-top: solid 1px;  border-right: solid  1px; padding:2px;" width="47%" align="left" class="">01831 29551 a.n Sutono</td>';
				proforma_data += '          <td width="20%" align="center" class=""></td>';
				proforma_data += '          <td width="15%" align="center" class=""></td>';
				proforma_data += '          <td width="15%" align="center" class=""></td>';
				proforma_data += '      </tr>';
				proforma_data += '      <tr>';
				proforma_data += '          <td style="border-bottom: solid 1px; border-top: solid 1px; border-left: solid 1px; padding:4px;" width="2%" align="left" class="">Mandiri</td>';
				proforma_data += '          <td style="border-bottom: solid 1px;  border-top: solid 1px; padding:4px;" width="1%" align="left" class="">:</td>';
				proforma_data += '          <td style="border-bottom: solid 1px;  border-top: solid 1px;  border-right: solid  1px; padding:2px;" width="47%" align="left" class="">141 000 518 7422 a.n Sutono</td>';
				proforma_data += '          <td width="20%" align="left"  class=""><b></b></td>';
				proforma_data += '          <td width="15%" align="center"  style="" class="">' + localStorage.getItem("karyawan_nama") + '</td>';
				proforma_data += '          <td width="15%" align="center" style="" class="">' + client_nama.replace(/\PT. /g, '').replace(/\PT/g, '').replace(/\CV. /g, '').replace(/\CV/g, '').replace(/\UD. /g, '').replace(/\UD/g, '') + '</td>';
				proforma_data += '      </tr>';
				proforma_data += '	</table>';

			}

			console.log(proforma_data);
			let options = {
				documentSize: 'A4',
				type: 'share',
				fileName: 'Proforma_' + client_nama + '.pdf'
			}

			var spk1_pdf = proforma_data;
			pdf.fromData(spk1_pdf, options)
				.then((stats) => console.log('status', stats))
				.catch((err) => console.err(err))
		},
		error: function (xmlhttprequest, textstatus, message) {
		}
	});

}

function getSuratJalanDetailPenjualan(penjualan_id, penjualan_qty) {
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
			getSuratJalanListPenjualan(penjualan_id, penjualan_qty);
			var penjualan_value = "";

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

						$('#jumlah_stok_item_' + item2.penjualan_detail_performa_id + '').html(total_fix);
						$('#kirim_stok_item_' + item2.penjualan_detail_performa_id + '').html(stock_item);
						$('#total_stok_item_' + item2.penjualan_detail_performa_id + '').html(jumlah_pesanan);

					},
					error: function (xmlhttprequest, textstatus, message) {
					}
				});

				penjualan_value += '<tr>';
				penjualan_value += '<td width="25%" style="border-left:1px solid gray;  border-right:1px solid gray; border-bottom:1px solid gray;"  class="label-cell">' + item2.penjualan_jenis + '</td>';
				penjualan_value += '<td align="center" width="25%" style="border-left:1px solid gray;  border-right:1px solid gray; border-bottom:1px solid gray;"  class="label-cell" id="total_stok_item_' + item2.penjualan_detail_performa_id + '" ></td>';
				penjualan_value += '<td align="center" width="25%" style="border-left:1px solid gray;  border-right:1px solid gray; border-bottom:1px solid gray;"  class="label-cell" id="kirim_stok_item_' + item2.penjualan_detail_performa_id + '" ></td>';
				penjualan_value += '<td align="center" width="25%" style="border-left:1px solid gray;  border-right:1px solid gray; border-bottom:1px solid gray;"  class="label-cell" id="jumlah_stok_item_' + item2.penjualan_detail_performa_id + '" ></td>';
				penjualan_value += '</tr>'


			});


			$$('#detail_surat_jalan_penjualan').html(penjualan_value);

		},
		error: function (xmlhttprequest, textstatus, message) {
		}
	});
}

function getSuratJalanListPenjualan(penjualan_id, penjualan_qty) {
	jQuery.ajax({
		type: 'POST',
		url: "" + BASE_API + "/get-surat-jalan-list",
		dataType: 'JSON',
		data: {
			penjualan_id: penjualan_id
		},
		beforeSend: function () {
			app.dialog.preloader('Harap Tunggu');
			$$('#terkirim_sj_penjualan').html('-');
			$$('#kurang_terkirim_sj_penjualan').html('-');
		},
		success: function (data) {
			app.dialog.close();
			var total_stock = 0;
			$$('#stok_sj_penjualan').html(data.penjualan_total_qty_detail);
			var penjualan_value = "";
			var total_qty = 0;
			if (data.data.length != 0) {
				$.each(data.data, function (i_qty, item_qty) {
					total_qty += item_qty.jumlah_kirim;
				});
				$$('#terkirim_sj_penjualan').html(total_qty);
				$$('#kurang_terkirim_sj_penjualan').html($$('#stok_sj_penjualan').html() - total_qty);
			}
			if (data.data.length != 0) {
				$.each(data.data_distinct, function (i_d, item_d) {
					penjualan_value += '<tr>';
					penjualan_value += '<td  style="border-left:1px solid gray;  border-right:1px solid gray; border-bottom:1px solid gray;" align="center"  class="label-cell">' + item_d.no_surat_jalan + '</td>';
					penjualan_value += '<td align="center" colspan="4" style="border-left:1px solid gray;  border-right:1px solid gray; border-bottom:1px solid gray;"  class="label-cell">' + moment(item_d.tanggal).format('DD-MMM-YY hh:mm') + '</td>';
					penjualan_value += '</tr>';
					penjualan_value += '<tr>';
					penjualan_value += '<td align="center" width="12%" style="border-left:1px solid gray;  border-right:1px solid gray; border-bottom:1px solid gray;"  class="label-cell bg-dark-gray-young">Jumlah</td>';
					penjualan_value += '<td align="center" width="18%" style="border-left:1px solid gray;  border-right:1px solid gray; border-bottom:1px solid gray;"  class="label-cell bg-dark-gray-young">Type</td>';
					penjualan_value += '<td align="center" width="17%" style="border-left:1px solid gray;  border-right:1px solid gray; border-bottom:1px solid gray;"  class="label-cell bg-dark-gray-young">Plat</td>';
					penjualan_value += '<td align="center" width="20%" style="border-left:1px solid gray;  border-right:1px solid gray; border-bottom:1px solid gray;"  class="label-cell bg-dark-gray-young">Kendaraan</td>';
					penjualan_value += '<td align="center" width="15%" style="border-left:1px solid gray;  border-right:1px solid gray; border-bottom:1px solid gray;"  class="label-cell bg-dark-gray-young">Pengirim</td>';
					penjualan_value += '</tr>';
					$.each(data.data, function (i, item) {
						if (item.jumlah_kirim != 0) {
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
			} else {
				app.dialog.alert('Tidak Ada Surat Jalan');
			}
			$$('#detail_surat_jalan_history_penjualan').html(penjualan_value);
		},
		error: function (xmlhttprequest, textstatus, message) {
		}
	});
}

function singlePenjualan(performa_header_id) {
	localStorage.setItem("performa_header_id", performa_header_id);
	localStorage.setItem("type_penjualan_input", "single");
	return app.views.main.router.navigate('/penjualan-input-single');
}

function multiplePenjualan(performa_header_id) {
	localStorage.setItem("performa_header_id", performa_header_id);
	localStorage.setItem("type_penjualan_input", "multiple");
	return app.views.main.router.navigate('/penjualan-input-single');
}

function getPerformaHeaderPenjualan() {
	var performa_value = "";
	jQuery.ajax({
		type: 'POST',
		url: "" + BASE_API + "/get-performa-header-penjualan",
		dataType: 'JSON',
		data: {
			karyawan_id: localStorage.getItem("user_id")
		},
		beforeSend: function () {
			app.dialog.preloader('Harap Tunggu');
		},
		success: function (data) {
			app.dialog.close();
			var color_tr = "";
			$.each(data.data, function (i2, item2) {
				if (item2.status == 'tidak_aktif') {
					color_tr = '#000080';
				} else {
					color_tr = '';
				}
				console.log(item2.status);
				performa_value += '<tr>';
				performa_value += '<td class="label-cell" style="background-color:' + color_tr + '; border-right:1px solid gray; border-bottom:1px solid gray;">';
				performa_value += '' + moment(item2.dt_record).format('DD-MMM') + '';
				performa_value += '</td>';
				performa_value += '<td class="label-cell" style="background-color:' + color_tr + ';  gray; border-right:1px solid gray; border-bottom:1px solid gray;">';
				performa_value += '' + moment(item2.dt_record).format('DDMMYY') + '-' + item2.performa_header_id.replace(/\PI_/g, '').replace(/^0+/, '') + '';
				performa_value += '</td>';
				performa_value += '<td class="label-cell text-align-left" style=" background-color:' + color_tr + '; border-right:1px solid gray; border-bottom:1px solid gray;">';
				performa_value += '' + item2.client_nama + '';
				performa_value += '</td>';

				performa_value += '<td class="label-cell" style="background-color:' + color_tr + '; border-right:1px solid gray; border-bottom:1px solid gray;">';
				if (item2.status == 'tidak_aktif') {
				} else {
					performa_value += '  <center><a onclick="singlePenjualan(\'' + item2.performa_header_id + '\');"  style="font-size:30px; color:forestgreen;" class="f7-icons">plus_rectangle_fill</a>&nbsp; &nbsp; &nbsp;';
					performa_value += '  <a onclick="multiplePenjualan(\'' + item2.performa_header_id + '\');" href="/penjualan-input" style="font-size:30px; color:forestgreen;" class="f7-icons">plus_rectangle_fill_on_rectangle_fill</a></center>';
				}
				performa_value += '</td>';
				performa_value += '<td class="label-cell" style="background-color:' + color_tr + '; border-right:1px solid gray; border-bottom:1px solid gray;">';
				performa_value += '<img onclick="penjualanGetPerformaDownload(\'' + item2.performa_header_id + '\',\'' + item2.client_kota + '\',\'' + item2.client_nama + '\',\'' + item2.dt_record + '\',\'' + item2.performa_total_qty + '\');" src="img/logo/donwloadproforma.png" width="80px" />';
				performa_value += '</td>';
				performa_value += '<td class="label-cell" style="border-right:1px solid gray; border-bottom:1px solid gray;">';
				performa_value += '<a style="color:#b20e0e;" onclick="deletePerformaHeaderPenjualanPage(\'' + item2.performa_header_id + '\',\'' + item2.status + '\');"><i  class="f7-icons">trash</i></a>';
				performa_value += '</td>';
				performa_value += '</tr>';
			});

			$$('#performa_value').html(performa_value);
		},
		error: function (xmlhttprequest, textstatus, message) {
		}
	});
}

function emptyValue(id) {
	jQuery('#' + id + '').val('');
}

function suratJalanValue(id) {
	jQuery('#' + id + '').val('SJ');
}

function piValue() {
	jQuery('#performa').val('PI_');
}

function updateStatusPenjualan(penjualan_id) {
	app.dialog.prompt('Silahkan Memasukan No Surat Jalan, SJ_', function (surat_jalan) {
		if (surat_jalan == '' || surat_jalan == null) {
			app.dialog.alert('Surat Jalan Tidak Boleh Kosong');
			if (jQuery('#status_penjualan_' + penjualan_id + '').val() == "AKTIF") {
				var status_penjualan_val = 'CLOSE';
			} else {
				var status_penjualan_val = 'AKTIF';
			}
			jQuery('#status_penjualan_' + penjualan_id + '').val(status_penjualan_val);
			app.dialog.close();
		} else {
			jQuery.ajax({
				type: 'POST',
				url: "" + BASE_API + "/update-penjualan-status",
				dataType: 'JSON',
				data: {
					karyawan_id: localStorage.getItem("user_id"),
					penjualan_id: penjualan_id,
					surat_jalan: surat_jalan,
					status_penjualan: jQuery('#status_penjualan_' + penjualan_id + '').val()
				},
				beforeSend: function () {
					app.dialog.preloader('Harap Tunggu');
				},
				success: function (data) {
					app.dialog.close();
					getPenjualanHeader(1);
				},
				error: function (xmlhttprequest, textstatus, message) {
				}
			});
		}

	});


}

function SPK1(customer_logo, customer_logo_tambahan, no_spk, kode_kota, customer_logo_bordir, client_alamat, client_cp, client_cp_posisi, client_id, client_kota, client_nama, client_telp, jenis_penjualan, karyawan_id, penjualan_global_diskon, penjualan_grandtotal, penjualan_id, penjualan_jumlah_pembayaran, penjualan_keterangan, penjualan_status, penjualan_status_pembayaran, penjualan_tanggal, penjualan_tanggal_kirim, penjualan_total, penjualan_void_keterangan, penjualan_total_qty) {
	var spk1_data = '';
	app.dialog.preloader('Harap Tunggu');
	jQuery.ajax({
		type: 'POST',
		url: "" + BASE_API + "/get-penjualan-detail-performa",
		dataType: 'JSON',
		data: {
			karyawan_id: localStorage.getItem("user_id"),
			penjualan_id: penjualan_id,
			jenis_penjualan: jenis_penjualan
		},
		beforeSend: function () {

			spk1_data += '<table  border="0" width="100%" style="border-spacing: 0; background-color:white; color:black;">';
			spk1_data += '<tr>';
			spk1_data += '<td colspan="7" align="right">';
			spk1_data += '<h1 style="padding-right:10px;"><i>Operasional</i></h1>';
			spk1_data += '</td>';
			spk1_data += '</tr>'
			spk1_data += '<tr> ';
			spk1_data += '<td style="border: solid 1px;" rowspan="2" colspan="3" align="center">';
			spk1_data += '<h1>' + client_nama + '</h1>';
			spk1_data += '</td>';
			spk1_data += '<td style="padding:3px; border-top: solid 1px; border-right: solid 1px; border-bottom: solid 1px;" colspan="4" align="center">';
			spk1_data += '<h2 style="color:red;">DATELINE ' + moment(penjualan_tanggal_kirim).subtract(6, 'd').format('DD MMMM YYYY') + '<h2>';
			spk1_data += '</td>';
			spk1_data += '</tr>';
			spk1_data += '<tr> ';
			spk1_data += '<td colspan="2" style="border-right: solid 1px; border-bottom: solid 1px;" align="center">';
			spk1_data += '<b>SPK ' + moment(penjualan_tanggal).format('DDMMYY') + '-' + penjualan_id.replace(/\INV_/g, '').replace(/^0+/, '') + '</b>';
			spk1_data += '</td>';
			spk1_data += '<td colspan="2" style="border-right: solid 1px; border-bottom: solid 1px;"  align="center">';
			spk1_data += '<b>' + penjualan_total_qty + ' PAKET</b>';
			spk1_data += '</td>';
			spk1_data += '</tr>';
			spk1_data += '<tbody>';
		},
		success: function (data) {
			if (data.data.length != 0) {
				jQuery.each(data.data, function (i, val) {
					spk1_data += ' <tr>';
					spk1_data += '  <td colspan="3" width="50%" class="label-cell" style="border-left: solid 1px; "><center>' + val.penjualan_jenis + '<br><img src="' + BASE_PATH_IMAGE_PERFORMA + '/' + val.gambar + '" width="70%"></center></td>';
					spk1_data += '  <td  colspan="4" width="50%" class="label-cell" style="white-space: pre;"><center><h3>SPESIFIKASI : <br>' + val.produk_keterangan_kustom + '</h3></center></td>';
					spk1_data += ' </tr>';
				});
			}
			spk1_data += '</tbody>'
			spk1_data += ' <tr>';
			spk1_data += '  <td width="14%"  align="center" style="border-top: solid 1px; border-left:solid 1px; border-bottom: solid 1px;">DESAIN</td>';
			spk1_data += '  <td width="14%" align="center" style="border-top: solid 1px; border-left:solid 1px; border-bottom: solid 1px;">SALES</td>';
			spk1_data += '  <td width="14%" align="center" style="border-top: solid 1px; border-left:solid 1px; border-bottom: solid 1px;">MANAGER<br>MARKETING</td>';
			spk1_data += '  <td width="14%"  align="center" style="border-top: solid 1px; border-left:solid 1px; border-bottom: solid 1px;">MANAGEMENT</td>';
			spk1_data += '  <td width="14%"  align="center" style="border-top: solid 1px; border-left:solid 1px; border-bottom: solid 1px;">KEP.PROD</td>';
			spk1_data += '  <td width="14%"  align="center" style="border-top: solid 1px; border-left:solid 1px; border-bottom: solid 1px;">PURCHASE</td>';
			spk1_data += '  <td width="14%"  align="center" style="border-top: solid 1px; border-right:solid 1px; border-left:solid 1px; border-bottom: solid 1px;">STOK</td>';
			spk1_data += ' </tr>';
			spk1_data += '  <td height="60px" align="center" style=" border-left:solid 1px; border-bottom: solid 1px;"></td>';
			spk1_data += '  <td height="60px" align="center" rowspan="2" style=" border-left:solid 1px; border-bottom: solid 1px;"></td>';
			spk1_data += '  <td height="60px" align="center" rowspan="2" style=" border-left:solid 1px; border-bottom: solid 1px;"></td>';
			spk1_data += '  <td height="60px" align="center" style=" border-left:solid 1px; border-bottom: solid 1px;"></td>';
			spk1_data += '  <td height="60px" align="center" rowspan="2" style=" border-left:solid 1px; border-bottom: solid 1px;"></td>';
			spk1_data += '  <td height="60px" align="center" rowspan="2" style=" border-left:solid 1px; border-bottom: solid 1px;"></td>';
			spk1_data += '  <td height="60px" align="center" rowspan="2" style=" border-left:solid 1px; border-right:solid 1px; border-bottom: solid 1px;"></td>';
			spk1_data += ' </tr>';
			spk1_data += ' <tr>';
			spk1_data += '  <td style="border-left:solid 1px; border-bottom: solid 1px;">TGL:</td>';
			spk1_data += '  <td style=" border-left:solid 1px; border-bottom: solid 1px;">TGL:</td>';
			spk1_data += ' </tr>';
			spk1_data += '</table>';

			var spk2_data = '';
			jQuery.ajax({
				type: 'POST',
				url: "" + BASE_API + "/get-penjualan-detail-performa",
				dataType: 'JSON',
				data: {
					karyawan_id: localStorage.getItem("user_id"),
					penjualan_id: penjualan_id,
					jenis_penjualan: jenis_penjualan
				},
				beforeSend: function () {

					if (customer_logo_tambahan.length == 0) {
						var customer_logo_tambahan_fix = '';
					} else {
						var customer_logo_tambahan_fix = '<br> <h2 style="color:red;">Logo Tambahan</h2><img src="' + BASE_PATH_IMAGE_CUSTOMER + '/' + customer_logo_tambahan + '" width="40%"><br><br>';
					}


					spk2_data += '<table  border="0" width="100%" style="border-spacing: 0; background-color:white; color:black;">';
					spk2_data += '<tr>';
					spk2_data += '<td colspan="7" align="right">';
					spk2_data += '<h1 style="padding-right:10px;"><i>Produksi</i></h1>';
					spk2_data += '</td>';
					spk2_data += '</tr>'
					spk2_data += ' <tr>';
					spk2_data += '  <td colspan="3" width="50%" class="label-cell" style="border-left: solid 1px; "><center><h2 style="color:red;">Logo Bordir</h2><img src="' + BASE_PATH_IMAGE_CUSTOMER + '/' + customer_logo_bordir + '" width="40%">' + customer_logo_tambahan_fix + '</center></td>';
					spk2_data += '  <td colspan="4" width="50%" class="label-cell" style=""><center><h2 style="color:red;">Logo Emblem</h2><img src="' + BASE_PATH_IMAGE_CUSTOMER + '/' + customer_logo + '" width="40%"></center></td>';
					spk2_data += ' </tr>';
					spk2_data += '<tr> ';
					spk2_data += '<td style="font-size:35px; border: solid 1px;" rowspan="2" colspan="3" align="center">';
					spk2_data += '' + client_nama + '';
					spk2_data += '</td>';
					spk2_data += '<td style="padding:5px; font-size:25px; border-top: solid 1px; border-right: solid 1px; border-bottom: solid 1px;" colspan="4" align="center">';
					spk2_data += '<font style="color:red;">DATELINE ' + moment(penjualan_tanggal_kirim).subtract(6, 'd').format('DD MMMM YYYY') + '</font>';
					spk2_data += '</td>';
					spk2_data += '</tr>';
					spk2_data += '<tr> ';
					spk2_data += '<td colspan="2" style="font-size:20px;  border-right: solid 1px; border-bottom: solid 1px;" align="center">';
					spk2_data += '<b>SPK ' + moment(penjualan_tanggal).format('DDMMYY') + '-' + penjualan_id.replace(/\INV_/g, '').replace(/^0+/, '') + '</b>';
					spk2_data += '</td>';
					spk2_data += '<td colspan="2" style="font-size:20px; border-right: solid 1px; border-bottom: solid 1px;"  align="center">';
					spk2_data += '<b>' + penjualan_total_qty + ' PAKET</b>';
					spk2_data += '</td>';
					spk2_data += '</tr>';
					spk2_data += '<tbody>';
				},
				success: function (data) {
					if (data.data.length != 0) {
						jQuery.each(data.data, function (i, val) {
							spk2_data += ' <tr>';
							spk2_data += '  <td colspan="3" width="50%" class="label-cell" style="border-left: solid 1px; "><center>' + val.penjualan_jenis + '<br><img src="' + BASE_PATH_IMAGE_PERFORMA + '/' + val.gambar + '" width="70%"></center></td>';
							spk2_data += '  <td  colspan="4" width="50%" class="label-cell" style="white-space: pre;"><center>SPESIFIKASI : <br>' + val.produk_keterangan_kustom + '</center></td>';
							spk2_data += ' </tr>';
						});
					}
					spk2_data += '</tbody>'
					spk2_data += '</table>';

					var spk3_data = '';
					jQuery.ajax({
						type: 'POST',
						url: "" + BASE_API + "/get-penjualan-detail-performa",
						dataType: 'JSON',
						data: {
							karyawan_id: localStorage.getItem("user_id"),
							penjualan_id: penjualan_id,
							jenis_penjualan: jenis_penjualan
						},
						beforeSend: function () {
							if (customer_logo_tambahan.length == 0) {
								var customer_logo_tambahan_fix = '';
							} else {
								var customer_logo_tambahan_fix = '<br> <h2 style="color:red;">Logo Tambahan</h2><img src="' + BASE_PATH_IMAGE_CUSTOMER + '/' + customer_logo_tambahan + '" width="40%"><br><br>';
							}
							spk3_data += '<table  border="0" width="100%" style="border-spacing: 0; background-color:white; color:black;">';
							spk3_data += '<tr>';
							spk3_data += '<td colspan="7" align="right">';
							spk3_data += '<h1 style="padding-right:10px;"><i>Purchase</i></h1>';
							spk3_data += '</td>';
							spk3_data += '</tr>'
							spk3_data += ' <tr>';
							spk3_data += '  <td colspan="3" width="50%" class="label-cell" style="border-left: solid 1px; "><center><h2 style="color:red;">Logo Bordir</h2><img src="' + BASE_PATH_IMAGE_CUSTOMER + '/' + customer_logo_bordir + '" width="40%">' + customer_logo_tambahan_fix + '</center></td>';
							spk3_data += '  <td colspan="4" width="50%" class="label-cell" style=""><center><h2 style="color:red;">Logo Emblem</h2><img src="' + BASE_PATH_IMAGE_CUSTOMER + '/' + customer_logo + '" width="40%"></center></td>';
							spk3_data += ' </tr>';
							spk3_data += '<tr> ';
							spk3_data += '<td style="font-size:35px; border: solid 1px;" rowspan="2" colspan="3" align="center">';
							spk3_data += '' + client_nama + '';
							spk3_data += '</td>';
							spk3_data += '<td style="padding:5px; font-size:25px; border-top: solid 1px; border-right: solid 1px; border-bottom: solid 1px;" colspan="4" align="center">';
							spk3_data += '<font style="color:red;">DATELINE ' + moment(penjualan_tanggal_kirim).subtract(6, 'd').format('DD MMMM YYYY') + '</font>';
							spk3_data += '</td>';
							spk3_data += '</tr>';
							spk3_data += '<tr> ';
							spk3_data += '<td colspan="2" style="font-size:20px;  border-right: solid 1px; border-bottom: solid 1px;" align="center">';
							spk3_data += '<b>SPK ' + moment(penjualan_tanggal).format('DDMMYY') + '-' + penjualan_id.replace(/\INV_/g, '').replace(/^0+/, '') + '</b>';
							spk3_data += '</td>';
							spk3_data += '<td colspan="2" style="font-size:20px; border-right: solid 1px; border-bottom: solid 1px;"  align="center">';
							spk3_data += '<b>' + penjualan_total_qty + ' PAKET</b>';
							spk3_data += '</td>';
							spk3_data += '</tr>';
							spk3_data += '<tbody>';
						},
						success: function (data) {
							if (data.data.length != 0) {
								jQuery.each(data.data, function (i, val) {
									spk3_data += ' <tr>';
									spk3_data += '  <td colspan="3" width="50%" class="label-cell" style="border-left: solid 1px; "><center>' + val.penjualan_jenis + '<br><img src="' + BASE_PATH_IMAGE_PERFORMA + '/' + val.gambar + '" width="70%"></center></td>';
									spk3_data += '  <td  colspan="4" width="50%" class="label-cell" style="white-space: pre;"><center>SPESIFIKASI : <br>' + val.produk_keterangan_kustom + '</center></td>';
									spk3_data += ' </tr>';
								});
							}
							spk3_data += '</tbody>'
							spk3_data += '</table>';

							let options = {
								documentSize: 'A4',
								type: 'share',
								fileName: 'Spk_' + client_nama + '.pdf'
							}
							var spk1_pdf = spk1_data + '<div style="page-break-before: always;"></div>' + spk2_data + '<div style="page-break-before: always;"></div>' + spk3_data;
							pdf.fromData(spk1_pdf, options)
								.then((stats) => app.dialog.close())
								.catch((err) => console.err(err))


						},
						error: function (xmlhttprequest, textstatus, message) {
						}
					});
				},
				error: function (xmlhttprequest, textstatus, message) {
				}
			});
		},
		error: function (xmlhttprequest, textstatus, message) {
		}
	});
}

function SPK2(customer_logo_tambahan, no_spk, kode_kota, customer_logo_bordir, customer_logo, client_alamat, client_cp, client_cp_posisi, client_id, client_kota, client_nama, client_telp, jenis_penjualan, karyawan_id, penjualan_global_diskon, penjualan_grandtotal, penjualan_id, penjualan_jumlah_pembayaran, penjualan_keterangan, penjualan_status, penjualan_status_pembayaran, penjualan_tanggal, penjualan_tanggal_kirim, penjualan_total, penjualan_void_keterangan, penjualan_total_qty) {
	var spk2_data = '';
	jQuery.ajax({
		type: 'POST',
		url: "" + BASE_API + "/get-penjualan-detail-performa",
		dataType: 'JSON',
		data: {
			karyawan_id: localStorage.getItem("user_id"),
			penjualan_id: penjualan_id,
			jenis_penjualan: jenis_penjualan
		},
		beforeSend: function () {

			if (customer_logo_tambahan.length == 0) {
				var customer_logo_tambahan_fix = '';
			} else {
				var customer_logo_tambahan_fix = '<br> <h2 style="color:red;">Logo Tambahan</h2><img src="' + BASE_PATH_IMAGE_CUSTOMER + '/' + customer_logo_tambahan + '" width="40%">';
			}

			spk2_data += '<table  border="0" width="100%" style="border-spacing: 0; background-color:white; color:black;">';
			spk2_data += '<tr>';
			spk2_data += '<td colspan="7" align="right">';
			spk2_data += '<h1 style="padding-right:10px;"><i>Produksi</i></h1>';
			spk2_data += '</td>';
			spk2_data += '</tr>'
			spk2_data += ' <tr>';
			spk2_data += '  <td colspan="3" width="50%" class="label-cell" style="border-left: solid 1px; "><center><h2 style="color:red;">Logo Bordir</h2><img src="' + BASE_PATH_IMAGE_CUSTOMER + '/' + customer_logo_bordir + '" width="40%">' + customer_logo_tambahan_fix + '</center></td>';
			spk2_data += '  <td colspan="4" width="50%" class="label-cell" style=""><center><h2 style="color:red;">Logo Emblem</h2><img src="' + BASE_PATH_IMAGE_CUSTOMER + '/' + customer_logo + '" width="40%"></center></td>';
			spk2_data += ' </tr>';
			spk2_data += '<tr> ';
			spk2_data += '<td style="font-size:35px; border: solid 1px;" rowspan="2" colspan="3" align="center">';
			spk2_data += '' + client_nama + '';
			spk2_data += '</td>';
			spk2_data += '<td style="padding:5px; font-size:25px; border-top: solid 1px; border-right: solid 1px; border-bottom: solid 1px;" colspan="4" align="center">';
			spk2_data += '<font style="color:red;">DATELINE ' + moment(penjualan_tanggal_kirim).subtract(6, 'd').format('DD MMMM YYYY') + '</font>';
			spk2_data += '</td>';
			spk2_data += '</tr>';
			spk2_data += '<tr> ';
			spk2_data += '<td colspan="2" style="font-size:20px;  border-right: solid 1px; border-bottom: solid 1px;" align="center">';
			spk2_data += '<b>SPK ' + moment(penjualan_tanggal).format('DDMMYY') + '-' + penjualan_id.replace(/\INV_/g, '').replace(/^0+/, '') + '</b>';
			spk2_data += '</td>';
			spk2_data += '<td colspan="2" style="font-size:20px; border-right: solid 1px; border-bottom: solid 1px;"  align="center">';
			spk2_data += '<b>' + penjualan_total_qty + ' PAKET</b>';
			spk2_data += '</td>';
			spk2_data += '</tr>';
			spk2_data += '<tbody>';
		},
		success: function (data) {

			app.dialog.close();
			if (data.data.length != 0) {
				jQuery.each(data.data, function (i, val) {
					spk2_data += ' <tr>';
					spk2_data += '  <td colspan="3" width="50%" class="label-cell" style="border-left: solid 1px; "><center>' + val.penjualan_jenis + '<br><img src="' + BASE_PATH_IMAGE_PERFORMA + '/' + val.gambar + '" width="70%"></center></td>';
					spk2_data += '  <td  colspan="4" width="50%" class="label-cell" style="white-space: pre;"><center>SPESIFIKASI : <br>' + val.produk_keterangan_kustom + '</center></td>';
					spk2_data += ' </tr>';
				});
			}
			spk2_data += '</tbody>'
			spk2_data += '</table>';

			let options = {
				documentSize: 'A4',
				type: 'share',
				fileName: 'Spk_' + client_nama + '.pdf'
			}

			var spk2_pdf = spk2_data;
			pdf.fromData(spk2_pdf, options)
				.then((stats) => console.log('status', stats))
				.catch((err) => console.err(err))
		},
		error: function (xmlhttprequest, textstatus, message) {
		}
	});
}

function SPK3(customer_logo_tambahan, no_spk, kode_kota, customer_logo_bordir, customer_logo, client_alamat, client_cp, client_cp_posisi, client_id, client_kota, client_nama, client_telp, jenis_penjualan, karyawan_id, penjualan_global_diskon, penjualan_grandtotal, penjualan_id, penjualan_jumlah_pembayaran, penjualan_keterangan, penjualan_status, penjualan_status_pembayaran, penjualan_tanggal, penjualan_tanggal_kirim, penjualan_total, penjualan_void_keterangan, penjualan_total_qty) {
	var spk3_data = '';
	jQuery.ajax({
		type: 'POST',
		url: "" + BASE_API + "/get-penjualan-detail-performa",
		dataType: 'JSON',
		data: {
			karyawan_id: localStorage.getItem("user_id"),
			penjualan_id: penjualan_id,
			jenis_penjualan: jenis_penjualan
		},
		beforeSend: function () {
			if (customer_logo_tambahan.length == 0) {
				var customer_logo_tambahan_fix = '';
			} else {
				var customer_logo_tambahan_fix = '<br> <h2 style="color:red;">Logo Tambahan</h2><img src="' + BASE_PATH_IMAGE_CUSTOMER + '/' + customer_logo_tambahan + '" width="40%">';
			}


			spk3_data += '<table  border="0" width="100%" style="border-spacing: 0; background-color:white; color:black;">';
			spk3_data += '<tr>';
			spk3_data += '<td colspan="7" align="right">';
			spk3_data += '<h1 style="padding-right:10px;"><i>Purchase</i></h1>';
			spk3_data += '</td>';
			spk3_data += '</tr>'
			spk3_data += ' <tr>';
			spk3_data += '  <td colspan="3" width="50%" class="label-cell" style="border-left: solid 1px; "><center><h2 style="color:red;">Logo Bordir</h2><img src="' + BASE_PATH_IMAGE_CUSTOMER + '/' + customer_logo_bordir + '" width="40%">' + customer_logo_tambahan_fix + '</center></td>';
			spk3_data += '  <td colspan="4" width="50%" class="label-cell" style=""><center><h2 style="color:red;">Logo Emblem</h2><img src="' + BASE_PATH_IMAGE_CUSTOMER + '/' + customer_logo + '" width="40%"></center></td>';
			spk3_data += ' </tr>';
			spk3_data += '<tr> ';
			spk3_data += '<td style="font-size:35px; border: solid 1px;" rowspan="2" colspan="3" align="center">';
			spk3_data += '' + client_nama + '';
			spk3_data += '</td>';
			spk3_data += '<td style="padding:5px; font-size:25px; border-top: solid 1px; border-right: solid 1px; border-bottom: solid 1px;" colspan="4" align="center">';
			spk3_data += '<font style="color:red;">DATELINE ' + moment(penjualan_tanggal_kirim).subtract(6, 'd').format('DD MMMM YYYY') + '</font>';
			spk3_data += '</td>';
			spk3_data += '</tr>';
			spk3_data += '<tr> ';
			spk3_data += '<td colspan="2" style="font-size:20px;  border-right: solid 1px; border-bottom: solid 1px;" align="center">';
			spk3_data += '<b>SPK ' + moment(penjualan_tanggal).format('DDMMYY') + '-' + penjualan_id.replace(/\INV_/g, '').replace(/^0+/, '') + '</b>';
			spk3_data += '</td>';
			spk3_data += '<td colspan="2" style="font-size:20px; border-right: solid 1px; border-bottom: solid 1px;"  align="center">';
			spk3_data += '<b>' + penjualan_total_qty + ' PAKET</b>';
			spk3_data += '</td>';
			spk3_data += '</tr>';
			spk3_data += '<tbody>';
		},
		success: function (data) {

			app.dialog.close();
			if (data.data.length != 0) {
				jQuery.each(data.data, function (i, val) {
					spk3_data += ' <tr>';
					spk3_data += '  <td colspan="3" width="50%" class="label-cell" style="border-left: solid 1px; "><center>' + val.penjualan_jenis + '<br><img src="' + BASE_PATH_IMAGE_PERFORMA + '/' + val.gambar + '" width="70%"></center></td>';
					spk3_data += '  <td  colspan="4" width="50%" class="label-cell" style="white-space: pre;"><center>SPESIFIKASI : <br>' + val.produk_keterangan_kustom + '</center></td>';
					spk3_data += ' </tr>';
				});
			}
			spk3_data += '</tbody>'
			spk3_data += '</table>';

			let options = {
				documentSize: 'A4',
				type: 'share',
				fileName: 'Spk_' + client_nama + '.pdf'
			}

			var spk3_pdf = spk3_data;
			pdf.fromData(spk3_pdf, options)
				.then((stats) => console.log('status', stats))
				.catch((err) => console.err(err))
		},
		error: function (xmlhttprequest, textstatus, message) {
		}
	});
}


function invoicePenjualan(performa_header_id, biaya_kirim, client_alamat, client_cp, client_cp_posisi, client_id, client_kota, client_nama, client_telp, jenis_penjualan, karyawan_id, penjualan_global_diskon, penjualan_grandtotal, penjualan_id, penjualan_jumlah_pembayaran, penjualan_keterangan, penjualan_status, penjualan_status_pembayaran, penjualan_tanggal, penjualan_tanggal_kirim, penjualan_total, penjualan_void_keterangan, penjualan_total_qty) {



	app.dialog.create({
		title: 'Tanggal Pengiriman',
		text: 'Apakah Menyertakan Tanggal Pengiriman? ',
		cssClass: 'custom-dialog',
		closeByBackdropClick: 'true',
		buttons: [
			{
				text: 'Ya',
				onClick: function () {
					var invoice_penjualan = '';
					jQuery.ajax({
						type: 'POST',
						url: "" + BASE_API + "/get-penjualan-detail-performa",
						dataType: 'JSON',
						data: {
							karyawan_id: localStorage.getItem("user_id"),
							penjualan_id: penjualan_id,
							jenis_penjualan: jenis_penjualan
						},
						beforeSend: function () {
							app.dialog.preloader('Mengambil Data Penjualan');
							invoice_penjualan += '<table width="100%" border="0">';
							invoice_penjualan += '	<tr>';
							invoice_penjualan += '		<td colspan="6"  align="center"><b>KOPERINDO</b><br>Industri Tas & Koper</td>';
							invoice_penjualan += '	</tr>';
							invoice_penjualan += '	<tr>';
							invoice_penjualan += '		<td colspan="6" align="center">www.koperindo.id';
							invoice_penjualan += '			<hr>';
							invoice_penjualan += '		</td>';
							invoice_penjualan += '	</tr>';
							invoice_penjualan += '	<tr>';
							invoice_penjualan += '		<td colspan="6" align="center">Invoice Penjualan</td>';
							invoice_penjualan += '	</tr>';
							invoice_penjualan += '	<tr>';
							invoice_penjualan += '		<td colspan="4" align="left" >Kepada Yth :  ' + client_nama.replace(/\PT. /g, '').replace(/\PT/g, '').replace(/\CV. /g, '').replace(/\CV/g, '').replace(/\UD. /g, '').replace(/\UD/g, '') + ' <br> <font style="padding:94px;">' + client_kota + '</font></td>';
							invoice_penjualan += '		<td colspan="2" align="right"></td>';
							invoice_penjualan += '	</tr>';
							invoice_penjualan += '<tr>';
							invoice_penjualan += '<td style="border-top: solid 1px; border-left: solid 1px; font-weight:bold;" align="center">No</td>';
							invoice_penjualan += '<td style="border-top: solid 1px; border-left: solid 1px; font-weight:bold;" align="center">';
							invoice_penjualan += 'No Invoice</td>';
							invoice_penjualan += '<td style="border-top: solid 1px; border-left: solid 1px; font-weight:bold;" align="center">';
							invoice_penjualan += '	Jenis</td>';
							invoice_penjualan += '<td style="border-top: solid 1px; border-left: solid 1px; font-weight:bold;" align="center">Qty</td>';
							invoice_penjualan += '<td style="border-top: solid 1px; border-left: solid 1px; font-weight:bold;" align="center">Price Rp.</td>';
							invoice_penjualan += '<td style="border-top: solid 1px; border-right: solid 1px; border-left: solid 1px; font-weight:bold;"';
							invoice_penjualan += 'align="center">Total Rp.</td>';
							invoice_penjualan += '</tr >';
						},
						success: function (data) {

							var no_invoice_penjualan = 0;


							if (data.data.length != 0) {

								var penjualan_total = 0;
								var invest_molding = 0;
								invest_molding = data.data[0].invest_molding;
								var pembayaran_1 = 0;
								pembayaran_1 = data.data[0].pembayaran_1;

								invoice_penjualan += '<tbody>';
								jQuery.each(data.data, function (i, val) {
									if (!val.keterangan) {
										var ket_item = '';
									} else {

										var ket_item = '<font color="red"><br>KET :<br>' + val.keterangan + '</font>';

									}

									invoice_penjualan += '<tr>';
									invoice_penjualan += '<td width="5%" class="label-cell text-align-left" style="border-top: solid 1px; border-left: solid 1px; ">';
									invoice_penjualan += '	<center>' + (no_invoice_penjualan += 1) + '</center>';
									invoice_penjualan += '</td>';
									invoice_penjualan += '<td width="15%" class="label-cell text-align-left" style="border-top: solid 1px; border-left: solid 1px; ">';
									invoice_penjualan += '<center>' + moment(val.dt_record).format('DDMMYY') + '-' + val.penjualan_id.replace(/\INV_/g, '').replace(/^0+/, '') + '</center>';
									invoice_penjualan += '</td>';
									invoice_penjualan += '<td width="15%" class="label-cell text-align-left" style="border-top: solid 1px; border-left: solid 1px; ">';
									invoice_penjualan += '	<center>' + val.penjualan_jenis + '</center>';
									invoice_penjualan += '</td>';
									invoice_penjualan += '<td width="10%" class="label-cell" style="border-top: solid 1px; border-left: solid 1px;">';
									invoice_penjualan += '	<center>' + val.penjualan_qty + '</center>';
									invoice_penjualan += '</td>';
									invoice_penjualan += '<td width="25%" class="label-cell" align="right" style="border-top: solid 1px; border-left: solid 1px;">';
									invoice_penjualan += '' + number_format(val.penjualan_harga) + '';
									invoice_penjualan += '</td>';
									invoice_penjualan += '<td width="25%"  class="label-cell" align="right"';
									invoice_penjualan += '	style="border-top:  solid 1px; border-right: solid 1px; border-left: solid 1px;">';
									invoice_penjualan += '' + number_format(val.penjualan_detail_grandtotal) + '';
									invoice_penjualan += '</td>';
									invoice_penjualan += '</tr>';

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
									var invest_molding_jumlah = data.data[0].invest_molding;
								} else {
									var invest_molding_jumlah = 0;

								}
								if (number_format(data.data[0].pembayaran_1) != 0) {
									invoice_penjualan += '		<tr>';
									invoice_penjualan += '			<td colspan="4" style="  font-weight:bold;" align="right"></td>';
									invoice_penjualan += '			<td colspan="1" style=" border-top: solid 1px; border-left: solid 1px; font-weight:bold;" align="left">';
									invoice_penjualan += '				Deposit';
									invoice_penjualan += '			</td>';
									invoice_penjualan += '			<td colspan="1" style=" border-top: solid 1px; border-left: solid 1px; border-right: solid 1px; font-weight:bold;" align="left">';
									invoice_penjualan += '			<font style="float:right; ">' + number_format(pembayaran_1) + '</font>';
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
								console.log(pembayaran_1);
								if (pembayaran_1 != null) {
									console.log('ada');
									invoice_penjualan += '			 <font style="float:right;">' + number_format((parseFloat(penjualan_total) - parseFloat(pembayaran_1))) + '</font>';
								} else {
									invoice_penjualan += '			 <font style="float:right;">' + number_format((parseFloat(penjualan_total))) + '</font>';
									console.log('kosong');
								}
								invoice_penjualan += '			</td>';
								invoice_penjualan += '		</tr>'



								var penjualan_tgl_kirim = '';
								jQuery.ajax({
									type: 'POST',
									url: "" + BASE_API + "/full-report",
									dataType: 'JSON',
									data: {
										karyawan_id: localStorage.getItem("user_id"),
										performa_header_id: performa_header_id,
										jenis_penjualan: jenis_penjualan
									},
									beforeSend: function () {
										app.dialog.preloader('Mengambil Data Pengiriman');
									},
									success: function (data) {
										app.dialog.close();

										var penjualan_tgl_kirim_no = 0;
										jQuery.each(data.data, function (ikrm, valkrm) {
											var myString = valkrm.penjualan_id;
										
											penjualan_tgl_kirim += '<tr>';
											penjualan_tgl_kirim += '<td colspan="5">';
											penjualan_tgl_kirim += '	- Kirim ' + myString[myString.length - 1] + ' : ' + valkrm.penjualan_qty + ' Pcs, Tgl ' + moment(valkrm.penjualan_tanggal_kirim).format('DD-MMM-YYYY') + '';
											penjualan_tgl_kirim += '</td>';
											penjualan_tgl_kirim += '</tr>';
										});

										invoice_penjualan += '<br>' + penjualan_tgl_kirim + '</br>';


										invoice_penjualan += '		<tr>';
										invoice_penjualan += '			<td colspan="6">:</td>';
										invoice_penjualan += '		</tr>';
										invoice_penjualan += '	</table>';


										invoice_penjualan += '	<table width="100%" border="0">';
										invoice_penjualan += '      <tr>';
										invoice_penjualan += '          <td width="1%">-</td>';
										invoice_penjualan += '          <td width="70%">Packing finishing plastic</td>';
										invoice_penjualan += '          <td width="16%" align="center"></td>';
										invoice_penjualan += '          <td width="13%" align="center"></td>';
										invoice_penjualan += '      </tr>';
										invoice_penjualan += '      <tr>';
										invoice_penjualan += '          <td width="1%">-</td>';
										invoice_penjualan += '          <td width="70%">Harga produk belum termasuk biaya kirim</td>';
										invoice_penjualan += '          <td width="16%" align="center"></td>';
										invoice_penjualan += '          <td width="13%" align="center"></td>';
										invoice_penjualan += '      </tr>';
										invoice_penjualan += '      <tr>';
										invoice_penjualan += '          <td width="1%">-</td>';
										invoice_penjualan += '          <td width="70%">Komplain lebih 3 hari setelah barang di terima tidak dapat di layani</td>';
										invoice_penjualan += '          <td width="16%" align="center"></td>';
										invoice_penjualan += '          <td width="13%" align="center"></td>';
										invoice_penjualan += '      </tr>';
										invoice_penjualan += '      <tr>';
										invoice_penjualan += '          <td width="1%">-</td>';
										invoice_penjualan += '          <td width="70%">Dp 50% sebgai deposit, 50% pelunasan sebelum pengiriman</td>';
										invoice_penjualan += '          <td width="16%" align="center" style="">Sales</td>';
										invoice_penjualan += '          <td width="13%" align="center" style="">Customer</td>';
										invoice_penjualan += '      </tr>';
										invoice_penjualan += '		<tr>';
										invoice_penjualan += '			<td colspan="1"></td>';
										invoice_penjualan += '			<td colspan="2"></td>';
										invoice_penjualan += '		</tr>';
										invoice_penjualan += '	</table>';
										invoice_penjualan += '	<table border="0" width="100%" style="border-spacing: 0;">';
										invoice_penjualan += '      <tr>';
										invoice_penjualan += '          <td width="50%" align="left" colspan="3" class=""><b>Rekening</b></td>';
										invoice_penjualan += '          <td width="20%" align="left"  class=""><b></b></td>';
										invoice_penjualan += '          <td width="15%" align="center" class=""></td>';
										invoice_penjualan += '          <td width="15%" align="center" class=""></td>';
										invoice_penjualan += '      </tr>';
										invoice_penjualan += '      <tr>';
										invoice_penjualan += '          <td style="border-top: solid 1px; border-left: solid 1px; padding:4px;" width="2%" align="left" class="">BCA</td>';
										invoice_penjualan += '          <td style="border-top: solid 1px; padding:4px;" width="1%" align="left" class="">:</td>';
										invoice_penjualan += '          <td style="border-top: solid 1px;  border-right: solid  1px; padding:2px;" width="47%" align="left" class="">01831 29551 a.n Sutono</td>';
										invoice_penjualan += '          <td width="20%" align="center" class=""></td>';
										invoice_penjualan += '          <td width="15%" align="center" class=""></td>';
										invoice_penjualan += '          <td width="15%" align="center" class=""></td>';
										invoice_penjualan += '      </tr>';
										invoice_penjualan += '      <tr>';
										invoice_penjualan += '          <td style="border-bottom: solid 1px; border-top: solid 1px; border-left: solid 1px; padding:4px;" width="2%" align="left" class="">Mandiri</td>';
										invoice_penjualan += '          <td style="border-bottom: solid 1px;  border-top: solid 1px; padding:4px;" width="1%" align="left" class="">:</td>';
										invoice_penjualan += '          <td style="border-bottom: solid 1px;  border-top: solid 1px;  border-right: solid  1px; padding:2px;" width="47%" align="left" class="">141 000 518 7422 a.n Sutono</td>';
										invoice_penjualan += '          <td width="20%" align="left"  class=""><b></b></td>';
										invoice_penjualan += '          <td width="15%" align="center"  style="" class="">' + localStorage.getItem("karyawan_nama") + '</td>';
										invoice_penjualan += '          <td width="15%" align="center" style="" class="">' + client_nama.replace(/\PT. /g, '').replace(/\PT/g, '').replace(/\CV. /g, '').replace(/\CV/g, '').replace(/\UD. /g, '').replace(/\UD/g, '') + '</td>';
										invoice_penjualan += '      </tr>';
										invoice_penjualan += '	</table>';


										setTimeout(function () {
											app.dialog.close();
											console.log(invoice_penjualan);

											let options = {
												documentSize: 'A4',
												type: 'share',
												fileName: 'invoice_' + client_nama + '.pdf'
											}


											pdf.fromData(invoice_penjualan, options)
												.then((stats) => console.log('status', stats))
												.catch((err) => console.err(err))

										}, 1500);
									},
									error: function (xmlhttprequest, textstatus, message) {
									}
								});

							}

						},
						error: function (xmlhttprequest, textstatus, message) {
						}
					});
				},
			},
			{
				text: 'Tidak',
				onClick: function () {
					var invoice_penjualan = '';
					jQuery.ajax({
						type: 'POST',
						url: "" + BASE_API + "/get-penjualan-detail-performa",
						dataType: 'JSON',
						data: {
							karyawan_id: localStorage.getItem("user_id"),
							penjualan_id: penjualan_id,
							jenis_penjualan: jenis_penjualan
						},
						beforeSend: function () {
							app.dialog.preloader('Mengambil Data Penjualan');
							invoice_penjualan += '<table width="100%" border="0">';
							invoice_penjualan += '	<tr>';
							invoice_penjualan += '		<td colspan="6"  align="center"><b>KOPERINDO</b><br>Industri Tas & Koper</td>';
							invoice_penjualan += '	</tr>';
							invoice_penjualan += '	<tr>';
							invoice_penjualan += '		<td colspan="6" align="center">www.koperindo.id';
							invoice_penjualan += '			<hr>';
							invoice_penjualan += '		</td>';
							invoice_penjualan += '	</tr>';
							invoice_penjualan += '	<tr>';
							invoice_penjualan += '		<td colspan="6" align="center">Invoice Penjualan</td>';
							invoice_penjualan += '	</tr>';
							invoice_penjualan += '	<tr>';
							invoice_penjualan += '		<td colspan="4" align="left" >Kepada Yth :  ' + client_nama.replace(/\PT. /g, '').replace(/\PT/g, '').replace(/\CV. /g, '').replace(/\CV/g, '').replace(/\UD. /g, '').replace(/\UD/g, '') + ' <br> <font style="padding:94px;">' + client_kota + '</font></td>';
							invoice_penjualan += '		<td colspan="2" align="right">' + moment(penjualan_tanggal).format('DDMMYY') + '-' + penjualan_id.replace(/\INV_/g, '').replace(/^0+/, '') + '</td>';
							invoice_penjualan += '	</tr>';
							invoice_penjualan += '<tr>';
							invoice_penjualan += '<td style="border-top: solid 1px; border-left: solid 1px; font-weight:bold;" align="center">No</td>';
							invoice_penjualan += '<td style="border-top: solid 1px; border-left: solid 1px; font-weight:bold;" align="center">';
							invoice_penjualan += 'No Invoice</td>';
							invoice_penjualan += '<td style="border-top: solid 1px; border-left: solid 1px; font-weight:bold;" align="center">';
							invoice_penjualan += '	Jenis</td>';
							invoice_penjualan += '<td style="border-top: solid 1px; border-left: solid 1px; font-weight:bold;" align="center">Qty</td>';
							invoice_penjualan += '<td style="border-top: solid 1px; border-left: solid 1px; font-weight:bold;" align="center">Price Rp.</td>';
							invoice_penjualan += '<td style="border-top: solid 1px; border-right: solid 1px; border-left: solid 1px; font-weight:bold;"';
							invoice_penjualan += 'align="center">Total Rp.</td>';
							invoice_penjualan += '</tr >';
						},
						success: function (data) {

							var no_invoice_penjualan = 0;


							if (data.data.length != 0) {


								var penjualan_total = 0;
								var invest_molding = 0;
								invest_molding = data.data[0].invest_molding;
								var pembayaran_1 = 0;
								pembayaran_1 = data.data[0].pembayaran_1;

								invoice_penjualan += '<tbody>';
								jQuery.each(data.data, function (i, val) {
									if (!val.keterangan) {
										var ket_item = '';
									} else {

										var ket_item = '<font color="red"><br>KET :<br>' + val.keterangan + '</font>';

									}

									invoice_penjualan += '<tr>';
									invoice_penjualan += '<td width="5%" class="label-cell text-align-left" style="border-top: solid 1px; border-left: solid 1px; ">';
									invoice_penjualan += '	<center>' + (no_invoice_penjualan += 1) + '</center>';
									invoice_penjualan += '</td>';
									invoice_penjualan += '<td width="15%" class="label-cell text-align-left" style="border-top: solid 1px; border-left: solid 1px; ">';
									invoice_penjualan += '	<center>' + moment(val.dt_record).format('DDMMYY') + '-' + val.penjualan_id.replace(/\INV_/g, '').replace(/^0+/, '') + '</center>';
									invoice_penjualan += '</td>';
									invoice_penjualan += '<td width="15%" class="label-cell text-align-left" style="border-top: solid 1px; border-left: solid 1px; ">';
									invoice_penjualan += '	<center>' + val.penjualan_jenis + '</center>';
									invoice_penjualan += '</td>';
									invoice_penjualan += '<td width="10%" class="label-cell" style="border-top: solid 1px; border-left: solid 1px;">';
									invoice_penjualan += '	<center>' + val.penjualan_qty + '</center>';
									invoice_penjualan += '</td>';
									invoice_penjualan += '<td width="25%" class="label-cell" align="right" style="border-top: solid 1px; border-left: solid 1px;">';
									invoice_penjualan += '' + number_format(val.penjualan_harga) + '';
									invoice_penjualan += '</td>';
									invoice_penjualan += '<td width="25%"  class="label-cell" align="right"';
									invoice_penjualan += '	style="border-top:  solid 1px; border-right: solid 1px; border-left: solid 1px;">';
									invoice_penjualan += '' + number_format(val.penjualan_detail_grandtotal) + '';
									invoice_penjualan += '</td>';
									invoice_penjualan += '</tr>';

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
									invoice_penjualan += '			<font style="float:right; ">' + number_format(pembayaran_1) + '</font>';
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

								if (pembayaran_1 != null) {
									console.log('ada');
									invoice_penjualan += '			 <font style="float:right;">' + number_format((parseFloat(penjualan_total) - parseFloat(pembayaran_1))) + '</font>';
								} else {
									invoice_penjualan += '			 <font style="float:right;">' + number_format((parseFloat(penjualan_total))) + '</font>';
									console.log('kosong');
								}

								invoice_penjualan += '			</td>';
								invoice_penjualan += '		</tr>'



								var penjualan_tgl_kirim = '';
								jQuery.ajax({
									type: 'POST',
									url: "" + BASE_API + "/full-report",
									dataType: 'JSON',
									data: {
										karyawan_id: localStorage.getItem("user_id"),
										performa_header_id: performa_header_id,
										jenis_penjualan: jenis_penjualan
									},
									beforeSend: function () {
										app.dialog.preloader('Cetak Data');
									},
									success: function (data) {
										app.dialog.close();


										invoice_penjualan += '		<tr>';
										invoice_penjualan += '			<td colspan="6"></td>';
										invoice_penjualan += '		</tr>';
										invoice_penjualan += '	</table>';

										invoice_penjualan += '	<table width="100%" border="0">';
										invoice_penjualan += '      <tr>';
										invoice_penjualan += '          <td width="1%">-</td>';
										invoice_penjualan += '          <td width="70%">Packing finishing plastic</td>';
										invoice_penjualan += '          <td width="16%" align="center"></td>';
										invoice_penjualan += '          <td width="13%" align="center"></td>';
										invoice_penjualan += '      </tr>';
										invoice_penjualan += '      <tr>';
										invoice_penjualan += '          <td width="1%">-</td>';
										invoice_penjualan += '          <td width="70%">Harga produk belum termasuk biaya kirim</td>';
										invoice_penjualan += '          <td width="16%" align="center"></td>';
										invoice_penjualan += '          <td width="13%" align="center"></td>';
										invoice_penjualan += '      </tr>';
										invoice_penjualan += '      <tr>';
										invoice_penjualan += '          <td width="1%">-</td>';
										invoice_penjualan += '          <td width="70%">Komplain lebih 3 hari setelah barang di terima tidak dapat di layani</td>';
										invoice_penjualan += '          <td width="16%" align="center"></td>';
										invoice_penjualan += '          <td width="13%" align="center"></td>';
										invoice_penjualan += '      </tr>';
										invoice_penjualan += '      <tr>';
										invoice_penjualan += '          <td width="1%">-</td>';
										invoice_penjualan += '          <td width="70%">Dp 50% sebgai deposit, 50% pelunasan sebelum pengiriman</td>';
										invoice_penjualan += '          <td width="16%" align="center" style="">Sales</td>';
										invoice_penjualan += '          <td width="13%" align="center" style="">Customer</td>';
										invoice_penjualan += '      </tr>';
										invoice_penjualan += '		<tr>';
										invoice_penjualan += '			<td colspan="1"></td>';
										invoice_penjualan += '			<td colspan="2"></td>';
										invoice_penjualan += '		</tr>';
										invoice_penjualan += '	</table>';
										invoice_penjualan += '	<table border="0" width="100%" style="border-spacing: 0;">';
										invoice_penjualan += '      <tr>';
										invoice_penjualan += '          <td width="50%" align="left" colspan="3" class=""><b>Rekening</b></td>';
										invoice_penjualan += '          <td width="20%" align="left"  class=""><b></b></td>';
										invoice_penjualan += '          <td width="15%" align="center" class=""></td>';
										invoice_penjualan += '          <td width="15%" align="center" class=""></td>';
										invoice_penjualan += '      </tr>';
										invoice_penjualan += '      <tr>';
										invoice_penjualan += '          <td style="border-top: solid 1px; border-left: solid 1px; padding:4px;" width="2%" align="left" class="">BCA</td>';
										invoice_penjualan += '          <td style="border-top: solid 1px; padding:4px;" width="1%" align="left" class="">:</td>';
										invoice_penjualan += '          <td style="border-top: solid 1px;  border-right: solid  1px; padding:2px;" width="47%" align="left" class="">01831 29551 a.n Sutono</td>';
										invoice_penjualan += '          <td width="20%" align="center" class=""></td>';
										invoice_penjualan += '          <td width="15%" align="center" class=""></td>';
										invoice_penjualan += '          <td width="15%" align="center" class=""></td>';
										invoice_penjualan += '      </tr>';
										invoice_penjualan += '      <tr>';
										invoice_penjualan += '          <td style="border-bottom: solid 1px; border-top: solid 1px; border-left: solid 1px; padding:4px;" width="2%" align="left" class="">Mandiri</td>';
										invoice_penjualan += '          <td style="border-bottom: solid 1px;  border-top: solid 1px; padding:4px;" width="1%" align="left" class="">:</td>';
										invoice_penjualan += '          <td style="border-bottom: solid 1px;  border-top: solid 1px;  border-right: solid  1px; padding:2px;" width="47%" align="left" class="">141 000 518 7422 a.n Sutono</td>';
										invoice_penjualan += '          <td width="20%" align="left"  class=""><b></b></td>';
										invoice_penjualan += '          <td width="15%" align="center"  style="" class="">' + localStorage.getItem("karyawan_nama") + '</td>';
										invoice_penjualan += '          <td width="15%" align="center" style="" class="">' + client_nama.replace(/\PT. /g, '').replace(/\PT/g, '').replace(/\CV. /g, '').replace(/\CV/g, '').replace(/\UD. /g, '').replace(/\UD/g, '') + '</td>';
										invoice_penjualan += '      </tr>';
										invoice_penjualan += '	</table>';

										setTimeout(function () {
											app.dialog.close();
											console.log(invoice_penjualan);

											let options = {
												documentSize: 'A4',
												type: 'share',
												fileName: 'invoice_' + client_nama + '.pdf'
											}


											pdf.fromData(invoice_penjualan, options)
												.then((stats) => console.log('status', stats))
												.catch((err) => console.err(err))

										}, 1500);
									},
									error: function (xmlhttprequest, textstatus, message) {
									}
								});

							}

						},
						error: function (xmlhttprequest, textstatus, message) {
						}
					});
				},
			},
		],
	}).open();

}


function prosesPembayaranMultiple(pembayaran_id, number) {
	if (jQuery('#pembayaran_' + number + '_' + pembayaran_id + '').val() == "" || jQuery('#bank_' + number + '_' + pembayaran_id + '').val() == "" || jQuery('#tanggal_' + number + '_' + pembayaran_id + '').val() == "") {
		app.dialog.alert('Isi Data Pembayaran Dengan Lengkap');
	} else {

		var total_harus_bayar = parseInt(jQuery('#total_harus_bayar_' + pembayaran_id + '').val());
		var sudah_bayar = parseInt(jQuery('#sudah_bayar_' + pembayaran_id + '').val()) + parseInt(jQuery('#pembayaran_' + number + '_' + pembayaran_id + '').val().replace(/\,/g, ''));
		var sisa_harus_bayar = total_harus_bayar - sudah_bayar;

		console.log(total_harus_bayar);
		console.log(sudah_bayar);
		console.log(sisa_harus_bayar);

		if (sisa_harus_bayar < 0) {
			var lebih_bayar = sudah_bayar - total_harus_bayar;
			app.dialog.alert('Pembayaran Melebihi Nominal <br> <br> Nominal Lebih : ' + number_format(lebih_bayar) + ' <br><br>Bagi Pada Angsuran Berikutnya');
		} else {

			jQuery.ajax({
				type: 'POST',
				url: "" + BASE_API + "/proses-pembayaran-multiple",
				dataType: 'JSON',
				data: {
					pembayaran_ke: number,
					pembayaran: jQuery('#pembayaran_' + number + '_' + pembayaran_id + '').val(),
					bank: jQuery('#bank_' + number + '_' + pembayaran_id + '').val(),
					tanggal: jQuery('#tanggal_' + number + '_' + pembayaran_id + '').val(),
					keterangan: jQuery('#keterangan_' + number + '_' + pembayaran_id + '').val(),
					pembayaran_id: pembayaran_id
				},
				beforeSend: function () {
					app.dialog.preloader('Harap Tunggu');
				},
				success: function (data) {
					getPenjualanHeader(1);
					app.dialog.close();
					app.popup.close();
					if (data.status == 'done') {
						app.dialog.alert('Berhasil Input Pembayaran');
					} else if (data.status == 'failed') {
						app.dialog.alert('Gagal Input Pembayaran');
					}
				},
				error: function (xmlhttprequest, textstatus, message) {
				}
			});
		}
	}
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
					console.log(parseInt(total_jumlah_pembayaran));

					if (parseInt(val.penjualan_grandtotal) <= parseInt(total_jumlah_pembayaran)) {
						var background_multiple = "#133788";
						var status_lunas = "lunas";
					} else {
						var background_multiple = "";
						var status_lunas = "belum_lunas";
					}
					console.log('.table_num_' + (i + 1) + '');


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
						history_pembayaran_multiple += ' class="numeric-cell text-align-center">' + val.keterangan_1 + '</td>';
						history_pembayaran_multiple += '<td width="10%" style="border-collapse: collapse; border:1px solid white;"';
						history_pembayaran_multiple += ' class="numeric-cell text-align-center">-</td>';
						history_pembayaran_multiple += ' </tr>';
					} else {
						history_pembayaran_multiple += '<form id="pembayaran_form_multiple_1_' + val.pembayaran_id + '"><tr>';
						history_pembayaran_multiple += '<td width="15%" style="border-collapse: collapse; border:1px solid white;" colspan="2"';
						history_pembayaran_multiple += ' class="numeric-cell text-align-center">Bayar 1';
						history_pembayaran_multiple += '</td>';
						history_pembayaran_multiple += '<td width="18%" style="border-collapse: collapse; border:1px solid white;"';
						history_pembayaran_multiple += ' class="numeric-cell text-align-center"><input  style="width:105px;"  id="tanggal_1_' + val.pembayaran_id + '" name="tanggal_1_' + val.pembayaran_id + '"  type="date" class="date-multiple-penbayaran" required validate></td>';

						history_pembayaran_multiple += '<td width="15%" style="border-collapse: collapse; border:1px solid white;" class="numeric-cell text-align-center">';
						history_pembayaran_multiple += '<select style="width:60%; background-color:#1c1c1d;" class="performa-input input-item-bank" id="bank_1_' + val.pembayaran_id + '" name="bank_1_' + val.pembayaran_id + '" required validate>';
						history_pembayaran_multiple += '<option value="" selected>bank</option>';
						history_pembayaran_multiple += '<option value="BCA">BCA (0183129551 A/N Sutono)</option>';
						history_pembayaran_multiple += '<option value="BRI">BRI (058401031165502 A/N Sutono)</option>';
						history_pembayaran_multiple += '<option value="Mandiri">Mandiri (1410005187422 A/N Sutono)</option>';
						history_pembayaran_multiple += ' </select>';
						history_pembayaran_multiple += ' </td>';

						history_pembayaran_multiple += '<td width="21%" style="border-collapse: collapse; border:1px solid white;"';
						history_pembayaran_multiple += ' class="numeric-cell text-align-center"><input style="width:100%;" class="input-pembayaran-multiple" id="pembayaran_1_' + val.pembayaran_id + '" name="pembayaran_1_' + val.pembayaran_id + '"  type="text" required validate></td>';
						history_pembayaran_multiple += '<td width="18%" style="border-collapse: collapse; border:1px solid white;"';
						history_pembayaran_multiple += ' class="numeric-cell text-align-center"><input style="width:100%;" id="keterangan_1_' + val.pembayaran_id + '" name="keterangan_1_' + val.pembayaran_id + '"  type="text" required validate></td>';
						history_pembayaran_multiple += '<td width="10%" style="border-collapse: collapse; border:1px solid white;"';
						history_pembayaran_multiple += ' class="numeric-cell text-align-center"><button class="text-add-colour-black-soft bg-dark-gray-young button-small col button text-bold" onclick="prosesPembayaranMultiple(' + val.pembayaran_id + ',1);">Simpan</button></td>';
						history_pembayaran_multiple += ' </tr></form>';
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
						history_pembayaran_multiple += ' class="numeric-cell text-align-center">' + val.keterangan_2 + '</td>';
						history_pembayaran_multiple += '<td width="10%" style="border-collapse: collapse; border:1px solid white;"';
						history_pembayaran_multiple += ' class="numeric-cell text-align-center">-</td>';
						history_pembayaran_multiple += ' </tr>';
					} else {
						if (val.pembayaran_1 != null && val.pembayaran_1 != 0) {
							if (status_lunas != "lunas") {
								history_pembayaran_multiple += '<form id="pembayaran_form_multiple_2_' + val.pembayaran_id + '"><tr>';
								history_pembayaran_multiple += '<td width="15%" style="border-collapse: collapse; border:1px solid white;" colspan="2"';
								history_pembayaran_multiple += ' class="numeric-cell text-align-center">Bayar 2';
								history_pembayaran_multiple += '</td>';
								history_pembayaran_multiple += '<td width="18%" style="border-collapse: collapse; border:1px solid white;"';
								history_pembayaran_multiple += ' class="numeric-cell text-align-center"><input   style="width:105px;" id="tanggal_2_' + val.pembayaran_id + '" name="tanggal_2_' + val.pembayaran_id + '"  type="date" class="date-multiple-penbayaran" value="'+moment().format('YYYY-MM-DD')+'"  readonly/></td>';

								history_pembayaran_multiple += '<td width="15%" style="border-collapse: collapse; border:1px solid white;" class="numeric-cell text-align-center">';
								history_pembayaran_multiple += '<select style="width:60%; background-color:#1c1c1d;" class="performa-input input-item-bank" id="bank_2_' + val.pembayaran_id + '" name="bank_2_' + val.pembayaran_id + '" required validate>';
								history_pembayaran_multiple += '<option value="" selected>bank</option>';
								history_pembayaran_multiple += '<option value="BCA">BCA (0183129551 A/N Sutono)</option>';
								history_pembayaran_multiple += '<option value="BRI">BRI (058401031165502 A/N Sutono)</option>';
								history_pembayaran_multiple += '<option value="Mandiri">Mandiri (1410005187422 A/N Sutono)</option>';
								history_pembayaran_multiple += ' </select>';
								history_pembayaran_multiple += ' </td>';

								history_pembayaran_multiple += '<td width="21%" style="border-collapse: collapse; border:1px solid white;"';
								history_pembayaran_multiple += ' class="numeric-cell text-align-center"><input style="width:100%;" id="pembayaran_2_' + val.pembayaran_id + '" class="input-pembayaran-multiple" name="pembayaran_2_' + val.pembayaran_id + '"  type="text" /></td>';
								history_pembayaran_multiple += '<td width="18%" style="border-collapse: collapse; border:1px solid white;"';
								history_pembayaran_multiple += ' class="numeric-cell text-align-center"><input style="width:100%;" id="keterangan_2_' + val.pembayaran_id + '" name="keterangan_2_' + val.pembayaran_id + '"  type="text" /></td>';
								history_pembayaran_multiple += '<td width="10%" style="border-collapse: collapse; border:1px solid white;"';
								history_pembayaran_multiple += ' class="numeric-cell text-align-center"><button class="text-add-colour-black-soft bg-dark-gray-young button-small col button text-bold" onclick="prosesPembayaranMultiple(' + val.pembayaran_id + ',2);">Simpan</button></td>';
								history_pembayaran_multiple += ' </tr></form>';
							}
						}
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
						history_pembayaran_multiple += ' class="numeric-cell text-align-center">' + val.keterangan_3 + '</td>';
						history_pembayaran_multiple += '<td width="10%" style="border-collapse: collapse; border:1px solid white;"';
						history_pembayaran_multiple += ' class="numeric-cell text-align-center">-</td>';
						history_pembayaran_multiple += ' </tr>';
					} else {
						if (val.pembayaran_2 != null && val.pembayaran_2 != 0) {
							if (status_lunas != "lunas") {
								history_pembayaran_multiple += '<form id="pembayaran_form_multiple_3_' + val.pembayaran_id + '"><tr>';
								history_pembayaran_multiple += '<td width="15%" style="border-collapse: collapse; border:1px solid white;" colspan="2"';
								history_pembayaran_multiple += ' class="numeric-cell text-align-center">Bayar 3';
								history_pembayaran_multiple += '</td>';
								history_pembayaran_multiple += '<td width="18%" style="border-collapse: collapse; border:1px solid white;"';
								history_pembayaran_multiple += ' class="numeric-cell text-align-center"><input  style="width:105px;" id="tanggal_3_' + val.pembayaran_id + '" name="tanggal_3_' + val.pembayaran_id + '"  type="date" class="date-multiple-penbayaran" value="'+moment().format('YYYY-MM-DD')+'"  readonly/></td>';

								history_pembayaran_multiple += '<td width="15%" style="border-collapse: collapse; border:1px solid white;" class="numeric-cell text-align-center">';
								history_pembayaran_multiple += '<select style="width:60%; background-color:#1c1c1d;" class="performa-input input-item-bank" id="bank_3_' + val.pembayaran_id + '" name="bank_3_' + val.pembayaran_id + '" required validate>';
								history_pembayaran_multiple += '<option value="" selected>bank</option>';
								history_pembayaran_multiple += '<option value="BCA">BCA (0183129551 A/N Sutono)</option>';
								history_pembayaran_multiple += '<option value="BRI">BRI (058401031165502 A/N Sutono)</option>';
								history_pembayaran_multiple += '<option value="Mandiri">Mandiri (1410005187422 A/N Sutono)</option>';
								history_pembayaran_multiple += ' </select>';
								history_pembayaran_multiple += ' </td>';

								history_pembayaran_multiple += '<td width="21%" style="border-collapse: collapse; border:1px solid white;"';
								history_pembayaran_multiple += ' class="numeric-cell text-align-center"><input style="width:100%;" id="pembayaran_3_' + val.pembayaran_id + '" class="input-pembayaran-multiple" name="pembayaran_3_' + val.pembayaran_id + '"  type="text" /></td>';
								history_pembayaran_multiple += '<td width="18%" style="border-collapse: collapse; border:1px solid white;"';
								history_pembayaran_multiple += ' class="numeric-cell text-align-center"><input style="width:100%;" id="keterangan_3_' + val.pembayaran_id + '" name="keterangan_3_' + val.pembayaran_id + '"  type="text" /></td>';
								history_pembayaran_multiple += '<td width="10%" style="border-collapse: collapse; border:1px solid white;"';
								history_pembayaran_multiple += ' class="numeric-cell text-align-center"><button class="text-add-colour-black-soft bg-dark-gray-young button-small col button text-bold" onclick="prosesPembayaranMultiple(' + val.pembayaran_id + ',3);">Simpan</button></td>';
								history_pembayaran_multiple += ' </tr></form>';
							}
						}
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
						history_pembayaran_multiple += ' class="numeric-cell text-align-center">' + val.keterangan_4 + '</td>';
						history_pembayaran_multiple += '<td width="10%" style="border-collapse: collapse; border:1px solid white;"';
						history_pembayaran_multiple += ' class="numeric-cell text-align-center">-</td>';
						history_pembayaran_multiple += ' </tr>';
					} else {
						if (val.pembayaran_3 != null && val.pembayaran_3 != 0) {
							if (status_lunas != "lunas") {
								history_pembayaran_multiple += '<form id="pembayaran_form_multiple_4_' + val.pembayaran_id + '"><tr>';
								history_pembayaran_multiple += '<td width="15%" style="border-collapse: collapse; border:1px solid white;" colspan="2"';
								history_pembayaran_multiple += ' class="numeric-cell text-align-center">Bayar 4';
								history_pembayaran_multiple += '</td>';
								history_pembayaran_multiple += '<td width="18%" style="border-collapse: collapse; border:1px solid white;"';
								history_pembayaran_multiple += ' class="numeric-cell text-align-center"><input  style="width:105px;" id="tanggal_4_' + val.pembayaran_id + '" name="tanggal_4_' + val.pembayaran_id + '"  type="date" class="date-multiple-penbayaran" value="'+moment().format('YYYY-MM-DD')+'"  readonly /></td>';

								history_pembayaran_multiple += '<td width="15%" style="border-collapse: collapse; border:1px solid white;" class="numeric-cell text-align-center">';
								history_pembayaran_multiple += '<select style="width:60%; background-color:#1c1c1d;" class="performa-input input-item-bank" id="bank_4_' + val.pembayaran_id + '" name="bank_4_' + val.pembayaran_id + '" required validate>';
								history_pembayaran_multiple += '<option value="" selected>bank</option>';
								history_pembayaran_multiple += '<option value="BCA">BCA (0183129551 A/N Sutono)</option>';
								history_pembayaran_multiple += '<option value="BRI">BRI (058401031165502 A/N Sutono)</option>';
								history_pembayaran_multiple += '<option value="Mandiri">Mandiri (1410005187422 A/N Sutono)</option>';
								history_pembayaran_multiple += ' </select>';
								history_pembayaran_multiple += ' </td>';

								history_pembayaran_multiple += '<td width="21%" style="border-collapse: collapse; border:1px solid white;"';
								history_pembayaran_multiple += ' class="numeric-cell text-align-center"><input style="width:100%;" id="pembayaran_4_' + val.pembayaran_id + '" class="input-pembayaran-multiple" name="pembayaran_4_' + val.pembayaran_id + '"  type="text" /></td>';
								history_pembayaran_multiple += '<td width="18%" style="border-collapse: collapse; border:1px solid white;"';
								history_pembayaran_multiple += ' class="numeric-cell text-align-center"><input style="width:100%;" id="keterangan_4_' + val.pembayaran_id + '" name="keterangan_4_' + val.pembayaran_id + '"  type="text" /></td>';
								history_pembayaran_multiple += '<td width="10%" style="border-collapse: collapse; border:1px solid white;"';
								history_pembayaran_multiple += ' class="numeric-cell text-align-center"><button class="text-add-colour-black-soft bg-dark-gray-young button-small col button text-bold" onclick="prosesPembayaranMultiple(' + val.pembayaran_id + ',4);">Simpan</button></td>';
								history_pembayaran_multiple += ' </tr></form>';
							}
						}
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
						history_pembayaran_multiple += ' class="numeric-cell text-align-center">' + val.keterangan_5 + '</td>';
						history_pembayaran_multiple += '<td width="10%" style="border-collapse: collapse; border:1px solid white;"';
						history_pembayaran_multiple += ' class="numeric-cell text-align-center">-</td>';
						history_pembayaran_multiple += ' </tr>';
					} else {
						if (val.pembayaran_4 != null && val.pembayaran_4 != 0) {
							if (status_lunas != "lunas") {
								history_pembayaran_multiple += '<form id="pembayaran_form_multiple_5_' + val.pembayaran_id + '"><tr>';
								history_pembayaran_multiple += '<td width="15%" style="border-collapse: collapse; border:1px solid white;" colspan="2"';
								history_pembayaran_multiple += ' class="numeric-cell text-align-center">Bayar 5';
								history_pembayaran_multiple += '</td>';
								history_pembayaran_multiple += '<td width="18%" style="border-collapse: collapse; border:1px solid white;"';
								history_pembayaran_multiple += ' class="numeric-cell text-align-center"><input  style="width:105px;" id="tanggal_5_' + val.pembayaran_id + '" name="tanggal_5_' + val.pembayaran_id + '"  type="date" class="date-multiple-penbayaran" value="'+moment().format('YYYY-MM-DD')+'"  readonly/></td>';

								history_pembayaran_multiple += '<td width="15%" style="border-collapse: collapse; border:1px solid white;" class="numeric-cell text-align-center">';
								history_pembayaran_multiple += '<select style="width:60%; background-color:#1c1c1d;" class="performa-input input-item-bank" id="bank_5_' + val.pembayaran_id + '" name="bank_5_' + val.pembayaran_id + '" required validate>';
								history_pembayaran_multiple += '<option value="" selected>bank</option>';
								history_pembayaran_multiple += '<option value="BCA">BCA (0183129551 A/N Sutono)</option>';
								history_pembayaran_multiple += '<option value="BRI">BRI (058401031165502 A/N Sutono)</option>';
								history_pembayaran_multiple += '<option value="Mandiri">Mandiri (1410005187422 A/N Sutono)</option>';
								history_pembayaran_multiple += ' </select>';
								history_pembayaran_multiple += ' </td>';

								history_pembayaran_multiple += '<td width="21%" style="border-collapse: collapse; border:1px solid white;"';
								history_pembayaran_multiple += ' class="numeric-cell text-align-center"><input style="width:100%;" id="pembayaran_5_' + val.pembayaran_id + '" class="input-pembayaran-multiple" name="pembayaran_5_' + val.pembayaran_id + '"  type="text" /></td>';
								history_pembayaran_multiple += '<td width="18%" style="border-collapse: collapse; border:1px solid white;"';
								history_pembayaran_multiple += ' class="numeric-cell text-align-center"><input style="width:100%;" id="keterangan_5_' + val.pembayaran_id + '" name="keterangan_5_' + val.pembayaran_id + '"  type="text" /></td>';
								history_pembayaran_multiple += '<td width="10%" style="border-collapse: collapse; border:1px solid white;"';
								history_pembayaran_multiple += ' class="numeric-cell text-align-center"><button class="text-add-colour-black-soft bg-dark-gray-young button-small col button text-bold" onclick="prosesPembayaranMultiple(' + val.pembayaran_id + ',5);">Simpan</button></td>';

								history_pembayaran_multiple += ' </tr></form>';
							}
						}
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
						history_pembayaran_multiple += ' class="numeric-cell text-align-center">' + val.keterangan_6 + '</td>';
						history_pembayaran_multiple += '<td width="10%" style="border-collapse: collapse; border:1px solid white;"';
						history_pembayaran_multiple += ' class="numeric-cell text-align-center">-</td>';
						history_pembayaran_multiple += ' </tr>';
					} else {
						if (val.pembayaran_5 != null && val.pembayaran_5 != 0) {
							history_pembayaran_multiple += '<form id="pembayaran_form_multiple_6_' + val.pembayaran_id + '"><tr>';
							history_pembayaran_multiple += '<td width="15%" style="border-collapse: collapse; border:1px solid white;" colspan="2"';
							history_pembayaran_multiple += ' class="numeric-cell text-align-center">Bayar 6';
							history_pembayaran_multiple += '</td>';
							history_pembayaran_multiple += '<td width="18%" style="border-collapse: collapse; border:1px solid white;"';
							history_pembayaran_multiple += ' class="numeric-cell text-align-center"><input  style="width:105px;" id="tanggal_6_' + val.pembayaran_id + '" name="tanggal_6_' + val.pembayaran_id + '"  type="date" class="date-multiple-penbayaran" value="'+moment().format('YYYY-MM-DD')+'"  readonly/></td>';

							history_pembayaran_multiple += '<td width="15%" style="border-collapse: collapse; border:1px solid white;" class="numeric-cell text-align-center">';
							history_pembayaran_multiple += '<select style="width:60%; background-color:#1c1c1d;" class="performa-input input-item-bank" id="bank_6_' + val.pembayaran_id + '" name="bank_6_' + val.pembayaran_id + '" required validate>';
							history_pembayaran_multiple += '<option value="" selected>bank</option>';
							history_pembayaran_multiple += '<option value="BCA">BCA (0183129551 A/N Sutono)</option>';
							history_pembayaran_multiple += '<option value="BRI">BRI (058401031165502 A/N Sutono)</option>';
							history_pembayaran_multiple += '<option value="Mandiri">Mandiri (1410005187422 A/N Sutono)</option>';
							history_pembayaran_multiple += ' </select>';
							history_pembayaran_multiple += ' </td>';

							history_pembayaran_multiple += '<td width="21%" style="border-collapse: collapse; border:1px solid white;"';
							history_pembayaran_multiple += ' class="numeric-cell text-align-center"><input style="width:100%;" id="pembayaran_6_' + val.pembayaran_id + '" class="input-pembayaran-multiple" name="pembayaran_6_' + val.pembayaran_id + '"  type="text" /></td>';
							history_pembayaran_multiple += '<td width="18%" style="border-collapse: collapse; border:1px solid white;"';
							history_pembayaran_multiple += ' class="numeric-cell text-align-center"><input style="width:100%;" id="keterangan_6_' + val.pembayaran_id + '" name="keterangan_6_' + val.pembayaran_id + '"  type="text" /></td>';
							history_pembayaran_multiple += '<td width="10%" style="border-collapse: collapse; border:1px solid white;"';
							history_pembayaran_multiple += ' class="numeric-cell text-align-center"><button class="text-add-colour-black-soft bg-dark-gray-young button-small col button text-bold" onclick="prosesPembayaranMultiple(' + val.pembayaran_id + ',6);">Simpan</button></td>';
							history_pembayaran_multiple += ' </tr></form>';
						}
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
						history_pembayaran_multiple += ' class="numeric-cell text-align-center">' + val.keterangan_7 + '</td>';
						history_pembayaran_multiple += ' </tr>';
					} else {
						if (val.pembayaran_6 != null && val.pembayaran_6 != 0) {
							history_pembayaran_multiple += '<form id="pembayaran_form_multiple_7_' + val.pembayaran_id + '"><tr>';
							history_pembayaran_multiple += '<td width="15%" style="border-collapse: collapse; border:1px solid white;" colspan="2"';
							history_pembayaran_multiple += ' class="numeric-cell text-align-center">Bayar 7';
							history_pembayaran_multiple += '</td>';
							history_pembayaran_multiple += '<td width="18%" style="border-collapse: collapse; border:1px solid white;"';
							history_pembayaran_multiple += ' class="numeric-cell text-align-center"><input  style="width:105px;" id="tanggal_7_' + val.pembayaran_id + '" name="tanggal_7_' + val.pembayaran_id + '"  type="date" class="date-multiple-penbayaran" value="'+moment().format('YYYY-MM-DD')+'"  readonly/></td>';

							history_pembayaran_multiple += '<td width="15%" style="border-collapse: collapse; border:1px solid white;" class="numeric-cell text-align-center">';
							history_pembayaran_multiple += '<select style="width:60%; background-color:#1c1c1d;" class="performa-input input-item-bank" id="bank_7_' + val.pembayaran_id + '" name="bank_7_' + val.pembayaran_id + '" required validate>';
							history_pembayaran_multiple += '<option value="" selected>bank</option>';
							history_pembayaran_multiple += '<option value="BCA">BCA (0183129551 A/N Sutono)</option>';
							history_pembayaran_multiple += '<option value="BRI">BRI (058401031165502 A/N Sutono)</option>';
							history_pembayaran_multiple += '<option value="Mandiri">Mandiri (1410005187422 A/N Sutono)</option>';
							history_pembayaran_multiple += ' </select>';
							history_pembayaran_multiple += ' </td>';

							history_pembayaran_multiple += '<td width="21%" style="border-collapse: collapse; border:1px solid white;"';
							history_pembayaran_multiple += ' class="numeric-cell text-align-center"><input style="width:100%;" id="pembayaran_7_' + val.pembayaran_id + '" class="input-pembayaran-multiple" name="pembayaran_7_' + val.pembayaran_id + '"  type="text" /></td>';
							history_pembayaran_multiple += '<td width="18%" style="border-collapse: collapse; border:1px solid white;"';
							history_pembayaran_multiple += ' class="numeric-cell text-align-center"><input style="width:100%;" id="keterangan_7_' + val.pembayaran_id + '" name="keterangan_7_' + val.pembayaran_id + '"  type="text" /></td>';
							history_pembayaran_multiple += '<td width="10%" style="border-collapse: collapse; border:1px solid white;"';
							history_pembayaran_multiple += ' class="numeric-cell text-align-center"><button class="text-add-colour-black-soft bg-dark-gray-young button-small col button text-bold" onclick="prosesPembayaranMultiple(' + val.pembayaran_id + ',7);">Simpan</button></td>';
							history_pembayaran_multiple += ' </tr></form>';
						}
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
						history_pembayaran_multiple += ' class="numeric-cell text-align-center">' + number_format(val.pembayaran_8) + '</td>';
						history_pembayaran_multiple += ' </tr>';
					} else {
						if (val.pembayaran_7 != null && val.pembayaran_7 != 0) {
							history_pembayaran_multiple += '<form id="pembayaran_form_multiple_8_' + val.pembayaran_id + '"><tr>';
							history_pembayaran_multiple += '<td width="18%" style="border-collapse: collapse; border:1px solid white;" colspan="2"';
							history_pembayaran_multiple += ' class="numeric-cell text-align-center">Bayar 8';
							history_pembayaran_multiple += '</td>';
							history_pembayaran_multiple += '<td width="18%" style="border-collapse: collapse; border:1px solid white;"';
							history_pembayaran_multiple += ' class="numeric-cell text-align-center"><input  style="width:105px;" id="tanggal_8_' + val.pembayaran_id + '" name="tanggal_8_' + val.pembayaran_id + '"  type="date" class="date-multiple-penbayaran" value="'+moment().format('YYYY-MM-DD')+'"  readonly/></td>';

							history_pembayaran_multiple += '<td width="15%" style="border-collapse: collapse; border:1px solid white;" class="numeric-cell text-align-center">';
							history_pembayaran_multiple += '<select style="width:60%; background-color:#1c1c1d;" class="performa-input input-item-bank" id="bank_8_' + val.pembayaran_id + '" name="bank_8_' + val.pembayaran_id + '" required validate>';
							history_pembayaran_multiple += '<option value="" selected>bank</option>';
							history_pembayaran_multiple += '<option value="BCA">BCA (0183129551 A/N Sutono)</option>';
							history_pembayaran_multiple += '<option value="BRI">BRI (058401031165502 A/N Sutono)</option>';
							history_pembayaran_multiple += '<option value="Mandiri">Mandiri (1410005187422 A/N Sutono)</option>';
							history_pembayaran_multiple += ' </select>';
							history_pembayaran_multiple += ' </td>';

							history_pembayaran_multiple += '<td width="21%" style="border-collapse: collapse; border:1px solid white;"';
							history_pembayaran_multiple += ' class="numeric-cell text-align-center"><input style="width:100%;" id="pembayaran_8_' + val.pembayaran_id + '" class="input-pembayaran-multiple" name="pembayaran_8_' + val.pembayaran_id + '"  type="text" /></td>';
							history_pembayaran_multiple += '<td width="18%" style="border-collapse: collapse; border:1px solid white;"';
							history_pembayaran_multiple += ' class="numeric-cell text-align-center"><input style="width:100%;" id="keterangan_8_' + val.pembayaran_id + '" name="keterangan_8_' + val.pembayaran_id + '"  type="text" /></td>';
							history_pembayaran_multiple += '<td width="10%" style="border-collapse: collapse; border:1px solid white;"';
							history_pembayaran_multiple += ' class="numeric-cell text-align-center"><button class="text-add-colour-black-soft bg-dark-gray-young button-small col button text-bold" onclick="prosesPembayaranMultiple(' + val.pembayaran_id + ',8);">Simpan</button></td>';
							history_pembayaran_multiple += ' </tr></form>';
						}
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
					} else {
						if (val.pembayaran_8 != null && val.pembayaran_8 != 0) {
							history_pembayaran_multiple += '<form id="pembayaran_form_multiple_9_' + val.pembayaran_id + '"><tr>';
							history_pembayaran_multiple += '<td width="18%" style="border-collapse: collapse; border:1px solid white;" colspan="2"';
							history_pembayaran_multiple += ' class="numeric-cell text-align-center">Bayar 9';
							history_pembayaran_multiple += '</td>';
							history_pembayaran_multiple += '<td width="18%" style="border-collapse: collapse; border:1px solid white;"';
							history_pembayaran_multiple += ' class="numeric-cell text-align-center"><input  style="width:105px;" id="tanggal_9_' + val.pembayaran_id + '" name="tanggal_9_' + val.pembayaran_id + '"  type="date" class="date-multiple-penbayaran" value="'+moment().format('YYYY-MM-DD')+'"  readonly/></td>';

							history_pembayaran_multiple += '<td width="15%" style="border-collapse: collapse; border:1px solid white;" class="numeric-cell text-align-center">';
							history_pembayaran_multiple += '<select style="width:60%; background-color:#1c1c1d;" class="performa-input input-item-bank" id="bank_9_' + val.pembayaran_id + '" name="bank_9_' + val.pembayaran_id + '" required validate>';
							history_pembayaran_multiple += '<option value="" selected>bank</option>';
							history_pembayaran_multiple += '<option value="BCA">BCA (0183129551 A/N Sutono)</option>';
							history_pembayaran_multiple += '<option value="BRI">BRI (058401031165502 A/N Sutono)</option>';
							history_pembayaran_multiple += '<option value="Mandiri">Mandiri (1410005187422 A/N Sutono)</option>';
							history_pembayaran_multiple += ' </select>';
							history_pembayaran_multiple += ' </td>';

							history_pembayaran_multiple += '<td width="21%" style="border-collapse: collapse; border:1px solid white;"';
							history_pembayaran_multiple += ' class="numeric-cell text-align-center"><input style="width:100%;" id="pembayaran_9_' + val.pembayaran_id + '" class="input-pembayaran-multiple" name="pembayaran_9_' + val.pembayaran_id + '"  type="text" /></td>';
							history_pembayaran_multiple += '<td width="18%" style="border-collapse: collapse; border:1px solid white;"';
							history_pembayaran_multiple += ' class="numeric-cell text-align-center"><input style="width:100%;" id="keterangan_9_' + val.pembayaran_id + '" name="keterangan_9_' + val.pembayaran_id + '"  type="text" /></td>';
							history_pembayaran_multiple += '<td width="10%" style="border-collapse: collapse; border:1px solid white;"';
							history_pembayaran_multiple += ' class="numeric-cell text-align-center"><button class="text-add-colour-black-soft bg-dark-gray-young button-small col button text-bold" onclick="prosesPembayaranMultiple(' + val.pembayaran_id + ',9);">Simpan</button></td>';
							history_pembayaran_multiple += ' </tr></form>';
						}
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
					} else {
						if (val.pembayaran_9 != null && val.pembayaran_9 != 0) {
							history_pembayaran_multiple += '<form id="pembayaran_form_multiple_10_' + val.pembayaran_id + '"><tr>';
							history_pembayaran_multiple += '<td width="18%" style="border-collapse: collapse; border:1px solid white;" colspan="2"';
							history_pembayaran_multiple += ' class="numeric-cell text-align-center">Bayar 10';
							history_pembayaran_multiple += '</td>';
							history_pembayaran_multiple += '<td width="18%" style="border-collapse: collapse; border:1px solid white;"';
							history_pembayaran_multiple += ' class="numeric-cell text-align-center"><input  style="width:105px;" id="tanggal_10_' + val.pembayaran_id + '" name="tanggal_10_' + val.pembayaran_id + '"  type="date" class="date-multiple-penbayaran" value="'+moment().format('YYYY-MM-DD')+'"  readonly/></td>';

							history_pembayaran_multiple += '<td width="15%" style="border-collapse: collapse; border:1px solid white;" class="numeric-cell text-align-center">';
							history_pembayaran_multiple += '<select style="width:60%; background-color:#1c1c1d;" class="performa-input input-item-bank" id="bank_10_' + val.pembayaran_id + '" name="bank_10_' + val.pembayaran_id + '" required validate>';
							history_pembayaran_multiple += '<option value="" selected>bank</option>';
							history_pembayaran_multiple += '<option value="BCA">BCA (0183129551 A/N Sutono)</option>';
							history_pembayaran_multiple += '<option value="BRI">BRI (058401031165502 A/N Sutono)</option>';
							history_pembayaran_multiple += '<option value="Mandiri">Mandiri (1410005187422 A/N Sutono)</option>';
							history_pembayaran_multiple += ' </select>';
							history_pembayaran_multiple += ' </td>';

							history_pembayaran_multiple += '<td width="21%" style="border-collapse: collapse; border:1px solid white;"';
							history_pembayaran_multiple += ' class="numeric-cell text-align-center"><input style="width:100%;" id="pembayaran_10_' + val.pembayaran_id + '" class="input-pembayaran-multiple" name="pembayaran_10_' + val.pembayaran_id + '"  type="text" /></td>';
							history_pembayaran_multiple += '<td width="18%" style="border-collapse: collapse; border:1px solid white;"';
							history_pembayaran_multiple += ' class="numeric-cell text-align-center"><input style="width:100%;" id="keterangan_10_' + val.pembayaran_id + '" name="keterangan_10_' + val.pembayaran_id + '"  type="text" /></td>';
							history_pembayaran_multiple += '<td width="10%" style="border-collapse: collapse; border:1px solid white;"';
							history_pembayaran_multiple += ' class="numeric-cell text-align-center"><button class="text-add-colour-black-soft bg-dark-gray-young button-small col button text-bold" onclick="prosesPembayaranMultiple(' + val.pembayaran_id + ',10);">Simpan</button></td>';
							history_pembayaran_multiple += ' </tr></form>';
						}
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
				document.getElementsByClassName("date-multiple-penbayaran")[0].setAttribute('min', today);
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

function prosesPembayaran() {
	if (!$$('#pembayaran_form')[0].checkValidity()) {
		app.dialog.alert('Cek Isian Pembayaran Anda');
	} else {
		sisa_pembayaran = jQuery('#popup-pembayaran-penjualan_kekurangan').text();
		sudah_dibayar = jQuery('#popup-pembayaran-penjualan_jumlah_pembayaran').text();
		pembayaran_1 = jQuery('#pembayaran_1_dp_awal').val();
		pembayaran_2 = jQuery('#pembayaran_2').val();
		pembayaran_3 = jQuery('#pembayaran_3').val();
		pembayaran_4 = jQuery('#pembayaran_4').val();
		pembayaran_5 = jQuery('#pembayaran_5').val();
		pembayaran_6 = jQuery('#pembayaran_6').val();
		pembayaran_7 = jQuery('#pembayaran_7').val();
		pembayaran_8 = jQuery('#pembayaran_8').val();
		pembayaran_9 = jQuery('#pembayaran_9').val();
		pembayaran_10 = jQuery('#pembayaran_10').val();

		jQuery.ajax({
			type: 'POST',
			url: "" + BASE_API + "/pembayaran",
			dataType: 'JSON',
			data: {
				pembayaran_1: pembayaran_1.replace(/\,/g, '').replace(/\ -/g, ''),
				pembayaran_2: pembayaran_2.replace(/\,/g, '').replace(/\ -/g, ''),
				pembayaran_3: pembayaran_3.replace(/\,/g, '').replace(/\ -/g, ''),
				pembayaran_4: pembayaran_4.replace(/\,/g, '').replace(/\ -/g, ''),
				pembayaran_5: pembayaran_5.replace(/\,/g, '').replace(/\ -/g, ''),
				pembayaran_6: pembayaran_6.replace(/\,/g, '').replace(/\ -/g, ''),
				pembayaran_7: pembayaran_7.replace(/\,/g, '').replace(/\ -/g, ''),
				pembayaran_8: pembayaran_8.replace(/\,/g, '').replace(/\ -/g, ''),
				pembayaran_9: pembayaran_9.replace(/\,/g, '').replace(/\ -/g, ''),
				pembayaran_10: pembayaran_10.replace(/\,/g, '').replace(/\ -/g, ''),
				bank_1: jQuery("#bank_1").val(),
				bank_2: jQuery("#bank_2").val(),
				bank_3: jQuery("#bank_3").val(),
				bank_4: jQuery("#bank_4").val(),
				bank_5: jQuery("#bank_5").val(),
				bank_6: jQuery("#bank_6").val(),
				bank_7: jQuery("#bank_7").val(),
				bank_8: jQuery("#bank_8").val(),
				bank_9: jQuery("#bank_9").val(),
				bank_10: jQuery("#bank_10").val(),
				karyawan_id: localStorage.getItem("user_id"),
				client_id: jQuery("#pembayaran-client_id").val(),
				penjualan_id: jQuery("#pembayaran-penjualan_id").val(),
				sisa_pembayaran: sisa_pembayaran.replace(/\,/g, '').replace(/\ -/g, ''),
				sudah_dibayar: sudah_dibayar.replace(/\,/g, '').replace(/\ -/g, '')
			},
			beforeSend: function () {
				app.dialog.preloader('Harap Tunggu');
			},
			success: function (data) {
				getPenjualanHeader(1);
				app.dialog.close();
				app.popup.close();
				$$('#pembayaran_field').empty();
				if (data.status == 'done') {
					app.dialog.alert('Berhasil Input Pembayaran');
				} else if (data.status == 'failed') {
					app.dialog.alert('Gagal Input Pembayaran');
				}
			},
			error: function (xmlhttprequest, textstatus, message) {
			}
		});
	}
}

function detailPenjualan(penjualan_id, jenis_penjualan, komisi, client_alamat, client_cp, client_cp_posisi, client_id, client_kota, client_nama, client_telp, jenis_penjualan, karyawan_id, penjualan_global_diskon, penjualan_grandtotal, penjualan_id, penjualan_jumlah_pembayaran, penjualan_keterangan, penjualan_status, penjualan_status_pembayaran, penjualan_tanggal, penjualan_tanggal_kirim, penjualan_total, penjualan_void_keterangan, penjualan_total_qty) {
	if (jenis_penjualan == 'non_performa') {
		detail_sales_data = '';
		jQuery.ajax({
			type: 'POST',
			url: "" + BASE_API + "/api/get-penjualan-detail",
			dataType: 'JSON',
			data: {
				karyawan_id: localStorage.getItem("user_id"),
				penjualan_id: penjualan_id,
				jenis_penjualan: jenis_penjualan
			},
			beforeSend: function () {
				$$('#detail_sales_data').html('');
				app.dialog.preloader('Harap Tunggu');
			},
			success: function (data) {

				$$('#popup-penjualan-client_nama').html(client_nama + ', PT');
				$$('#popup-penjualan-client_person').html(client_cp);
				$$('#popup-penjualan-client_posisi').html(client_cp_posisi);
				$$('#popup-penjualan-client_telpon').html(client_telp);
				$$('#popup-penjualan-penjualan_tanggal').html(moment(penjualan_tanggal).format('DD-MMM-YYYY'));
				$$('#popup-penjualan-penjualan_selesai').html(moment(penjualan_tanggal_kirim).format('DD-MMM-YYYY'));
				$$('#popup-penjualan-penjualan_jumlah').html(penjualan_total_qty);
				$$('#popup-penjualan-penjualan_grandtotal').html(number_format(penjualan_grandtotal) + ',-');
				$$('#popup-penjualan-penjualan_kekurangan').html(number_format(penjualan_grandtotal - penjualan_jumlah_pembayaran) + ',-');
				$$('#popup-penjualan-penjualan_jumlah_pembayaran').html(number_format(penjualan_jumlah_pembayaran) + ',-');
				$$('#popup-penjualan-penjualan_status_pembayaran').html('<b>' + penjualan_status_pembayaran + '</b>');

				app.dialog.close();

				if (data.data.length != 0) {
					jQuery.each(data.data, function (i, val) {
						var no = i + 1;
						detail_sales_data += '<table border="1">';
						detail_sales_data += '<tbody>';
						detail_sales_data += ' <tr class="bg-dark-gray-medium">';
						detail_sales_data += '  <td colspan="2" class="label-cell text-align-center">';
						detail_sales_data += '   <h3>Sales #' + no + '</h3>';
						detail_sales_data += ' </td>';
						detail_sales_data += '</tr>';
						detail_sales_data += '<tr class="">';
						detail_sales_data += '  <td class="label-cell text-align-center" width="50%">Gambar</td>';
						detail_sales_data += ' <td class="label-cell text-align-center" width="50%">';
						detail_sales_data += '  Spesifikasi';
						detail_sales_data += ' </td>';
						detail_sales_data += ' </tr>';
						detail_sales_data += ' <tr>';
						detail_sales_data += '   <td class="label-cell text-align-center"><img src="' + BASE_PATH_IMAGE + '/' + val.foto_depan + '" width="100%"> </td>';
						detail_sales_data += '   <td class="label-cell text-align-center" style="white-space: pre;">';
						detail_sales_data += '   ' + val.produk_keterangan_kustom + '';
						detail_sales_data += '  </td>';
						detail_sales_data += '</tr>';
						detail_sales_data += ' <tr class="bg-dark-gray-medium">';
						detail_sales_data += '  <td class="label-cell text-align-center">Qty</td>';
						detail_sales_data += '  <td class="label-cell text-align-center">Price</td>';
						detail_sales_data += ' </tr>';
						detail_sales_data += ' <tr>';
						detail_sales_data += '  <td class="label-cell text-align-center">' + val.penjualan_qty + '</td>';
						detail_sales_data += '  <td class="label-cell" align="right">' + number_format(val.penjualan_harga) + '</td>';
						detail_sales_data += '</tr>';
						detail_sales_data += ' <tr class="bg-dark-gray-medium">';
						detail_sales_data += '   <td colspan="2" class="label-cell text-align-center">Total</td>';
						detail_sales_data += ' </tr>';
						detail_sales_data += ' <tr>';
						detail_sales_data += '  <td colspan="2" class="label-cell" align="right">' + number_format(val.penjualan_detail_grandtotal) + '</td>';
						detail_sales_data += ' </tr>';
						detail_sales_data += '</tbody>';
						detail_sales_data += '</table><br>';
					});
					$$('#detail_sales_data').html(detail_sales_data);
				} else {
					$$('#detail_sales_data').html('<center><h3>Tidak Ada Data</h3></center>');
				}
			},
			error: function (xmlhttprequest, textstatus, message) {
			}
		});
	} else {
		detail_sales_data = '';
		jQuery.ajax({
			type: 'POST',
			url: "" + BASE_API + "/get-penjualan-detail-performa",
			dataType: 'JSON',
			data: {
				karyawan_id: localStorage.getItem("user_id"),
				penjualan_id: penjualan_id,
				jenis_penjualan: jenis_penjualan
			},
			beforeSend: function () {
				$$('#detail_sales_data').html('');
				app.dialog.preloader('Harap Tunggu');
			},
			success: function (data) {
				app.dialog.close();
				$$('#popup-penjualan-td-client_nama').html(client_nama);
				$$('#popup-penjualan-client_person').html(client_cp);
				$$('#popup-penjualan-client_posisi').html(client_cp_posisi);
				$$('#popup-penjualan-client_telpon').html(client_telp);
				$$('#popup-penjualan-penjualan_tanggal').html(moment(penjualan_tanggal).format('DD-MMM-YYYY'));
				$$('#popup-penjualan-penjualan_selesai').html(moment(penjualan_tanggal_kirim).format('DD-MMM-YYYY'));
				$$('#popup-penjualan-penjualan_jumlah').html(penjualan_total_qty);
				$$('#popup-penjualan-penjualan_grandtotal').html(number_format(penjualan_grandtotal) + ' ,-');
				$$('#popup-penjualan-penjualan_kekurangan').html(number_format(penjualan_grandtotal - penjualan_jumlah_pembayaran) + ' ,-');
				$$('#popup-penjualan-penjualan_jumlah_pembayaran').html(number_format(penjualan_jumlah_pembayaran) + ' ,-');
				$$('#popup-penjualan-penjualan_status_pembayaran').html(penjualan_status_pembayaran);


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
						detail_sales_data += '   <td colspan="1" class="label-cell text-align-center" width="35%">' + val.penjualan_jenis + '<br><img src="' + BASE_PATH_IMAGE_PERFORMA + '/' + val.gambar + '" width="96px"></td>';
						detail_sales_data += '   <td colspan="2" class="label-cell text-align-center" width="74%" style="white-space: pre;">' + val.produk_keterangan_kustom + '<br><font color="red">' + val.keterangan + '</font></td>';
						detail_sales_data += '</tr>';
						detail_sales_data += ' <tr class="">';
						detail_sales_data += '  <td class="label-cell text-align-center" width="35%">Qty</td>';
						detail_sales_data += '  <td class="label-cell text-align-center" width="37%">Price</td>';
						detail_sales_data += '  <td class="label-cell text-align-center" width="37%">Total</td>';
						detail_sales_data += ' </tr>';
						detail_sales_data += ' <tr>';
						detail_sales_data += '  <td class="label-cell text-align-center" width="35%">' + val.penjualan_qty + '</td>';
						detail_sales_data += '  <td class="label-cell text-align-center" width="37%"">' + number_format(val.penjualan_harga) + ',-</td>';
						detail_sales_data += '  <td class="label-cell text-align-center" width="37%">' + number_format(val.penjualan_detail_grandtotal) + ',-</td>';
						detail_sales_data += '</tr>';
						detail_sales_data += '</tbody>';
						detail_sales_data += '</table><br>';
					});
					$$('#detail_sales_data').html(detail_sales_data);
				} else {
					$$('#detail_sales_data').html('<center><h3>Tidak Ada Data</h3></center>');
				}
			},
			error: function (xmlhttprequest, textstatus, message) {
			}
		});
	}


}


function detailPenjualanTolltip(penjualan_id) {
	detail_sales_data = '';
	if ($$('.detail_sales_data_tooltip_' + penjualan_id + '').hasClass("open-detail")) {
		$$('.detail_sales_data_tooltip_' + penjualan_id + '').html(detail_sales_data);
		$$('.detail_sales_data_tooltip_' + penjualan_id + '').removeClass('open-detail');
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
				detail_sales_data += '<table  width="100%" style="border-collapse: collapse; border:1px solid gray;" border="1">';
				detail_sales_data += '<tbody>';
				jQuery.each(data.data, function (i, val) {
					var no = i + 1;

					if (val.status_produksi == "proses") {
						var table_color_status_tooltip = "card-color-green";
					} else if (val.status_produksi == "selesai") {
						var table_color_status_tooltip = "card-color-blue";
					}
					detail_sales_data += ' <tr>';
					detail_sales_data += '  <td class="label-cell text-align-left ' + table_color_status_tooltip + '" width="100%">' + val.penjualan_jenis + '</td>';
					detail_sales_data += '</tr>';

				});
				detail_sales_data += '</tbody>';
				detail_sales_data += '</table>';
				$$('.detail_sales_data_tooltip_' + penjualan_id + '').html(detail_sales_data);
				$$('.detail_sales_data_tooltip_' + penjualan_id + '').addClass('open-detail');



			},
			error: function (xmlhttprequest, textstatus, message) {
			}
		});
	}

}

function dateRangeDeclarationPenjualan() {
	calendarRangePenjualan = app.calendar.create({
		inputEl: '#range-penjualan',
		rangePicker: true,
		dateFormat: 'dd-mm-yyyy',
		closeOnSelect: true,
		rangePickerMinDays: 7,
		on: {
			close: function () {
				getPenjualanHeader(1);
			}
		}
	});
}

var delayTimer;
function doSearchByPerusahaan(text) {
	clearTimeout(delayTimer);
	delayTimer = setTimeout(function () {
		getPenjualanHeader(1);
	}, 1000);
}

function suratJalanPenjualan(penjualan_id) {
	var suratJalanPenjualanVal = "";
	jQuery.ajax({
		type: 'POST',
		url: "" + BASE_API + "/get-penjualan-surat-jalan",
		dataType: 'JSON',
		data: {
			karyawan_id: localStorage.getItem("user_id"),
			penjualan_id: penjualan_id
		},
		beforeSend: function () {
		},
		success: function (data) {
			$.each(data.data, function (i, item) {

				if (item.tgl_kirim1 == "" || item.tgl_kirim1 == null) {
					var tgl_kirim1 = "-";
				} else {
					var tgl_kirim1 = moment(item.tgl_kirim1).format('DD-MMM');

				}

				if (item.tgl_kirim2 == "" || item.tgl_kirim2 == null) {
					var tgl_kirim2 = "-";
				} else {
					var tgl_kirim2 = moment(item.tgl_kirim2).format('DD-MMM');
				}

				if (item.tgl_kirim3 == "" || item.tgl_kirim3 == null) {
					var tgl_kirim3 = "-";
				} else {
					var tgl_kirim3 = moment(item.tgl_kirim3).format('DD-MMM');
				}

				if (item.tgl_kirim4 == "" || item.tgl_kirim4 == null) {
					var tgl_kirim4 = "-";
				} else {
					var tgl_kirim4 = moment(item.tgl_kirim4).format('DD-MMM');
				}

				if (item.tgl_kirim5 == "" || item.tgl_kirim5 == null) {
					var tgl_kirim5 = "-";
				} else {
					var tgl_kirim5 = moment(item.tgl_kirim1).format('DD-MMM');
				}

				if (item.pengiriman_1 == "" || item.pengiriman_1 == null) {
					var pengiriman_1 = "-";
				} else {
					var pengiriman_1 = item.pengiriman_1;
				}

				if (item.pengiriman_2 == "" || item.pengiriman_2 == null) {
					var pengiriman_2 = "-";
				} else {
					var pengiriman_2 = item.pengiriman_2;
				}

				if (item.pengiriman_3 == "" || item.pengiriman_3 == null) {
					var pengiriman_3 = "-";
				} else {
					var pengiriman_3 = item.pengiriman_3;
				}

				if (item.pengiriman_4 == "" || item.pengiriman_4 == null) {
					var pengiriman_4 = "-";
				} else {
					var pengiriman_4 = item.pengiriman_4;
				}

				if (item.pengiriman_5 == "" || item.pengiriman_5 == null) {
					var pengiriman_5 = "-";
				} else {
					var pengiriman_5 = item.pengiriman_5;
				}


				if (item.surat_jalan1 == "" || item.surat_jalan1 == null) {
					var surat_jalan1 = "-";
				} else {
					var surat_jalan1 = item.surat_jalan1;
				}

				if (item.surat_jalan2 == "" || item.surat_jalan2 == null) {
					var surat_jalan2 = "-";
				} else {
					var surat_jalan2 = item.surat_jalan2;
				}

				if (item.surat_jalan3 == "" || item.surat_jalan3 == null) {
					var surat_jalan3 = "-";
				} else {
					var surat_jalan3 = item.surat_jalan3;
				}

				if (item.surat_jalan4 == "" || item.surat_jalan4 == null) {
					var surat_jalan4 = "-";
				} else {
					var surat_jalan4 = item.surat_jalan4;
				}

				if (item.surat_jalan5 == "" || item.surat_jalan5 == null) {
					var surat_jalan5 = "-";
				} else {
					var surat_jalan5 = item.surat_jalan5;
				}


				suratJalanPenjualanVal += '<tr style="border-right:1px solid gray; border-bottom:1px solid gray;">';
				suratJalanPenjualanVal += '<td colspan="6" style="border-right:1px solid gray; border-bottom:1px solid gray; border-left:1px solid gray;" class="label-cell">Type : ' + item.penjualan_jenis + '</td>';
				suratJalanPenjualanVal += '</tr>';
				suratJalanPenjualanVal += '<tr style="border-right:1px solid gray; border-bottom:1px solid gray;">';
				suratJalanPenjualanVal += '<td width="25%"  style="border-right:1px solid gray; border-bottom:1px solid gray; border-left:1px solid gray;" class="label-cell" align="center">Tanggal</td>';
				suratJalanPenjualanVal += '<td width="15%" style="border-right:1px solid gray; border-bottom:1px solid gray; border-left:1px solid gray;" class="label-cell" align="center">' + tgl_kirim1 + '</td>';
				suratJalanPenjualanVal += '<td width="15%"  style="border-right:1px solid gray; border-bottom:1px solid gray; border-left:1px solid gray;" class="label-cell" align="center">' + tgl_kirim2 + '</td>';
				suratJalanPenjualanVal += '<td width="15%"  style="border-right:1px solid gray; border-bottom:1px solid gray; border-left:1px solid gray;" class="label-cell" align="center">' + tgl_kirim3 + '</td>';
				suratJalanPenjualanVal += '<td width="15%"  style="border-right:1px solid gray; border-bottom:1px solid gray; border-left:1px solid gray;" class="label-cell" align="center">' + tgl_kirim4 + '</td>';
				suratJalanPenjualanVal += '<td width="15%" style="border-right:1px solid gray; border-bottom:1px solid gray; border-left:1px solid gray;" class="label-cell" align="center">' + tgl_kirim5 + '</td>';
				suratJalanPenjualanVal += '</tr>';
				suratJalanPenjualanVal += '<tr style="border-right:1px solid gray; border-bottom:1px solid gray;">';
				suratJalanPenjualanVal += '<td width="25%"  style="border-right:1px solid gray; border-bottom:1px solid gray; border-left:1px solid gray;" class="label-cell" align="center">Surat Jalan</td>';
				suratJalanPenjualanVal += '<td width="15%" style="border-right:1px solid gray; border-bottom:1px solid gray; border-left:1px solid gray;" class="label-cell" align="center">' + surat_jalan1 + '</td>';
				suratJalanPenjualanVal += '<td width="15%"  style="border-right:1px solid gray; border-bottom:1px solid gray; border-left:1px solid gray;" class="label-cell" align="center">' + surat_jalan2 + '</td>';
				suratJalanPenjualanVal += '<td width="15%"  style="border-right:1px solid gray; border-bottom:1px solid gray; border-left:1px solid gray;" class="label-cell" align="center">' + surat_jalan3 + '</td>';
				suratJalanPenjualanVal += '<td width="15%"  style="border-right:1px solid gray; border-bottom:1px solid gray; border-left:1px solid gray;" class="label-cell" align="center">' + surat_jalan4 + '</td>';
				suratJalanPenjualanVal += '<td width="15%" style="border-right:1px solid gray; border-bottom:1px solid gray; border-left:1px solid gray;" class="label-cell" align="center">' + surat_jalan5 + '</td>';
				suratJalanPenjualanVal += '</tr>';
				suratJalanPenjualanVal += '<tr  style="border-right:1px solid gray; border-bottom:1px solid gray;">';
				suratJalanPenjualanVal += '<td width="25%" style="border-right:1px solid gray; border-bottom:1px solid gray; border-left:1px solid gray;" class="label-cell" align="center">Jumlah</td>';
				suratJalanPenjualanVal += '<td width="15%"  style="border-right:1px solid gray; border-bottom:1px solid gray; border-left:1px solid gray;" class="label-cell" align="center">' + pengiriman_1 + '</td>';
				suratJalanPenjualanVal += '<td width="15%" style="border-right:1px solid gray; border-bottom:1px solid gray; border-left:1px solid gray;" class="label-cell" align="center">' + pengiriman_2 + '</td>';
				suratJalanPenjualanVal += '<td width="15%" style="border-right:1px solid gray; border-bottom:1px solid gray; border-left:1px solid gray;" class="label-cell" align="center">' + pengiriman_3 + '</td>';
				suratJalanPenjualanVal += '<td width="15%" style="border-right:1px solid gray; border-bottom:1px solid gray; border-left:1px solid gray;" class="label-cell" align="center">' + pengiriman_4 + '</td>';
				suratJalanPenjualanVal += '<td width="15%"  style="border-right:1px solid gray; border-bottom:1px solid gray; border-left:1px solid gray;" class="label-cell" align="center">' + pengiriman_5 + '</td>';
				suratJalanPenjualanVal += '</tr>';
			});



			$$('#surat_jalan_penjualan').html(suratJalanPenjualanVal);
		},
		error: function (xmlhttprequest, textstatus, message) {
		}
	});

}

function getPenjualanHeader(page) {

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
	var penjualan_value = "";
	var pagination_button = "";


	jQuery.ajax({
		type: 'POST',
		url: "" + BASE_API + "/get-penjualan-header?page=" + page_now + "",
		dataType: 'JSON',
		data: {
			karyawan_id: localStorage.getItem("user_id"),
			startdate: startdate,
			enddate: enddate,
			perusahaan_penjualan_value: perusahaan_penjualan_value
		},
		beforeSend: function () {
			//app.dialog.preloader('Harap Tunggu');
		},
		success: function (data) {
			app.dialog.close();
			no = 1;
			for (i = 0; i < data.data.last_page; i++) {
				no = i + 1;
				pagination_button += '<i onclick="getPenjualanHeader(' + no + ');"  style="border-radius:2px; width:40px; height:40px; background-color:#4c5269; padding-left:8px; padding-right:8px; margin:2px;">' + no + '</i>';
			}

			$.each(data.data.data, function (i, item) {

				if (parseFloat(item.penjualan_grandtotal - item.penjualan_jumlah_pembayaran) <= 0) {
					var color_class = "card-color-blue";
				} else {
					var color_class = "card-blank";
				}
				var sisa = item.penjualan_grandtotal - item.penjualan_jumlah_pembayaran;
				var sisa_fix = number_format(parseFloat(item.penjualan_grandtotal - item.penjualan_jumlah_pembayaran));
				if (sisa <= 0) {
					var sisa_value = sisa_fix.toString().replace(/\-/g, '+');
				} else {
					var sisa_value = sisa_fix;
				}

				if (item.status_produksi == "selesai") {
					var table_color_status_produksi = "card-color-blue";
				} else if (item.status_produksi == "proses") {
					var table_color_status_produksi = "card-color-green";
				}



				if (item.penjualan_total_qty_detail == 0) {
					var button_color_surat_jalan = "background: linear-gradient(lightgray, #686665); /* Standard syntax */ background: -webkit-linear-gradient(lightgray, #686665); /* For Safari 5.1 to 6.0 */background: -o-linear-gradient(lightgray, #686665); /* For Opera 11.1 to 12.0 */background: -moz-linear-gradient(lightgray, #686665); /* For Firefox 3.6 to 15 ";
					var popup = "";
				} else {
					if (item.penjualan_total_qty_detail - item.penjualan_total_kirim >= 0) {
						var button_color_surat_jalan = "forestgreen";
						var popup = "popup-open";
					} else {
						var button_color_surat_jalan = "blue";
						var popup = "popup-open";
					}
				}


				const oneDay = 24 * 60 * 60 * 1000;
				const firstDate = new Date(moment().format('YYYY, MM, DD'));
				const secondDate = new Date(moment(item.penjualan_tanggal_kirim).format('YYYY-MM-DD'));

				const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));

				if (firstDate >= secondDate) {
					var table_color_fix = "card-color-red";
				} else {
					if (diffDays >= 0 && diffDays <= 2) {
						var table_color_fix = "card-color-red";
					}
					else if (diffDays >= 2 && diffDays <= 4) {
						var table_color_fix = "card-color-orange";
					} else if (diffDays >= 4 && diffDays <= 6) {
						var table_color_fix = "card-color-yellow";
					} else if (diffDays >= 6) {
						var table_color_fix = "";
					}
				}

				penjualan_value += '<tr style="border-right:1px solid gray; border-bottom:1px solid gray;" class="' + color_class + ' tr_' + item.penjualan_id + '">';

				penjualan_value += '<td style="border-right:1px solid gray; border-bottom:1px solid gray; border-left:1px solid gray;" class="label-cell ' + table_color_fix + '">' + moment(item.penjualan_tanggal_kirim).format('DD-MMM') + '</td>';

				penjualan_value += '  <td style=" border-bottom:1px solid gray; "  ><center><b>' + moment(item.dt_record).format('DDMMYY') + '-' + item.penjualan_id.replace(/\INV_/g, '').replace(/^0+/, '') + '</b></center></td>';


				penjualan_value += '<td align="left" onclick="detailPenjualanTolltip(\'' + item.penjualan_id + '\');"  style="border-right:1px solid gray; border-bottom:1px solid gray; border-left:1px solid gray;" >' + item.client_nama + '<br><div class="detail_sales_data_tooltip_' + item.penjualan_id + '"></div>';
				penjualan_value += '</td>';


				penjualan_value += '<td align="right" style="border-right:1px solid gray; border-bottom:1px solid gray;" class="label-cell">' + number_format(item.penjualan_grandtotal) + '</td>';
				//penjualan_value += '<td class="label-cell">('+item.presentase_omset+'%) '+number_format(((item.presentase_omset*item.penjualan_grandtotal)/100)/1000)+'</td>';
				penjualan_value += '<td align="right" style="border-right:1px solid gray; border-bottom:1px solid gray;" class="label-cell">' + number_format(item.penjualan_jumlah_pembayaran) + '</td>';
				penjualan_value += '<td align="right" style="border-right:1px solid gray; border-bottom:1px solid gray;" class="label-cell">' + sisa_value + '</td>';
				penjualan_value += '<td style="border-right:1px solid gray; border-bottom:1px solid gray;" class="label-cell">';
				penjualan_value += '   <button  class="text-add-colour-black-soft bg-dark-gray-young button-small col button popup-open text-bold"  onclick="spkPo(\'' + item.penjualan_id_primary + '\',\'' + item.performa_id_relation + '\',\'' + item.performa_id_relation + '\',\'' + item.biaya_kirim + '\',\'' + item.client_alamat + '\',\'' + item.client_cp + '\',\'' + item.client_cp_posisi + '\',\'' + item.client_id + '\',\'' + item.client_kota + '\',\'' + item.client_nama + '\',\'' + item.client_telp + '\',\'' + item.jenis_penjualan + '\',\'' + item.karyawan_id + '\',\'' + item.penjualan_global_diskon + '\',\'' + item.penjualan_grandtotal + '\',\'' + item.penjualan_id + '\',\'' + item.penjualan_jumlah_pembayaran + '\',\'' + item.penjualan_keterangan + '\',\'' + item.penjualan_status + '\',\'' + item.penjualan_status_pembayaran + '\',\'' + item.penjualan_tanggal + '\',\'' + item.penjualan_tanggal_kirim + '\',\'' + item.penjualan_total + '\',\'' + item.penjualan_void_keterangan + '\',\'' + item.penjualan_total_qty + '\');">Spk PO</button>';
				penjualan_value += '</td>';
				penjualan_value += '<td style="border-right:1px solid gray; border-bottom:1px solid gray;" class="label-cell">';
				penjualan_value += '   <button  class="text-add-colour-black-soft bg-dark-gray-young button-small col button popup-open text-bold"  onclick="invoicePenjualan(\'' + item.performa_id_relation + '\',\'' + item.biaya_kirim + '\',\'' + item.client_alamat + '\',\'' + item.client_cp + '\',\'' + item.client_cp_posisi + '\',\'' + item.client_id + '\',\'' + item.client_kota + '\',\'' + item.client_nama + '\',\'' + item.client_telp + '\',\'' + item.jenis_penjualan + '\',\'' + item.karyawan_id + '\',\'' + item.penjualan_global_diskon + '\',\'' + item.penjualan_grandtotal + '\',\'' + item.penjualan_id + '\',\'' + item.penjualan_jumlah_pembayaran + '\',\'' + item.penjualan_keterangan + '\',\'' + item.penjualan_status + '\',\'' + item.penjualan_status_pembayaran + '\',\'' + item.penjualan_tanggal + '\',\'' + item.penjualan_tanggal_kirim + '\',\'' + item.penjualan_total + '\',\'' + item.penjualan_void_keterangan + '\',\'' + item.penjualan_total_qty + '\');">Invoice</button>';
				penjualan_value += '</td>';
				penjualan_value += '<td style="border-right:1px solid gray; border-bottom:1px solid gray;" class="label-cell">';
				penjualan_value += '   <button  class="text-add-colour-black-soft bg-dark-gray-young button-small col button popup-open text-bold" data-popup=".detail-pembayaran" onclick="detailPembayaran(\'' + item.penjualan_tanggal + '\',\'' + item.performa_id_relation + '\',\'' + item.bank_1 + '\',\'' + item.bank_2 + '\',\'' + item.bank_3 + '\',\'' + item.bank_4 + '\',\'' + item.bank_5 + '\',\'' + item.bank_6 + '\',\'' + item.bank_7 + '\',\'' + item.bank_8 + '\',\'' + item.bank_9 + '\',\'' + item.bank_10 + '\',\'' + item.pembayaran1_tgl + '\',\'' + item.pembayaran2_tgl + '\',\'' + item.pembayaran3_tgl + '\',\'' + item.pembayaran4_tgl + '\',\'' + item.pembayaran5_tgl + '\',\'' + item.pembayaran6_tgl + '\',\'' + item.pembayaran7_tgl + '\',\'' + item.pembayaran8_tgl + '\',\'' + item.pembayaran9_tgl + '\',\'' + item.pembayaran10_tgl + '\',\'' + item.bank + '\',\'' + item.pembayaran_1 + '\',\'' + item.pembayaran_2 + '\',\'' + item.pembayaran_3 + '\',\'' + item.pembayaran_4 + '\',\'' + item.pembayaran_5 + '\',\'' + item.pembayaran_6 + '\',\'' + item.pembayaran_7 + '\',\'' + item.pembayaran_8 + '\',\'' + item.pembayaran_9 + '\',\'' + item.pembayaran_10 + '\',\'' + item.client_nama + '\',\'' + item.penjualan_jumlah_pembayaran + '\',\'' + item.penjualan_total_qty + '\',\'' + item.penjualan_grandtotal + '\',\'' + item.penjualan_id + '\',\'' + item.client_id + '\',\'' + item.penjualan_status_pembayaran + '\');">Bayar</button>';
				penjualan_value += '</td>';
				penjualan_value += '<td style="border-right:1px solid gray; border-bottom:1px solid gray;" class="label-cell">';
				penjualan_value += '   <button  class="text-add-colour-black-soft bg-dark-gray-young button-small col button text-bold"  onclick="fullReport(\'' + item.penjualan_id_primary + '\',\'' + item.performa_id_relation + '\',\'' + item.performa_id_relation + '\',\'' + item.biaya_kirim + '\',\'' + item.client_alamat + '\',\'' + item.client_cp + '\',\'' + item.client_cp_posisi + '\',\'' + item.client_id + '\',\'' + item.client_kota + '\',\'' + item.client_nama + '\',\'' + item.client_telp + '\',\'' + item.jenis_penjualan + '\',\'' + item.karyawan_id + '\',\'' + item.penjualan_global_diskon + '\',\'' + item.penjualan_grandtotal + '\',\'' + item.penjualan_id + '\',\'' + item.penjualan_jumlah_pembayaran + '\',\'' + item.penjualan_keterangan + '\',\'' + item.penjualan_status + '\',\'' + item.penjualan_status_pembayaran + '\',\'' + item.penjualan_tanggal + '\',\'' + item.penjualan_tanggal_kirim + '\',\'' + item.penjualan_total + '\',\'' + item.penjualan_void_keterangan + '\',\'' + item.penjualan_total_qty + '\');">Report</button>';
				penjualan_value += '</td>';
				penjualan_value += '<td style="border-right:1px solid gray; border-bottom:1px solid gray;" class="label-cell">';
				penjualan_value += '  <button  class="text-add-colour-black-soft bg-dark-gray-young button-small col button popup-open text-bold" data-popup=".detail-sales" onclick="detailPenjualan(\'' + item.penjualan_id + '\',\'' + item.jenis_penjualan + '\',\'(' + item.presentase_omset + '%) ' + number_format((item.presentase_omset * item.penjualan_grandtotal) / 100) + '\',\'' + item.client_alamat + '\',\'' + item.client_cp + '\',\'' + item.client_cp_posisi + '\',\'' + item.client_id + '\',\'' + item.client_kota + '\',\'' + item.client_nama + '\',\'' + item.client_telp + '\',\'' + item.jenis_penjualan + '\',\'' + item.karyawan_id + '\',\'' + item.penjualan_global_diskon + '\',\'' + item.penjualan_grandtotal + '\',\'' + item.penjualan_id + '\',\'' + item.penjualan_jumlah_pembayaran + '\',\'' + item.penjualan_keterangan + '\',\'' + item.penjualan_status + '\',\'' + item.penjualan_status_pembayaran + '\',\'' + item.penjualan_tanggal + '\',\'' + item.penjualan_tanggal_kirim + '\',\'' + item.penjualan_total + '\',\'' + item.penjualan_void_keterangan + '\',\'' + item.penjualan_total_qty + '\');">Detail</button>';
				penjualan_value += '</td>';
				penjualan_value += '<td style="border-right:1px solid gray; border-bottom:1px solid gray;" class="label-cell">';
				penjualan_value += '  <button  class="text-add-colour-black-soft button-small col button ' + popup + ' text-bold" style="background-color:' + button_color_surat_jalan + '" data-popup=".surat-jalan-penjualan" onclick="getSuratJalanDetailPenjualan(\'' + item.penjualan_id + '\',\'' + item.penjualan_total_qty + '\');">S.Jalan</button>';
				penjualan_value += '</td>';
				//	penjualan_value += '<td style="border-right:1px solid gray; border-bottom:1px solid gray;" class="label-cell">';
				//	penjualan_value += '   <button  class="text-add-colour-black-soft bg-dark-gray-young button-small col button popup-open text-bold"  onclick="SPK1(\'' + item.customer_logo + '\',\'' + item.customer_logo_tambahan + '\',\'' + item.no_spk + '\',\'' + item.kode_kota + '\',\'' + item.customer_logo_bordir + '\',\'' + item.client_alamat + '\',\'' + item.client_cp + '\',\'' + item.client_cp_posisi + '\',\'' + item.client_id + '\',\'' + item.client_kota + '\',\'' + item.client_nama + '\',\'' + item.client_telp + '\',\'' + item.jenis_penjualan + '\',\'' + item.karyawan_id + '\',\'' + item.penjualan_global_diskon + '\',\'' + item.penjualan_grandtotal + '\',\'' + item.penjualan_id + '\',\'' + item.penjualan_jumlah_pembayaran + '\',\'' + item.penjualan_keterangan + '\',\'' + item.penjualan_status + '\',\'' + item.penjualan_status_pembayaran + '\',\'' + item.penjualan_tanggal + '\',\'' + item.penjualan_tanggal_kirim + '\',\'' + item.penjualan_total + '\',\'' + item.penjualan_void_keterangan + '\',\'' + item.penjualan_total_qty + '\');">SPK</button>';
				//	penjualan_value += '</td>';
				penjualan_value += '</tr>';
			});




			$$('#penjualan_value').html(penjualan_value);
			$$('#pagination_button').html(pagination_button);
			$$('#current_page').html(data.data.current_page);
			$$('#from_data').html();
			$$('#to_data').html();
			$$('#total_data').html(data.data.total + 5);
			//$.each(data.data_teratas, function(i3, item3) {
			//	$$(".tr_"+item3.penjualan_id+"").remove();
			//});



		},
		error: function (xmlhttprequest, textstatus, message) {
		}
	});
}




