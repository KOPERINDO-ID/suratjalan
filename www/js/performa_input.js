
jQuery('.input-item-biaya-kirim').mask('000,000,000,000', {reverse: true});

function invoicePerforma(client_alamat,performa_header_id,client_name,tanggal_performa) {
	var invoice_performa = '';
	jQuery.ajax({
		type: 'POST',
		url: ""+BASE_API+"/get-performa",
		dataType: 'JSON',
		data: {
			karyawan_id: localStorage.getItem("user_id"),
			performa_header_id: performa_header_id
		},
		beforeSend: function() {
			invoice_performa += '<table width="100%" border="0" style="border-spacing: 0; background-color:white; color:black;">';
			invoice_performa += '	<tr>';
			invoice_performa += '		<td colspan="5" style="font-weight:bold;" align="center">SENTRAL TAS & KOPER</td>';
			invoice_performa += '	</tr>';
			invoice_performa += '	<tr>';
			invoice_performa += '		<td colspan="5" align="center">Jl. Raya Kludan No.15A Tanggulangin</td>';
			invoice_performa += '	</tr>';
			invoice_performa += '	<tr>';
			invoice_performa += '		<td colspan="5" align="center">Sidoarjo - Jawa Timur (031) 8053567';
			invoice_performa += '			<hr>';
			invoice_performa += '		</td>';
			invoice_performa += '	</tr>';
			invoice_performa += '	<tr>';
			invoice_performa += '		<td colspan="5" align="center">Proforma Invoice</td>';
			invoice_performa += '	</tr>';
			invoice_performa += '	<tr>';
			invoice_performa += '		<td colspan="3" align="left" >Kepada Yth : <br> '+client_name.replace(/\PT. /g,'').replace(/\PT/g,'').replace(/\CV. /g,'').replace(/\CV/g,'').replace(/\UD. /g,'').replace(/\UD/g,'')+' <br> '+client_alamat+'</td>';
			invoice_performa += '		<td colspan="2" align="right">'+moment(tanggal_performa).format('DDMMYY')+'-'+performa_header_id.replace(/\PI_/g,'').replace(/^0+/, '')+'</td>';
			invoice_performa += '	</tr>';
			invoice_performa += '	<tr>';
			invoice_performa += '		<td colspan="2" style="border-top: solid 1px; border-left: solid 1px; font-weight:bold;" align="center">Spesifikasi</td>';
			invoice_performa += '		<td style="border-top: solid 1px; border-left: solid 1px; font-weight:bold;" align="center">Qty</td>';
			invoice_performa += '		<td style="border-top: solid 1px; border-left: solid 1px; font-weight:bold;" align="center">Price Rp.</td>';
			invoice_performa += '		<td style="border-top: solid 1px; border-right: solid 1px; border-left: solid 1px; font-weight:bold;" align="center">Total Rp.</td>';
			invoice_performa += '	</tr>';

			app.dialog.preloader('Harap Tunggu');
		},
		success: function(data) {
			app.dialog.close();
			if(data.data.length != 0){
				var penjualan_total = 0;

				invoice_performa += '<tbody>';
				jQuery.each( data.data, function( i, val ) { 

					invoice_performa += '		<tr>';
					invoice_performa += '			<td width="30%" class="label-cell text-align-left" style="border-top: solid 1px; border-left: solid 1px; "><center>'+val.jenis+'<br><img src="'+BASE_PATH_IMAGE_PERFORMA+'/'+val.gambar+'" width="70%"></center></td>';
					invoice_performa += '			<td width="20%" class="label-cell" align="left" style="border-top: solid 1px; white-space: pre;">'+val.spesifikasi+'<font color="red"><br>KET :<br>'+val.keterangan+'</font></td>';
					invoice_performa += '				<td width="10%" class="label-cell" style="border-top: solid 1px; border-left: solid 1px;">';
					invoice_performa += '					<center>'+val.qty+'</center>';
					invoice_performa += '				</td>';
					invoice_performa += '				<td width="20%" class="label-cell" style="border-top: solid 1px; border-left: solid 1px;">';
					invoice_performa += '					<center>'+number_format(val.price)+'</center>';
					invoice_performa += '				</td>';
					invoice_performa += '				<td width="20%" colspan="2" class="label-cell text-align-center" style="border-top:  solid 1px; border-right: solid 1px; border-left: solid 1px;">';
					invoice_performa += '					<center>'+number_format(val.total)+'</center>';
					invoice_performa += '				</td>';
					invoice_performa += '			</tr>';

					penjualan_total += parseInt(val.total);
				});
				invoice_performa += '</tbody>';
				invoice_performa += '		<tr>';
				invoice_performa += '			<td colspan="3" style=" border-top: solid 1px; font-weight:bold;" align="right"></td>';
				invoice_performa += '			<td colspan="1" style="border-top: solid 1px; border-left: solid 1px;  font-weight:bold; " align="left">';
				invoice_performa += '				Total';
				invoice_performa += '			</td>';
				invoice_performa += '			<td colspan="1" style="padding-left:10px; border-top: solid 1px; border-left: solid 1px; border-right: solid 1px; font-weight:bold;" align="left">';
				invoice_performa += '				Rp. <font style="float:right; padding-right:10px;">'+number_format(penjualan_total)+'</font>';

				invoice_performa += '			</td>';
				invoice_performa += '		</tr>';

				if(number_format(data.data[0].biaya_kirim)!=0){
					invoice_performa += '		<tr>';
					invoice_performa += '			<td colspan="3" style="font-weight:bold;" align="right"></td>';
					invoice_performa += '			<td colspan="1" style=" border-top: solid 1px; border-left: solid 1px; font-weight:bold;" align="left">';
					invoice_performa += '				Biaya Kirim';
					invoice_performa += '			</td>';
					invoice_performa += '			<td colspan="1" style="padding-left:10px; border-top: solid 1px; border-left: solid 1px; border-right: solid 1px;  font-weight:bold;" align="left">';
					invoice_performa += '				Rp. <font style="float:right; padding-right:10px;">'+number_format(data.data[0].biaya_kirim)+'</font>';
					invoice_performa += '			</td>';
					invoice_performa += '		</tr>';
				}

				invoice_performa += '		<tr>';
				invoice_performa += '			<td colspan="3" style="font-weight:bold;" align="right"></td>';
				invoice_performa += '			<td colspan="1" style="border-top: solid 1px; border-bottom: solid 1px; border-left: solid 1px;  font-weight:bold; " align="left">';
				invoice_performa += '				Jumlah';
				invoice_performa += '			</td>';
				invoice_performa += '			<td colspan="1" style="padding-left:10px; border-top: solid 1px; border-bottom: solid 1px; border-left: solid 1px; border-right: solid 1px; font-weight:bold;" align="left">';

				invoice_performa += '				Rp. <font style="float:right; padding-right:10px;">'+number_format(parseInt(penjualan_total)+parseInt(data.data[0].biaya_kirim))+'</font>';
				invoice_performa += '			</td>';
				invoice_performa += '		</tr>'
				invoice_performa += '		<tr>';
				invoice_performa += '			<td colspan="5">Ket :</td>';
				invoice_performa += '		</tr>';
				invoice_performa += '	</table>';
				invoice_performa += '	<table width="100%" border="0">';
				invoice_performa += '      <tr>';
				invoice_performa += '          <td width="1%">-</td>';
				invoice_performa += '          <td width="70%">Packing finishing plastic</td>';
				invoice_performa += '          <td width="16%" align="center"></td>';
				invoice_performa += '          <td width="13%" align="center"></td>';
				invoice_performa += '      </tr>';
				invoice_performa += '      <tr>';
				invoice_performa += '          <td width="1%">-</td>';
				invoice_performa += '          <td width="70%">Harga produk belum termasuk biaya kirim</td>';
				invoice_performa += '          <td width="16%" align="center"></td>';
				invoice_performa += '          <td width="13%" align="center"></td>';
				invoice_performa += '      </tr>';
				invoice_performa += '      <tr>';
				invoice_performa += '          <td width="1%">-</td>';
				invoice_performa += '          <td width="70%">Komplain lebih 3 hari setelah barang di terima tidak dapat di layani</td>';
				invoice_performa += '          <td width="16%" align="center"></td>';
				invoice_performa += '          <td width="13%" align="center"></td>';
				invoice_performa += '      </tr>';
				invoice_performa += '      <tr>';
				invoice_performa += '          <td width="1%">-</td>';
				invoice_performa += '          <td width="70%">DP 50% sebagai deposit, 50% untuk pelunasan Sebelum Shipping </td>';
				invoice_performa += '          <td width="16%" align="center" style="">Sales</td>';
				invoice_performa += '          <td width="13%" align="center" style="">Customer</td>';
				invoice_performa += '      </tr>'; 
				invoice_performa += '		<tr>';
				invoice_performa += '			<td colspan="1"></td>';
				invoice_performa += '			<td colspan="2">Expedisi</td>';
				invoice_performa += '		</tr>';
				invoice_performa += '	</table>';
				invoice_performa += '  <table border="0" width="100%" style="border-spacing: 0;">';
				invoice_performa += '      <tr>';
				invoice_performa += '          <td width="50%" align="left" colspan="3" class=""><b>Rekening</b></td>';
				invoice_performa += '          <td width="20%" align="left"  class=""><b></b></td>';
				invoice_performa += '          <td width="15%" align="center" class=""></td>';
				invoice_performa += '          <td width="15%" align="center" class=""></td>';
				invoice_performa += '      </tr>';
				invoice_performa += '      <tr>';
				invoice_performa += '          <td style="border-top: solid 1px; border-left: solid 1px; padding:4px;" width="2%" align="left" class="">BCA</td>';
				invoice_performa += '          <td style="border-top: solid 1px; padding:4px;" width="1%" align="left" class="">:</td>';
				invoice_performa += '          <td style="border-top: solid 1px;  border-right: solid  1px; padding:2px;" width="47%" align="left" class="">01831 29551 a.n Sutono</td>';
				invoice_performa += '          <td width="20%" align="center" class=""></td>';
				invoice_performa += '          <td width="15%" align="center" class=""></td>';
				invoice_performa += '          <td width="15%" align="center" class=""></td>';
				invoice_performa += '      </tr>';
				invoice_performa += '      <tr>';
				invoice_performa += '          <td style="border-bottom: solid 1px; border-top: solid 1px; border-left: solid 1px; padding:4px;" width="2%" align="left" class="">Mandiri</td>';
				invoice_performa += '          <td style="border-bottom: solid 1px;  border-top: solid 1px; padding:4px;" width="1%" align="left" class="">:</td>';
				invoice_performa += '          <td style="border-bottom: solid 1px;  border-top: solid 1px;  border-right: solid  1px; padding:2px;" width="47%" align="left" class="">141 000 518 7422 a.n Sutono</td>';
				invoice_performa += '          <td width="20%" align="left"  class=""><b></b></td>';
				invoice_performa += '          <td width="15%" align="center"  style="" class="">'+localStorage.getItem("karyawan_nama")+'</td>';
				invoice_performa += '          <td width="15%" align="center" style="" class="">'+client_name.replace(/\PT. /g,'').replace(/\PT/g,'').replace(/\CV. /g,'').replace(/\CV/g,'').replace(/\UD. /g,'').replace(/\UD/g,'')+'</td>';
				invoice_performa += '      </tr>';
				invoice_performa += '  </table>';
				
			}
			console.log(invoice_performa);
			let options = {
				documentSize: 'A4',
				type: 'share',
				fileName: 'invoice_PI_'+client_name+'.pdf'
			}

			pdf.fromData(invoice_performa, options)
			.then((stats)=> console.log('status', stats) )  
			.catch((err)=>console.err(err))
			//return app.views.main.router.navigate('/performa');

		},
		error: function(xmlhttprequest, textstatus, message) {
		}
	});

}

