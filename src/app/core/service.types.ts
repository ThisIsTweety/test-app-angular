export type Agents = Readonly<{
    code: string;
    name: string;
}>;

export type Items = Readonly<{
    type: string;
    id: number;
    currency: Agents;
    dateAccIn: string;
    pkind: number;
    agent: Agents;
    pointOfSale: Agents;
    attrClose: number;
    dts: Agents;
    userId: number;
    datInp: string;
    storno: number;
}>;

export type SaleReports = Readonly<{
	coun: number;
	limit: number;
	offset: number;
	hasMore: boolean;
    items: Items[];
}>;
