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
	var textbox = document.getElementById("Info");
	var bAdd = document.getElementById("Add");
	var bRemover = document.getElementById("Remove");
	var array = [];

	firebase.auth().onAuthStateChanged(firebaseUser => {
		if(firebaseUser){
			orcid.value = firebaseUser.displayName.split("|")[2];
			filiacao.value = firebaseUser.displayName.split("|")[3];
			unidade.value = firebaseUser.displayName.split("|")[4];
			textbox.innerHTML += firebaseUser.displayName.split("|")[5];
		}
	});

	bAdd.addEventListener("click", baddPressed);
	bRemover.addEventListener("click", bRemoverPressed);

	function baddPressed(){
		if(array.length == 0 && textbox.innerHTML != "Interests: "){
			var aux = textbox.innerHTML.split(": ")[1].split(",");
			for(let i=0; i<aux.length; i++){
				array.push(aux[i]);
			}
		}
		if(interesses.value.length == 0)
			alert("The Interests field is empty.");
		else{
			var controlo = 0;
			controlo += verificar(interesses.value, 0);
			if(controlo==0){
				if(array.indexOf(interesses.value) != -1){
					alert("This Interests is already added.");
				}
				else{
					array.push(interesses.value);
					if(array.length == 1)
						textbox.innerHTML += interesses.value;
					else
						textbox.innerHTML += ", "+interesses.value;
				}
			}
		}
	}

	function bRemoverPressed(){
		if(array.length == 0 && textbox.innerHTML != "Interests: "){
			var aux = textbox.innerHTML.split(": ")[1].split(",");
			for(let i=0; i<aux.length; i++){
				array.push(aux[i]);
			}
		}
		if(interesses.value.length == 0)
			alert("The Interests field is empty.");
		else{
			var controlo = 0;
			controlo += verificar(interesses.value, 0);
			if(controlo==0){
				if(array.indexOf(interesses.value) != -1){
					if(array.length>1){
						array.splice(array.indexOf(interesses.value), 1);
						for(let i=0; i<array.length; i++){
							if(i==0){
								textbox.innerHTML = "Interests: "+array[0];
							}
							else{
								textbox.innerHTML += ","+array[i];
							}
						}
					}
					else
						alert("You need one interest at least.");
				}
				else{
					alert("There is no Interest with this value.");
				}
			}
		}
	}

	bsave.addEventListener("click", bsavePressed);

	function bsavePressed(){
		if(array.length == 0 && textbox.innerHTML != "Interests: "){
			var aux = textbox.innerHTML.split(": ")[1].split(",");
			for(let i=0; i<aux.length; i++){
				array.push(aux[i]);
			}
		}
		var photo = foto.files[0];
		if(orcid.value.length == 0)
			alert("The ORCID field is empty.");
		else if(filiacao.value.length == 0)
			alert("The Affiliation field is empty.");
		else if(unidade.value.length == 0)
			alert("The Research Unit field is empty.");
		else if(array.length == 0)
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
						
						window.addEventListener("message" , mensagem);

						controlo += verificar(filiacao.value, 0);
						controlo += verificar(unidade.value, 0);
						controlo += verificar(orcid.value, 1);

						if(controlo==0){
							var orcidID = transforma_orcid(orcid.value);
							
							var check_orcid;
							checkORCIDProfile(orcidID);
						}

						function mensagem(ev){
							if(ev.data == "ORCID_1"){
								controlo+= 1;
								alert("ORCID number is not valid");
							}
							else{
								if(controlo==0){
									var aux2;
									for(let i=0; i<array.length; i++){
										if(i==0){
											aux2 = array[0];
										}
										else{
											aux2 += ","+array[i];
										}
									}
									var reader = new FileReader();
									reader.onloadend = function () {
										var aux = user.displayName.split("|")[0] +"|"+user.displayName.split("|")[1];
										user.updateProfile({
							  				displayName: aux+"|"+orcid.value+"|"+filiacao.value+"|"+unidade.value+"|"+aux2+"|"
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
							}
						}	
						
					});
			}
			else{
				var user = firebase.auth().currentUser;
				//Controlo de segurança de strings
				var controlo = 0;
						
				window.addEventListener("message" , mensagem);

				controlo += verificar(filiacao.value, 0);
				controlo += verificar(unidade.value, 0);
				controlo += verificar(orcid.value, 1);
				
				if(controlo==0){
					var orcidID = transforma_orcid(orcid.value);	
					var check_orcid;
					checkORCIDProfile(orcidID);
				}	

				function mensagem(ev){
					if(ev.data == "ORCID_1"){
						controlo+= 1;
						alert("ORCID number is not valid");
					}
					else{
						if(controlo==0){
							var aux2;
							for(let i=0; i<array.length; i++){
								if(i==0){
									aux2 = array[0];
								}
								else{
									aux2 += ","+array[i];
								}
							}
							var aux = user.displayName.split("|")[0] +"|"+user.displayName.split("|")[1];
							user.updateProfile({
								displayName: aux+"|"+orcid.value+"|"+filiacao.value+"|"+unidade.value+"|"+aux2+"|"
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

function transforma_orcid(orcid){
	var orcid_format= "";
	var caract = "-";
	var final;

	for(var i=0; i<orcid.length; i++){
		orcid_format += orcid[i];
		if(((i+1)%4)==0 && i<orcid.length-1)
			orcid_format += caract;
	}

	return orcid_format;
}

function checkORCIDProfile(orcidID) {

    var ORCIDLink = "https://pub.orcid.org/v2.0/" + orcidID + "/works";


    fetch(ORCIDLink, {
        
        headers: {
          "Accept": "application/orcid+json"
        }
      })

    .then(
      function(response) {
        if (response.status !== 200) {
          console.log('Looks like there was a problem. Status Code: ' +
            response.status);
          window.postMessage("ORCID_1" ,'*');
          return 1;
        }

        console.log(response.json);
        // Examine the text in the response
        response.json().then(teste = function(data) {
        	window.postMessage("ORCID_0" ,'*');
        	return 0;
        })
    })
   
}

