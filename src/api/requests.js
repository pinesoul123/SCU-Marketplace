/**
 * src/api/requests.js
 *
 * Class-based local API focused on **individual request posts**.
 * Path: requests/{boardName}/posts/{postId}
 *
 * Difference vs RequestBoard:
 *  - This file manages single posts (create/read/update/delete/listen).
 *  - RequestBoard groups posts by board and adds chat integration.
 */

import { REQUEST_BOARDS } from "./requestBoard";

export class Requests {
  constructor(defaultBoard = null) {
    this.defaultBoard = defaultBoard;
    this._fsExports = null;
  }

  // --- internals ---
  _validateBoard(boardName) {
    const b = boardName ?? this.defaultBoard;
    if (!b) throw new Error("Board name is required");
    if (!REQUEST_BOARDS.includes(b)) throw new Error(`Invalid board: ${b}`);
    return b;
  }

  async _env() {
    const { db, auth } = await import("../lib/firebase.js");
    const fs = await import("firebase/firestore");
    return { db, auth, fs };
  }

  async _ensureFs() {
    if (!this._fsExports) {
      const { fs } = await this._env();
      this._fsExports = fs;
    }
    return this._fsExports;
  }

  _postsCol(db, boardName) {
    const { collection } = this._fsExports || {};
    if (!collection) throw new Error("Firestore not initialized yet");
    return collection(db, "requests", boardName, "posts");
  }

  // --- CRUD ---

  /** Create a new request post under a board. */
  async create(data, boardName = null) {
    const { db, auth } = await this._env();
    if (!auth.currentUser) throw new Error("Please sign in.");
    const { addDoc, serverTimestamp } = await this._ensureFs();

    const board = this._validateBoard(boardName);
    const col = this._postsCol(db, board);

    const payload = {
      title: String(data.title || "").trim().slice(0, 140),
      body: data.body ? String(data.body).trim().slice(0, 2000) : null,
      category: data.category || null,
      locationTag: data.locationTag || null,
      createdBy: auth.currentUser.uid,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(col, payload);
    return docRef.id;
  }

  /** Read a single request post. */
  async get(id, boardName = null) {
    const { db } = await this._env();
    const { doc, getDoc } = await this._ensureFs();
    const board = this._validateBoard(boardName);
    const ref = doc(db, "requests", board, "posts", id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() };
  }

  /** Update a request post (owner-only enforced by rules). */
  async update(id, updates, boardName = null) {
    const { db } = await this._env();
    const { doc, updateDoc, serverTimestamp } = await this._ensureFs();
    const board = this._validateBoard(boardName);
    const ref = doc(db, "requests", board, "posts", id);
    await updateDoc(ref, { ...updates, updatedAt: serverTimestamp() });
  }

  /** Delete a request post. */
  async remove(id, boardName = null) {
    const { db } = await this._env();
    const { doc, deleteDoc } = await this._ensureFs();
    const board = this._validateBoard(boardName);
    const ref = doc(db, "requests", board, "posts", id);
    await deleteDoc(ref);
  }

  // --- Queries & listeners ---

  /** List posts under a board with optional filters. */
  async list(boardName = null, opts = {}) {
    const { db } = await this._env();
    const { query, where, orderBy, limit, getDocs } = await this._ensureFs();
    const board = this._validateBoard(boardName);
    const col = this._postsCol(db, board);

    const clauses = [orderBy("createdAt", "desc")];
    if (opts.category) clauses.push(where("category", "==", opts.category));
    if (opts.createdBy) clauses.push(where("createdBy", "==", opts.createdBy));
    if (opts.limit) clauses.push(limit(Number(opts.limit)));

    // Build query progressively
    let q = query(col, ...clauses);
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }

  /** Real-time listener; returns unsubscribe() */
  async listen(boardName = null, onUpdate, opts = {}) {
    const { db } = await this._env();
    const { query, where, orderBy, limit, onSnapshot } = await this._ensureFs();
    const board = this._validateBoard(boardName);
    const col = this._postsCol(db, board);

    const clauses = [orderBy("createdAt", "desc")];
    if (opts.category) clauses.push(where("category", "==", opts.category));
    if (opts.createdBy) clauses.push(where("createdBy", "==", opts.createdBy));
    if (opts.limit) clauses.push(limit(Number(opts.limit)));

    const q = query(col, ...clauses);
    const unsub = onSnapshot(q, (snap) => {
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      onUpdate(items);
    });
    return unsub;
  }
}

// Singleton for convenience
export const requests = new Requests();

// --- Function wrappers (optional, match class behavior) ---
export async function addRequest(boardName, data) {
  return requests.create(data, boardName);
}

export async function getRequest(boardName, id) {
  return requests.get(id, boardName);
}

export async function updateRequest(boardName, id, updates) {
  return requests.update(id, updates, boardName);
}

export async function removeRequest(boardName, id) {
  return requests.remove(id, boardName);
}

export async function listRequests(boardName, opts = {}) {
  return requests.list(boardName, opts);
}

export async function listenRequests(boardName, onUpdate, opts = {}) {
  return requests.listen(boardName, onUpdate, opts);
}