function performaProcess(){
	if($$('#status_perusahaan').val()=='perusahaan_database'){
		$$('.perusahaan_tambah').remove();
	}else{
		$$('.perusahaan_database').remove();
	}

	if(jQuery('#client_id').val() == '' || jQuery('#client_id').val() == null){
		$$('#perusahaan_kosong_value').show();
	}else{
		$$('#perusahaan_kosong_value').hide();

	}

	if ($$('#customer_logo').val()  != "") {

		$$('#value_customer_logo').addClass('bg-dark-gray-young');
	}else{

		$$('#value_customer_logo').css("background-color", "#ff3b30");
		$$('#value_customer_logo').removeClass('bg-dark-gray-young');
	}

	if ($$('#customer_logo_bordir').val()  != "") {

		$$('#value_customer_logo_bordir').addClass('bg-dark-gray-young');
	}else{

		$$('#value_customer_logo_bordir').css("background-color", "#ff3b30");
		$$('#value_customer_logo_bordir').removeClass('bg-dark-gray-young');
	}

 
	if (!$$('#performa_form')[0].checkValidity()) {
		app.dialog.alert('Cek Isian Performa Anda');
	} else {
		var formData = new FormData(jQuery("#performa_form")[0]);  
		formData.append('karyawan_id', localStorage.getItem("user_id"));
		formData.append('sales_kota', localStorage.getItem("sales_kota"));
		formData.append('user_id', localStorage.getItem("user_id"));
		jQuery.ajax({
			type : "POST",
			url : ""+BASE_API+"/performa-input",
			dataType : "JSON",
			data:   formData,
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
			success: function(data){
				cariPerusahaan();
				$$('#value_customer_logo').html('Logo Perusahaan');
				$$('#value_customer_logo_bordir').html('Logo Bordir');
				$$('#value_customer_logo_tambahan').html('Logo Tambah');
				$$('.value_performa').html('Gambar');				
				$$('.performa-input').val('');				
				$$('#total_performa').html(number_format(0));
				$$('.performa_group_field').empty();
				app.dialog.close();
				if(data.status=='no_photo'){
					app.dialog.alert('Foto Ada Yang Tidak Di Isi');
				}else if(data.status=='done'){
					app.dialog.alert('Berhasil');
					jQuery('#cetak_invoice').show();
					$$('#alert_performa_invoice').html('<font  onclick="invoicePerforma(\''+data.client_alamat+'\',\''+data.id+'\',\''+data.client_name+'\',\''+data.tanggal.date+'\');" style="color:yellow;">Disini</font>');
				}else if(data.status=='terintegerasi'){
					app.dialog.alert('Gagal,Customer Terintegrasi Dengan Sales');
				}else{
					app.dialog.alert('Gagal Input Performa');
				}
				return app.views.main.router.navigate(app.views.main.router.currentRoute.url, { reloadCurrent: true, ignoreCache: true, });
			}
		}); 
	}
}


