function dateRangeDeclarationKatalog() {
	var calendarRangeKunjungan = app.calendar.create({
		inputEl: '#demo-calendar-range',
		rangePicker: true
	});
}

function getProduk() {
	var produk_data ='';
	jQuery.ajax({
		type: 'POST',
		url: ""+BASE_API+"/get-produk",
		dataType: 'JSON',
		data: {
		},
		beforeSend: function() {
			app.dialog.preloader('Harap Tunggu');
		},
		success: function(data) {
			$.each(data.data, function(i, item) {

				produk_data +='<div class="col-50" style="margin:4px;">';
				produk_data +='<div class="text-bold block-title text-align-center" style="background-color:white; color:black;  padding:-20px; margin: 0px;  border-radius:14px;">';
				produk_data +=' <a href="/detail-product">';
				produk_data +='   <img onclick="getProdukSetId(\''+item.produk_detail_id+'\',\''+item.produk_id+'\');" src="'+BASE_PATH_IMAGE_PRODUCT+'/'+item.foto_depan+'" height="100%" width="100%" />';
				produk_data +=' </a>';
				produk_data +='  <h3 style="margin-top:2px;">'+item.produk_id+'</h3>';
				produk_data +='</div>';
				produk_data +=' </div>';

			});
			
			app.dialog.close();
			jQuery('#produk_data').html(produk_data);
		},
		error: function(xmlhttprequest, textstatus, message) {
		}
	});
}