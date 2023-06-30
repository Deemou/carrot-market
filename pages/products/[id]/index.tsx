/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { Product, User } from '@prisma/client';
import useMutation from '@libs/client/useMutation';
import cls from '@libs/client/utils';
import Layout from '@/components/layout';
import Button from '@/components/button/button';
import client from '@/libs/server/client';
import Card from '@/components/profile/card';
import LikeButton from '@/components/button/like-button';

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
      {data && (
        <div className="px-4 py-4">
          <div className="mb-8">
            <div className="relative mb-10 w320:flex w320:justify-between w320:space-x-4">
              <div className="relative aspect-square w-full max-w-[256px]">
                <Image
                  src={data.product.image}
                  alt="product"
                  fill
                  sizes="50vw"
                  priority
                  className="object-center"
                />
              </div>
              <div className="w-full max-w320:mt-10 w320:max-w-[50%]">
                <h3 className="overflow-x-hidden">{data.product.name}</h3>
                <h4 className="mt-3 block">${data.product.price}</h4>
              </div>
            </div>
            <Card
              avatar={data.product.user.avatar}
              userId={data.product.user.id}
              userName={data.product.user.name}
              postType="products"
              postId={data.product.id}
            ></Card>
            <div className="mt-5">
              <p className="my-8 overflow-x-hidden">
                {data.product.description}
              </p>
              <div className="flex items-center justify-between space-x-2">
                <Button large text="Talk to seller" />
                <LikeButton onFavClick={onFavClick} isLiked={data.isLiked} />
              </div>
            </div>
          </div>
          <div>
            <h3>Similar items</h3>
            <div
              className={cls(
                'mt-6 grid grid-cols-3 gap-10 max-w640:grid-cols-2 max-w320:grid-cols-1'
              )}
            >
              {data.relatedProducts.map((product) => (
                <div key={product.id}>
                  <Link
                    href={`/products/${product.id}`}
                    className="cursor-pointer"
                  >
                    <div className="max-w-[256px]">
                      <div className="relative mb-4 aspect-square">
                        <Image
                          src={product.image}
                          alt="product"
                          fill
                          sizes="50vw"
                          priority
                          className="object-center"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span>{product.name}</span>
                        <span className="mt-1">${product.price}</span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
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
