export type Agent = Readonly<{
    code: string;
    name: string;
}>;

export type Item = Readonly<{
    type: string;
    id: number;
    currency: Agent;
    dateAccIn: string;
    pkind: number;
    agent: Agent;
    pointOfSale: Agent;
    attrClose: number;
    dts: Agent;
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
