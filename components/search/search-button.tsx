import SearchIcon from '../icon/search-icon';

export default function SearchButton() {
  return (
    <button
      type="submit"
      className="absolute right-2 top-1 z-10 aspect-square h-8 cursor-pointer fill-black"
    >
      <SearchIcon />
    </button>
  );
}
