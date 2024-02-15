export class MenuConfig {
    public defaults: OraMenu[] = [
        new OraMenu('Danh mục chuyên môn', '', '', [
            new OraMenuItem({
                key: 'chuyen-mon/dinh-duong',
                title: 'Pages_DanhMuc_DinhDuong',
                permission: 'Pages.DanhMuc.DinhDuong',
            }),
            new OraMenuItem({
                key: 'chuyen-mon/nhom-dd',
                title: 'Pages_DanhMuc_NhomDD',
                permission: 'Pages.DanhMuc.NhomDD',
            }),
            new OraMenuItem({
                key: 'chuyen-mon/nhom-ma',
                title: 'Pages_DanhMuc_NhomMA',
                permission: 'Pages.DanhMuc.NhomMA',
            }),
            new OraMenuItem({
                key: 'chuyen-mon/nhom-tp',
                title: 'Pages_DanhMuc_NhomTP',
                permission: 'Pages.DanhMuc.NhomTP',
            }),
            new OraMenuItem({
                key: 'chuyen-mon/quan-ly-gigl',
                title: 'Pages_DanhMuc_GIGL',
                permission: 'Pages.DanhMuc.GIGL',
            }),
        ]),
        new OraMenu('Danh mục hành chính', '', '', [
            new OraMenuItem({
                key: 'dia-chinh/tinh',
                title: 'Pages_DanhMuc_Tinh',
                iconSrc: 'icon-danh-muc/map.svg',
                permission: 'Pages.DanhMuc.Tinh',
            }),
            new OraMenuItem({
                key: 'dia-chinh/huyen',
                title: 'Pages_DanhMuc_Huyen',
                iconSrc: 'icon-danh-muc/map.svg',
                permission: 'Pages.DanhMuc.Huyen',
            }),
            new OraMenuItem({
                key: 'dia-chinh/xa',
                title: 'Pages_DanhMuc_Xa',
                iconSrc: 'icon-danh-muc/map.svg',
                permission: 'Pages.DanhMuc.Xa',
            }),
        ]),
    ];

    public get configs(): OraMenu[] {
        return this.defaults;
    }
}

export class OraMenu {
    title: string;
    iconSrc: string;
    permission?: string;
    child?: OraMenuItem[];

    get totalItem(): number {
        return this.child.length;
    }

    constructor(title: string, iconSrc?: string, permission?: string, child?: OraMenuItem[]) {
        this.title = title;
        this.iconSrc = iconSrc;
        this.permission = permission;
        this.child = child ? child : [];
    }
}

export class OraMenuItem {
    key: string;
    title: string;
    permission?: string;
    iconSrc?: string;

    constructor(val: OraMenuItem) {
        this.key = val.key;
        this.title = val.title;
        this.permission = val.permission;
        this.iconSrc = val.iconSrc;
    }
}
