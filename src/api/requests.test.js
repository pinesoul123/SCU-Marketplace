import { expect, test, vi } from 'vitest';
import { Requests } from './requests';

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

// Mocks payload 
const testPayload = {
  title: "I'm looking for a calculus textbook",
  body: "I need the MATH 11 textbook",
  category: "Books",
  locationTag: "Graham"
}





// Tests create method
test('Normal Case: Create request with normal data', async () => {
  const requests = new Requests('Graham');
  expect(await requests.create(testPayload)).toBeTypeOf('string');
})

test('Edge Case: Create request with long title and no body', async () => {
  const requests = new Requests('Finn');
  const edgeData = {
    title: 'A'.repeat(140),
    body: null
  }
  expect(await requests.create(edgeData)).toBeTypeOf('string');
})

test('Invalid Case: Create request with invalid board name throws error', async () => {
  const invalid = new Requests('invalid_board');
  await expect(invalid.create(testPayload)).rejects.toThrow('Invalid board');
})


// Tests get method
test('Normal Case: Get request by ID', async () => {
  const requests = new Requests('Graham');
  expect(await requests.get('test_doc')).toBeTypeOf('object');
})

test('Invalid Case: Get request with invalid ID returns null', async () => {
  const requests = new Requests('Graham');
  expect(await requests.get('invalid_id')).toBeNull();
})


// Tests update method
test('Normal Case: Update request without error', async () => {
  const requests = new Requests('Graham');
  await expect(requests.update('test_id')).resolves.not.toThrow();
})

test('Invalid Case: Update request with invalid board throws error', async () => {
  const requests = new Requests('Graham');
  await expect(requests.update('test_id', {}, 'invalid_board')).rejects.toThrow('Invalid board');
})


// Tests remove method
test('Normal Case: Remove request without error', async () => {
  const requests = new Requests('Graham');
  await expect(requests.remove('test_id')).resolves.not.toThrow();
})

test('Invalid Case: Remove request with invalid board throws error', async () => {
  const requests = new Requests('Graham');
  await expect(requests.remove('test_id', 'invalid_board')).rejects.toThrow('Invalid board');
})


// Tests list method
test('Normal Case: List requests', async () => {
  const requests = new Requests('Graham');
  expect(await requests.list()).toBeTypeOf('object');
})

test('Invalid Case: List requests with invalid board throws error', async () => {
  const requests = new Requests('Graham');
  await expect(requests.list('invalid_board')).rejects.toThrow('Invalid board');
})


// Tests listen method
test('Normal Case: Listen to requests', async () => {
  const requests = new Requests('Graham');
  expect(await requests.listen('Graham')).toBeTypeOf('function');
})

test('Invalid Case: Listen to requests with invalid board throws error', async () => {
  const requests = new Requests('Graham');
  await expect(requests.listen('invalid_board')).rejects.toThrow('Invalid board');
})