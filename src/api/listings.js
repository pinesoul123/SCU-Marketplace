export async function createListing(data, files = []){
    // Lazy-load firebase bindings only when this function is called
    const { auth, db, storage } = await import("../lib/firebase.js");
    const { addDoc, collection, serverTimestamp } = await import("firebase/firestore");
    const { ref, uploadBytes, getDownloadURL } = await import("firebase/storage");
    
    const user = auth.currentUser;
    if (!user) throw new Error("Please sign in.");

    //upload images
    const photoURLs = [];
    const photoPaths = [];
    //Loop through the first 5 elements of files, or an empty array if files is null/undefined.
    for (const f of (files || []).slice(0,5)){
        const path = `listing_photos/${user.uid}/${Date.now()}_${f.name}`;  //create path to file in firebase storage
        const fileRef = ref(storage, path); 
        await uploadBytes(fileRef, f, { contentType: f.type });
        photoPaths.push(path);
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
        photoPaths,
        status: "active",
        savedCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "listings"), payload);
    return docRef.id;
}

// --- Soft-close a listing ---
/**
 * markListingSold
 * @param {string} listingId - Firestore doc id in `listings`
 * Marks the listing as "sold" (or use "pending") without deleting data.
 * Only the seller can perform this (enforced by Firestore rules).
 */
export async function markListingSold(listingId) {
    const { auth, db } = await import("../lib/firebase.js");
    const { doc, getDoc, updateDoc, serverTimestamp } = await import("firebase/firestore");

    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error("Please sign in.");

    const ref = doc(db, "listings", listingId);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw new Error("Listing not found");
    const data = snap.data();
    if (data.sellerID !== uid) throw new Error("You can only update your own listing.");

    await updateDoc(ref, { status: "sold", updatedAt: serverTimestamp() });
}

// --- Hard delete a listing ---
/**
 * removeListing
 * @param {string} listingId - Firestore doc id in `listings`
 * @param {{ deletePhotos?: boolean }} [opts]
 * Deletes the listing document. If `deletePhotos` is true, also deletes
 * any Storage files referenced by `photoURLs`. Only the seller can delete.
 */
export async function removeListing(listingId, opts = {}) {
    const { auth, db, storage } = await import("../lib/firebase.js");
    const { doc, getDoc, deleteDoc } = await import("firebase/firestore");
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error("Please sign in.");

    const ref = doc(db, "listings", listingId);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw new Error("Listing not found");
    const data = snap.data();
    if (data.sellerID !== uid) throw new Error("You can only delete your own listing.");

  await deleteDoc(ref);
}