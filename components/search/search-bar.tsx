import SearchForm from '@/components/search/search-form';
import ProductFloatingButton from '@/components/product/product-floating-button';
import CommunityFloatingButton from '../community/community-floating-button';

interface SearchBarProps {
  section: string;
}

export default function SearchBar({ section }: SearchBarProps) {
  return (
    <div className="fixed top-[5rem] z-10 mx-[-1rem] flex h-24 w-full max-w-6xl items-center justify-between bg-black px-2">
      {section === 'products' && <ProductFloatingButton />}
      {section === 'community' && <CommunityFloatingButton />}
      <SearchForm searchUrl={`/${section}/search`} />
    </div>
  );
}
