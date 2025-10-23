// src/api/saved.js
import { db, auth } from "../lib/firebase.js";
import { doc, setDoc, deleteDoc, getDoc, getDocs, collection } from "firebase/firestore";

const savedRef = (uid) => collection(db, "users", uid, "saved");
const savedDoc = (uid, listingId) => doc(db, "users", uid, "saved", listingId);

export async function saveListing(listingId) {
  const uid = auth.currentUser?.uid; if (!uid) throw new Error("Sign in");
  // store minimal data; listing doc holds the details
  await setDoc(savedDoc(uid, listingId), { createdAt: new Date() });
}

export async function unsaveListing(listingId) {
  const uid = auth.currentUser?.uid; if (!uid) throw new Error("Sign in");
  await deleteDoc(savedDoc(uid, listingId));
}

export async function isSaved(listingId) {
  const uid = auth.currentUser?.uid; if (!uid) return false;
  const snap = await getDoc(savedDoc(uid, listingId));
  return snap.exists();
}

export async function getSavedIds() {
  const uid = auth.currentUser?.uid; if (!uid) throw new Error("Sign in");
  const snap = await getDocs(savedRef(uid));
  return snap.docs.map(d => d.id); // array of listingIds
}

//fetch full listing docs for the saved IDs (wishlist/saved page)
import { getDoc as getDocFS, doc as docFS } from "firebase/firestore";
export async function getSavedListings() {
  const ids = await getSavedIds();
  const reads = ids.map(id => getDocFS(docFS(db, "listings", id)));
  const docs = await Promise.all(reads);
  return docs.filter(d => d.exists()).map(d => ({ id: d.id, ...d.data() }));
}