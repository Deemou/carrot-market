import NavBar from '@/components/nav/nav-bar';

export default function Header() {
  return (
    <header
      className="fixed top-0 z-20 flex h-20 w-full items-center justify-center border-b bg-black"
      role="banner"
    >
      <NavBar />
    </header>
  );
}
