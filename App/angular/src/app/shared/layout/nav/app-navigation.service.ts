import { PermissionCheckerService, FeatureCheckerService } from 'abp-ng2-module';

import { Injectable } from '@angular/core';
import { AppMenu } from './app-menu';
import { AppMenuItem } from './app-menu-item';
import { Menu, MenuService } from '@delon/theme';
import { AppLocalizationService } from '@app/shared/common/localization/app-localization.service';
import { AppSessionService } from '@shared/common/session/app-session.service';

@Injectable()
export class AppNavigationService {
    constructor(
        private _permissionCheckerService: PermissionCheckerService,
        private _featureCheckerService: FeatureCheckerService,
        private _appSessionService: AppSessionService,
        private _localizationService: AppLocalizationService,
        private _ngAlainMenuService: MenuService,
    ) {}

    getMenu(): AppMenu {
        // return new AppMenu('MainMenu', 'MainMenu', [
        //     new AppMenuItem('Notifications', 'Pages.Notifications', 'bell', '/app/notifications'),
        //     new AppMenuItem('Dashboard', 'Pages.Administration.Host.Dashboard', 'dashboard', '/app/admin/hostDashboard'),
        //     new AppMenuItem('Dashboard', 'Pages.Tenant.Dashboard', 'dashboard', '/app/main/dashboard'),
        //     new AppMenuItem('Tenants', 'Pages.Tenants', 'bars', '/app/admin/tenants'),
        //     new AppMenuItem('Editions', 'Pages.Editions', 'shopping', '/app/admin/editions'),
        //     new AppMenuItem('Pages_DanhMuc', 'Pages.DanhMuc', 'bars', '/app/admin/danh-muc'),
        //     new AppMenuItem('Administration', '', 'appstore', '', [
        //         new AppMenuItem('OrganizationUnits', 'Pages.Administration.OrganizationUnits', 'team', '/app/admin/organization-units'),
        //         new AppMenuItem('Roles', 'Pages.Administration.Roles', 'safety', '/app/admin/roles'),
        //         new AppMenuItem('Users', 'Pages.Administration.Users', 'user', '/app/admin/users'),
        //         new AppMenuItem('Languages', 'Pages.Administration.Languages', 'global', '/app/admin/languages'),
        //         new AppMenuItem('LanguageTexts', 'Pages.Administration.LanguageTexts', 'global', '/app/admin/languagetexts'),
        //         new AppMenuItem('AuditLogs', 'Pages.Administration.AuditLogs', 'book', '/app/admin/auditLogs'),
        //         new AppMenuItem('Maintenance', 'Pages.Administration.Host.Maintenance', 'lock', '/app/admin/maintenance'),
        //         // new AppMenuItem('Subscription', 'Pages.Administration.Tenant.SubscriptionManagement', 'flaticon-refresh', '/app/admin/subscription-management'),
        //         // new AppMenuItem('VisualSettings', 'Pages.Administration.UiCustomization', 'flaticon-medical', '/app/admin/ui-customization'),
        //         new AppMenuItem('Settings', 'Pages.Administration.Host.Settings', 'setting', '/app/admin/hostSettings'),
        //         new AppMenuItem('Settings', 'Pages.Administration.Tenant.Settings', 'setting', '/app/admin/tenantSettings'),
        //     ]),
        //     new AppMenuItem('Pages_BenhNhan', 'Pages.BenhNhan', 'user', '/app/quan-ly-benh-nhan/benh-nhan'),
        //     new AppMenuItem('Pages_LichKham', 'Pages.LichKham', 'schedule', '/app/quan-ly-lich-kham/lich-kham'),
        //     new AppMenuItem('Pages_ThietKeKhauPhan', 'Pages.ThietKeKhauPhan', 'build', '/app/thiet-ke-kp/chuyen-gia'),
        //     new AppMenuItem('Pages_ThucPham', 'Pages.ThucPham', 'coffee', '/app/quan-ly-thuc-pham/thuc-pham'),
        //     new AppMenuItem('Pages_MonAn', 'Pages.MonAn', 'ci-circle', '/app/quan-ly-mon-an/mon-an'),
        //     new AppMenuItem('Pages_NganHangThucDon', 'Pages.NganHangThucDon', 'solution', '/app/ngan-hang-thuc-don'),
        //     new AppMenuItem('Pages_DonHang', 'Pages.DonHang', 'shopping-cart', '/app/don-hang'),
        //     new AppMenuItem('Pages_CongCu', 'Pages.CongCu', 'tool', '/app/cong-cu/index'),
        //     new AppMenuItem('Pages_CauHinhHeThong', 'Pages.CauHinhHeThong', 'setting', '', [
        //         new AppMenuItem('Pages_CauHinhHeThong_NangLuongKN', 'Pages.CauHinhHeThong.NangLuongKN', 'safety', '/app/cau-hinh-ht/nhu-cau-dd/kn-dd'),
        //         new AppMenuItem('Pages_CauHinhHeThong_NhuCauDinhDuongKN', 'Pages.CauHinhHeThong.NhuCauDinhDuongKN', 'safety', '/app/cau-hinh-ht/nhu-cau-dd/kn-nl'),
        //         new AppMenuItem('Cấu hình thực đơn', 'Pages.CauHinhHeThong.NhuCauDinhDuongKN', 'safety', '/app/cau-hinh-ht/cau-hinh-td'),
        //         new AppMenuItem('Đồng bộ danh mục thực phẩm', '', 'safety', '/app/cau-hinh-ht/dong-bo-du-lieu/thuc-pham'),
        //         new AppMenuItem('Đồng bộ danh mục nhóm món ăn', '', 'safety', '/app/cau-hinh-ht/dong-bo-du-lieu/nhom-mon-an'),
        //         new AppMenuItem('Đồng bộ danh mục món ăn', '', 'safety', '/app/cau-hinh-ht/dong-bo-du-lieu/mon-an'),
        //     ]),
        // ]);

        return new AppMenu('MainMenu', 'MainMenu', [
            new AppMenuItem('Dashboard', 'Pages.Administration.Host.Dashboard', 'dashboard', '/app/admin/hostDashboard'),
            new AppMenuItem('Pages_DanhMuc', 'Pages.DanhMuc', 'bars', '', [
                new AppMenuItem('Pages_DanhMuc_TaiKhoan', 'Pages.DanhMuc.TaiKhoan', '', '/app/admin/danh-muc/dm_taikhoan'),
                new AppMenuItem('Pages_DanhMuc_TienMat', 'Pages.DanhMuc.TienMat', '', '/app/admin/danh-muc/dm_tienmat'),
            ]),
        ]);
    }

