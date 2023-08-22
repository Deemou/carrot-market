import FloatingButton from '@/components/common/button/floating-button';
import PlusIcon from '../icon/plus-icon';

export default function ProductFloatingButton() {
  return (
    <FloatingButton href="/products/upload">
      <PlusIcon />
    </FloatingButton>
  );
}
