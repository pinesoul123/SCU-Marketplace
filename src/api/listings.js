export async function createListing(data, files = []){
    // Lazy-load firebase bindings only when this function is called
    const { auth, db, storage } = await import("../lib/firebase.js");
    const { addDoc, collection, serverTimestamp } = await import("firebase/firestore");
    const { ref, uploadBytes, getDownloadURL } = await import("firebase/storage");
    
    const user = auth.currentUser;
    if (!user) throw new Error("Please sign in.");

    //upload images
    const photoURLs = [];
    //Loop through the first 5 elements of files, or an empty array if files is null/undefined.
    for (const f of (files || []).slice(0,5)){
        const path = `listing_photos/${user.uid}/${Date.now()}_${f.name}`;  //create path to file in firebase storage
        const fileRef = ref(storage, path); 
        await uploadBytes(fileRef, f); //upload to storage
        photoURLs.push(await getDownloadURL(fileRef)); //get public URL
    }

    //Write Firestore Doc
    const payload = {
        sellerID: user.uid,
        title: String(data.title || "").trim().slice(0, 120),
        price: Number(data.price || 0),
        category: data.category || null,
        condition: data.condition || null, //quality of item
        description: String(data.description || "").trim().slice(0,100),
        locationTag: data.locationTag || null,
        photoURLs,
        status: "active",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "listings"), payload);
    return docRef.id;
}