import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

interface SearchFormProps {
  searchUrl: string;
}

interface ISearchForm {
  query: string;
}

export default function SearchForm({ searchUrl }: SearchFormProps) {
  const router = useRouter();
  const { q } = router.query;
  const { register, setValue, handleSubmit } = useForm<ISearchForm>();

  useEffect(() => {
    if (q) setValue('query', q?.toString());
  }, [q, setValue]);

  const onValid = ({ query }: ISearchForm) => {
    router.push(`${searchUrl}?q=${query}`);
  };

  return (
    <form
      onSubmit={handleSubmit(onValid)}
      className="relative w-5/12 max-w640:w-9/12 max-w480:w-8/12"
    >
      <svg
        onClick={handleSubmit(onValid)}
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute right-2 top-1 h-8 w-8 cursor-pointer fill-black"
      >
        <path
          fillRule="evenodd"
          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
          clipRule="evenodd"
        ></path>
      </svg>
      <input
        type="text"
        required
        {...register('query', { required: true, minLength: 2 })}
        placeholder="검색어를 입력해주세요."
        className="w-full rounded-xl"
      />
    </form>
  );
}
