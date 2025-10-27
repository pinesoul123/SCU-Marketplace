import React from "react";

class Account extends React.Component {
  // If you later want to load profile data, use lifecycle methods:
  // state = { profile: null, loading: true, error: null };
  // async componentDidMount() { /* fetch profile here */ }

  render() {
    return (
      <div id="content">
        <h1>Account</h1>
      </div>
    );
  }
}

export default Account;