import GithubIcon from '../icon/github-icon';
import OAuthButton from './oauth-button';

export default function GithubLoginButton() {
  return (
    <OAuthButton provider="github" providerText="Github">
      <GithubIcon />
    </OAuthButton>
  );
}
