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
      <h3 className="mb-10 mt-5 text-center">Latest Posts</h3>
      {posts.map((post) => (
        <div key={post.title} className="mb-5">
          <Link href={`/blog/${post.slug}`}>
            <h3 className="text-red-500">{post.title}</h3>
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
