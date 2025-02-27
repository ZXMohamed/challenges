import { getFirestore, collection, addDoc, getDocs}
    from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

const postspool = document.getElementById("postspool");

const db = getFirestore();

readposts();

async function readposts() { 

    var ref = collection(db, "posts");
    const docsnap = await getDocs(ref);
    if (!docsnap.empty) {
        postspool.innerHTML = "";
        docsnap.docs.map(async (post_E) => {
            console.log({ id: post_E.id, data: post_E.data() });
            const post = post_E.id;
            const postcomp = document.createElement("section");
            postcomp.classList.add("postcon");
            postcomp.innerHTML = `<section class="postheader">
                            <div class="sender">
                                <div class="postsenderphoto" style="background-image:url(${post_E.data().senderphoto});"></div>
                                <div class="posttimesendername">
                                    <span class="postsendername">${post_E.data().sendername}</span>
                                   <!-- <span class="posttime">${((post_E.data().time % 60000) / 1000).toFixed(0) + "s"}</span>-->
                                </div>
                            </div>
                            <div class="postmenu">
                                <span class="postmenuicon pointerarow" data-bs-toggle="dropdown">&#xf142;</span>
                                <div class="postmenucon position-absolute">
                                <ul class="dropdown-menu bsddm">
                                        <li id="save${post}"><span class="dropdown-item bsddi">save</span></li>
                                        <li><span class="dropdown-item bsddi">report</span></li>
                                        <!--<li><a class="dropdown-item bsddi" href="#">share to chat</a></li>-->
                                    </ul>                    
                                </div>
                                </div>
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
            postspool.appendChild(postcomp);

            //*saved post w
            document.getElementById("save" + post).onclick = async() => {
                var userref = collection(db, "users/" + uid + "/saved");
                await addDoc(
                    userref, {
                    postid: post,
                }
                ).then((x) => {
                    console.log(x);
                }).catch((x) => {
                    console.log(x);
                })

            }

            //*post photo set r event
            const photos = await getDocs(collection(db, "posts/" + post, "photo"));
            if (!photos.empty) { 
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
            const comments = await getDocs(collection(db, "posts/" + post, "comments"));
            if (!comments.empty) {
                // console.log("--++",comments);
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
                var ref = collection(db, "posts/" + postid + "/comments");
                await addDoc(
                    ref, {
                    sendername: name,
                    senderphoto: photo,
                    text: document.getElementById(inputid).value
                }
                ).then((x) => {


                    document.getElementById("comment" + postid).innerHTML += `
                        ${
                            `<div class="comment">
                                <div class="commenthead">
                                    <div class="commentprofilephoto" style="background-image:url(${photo});"></div>
                                    <span class="commentprofilename">${name}</span>
                                </div>
                                <div class="commentbody">
                                    ${document.getElementById(inputid).value}
                                </div>
                            </div>`
                        }`

                }).catch((x) => {

                })
                document.getElementById(inputid).value = "";
                document.getElementById("commentsnum" + postid).textContent++;

            }

            document.getElementById("readcommentsbtn" + post).onclick = async (e) => {
                const postid = e.target.getAttribute('datacomnt-id');
                var ref = collection(db, "posts/" + postid + "/comments");
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
                    
                }
            }


            const reacts = await getDocs(collection(db, "posts/" + post, "reacts"));
            if (!reacts.empty) {
                console.log(reacts);
                document.getElementById("reactsnum" + post).innerText = reacts.size;
            } else { 
                document.getElementById("reactsnum" + post).innerText = 0;
            }


            document.getElementById("react" + post).onclick = async(e) => {
                const postid = e.target.getAttribute('datacomnt-id');
                var ref = collection(db, "posts/"+postid+"/reacts");
                await addDoc(ref, { user: uid, }).then((x) => {
                 
                }).catch((x) => {
             
                })
                document.getElementById("react" + post).style.color = "var(--love)";
                document.getElementById("reactsnum" + postid).textContent++;
            }

           
        })
    }
    else {
        console.log("no thing here");
    }
  
}




document.getElementById("refreshbtn").onclick = () => { 
    window.scrollTo(0, 0);
    readposts();
}



import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";



var name;
var photo;
var uid;


const auth = getAuth();

onAuthStateChanged(auth, (user) => {

    name = user.displayName;
    photo = user.photoURL;
    uid = user.uid;

});
