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
                zoom: 13,
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
                .bindPopup("<b>Jesteś tutaj!</b><br>To jest przykładowe miejsce na mapie.")
                .openPopup();

            return () => {
                map.remove();
            };
        }
    }, [isLeafletLoaded]);

    return (
        <div>
            <h1>Kontakt</h1>
            {isLeafletLoaded && <div id="map" className={styles.map}></div>}
        </div>
    );
}
