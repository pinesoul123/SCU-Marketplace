import "../styles/Auth.css";
import { useState } from "react";
import { auth } from "../lib/firebase";
import { useAuth } from "../lib/AuthProvider";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import Popup from "../components/Popup.jsx";

function SignInErrorPopup({render, setSignInError}) {
  if (render) {
    return (
      <Popup message="There was an error signing in." buttonMessage="Close" onClick={setSignInError(false)}/>
    )
  }
}

//Handles user authentication (sign up, sign in, sign out)
export default function Auth() {
  const { user, loading } = useAuth();
  //Local state for user input and signed-in user data
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [signInError, setSignInError] = useState(false);

  //Handles creating a new account and automatically signing in
  async function handleSignUp() {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    setUser(userCred.user);
    alert("Account created and signed in!");
  }

  //Handles logging in an existing user
  async function handleSignIn() {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    alert("Signed in!");
  }

  //Handles logging out the current user
  async function handleSignOut() {
    await signOut(auth);
    alert("Signed out!");
  }

  //below is all temporary, I just used this to get past the sign in portion when testing
  return (
    <div id="content-center">
      <SignInErrorPopup render={signInError} setSignInError={setSignInError} />
      <div id="auth-container">
        <h2>SCU Marketplace</h2>
        <div>
        <label for="email">SCU Email: </label>
        <input
          className="textbox"
          id="auth-email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br></br>
        <label for="pwd">Password: </label>
        <input
          className="textbox"
          id="auth-pwd"
          name="pwd"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        </div>

        <div>
        <button className="button" onClick={handleSignUp}>
          Sign Up
        </button>
        <button className="button red" onClick={handleSignIn}>
          Sign In
        </button>
        <button className="button red" onClick={handleSignOut}>Sign Out</button>
        </div>

        {user && (
          <p style={{ marginTop: 16 }}>
            Logged in as <strong>{user.email}</strong>
          </p>
        )}
      </div>
    </div>
  );
}