import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";


const email = document.getElementById("email");
const pass = document.getElementById("pass");


const auth = getAuth();

document.getElementById("loginbtn").onclick = () => {
    signInWithEmailAndPassword(auth, email.value, pass.value)//!not empty
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            //?nav to social
            location.replace("./web/social.html")
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert("email or password notvailed")
        }
    );    
}


onAuthStateChanged(auth, (user) => {

    if (user) {

        location.replace("./web/social.html");

    } else {
        
    }
});
try {
   document.getElementById("logind").onclick = () => { 
    location.replace("./d/index.html");
}

} catch (error) {
    
}
try {
    document.getElementById("loginc").onclick = () => {
        location.replace("../index.html");
    }
} catch (error) {
    
}
