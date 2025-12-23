function getDataUser() {
	var username = jQuery('#username').val();
	var password = jQuery('#password').val();
	jQuery.ajax({
		type: 'POST',
		url: "" + BASE_API + "/get-data-login",
		dataType: 'JSON',
		data: {
			username: username,
			password: password
		},
		beforeSend: function () {
		},
		success: function (data) {
			if (data.user_position == 'Surat_jalan') {
				if (data == 0) {
					app.dialog.preloader('Username Atau Password Salah');
					setTimeout(function () {
						app.dialog.close();
					}, 1000);
				} else {
					localStorage.setItem("versioon_app_now", "1.02");
					console.log(data);
					app.dialog.close();
					jQuery('#logout_logo').show();
					startTimeMain();
					localStorage.setItem("user_id", data.user_id);
					localStorage.setItem("username", data.username);
					localStorage.setItem("karyawan_nama", data.karyawan_nama);
					localStorage.setItem("login", "true");
					localStorage.setItem("jabatan", data.user_position);
					localStorage.setItem("jabatan_kantor", data.jabatan);
					localStorage.setItem("password", data.password_real);
					localStorage.setItem("sales_kota", data.kota);
					localStorage.setItem("lokasi_pabrik_surat", data.lokasi_pabrik);
					app.dialog.preloader('Berhasil Login');

					console.log(localStorage.getItem("jabatan_kantor"));

					setTimeout(function () {
						return app.views.main.router.navigate('/surat_jalan');
					}, 1000);
				}
			} else {
				app.dialog.preloader('Role User Bukan Surat Jalan');
				setTimeout(function () {
					app.dialog.close();
				}, 1000);
			}

		},
		error: function (xmlhttprequest, textstatus, message) {
		}
	});
}