import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { Product, User } from '@prisma/client';
import useMutation from '@libs/client/useMutation';
import Layout from '@/components/common/layout';
import client from '@/libs/server/client';
import Card from '@/components/profile/card';
import LikeButton from '@/components/common/button/like-button';
import RelatedItemSection from '@/components/product/related-item-section';
import { useSetRecoilState } from 'recoil';
import { pageTypeAtom } from '@/atoms';
import { useEffect } from 'react';

interface ProductWithUser extends Product {
  user: User;
  _count: {
    favs: number;
  };
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
  const setPageType = useSetRecoilState(pageTypeAtom);

  useEffect(() => {
    setPageType('products');
  }, [setPageType]);

  const onFavClick = () => {
    if (!data) return;
    if (!loading) {
      toggleFav({});
      mutate(
        {
          ...data,
          product: {
            ...data.product,
            _count: {
              ...data.product._count,
              favs: data.isLiked
                ? data.product._count.favs - 1
                : data.product._count.favs + 1
            }
          },
          isLiked: !data.isLiked
        },
        false
      );
    }
  };
  return (
    <Layout seoTitle="Product Detail">
      {data?.ok && (
        <div className="px-4 py-4">
          <div className="mb-10 flex justify-between space-x-10">
            <div className="w-1/2 max-w-[400px]">
              <div className="relative aspect-square">
                <Image
                  src={data.product.image}
                  alt="product"
                  fill
                  sizes="50vw"
                  priority
                  className="object-center"
                />
              </div>
            </div>

            <div className="w-1/2 space-y-6">
              <h3 className="overflow-x-hidden font-medium">
                {data.product.name}
              </h3>
              <h3>${data.product.price}</h3>
              <div className="flex items-center">
                <LikeButton onFavClick={onFavClick} isLiked={data.isLiked} />
                <span>{data.product._count.favs}</span>
              </div>
            </div>
          </div>
          <Card
            avatar={data.product.user.avatar}
            userId={data.product.user.id}
            userName={data.product.user.name}
            postId={data.product.id}
          ></Card>
          <div className="mt-5">
            <p className="my-8 overflow-x-hidden">{data.product.description}</p>
          </div>

          {data.relatedProducts.length ? (
            <RelatedItemSection relatedProducts={data.relatedProducts} />
          ) : null}
        </div>
      )}
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
  const id = Number(ctx.params?.id);
  if (!id) {
    return {
      notFound: true
    };
  }
  const product = await client.product.findUnique({
    where: { id },
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
