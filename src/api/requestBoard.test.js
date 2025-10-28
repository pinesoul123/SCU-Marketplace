import { expect, test, vi } from 'vitest';
import { RequestBoard } from './requestBoard';

// Mocks Firebase
vi.mock('../lib/firebase.js', () => ({
  db: {},
  auth: {
    currentUser: { uid: 'test_user_id' }
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

// Mocks Requests class
vi.mock('./requests', () => ({
  Requests: vi.fn(function(boardName) {
    return {
      get: vi.fn(async (id) => {
        // Returns null for nonexistent posts and mock data for valid posts
        if (id === 'nonexistent_post') return null;
        return { 
          id, 
          title: 'Test Request',
          createdBy: 'requester_user_id' 
        };
      }),
      create: vi.fn(() => Promise.resolve('test_doc')),
      update: vi.fn(),
      remove: vi.fn(),
      list: vi.fn(() => Promise.resolve([])),
      listen: vi.fn(() => Promise.resolve(() => {}))
    };
  })
}));




test('Normal Case: Start chat with requester and send message', async () => {
  const board = new RequestBoard('Graham');
  const result = await board.startChatWithRequester('test_post_id', 'Hello!');
  
  expect(result).toHaveProperty('chatId');
  expect(result).toHaveProperty('requesterId');
  expect(result).toHaveProperty('post');
})

test('Normal Case: Start chat without message', async () => {
  const board = new RequestBoard('Graham');
  const result = await board.startChatWithRequester('test_post_id');
  
  expect(result).toHaveProperty('chatId');
  expect(result).toHaveProperty('requesterId');
  expect(result).toHaveProperty('post');
})

test('Edge Case: Chat with empty message string', async () => {
  const board = new RequestBoard('Graham');
  const result = await board.startChatWithRequester('test_post_id', '');
  
  expect(result).toHaveProperty('chatId');
  expect(result).toHaveProperty('requesterId');
  expect(result).toHaveProperty('post');
})

test('Edge Case: Chat with long message', async () => {
  const board = new RequestBoard('Graham');
  const result = await board.startChatWithRequester('test_post_id', 'A'.repeat(2000));
  
  expect(result).toHaveProperty('chatId');
  expect(result).toHaveProperty('requesterId');
  expect(result).toHaveProperty('post');
})

test('Invalid Case: Chat with post ID not found throws error', async () => {
    const board = new RequestBoard('Graham');
    await expect(board.startChatWithRequester('nonexistent_post')).rejects.toThrow('Request not found');
  })