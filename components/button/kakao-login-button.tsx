import KakaoIcon from '../icon/kakao-icon';
import OAuthButton from './oauth-button';

export default function KakaoLoginButton() {
  return (
    <OAuthButton provider="kakao" providerText="Kakao">
      <KakaoIcon />
    </OAuthButton>
  );
}
