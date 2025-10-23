import { useState } from "react";
import { auth } from "../lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

//Handles user authentication (sign up, sign in, sign out)
export default function Auth() {
  //Local state for user input and signed-in user data
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  //Handles creating a new account and automatically signing in
  async function handleSignUp() {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    setUser(userCred.user);
    alert("Account created and signed in!");
  }

  //Handles logging in an existing user
  async function handleSignIn() {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    setUser(userCred.user);
    alert("Signed in!");
  }

  //Handles logging out the current user
  async function handleSignOut() {
    await signOut(auth);
    setUser(null);
    alert("Signed out!");
  }

  //below is all temporary, I just used this to get past the sign in portion when testing
  return (
    <div style={{ padding: 24 }}>
      <h1>Auth Page</h1>
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: "block", marginBottom: 8 }}
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: "block", marginBottom: 8 }}
      />

      <button onClick={handleSignUp} style={{ marginRight: 8 }}>
        Sign Up
      </button>
      <button onClick={handleSignIn} style={{ marginRight: 8 }}>
        Sign In
      </button>
      <button onClick={handleSignOut}>Sign Out</button>

      {user && (
        <p style={{ marginTop: 16 }}>
          Logged in as <strong>{user.email}</strong>
        </p>
      )}
    </div>
  );
}