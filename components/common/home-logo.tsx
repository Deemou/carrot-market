import { HOME_URL } from '@/routes';
import Image from 'next/image';
import Link from 'next/link';

export default function HomeLogo() {
  return (
    <Link href={HOME_URL}>
      <Image src="/images/carrot-logo.png" alt="Logo" width={32} height={32} />
    </Link>
  );
}
