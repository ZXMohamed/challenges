import { getAuth, createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

const fname = document.getElementById("fname");
const sname = document.getElementById("sname");
const age = document.getElementById("age");
const email= document.getElementById("email");
const pass= document.getElementById("pass");
const conpass= document.getElementById("conpass");
const Gmale= document.getElementById("g-male");
const Gfemale = document.getElementById("g-female");

const emailmsg = document.getElementById("emailmsg");

const passmsg = document.getElementById("passmsg");
const conpassmsg = document.getElementById("conpassmsg");




const auth = getAuth();
const db = getFirestore();

document.getElementById("signupbtn").onclick = () => {
    //? email
    (confirmemail() && confirmpass()) && createUserWithEmailAndPassword(auth, email.value, pass.value)
        .then(async (userCredential) => {
            const user = userCredential.user;

            await updateProfile(auth.currentUser, {
                displayName: fname.value.trim() + " " + sname.value.trim() //!not empty
            }).then(() => {
                
            }).catch((error) => {
                
            });
            
         
            var ref = doc(db, "users", user.uid);
            await setDoc(ref, {
                age: age.value,//!not empty
                gender: (Gmale.checked ? "male" : "female"),
                name:fname.value.trim() + " " + sname.value.trim(),
                uid:user.uid,
            }).then((x) => {

            }).catch((x) => {

            })

            
        location.replace("social.html");

        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        }
    );
}



function confirmpass(){ 
    if (!pass.value.match(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/)) {
        passmsg.style.display = "block";
        conpassmsg.style.display = "none";
        return false;
    } else if (!conpass.value.match(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/)){
        conpassmsg.style.display = "block";
        passmsg.style.display = "none";
        return false;
    } else if (pass.value != conpass.value) {
        conpassmsg.style.display = "block";
        passmsg.style.display = "none";
        return false;
    }
    else {
        passmsg.style.display = "none";
        conpassmsg.style.display = "none";
        return true;
    }
}

function confirmemail() {
    if (!email.value.match(/(?=.*[@])(?=.*[.]).{10,}/)) {
        emailmsg.style.display = "block";
        return false;
    } else {
        emailmsg.style.display = "none";
        return true;
    }
}






const signupd = document.getElementById("signupd");
if (signupd)
    signupd.onclick = () => {
    location.replace("../d/web/signup.html");
}
