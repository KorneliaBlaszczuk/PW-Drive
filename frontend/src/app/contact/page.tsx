"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.scss";

export default function Contact() {
    const [isLeafletLoaded, setLeafletLoaded] = useState(false);
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    useEffect(() => {
        if (typeof window !== "undefined") {
            setLeafletLoaded(true);
        }
    }, []);

    useEffect(() => {
        async function fetchCompanyInfo() {
            try {
                const response = await fetch('http://localhost:8080/api/metadata/info', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch company info');
                }

                const data = await response.json();

                if (data?.address && data?.email && data?.phoneNumber) {
                    setAddress(data.address);
                    setPhone(data.phoneNumber);
                    setEmail(data.email);
                }

            } catch (error) {
                console.error('Error fetching company info:', error);
            }
        }

        fetchCompanyInfo();
    }, []);

    // sposób kodowania współrzędnych do przemyślenia w przypadku rozbudowania projektu 
    useEffect(() => {
        async function loadMap() {
            if (!isLeafletLoaded || !address) return;

            const L = require("leaflet");

            const cachedCoords = localStorage.getItem("coords");

            let lat: number, lon: number;

            if (cachedCoords) {
                const parsed = JSON.parse(cachedCoords);
                lat = parsed.lat;
                lon = parsed.lon;
            } else {
                try {
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
                    );
                    const data = await response.json();

                    if (!data[0]) throw new Error("Nie znaleziono lokalizacji");

                    lat = parseFloat(data[0].lat);
                    lon = parseFloat(data[0].lon);

                    localStorage.setItem("coords", JSON.stringify({ lat, lon }));
                } catch (err) {
                    console.error("Błąd geokodowania:", err);
                    return;
                }
            }

            const map = L.map("map", {
                center: [lat, lon],
                zoom: 15,
            });

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

            const customIcon = L.icon({
                iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
            });

            const marker = L.marker([lat, lon], { icon: customIcon }).addTo(map);
            marker.bindPopup("<b>Tutaj jesteśmy!</b>").openPopup();

            return () => map.remove();
        }

        loadMap();
    }, [isLeafletLoaded, address]);


    return (
        <div className={styles.container}>
            <div className={styles.contactInfo}>
                <div className={styles.infoItem}>
                    <img src="https://img.icons8.com/ios/50/000000/phone.png" alt="Telefon" className={styles.icon} />
                    <p>{phone}</p>
                </div>
                <div className={styles.infoItem}>
                    <img src="https://img.icons8.com/ios/50/000000/mail.png" alt="Email" className={styles.icon} />
                    <p>{email}</p>
                </div>
                <div className={styles.infoItem}>
                    <img src="https://img.icons8.com/ios/50/000000/map-marker.png" alt="Ulica" className={styles.icon} />
                    <p>{address}</p>
                </div>
            </div>

            {isLeafletLoaded && <div id="map" className={styles.map}></div>}
        </div>
    );
}
