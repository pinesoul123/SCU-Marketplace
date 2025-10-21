import { db, storage, auth } from "../lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

/**
 * createListing
 * @param {object} data - { title, price, category, condition, description, locationTag }
 * @param {File[]} files - up to 5 images
 * @returns {Promise<string>} new listing doc id
 */

export async function createListing(data, files = []){
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
        sellerId: user.uid,
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