import { expect, test, vi } from 'vitest'
import { createListing } from './listings.js'

const testData = {
    title: "Test Title",
    price: 100,
    category: "Test Category",
    condition: "Test Condition",
    description: "This is a test description"
  }

test('Create Test', async () => {
    // const getCreateSpy = 
  expect(createListing(testData)).toBeTypeOf('object')
})


