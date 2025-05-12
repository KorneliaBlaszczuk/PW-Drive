"use client"

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import styles from './page.module.scss';


export default function Pricing() {
    return (
        <div className={styles.pricing}>
            <div className={styles.leftContainer}>
                <h1 className={styles.name}>CENNIK</h1>
                <Table className={styles.table}>
                    <TableHeader>
                        <TableRow className={styles.tableHeaders}>
                            <TableHead className={styles.tableCell}>Usługa</TableHead>
                            <TableHead className={styles.tableCell}>Cena</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className={styles.tableBody}>
                        <TableRow>
                            <TableCell className={styles.tableCell}>Wymiana opon</TableCell>
                            <TableCell className={styles.tableCell}>60 PLN</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className={styles.tableCell}>Przegląd zwykły</TableCell>
                            <TableCell className={styles.tableCell}>100 PLN</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className={styles.tableCell}>Przegląd techniczny</TableCell>
                            <TableCell className={styles.tableCell}>120 PLN</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className={styles.tableCell}>Naprawy</TableCell>
                            <TableCell className={styles.tableCell}>Podana po usłudze</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
            <div className={styles.rightContainer}>
                <img className={styles.appLogo} src='/logo_black.png' alt='App logo black' />
            </div>
        </div >
    )
}