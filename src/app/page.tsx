import React from "react";
import Header from "@/components/Header"
import Footer from "@/components/Footer";
import styles from '../styles/App.module.scss';
// import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

export default function Home() {
  return (
    // <Router>
    <div className={styles.App}>
      <Header />
      <main>
        <h1>Auto servis</h1>
        {/* <Routes>
            <Route path="/" element={<Home />} />
          </Routes> */}
      </main>
      <Footer />
    </div>
    // </Router>
  );
}
