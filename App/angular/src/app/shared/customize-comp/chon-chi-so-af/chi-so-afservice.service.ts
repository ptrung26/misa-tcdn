import {Injectable} from '@angular/core';

export enum CHI_SO_AF {
    A_1_3 = 1,
    A_1_6,
    A_1_8,
    A_2,
    B_1_6,
    B_1_8,
    B_2,
}
@Injectable({
    providedIn: 'root',
})
export class ChiSoAFServiceService {

    constructor() {
    }

    convertChiSoAFtoValue(chiSoAF: CHI_SO_AF): number {
        switch (chiSoAF) {
            case CHI_SO_AF.A_1_3:
                return 1.3;
            case CHI_SO_AF.A_1_6:
                return 1.6;
            case CHI_SO_AF.A_1_8:
                return 1.8;
            case CHI_SO_AF.A_2:
                return 2;
            case CHI_SO_AF.B_1_6:
                return 1.6;
            case CHI_SO_AF.B_1_8:
                return 1.8;
            case CHI_SO_AF.B_2:
                return 2;
            default:
                return 0;
        }
    }

    getTyLeChatSinhNL(chiSoAF: CHI_SO_AF) {
        const heSoAF = this.convertChiSoAFtoValue(chiSoAF);
        if (heSoAF === 1.6) {
            return {
                beo: 23,
                dam: 16,
                botDuong: 61
            };
        } else if (heSoAF === 1.8) {
            return {
                beo: 23,
                dam: 15,
                botDuong: 62
            };
        } else if (heSoAF === 2) {
            return {
                beo: 23,
                dam: 14,
                botDuong: 63
            };
        }
        return undefined;
    }
}
