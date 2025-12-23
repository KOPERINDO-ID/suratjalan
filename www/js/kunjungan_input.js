
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

function selectBoxClientKunjungan(){
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
			$$('#client_id_kunjungan').html(select_box_client_id);
		}
	});

	$$('.item-after-kunjungan').html('Pilih Perusahaan');
}

function toDataURL(url, callback) {
	var xhr = new XMLHttpRequest();
	xhr.onload = function () {
		var reader = new FileReader();
		reader.onloadend = function () {
			callback(reader.result);
		}
		reader.readAsDataURL(xhr.response);
	};
	xhr.open('GET', url);
	xhr.responseType = 'blob';
	xhr.send();
}


function createNewFileEntry(imgUri) {
	window.resolveLocalFileSystemURL(cordova.file.cacheDirectory, function success(dirEntry) {
		// JPEG file
		dirEntry.getFile("tempFile.jpeg", { create: true, exclusive: false }, function (fileEntry) {
			// Do something with it, like write to it, upload it, etc.
			// writeFile(fileEntry, imgUri);
			console.log("got file: " + fileEntry.fullPath);

			// displayFileData(fileEntry.fullPath, "File copied to");
		}, onErrorCreateFile);
	}, onErrorResolveUrl);
}
 
function openCamera(id) { 
	var srcType = Camera.PictureSourceType.CAMERA;
	var options = setOptions(srcType);
	var func = createNewFileEntry;
	navigator.camera.getPicture(function cameraSuccess(imageUri) {
		$$("#"+id+"_view").attr("src", imageUri);
		$$("#"+id).hide();
		toDataURL(imageUri, function (dataUrl) {
			localStorage.setItem(id,dataUrl);
			//$$("#"+id+"_value").val(dataUrl);
		})
	}, function cameraError(error) {
		console.debug("Unable to obtain picture: " + error, "app");
		alert("Unable to obtain picture: ");
	}, options);
}
// End COnfig



function prospekProcess(){ 
	$$('#karyawan_id').val(localStorage.getItem("user_id"));
	if($$('#status_perusahaan').val()=='perusahaan_database'){
		$$('.perusahaan_tambah').remove();
	}else{
		$$('.perusahaan_database').remove();
	}
	if (!$$('#prospek_form')[0].checkValidity()) {
		app.dialog.alert('Cek Isian Prospek Anda');
	} else {
		var formData = new FormData(jQuery("#prospek_form")[0]); 
		formData.append('sales_kota', localStorage.getItem("sales_kota"));
		formData.append('user_id', localStorage.getItem("user_id"));
		jQuery.ajax({
			type : "POST",
			url : ""+BASE_API+"/prospek-input",
			dataType : "JSON",
			data:   formData,
			contentType: false,
			processData: false,
			beforeSend: function() {  
				app.dialog.preloader('Proses');
			},
			success: function(data){
				$$('.prospek-input').val('');
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
}









