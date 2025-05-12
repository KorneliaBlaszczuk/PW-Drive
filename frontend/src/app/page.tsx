import styles from '../styles/App.module.scss';

export default function Home() {
  return (
    <div className={styles.App}>
      <main className={styles.AppContent}>
        <div className={styles.HomeLeft}>
          <h1>Warsztat XXX</h1>
          <ul className={styles.Offer}>
            <li><img className={styles.Icons} src="https://img.icons8.com/ios/50/maintenance--v1.png" alt="maintenance--v1" />Naprawy</li>
            <li><img className={styles.Icons} src="https://img.icons8.com/ios/50/inspection.png" alt="inspection" />Przeglądy</li>
            <li><img className={styles.Icons} src="https://img.icons8.com/badges/48/tire.png" alt="tire" />Wymiana opon</li>
          </ul>
        </div>
        <img className={styles.HomeRight} src="/auto.png" />
      </main>
    </div>
  );
}
