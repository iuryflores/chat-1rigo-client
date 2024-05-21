import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";

import api from "./utils/api.utils";

import "./App.css";
import ChatComponent from "./components/Chat";
import { LoginPage } from "./views/Login";

function App() {
  const navigate = useNavigate();

  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(true);

  const [userData, setUserData] = useState({});

  const userToken = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const [loggedIn, setLoggedIn] = useState(!!userToken);

  // const createUser = async () => {
  //   const user = await response.json();
  //   setUserId(user._id);
  // };

  useEffect(() => {
    if (loggedIn) {
      const getUserData = async () => {
        try {
          const user = await api.getUserData(userId);
          setUserData(user.payLoad);
        } catch (error) {
          console.log(error);
        }
      };
      getUserData();
    } else {
      logout();
    }
  }, [userId, loggedIn]);

  const handleSignup = () => {
    setLoggedIn(false);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setLoggedIn(false);
    navigate("/login");
  };

  return (
    <div>
      <Routes>
        <Route path="/chat" element={<ChatComponent userId={userId} />} />
        <Route
          path="/login/"
          element={
            <LoginPage
              handleSignup={handleSignup}
              message={message}
              setMessage={setMessage}
              loading={loading}
              setLoading={setLoading}
              loggedIn={loggedIn}
              setLoggedIn={setLoggedIn}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
