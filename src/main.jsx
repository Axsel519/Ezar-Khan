/** @format */

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

// استيراد Bootstrap أولاً
import "bootstrap/dist/css/bootstrap.min.css";

// استيراد الأنماط المخصصة
import "./style.css";

// نقطة الدخول الرئيسية للتطبيق
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
