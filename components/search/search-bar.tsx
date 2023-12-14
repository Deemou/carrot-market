import SearchForm from '@/components/search/search-form';
import ProductFloatingButton from '@/components/product/product-floating-button';
import { useRecoilValue } from 'recoil';
import { pageTypeAtom } from '@/atoms';
import { COMMUNITY, PRODUCTS } from '@/pageTypes';
import CommunityFloatingButton from '../community/community-floating-button';

export default function SearchBar() {
  const pageType = useRecoilValue(pageTypeAtom);

  return (
    <div className="fixed top-[5rem] z-10 mx-[-1rem] flex h-24 w-full max-w-6xl items-center justify-between bg-black px-2">
      {pageType === PRODUCTS && <ProductFloatingButton />}
      {pageType === COMMUNITY && <CommunityFloatingButton />}
      <SearchForm />
    </div>
  );
}
