import { expect, test, vi } from 'vitest'
import { listings } from './listings.js'
import { auth } from "../lib/firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

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
await signOut(auth);

const testData = {
    title: "Test Title",
    price: 100,
    category: "Test Category",
    condition: "Test Condition",
    description: "This is a test description"
}

const email = "ihu@scu.edu";
const password = "testpwd";


test('Create Test without login', async () => {
    await expect(() => listings.create(testData)).rejects.toThrowError("Please sign in.")
})


test('Create Test', async () => {
    const userCred = await signInWithEmailAndPassword(auth, email, password);

    const listingId = await listings.create(testData);
    expect(listingId).toBeTypeOf('string');
    const listing = await listings.get(listingId);
    expect(listing.id).toBe(listingId);
})


test('Mark Sold Test', async () => {
    const userCred = await signInWithEmailAndPassword(auth, email, password);

    const listingId = await listings.create(testData);
    await listings.markSold(listingId);
    const listing = await listings.get(listingId);
    expect(listing.listing.status).toBe("sold");
})

test('Unpublish Test', async () => {
    const userCred = await signInWithEmailAndPassword(auth, email, password);

    const listingId = await listings.create(testData);
    await listings.unpublish(listingId);
    const listing = await listings.get(listingId);
    expect(listing.listing.status).toBe("removed");
})


test('Remove Test', async () => {
    const userCred = await signInWithEmailAndPassword(auth, email, password);

    const listingId = await listings.create(testData);
    await listings.remove(listingId);
    await expect(() => listings.get(listingId)).rejects.toThrowError("Listing not found")

})

