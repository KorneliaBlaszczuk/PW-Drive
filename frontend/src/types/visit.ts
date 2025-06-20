import {Service} from "./service";
import {Car} from "./car";

export interface Visit {
    createdAt: string;
    date: string;
    isReserved: boolean;
    time: string;
    car: Car;
    service: Service | undefined;
    id: number;
    comment: string;
    status: string;
}
