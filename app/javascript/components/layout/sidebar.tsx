import React from "react";

class SideBar extends React.Component {
  render() {
    return (
      <div className="sidebar" style={{float: "left"}}>
        <a href="/"> <h1 style={{textAlign: "center", color: "#0d0000"}}> Ai Experiments </h1> </a>
      </div>
    );
  }
}

export default SideBar;