"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.scss";

export default function Contact() {
    const [isLeafletLoaded, setLeafletLoaded] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setLeafletLoaded(true);
        }
    }, []);

    useEffect(() => {
        if (isLeafletLoaded) {
            const L = require("leaflet");

            const map = L.map("map", {
                center: [52.219068, 21.011937],
                zoom: 10,
            });

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

            const customIcon = L.icon({
                iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
            });

            const marker = L.marker([52.219068, 21.011937], { icon: customIcon }).addTo(map);

            marker
                .bindPopup("<b>Tutaj jesteśmy!</b>")
                .openPopup();

            return () => {
                map.remove();
            };
        }
    }, [isLeafletLoaded]);

    return (
        <div className={styles.container}>
            <div className={styles.contactInfo}>
                <div className={styles.infoItem}>
                    <img src="https://img.icons8.com/ios/50/000000/phone.png" alt="Telefon" className={styles.icon} />
                    <p>+48 123 456 789</p>
                </div>
                <div className={styles.infoItem}>
                    <img src="https://img.icons8.com/ios/50/000000/mail.png" alt="Email" className={styles.icon} />
                    <p>kontakt@example.com</p>
                </div>
                <div className={styles.infoItem}>
                    <img src="https://img.icons8.com/ios/50/000000/map-marker.png" alt="Ulica" className={styles.icon} />
                    <p>Warszawa, Nowowiejska 15/19</p>
                </div>
            </div>

            {isLeafletLoaded && <div id="map" className={styles.map}></div>}
        </div>
    );
}
