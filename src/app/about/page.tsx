import styles from './page.module.scss';

export default function About() {
    return (
        <div className={styles.aboutContainer}>
            <div className={styles.aboutText}>
                <h2>O nas</h2>
                <p>
                    W naszym serwisie samochodowym stawiamy na profesjonalizm, szybkość i najwyższą jakość obsługi.
                    Specjalizujemy się w przeglądach technicznych, naprawach mechanicznych oraz wymianie opon,
                    zapewniając kompleksową opiekę nad Twoim pojazdem.
                </p>
                <p>
                    Dzięki naszemu doświadczonemu zespołowi mechaników, którzy nieustannie podnoszą swoje kwalifikacje,
                    gwarantujemy, że każda naprawa zostanie wykonana zgodnie z najwyższymi standardami. Nasze zaawansowane
                    narzędzia diagnostyczne pozwalają szybko i precyzyjnie zidentyfikować wszelkie problemy techniczne,
                    aby jak najszybciej przywrócić Twój pojazd na drogę.
                </p>
                <p>
                    Zapraszamy do naszego serwisu – Twój samochód jest w dobrych rękach!
                </p>
            </div>
            <div>
                <img className={styles.appLogo} src='/logo_black.png' alt='App logo black' />
            </div>
        </div>
    )
}