import ReactDOM from "react-dom"
import React from "react";
import SideBar from "./components/layout/sidebar"; 

document.addEventListener("DOMContentLoaded", () => {
  const rootEl = document.getElementById("application-layout");
  ReactDOM.render(<SideBar />, rootEl);
});
  