    mapToNgAlainMenu() {
        let menu = this.getMenu();
        let ngAlainRootMenu = <Menu>{
            text: this._localizationService.l(menu.name),
            group: false,
            hideInBreadcrumb: true,
            children: [],
        };
        this.generateNgAlainMenus(ngAlainRootMenu.children, menu.items);

        let ngAlainMenus = [ngAlainRootMenu];
        this._ngAlainMenuService.add(ngAlainMenus);
    }

    generateNgAlainMenus(ngAlainMenus: Menu[], appMenuItems: AppMenuItem[]) {
        appMenuItems.forEach((item) => {
            let ngAlainMenu: Menu;

            ngAlainMenu = {
                text: this._localizationService.l(item.name),
                link: item.route,
                icon: { type: 'icon', value: item.icon },
                hide: !this.showMenuItem(item),
            };

            if (item.items && item.items.length > 0) {
                ngAlainMenu.children = [];
                this.generateNgAlainMenus(ngAlainMenu.children, item.items);
            }

            ngAlainMenus.push(ngAlainMenu);
        });
    }

    checkChildMenuItemPermission(menuItem): boolean {
        for (let i = 0; i < menuItem.items.length; i++) {
            let subMenuItem = menuItem.items[i];

            if (subMenuItem.permissionName && this._permissionCheckerService.isGranted(subMenuItem.permissionName)) {
                return true;
            }

            if (subMenuItem.items && subMenuItem.items.length) {
                return this.checkChildMenuItemPermission(subMenuItem);
            } else if (!subMenuItem.permissionName) {
                return true;
            }
        }

        return false;
    }

    showMenuItem(menuItem: AppMenuItem): boolean {
        if (
            menuItem.permissionName === 'Pages.Administration.Tenant.SubscriptionManagement' &&
            this._appSessionService.tenant &&
            !this._appSessionService.tenant.edition
        ) {
            return false;
        }

        let hideMenuItem = false;

        if (menuItem.requiresAuthentication && !this._appSessionService.user) {
            hideMenuItem = true;
        }

        if (menuItem.permissionName && !this._permissionCheckerService.isGranted(menuItem.permissionName)) {
            hideMenuItem = true;
        }

        if (menuItem.hasFeatureDependency() && !menuItem.featureDependencySatisfied()) {
            hideMenuItem = true;
        }

        if (hideMenuItem && menuItem.items && menuItem.items.length) {
            return this.checkChildMenuItemPermission(menuItem);
        }

        return !hideMenuItem;
    }
}
