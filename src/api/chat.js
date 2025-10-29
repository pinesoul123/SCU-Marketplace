import { db, auth } from "../lib/firebase.js";
import {
  doc, setDoc, getDoc, addDoc, collection, serverTimestamp,
  getDocs, query, where, orderBy, onSnapshot
} from "firebase/firestore";

/**
 * ChatService class: encapsulates all chat logic.
 * Usage:
 *   const chatService = new ChatService();
 *   const chatId = await chatService.startChat({ listingId, sellerId });
 *   await chatService.sendMessage(chatId, "Hello!");
 */
export class ChatService {
  // Deterministic chat id builder
  chatIdFor({ buyerId, sellerId, listingId }) {
    const [a, b] = [buyerId, sellerId].sort();
    return `${listingId}__${a}__${b}`;
  }

  // Create or reuse chat for a given listing and seller
  async startChat({ listingId, sellerId }) {
    const buyerId = auth.currentUser?.uid;
    if (!buyerId) throw new Error("Sign in");

    const chatId = this.chatIdFor({ buyerId, sellerId, listingId });
    const ref = doc(db, "chats", chatId);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      await setDoc(ref, {
        participants: [buyerId, sellerId],
        listingId,
        createdAt: serverTimestamp(),
      });
    }
    return chatId;
  }

  // Send a message in an existing chat
  async sendMessage(chatId, text) {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error("Sign in");
    if (!text || !text.trim()) throw new Error("Message required");

    await addDoc(collection(db, "chats", chatId, "messages"), {
      senderId: uid,
      text: text.trim(),
      sentAt: serverTimestamp(),
    });
  }

  // Fetch all messages (ordered)
  async fetchMessages(chatId) {
    const q = query(collection(db, "chats", chatId, "messages"), orderBy("sentAt", "asc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }

  // Subscribe to messages in real time
  listenToMessages(chatId, onChange) {
    const q = query(collection(db, "chats", chatId, "messages"), orderBy("sentAt", "asc"));
    return onSnapshot(q, (snap) => {
      const msgs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      onChange(msgs);
    });
  }

  // Fetch all chats for current user
  async fetchMyChats() {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error("Sign in");

    const q = query(collection(db, "chats"), where("participants", "array_contains", uid));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
}

// Singleton instance for shared use
export const chatService = new ChatService();

// Backward-compatible function exports
export async function startChat({ listingId, sellerId }) {
  return chatService.startChat({ listingId, sellerId });
}

export async function sendMessage(chatId, text) {
  return chatService.sendMessage(chatId, text);
}

export async function fetchMessages(chatId) {
  return chatService.fetchMessages(chatId);
}

export function listenToMessages(chatId, onChange) {
  return chatService.listenToMessages(chatId, onChange);
}

export async function fetchMyChats() {
  return chatService.fetchMyChats();
}