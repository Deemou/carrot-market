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
import { ProductsResponse } from '@/types/product';
import { PRODUCTS } from '@/pageTypes';
import SearchButton from './search-button';

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
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);

  const { data } = useSWR<ProductsResponse>(
    searchWord ? `/api/${PRODUCTS}/search?q=${searchWord}` : null
  );

  const isOpenSearchList = isListVisible && data && data?.products?.length > 0;

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsListVisible(true);
    setSearchWord(e.currentTarget.value);
  };
  const onInputBlur = () => {
    setIsListVisible(false);
  };
  const onInputClick = (e: MouseEvent<HTMLInputElement>) => {
    setIsListVisible(true);
    const target = e.currentTarget;
    const query = target.value || '';
    setSearchWord(query);
  };
  const onInputFocus = () => {
    setSelectedIndex(-1);
  };
  const onInputKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (!data?.products) return;

    if (e.key === 'Tab' || e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prevIndex) =>
        prevIndex >= data.products.length - 1 ? 0 : prevIndex + 1
      );
    } else if (e.key === 'ArrowUp') {
      setSelectedIndex((prevIndex) => Math.max(-1, prevIndex - 1));
    }
  };

  const onButtonMouseEnter = (index: number) => {
    setHoveredIndex(index);
    setSelectedIndex(-1);
  };
  const onButtonMouseLeave = () => {
    setHoveredIndex(-1);
  };
  const onButtonMouseDown = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };
  const onButtonMouseUp = (e: MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget;
    const query = target.textContent || '';
    navigateToSearch(query);
  };

  const navigateToSearch = (query: string) => {
    router.push(`${searchUrl}?q=${query}`);
  };
  const onValid = ({ query }: ISearchForm) => {
    navigateToSearch(query);
  };

  useEffect(() => {
    const ref = itemRefs.current[selectedIndex];
    if (!ref) return;
    if (ref.textContent) setValue('query', ref.textContent);
  }, [selectedIndex, setValue]);

  useEffect(() => {
    if (!q) return;
    setValue('query', q?.toString());
  }, [q, setValue]);

  return (
    <form
      onSubmit={handleSubmit(onValid)}
      className="relative w-5/12 max-w640:w-9/12 max-w480:w-8/12"
    >
      <SearchButton />

      {pageType === PRODUCTS ? (
        <div className="relative">
          <input
            type="text"
            required
            {...register('query', {
              required: true,
              minLength: 2,
              onChange: onInputChange,
              onBlur: onInputBlur
            })}
            placeholder="검색어를 입력해주세요."
            onClick={onInputClick}
            onFocus={onInputFocus}
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
                  onMouseEnter={() => onButtonMouseEnter(index)}
                  onMouseLeave={onButtonMouseLeave}
                  onMouseDown={onButtonMouseDown}
                  onMouseUp={onButtonMouseUp}
                  className={cls(
                    'w-full p-2 text-left outline-none',
                    index === hoveredIndex ? 'bg-gray-400' : '',
                    hoveredIndex === -1 && index === selectedIndex
                      ? 'bg-gray-400'
                      : ''
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