function logoPerusahaan(){
	if(jQuery('#customer_logo').val() == '' || jQuery('#customer_logo').val() == null){
		$$('#value_customer_logo').html('Logo Emblem');	
		$$('#value_customer_logo').css("background-color", "#ff3b30");
		$$('#value_customer_logo').removeClass('bg-dark-gray-young');
	}else{
		$$('#value_customer_logo').html($$('#customer_logo').val().replace('fakepath',''));
		$$('#value_customer_logo').addClass('bg-dark-gray-young');
	}	

}

function logoPerusahaanBordir(){

	if(jQuery('#customer_logo_bordir').val() == '' || jQuery('#customer_logo_bordir').val() == null){
		$$('#value_customer_logo_bordir').html('Logo Bordir');
		$$('#value_customer_logo_bordir').css("background-color", "#ff3b30");
		$$('#value_customer_logo_bordir').removeClass('bg-dark-gray-young');
	}else{
		$$('#value_customer_logo_bordir').html($$('#customer_logo_bordir').val().replace('fakepath',''));
		$$('#value_customer_logo_bordir').addClass('bg-dark-gray-young');
	}	
}

function logoPerusahaanTambahan(){
	if(jQuery('#customer_logo_tambahan').val() == '' || jQuery('#customer_logo_tambahan').val() == null){
		$$('#value_customer_logo_tambahan').html('Logo Tambahan');
	}else{
		$$('#value_customer_logo_tambahan').html($$('#customer_logo_tambahan').val().replace('fakepath',''));
	}
}


