import { getFirestore, doc, getDoc, collection, getDocs, addDoc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";


const profilephoto = document.getElementById("profilephoto");
const profilename = document.getElementById("profilename");
const profileemail = document.getElementById("profileemail");
const profilegender = document.getElementById("profilegender");

const profilefirstname = document.getElementById("profilefirstname");
const profilesecondname = document.getElementById("profilesecondname");
const profileage = document.getElementById("profileage");

const photobrowser = document.getElementById("photobrowser");




let userid_c = "";
let name = "";
let photo = "";



import { getAuth, onAuthStateChanged, updateProfile, updatePassword } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";


const auth = getAuth();
const db = getFirestore();

onAuthStateChanged(auth, async (user) => { console.log(user);
    if (user) {
        userid_c = user.uid;
        name = user.displayName;
        photo = user.photoURL;

        profilename.innerText = user.displayName;
        profileemail.innerText = user.email;
        profilephoto.style.backgroundImage = "url('"+user.photoURL+"')";



        let splitname = [];
        splitname = user.displayName.split(" ");

        profilefirstname.value = splitname[0];
        profilesecondname.value = splitname[1];

    
        var ref = doc(db, "users", user.uid );
        const docsnap = await getDoc(ref);
        if (docsnap.exists()) {
            console.log(docsnap.data());
            const u_data = docsnap.data(); console.log(u_data);
            profileage.value = u_data.age;
            profilegender.innerHTML = u_data.gender == "male" ? "&#xf183; Male" : "&#xf182; female";
            profilegender.style.color = u_data.gender == "male" ? "var(--male)" : "var(--female)";

        }
        else {
        
        }

    } else {

        location.replace("../index.html");
    }
});



let photolink = "";

document.getElementById("nouphotobtn").onclick = () => { 
    profilephoto.style.backgroundImage = "url('')";
    photolink = "";
    updateProfile(auth.currentUser, {
        photoURL: ""
    }).then(() => {
    
    }).catch((error) => {
       
    });
    var ref = doc(db, "users", userid_c);
    updateDoc(ref, {
        photo: ""
      
    }).then(() => {

    }).catch(() => {

    })
}


    photobrowser.addEventListener("change", function () {
        let photo = photobrowser.files[0];
        if (photo) {
            upload(userid_c, photo, (link) => {
                photolink = link;
                profilephoto.style.backgroundImage = "url('" + photolink + "')";
                updateProfile(auth.currentUser, {
                    photoURL: photolink
                }).then(() => {
                    
                }).catch((error) => {
                  
                });
                var ref = doc(db, "users", userid_c);
                updateDoc(ref, {
                    photo: photolink
     
                }).then(() => {

                }).catch(() => {

                })
            });
        }
        
        
  
    })




document.getElementById("saveprofiledatabtn").onclick=()=>{

    updateProfile(auth.currentUser, {
        displayName: profilefirstname.value.trim() + " " + profilesecondname.value.trim(),//!not empty
    }).then(() => {
       
    }).catch((error) => {
        
    });
}











import { getStorage, ref as cref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";

const storage = getStorage();

function upload(name,file,onend) {

    const storageRef = cref(storage, 'images/' + name);
    const uploadTask = uploadBytesResumable(storageRef, file);


    uploadTask.on('state_changed',
        (snapshot) => {
       
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
                case 'paused':
                    console.log('Upload is paused');
                    break;
                case 'running':
                    console.log('Upload is running');
                    break;
            }
        },
        (error) => {

            switch (error.code) {
                case 'storage/unauthorized':
           
                    break;
                case 'storage/canceled':
           
                    break;

                case 'storage/unknown':
             
                    break;
            }
        },
        () => {
       
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                onend(downloadURL);
                console.log('File available at', downloadURL);
            });
        }
    );
}


document.getElementById("profileresetpass").onclick = async() => { 

    const user = auth.currentUser;

    if (confirmpass()) {
        await updatePassword(user, profileformpassinput.value).then(() => {
            
        }).catch((error) => {
          
          
        });
    } else { 

    }
}

    
function confirmpass() {
    if (!profileformpassinput.value.match(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/)) {
        profileformpassmsg.style.display = "block";
        profileformconpassmsg.style.display = "none";
        return false;
    } else if (!profileformconpassinput.value.match(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/)) {
        profileformconpassmsg.style.display = "block";
        profileformpassmsg.style.display = "none";
        return false;
    } else if (profileformpassinput.value != profileformconpassinput.value) {
        profileformconpassmsg.style.display = "block";
        profileformpassmsg.style.display = "none";
        return false;
    }
    else {
        profileformpassmsg.style.display = "none";
        profileformconpassmsg.style.display = "none";
        return true;
    }
}






