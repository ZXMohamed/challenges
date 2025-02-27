import { getDatabase, ref, set, push, get, child, onValue } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";


const db = getDatabase();
const fsdb = getFirestore();

var f=false;

let c_chat;
let docname;
let docphoto;

let selectmode = false;
let selectedids = [];


const contactlist = document.getElementById("contactlist");
const chatmini = document.getElementById("chatmini");

async function setupchat() {
    if(f!=true){
    contactlist.innerHTML = "";
    chatmini.innerHTML="";

    await get(child(ref(db), `offers/${uid}/contact`)).then(async (snapshot) => {
        for (var docid in snapshot.val()) {
            console.log("read listitem", docid);
            const docsnap = await getDoc(doc(fsdb, "users", docid));
            if (docsnap.exists()) {
          
       



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
                    ${(selectmode) ? `<div class="me-2"><input id="check${docid}" type="checkbox"></div>`:""}
                    <div class="chatcontactphoto" style="background-image: url('${docsnap.data().photo}');"></div>
                    <section>
                    <div class="fw-bold chatcontactname">${docsnap.data().name}</div>
                    <!--<span class="chatcontactmsg">Content for list item</span>-->
                    </section>
                    </div>
                    <!--<span id="notify${docid}" class="badge rounded-pill" style="background-color: var(--notifydot);"> --></span>
                `
                //$open chat event
                const chatid = snapshot.val()[docid].chat_id;
                const dname = docsnap.data().name;
                const dphoto = docsnap.data().photo;
                listitem.onclick = () => {
                    docname = dname;
                    docphoto = dphoto;
                    chatview(chatid)
                }
                contactlist.appendChild(listitem);
                
                if (selectmode) {
                    const xid = docid;
                    document.getElementById("check" + docid).onclick = (e) => { e.stopPropagation() }
                    document.getElementById("check" + docid).onchange = (e) => {
                        e.stopPropagation();
                        if (e.target.checked) {
                            selectedids.push(xid);
                        }
                        else {
                            selectedids = selectedids.filter((v) => {
                                if (v != xid) return v;
                            })
                        }
                        console.log(selectedids);
                    }
                }

    
                const starCountRef = ref(db, 'chats/' + snapshot.val()[docid].chat_id + '/messages');
                onValue(starCountRef, (snapshot) => {
                    const data = snapshot.val();
                    console.log(data);
                    console.log(c_chat,chatid)
                    if(c_chat==chatid){
                        chatview(chatid)
                    } else {
                        if (data) { 
                            document.getElementById("rdot"+chatid).innerHTML=Object.keys(data).length;
                            document.getElementById("rdot"+chatid).style.display="flex";
                        }
                    }
                });



            } else { }
        }
    }).catch((error) => {
        console.error(error);
    });


    await get(child(ref(db), `offers/${uid}/groups`)).then(async (snapshot) => {
        for (var i in snapshot.val()) {

            const miniitem =document.createElement("li")
            miniitem.classList.add("chatitem")
            miniitem.innerHTML=`
            <a class="" href="#">
                <div class="chaticon" style="background-image: url('../../images/shared/group.png');background-size: cover;background-position: center;border-radius: 50%;background-repeat: no-repeat;">
                    <div id="rdot${i}" class="chatnotify rounded-pill badge-notification bg-danger" style="display:none;">21</div>
                </div>
            </a>
            `
            chatmini.appendChild(miniitem);



            const listitem = document.createElement("li");
            listitem.classList.add("list-group-item", "list-group-item-action", "d-flex", "justify-content-between", "align-items-start");
            listitem.innerHTML = `
                    <div class="ms-2 me-auto chatcontact">
                    <div class="chatcontactphoto" style="background-image: url('../../images/shared/group.png');"></div>
                    <section>
                    <div class="fw-bold chatcontactname">${snapshot.val()[i].group_name}</div>
                    <!--<span class="chatcontactmsg">Content for list item</span>-->
                    </section>
                    </div>
                    <!--<span id="notify${i}" class="badge rounded-pill" style="background-color: var(--notifydot);"> --></span>
                `
            //$open chat event
            const chatid = i;
            const dname = snapshot.val()[i].group_name;
            const dphoto = null;
            listitem.onclick = (e) => {
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
                } else {
                    if (data.val()) {
                        document.getElementById("rdot" + chatid).innerHTML = Object.keys(data.val()).length;
                        document.getElementById("rdot" + chatid).style.display = "flex";
                    }
                }
            });


            contactlist.appendChild(listitem);
        }
    }).catch((error) => {
        console.error(error);
    });
    f=true
}
}
document.getElementById("openchatbtn").onclick = setupchat;

document.getElementById("creategroupbtn").onclick = () => {
    selectmode = !selectmode;
    document.getElementById("setgdata").style.display = selectmode ? "inline" : "none"
    document.getElementById("setgname").style.display= selectmode ? "inline" : "none"
    document.getElementById("groupbtnicon").innerHTML = selectmode ? "&#xf00d;" : "+ &#xf0c0;";
    f=false;
    setupchat();
};

document.getElementById("setgdata").onclick = (e) => { 
    e.stopPropagation();
    creategroupblock(uid,document.getElementById("setgname").value ,selectedids);
}
document.getElementById("setgname").onclick = (e) => {
    e.stopPropagation();
}

const chatviewer = document.getElementById("chatviewer");
async function chatview(chatid) {
    c_chat = chatid;
    document.getElementById("rdot"+chatid).style.display="none";
    chatviewer.innerHTML = "";
    document.getElementById("chatotherphoto").style.backgroundImage = "url('" + docphoto + "')"
    document.getElementById("chatothername").innerHTML = docname;
    await get(child(ref(db), `chats/${chatid}`)).then(async (snapshot) => {
        if(snapshot.val().messages){
        for (var i in snapshot.val().messages) {
            if (snapshot.val().messages[i].sender == uid) {
                chatviewer.innerHTML += `
                    <aside class="chatsentmsg">
                        <section class="chatsentmsgbody">
                            ${snapshot.val().messages[i].text}
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
        }
    }
    }).catch((e) => { console.log(e); })
}
//$send
async function sendmsg(chatid, msg) {
    const chat = push(ref(db, 'chats/' + chatid + "/messages/"));
    await set(chat, {
        sender: uid,
        text: msg
    }).then(() => {

    });
}

const chatinput = document.getElementById("chatinput");
document.getElementById("chatsendmsgbtn").onclick = () => {
    sendmsg(c_chat, chatinput.value);
}






async function creategroupblock(did, name, membersid) {
    const chatid = push(ref(db, 'chats'));
    await set(chatid, {
        doctor_id: did,

    });


    for (var i of membersid) {
        await set(ref(db, 'users/' + i + "/groups/" + chatid.key), { group_name: name });
    }

    await set(ref(db, 'offers/' + did + "/groups/" + chatid.key), { group_name: name });
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

   
   setupchat();

});
