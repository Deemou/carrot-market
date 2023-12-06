interface PostCategoryProps {
  category: string;
}

export default function PostCategory({ category }: PostCategoryProps) {
  return (
    <span className="my-3 inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-gray-800">
      {category}
    </span>
  );
}
