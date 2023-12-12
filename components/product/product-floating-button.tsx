import FloatingButton from '@/components/common/button/floating-button';
import PlusIcon from '../icon/plus-icon';
import { PRODUCTS } from '@/pageTypes';

export default function ProductFloatingButton() {
  return (
    <FloatingButton href={`/${PRODUCTS}/upload`}>
      <PlusIcon />
    </FloatingButton>
  );
}
