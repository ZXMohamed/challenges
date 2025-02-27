import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { notfound, readposts, searchcards } from "../offers/offers.js";

var type = "doctorname";


async function search(searchinput) { 
    const q = query(ref, where(type, "==", searchinput));
    const docsnap = await getDocs(q);
    if (!docsnap.empty) {
        searchcards(docsnap);
    } else {
        notfound();
    }
}

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


