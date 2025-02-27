import { createchat } from "../chat/chat.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";


const postspool = document.getElementById("offerspool");

const db = getFirestore();


readposts();

export async function readposts() {

    var ref = collection(db, "offers");
    const docsnap = await getDocs(ref);
    postspool.innerHTML = "";
    console.log(docsnap);
    if (!docsnap.empty) {

        searchcards(docsnap);

        } else {
        notfound();
    }
}


function rate(z) { 
    var x = "";
    for (let i = 0; i < z; i++) {
        x += "<span>&#xf005;</span>";
    }
    return x;
}



export function searchcards(docsnap) {
    postspool.innerHTML = "";
    document.getElementById("rnum").innerHTML=docsnap.docs.length;
    docsnap.docs.map((post) => {
        const offercard = document.createElement("section");
        offercard.classList.add("offer");

        offercard.innerHTML = `
                
        <section class="offerleft">
            <div class="offerleftside" style="background-position: center;background-repeat: no-repeat;background-image: url('${post.data().photo}'); background-size: cover;">

            </div>
        </section>
        <section class="offerrightside" >
            ${post.data().gender == "male" ? `<div class="offerdoctorgender" style="color:var(--male) !important;">
                &#xf183;  Male
            </div>`: `<div class="offerdoctorgender" style="color:var(--female) !important;">
                &#xf182;  Female
            </div>`}
            
            <div class="offername">
                ${post.data().doctorname}
            </div>
            <div class="offercontent">
              ${post.data().brif}
            </div>
            <div class="offerfollowers">
                Country : ${post.data().country}
            </div>
            <div class="offerfooter">
                <div class="offerrating">
                    <div class="offerrate">
                        <span>Rate : </span>
                        ${rate(post.data().rate)}
                    </div>
                    <div style="display:none;" class="offerfollowers">
                        Followers : ${post.data().followers}
                    </div>
                </div>
                <div class="offerprice" data-bs-toggle="collapse" data-bs-target="#collapseWidthExample">
                   <!-- price:200$ --><br>
                    <button id="${post.id}chat" class="offersubscribe" style="font-family: icons;" data-bs-toggle="offcanvas" data-bs-backdrop="static" data-bs-target="#offcanvasBottom" >&#xf075;&nbsp;&nbsp;chat</button>
                </div>
            </div>

                `
        postspool.appendChild(offercard);
        const id = post.id;
        
        document.getElementById(id + "chat").onclick = () => {
            createchat(id);
            console.log("chataa")
        }
    })
}


export function notfound() {
    postspool.innerHTML = "";
    postspool.innerHTML = "<h4 style='color:var(--invert)'>Not found</h4>";
}

