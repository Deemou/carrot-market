import { useRouter } from 'next/router';
import {
  ChangeEvent,
  KeyboardEvent,
  MouseEvent,
  useEffect,
  useRef,
  useState
} from 'react';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';
import { useRecoilValue } from 'recoil';
import { pageTypeAtom } from '@/atoms';
import cls from '@/libs/client/utils';
import SearchButton from './search-button';
import { ProductsResponse } from '@/types/product';

interface ISearchForm {
  query: string;
}

export default function SearchForm() {
  const router = useRouter();
  const { q } = router.query;
  const { register, setValue, handleSubmit } = useForm<ISearchForm>();
  const [searchWord, setSearchWord] = useState('');
  const pageType = useRecoilValue(pageTypeAtom);
  const searchUrl = `/${pageType}/search`;
  const [isListVisible, setIsListVisible] = useState(false);
  const [isNavigationKeyPressed, setIsNavigationKeyPressed] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);

  const { data } = useSWR<ProductsResponse>(
    searchWord ? `/api/products/search?q=${searchWord}` : null
  );

  const isOpenSearchList = isListVisible && data && data?.products?.length > 0;

  const onFormBlur = () => {
    if (!isNavigationKeyPressed) setIsListVisible(false);
    else setIsNavigationKeyPressed(false);
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsListVisible(true);
    setSearchWord(e.currentTarget.value);
  };
  const onInputClick = () => {
    setIsListVisible(true);
  };
  const onInputKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (!data?.products) return;

    if (e.key === 'Tab' || e.key === 'ArrowDown') {
      e.preventDefault();
      setIsNavigationKeyPressed(true);
      setSelectedIndex((prevIndex) =>
        Math.min(data.products.length - 1, prevIndex + 1)
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setIsNavigationKeyPressed(true);
      setSelectedIndex((prevIndex) => Math.max(0, prevIndex - 1));
    }
  };

  const onButtonMouseDown = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };
  const onButtonMouseUp = (e: MouseEvent<HTMLButtonElement>) => {
    const target = e.target as HTMLElement;
    const query = target.textContent || '';
    navigateToSearch(query);
  };
  const onButtonKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter') {
      setIsListVisible(false);
      const target = e.target as HTMLElement;
      const query = target.textContent || '';
      navigateToSearch(query);
    }
  };

  const navigateToSearch = (query: string) => {
    router.push(`${searchUrl}?q=${query}`);
  };
  const onValid = ({ query }: ISearchForm) => {
    navigateToSearch(query);
  };
  const focusItem = (index: number) => {
    const ref = itemRefs.current[index];
    if (!ref) return;
    ref.focus();
    if (ref.textContent) setValue('query', ref.textContent);
  };

  useEffect(() => {
    focusItem(selectedIndex);
  }, [selectedIndex]);

  useEffect(() => {
    if (!q) return;
    setValue('query', q?.toString());
  }, [q, setValue]);

  return (
    <form
      onSubmit={handleSubmit(onValid)}
      onBlur={onFormBlur}
      className="relative w-5/12 max-w640:w-9/12 max-w480:w-8/12"
    >
      <SearchButton />

      {pageType === 'products' ? (
        <div className="relative">
          <input
            type="text"
            required
            {...register('query', {
              required: true,
              minLength: 2,
              onChange: onInputChange
            })}
            placeholder="검색어를 입력해주세요."
            onClick={onInputClick}
            onKeyDown={onInputKeyDown}
            className={cls(
              'w-full border-none pr-12',
              isOpenSearchList ? 'rounded-t-xl' : 'rounded-xl'
            )}
          />
          {isOpenSearchList && (
            <div
              role="list"
              className="absolute w-full border border-blue-50 bg-black"
            >
              {data.products.map((product, index) => (
                <button
                  key={product.id}
                  ref={(ref) => {
                    itemRefs.current[index] = ref;
                  }}
                  type="button"
                  tabIndex={0}
                  onMouseDown={onButtonMouseDown}
                  onMouseUp={onButtonMouseUp}
                  onKeyDown={(e) => {
                    onButtonKeyDown(e);
                    onInputKeyDown(e);
                  }}
                  className={cls(
                    'w-full p-2 text-left outline-none',
                    index === selectedIndex ? 'bg-gray-400' : ''
                  )}
                >
                  {product.name}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <input
          type="text"
          required
          {...register('query', { required: true, minLength: 2 })}
          placeholder="검색어를 입력해주세요."
          className="w-full rounded-xl border-none pr-12"
        />
      )}
    </form>
  );
}
