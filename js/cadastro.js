//ON PAGE INIT
myApp.onPageInit('cadastro', function (page) {
	$$('.btn_cadastro').on('click', cadastro);
});

//cadastro
function cadastro(){
	var formData = myApp.formToJSON("#form_cadastro");
	route = "/cadastro";
	if(formData.senha.length>0 && formData.email.length>0){
		stringData = JSON.stringify(formData);
		$.ajax({
			type: "POST",
			url: webserviceURL+route,
			data: stringData,
			success: success,
			error:error
		});
		function success(data,status){
			if(data.id>0){
				login(formData.email,formData.senha);
			}else{
				myApp.alert(data.text);
			}
		}
		function error(data,status){
			myApp.alert(text_error);
		}
	}else{
		myApp.alert(text_fields_error);
	}
}


