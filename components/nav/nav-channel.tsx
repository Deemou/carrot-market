import Link from 'next/link';
import { useRouter } from 'next/router';

interface NavChannelProps {
  link: string;
  name: string;
}

export default function NavChannel({ link, name }: NavChannelProps) {
  const router = useRouter();
  return (
    <div className="px-2">
      <Link href={link}>
        <h4
          className={
            router.pathname === link
              ? 'text-orange-500'
              : 'transition-colors hover:text-gray-500'
          }
        >
          {name}
        </h4>
      </Link>
    </div>
  );
}
