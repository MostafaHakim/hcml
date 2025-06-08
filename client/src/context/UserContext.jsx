import React, { useEffect, useState } from "react";

function UserContext() {
  const [user, setUser] = useState([]);
  useEffect(() => {
    fetch("https://hcml-ry8s.vercel.app/user")
      .then((res) => res.json())
      .then((data) => setUser(data));
  }, []);
  console.log(user);
  return <div></div>;
}

export default UserContext;
