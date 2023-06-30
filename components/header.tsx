import NavBar from '@/components/nav/nav-bar';

export default function Header() {
  return (
    <header
      className="fixed top-0 z-10 flex h-20 w-[100vw] items-center justify-center border-b bg-black"
      role="banner"
    >
      <NavBar />
    </header>
  );
}
