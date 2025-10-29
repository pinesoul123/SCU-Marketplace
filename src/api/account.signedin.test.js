import { expect, test, vi } from 'vitest'
import { getMyProfile, upsertMyProfile, uploadMyAvatar, getMyListings, getMySavedListings } from './account.js'

// Mocks Firebase auth 
vi.mock('../lib/firebase.js', () => ({
  db: {},
  auth: {
    currentUser: { uid: 'mock_user' }
  },
  storage: {}
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
      data: () => ({ 
        id: "mock_user"
      })
    });
  }),
  setDoc: vi.fn(() => Promise.resolve()),
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


test('Normal Case: Get My Profile', async () => {
    const data = await getMyProfile();
    expect(data.id).toBe('mock_user');
})

test('Normal Case: Upsert my profile', async () => {
    const updates = { email: "test@email.com" };
    await expect(upsertMyProfile(updates)).resolves.not.toThrow();
})

test('Normal Case: Get listings', async () => {
    await expect(getMyListings()).resolves.not.toThrow();
})

test('Normal Case: Get saved listings', async () => {
    await expect(getMySavedListings()).resolves.not.toThrow();
})