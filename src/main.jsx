import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

import AOS from 'aos';
import 'aos/dist/aos.css';

AOS.init({
  duration: 1500,       // animation duration
  once: true,          // only animate once
  offset: 100,         // offset (in px) from the original trigger point
});


ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
