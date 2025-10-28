// Class-based Listings service with backward-compatible function exports.
// Keeps lazy imports and same validations/permissions as before.

export class Listings {
  // Helper: check if current user has roles/{uid}.admin == true
  async _isCurrentUserAdmin() {
    const { auth, db } = await import("../lib/firebase.js");
    const { doc, getDoc } = await import("firebase/firestore");
    const uid = auth.currentUser?.uid;
    if (!uid) return false;
    const ref = doc(db, "roles", uid);
    console.log(4.5);
    const snap = await getDoc(ref);
    console.log(4.7);
    if (!snap.exists()) throw new Error("Role not found");
    return !!(snap.exists() && snap.data()?.admin === true);
  }

  // Create a new listing (uploads up to 5 photos)
  async create(data, files = []) {
    const { auth, db, storage } = await import("../lib/firebase.js");
    const { addDoc, collection, serverTimestamp } = await import("firebase/firestore");
    const { ref, uploadBytes, getDownloadURL } = await import("firebase/storage");

    const user = auth.currentUser;
    if (!user) throw new Error("Please sign in.");

    // Upload images (max 5)
    const photoURLs = [];
    const photoPaths = [];
    for (const f of (files || []).slice(0, 5)) {
      const path = `listing_photos/${user.uid}/${Date.now()}_${f.name}`;
      const fileRef = ref(storage, path);
      await uploadBytes(fileRef, f, { contentType: f.type });
      photoPaths.push(path);
      photoURLs.push(await getDownloadURL(fileRef));
    }

    // Write Firestore doc
    const payload = {
      sellerID: user.uid,
      title: String(data.title || "").trim().slice(0, 120),
      price: Number(data.price || 0),
      category: data.category || null,
      condition: data.condition || null,
      description: String(data.description || "").trim().slice(0, 100),
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

  // Soft-close a listing by marking it sold
  async markSold(listingId) {
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

  // Hard delete a listing (optionally remove Storage photos)
  async remove(listingId, opts = {}) {
    const { auth, db, storage } = await import("../lib/firebase.js");
    const { doc, getDoc, deleteDoc } = await import("firebase/firestore");
    const { ref: storageRef, deleteObject } = await import("firebase/storage");

    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error("Please sign in.");

    const ref = doc(db, "listings", listingId);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw new Error("Listing not found");
    const data = snap.data();

    const isOwner = data.sellerID === uid;
    const isAdmin = await this._isCurrentUserAdmin();
    if (!isOwner && !isAdmin) throw new Error("Only the seller or an admin can delete this listing.");

    if (opts.deletePhotos && Array.isArray(data.photoPaths) && data.photoPaths.length) {
      const deletions = data.photoPaths.map((p) => {
        try { return deleteObject(storageRef(storage, p)); } catch { return Promise.resolve(); }
      });
      await Promise.allSettled(deletions);
    }

    await deleteDoc(ref);
  }

  // Soft remove: set status = "removed"
  async unpublish(listingId) {
    const { auth, db } = await import("../lib/firebase.js");
    const { doc, getDoc, updateDoc, serverTimestamp } = await import("firebase/firestore");

    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error("Please sign in.");

    const ref = doc(db, "listings", listingId);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw new Error("Listing not found");
    const data = snap.data();

    const isOwner = data.sellerID === uid;
    const isAdmin = await this._isCurrentUserAdmin();
    if (!isOwner && !isAdmin) throw new Error("Only the seller or an admin can unpublish this listing.");

    await updateDoc(ref, { status: "removed", updatedAt: serverTimestamp() });
  }

  async get(listingId) {
    const { auth, db } = await import("../lib/firebase.js");
    const { doc, getDoc, updateDoc, serverTimestamp } = await import("firebase/firestore");

    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error("Please sign in.");

    const ref = doc(db, "listings", listingId);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw new Error("Listing not found");
    return {id: listingId, listing: snap.data()};
  }
}

// Singleton instance for convenience
export const listings = new Listings();

// Backward-compatible named exports so existing imports keep working
export async function createListing(data, files = []) {
  return listings.create(data, files);
}

export async function markListingSold(listingId) {
  return listings.markSold(listingId);
}

export async function removeListing(listingId, opts = {}) {
  return listings.remove(listingId, opts);
}

export async function unpublishListing(listingId) {
  return listings.unpublish(listingId);
}