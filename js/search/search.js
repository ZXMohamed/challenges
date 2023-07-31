import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { notfound, readposts, searchcards } from "../offers/offers.js";

var type = "doctorname";
// document.getElementById("dname").onclick=()=>{
//     type="doctorname";
// }
// document.getElementById("atime").onclick=()=>{
//     type="freetime";
// }

async function search(searchinput) { 
    const q = query(ref, where(type, "==", searchinput));
    const docsnap = await getDocs(q);
    if (!docsnap.empty) {
        searchcards(docsnap);
    } else {
        notfound();
    }
}

//     function ons(){
//         if(document.cookie.split(";")[1]!="null"){
//             type = "doctorname";
//             search(document.cookie.split(";")[1]);

//             var x="";
//             for(var i=0;i<= document.cookie.split(";").length-1;i++){
//                 if(i!=1)
//                 x+=document.cookie.split(";")[i];
//                 else
//                 x+="null";
//             }
//             document.cookie=x;
//         }
//     }

// ons()

const searchinput = document.getElementById("searchinput");
const searchsideinput = document.getElementById("searchsideinput");

const db = getFirestore();
var ref = collection(db, "offers");

document.getElementById("searchbtn").onclick = () => {
    type = "doctorname";
    search(searchinput.value);
}
document.getElementById("searchsidebtn").onclick = () => {
    type = "doctorname";
    search(searchsideinput.value);
}


document.getElementById("searchall").onclick=()=>{
    readposts();
}
document.getElementById("searchmale").onclick=()=>{
    type="gender";
    search("male");
}
document.getElementById("searchfemale").onclick=()=>{
    type="gender";
    search("female");
}


