import { expect, test, vi } from 'vitest'
import { getMyProfile, upsertMyProfile, uploadMyAvatar, getMyListings, getMySavedListings } from './account.js'


test('Invalid Case: Get My Profile not signed in', async () => {
    await expect(getMyProfile()).rejects.toThrowError("Not signed in");
})

test('Invalid Case: Upsert my profile not signed in', async () => {
    const updates = { email: "test@email.com" };
    await expect(upsertMyProfile(updates)).rejects.toThrowError("Not signed in");
})

test('Invalid Case: Get listings not signed in', async () => {
    await expect(getMyListings()).rejects.toThrowError("Not signed in");
})

test('Invalid Case: Get saved listings not signed in', async () => {
    await expect(getMySavedListings()).rejects.toThrowError("Not signed in");
})