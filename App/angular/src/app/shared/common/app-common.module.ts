import { ModuleWithProviders, NgModule } from '@angular/core';
import { AppLocalizationService } from '@app/shared/common/localization/app-localization.service';
import { AppNavigationService } from '@app/shared/layout/nav/app-navigation.service';
import { AbpZeroTemplateCommonModule } from '@shared/common/common.module';
import { UtilsModule } from '@shared/utils/utils.module';
import { AppAuthService } from './auth/app-auth.service';
import { AppRouteGuard } from './auth/auth-route-guard';
import { TimeZoneComboComponent } from './timing/timezone-combo.component';
import { SharedModule } from '@shared/shared.module';
import { DateTimeService } from './timing/date-time.service';
import { CallbackPipe } from './pipes/call-back.pipe';
import { ConvertDdFrom100gTpPipe } from './pipes/convert-dd-from100g-tp.pipe';
import { TyLeAsynPipe } from './pipes/ty-le-asyn.pipe';
import { IsTenantSpecialPipe } from './pipes/is-tenant-special.pipe';

@NgModule({
    imports: [
        SharedModule,
        UtilsModule,
        AbpZeroTemplateCommonModule,
    ],
    declarations: [
        TimeZoneComboComponent,
        CallbackPipe,
        IsTenantSpecialPipe,
    ],
  exports: [
    TimeZoneComboComponent,
    CallbackPipe,
    IsTenantSpecialPipe,
  ],
    providers: [
        AppLocalizationService,
        AppNavigationService,
        DateTimeService,
    ],
})
export class AppCommonModule {
    static forRoot(): ModuleWithProviders<AppCommonModule> {
        return {
            ngModule: AppCommonModule,
            providers: [
                AppAuthService,
                AppRouteGuard,
            ],
        };
    }
}
