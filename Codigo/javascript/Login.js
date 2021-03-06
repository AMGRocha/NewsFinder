
(function(){
	window.addEventListener("load", main);
}());

function main(){
	firebase.auth().signOut();
	var txtemail = document.getElementById("email");
	var txtPassword = document.getElementById("password");
	var btnLogin = document.getElementById("BLogin");
	var btnRec = document.getElementById("BRecPass");

	txtemail.onkeypress = function(event){
        if (event.keyCode == 13){
            verificar();
        }
    };

	txtPassword.onkeypress = function(event){
        if (event.keyCode == 13){
            verificar();
        }
    };

	//Evento Login
	btnLogin.addEventListener("click" , verificar);

	function verificar(){

		var email = txtemail.value;   	// verificar que é e-mail real
		var pass = txtPassword.value;	// requisitos de password
		var auth = firebase.auth();   	// Firebase autenticação

		if(email.length == 0){
			alert("The email field is empty.");
		}
		else if(pass.length == 0){
			alert("The password field is empty.");
		}
		else{
			var confirmation = auth.signInWithEmailAndPassword(email, pass);
			confirmation.catch(e => {
				if(e.code == "auth/wrong-password"){
					alert("The Password is wrong.");
				}
				else
					alert("There is no user with this email.");
			});
		}

	}

	btnRec.addEventListener("click", e => {
		window.location.href = "../html/forgetPassword.html";
	});

	//Verificação a tempo real
	firebase.auth().onAuthStateChanged(firebaseUser => {

		if(firebaseUser){
			//Entrou. Mudar para pagina feed
			window.location.href = "../html/feed.html";
		}
	})
}