function gambarPerforma(performa_table_id){
	if(jQuery('#file_'+performa_table_id+'').val() == '' || jQuery('#file_'+performa_table_id+'').val() == null){
		$$('#value_performa_'+performa_table_id+'').html('Gambar');
	}else{
		$$('#value_performa_'+performa_table_id+'').html($$('#file_'+performa_table_id+'').val().replace('fakepath',''));
	}	
}

function addPerforma(){
	$$('#count_performa').val($$('.performa_group_field_count').length+1);
	var html_performa_group_field = '';
	html_performa_group_field += '<h3 style="margin-top:8px;" id="title_'+($('.performa_group_field_count').length+1)+'"  class="title-performa" >Proforma #'+($('.performa_group_field_count').length+1)+'</h3><ul id="performa_'+($('.performa_group_field_count').length+1)+'" class="performa_group_field_count" style="background-color:#1c1c1d; border-radius:2px; margin-top:-12px; border:1px solid gray; ">';
	html_performa_group_field += '<li class="item-content item-input margin-27">';
	html_performa_group_field += '<div class="item-inner">';
	html_performa_group_field += '<div class="item-input-wrap" style="margin-top:-5px;">';
	html_performa_group_field += '<center>';

	html_performa_group_field += ' <br><br><label style="width:30%; height:30px;  margin-bottom:-10px;  float:left;" for="file_'+($('.performa_group_field_count').length+1)+'" id="value_performa_'+($('.performa_group_field_count').length+1)+'" class="margin-2 text-add-colour-black-soft bg-dark-gray-young button-small col button text-bold custom-file-upload value_performa">';
	html_performa_group_field += 'Gambar';
	html_performa_group_field += '</label>';
	html_performa_group_field += '<input class="input-item-file text-add-colour-black-soft bg-dark-gray-young button-small col button popup-open text-bold" type="file" style="display:none;" onchange="gambarPerforma('+($('.performa_group_field_count').length+1)+');" name="file_'+($('.performa_group_field_count').length+1)+'"  id="file_'+($('.performa_group_field_count').length+1)+'" accept="image/*;capture=camera" requi#ff3b30 validate><br><br>';
	html_performa_group_field += '</center>';
	html_performa_group_field += '<span class="input-clear-button"></span>';
	html_performa_group_field += '</div>';
	html_performa_group_field += '</div>';
	html_performa_group_field += '</li>';
	html_performa_group_field += '<li class="item-content item-input margin-8">';
	html_performa_group_field += '<div class="item-inner" style="height:8px;">';
	html_performa_group_field += '<div class="item-input-wrap"><input placeholder="Type" name="jenis_'+($('.performa_group_field_count').length+1)+'" id="jenis_'+($('.performa_group_field_count').length+1)+'"  class="performa-input input-item-jenis text-add-colour-black-soft bg-dark-gray-young button-small text-bold" type="text" requi#ff3b30 validate><span class="input-clear-button"></span></div>';
	html_performa_group_field += '</div>';
	html_performa_group_field += '</li>';
	html_performa_group_field += '<li class="item-content item-input margin-4">';
	html_performa_group_field += '<div class="item-inner">';
	html_performa_group_field += '<div class="item-input-wrap">';
	html_performa_group_field += '<textarea style="border-color:white;"  id="keterangan_full_'+($('.performa_group_field_count').length+1)+'" name="keterangan_full_'+($('.performa_group_field_count').length+1)+'"  class="input-item-ket-full resizable" placeholder="Detail"></textarea>';
	html_performa_group_field += '<span class="input-clear-button"></span>';
	html_performa_group_field += '</div>';
	html_performa_group_field += '</div>';
	html_performa_group_field += '</li>';
	html_performa_group_field += '<li class="item-content item-input margin-4">';
	html_performa_group_field += '<div class="item-inner">';
	html_performa_group_field += '<div class="item-input-wrap">';
	html_performa_group_field += '<textarea style="border-color:white;"  id="keterangan_singkat_'+($('.performa_group_field_count').length+1)+'" name="keterangan_singkat_'+($('.performa_group_field_count').length+1)+'"  class="input-item-keterangan-singkat resizable" placeholder="Keterangan"></textarea>';
	html_performa_group_field += '<span class="input-clear-button"></span>';
	html_performa_group_field += '</div>';
	html_performa_group_field += '</div>';
	html_performa_group_field += '</li>';
	html_performa_group_field += '<li class="item-content item-input margin-8">';
	html_performa_group_field += '<div class="item-inner">';
	html_performa_group_field += '<div class="item-input-wrap">';
	html_performa_group_field += '<input min="1"  placeholder="Qty" name="qty_'+($('.performa_group_field_count').length+1)+'" id="qty_'+($('.performa_group_field_count').length+1)+'" onchange="changeTotalValue('+($('.performa_group_field_count').length+1)+');" class="input-item-qty text-add-colour-black-soft bg-dark-gray-young button-small text-bold" type="number" requi#ff3b30 validate>';
	html_performa_group_field += '<span class="input-clear-button"></span>';
	html_performa_group_field += '</div>';
	html_performa_group_field += '</div>';
	html_performa_group_field += '</li>';
	html_performa_group_field += '<li class="item-content item-input margin-8">';
	html_performa_group_field += '<div class="item-inner">';
	html_performa_group_field += '<div class="item-input-wrap">';
	html_performa_group_field += '<input placeholder="Harga" name="price_'+($('.performa_group_field_count').length+1)+'" id="price_'+($('.performa_group_field_count').length+1)+'" onchange="changeTotalValue('+($('.performa_group_field_count').length+1)+');" class="input-item-price text-add-colour-black-soft bg-dark-gray-young button-small text-bold" type="text" requi#ff3b30 validate>';
	html_performa_group_field += '<span class="input-clear-button"></span>';
	html_performa_group_field += '</div>';
	html_performa_group_field += '</div>';
	html_performa_group_field += '</li>';
	html_performa_group_field += '<li class="item-content item-input margin-8">';
	html_performa_group_field += '<div class="item-inner">';
	html_performa_group_field += '<div class="item-input-wrap" style="margin-bottom:4px;">';
	html_performa_group_field += '<input placeholder="Total" name="total_'+($('.performa_group_field_count').length+1)+'" id="total_'+($('.performa_group_field_count').length+1)+'" class="input-item-total total-value text-add-colour-black-soft bg-dark-gray-young button-small text-bold" type="text" readonly>';
	html_performa_group_field += '<span class="input-clear-button"></span>';
	html_performa_group_field += '</div>';
	html_performa_group_field += '</div>';
	html_performa_group_field += '</li><p style="padding-top:5px;"><a onclick="addPerforma();" style="float:right; font-size:39px;  margin-bottom:10px; margin-right:14px; margin-top:-27px;  color:forestgreen;" class="add_performa f7-icons">plus_rectangle_fill</a>    <a style="float:right; font-size:39px;  margin-right:14px; margin-top:-27px; color:#ff3b30;" data-id="performa_'+($('.performa_group_field_count').length+1)+'" class="f7-icons delete-performa" onclick="deletePerforma('+($('.performa_group_field_count').length+1)+');">minus_rectangle_fill</a></p>';
	html_performa_group_field += '</ul>';
	$$('.performa_group_field').append(html_performa_group_field);
	jQuery('.input-item-price').mask('000,000,000,000', {reverse: true});

}	


