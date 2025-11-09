import { db, auth } from "../lib/firebase.js";
import {
  doc, setDoc, getDoc, addDoc, collection, serverTimestamp,
  getDocs, query, where, orderBy, onSnapshot, updateDoc,
  arrayUnion, arrayRemove
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
  chatIdFor(buyerId, sellerId, listingId) {
    const [a, b] = [buyerId, sellerId].sort();
    return `${listingId}__${a}__${b}`;
  }

  // Create or reuse chat for a given listing and seller
  async startChat(listingId, sellerId) {
    const buyerId = auth.currentUser?.uid;
    if (!buyerId) throw new Error("Sign in");
    // console.log(db.collection('chats'));

    // Resolve sellerId from the listing document if not provided
    if (!sellerId) {
      try {
        const lref = doc(db, "listings", listingId);
        const lsnap = await getDoc(lref);
        if (lsnap.exists()) {
          const l = lsnap.data();
          sellerId = (
            l?.sellerId || l?.sellerID || l?.ownerId || l?.userId || l?.uid ||
            l?.seller?.id || l?.seller?.uid ||
            l?.createdBy?.id || l?.createdBy?.uid || null
          );
        }
        if (!sellerId) {
          // Try capitalized collection name fallback
          const lref2 = doc(db, "Listings", listingId);
          const lsnap2 = await getDoc(lref2);
          if (lsnap2.exists()) {
            const l2 = lsnap2.data();
            sellerId = (
              l2?.sellerId || l2?.sellerID || l2?.ownerId || l2?.userId || l2?.uid ||
              l2?.seller?.id || l2?.seller?.uid ||
              l2?.createdBy?.id || l2?.createdBy?.uid || null
            );
          }
        }
      } catch (e) {
        // ignore and fall through to error below if still undefined
      }
    }
    if (!sellerId) {
      let inspectedKeys = [];
      try {
        const lref = doc(db, "listings", listingId);
        const lsnap = await getDoc(lref);
        if (lsnap.exists()) inspectedKeys = Object.keys(lsnap.data() || {});
      } catch {}
      try {
        if (inspectedKeys.length === 0) {
          const lref2 = doc(db, "Listings", listingId);
          const lsnap2 = await getDoc(lref2);
          if (lsnap2.exists()) inspectedKeys = Object.keys(lsnap2.data() || {});
        }
      } catch {}
      throw new Error(
        `Could not determine seller for this listing. Fields seen: ${inspectedKeys.join(', ')}`
      );
    }

    if (buyerId === sellerId) {
      throw new Error("You can't message your own listing.");
    }

    const chatId = this.chatIdFor({ buyerId, sellerId, listingId });
    const ref = doc(db, "chats", chatId);
    const snap = await getDoc(ref);
    return;
    console.log(snap);

    if (!snap.exists()) {
      await setDoc(ref, {
        participants: [buyerId, sellerId],
        listingId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        closedFor: [], // array of userIds who have closed this chat
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

    // bump chat activity and reopen for the sender if needed
    const chatRef = doc(db, "chats", chatId);
    await updateDoc(chatRef, {
      updatedAt: serverTimestamp(),
      closedFor: arrayRemove(uid),
    });
  }

  // Close chat for the current user (reopenable)
  async closeForMe(chatId) {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error("Sign in");
    const chatRef = doc(db, "chats", chatId);
    await updateDoc(chatRef, {
      closedFor: arrayUnion(uid),
      updatedAt: serverTimestamp(),
    });
  }

  // Reopen chat for the current user
  async reopenForMe(chatId) {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error("Sign in");
    const chatRef = doc(db, "chats", chatId);
    await updateDoc(chatRef, {
      closedFor: arrayRemove(uid),
      updatedAt: serverTimestamp(),
    });
  }

  // Subscribe to the chat document (metadata like closed/open state)
  listenToChat(chatId, onChange) {
    const ref = doc(db, "chats", chatId);
    return onSnapshot(ref, (snap) => onChange(snap.exists() ? { id: snap.id, ...snap.data() } : null));
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

    const q = query(
      collection(db, "chats"),
      where("participants", "array_contains", uid),
      orderBy("updatedAt", "desc")
    );
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

export async function closeChatForMe(chatId) {
  return chatService.closeForMe(chatId);
}

export async function reopenChatForMe(chatId) {
  return chatService.reopenForMe(chatId);
}

export function listenToChat(chatId, onChange) {
  return chatService.listenToChat(chatId, onChange);
}