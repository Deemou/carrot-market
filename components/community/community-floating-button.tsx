import FloatingButton from '@/components/common/button/floating-button';
import { COMMUNITY } from '@/pageTypes';
import WriteIcon from '../icon/write-icon';

export default function CommunityFloatingButton() {
  return (
    <FloatingButton href={`/${COMMUNITY}/write`}>
      <WriteIcon />
    </FloatingButton>
  );
}
