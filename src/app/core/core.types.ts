export type EntityType = Readonly<{
    code: string;
    name: string;
}>;

export type TableConfig = Readonly<{
    column: string;
    field: string;
    isEditable: boolean;
}>;

export type Agent = Readonly<{
    agents: EntityType[];
}>;

export type Item = Readonly<{
    type: string;
    id: number;
    currency: EntityType;
    dateAccIn: string;
    pkind: number;
    agent: EntityType;
    pointOfSale: EntityType;
    attrClose: number;
    dts: EntityType;
    userId: number;
    datInp: string;
    storno: number;
}>;

export type SaleReports = Readonly<{
	coun: number;
	limit: number;
	offset: number;
	hasMore: boolean;
    items: Item[];
}>;

export enum FilterType {
    DATE = "DATE",
    POINT_OF_SALE = "POINT_OF_SALE",
    AGENT = "AGENT",
    DTS = "DTS"
}
