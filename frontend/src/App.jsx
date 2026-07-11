import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import Pages
import Landing from "./pages/Landing"; 
import Scanner from "./pages/Scanner";
import AnalysisResult from "./pages/AnalysisResult"; 

export default function App() {
  return (
    <Router>
      {/* Main Container:
        Ensures the app takes up the full screen height 
      */}
      <main className="h-screen w-full bg-slate-50">
        <Routes>
          {/* 1. Landing Page (Home) */}
          <Route path="/" element={<Landing />} />

          {/* 2. Scanner Page */}
          <Route path="/scanner" element={<Scanner />} />

          {/* 3. Result Page */}
          <Route path="/result" element={<AnalysisResult />} />
        </Routes>
      </main>
    </Router>
  );
}