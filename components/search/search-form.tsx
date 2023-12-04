import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import SearchButton from './search-button';

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
      <SearchButton
        handleSubmit={() => {
          handleSubmit(onValid);
        }}
      />
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