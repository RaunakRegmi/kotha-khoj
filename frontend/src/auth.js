// login info is saved in browser localStorage
// so user stays logged in after page refresh

export let getToken = () => {
  return localStorage.getItem("token");
};

export let getUser = () => {
  let user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export let saveLogin = (token, user) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};

export let saveUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export let removeLogin = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// header for apis that need login
export let authHeader = () => {
  return { Authorization: `Bearer ${getToken()}` };
};
