import { auth } from "../lib/firebase";
import {
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signOut, onAuthStateChanged, updateProfile
} from "firebase/auth";

export const signUp = (email, pw) => createUserWithEmailAndPassword(auth, email, pw);
export const signIn = (email, pw) => signInWithEmailAndPassword(auth, email, pw);
export const logout = () => signOut(auth);
export const onUser = (cb) => onAuthStateChanged(auth, cb);
export const setDisplayName = (name) => updateProfile(auth.currentUser, { displayName: name });