import { getFirestore, collection, addDoc, getDocs}
    from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

const postspool = document.getElementById("postspool");

const db = getFirestore();

readposts();

async function readposts() { 

//$fire store db setup
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
                console.log("photos",photos);
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
                console.log("--++",comments);
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
                    console.log(x);
                }).catch((x) => {
                    console.log(x);
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
                    console.log("no comments");
                }
            }

            //*post rect events

            //?get num
            const reacts = await getDocs(collection(db, "posts/" + post, "reacts"));
            if (!reacts.empty) {
                console.log(reacts);
                document.getElementById("reactsnum" + post).innerText = reacts.size;
            } else { 
                document.getElementById("reactsnum" + post).innerText = 0;
            }

            //!no react ignore
            document.getElementById("react" + post).onclick = async(e) => {
                const postid = e.target.getAttribute('datacomnt-id');
                var ref = collection(db, "posts/"+postid+"/reacts");
                await addDoc(ref, { user: uid, }).then((x) => {
                    console.log(x);
                }).catch((x) => {
                    console.log(x);
                })
                document.getElementById("react" + post).style.color = "var(--love)";
                document.getElementById("reactsnum" + postid).textContent++;
            }

           
        })
    }
    else {
        console.log("no thing here");
    }
    /*
    get(child(dbRef, `posts`)).then((snapshot) => {
        postspool.innerHTML = "";
        if (snapshot.exists()) {
            console.log(snapshot.val());

    console.log(snapshot.val());
    //?featch posts
    //?show posts
            for (const post in snapshot.val()) {

                const postcomp = document.createElement("section");
                postcomp.classList.add("postcon");
                postcomp.innerHTML=`<section class="postheader">
                            <div class="sender">
                                <div class="postsenderphoto" style="background-image:url(${post_E.data().senderphoto});"></div>
                                <div class="posttimesendername">
                                    <span class="postsendername">${post_E.data().sendername}</span>
                                    <span class="posttime">${((post_E.data().time % 60000) / 1000).toFixed(0) + "s" }</span>
                                </div>
                            </div>
                            <div class="postmenu">
                                <span class="postmenuicon pointerarow" data-bs-toggle="dropdown">&#xf142;</span>
                                <div class="postmenucon position-absolute">
                                <ul class="dropdown-menu bsddm">
                                        <li><a class="dropdown-item bsddi" href="#">save</a></li>
                                        <li><a class="dropdown-item bsddi" href="#">report</a></li>
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
                        <section class="postimg">${(post_E.data().photo==undefined ? "": post_E.data().photo.map((val) =>
                        (`<div class="imglimeter">
                                <img src="${val}" alt="" width="100%"/>
                                </div>`)))}
                                
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
                                <span id="commentsnum${post}" class="postnums postcommentnum">${(post_E.data().comments ? Object.keys(post_E.data().comments).length : "0")}</span>
                            </div>
                            <div class="postcontrolbtns">
                                <span id="react${post}" class="postcontrolsicons postloveicon pointerarow"  datacomnt-id='${post}' >&#xf004;</span>
                                <span id="reactsnum${post}" class="postnums postlovenum">${(post_E.data().reacts ? Object.keys(post_E.data().reacts).length : "0")}</span>
                            </div>
                            </section>`
postspool.appendChild(postcomp);

//*post comment r/w events

document.getElementById("sendcommentbtn-small"+post).onclick=(e)=>{
    sendcomment("commentareasmall" + post, e.target.getAttribute('datacomnt-id'));
}
document.getElementById("sendcommentbtn"+post).onclick=(e)=>{
    sendcomment("commentarea" + post, e.target.getAttribute('datacomnt-id'));
}

function sendcomment(inputid,postid) { 
    const newPostRef = push(ref(getDatabase(), 'posts/' + postid + '/comments/'));
    set(newPostRef, {
        sendername: name,
        senderphoto: photo,
        text: document.getElementById(inputid).value
    });
    document.getElementById(inputid).value = "";
    document.getElementById("commentsnum" + postid).textContent++;
    
}

document.getElementById("readcommentsbtn"+post).onclick = (e) => {
    const postid = e.target.getAttribute('datacomnt-id');
    get(child(dbRef, `posts/${postid}/comments`)).then((snapshot) => {
        document.getElementById("comment" + postid).innerHTML = `
            ${(snapshot.val() == undefined ? "" : Object.keys(snapshot.val()).map((val) => (
                `<div class="comment">
                    <div class="commenthead">
                        <div class="commentprofilephoto" style="background-image:url(${snapshot.val()[val].senderphoto});"></div>
                        <span class="commentprofilename">${snapshot.val()[val].sendername}</span>
                    </div>
                    <div class="commentbody">
                        ${snapshot.val()[val].text}
                    </div>
                </div>`
            )))}`
        
    }).catch(() => {
         
    })
}

//*post rect events
                
document.getElementById("react" + post).onclick = (e) => {
    const postid = e.target.getAttribute('datacomnt-id');
    const newPostRef = push(ref(getDatabase(), 'posts/' + postid + '/reacts/'));
    set(newPostRef, {
        user: uid
    });
    document.getElementById("react" + post).style.color = "var(--love)";
    document.getElementById("reactsnum" + postid).textContent++;
}
            
            }

        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });
*/
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











