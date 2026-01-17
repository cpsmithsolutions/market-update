import "./App.css";
import React, { useState, useEffect, useCallback } from "react";
import Navbar from "./navbar/Navbar";
import { Redirect, Route, Switch, useHistory } from "react-router-dom";
import Search from "./search/Search";
import MarketUpdateApi from "./api/MarketUpdateApi";
import Watchlist from "./watchlist/Watchlist";
import { useDispatch, useSelector } from "react-redux";
import Login from "./auth/Login";
import SignUp from "./auth/SignUp";
import Profile from "./auth/Profile";
import ProtectedRoute from "./helpers/ProtectedRoute";
import NewsSummary from "./news/NewsSummary";
import { LOG_OUT, UPDATE_CURR_USER } from "./actions/types";
import UserContext from "./common/UserContext";
import { jwtDecode } from "jwt-decode";
import MktSummary from "./mktSummary/MktSummary";
import Delete from "./delete/Delete";

function App() {
  const dispatch = useDispatch();
  const currentUser = useSelector((store) => store.currentUser);

  const [currentToken, setCurrentToken] = useState(
    getTokenFromLocalStorage() || null
  );

  const history = useHistory();

  let updateCurrentUser = useCallback(
    async function updatingCurrentUser(currentToken) {
      try {
        if (currentToken) {
          const { username } = jwtDecode(currentToken);
          const res2 = await MarketUpdateApi.getCurrentUserData(username);
          dispatch({ type: UPDATE_CURR_USER, currentUser: res2 });
          return { success: true };
        }
      } catch (err) {
        console.error("Update current user failed", err);
        return { success: false, err };
      }
    },
    [dispatch]
  );

  useEffect(() => {
    async function loadUser() {
      MarketUpdateApi.token = currentToken;
      await updateCurrentUser(currentToken);
    }

    loadUser();
  }, [currentToken, updateCurrentUser]);

  function addTokenToLocalStorage(token) {
    localStorage.setItem("token", token);
  }
  function getTokenFromLocalStorage() {
    const res = localStorage.getItem("token");

    return res;
  }

  async function login({ username, password }) {
    try {
      const token = await MarketUpdateApi.getToken(username, password);
      setCurrentToken(() => token);
      addTokenToLocalStorage(token);
      const res = await updateCurrentUser(token);
      return res;
    } catch (err) {
      return { success: false, err };
    }
  }

  async function logOut() {
    await MarketUpdateApi.clearToken();

    dispatch({ type: LOG_OUT });
    setCurrentToken(null);
    localStorage.clear();
    history.push("/");
  }

  async function signUp(formData) {
    try {
      const res = await MarketUpdateApi.registerUser(formData);
      setCurrentToken(res);
      addTokenToLocalStorage(res);
      const res2 = updateCurrentUser(res);
      return res2;
    } catch (err) {
      console.error("Sign Up Failed", err);
      return { success: false, err };
    }
  }

  return (
    <div className="App">
      <UserContext.Provider value={{ currentUser, updateCurrentUser, logOut }}>
        <Navbar logOut={logOut} />

        <main>
          <Switch>
            <Route exact path="/">
              <MktSummary />
            </Route>
            <Route exact path="/news">
              <NewsSummary numberOfArticles="20" />
            </Route>
            <Route exact path="/watchlist">
              {<ProtectedRoute Component={Watchlist} />}
            </Route>
            <Route exact path="/login">
              <Login login={login} />
            </Route>
            <Route exact path="/search">
              <Search />
            </Route>
            <Route exact path="/signup">
              <SignUp signUp={signUp} />
            </Route>
            <Route exact path="/profile">
              <ProtectedRoute Component={Profile} />
            </Route>
            <Route exact path="/delete">
              <ProtectedRoute Component={Delete} />
            </Route>
            <Route path="*">
            <Redirect to="/"></Redirect>
            </Route>
      
          </Switch>
        </main>
      </UserContext.Provider>
    </div>
  );
}

export default App;
