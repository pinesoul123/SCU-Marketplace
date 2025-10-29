import { expect, test, vi } from 'vitest';
import { ChatService } from './chat';

// Mocks Firebase auth 
vi.mock('../lib/firebase.js', () => ({
  db: {},
  auth: {
    currentUser: { uid: 'mock_user' }
  }
}));

// Mocks Firestore functions
vi.mock('firebase/firestore', () => ({
  addDoc: vi.fn(() => Promise.resolve({ id: 'mock_doc' })),
  getDoc: vi.fn((docRef) => {
    // Returns null for invalid IDs and mock data for valid IDs
    const docId = docRef?.id || 'mock_doc';
    if (docId === 'invalid_id') {
      return Promise.resolve({ exists: () => false });
    }
    return Promise.resolve({
      exists: () => true,
      id: docId,
      data: () => ({ title: 'mock_title', body: 'mock_body', category: 'mock_category' })
    });
  }),
  updateDoc: vi.fn(() => Promise.resolve()),
  deleteDoc: vi.fn(() => Promise.resolve()),
  getDocs: vi.fn(() => Promise.resolve({ docs: [] })),
  collection: vi.fn(() => ({ id: 'collection' })),
  doc: vi.fn((db, ...path) => ({ 
    id: path[path.length - 1] || 'mock_doc',	// id is the last element of parameter path or mock_doc
    path: path 
  })),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  limit: vi.fn(),
  onSnapshot: vi.fn(() => vi.fn()),
  serverTimestamp: vi.fn(() => Date.now())
}));

const testChatServiceData = {
  buyerId: "test_buyer_id",
  listingId: "test_listing_id",
  sellerId: "test_seller_id"
}

const testChatData = {
  listingId: "test_listing_id",
  sellerId: "test_seller_id"
}


test('Normal Case: Start chat with normal data', async () => {
  const chatService = new ChatService(testChatServiceData);
  expect(await chatService.startChat(testChatData)).toBeTypeOf('string');
})

test('Edge Case: Start chat with empty listing ID', async () => {
  const chatService = new ChatService(testChatServiceData);
  expect(await chatService.startChat({listingId: '', sellerId: 'test_seller_id'})).toBeTypeOf('string');
})

test('Edge Case: Start chat with empty seller ID', async () => {
  const chatService = new ChatService(testChatServiceData);
  expect(await chatService.startChat({listingId: 'test_listing_id', sellerId: ''})).toBeTypeOf('string');
})

test('Invalid Case: Send message with empty text', async () => {
  const chatService = new ChatService(testChatServiceData);
  await expect(chatService.sendMessage('test_chat_id', '')).rejects.toThrow('Message required');
})

test('Invalid Case: Fetch message with invalid chat ID', async () => {
  const chatService = new ChatService(testChatServiceData);
  await expect(chatService.fetchMessages(123)).toBeTypeOf('object');
})