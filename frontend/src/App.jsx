import axios from "axios";
import React, { useEffect, useState } from "react";
import { authHeader, getToken, getUser, removeLogin, saveUser } from "./auth";
import { apiUrl } from "./constant";
import KothaNavLink from "./KothaNavLink";
import KothaRoute from "./KothaRoute";

const App = () => {
  // logged in user (null => not logged in)
  let [user, setUser] = useState(getUser());

  // on page refresh check token is still valid
  useEffect(() => {
    let checkLogin = async () => {
      if (!getToken()) return;
      try {
        let result = await axios({
          url: `${apiUrl}/user/my-profile`,
          method: "get",
          headers: authHeader(),
        });
        saveUser(result.data.result);
        setUser(result.data.result);
      } catch (error) {
        // token expired or user deleted
        if (error.response?.status === 401) {
          removeLogin();
          setUser(null);
        }
      }
    };

    checkLogin();
  }, []);

  return (
    <div>
      <KothaNavLink user={user} setUser={setUser} />
      <main className="container">
        <KothaRoute user={user} setUser={setUser} />
      </main>
    </div>
  );
};

export default App;
