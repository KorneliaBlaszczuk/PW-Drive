'use client'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import styles from './page.module.scss';
import {useEffect} from "react";
import {router} from "next/client";
import {useRouter} from "next/navigation";


export default function Book() {
    const router = useRouter();

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (!token) {
            router.push('/logIn');
        }
    }, []);

    return (
        <div className={styles.BookPage}>
            <Select>
                <SelectTrigger className={styles.Select}>
                    <SelectValue placeholder="Wybierz swoje auto" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="auto1">Auto1</SelectItem>
                    <SelectItem value="auto2">Auto2</SelectItem>
                    <SelectItem value="auto3">Auto3</SelectItem>
                </SelectContent>
            </Select>
            <Select>
                <SelectTrigger className={styles.Select}>
                    <SelectValue placeholder="Wybierz usługę" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="naprawa">Naprawa</SelectItem>
                    <SelectItem value="wymiana_opon">Wymiana opon</SelectItem>
                    <SelectItem value="przegląd">Przegląd</SelectItem>
                </SelectContent>
            </Select>
            <h1>Najblisze dostępne wizyty:</h1>
        </div>
    )
}