/****
 * Request Boards (class-based) — refactored to the new layout
 *
 * Difference from `requests.js`:
 *  - `requests.js` manages individual posts (CRUD + listen) per board.
 *  - `requestBoard.js` coordinates a board view, validates board names, and
 *    adds interactions like starting a chat with the requester.
 *
 * Firestore data model remains:
 *   requests/{boardName}/posts/{postId}
 */

import { Requests } from "./requests";
import { chatService } from "./chat";

// Canonical board list used for validation and UI pickers
export const REQUEST_BOARDS = [
  "Graham",
  "Finn",
  "Swig",
  "Dunne",
  "Campisi",
  "Sanfilippo",
  "Casa Italiana",
  "Sobrato",
  "McWalsh",
  "Nobili",
  "Off Campus",
];

export function listBoards() { return [...REQUEST_BOARDS]; }

export class RequestBoard {
  constructor(boardName) {
    if (!REQUEST_BOARDS.includes(boardName)) {
      throw new Error(`Invalid board name: ${boardName}`);
    }
    this.boardName = boardName;
    this._unsubscribe = null;
    this._requests = new Requests(boardName); // delegate to Requests API
  }

  // ---- Queries (delegated) ----
  async getRequests() {
    return this._requests.list(this.boardName);
  }

  async listen(onUpdate) {
    // stop existing listener, then subscribe via Requests
    this.stop();
    this._unsubscribe = await this._requests.listen(this.boardName, onUpdate);
    return () => this.stop();
  }

  stop() { this._unsubscribe?.(); this._unsubscribe = null; }

  // ---- Mutations (delegated) ----
  async addRequest(data) {
    return this._requests.create(data, this.boardName);
  }

  async updateRequest(postId, updates) {
    return this._requests.update(postId, updates, this.boardName);
  }

  async removeRequest(postId) {
    return this._requests.remove(postId, this.boardName);
  }

  /**
   * Create a chat with the requester for a given post and send an initial message.
   * Uses class-based ChatService. We use a synthetic listingId of `request:{postId}`
   * to satisfy chat rules that expect a string listingId.
   */
  async startChatWithRequester(postId, message) {
    // Load the post to determine requester (post owner)
    const post = await this._requests.get(postId, this.boardName);
    if (!post) throw new Error("Request not found");

    const requesterId = post.createdBy;

    // Create or reuse a chat between current user and requester
    const chatId = await chatService.startChat({
      listingId: `request:${postId}`,
      sellerId: requesterId,
    });

    if (message) {
      await chatService.sendMessage(chatId, message);
    }
    return { chatId, requesterId, post };
  }
}

// --- Optional simple function wrappers (still supported) ---
export async function getBoardRequests(boardName) {
  const board = new RequestBoard(boardName);
  return board.getRequests();
}

export async function addBoardRequest(boardName, data) {
  const board = new RequestBoard(boardName);
  return board.addRequest(data);
}

export async function removeBoardRequest(boardName, postId) {
  const board = new RequestBoard(boardName);
  return board.removeRequest(postId);
}

export async function listenBoard(boardName, onUpdate) {
  const board = new RequestBoard(boardName);
  const stop = await board.listen(onUpdate);
  return stop;
}

export async function startChatForRequest(boardName, postId, message) {
  const board = new RequestBoard(boardName);
  return board.startChatWithRequester(postId, message);
}