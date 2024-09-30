import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
let backend = process.env.NODE_ENV === 'development' ? 'http://localhost:4000' : '/api';
const NavLinks = ({ svg, link, text, setChatLog }) => {
  const { dispatch } = useContext(AuthContext);

  const handleClick = async (text) => {
    if (text === "Clear Conversations") setChatLog([]);
    if (text === "Log out") {
      try {
        let bearer = 'Bearer ' + window.localStorage.getItem("token");
        const response = await fetch(backend + '/misc/truncate', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': bearer
          }
        })
        let data = await response.json();
        console.log(data)
        window.localStorage.removeItem('token');
        dispatch({ type: "LOGOUT" });

      } catch (error) {
        console.log("error happen during sign out", error);
      }
    }
  };

  return (
    <Link
      to={link}
      target={link && "_blank"}
      rel="noreferrer"
      style={{ textDecoration: "none" }}
      onClick={() => handleClick(text)}
    >
      <div className="navPrompt">
        {svg}
        <p>{text}</p>
      </div>
    </Link>
  );
};

export default NavLinks;
