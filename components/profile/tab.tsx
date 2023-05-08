import Link from 'next/link';

interface TabProps {
  className?: string;
  href: string;
  text: string;
  children: React.ReactNode;
}

export default function Tab({ className, href, text, children }: TabProps) {
  return (
    <div className={className}>
      <Link href={href} className="m-auto flex w-fit flex-col items-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 ">
          {children}
        </div>
        <span className="mt-2">{text}</span>
      </Link>
    </div>
  );
}

Tab.defaultProps = {
  className: ''
};
