import FloatingButton from '@/components/button/floating-button';
import SearchForm from '@components/form/search-form';

interface SearchBarProps {
  section: string;
}

export default function SearchBar({ section }: SearchBarProps) {
  return (
    <div className="fixed top-[5rem] z-10 mx-[-1rem] flex h-24 w-full max-w-6xl items-center justify-between  bg-black bg-black px-2">
      {section === 'products' && (
        <FloatingButton href="/products/upload">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </FloatingButton>
      )}
      {section === 'community' && (
        <FloatingButton href="/community/write">
          <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            ></path>
          </svg>
        </FloatingButton>
      )}
      <SearchForm searchUrl={`/${section}/search`} />
    </div>
  );
}
