// src/api/chat.js
import { db, auth } from "../lib/firebase.js";
import {
  doc, setDoc, getDoc, addDoc, collection, serverTimestamp,
  getDocs, query, where, orderBy, onSnapshot
} from "firebase/firestore";

//Chat id per buyer+seller+listing so we don't create duplicates 
function chatIdFor({ buyerId, sellerId, listingId }) {
  const [a, b] = [buyerId, sellerId].sort(); // deterministic order
  return `${listingId}__${a}__${b}`;
}

//Create (or reuse) a chat for this listing and seller (returns chatId)
export async function startChat({ listingId, sellerId }) {
  const buyerId = auth.currentUser?.uid;
  if (!buyerId) throw new Error("Sign in");

  //generate chat ID
  const chatId = chatIdFor({ buyerId, sellerId, listingId });
  const ref = doc(db, "chats", chatId);
  const snap = await getDoc(ref);

  //check if chat ID already exists, if not create chatroom
  if (!snap.exists()) {
    await setDoc(ref, {
      participants: [buyerId, sellerId],
      listingId,
      createdAt: serverTimestamp(),
    });
  }
  return chatId;
}

//Send a message in an existing chat 
export async function sendMessage(chatId, text) {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("Sign in");
  if (!text || !text.trim()) throw new Error("Message required");

  //create & store document for each message
  await addDoc(collection(db, "chats", chatId, "messages"), {
    senderId: uid,
    text: text.trim(),
    sentAt: serverTimestamp(),
  });
}

//retrieve all messages in the order of the timestamp
export async function fetchMessages(chatId) {
    const q = query(
    collection(db, "chats", chatId, "messages"),
    orderBy("sentAt", "asc")
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() })); //return JS array
}

//Live subscription to messages (automatic page updates) 
// Returns an unsubscribe() function — call this when the user closes the chat
export function listenToMessages(chatId, onChange) {
  const q = query(
    collection(db, "chats", chatId, "messages"),
    orderBy("sentAt", "asc")
  );
  return onSnapshot(q, (snap) => {
    const msgs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    onChange(msgs);
  });
}

// Lists existing chats for current user (latest first if createdAt exists) 
export async function fetchMyChats() {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("Sign in");

  const q = query(
    collection(db, "chats"),
    where("participants", "array_contains", uid)
    //add orderBy("createdAt","desc") after indexes are set up
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}