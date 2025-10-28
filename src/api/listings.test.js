import { expect, test, vi } from 'vitest'
import { listings } from './listings.js'
import { auth } from "../lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

const testData = {
    title: "Test Title",
    price: 100,
    category: "Test Category",
    condition: "Test Condition",
    description: "This is a test description"
}

const email = "ihu@scu.edu";
const password = "testpwd";

const userCred = await signInWithEmailAndPassword(auth, email, password);

test('Create Test', async () => {
    const data = await listings.create(testData);
    expect(data).toBeTypeOf('string');
})


