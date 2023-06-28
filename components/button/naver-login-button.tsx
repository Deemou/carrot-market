import OAuthButton from './oauth-button';

export default function NaverLoginButton() {
  return (
    <OAuthButton provider="naver" providerText="Naver">
      <svg
        width={22}
        height={22}
        viewBox="-32 0 512 512"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        fill="#00e766"
        stroke="#00e766"
      >
        <g id="SVGRepo_bgCarrier" strokeWidth="0" />
        <g
          id="SVGRepo_tracerCarrier"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <g id="SVGRepo_iconCarrier">
          <path
            fill="#00e766"
            d="M16 32C11.8333 32 8.125 33.5833 4.875 36.75C1.625 39.9167 0 43.6667 0 48V464C0 468.333 1.625 472.083 4.875 475.25C8.125 478.417 11.8333 480 16 480H432C436.167 480 439.875 478.417 443.125 475.25C446.375 472.083 448 468.333 448 464V48C448 43.6667 446.375 39.9167 443.125 36.75C439.875 33.5833 436.167 32 432 32H16ZM100.25 144H186.5L261.5 256V144H347.75V368H261.5L186.5 256V368H100.25V144Z"
          />
        </g>
      </svg>
    </OAuthButton>
  );
}