import {Component, EventEmitter, forwardRef, Injector, Input, OnDestroy, OnInit, Output, Provider} from '@angular/core';
import {AppComponentBase} from '@shared/common/app-component-base';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR} from '@angular/forms';
import {Subject} from '@node_modules/rxjs';
import {ISelectOption} from '@app/shared/data-common/combobox-filter/ora-select/model';
import {debounceTime, distinctUntilChanged, takeUntil} from '@node_modules/rxjs/internal/operators';
import * as _ from 'lodash';

const VALUE_ACCESSOR: Provider = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => OraKhoiLuongTpComponent),
    multi: true
};
const sourceDefault: ISelectOption[] = [
    {displayText: '1/4', value: 0.25},
    {displayText: '1/3', value: 0.33},
    {displayText: '1/2', value: 0.5},
    {displayText: '3/4', value: 0.75},
];

@Component({
    selector: 'ora-khoi-luong-tp',
    templateUrl: './ora-khoi-luong-tp.component.html',
    styleUrls: ['./ora-khoi-luong-tp.component.scss'],
    providers: [VALUE_ACCESSOR],
})
export class OraKhoiLuongTpComponent extends AppComponentBase implements OnInit, ControlValueAccessor, OnDestroy {
    $destroy: Subject<boolean> = new Subject<boolean>();
    _value = null;
    _isDisabled = false;
    isModeInput = true;
    sourceKT: ISelectOption[] = _.clone(sourceDefault);
    @Output() valueChange = new EventEmitter<number>();

    @Input() set value(v: any) {
        // abp.notify.warn('SETVALUE', v);
        this._value = v;
        if (sourceDefault.findIndex(x => x.value === v) > -1) {
            this.isModeInput = false;
        } else {
            this.isModeInput = true;
        }
    }

    get value() {
        return this._value;
    }


    @Input() set disabled(v: boolean) {
        // if (v) {
        //     this.formControl.disable();
        // } else {
        //     this.formControl.enable();
        // }
        this._isDisabled = v;
    }

    get disabled() {
        return this._isDisabled;
    }


    constructor(
        injector: Injector,
    ) {
        super(injector);
    }


    ngOnInit(): void {

    }

    onChangeValue($event: number) {
        this.valueChange.emit($event);
        this.onChange($event);
    }

    changeMode() {
        this.isModeInput = !this.isModeInput;
        this.sourceKT = _.clone(sourceDefault);
        if (this.isModeInput === false) {
            if (sourceDefault.findIndex(x => x.value === this.value) === -1) {
                this.sourceKT.push({
                    displayText: this.value,
                    value: this.value
                });
                // this._value = 0;
            }
        }
    }

    ngOnDestroy(): void {
        this.$destroy.next(true);
        this.$destroy.unsubscribe();
    }

    private onChange: Function = (v: any) => {
    };
    private onTouched: Function = () => {
    };

    onFocus(event: any): void {
        this.onTouched();
    }


    writeValue(obj: number): void {
        this.value = obj;
    }

    registerOnChange(fn: Function): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: Function): void {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }
}