function addNonPerforma(){
	$$("#add_performa" ).click(function() {
		$$('#count_performa').val($$('.performa_group_field_count').length+1);
		var html_performa_group_field = '';
		html_performa_group_field += '<h3 id="title_'+($('.performa_group_field_count').length+1)+'"  class="title-performa" >Penjualan #'+($('.performa_group_field_count').length+1)+'</h3><ul id="performa_'+($('.performa_group_field_count').length+1)+'" class="performa_group_field_count" style="background-color:#373d55; border-radius:2px; margin-top:12px;">';
		html_performa_group_field += '<li class="item-content item-input">';
		html_performa_group_field += '<div class="item-inner">';
		html_performa_group_field += '<div class="item-input-wrap">';
		html_performa_group_field += '<center>';
		html_performa_group_field += '<i data-id="performa_'+($('.performa_group_field_count').length+1)+'" style="font-size:20px; float:left;"class="f7-icons delete-performa" onclick="deletePerforma('+($('.performa_group_field_count').length+1)+');">trash_slash_fill</i><input class="input-item-file text-add-colour-black-soft bg-dark-gray-young button-small col button popup-open text-bold" type="text" placeholder="Kode Produk" name="produk_id_'+($('.performa_group_field_count').length+1)+'"  id="produk_id_'+($('.performa_group_field_count').length+1)+'"  requi#ff3b30 validate>';
		html_performa_group_field += '</center>';
		html_performa_group_field += '<span class="input-clear-button"></span>';
		html_performa_group_field += '</div>';
		html_performa_group_field += '</div>';
		html_performa_group_field += '</li>';
		html_performa_group_field += '<li class="item-content item-input">';
		html_performa_group_field += '<div class="item-inner">';
		html_performa_group_field += '<div class="item-input-wrap">';
		html_performa_group_field += '<textarea style="border-color:white;"  id="keterangan_'+($('.performa_group_field_count').length+1)+'" name="keterangan_'+($('.performa_group_field_count').length+1)+'" font-size:20px;" class="input-item-keterangan resizable" placeholder="Keterangan"></textarea>';
		html_performa_group_field += '<span class="input-clear-button"></span>';
		html_performa_group_field += '</div>';
		html_performa_group_field += '</div>';
		html_performa_group_field += '</li>';
		html_performa_group_field += '<li class="item-content item-input">';
		html_performa_group_field += '<div class="item-inner">';
		html_performa_group_field += '<div class="item-input-wrap">';
		html_performa_group_field += '<textarea style="border-color:white;"  id="keterangan_singkat_'+($('.performa_group_field_count').length+1)+'" name="keterangan_singkat_'+($('.performa_group_field_count').length+1)+'" font-size:20px;" class="input-item-keterangan-singkat resizable" placeholder="Keterangan"></textarea>';
		html_performa_group_field += '<span class="input-clear-button"></span>';
		html_performa_group_field += '</div>';
		html_performa_group_field += '</div>';
		html_performa_group_field += '</li>';
		html_performa_group_field += '<li class="item-content item-input">';
		html_performa_group_field += '<div class="item-inner">';
		html_performa_group_field += '<div class="item-input-wrap">';
		html_performa_group_field += '<input placeholder="Qty" name="qty_'+($('.performa_group_field_count').length+1)+'" id="qty_'+($('.performa_group_field_count').length+1)+'" onchange="changeTotalValue('+($('.performa_group_field_count').length+1)+');" class="input-item-qty text-add-colour-black-soft bg-dark-gray-young button-small text-bold" type="number" requi#ff3b30 validate>';
		html_performa_group_field += '<span class="input-clear-button"></span>';
		html_performa_group_field += '</div>';
		html_performa_group_field += '</div>';
		html_performa_group_field += '</li>';
		html_performa_group_field += '<li class="item-content item-input">';
		html_performa_group_field += '<div class="item-inner">';
		html_performa_group_field += '<div class="item-input-wrap">';
		html_performa_group_field += '<input placeholder="Price (Rp)" name="price_'+($('.performa_group_field_count').length+1)+'" id="price_'+($('.performa_group_field_count').length+1)+'" onchange="changeTotalValue('+($('.performa_group_field_count').length+1)+');" class="input-item-price text-add-colour-black-soft bg-dark-gray-young button-small text-bold" type="text" requi#ff3b30 validate>';
		html_performa_group_field += '<span class="input-clear-button"></span>';
		html_performa_group_field += '</div>';
		html_performa_group_field += '</div>';
		html_performa_group_field += '</li>';
		html_performa_group_field += '<li class="item-content item-input">';
		html_performa_group_field += '<div class="item-inner">';
		html_performa_group_field += '<div class="item-input-wrap">';
		html_performa_group_field += '<input placeholder="Total (Rp)" name="total_'+($('.performa_group_field_count').length+1)+'" id="total_'+($('.performa_group_field_count').length+1)+'" class="input-item-total total-value text-add-colour-black-soft bg-dark-gray-young button-small text-bold" type="number" readonly>';
		html_performa_group_field += '<span class="input-clear-button"></span>';
		html_performa_group_field += '</div>';
		html_performa_group_field += '</div>';
		html_performa_group_field += '</li>';
		html_performa_group_field += '</ul>';

		$$('.performa_group_field').append(html_performa_group_field);
	});
}	
function deletePerforma(performa_id_table){
	$$('#count_performa').val($$('.performa_group_field_count').length-1);
	$$('#performa_'+performa_id_table+'').remove();
	$$('#title_'+performa_id_table+'').remove();
	var total = $$('#price_'+performa_id_table+'').val()*$$('#qty_'+performa_id_table+'').val();
	$$('#total_'+performa_id_table+'').val(total);
	var sum = 0;
	$$(".total-value").each(function(){
		sum += +$$(this).val().replace(/\,/g,'');
	});
	$$('#total_performa').html(number_format(sum));
	$$('#total_performa_sum').val(sum);
	var totalqty = 0;
	$$(".input-item-qty").each(function(){
		totalqty += +$$(this).val().replace(/\,/g,'');
	});

	$$('#total_performa_qty').val(totalqty);

	var count_file = 1;
	$$('.input-item-file').each(function(){
		$$(this).attr("name", 'file_'+count_file);
		$$(this).attr("id", 'file_'+count_file);
		$$(this).attr("onchange", 'gambarPerforma('+count_file+');');
		count_file++;
	});

	var count_value_performa = 1;
	$$('.value_performa').each(function(){
		$$(this).attr("id", 'value_performa_'+count_value_performa);
		$$(this).attr("for", 'file_'+count_value_performa);
		count_value_performa++;
	});

	var count_title_performa = 1;

	$$('.title-performa').each(function(){
		$$(this).html('Proforma #'+count_title_performa);
		count_title_performa++;
	});



	var count_keterangan_singkat = 1;
	$$('.input-item-keterangan-singkat').each(function(){
		$$(this).attr("name", 'keterangan_singkat_'+count_keterangan_singkat);
		$$(this).attr("id", 'keterangan_singkat_'+count_keterangan_singkat);
		count_keterangan_singkat++;
	});


	var count_keterangan_full = 1;
	$$('.input-item-ket-full').each(function(){
		$$(this).attr("name", 'keterangan_full_'+count_keterangan_full);
		$$(this).attr("id", 'keterangan_full_'+count_keterangan_full);
		count_keterangan_full++;
	});

	var count_note = 1;
	$$('.input-item-note').each(function(){
		$$(this).attr("name", 'note_'+count_note);
		$$(this).attr("id", 'note_'+count_note);
		count_note++;
	});

	var count_jenis = 1;
	$$('.input-item-jenis').each(function(){
		$$(this).attr("name", 'jenis_'+count_jenis);
		$$(this).attr("id", 'jenis_'+count_jenis);
		count_jenis++;
	});


	var count_qty = 1;
	$$('.input-item-qty').each(function(){
		$$(this).attr("name", 'qty_'+count_qty);
		$$(this).attr("id", 'qty_'+count_qty);
		$$(this).attr("onchange", 'changeTotalValue('+count_qty+');');
		count_qty++;
	});

	var count_price = 1;
	$$('.input-item-price').each(function(){
		$$(this).attr("name", 'price_'+count_price);
		$$(this).attr("id", 'price_'+count_price);
		$$(this).attr("onchange", 'changeTotalValue('+count_price+');');
		count_price++;
	});

	var count_total = 1;
	$$('.input-item-total').each(function(){
		$$(this).attr("name", 'total_'+count_total);
		$$(this).attr("id", 'total_'+count_total);
		count_total++;
	});

}

