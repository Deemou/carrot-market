import NaverIcon from '../icon/naver-icon';
import OAuthButton from './oauth-button';

export default function NaverLoginButton() {
  return (
    <OAuthButton provider="naver" providerText="Naver">
      <NaverIcon />
    </OAuthButton>
  );
}
