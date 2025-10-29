import { auth, db, storage } from "../lib/firebase";
import {
  doc, getDoc, setDoc, updateDoc, deleteDoc, collection, query, where, getDocs
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

/** Load the signed-in user's profile document (users/{uid}). */
export async function getMyProfile() {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("Not signed in");
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? { id: uid, ...snap.data() } : { id: uid };
}

export async function getMyRole() {
  const uid = auth.currentUser?.uid;
  if (!uid) return {};
  const snap = await getDoc(doc(db, "roles", uid));
  return snap.exists() ? snap.data() : {};
}

/** Returns true if the signed-in user has admin privileges. */
export async function isAdmin() {
  const role = await getMyRole();
  return role?.admin === true;
}

/** Returns true if user has a specific capability flag or is admin. */
export async function hasCap(capName) {
  const role = await getMyRole();
  return role?.admin === true || role?.[capName] === true;
}

/** Convenience: can this user moderate listings (or is admin)? */
export async function canModerateListings() {
  return await hasCap("canModerateListings");
}

/** Throw if the signed-in user is not admin (useful for guarding admin-only actions). */
export async function requireAdmin() {
  if (!(await isAdmin())) throw new Error("Admin privileges required");
}

/** Create or update profile fields for the signed-in user. */
export async function upsertMyProfile(updates) {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("Not signed in");
  await setDoc(doc(db, "users", uid), updates, { merge: true });
}

/** Upload a profile photo and persist its URL in users/{uid}. */
export async function uploadMyAvatar(file) {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("Not signed in");
  const path = `profiles/${uid}/${Date.now()}_${file.name}`;
  const fileRef = ref(storage, path);
  await uploadBytes(fileRef, file);
  const url = await getDownloadURL(fileRef);
  await upsertMyProfile({ photoURL: url, avatarPath: path });
  return { url, path };
}

/** Optional: remove current avatar file if you stored avatarPath. */
export async function deleteMyAvatar() {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("Not signed in");
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return;
  const { avatarPath } = snap.data() || {};
  if (avatarPath) await deleteObject(ref(storage, avatarPath));
  await upsertMyProfile({ photoURL: null, avatarPath: null });
}

/** Get listings created by the signed-in user. */
export async function getMyListings() {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("Not signed in");
  const q = query(collection(db, "listings"), where("sellerID", "==", uid));
  const snaps = await getDocs(q);
  return snaps.docs.map(d => ({ id: d.id, ...d.data() }));
}

/** fetch saved listing docs. */
export async function getMySavedListings() {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("Not signed in");
  const savedQ = query(collection(db, "users", uid, "saved"));
  const savedSnaps = await getDocs(savedQ);
  const ids = savedSnaps.docs.map(d => d.id);
  if (!ids.length) return [];
  const reads = ids.map(id => getDoc(doc(db, "listings", id)));
  const docs = await Promise.all(reads);
  return docs.filter(d => d.exists()).map(d => ({ id: d.id, ...d.data() }));
}