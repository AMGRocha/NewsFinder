const caract = "1234567890`~!@#$%^&*()-_+={[}]|:;'/?.>,<€ "+'"';
const caract_2 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz`~!@#$%^&*()-_+={[}]|:;'/?.>,<€ "+'"';


(function(){
	window.addEventListener("load", main);
}());

function main(){

	var foto = document.getElementById("foto");
	var orcid = document.getElementById("orcid");
	var filiacao = document.getElementById("filiacao");
	var unidade = document.getElementById("unidade");
	var interesses = document.getElementById("interesses");
	var bsave = document.getElementById("Save");

	firebase.auth().onAuthStateChanged(firebaseUser => {
		if(firebaseUser){
			orcid.value = firebaseUser.displayName.split("|")[2];
			filiacao.value = firebaseUser.displayName.split("|")[3];
			unidade.value = firebaseUser.displayName.split("|")[4];
			interesses.value = firebaseUser.displayName.split("|")[5];
		}
	});

	bsave.addEventListener("click", bsavePressed);

	function bsavePressed(){
		var photo = foto.files[0];
		if(orcid.value.length == 0)
			alert("The ORCID field is empty.");
		else if(filiacao.value.length == 0)
			alert("The Affiliation field is empty.");
		else if(unidade.value.length == 0)
			alert("The Research Unit field is empty.");
		else if(interesses.value.length == 0)
			alert("The Interests field is empty.");
		else if(photo != null && !photo.name.includes(".jpg") && !photo.name.includes(".png") && !photo.name.includes(".jpeg"))
			alert("Photo must be JPEG or PNG format.");
		else{
			if(photo!=null){
				//Buscar utilizador e suas informações
				var user = firebase.auth().currentUser;

				//Dar storage da foto
				//Criar referencia do storage
				var storage = firebase.storage().ref('fotos_perfil/' + valida_nome(user.email));
				
				//Upload
				var task = storage.put(photo);

				task.on('state_changed', 

					function progress(snapshot){
						console.log((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
					},

					function error(err){
						console.log(err);				
					},

					function complete(){ //VERIFICAR SE A FOTO SOBREPOE A OUTRA OU NAO

						//Controlo de segurança de strings
						var controlo = 0;
						
						controlo += verificar(orcid.value, 1);
						controlo += verificar(filiacao.value, 0);
						controlo += verificar(unidade.value, 0);
						controlo += verificar(interesses.value, 0);

						if(controlo==0){
							var reader = new FileReader();
							reader.onloadend = function () {
								var aux = user.displayName;
								user.updateProfile({
					  				displayName: aux+"|"+orcid.value+"|"+filiacao.value+"|"+unidade.value+"|"+interesses.value
								}).then(function() {

									window.location.href="../html/perfil.html";	
									
								}).catch(function(error) {
					  				console.log(error);
								});
				       		}
				   			if(photo){
				      			reader.readAsDataURL(photo);
				    		}
			    		}
					});
			}
			else{
				console.log("entrou");
				var user = firebase.auth().currentUser;
				//Controlo de segurança de strings
				var controlo = 0;
						
				controlo += verificar(orcid.value, 1);
				controlo += verificar(filiacao.value, 0);
				controlo += verificar(unidade.value, 0);
				controlo += verificar(interesses.value, 0);

				if(controlo==0){
					var aux = user.displayName.split("|")[0] +"|"+user.displayName.split("|")[1];
					console.log(aux);
					user.updateProfile({
						displayName: aux+"|"+orcid.value+"|"+filiacao.value+"|"+unidade.value+"|"+interesses.value
					}).then(function() {
						window.location.href="../html/perfil.html";	
					}).catch(function(error) {
					  	console.log(error);
					});
			    }
			}
		}
	}
}

function verificar(check, flag){

	if(flag==1){
		for(var i=0; i< check.length ; i++){
			for(var j=0; j< caract_2.length ; j++){
				if(caract_2[j] == check[i]){
					alert("ORCID number is invalid");
					return 1;
				}
			}
		}
	}
	else{
		for(var i=0; i< check.length ; i++){
			for(var j=0; j< caract.length ; j++){
				if(caract[j] == check[i]){
					alert("Names can not contain special characters.");
					return 1;
				}
			}
		}
	}

	return 0;
}

function valida_nome(nome){

	//Alteração de '.' -> '!'  e '@' -> '#' para ser aceite no storage
	var aux;

	aux = nome.replace('@','#');

	for(var i=0 ; i<nome.length; i++)
		if(nome[i].localeCompare('.')==0)
			aux = aux.replace('.','!');

	return aux;
}