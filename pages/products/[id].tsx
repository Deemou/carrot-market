/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-void */
/* eslint-disable react/button-has-type */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { Product, User } from '@prisma/client';
import useMutation from '@libs/client/useMutation';
import cls from '@libs/client/utils';
import Layout from '@/components/layout';
import Button from '@components/button';
import client from '@/libs/server/client';

interface ProductWithUser extends Product {
  user: User;
}
interface ItemDetailResponse {
  ok: boolean;
  product: ProductWithUser;
  relatedProducts: Product[];
  isLiked: boolean;
}

const ItemDetail: NextPage<ItemDetailResponse> = (props) => {
  const router = useRouter();
  const { data, mutate } = useSWR<ItemDetailResponse>(
    `/api/products/${router.query.id}`,
    {
      fallbackData: props
    }
  );
  const [toggleFav, { loading }] = useMutation(
    `/api/products/${router.query.id}/fav`
  );
  const onFavClick = () => {
    if (!data) return;
    void mutate({ ...data, isLiked: !data.isLiked }, false);
    if (!loading) {
      toggleFav({});
    }
  };
  return (
    <Layout seoTitle="Product Detail">
      <div className="px-4  py-4">
        <div className="mb-8">
          <div className="h-96 bg-slate-300" />
          <div className="flex cursor-pointer items-center space-x-3 border-t border-b py-3">
            <div className="h-12 w-12 rounded-full bg-slate-300" />
            <div>
              <p className="text-sm font-medium">{data?.product?.user?.name}</p>
              <Link
                href={`/users/profiles/${data?.product?.user?.id}`}
                className="text-xs font-medium text-gray-500"
              >
                View profile &rarr;
              </Link>
            </div>
          </div>
          <div className="mt-5">
            <h1 className="text-3xl font-bold">{data?.product?.name}</h1>
            <span className="mt-3 block text-2xl">${data?.product?.price}</span>
            <p className=" my-6">{data?.product?.description}</p>
            <div className="flex items-center justify-between space-x-2">
              <Button large text="Talk to seller" />
              <button
                onClick={onFavClick}
                className={cls(
                  'flex items-center justify-center rounded-md p-3 hover:bg-gray-100 ',
                  data?.isLiked
                    ? 'text-red-500  hover:text-red-600'
                    : 'text-gray-400  hover:text-gray-500'
                )}
              >
                {data?.isLiked ? (
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6 "
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold">Similar items</h2>
          <div className=" mt-6 grid grid-cols-2 gap-4">
            {data?.relatedProducts?.map((product) => (
              <div key={product.id}>
                <div className="mb-4 h-56 w-full bg-slate-300" />
                <h3 className="-mb-1">{product.name}</h3>
                <span className="text-sm font-medium">${product.price}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: 'blocking'
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const id = ctx?.params?.id;
  if (!Number(id)) {
    return {
      notFound: true
    };
  }
  const product = await client.product.findUnique({
    where: {
      id: Number(id)
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true
        }
      }
    }
  });
  if (!product) {
    return {
      notFound: true
    };
  }
  const terms = product?.name.split(' ').map((word) => ({
    name: {
      contains: word
    }
  }));
  const relatedProducts = await client.product.findMany({
    where: {
      OR: terms,
      AND: {
        id: {
          not: product?.id
        }
      }
    }
  });
  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
      relatedProducts: JSON.parse(JSON.stringify(relatedProducts))
    }
  };
};

export default ItemDetail;
