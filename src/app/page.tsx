import React from "react";
import Header from "@/components/Header"
import Footer from "@/components/Footer";
import styles from '../styles/App.module.scss';

export default function Home() {
  return (
    <div className={styles.App}>
      <Header />
      <main>
        <h1>Auto servis</h1>
      </main>
      <Footer />
    </div>
  );
}
