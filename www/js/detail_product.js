function getProdukSetId(produk_detail_id,produk_id,produk_keterangan){
	localStorage.setItem("produk_detail_id",produk_detail_id);
	localStorage.setItem("produk_id",produk_id);
	return app.views.main.router.navigate('/detail-product');
}

function getProdukDetail(){
	jQuery.ajax({
		type: 'POST',
		url: ""+BASE_API+"/get-detail-produk",
		dataType: 'JSON',
		data: {
			produk_detail_id: localStorage.getItem("produk_detail_id")
		},
		beforeSend: function() {
			app.dialog.preloader('Harap Tunggu');
		},
		success: function(data) {

			
			jQuery("#name_kode").html(localStorage.getItem("produk_id"));
			jQuery("#main_frame").attr("src",BASE_PATH_IMAGE_PRODUCT+'/'+data.data[0].foto_depan);
			jQuery('#main_frame').data('id',BASE_PATH_IMAGE_PRODUCT+'/'+data.data[0].foto_depan);
			if(data.data[0].foto_depan=='' || data.data[0].foto_depan==null){
				jQuery("#img_depan").hide();
			}else{
				jQuery("#img_depan").attr("src",BASE_PATH_IMAGE_PRODUCT+'/'+data.data[0].foto_depan);
				jQuery('#img_depan').attr('data-src',BASE_PATH_IMAGE_PRODUCT+'/'+data.data[0].foto_depan);
			}
			if(data.data[0].foto_belakang=='' || data.data[0].foto_belakang==null){
				jQuery("#img_belakang").hide();
			}else{
				jQuery("#img_belakang").attr("src",BASE_PATH_IMAGE_PRODUCT+'/'+data.data[0].foto_belakang);
				jQuery('#img_belakang').attr('data-src',BASE_PATH_IMAGE_PRODUCT+'/'+data.data[0].foto_belakang);
			}	
			if(data.data[0].foto_atas=='' || data.data[0].foto_atas==null){
				jQuery("#img_atas").hide();
			}else{
				jQuery("#img_atas").attr("src",BASE_PATH_IMAGE_PRODUCT+'/'+data.data[0].foto_atas);
				jQuery('#img_atas').attr('data-src',BASE_PATH_IMAGE_PRODUCT+'/'+data.data[0].foto_atas);
			}	
			if(data.data[0].foto_bawah=='' || data.data[0].foto_bawah==null){
				jQuery("#img_bawah").hide();
			}else{
				jQuery("#img_bawah").attr("src",BASE_PATH_IMAGE_PRODUCT+'/'+data.data[0].foto_bawah);
				jQuery('#img_bawah').attr('data-src',BASE_PATH_IMAGE_PRODUCT+'/'+data.data[0].foto_bawah);
			}	
			if(data.data[0].foto_kiri=='' || data.data[0].foto_kiri==null){
				jQuery("#img_kiri").hide();
			}else{
				jQuery("#img_kiri").attr("src",BASE_PATH_IMAGE_PRODUCT+'/'+data.data[0].foto_kiri);
				jQuery('#img_kiri').attr('data-src',BASE_PATH_IMAGE_PRODUCT+'/'+data.data[0].foto_kiri);
			}	
			if(data.data[0].foto_kanan=='' || data.data[0].foto_kanan==null){
				jQuery("#img_kanan").hide();
			}else{
				jQuery("#img_kanan").attr("src",BASE_PATH_IMAGE_PRODUCT+'/'+data.data[0].foto_kanan);
				jQuery('#img_kanan').attr('data-src',BASE_PATH_IMAGE_PRODUCT+'/'+data.data[0].foto_kanan);
			}	


			app.dialog.close();
			console.log(data.data[0].keterangan);
		},
		error: function(xmlhttprequest, textstatus, message) {
		}
	});
}

function getProdukWarna(){
	var color_content = "";
	jQuery.ajax({
		type: 'POST',
		url: ""+BASE_API+"/get-detail-warna",
		dataType: 'JSON',
		data: {
			produk_id: localStorage.getItem("produk_id")
		},
		beforeSend: function() {
		},
		success: function(data) {
			jQuery('#keterangan_produk').html('<br><b>Deskripsi</b><br>'+data.data[0].produk_keterangan);

			jQuery.each( data.data, function( i, val ) {
				color_content+='<svg onclick="changeColor(\''+val.produk_detail_id+'\',\''+val.produk_id+'\');" width="28" height="28" style="float:center; text-align:center;">';
				color_content+='<rect width="28" height="28" style="fill:'+val.produk_grup_warna+';stroke-width:2;stroke:rgb(0,0,0)" />'; 
				color_content+='</svg>';  
			});
			jQuery('#color_produk').html(color_content);
		},
		error: function(xmlhttprequest, textstatus, message) {
		}
	});
}

function changeColor(produk_detail_id,produk_id){
	localStorage.setItem("produk_detail_id",produk_detail_id);
	getProdukDetail()
}