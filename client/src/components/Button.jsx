import React from "react";

const Button = ({ text, handleClick }) => {
  return (
    <button id="loginButton" className="button-primary" onClick={handleClick}>
      {text}
    </button>
  );
};

export default Button;
