import SearchIcon from '../icon/search-icon';

interface SearchButtonProps {
  handleSubmit: () => void;
}

export default function SearchButton({ handleSubmit }: SearchButtonProps) {
  return (
    <button
      onClick={handleSubmit}
      type="button"
      className="absolute right-2 top-1 aspect-square h-8 cursor-pointer fill-black"
    >
      <SearchIcon />
    </button>
  );
}
