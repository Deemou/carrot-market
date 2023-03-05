import { NextPage } from 'next';
import Link from 'next/link';
import matter from 'gray-matter';
import { readdirSync, readFileSync } from 'fs';
import Layout from '@components/layout';

interface Post {
  title: string;
  date: string;
  category: string;
  slug: string;
}

const Blog: NextPage<{ posts: Post[] }> = ({ posts }) => {
  return (
    <Layout seoTitle="Blog">
      <h1 className="mt-5 mb-10 text-center text-xl font-semibold ">
        Latest Posts
      </h1>
      {posts.map((post, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={index} className="mb-5">
          <Link href={`/blog/${post.slug}`}>
            <span className="text-lg text-red-500">{post.title}</span>
            <div>
              <span className="">
                {post.date} / {post.category}
              </span>
            </div>
          </Link>
        </div>
      ))}
    </Layout>
  );
};

export function getStaticProps() {
  const blogPosts = readdirSync('./posts').map((file) => {
    const content = readFileSync(`./posts/${file}`, 'utf-8');
    const slug = file.split('.')[0];
    return { ...matter(content).data, slug };
  });
  return {
    props: {
      posts: blogPosts.reverse()
    }
  };
}

export default Blog;
