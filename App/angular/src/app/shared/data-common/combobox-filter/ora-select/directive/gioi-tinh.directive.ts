import { Directive, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import {
    ISelectOption,
    ISelectOptions,
    SelectOptions
} from '@app/shared/data-common/combobox-filter/ora-select/model';
import {GIOI_TINH, LOAI_LAO_DONG} from '@shared/service-proxies/service-proxies';

@Directive({
  selector: '[dirGioiTinh]',
  providers: [
    {
      provide: SelectOptions,
      useExisting: GioiTinhDirective
    }
  ]
})
export class GioiTinhDirective implements ISelectOptions {
  options$ = of<ISelectOption[]>([]);

  constructor() {
    this.options$ = this.getDataSourceFromServer();
  }

  getDataSourceFromServer(): Observable<ISelectOption[]> {
    return of<ISelectOption[]>([
      { value: GIOI_TINH.Nam, displayText: 'Nam' },
      { value: GIOI_TINH.Nu, displayText: 'Nữ' },
    ]);
  }

}
