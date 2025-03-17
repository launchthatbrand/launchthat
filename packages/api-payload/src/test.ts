import { createCaller, createTRPCContext } from "./index";

// Simple test function to verify that our tRPC router is working
async function testPayloadApi() {
  try {
    // Create a context with headers and no session
    const context = await createTRPCContext({
      headers: new Headers(),
      session: null,
    });

    // Create a caller with the context
    const caller = createCaller(context);

    console.log("Testing Payload API integration...");

    // Test the users list endpoint
    console.log("Fetching users...");
    const users = await caller.payload.users.list({
      pagination: { page: 1, limit: 10 },
    });

    console.log(`Found ${users.totalCount} users`);

    // Log the first few users
    if (users.users && users.users.length > 0) {
      console.log("First user:", users.users[0]);
    } else {
      console.log("No users found");
    }

    console.log("Test completed successfully!");
  } catch (error) {
    console.error("Test failed with error:", error);
  }
}

// Run the test
testPayloadApi();
