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
