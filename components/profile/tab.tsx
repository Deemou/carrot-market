import Link from 'next/link';

interface TabProps {
  href: string;
  text: string;
  className?: string;
  children: React.ReactNode;
}

export default function Tab({ href, text, className, children }: TabProps) {
  return (
    <div className={className}>
      <Link href={href} className="m-auto flex w-fit flex-col items-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 ">
          {children}
        </div>
        <span className="mt-2 text-sm font-medium ">{text}</span>
      </Link>
    </div>
  );
}

Tab.defaultProps = {
  className: ''
};