function changeTotalValue(performa_id_table){
	var total = $$('#price_'+performa_id_table+'').val().replace(/\,/g,'')*$$('#qty_'+performa_id_table+'').val();
	$$('#total_'+performa_id_table+'').val(number_format(total));
	var sum = 0;
	$$(".total-value").each(function(){
		sum += +$$(this).val().replace(/\,/g,'');
	});
	$$('#total_performa').html(number_format(sum));
	$$('#total_performa_sum').val(sum);
	var totalqty = 0;
	$$(".input-item-qty").each(function(){
		totalqty += +$$(this).val().replace(/\,/g,'');
	});
	$$('#total_performa_qty').val(totalqty);
}

function selectBoxClient(){
	jQuery.ajax({
		type : "POST",
		url : ""+BASE_API+"/get-client",
		dataType : "JSON",
		data: {
			user_id:localStorage.getItem("user_id")
		},
		beforeSend: function() {  
		},
		success: function(data){
			var select_box_client_id;
			select_box_client_id+='<option value="" selected>-- Pilih Perusahaan --</option>';		
			jQuery.each( data.data, function( i, val ) { 
				select_box_client_id+='<option value="'+val.client_id+'">'+val.client_nama+' | '+val.client_kota+'</option>';
			});
			$$('#client_id').html(select_box_client_id);
		}
	});

	$$('.item-after').html('Pilih Perusahaan');
}

function inputPerusahaan(){
	$$('.perusahaan_database').hide();
	$$('.perusahaan_tambah').show();
	$$('.perusahaan-tambah-input').val('');
	$$('#status_perusahaan').val('perusahaan_tambah');	
}

function cariPerusahaan(){
	$$('.perusahaan_database').show();
	$$('.perusahaan_tambah').hide();
	$$('#status_perusahaan').val('perusahaan_database');
	$$('.perusahaan-tambah-input').val('-');
}







