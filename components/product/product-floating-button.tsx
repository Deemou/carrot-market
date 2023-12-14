import FloatingButton from '@/components/common/button/floating-button';
import { PRODUCTS } from '@/pageTypes';
import PlusIcon from '../icon/plus-icon';

export default function ProductFloatingButton() {
  return (
    <FloatingButton href={`/${PRODUCTS}/upload`}>
      <PlusIcon />
    </FloatingButton>
  );
}
