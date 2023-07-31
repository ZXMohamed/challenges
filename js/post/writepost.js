import { getFirestore, doc, setDoc, collection, addDoc, getDoc, getDocs, updateDoc, deleteDoc }
    from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
// import { user } from "../auth/signeduser.js";






// Create a new post reference with an auto-generated id
const db = getFirestore();
var ref = collection(db, "posts");




const photos = [];

const photostoupload = [];



document.getElementById("sendposbtn").onclick = async () => {
    
        await addDoc(
            ref, {
            sendername: name,
            senderphoto: photo,
            text: document.getElementById("sendposttext").value
        }
        ).then((x) => {
            console.log(x);
            //?upload
            upload(x.id, photostoupload, async () => { 
                var userref = collection(db, "users/" + uid + "/history");
                await addDoc(
                    userref, {
                    postid: x.id,
                }
                ).then((x) => {
                    console.log(x);
                }).catch((x) => {
                    console.log(x);
                })
                
                console.log("endposting");
                console.log(photos);
            });
           
        }).catch((x) => {
            console.log(x);
            //!handel errors
        })

   //&(link) => { photos.push(link) })
    

}



document.getElementById("postphotosbrowser").addEventListener("change", function () {
    let photo = document.getElementById("postphotosbrowser").files[0];

    document.getElementById("sendpostimg").innerHTML = document.getElementById("sendpostimg").innerHTML + `<div class="senderpostimg"><img id="p${photostoupload.length}" src="" width="100%"></div>`


    let filereader = new FileReader();
    filereader.readAsDataURL(photo);
    filereader.onload = function () {
        document.getElementById("p" + photostoupload.length).src = filereader.result;
        photostoupload.push(photo);
    }

})





document.getElementById("sendpostnophoto").onclick = () => {
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
            //&const x = i;
            const uploadTask = uploadBytesResumable(storageRef, file);

            await uploadTask.on('state_changed',
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
                    // A full list of error codes is available at
                    // https://firebase.google.com/docs/storage/web/handle-errors
                    switch (error.code) {
                        case 'storage/unauthorized':
                            // User doesn't have permission to access the object
                            break;
                        case 'storage/canceled':
                            // User canceled the upload
                            break;

                        // ...

                        case 'storage/unknown':
                            // Unknown error occurred, inspect error.serverResponse
                            break;
                    }
                },
                () => {
                    // Upload completed successfully, now we can get the download URL
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                        //&onend(downloadURL);

                        //? if use array
                        photos.push(downloadURL);
                    
                    
                        var postref = collection(db, "posts/" + postid + "/photo");
                        const docRef = await addDoc(
                            postref, {
                            photo: downloadURL,
                        }
                        ).then((x) => {
                            console.log(x);
                        }).catch((x) => {
                            console.log(x);
                        })

                        console.log(docRef);

                    
                        console.log('File available at', downloadURL);
                        v++;
                        if (v == files.length) {
                            //?upload links as array
                            onend();
                        }
                        //& if (x == files.length) { 
                        // &    onend();
                        // &}
                    
                    });
                }
            );
        
        }

    }
    
}


//* upload promise
/*
var theuploader = new Promise(async(s,r) => {
    const uploadTask = uploadBytesResumable(storageRef, file);


    await uploadTask.on('state_changed',
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
            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            switch (error.code) {
                case 'storage/unauthorized':
                    // User doesn't have permission to access the object
                    break;
                case 'storage/canceled':
                    // User canceled the upload
                    break;

                // ...

                case 'storage/unknown':
                    // Unknown error occurred, inspect error.serverResponse
                    break;
            }
        },
        () => {
            // Upload completed successfully, now we can get the download URL
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                //&onend(downloadURL);

                //$
                photos.push(downloadURL);
                //$

                console.log('File available at', downloadURL);

                r();
            });
        }
    );
})*/





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