const profilehistorypool = document.getElementById("profilehistorypool");
const profilesavedpool = document.getElementById("profilesavedpool");

document.getElementById("historybutton").onclick = () => {
    var historyref = collection(db, "users/" + userid_c + "/history");
    postdrawer(profilehistorypool, historyref,"history");
};
document.getElementById("savedbutton").onclick = () => {
    var savedref = collection(db, "users/" + userid_c + "/saved");
    postdrawer(profilesavedpool, savedref,"saved");
};

const postdrawer = async(loc,dbref,mode) => {
    
    const postid = await getDocs(dbref);
    if (!postid.empty) {
        console.log(postid.docs);
        
        loc.innerHTML = "";
 
        
        postid.docs.map(async (id) => {
            console.log(id, "post " + mode);
            const h_doc_id = id.id;

            var postref = doc(db, "posts/" + id.data().postid);
            const hpost = await getDoc(postref);
            if (hpost.exists()) {

                const post_E = hpost;
                
                const post = id.data().postid + "-" + mode;
                const postF = id.data().postid;

            let postcomp = document.createElement("section");
            postcomp.classList.add("postcon");
            postcomp.innerHTML = `<section class="postheader">
                            <div class="sender">
                                <div class="postsenderphoto" style="background-image:url(${post_E.data().senderphoto});"></div>
                                <div class="posttimesendername">
                                    <span class="postsendername">${post_E.data().sendername}</span>
                                   <!--<span class="posttime">${((post_E.data().time % 60000) / 1000).toFixed(0) + "s"}</span>-->
                                </div>
                            </div>
                            <!--<div class="postmenu">
                                <span class="postmenuicon pointerarow" data-bs-toggle="dropdown">&#xf142;</span>
                                <div class="postmenucon position-absolute">
                                <ul class="dropdown-menu bsddm">
                                        <li id="delete${post}"><span class="dropdown-item bsddi" >delete</span></li>
                                        <li id="save${post}"><span class="dropdown-item bsddi" >save</span></li>
                                        <li><span class="dropdown-item bsddi">report</span></li>
                                        <li><a class="dropdown-item bsddi">share to chat</a></li>
                                    </ul>                    
                                </div>
                                </div>-->
                                </section>
                                <section class="posttxt">
                            <span class="entertxt">
                                ${post_E.data().text}
                            </span>
                        <!--<span class="readmore pointerarow">
                                Read more...
                            </span>-->
                        </section>
                        <section id="postimgs${post}" class="postimg">
    
                            <!-- <div class="imglimeter">
                                <img src="https://i.pinimg.com/736x/b6/4e/6e/b64e6ec02759b68a2bbad1de388940a7.jpg" alt="" width="100%">
                            </div> -->
                        </section>
                        <section class="postcomments">
                            <div class="commentscon">
                                <div id="${post}" class="commentscollapse collapse">
                                    <div id="comment${post}" class="commentspool">
                                
                                    
                                    </div>
                                    <section class="commentinputsmallcon">
                                        <textarea id="commentareasmall${post}" placeholder="Comment" class="commentinputsmall pointerarow"></textarea>
                                        <span id="sendcommentbtn-small${post}" class='commentsendbtn-small' datacomnt-id='${post}'>&#xf1d8;</span>
                                    </section>
                                </div>
                            </div>
                        </section>
                        <section class="postcontrols">
                            <aside class="commentinputcon">
                                <textarea id="commentarea${post}" placeholder="Comment" class="commentinput pointerarow"></textarea>
                                <span id="sendcommentbtn${post}" class='commentsendbtn' datacomnt-id='${post}'>&#xf1d8;</span>    
                            </aside>
                            <div data-bs-toggle="collapse" data-bs-target="#${post}" class="postcontrolbtns">
                                <span id="readcommentsbtn${post}" class="postcontrolsicons postcommenticon pointerarow" datacomnt-id='${post}'>&#xf0ca;</span>
                                <span id="commentsnum${post}" class="postnums postcommentnum"></span>
                            </div>
                            <div class="postcontrolbtns">
                                <span id="react${post}" class="postcontrolsicons postloveicon pointerarow"  datacomnt-id='${post}' >&#xf004;</span>
                                <span id="reactsnum${post}" class="postnums postlovenum"></span>
                            </div>
                            </section>`
                loc.appendChild(postcomp);

            //*delete post d
            document.getElementById("delete" + post).onclick = async () => {
                var postref = await doc(db, "posts/" , post);
                await deleteDoc(postref).then(() => {
                    console.log("deleted");
                }).catch(() => {
                    console.log("not deleted");
                })

                var hisref = await doc(db, "users/" + userid_c + "/history", h_doc_id);
                    await deleteDoc(hisref).then(() => {
                    console.log("deleted");
                }).catch(() => {
                    console.log("not deleted");
                })

                postcomp.style.display = "none";
                postcomp = null;
            }

            //*post photo set r event
            const photos = await getDocs(collection(db, "posts/" + postF, "photo"));
            if (!photos.empty) {
                console.log("photos", photos);
                photos.docs.map((photo) => {
                    document.getElementById("postimgs" + post).innerHTML += `<div class="imglimeter">
                                    <img src="${photo.data().photo}" alt="loading..." width="100%"/>
                                </div>`
                })

            } else {
                document.getElementById("postimgs" + post).innerHTML = "";
            }

            //*post comment r/w events
            //?get num
            const comments = await getDocs(collection(db, "posts/" + postF, "comments"));
            if (!comments.empty) {
                console.log("--++", comments);
                document.getElementById("commentsnum" + post).innerText = comments.size;
            } else {
                document.getElementById("commentsnum" + post).innerText = 0;
            }

            document.getElementById("sendcommentbtn-small" + post).onclick = (e) => {
                sendcomment("commentareasmall" + post, e.target.getAttribute('datacomnt-id'));
            }
            document.getElementById("sendcommentbtn" + post).onclick = (e) => {
                sendcomment("commentarea" + post, e.target.getAttribute('datacomnt-id'));
            }

                async function sendcomment(inputid, postid) {
                const postidF = postid.split("-history")[0];
                var ref = collection(db, "posts/" + postidF + "/comments");
                await addDoc(
                    ref, {
                    sendername: name,
                    senderphoto: photo,
                    text: document.getElementById(inputid).value
                }
                ).then((x) => {
                    console.log(x);
                }).catch((x) => {
                    console.log(x);
                })
                document.getElementById(inputid).value = "";
                document.getElementById("commentsnum" + postid).textContent++;

            }

                document.getElementById("readcommentsbtn" + post).onclick = async (e) => {
                const postid = e.target.getAttribute('datacomnt-id');
                const postidF = postid.split("-history")[0];
                var ref = collection(db, "posts/" + postidF + "/comments");
                const docsnap = await getDocs(ref);
                if (!docsnap.empty) {
                    document.getElementById("comment" + postid).innerHTML = "";
                    docsnap.docs.map((comment) => {
                        console.log({ id: comment.id, data: comment.data() });
                        document.getElementById("comment" + postid).innerHTML += `
                        ${(comment.data() == undefined ? "" :
                                `<div class="comment">
                                <div class="commenthead">
                                    <div class="commentprofilephoto" style="background-image:url(${comment.data().senderphoto});"></div>
                                    <span class="commentprofilename">${comment.data().sendername}</span>
                                </div>
                                <div class="commentbody">
                                    ${comment.data().text}
                                </div>
                            </div>`
                            )}`
                    });
                }
                else {
                    console.log("no comments");
                }
            }

            //*post rect events

            //?get num
            const reacts = await getDocs(collection(db, "posts/" + postF, "reacts"));
            if (!reacts.empty) {
                console.log(reacts);
                document.getElementById("reactsnum" + post).innerText = reacts.size;
            } else {
                document.getElementById("reactsnum" + post).innerText = 0;
            }

            //!no react ignore
            document.getElementById("react" + post).onclick = async (e) => {
                const postid = e.target.getAttribute('datacomnt-id');
                const postidF = postid.split("-history")[0];
                var ref = collection(db, "posts/" + postidF + "/reacts");
                await addDoc(ref, { user: userid_c, }).then((x) => {
                    console.log(x);
                }).catch((x) => {
                    console.log(x);
                })
                document.getElementById("react" + post).style.color = "var(--love)";
                document.getElementById("reactsnum" + postid).textContent++;
            }
                    
            
            } else {
          
                console.log("can't load post");
            }

        })
    }
    else {
    
        console.log("no thing here");
    }
}