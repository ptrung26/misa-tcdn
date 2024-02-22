import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import {NgSelectModule} from '@ng-select/ng-select';
import { DataCommonService } from '@app/shared/data-common/data-common.service';
import { CustomizeCompModule } from '@app/shared/customize-comp/customize-comp.module';
import { SHARED_ZORRO_MODULES } from '@shared/shared-zorro.module';
import { componentsEx } from './componentsEx';

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, ...SHARED_ZORRO_MODULES, CustomizeCompModule],
    declarations: [...componentsEx],
    exports: [...componentsEx],
    providers: [DataCommonService],
})
export class DataCommonModule {}
