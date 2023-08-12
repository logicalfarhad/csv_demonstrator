import React from "react";
import NavLinksContainer from "./NavLinksContainer";
import CSVUpload from "./CSVUpload";

const NavContent = ({ chatLog, setChatLog }) => {
  return (
    <>
      <CSVUpload />
      <NavLinksContainer chatLog={chatLog} setChatLog={setChatLog} />
    </>
  );
};

export default NavContent;