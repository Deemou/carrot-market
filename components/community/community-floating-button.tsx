import FloatingButton from '@/components/common/button/floating-button';
import WriteIcon from '../icon/write-icon';

export default function CommunityFloatingButton() {
  return (
    <FloatingButton href="/community/write">
      <WriteIcon />
    </FloatingButton>
  );
}
