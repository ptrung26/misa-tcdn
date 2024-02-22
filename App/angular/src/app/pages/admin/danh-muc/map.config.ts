import { OraMapModComOutput } from '@app/shared/layout-tab/ora-map-mod-com.service';

export class MapConfig {
    public defaults: OraMapModComOutput[] = [];

    public get configs(): OraMapModComOutput[] {
        return this.defaults;
    }
}
