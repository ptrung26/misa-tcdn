import {Component, OnInit, Input} from '@angular/core';

@Component({
    selector: 'box-nang-luong',
    templateUrl: './box-nang-luong.component.html',
    styleUrls: ['./box-nang-luong.component.scss']
})
export class BoxNangLuongComponent implements OnInit {
    currentNumber = 0;
    oldNumber = 0;
    @Input() nangLuong: number;
    @Input() header = 'Năng lượng';

    constructor() {
    }


    ngOnInit(): void {

    }

    onCoutoEnd() {
    }
}
