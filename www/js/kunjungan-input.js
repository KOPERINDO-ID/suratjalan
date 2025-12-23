function prospekProcess(){
	var formData = new FormData(jQuery("#prospek_form")[0]);  
	jQuery.ajax({
		type : "POST",
		url : ""+BASE_API+"/prospek-input",
		dataType : "JSON",
		data:   formData,
		contentType: false,
		processData: false,
		beforeSend: function() {  
			app.dialog.preloader('Proses ee');
		},
		success: function(data){
			$$('.prospek-input').val('');
			getProspekHeader();
			app.dialog.close();
			app.popup.close();
			return app.views.main.router.navigate('/kunjungan');
			if(data.status=='done'){
				app.dialog.alert('Berhasil Input Prospek');
			}else if(data.status=='failed'){
				app.dialog.alert('Gagal Input Prospek');
			}
		}
	}); 
	
}



