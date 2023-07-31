import { getDatabase, ref, set, push, get, child,onValue } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

const db = getDatabase();
const fsdb = getFirestore();

var f=false;

let c_chat;
let docname;
let docphoto;



//$create chat
export async function createchat(docid) {
    const chatid = push(ref(db, 'chats'));
    await set(chatid, {doctor_id: docid,
    //     messages: {
    //     "6546ggugj": {
    //         sender: uid,
    //         text: "hello"
    //     },
    //     "g4f6dg4fd": {
    //         sender: docid,
    //         text: "hello"
    //     },
    // },
        user_id: uid
    });

    await set(ref(db, 'users/'+uid+"/contact/"+docid), { chat_id: chatid.key });

    await set(ref(db, 'offers/'+docid+"/contact/"+uid), { chat_id: chatid.key });
    f=false;
    await setupchat();
}

//$open chat
//$open listener and notifications
const contactlist = document.getElementById("contactlist");
const chatmini = document.getElementById("chatmini");



 async function setupchat() {
    if(f!=true){

   
    contactlist.innerHTML = "";
    chatmini.innerHTML="";
    await get(child(ref(db), `users/${uid}/contact`)).then( async (snapshot) => {
        //$get docs data by id
        for (var docid in snapshot.val()) { 
            console.log("read listitem", docid);
            const docsnap = await getDoc(doc(fsdb, "offers", docid));
            if (docsnap.exists()) {
                //$setup ui
                console.log("list", docsnap.data());

                const miniitem =document.createElement("li")
                miniitem.classList.add("chatitem")
                miniitem.innerHTML=`
                <a class="" href="#">
                    <div class="chaticon" style="background-image: url('${docsnap.data().photo}');background-size: cover;background-position: center;border-radius: 50%;background-repeat: no-repeat;">
                        <div id="rdot${snapshot.val()[docid].chat_id}" class="chatnotify rounded-pill badge-notification bg-danger" style="display:none;">21</div>
                    </div>
                </a>
                `
                chatmini.appendChild(miniitem);



                const listitem = document.createElement("li");
                listitem.classList.add("list-group-item", "list-group-item-action", "d-flex", "justify-content-between", "align-items-start");
                listitem.innerHTML = `
                    <div class="ms-2 me-auto chatcontact">
                    <div class="chatcontactphoto" style="background-image: url('${docsnap.data().photo}');"></div>
                    <section>
                    <div class="fw-bold chatcontactname">D. ${docsnap.data().doctorname}</div>
                    <!--<span class="chatcontactmsg">Content for list item</span>-->
                    </section>
                    </div>
                    <!--<span id="notify${docid}" class="badge rounded-pill" style="background-color: var(--notifydot);">--> </span>
                `
                //$open chat event
                const chatid = snapshot.val()[docid].chat_id;
                const dname = docsnap.data().doctorname;
                const dphoto = docsnap.data().photo;
                listitem.onclick = () => {
                    //$fetch msgs
                    docname = dname;
                    docphoto = dphoto;
                    chatview(chatid)
                }
                //$handel reddot event
                //$open listener
                //$receive
                const starCountRef = ref(db, 'chats/' + snapshot.val()[docid].chat_id + '/messages');
                onValue(starCountRef, (snapshot) => {
                    const data = snapshot.val();

                    console.log(data);
                    console.log(c_chat,chatid)
                    
                    // document.getElementById("rdot"+chatid).innerHTML=Object.keys(data).length;
                    // document.getElementById("rdot"+chatid).style.display="flex";
                if(c_chat==chatid){
                    chatview(chatid)
                }else{
                    try {
                        document.getElementById("rdot"+chatid).innerHTML=Object.keys(data).length;
                    document.getElementById("rdot"+chatid).style.display="flex";
                    } catch (error) {
                        
                    }
                    
                }
                });






                contactlist.appendChild(listitem);
                
            } else { }
        }
    }).catch((error) => {
        console.error(error);
    });


    await get(child(ref(db), `users/${uid}/groups`)).then(async (snapshot) => { 
        for (var i in snapshot.val()) { 


            const miniitem =document.createElement("li")
            miniitem.classList.add("chatitem")
            miniitem.innerHTML=`
            <a class="" href="#">
                <div class="chaticon" style="background-image: url('../images/shared/group.png');background-size: cover;background-position: center;border-radius: 50%;background-repeat: no-repeat;">
                    <div id="rdot${i}" class="chatnotify rounded-pill badge-notification bg-danger" style="display:none;">21</div>
                </div>
            </a>
            `
            chatmini.appendChild(miniitem)


            const listitem = document.createElement("li");
            listitem.classList.add("list-group-item", "list-group-item-action", "d-flex", "justify-content-between", "align-items-start");
            listitem.innerHTML = `
                    <div class="ms-2 me-auto chatcontact">
                    <div class="chatcontactphoto" style="background-image: url('../images/shared/group.png');"></div>
                    <section>
                    <div class="fw-bold chatcontactname">${snapshot.val()[i].group_name}</div>
                    <!--<span class="chatcontactmsg">Content for list item</span>-->
                    </section>
                    </div>
                    <!--<span id="notify${i}" class="badge rounded-pill" style="background-color: var(--notifydot);">--></span>
                `
            //$open chat event
            const chatid = i;
            const dname = snapshot.val()[i].group_name;
            const dphoto = null;
            listitem.onclick = () => {
                //$fetch msgs
                docname = dname;
                docphoto = dphoto;
                chatview(chatid)
            }
                //$handel reddot event
                //$open listener
                //$receive
            const starCountRef = ref(db, 'chats/' + i + '/messages');
            onValue(starCountRef, (snapshot) => {
                const data = snapshot;
                console.log(data);
                console.log(c_chat,chatid)
                if(c_chat==chatid){
                    chatview(chatid)
                }else{
                    try {
                        document.getElementById("rdot"+chatid).innerHTML=Object.keys(data.val()).length;
                    document.getElementById("rdot"+chatid).style.display="flex";
                    } catch (error) {
                        
                    }
                    
                }

            });
            
            
            contactlist.appendChild(listitem);
        }
    }).catch((error) => {
        console.error(error);
    });
f=true;
}

}
document.getElementById("openchatbtn").onclick = setupchat;

