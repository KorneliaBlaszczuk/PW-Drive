import jsPDF from "jspdf";
import { loadFontBase64 } from "./loadFontBase64";
import type { Visit } from "@/types/visit";
import type {Repair} from "@/types/repairs";

export const generateVisitReport = async (visit: Visit): Promise<void> => {
    const doc = new jsPDF();

    const robotoBase64 = await loadFontBase64("/fonts/robotoBase64.txt");

    const response = await fetch(`http://localhost:8080/api/visits/${visit.id}/repairs`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
    });

    const repairs: Repair[] = response.ok ? await response.json() : [];

    doc.addFileToVFS("Roboto-Regular.ttf", robotoBase64);
    doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
    doc.setFont("Roboto");

    doc.setFontSize(24);
    doc.text("Raport wizyty", 20, 20);
    const timeWithoutSeconds = visit.time.slice(0, 5);
    doc.text(`z ${visit.date} ${timeWithoutSeconds}`, 20, 30);

    doc.setFontSize(18);
    doc.text("Informacje o samochodzie: ", 20, 50);

    doc.setFontSize(12);
    if (visit.car) {
        doc.text(`nazwa: ${visit.car.name}`, 20, 60);
        doc.text(`marka: ${visit.car.brand}`, 20, 70);
        doc.text(`model: ${visit.car.model}`, 20, 80);
        doc.text(`rocznik: ${visit.car.year}`, 20, 90);
        doc.text(`przebieg: ${visit.car.mileage}`, 20, 100);
        doc.text(`nastepny przeglad: ${visit.car.nextInspection}`, 20, 110);
    } else {
        doc.text("Brak danych o samochodzie", 12, 60);
    }

    const startY = 130;
    doc.setFontSize(18);
    doc.text("Naprawy i usługa:", 20, startY);

    let y = startY + 10;
    doc.setFontSize(12);
    doc.text("Opis", 20, y);
    doc.text("Cena (PLN)", 150, y);
    doc.line(10, y + 2, 200, y + 2);
    y += 10;

    let totalCost = 0;

    if (visit.service) {
        doc.text(`[Usługa] ${visit.service.name}`, 20, y);
        doc.text(visit.service.price.toFixed(2), 150, y);
        totalCost += visit.service.price;
        y += 10;
    }

    if (repairs.length === 0) {
        doc.text("Brak napraw dla tej wizyty", 20, y);
        y += 10;
    } else {
        repairs.forEach((repair) => {
            doc.text(repair.description, 20, y);
            doc.text(repair.price.toFixed(2), 150, y);
            totalCost += repair.price;
            y += 10;
        });
    }

    doc.setFontSize(12);
    doc.setLineWidth(0.5);
    doc.line(10, y + 2, 200, y + 2);
    doc.setFontSize(14);
    doc.text("Suma:", 20, y + 12);
    doc.text(`${totalCost.toFixed(2)} PLN`, 150, y + 12);

    y += 50;

    doc.setFontSize(18);
    doc.text("Komentarz:", 20, y);
    doc.setFontSize(12);
    doc.text(visit.comment || "Brak komentarza do wizyty", 20, y + 10);

    doc.save(`raport_wizyty_${visit.id}.pdf`);
};
