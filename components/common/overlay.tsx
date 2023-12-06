interface OverlayProps {
  onClick: () => void;
}

export default function Overlay({ onClick }: OverlayProps) {
  return (
    <div
      onClick={onClick}
      className="fixed left-0 top-0 z-10 h-screen w-screen"
      aria-hidden
    ></div>
  );
}
