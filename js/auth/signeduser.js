import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";




const navprofilename = document.getElementById("navprofilename");
const pageprofilename = document.getElementById("pageprofilename");

const navprofilephoto = document.getElementById("navprofilephoto");
const pageprofilephoto = document.getElementById("pageprofilephoto");



const auth = getAuth();



onAuthStateChanged(auth, (user) => {
    
  if (user) {
 

    const uid = user.uid;

      navprofilename.innerText = user.displayName;
      pageprofilename!=undefined && (pageprofilename.innerText = user.displayName);

        if (user.photoURL!="") { 
            navprofilephoto.style.backgroundImage = "url('"+ user.photoURL +"')";
          pageprofilename != undefined && (pageprofilephoto.style.backgroundImage = "url('"+ user.photoURL +"')");
        }

  } else {

    location.replace("./index.html");
  }
});
