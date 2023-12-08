import { Product } from '@prisma/client';

export interface ProductWithCount extends Product {
  _count: {
    favs: number;
  };
}

export interface ProductsResponse {
  ok: boolean;
  products: ProductWithCount[];
  lastPage: number;
}

interface IRecord {
  id: number;
  product: ProductWithCount;
}

export interface IRecordList {
  records: IRecord[];
}

export interface RecordListResponse {
  ok: boolean;
  records: IRecord[];
  lastPage: number;
}
