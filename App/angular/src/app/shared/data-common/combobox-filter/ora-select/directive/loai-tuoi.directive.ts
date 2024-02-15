import { Directive, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import {
    ISelectOption,
    ISelectOptions,
    SelectOptions
} from '@app/shared/data-common/combobox-filter/ora-select/model';
import {GIOI_TINH, LOAI_LAO_DONG, LOAI_THOI_GIAN} from '@shared/service-proxies/service-proxies';

@Directive({
  selector: '[dirLoaiTuoi]',
  providers: [
    {
      provide: SelectOptions,
      useExisting: LoaiTuoiDirective
    }
  ]
})
export class LoaiTuoiDirective implements ISelectOptions {
  options$ = of<ISelectOption[]>([]);

  constructor() {
    this.options$ = this.getDataSourceFromServer();
  }

  getDataSourceFromServer(): Observable<ISelectOption[]> {
    return of<ISelectOption[]>([
        { value: LOAI_THOI_GIAN.THANG, displayText: 'Tháng tuổi' },
        { value: LOAI_THOI_GIAN.NAM, displayText: 'Tuổi' },
    ]);
  }

}
