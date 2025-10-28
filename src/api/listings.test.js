import { expect, test, vi } from 'vitest'
import { listings } from './listings.js'
import { auth } from "../lib/firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";


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
        sellerID: auth.currentUser.uid,
        title: "mock_title",
        price: 420,
        category: "mock_category",
        condition: "mock_condition",
        description: "mock_description",
        locationTag: "mock_location",
        status: "active",
        savedCount: 0,
      })
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

/*
Listings Test
Cases
- User not logged in & attempt create listing - throw Error
User logged in
- Create Listing - return String and check if get exists
- Mark Sold - check if listing.status is sold
- Unpublish - check if listing.status is removed
- Remove - check if get throws error
*/


const testData = {
    title: "Test Title",
    price: 100,
    category: "Test Category",
    condition: "Test Condition",
    description: "This is a test description"
}


test('Normal Case: Create Listing', async () => {
    const listingId = await listings.create(testData);
    expect(listingId).toBeTypeOf('string');
})

test('Normal Case: Get Listing by ID', async () => {
    const listing = await listings.get("mock_doc");
    expect(listing.id).toBe("mock_doc");
})

test('Invalid Case: Get Listing with invalid ID throws error', async () => {
        await expect(() => listings.get("invalid_id")).rejects.toThrowError("Listing not found")

})


test('Normal Case: Mark existing listing as sold', async () => {
    await expect(listings.markSold('test_id')).resolves.not.toThrow();
})

test('Invalid Case: Mark invalid listing as sold', async () => {
    await expect(() => listings.markSold("invalid_id")).rejects.toThrowError("Listing not found")
})

test('Normal Case: Unpublish existing listing', async () => {
    await expect(listings.unpublish('test_id')).resolves.not.toThrow();
})

test('Invalid Case: Unpublish invalid listing', async () => {
    await expect(() => listings.unpublish("invalid_id")).rejects.toThrowError("Listing not found")
})


test('Normal Case: Remove existing listing', async () => {
    await expect(listings.remove('test_id')).resolves.not.toThrow();
})

test('Invalid Case: Remove invalid listing', async () => {
    await expect(() => listings.remove("invalid_id")).rejects.toThrowError("Listing not found")
})

