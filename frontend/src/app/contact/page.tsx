"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.scss";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Contact() {
    const [isLeafletLoaded, setLeafletLoaded] = useState(false);
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [isAdmin, setAdmin] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [tempData, setTempData] = useState({ address: '', email: '', phoneNumber: '' });
    const [mapKey, setMapKey] = useState(0);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setLeafletLoaded(true);
        }
    }, []);

    useEffect(() => {
        const role = sessionStorage.getItem('role');
        if (role == "WORKSHOP") {
            setAdmin(true);
        }
    }, []);

    useEffect(() => {
        async function fetchCompanyInfo() {
            try {
                let response;

                if (isAdmin) {
                    response = await fetch('http://localhost:8080/api/metadata/info-full', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                        },
                    });
                } else {
                    response = await fetch('http://localhost:8080/api/metadata/info', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                }

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

    const handleEdit = () => {
        setTempData({ address, email, phoneNumber: phone });
        setIsEditing(true);
    };

    const handleCancel = () => {
        setPhone(tempData.phoneNumber);
        setEmail(tempData.email);
        setAddress(tempData.address);
        setIsEditing(false);
    };

    const handleSave = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/metadata/1', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    address,
                    email,
                    phoneNumber: phone,
                }),
            });

            if (!response.ok) throw new Error('Błąd zapisu');

            setIsEditing(false);
            setMapKey(prev => prev + 1);

        } catch (err) {
            console.error('Błąd podczas zapisu:', err);
        }
    };



    // sposób kodowania współrzędnych do przemyślenia w przypadku rozbudowania projektu 
    useEffect(() => {
        async function loadMap() {
            if (!isLeafletLoaded || !address) return;

            const L = require("leaflet");

            const existingMap = L.DomUtil.get("map");
            if (existingMap != null && existingMap._leaflet_id != null) {
                existingMap._leaflet_id = null;
            }


            let lat: number, lon: number;

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
    }, [isLeafletLoaded, address, mapKey]);


    return (
        <div className={styles.container}>
            <div className={styles.contactInfo}>
                <div className={styles.infoItem}>
                    <img src="https://img.icons8.com/ios/50/000000/phone.png" alt="Telefon" className={styles.icon} />
                    {isEditing ? (
                        <Input
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    ) : (
                        <p>{phone}</p>
                    )}
                </div>
                <div className={styles.infoItem}>
                    <img src="https://img.icons8.com/ios/50/000000/mail.png" alt="Email" className={styles.icon} />
                    {isEditing ? (
                        <Input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    ) : (
                        <p>{email}</p>
                    )}
                </div>
                <div className={styles.infoItem}>
                    <img src="https://img.icons8.com/ios/50/000000/map-marker.png" alt="Ulica" className={styles.icon} />
                    {isEditing ? (
                        <Input
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    ) : (
                        <p>{address}</p>
                    )}
                </div>
                {isAdmin && !isEditing && (
                    <img
                        onClick={handleEdit}
                        style={{ cursor: 'pointer' }}
                        width="20"
                        height="20"
                        src="https://img.icons8.com/ios/50/edit--v1.png"
                        alt="edit--v1"
                    />
                )}
                {isAdmin && isEditing && (
                    <div className={styles.buttonGroup}>
                        <Button onClick={handleSave} className={styles.saveButton}>Zapisz</Button>
                        <Button onClick={handleCancel} className={styles.cancelButton}>Anuluj</Button>
                    </div>
                )}

            </div>

            {isLeafletLoaded && <div id="map" className={styles.map}></div>}
        </div>
    );
}
