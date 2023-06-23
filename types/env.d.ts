declare namespace NodeJS {
  export interface ProcessEnv {
    NEXTAUTH_SECRET: string;
    GITHUB_ID: string;
    GITHUB_SECRET: string;
    KAKAO_ID: string;
    KAKAO_SECRET: string;
    NAVER_ID: string;
    NAVER_SECRET: string;
  }
}