// function react(postid) {

//     const auth = getAuth();


//     onAuthStateChanged(auth, (user) => {
//         if (user) {

//             const uid = user.uid;

//             set(ref(db, 'users/' + userId), Object.create(uid,1));

//         }
   
//     });

// }






/*
            <section class="postcon">
                    <section class="postheader">
                        <div class="sender">
                            <div class="postsenderphoto"></div>
                            <div class="posttimesendername">
                                <span class="postsendername">samir ahmed</span>
                                <span class="posttime">5h</span>
                            </div>
                        </div>
                        <div class="postmenu">
                            <span class="postmenuicon pointerarow" data-bs-toggle="dropdown">&#xf142;</span>
                            <div class="postmenucon position-absolute">
                                <ul class="dropdown-menu bsddm">
                                    <li><a class="dropdown-item bsddi" href="#">save</a></li>
                                    <li><a class="dropdown-item bsddi" href="#">report</a></li>
                                    <li><a class="dropdown-item bsddi" href="#">share to chat</a></li>
                                </ul>                    
                            </div>
                        </div>
                    </section>
                    <section class="posttxt">
                        <span class="entertxt">
                            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Inventore ut repellat, sint pariatur, soluta iste et iusto labore nesciunt, culpa ab consequatur ipsa quas minima eligendi rerum amet? Obcaecati, corrupti.
                        </span>
                        <span class="readmore pointerarow">
                            Read more...
                        </span>
                    </section>
                    <section class="postimg">
                        <div class="imglimeter">
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7yn8kq_YVzTYhemWw3Q3coPHgqHyfZRnP7w&usqp=CAU" alt="" width="100%">
                        </div>
                        <!-- <div class="imglimeter">
                            <img src="https://i.pinimg.com/736x/b6/4e/6e/b64e6ec02759b68a2bbad1de388940a7.jpg" alt="" width="100%">
                        </div> -->
                    </section>
                    <section class="postcomments">
                        <div class="commentscon">
                            <div id="collapseOne" class="commentscollapse collapse">
                                <div class="commentspool">
                                    <div class="comment">
                                        <div class="commenthead">
                                            <div class="commentprofilephoto"></div>
                                            <span class="commentprofilename">samer samer</span>
                                        </div>
                                        <div class="commentbody">
                                            Lorem ipsum dolor sit amet?
                                        </div>
                                    </div>
                                    <div class="comment">
                                        <div class="commenthead">
                                            <div class="commentprofilephoto"></div>
                                            <span class="commentprofilename">samer samer</span>
                                        </div>
                                        <div class="commentbody">
                                            ,?
                                        </div>
                                    </div>
                                    <div class="comment">
                                        <div class="commenthead">
                                            <div class="commentprofilephoto"></div>
                                            <span class="commentprofilename">samer samer</span>
                                        </div>
                                        <div class="commentbody">
                                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consectetur officiis, commodi laborum doloribus facilis reprehenderit nobis adipisci sunt, laboriosam hic corrupti repellendus, vitae in possimus. Numquam hic amet impedit saepe?
                                        </div>
                                    </div>
                                    <div class="comment">
                                        <div class="commenthead">
                                            <div class="commentprofilephoto"></div>
                                            <span class="commentprofilename">samer samer</span>
                                        </div>
                                        <div class="commentbody">
                                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consectetur officiis, commodi laborum doloribus facilis reprehenderit nobis adipisci sunt, laboriosam hic corrupti repellendus, vitae in possimus. Numquam hic amet impedit saepe?
                                        </div>
                                    </div>
                                </div>
                                <textarea placeholder="Comment" class="commentinputsmall pointerarow"></textarea>
                            </div>
                        </div>
                    </section>
                    <section class="postcontrols">
                        <textarea placeholder="Comment" class="commentinput pointerarow"></textarea>
                        <div data-bs-toggle="collapse" data-bs-target="#collapseOne" class="postcontrolbtns">
                            <span class="postcontrolsicons postcommenticon pointerarow">&#xf1d8;</span>
                            <span class="postnums postcommentnum">31K</span>
                        </div>
                        <div class="postcontrolbtns">
                            <span class="postcontrolsicons postloveicon pointerarow">&#xf004;</span>
                            <span class="postnums postlovenum">31K</span>
                        </div>
                    </section>
            </section>
            <section class="postcon">
                    <section class="postheader">
                        <div class="sender">
                            <div class="postsenderphoto"></div>
                            <div class="posttimesendername">
                                <span class="postsendername">samir ahmed</span>
                                <span class="posttime">5h</span>
                            </div>
                        </div>
                        <div class="postmenu">
                            <span class="postmenuicon pointerarow" data-bs-toggle="dropdown">&#xf142;</span>
                            <div class="postmenucon position-absolute">
                                <ul class="dropdown-menu bsddm">
                                    <li><a class="dropdown-item bsddi" href="#">save</a></li>
                                    <li><a class="dropdown-item bsddi" href="#">report</a></li>
                                    <li><a class="dropdown-item bsddi" href="#">share to chat</a></li>
                                </ul>                    
                            </div>
                        </div>
                    </section>
                    <section class="posttxt">
                        <span class="entertxt">
                            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Inventore ut repellat, sint pariatur, soluta iste et iusto labore nesciunt, culpa ab consequatur ipsa quas minima eligendi rerum amet? Obcaecati, corrupti.
                        </span>
                        <span class="readmore pointerarow">
                            Read more...
                        </span>
                    </section>
                    <!-- <section class="postimg">
                        <div class="imglimeter">
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7yn8kq_YVzTYhemWw3Q3coPHgqHyfZRnP7w&usqp=CAU" alt="" width="100%">
                        </div>
                        <div class="imglimeter">
                            <img src="https://i.pinimg.com/736x/b6/4e/6e/b64e6ec02759b68a2bbad1de388940a7.jpg" alt="" width="100%">
                        </div>
                    </section> -->
                    <section class="postcomments">
                        <div class="commentscon">
                            <div id="collapseOne" class="commentscollapse collapse">
                                <div class="commentspool">
                                    <div class="comment">
                                        <div class="commenthead">
                                            <div class="commentprofilephoto"></div>
                                            <span class="commentprofilename">samer samer</span>
                                        </div>
                                        <div class="commentbody">
                                            Lorem ipsum dolor sit amet?
                                        </div>
                                    </div>
                                    <div class="comment">
                                        <div class="commenthead">
                                            <div class="commentprofilephoto"></div>
                                            <span class="commentprofilename">samer samer</span>
                                        </div>
                                        <div class="commentbody">
                                            ,?
                                        </div>
                                    </div>
                                    <div class="comment">
                                        <div class="commenthead">
                                            <div class="commentprofilephoto"></div>
                                            <span class="commentprofilename">samer samer</span>
                                        </div>
                                        <div class="commentbody">
                                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consectetur officiis, commodi laborum doloribus facilis reprehenderit nobis adipisci sunt, laboriosam hic corrupti repellendus, vitae in possimus. Numquam hic amet impedit saepe?
                                        </div>
                                    </div>
                                    <div class="comment">
                                        <div class="commenthead">
                                            <div class="commentprofilephoto"></div>
                                            <span class="commentprofilename">samer samer</span>
                                        </div>
                                        <div class="commentbody">
                                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consectetur officiis, commodi laborum doloribus facilis reprehenderit nobis adipisci sunt, laboriosam hic corrupti repellendus, vitae in possimus. Numquam hic amet impedit saepe?
                                        </div>
                                    </div>
                                </div>
                                <textarea placeholder="Comment" class="commentinputsmall pointerarow"></textarea>
                            </div>
                        </div>
                    </section>
                    <section class="postcontrols">
                        <textarea placeholder="Comment" class="commentinput pointerarow"></textarea>
                        <div data-bs-toggle="collapse" data-bs-target="#collapseOne" class="postcontrolbtns">
                            <span class="postcontrolsicons postcommenticon pointerarow">&#xf1d8;</span>
                            <span class="postnums postcommentnum">31K</span>
                        </div>
                        <div class="postcontrolbtns">
                            <span class="postcontrolsicons postloveicon pointerarow">&#xf004;</span>
                            <span class="postnums postlovenum">31K</span>
                        </div>
                    </section>
            </section>
            <section class="postcon">
                    <section class="postheader">
                        <div class="sender">
                            <div class="postsenderphoto"></div>
                            <div class="posttimesendername">
                                <span class="postsendername">samir ahmed</span>
                                <span class="posttime">5h</span>
                            </div>
                        </div>
                        <div class="postmenu">
                            <span class="postmenuicon pointerarow" data-bs-toggle="dropdown">&#xf142;</span>
                            <div class="postmenucon position-absolute">
                                <ul class="dropdown-menu bsddm">
                                    <li><a class="dropdown-item bsddi" href="#">save</a></li>
                                    <li><a class="dropdown-item bsddi" href="#">report</a></li>
                                    <li><a class="dropdown-item bsddi" href="#">share to chat</a></li>
                                </ul>                    
                            </div>
                        </div>
                    </section>
                    <!-- <section class="posttxt">
                        <span class="entertxt">
                            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Inventore ut repellat, sint pariatur, soluta iste et iusto labore nesciunt, culpa ab consequatur ipsa quas minima eligendi rerum amet? Obcaecati, corrupti.
                        </span>
                        <span class="readmore pointerarow">
                            Read more...
                        </span>
                    </section> -->
                    <section class="postimg">
                        <!-- <div class="imglimeter">
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7yn8kq_YVzTYhemWw3Q3coPHgqHyfZRnP7w&usqp=CAU" alt="" width="100%">
                        </div> -->
                        <div class="imglimeter">
                            <img src="https://i.pinimg.com/736x/b6/4e/6e/b64e6ec02759b68a2bbad1de388940a7.jpg" alt="" width="100%">
                        </div>
                    </section>
                    <section class="postcomments">
                        <div class="commentscon">
                            <div id="collapseOne" class="commentscollapse collapse">
                                <div class="commentspool">
                                    <div class="comment">
                                        <div class="commenthead">
                                            <div class="commentprofilephoto"></div>
                                            <span class="commentprofilename">samer samer</span>
                                        </div>
                                        <div class="commentbody">
                                            Lorem ipsum dolor sit amet?
                                        </div>
                                    </div>
                                    <div class="comment">
                                        <div class="commenthead">
                                            <div class="commentprofilephoto"></div>
                                            <span class="commentprofilename">samer samer</span>
                                        </div>
                                        <div class="commentbody">
                                            ,?
                                        </div>
                                    </div>
                                    <div class="comment">
                                        <div class="commenthead">
                                            <div class="commentprofilephoto"></div>
                                            <span class="commentprofilename">samer samer</span>
                                        </div>
                                        <div class="commentbody">
                                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consectetur officiis, commodi laborum doloribus facilis reprehenderit nobis adipisci sunt, laboriosam hic corrupti repellendus, vitae in possimus. Numquam hic amet impedit saepe?
                                        </div>
                                    </div>
                                    <div class="comment">
                                        <div class="commenthead">
                                            <div class="commentprofilephoto"></div>
                                            <span class="commentprofilename">samer samer</span>
                                        </div>
                                        <div class="commentbody">
                                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consectetur officiis, commodi laborum doloribus facilis reprehenderit nobis adipisci sunt, laboriosam hic corrupti repellendus, vitae in possimus. Numquam hic amet impedit saepe?
                                        </div>
                                    </div>
                                </div>
                                <textarea placeholder="Comment" class="commentinputsmall pointerarow"></textarea>
                            </div>
                        </div>
                    </section>
                    <section class="postcontrols">
                        <textarea placeholder="Comment" class="commentinput pointerarow"></textarea>
                        <div data-bs-toggle="collapse" data-bs-target="#collapseOne" class="postcontrolbtns">
                            <span class="postcontrolsicons postcommenticon pointerarow">&#xf1d8;</span>
                            <span class="postnums postcommentnum">31K</span>
                        </div>
                        <div class="postcontrolbtns">
                            <span class="postcontrolsicons postloveicon pointerarow">&#xf004;</span>
                            <span class="postnums postlovenum">31K</span>
                        </div>
                    </section>
            </section>
 */