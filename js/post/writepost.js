import { getFirestore, doc, setDoc, collection, addDoc, getDoc, getDocs, updateDoc, deleteDoc }
    from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";







const db = getFirestore();
var ref = collection(db, "posts");




const photos = [];

let photostoupload = [];

const sendbtn = document.getElementById("sendposbtn");

sendbtn.onclick = async () => {
    sendbtn.innerText = "Sending...";
        await addDoc(
            ref, {
            sendername: name,
            senderphoto: photo,
            text: document.getElementById("sendposttext").value
        }
        ).then((x) => {

            upload(x.id, photostoupload, async () => { 
                var userref = collection(db, "users/" + uid + "/history");
                await addDoc(
                    userref, {
                    postid: x.id,
                }
                ).then((x) => {
                
                    sendbtn.innerHTML = "";
                }).catch((x) => {
                
                })
                
                console.log("endposting");
                console.log(photos);
            });
           
        }).catch((x) => {

        })

    

}



document.getElementById("postphotosbrowser").addEventListener("change", function () {
    let photo = document.getElementById("postphotosbrowser").files[0];

    if (photo) {
        let filereader = new FileReader();
        filereader.readAsDataURL(photo);
        filereader.onload = function () {
            photostoupload.push(photo);
            document.getElementById("sendpostimg").innerHTML += `<div class="senderpostimg"><img id="p${photostoupload.length}" src="" width="100%"></div>`
            document.getElementById("p" + photostoupload.length).src = filereader.result;
        }
    }

})





document.getElementById("sendpostnophoto").onclick = () => {
    photostoupload = [];
    document.getElementById("sendpostimg").innerHTML = "";
}












import { getStorage, ref as cref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";

const storage = getStorage();

async function upload(postid, files, onend) {
    let i = 0;
    let v = 0;
    if (files.length == 0) { onend() } else {
        for (const file of files) {
            const storageRef = cref(storage, 'post/images/' + postid + i);
            i++;
            const uploadTask = uploadBytesResumable(storageRef, file);

            await uploadTask.on('state_changed',
                (snapshot) => {

                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                        case 'paused':
                            
                            break;
                        case 'running':
                        
                            break;
                    }
                },
                (error) => {
                   
                    switch (error.code) {
                        case 'storage/unauthorized':
                     
                            break;
                        case 'storage/canceled':
                           d
                            break;

                        // ...

                        case 'storage/unknown':
                           
                            break;
                    }
                },
                async() => {
                    
                    await getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                       
                        
                        photos.push(downloadURL);
                    
                    
                        var postref = collection(db, "posts/" + postid + "/photo");
                        const docRef = await addDoc(
                            postref, {
                            photo: downloadURL,
                        }
                        ).then((x) => {
                        
                        }).catch((x) => {
                        
                        })

                        console.log(docRef);

                    
                        console.log('File available at', downloadURL);
                        v++;
                        if (v == files.length) {
                           
                            onend();
                        }
                    });
                }
            );
        
        }

    }
    
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

});