const chatviewer = document.getElementById("chatviewer");
async function chatview(chatid) {
    c_chat = chatid;
    document.getElementById("rdot"+chatid).style.display="none";
    chatviewer.innerHTML = "";
    document.getElementById("chatotherphoto").style.backgroundImage="url('"+docphoto+"')"
    document.getElementById("chatothername").innerHTML="D."+docname
    await get(child(ref(db), `chats/${chatid}`)).then(async (snapshot) => {
        console.log(snapshot.val());
        // if(snapshot.val().messages){
        for (var i in snapshot.val().messages) {
            if (snapshot.val().messages[i].sender==uid) {
                chatviewer.innerHTML += `
                    <aside class="chatsentmsg">
                        <section class="chatsentmsgbody">
                            ${snapshot.val().messages[i].text}
                        </section>
                    </aside>
                `
            }else if(snapshot.val().messages[i].sender==snapshot.val().doctor_id){
                chatviewer.innerHTML += `
                    <aside class="chatreceivedmsg">
                        <!-- <section class="chatmsgprofile"><div class="chatmsgprofilephoto"></div><span class="chatmsgprofilename">samir abo elneil</span></section>-->
                        <section class="chatreceivedmsgbody" style="font-family:'icons';">
                            ${"&#xf0f0;   "}
                            ${":  "+snapshot.val().messages[i].text}
                        </section>
                    </aside>
                `
            } else {
                chatviewer.innerHTML += `
                    <aside class="chatreceivedmsg">
                        <!-- <section class="chatmsgprofile"><div class="chatmsgprofilephoto"></div><span class="chatmsgprofilename">samir abo elneil</span></section>-->
                        <section class="chatreceivedmsgbody">
                            ${snapshot.val().messages[i].text}
                        </section>
                    </aside>
                `
            }
        // }
    }
    }).catch((e)=>{console.log(e);})
}
//$send
async function sendmsg(chatid,msg) { 
    const chat = push(ref(db, 'chats/'+chatid+"/messages/"));
    await set(chat, {
                sender: uid,
                text: msg
    }).then(() => {
        // chatviewer.innerHTML += `
        //             <aside class="chatsentmsg">
        //                 <section class="chatsentmsgbody">
        //                     ${msg}
        //                 </section>
        //             </aside>
        //         `
    });
}
const chatinput = document.getElementById("chatinput");
document.getElementById("chatsendmsgbtn").onclick = () => { 
    sendmsg(c_chat, chatinput.value);
}

















import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";





var uid;
var name;
var photo;



const auth = getAuth();

onAuthStateChanged(auth, (user) => {
    uid = user.uid;
    name = user.displayName;
    photo = user.photoURL;
    //setupchatmini();
    //createchat(uid, "1NX3WcARTYvhukTvfoCP");
    setupchat();
    
});






