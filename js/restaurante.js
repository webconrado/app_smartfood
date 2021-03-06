//ON PAGE INIT
myApp.onPageInit('restaurante', function (page) {
	$("#template_restaurante").load("templates/restaurante_template.html");
	$("#template_info_restaurante").load("templates/restaurante_info_template.html");
	check_token();
});
myApp.onPageAfterAnimation('restaurante', function (page) {
	//Cabecalho e produtos
	restaurante_detalhe_header();
	restaurante_produtos();

	//Limpa o carrinho caso seja um restaurante diferente
	if(!localStorage.id_restaurante){
		id_restaurante = mainView.url.split("id=")[1];
		localStorage.id_restaurante = id_restaurante;
	}
	if(localStorage.id_restaurante!=mainView.url.split("?id=")[1] && carrinhoArray.length>0){
		myApp.confirm("Você está entrando em um estabelecimento diferente, por isso esvaziaremos seu carrinho. Deseja continuar?",
			function(){
				localStorage.carrinho="[]";
				localStorage.removeItem('id_restaurante');
				id_restaurante = mainView.url.split("id=")[1];
				localStorage.id_restaurante = id_restaurante;
			},
			function(){
				mainView.back();
			}
		)
	}

});


//Restaurantes detalhe cabecalho
function restaurante_detalhe_header(){
	id_restaurante = mainView.url.split("id=")[1];
	//localStorage.id_restaurante = id_restaurante;
	route = "/restaurantes";
	$.ajax({
		type: "GET",
		url: webserviceURL+route+"/"+localStorage.token+"/"+id_restaurante,
		success: success,
		error:error
	});
	function success(data,status){
		console.log(data);
		var template = $$('#template_info_restaurante').html();
		var compiledTemplate = Template7.compile(template);
		var html = compiledTemplate(data);
		document.getElementById("div_info_restaurante").innerHTML = html;
		//$("#restaurante_detalhe_link").attr("href", "restaurante_detalhe.html?id="+id_restaurante);
		$("#restaurante_comentarios_link").attr("href", "restaurante_comentarios.html?id="+id_restaurante);
	}
	function error(data,status){
		myApp.alert(text_error);
	}
}

//Restaurantes produtos
function restaurante_produtos(){
	id_restaurante = mainView.url.split("id=")[1];
	route = "/produtos";
	$.ajax({
		type: "GET",
		url: webserviceURL+route+"/"+localStorage.token+"/"+id_restaurante,
		success: success,
		error:error
	});
	function success(data,status){
		console.log(data);
		var template = $$('#template_restaurante').html();
		var compiledTemplate = Template7.compile(template);
		var html = compiledTemplate(data);
		document.getElementById("div_restaurante").innerHTML = html;
		$("#link_self").attr("href","restaurante_self.html?id="+mainView.url.split("id=")[1]);

		//PULL TO REFRESH
		myApp.pullToRefreshDone();
		var pullToRefresh = $$('.pull-to-refresh-content');
		pullToRefresh.on("refresh", function(e){
			console.log("refresh");
			if(loading) return;
			var loading=true;
			setTimeout(function(){
				loading=false;
				myApp.attachInfiniteScroll('.infinite-scroll');
				restaurante_detalhe_header();
				restaurante_produtos();
			},2000);
		});


	}
	function error(data,status){
		myApp.alert(text_error);
	}
}

