import FloatingButton from '@/components/common/button/floating-button';
import WriteIcon from '../icon/write-icon';
import { COMMUNITY } from '@/pageTypes';

export default function CommunityFloatingButton() {
  return (
    <FloatingButton href={`/${COMMUNITY}/write`}>
      <WriteIcon />
    </FloatingButton>
  );
}
