import GithubLoginButton from './github-login-button';
import KakaoLoginButton from './kakao-login-button';
import NaverLoginButton from './naver-login-button';

export default function OAuthLoginButtonList() {
  return (
    <div className="mt-2 flex flex-col space-y-4">
      <GithubLoginButton />
      <KakaoLoginButton />
      {/* <NaverLoginButton /> */}
    </div>
  );
}
