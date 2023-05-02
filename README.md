## Contents

- [Introduction](#introduction)
- [Main Feature](#main-feature)
- [Environment](#environment)
- [Main Problems Solved](#main-problems-solved)

## Introduction

Next.js를 이용한 Serverless Marketplace입니다.

본 서비스를 이용하기 위해서는 계정이 필요합니다.
<br>
계정이 없는 경우 회원 가입을 해야 하며, 이메일 인증이 필요합니다.

상단의 ‘header’에는 이름이 표시되며, 로그아웃을 할 수 있습니다.
<br>
하단의 ‘tab-bar’를 통해 손쉽게 다른 서비스로 이동할 수 있습니다.
<br>
현재 이용중인 서비스 부분이 다른 색으로 강조됩니다.

### Home

등록되어 있는 상품 리스트가 표시되며, 상품을 등록할 수 있습니다.
<br>
상품 페이지에서 상품 수정, 삭제가 가능합니다.
<br>
'찜' 버튼이 제공됩니다.

### Community

질문글을 올리고 답변을 받을 수 있습니다.
<br>
질문 포스트에서 질문 수정, 삭제가 가능합니다.
<br>
'나도 궁금해요' 버튼이 제공됩니다.

### Live

라이브 스트리밍 예정

### My Carrot

유저의 프로필이 표시됩니다.
<br>
이름, 이메일, 프로필 이미지를 변경할 수 있습니다.
<br>
판매중인 상품, 관심목록을 볼 수 있습니다.

## Main Feature

- 로그인 / 회원가입 (Email 인증)
- 패스워드 해싱
- 미들웨어 - 봇 여부 체크, 사용자 인증 확인
- 탭 바 - 서비스간 빠른 이동, 현재 이용중인 서비스 강조
- 상품 등록, 수정, 삭제, 좋아요 기능
- 질문 등록, 수정, 삭제, 나도 궁금해요, 답변 기능
- 상품/질문 삭제 전 경고 모달 창
- 프로필 - 정보 확인, 변경, 판매중인 상품, 관심목록
- Infinite Scroll
- 편리한 페이지네이션 바
- Static Generation
- Server Side Rendering

## Environment

- Language: JavaScript, TypeScript
- Framework: Next.js
- Library: React.js, Tailwind.css, Sass, SWR, Iron-session, NodeMailer, Bcrypt, Gray-matter, Recoil
- Database: PlanetScale, Firebase
- ORM: Prisma
- Deploy: Vercel

## Main Problems Solved

- [사용자 인증](https://github.com/Deemou/carrot-market/wiki/사용자-인증)
- [상태 관리](https://github.com/Deemou/carrot-market/wiki/상태-관리)
- [이메일 인증](https://github.com/Deemou/carrot-market/wiki/이메일-인증)
- [Infinite Scroll](https://github.com/Deemou/carrot-market/wiki/infinite-scroll)
- [Static Generation 적용](https://github.com/Deemou/carrot-market/wiki/static-generation-적용)
- [Server Side Rendering 적용](https://github.com/Deemou/carrot-market/wiki/server-side-rendering-적용)
