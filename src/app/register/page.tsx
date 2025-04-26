import styles from './page.module.scss';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"


export default function Register() {
    return (
        <div className={styles.RegisterContainer}>
            <div className={styles.RightBox}></div>
            <div className={styles.RegisterLeft}>
                <Input className={styles.Input} placeholder="imię" />
                <Input className={styles.Input} placeholder="nazwisko" />
                <Input className={styles.Input} placeholder="login" />
                <Input className={styles.Input} placeholder="hasło" type="password" />
                <Input className={styles.Input} placeholder="ponów hasło" type="password" />
                <Button className={styles.LeftButton}>Zarejestuj</Button>
            </div>
            <div className={styles.RegisterRight}>
                <h1>Witaj z powrotem!</h1>
                <p>Masz juz konto?</p>
                <Button className={styles.RightButton} variant="outline">Zaloguj się!</Button>
            </div>
        </div>
    )
}