import ReactDOM from "react-dom"
import React from "react";
import PdfList from "./components/pdfs/pdf_list"; 

document.addEventListener("DOMContentLoaded", () => {
  const rootEl = document.getElementById("pdf-home");
  const pdfs = JSON.parse(rootEl.getAttribute("data"));
  ReactDOM.render(<PdfList pdfs={pdfs} />, rootEl);
});
  