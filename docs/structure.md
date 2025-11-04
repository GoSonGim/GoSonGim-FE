# 구조 & 네이밍 가이드

## 디렉터리 규칙

- 상위 디렉터리는 기능 기반으로 구성하고 모두 camelCase 사용 (`components/login`, `hooks/loginForm`, `assets/svgs/login` 등).
- 역할 네임스페이스는 복수형으로 유지 (`hooks/mutations`, `hooks/queries`).
- 페이지와 동일한 도메인 자원은 동일한 디렉터리명으로 정렬 (`pages/login` ↔ `components/login`, `hooks/login`).

## 파일 네이밍

- React 컴포넌트: PascalCase (`Button.tsx`, `SignupBottomSheet.tsx`).
- 훅/스토어: camelCase + 동사/명사 (`useLogin.ts`, `useAuthStore.ts`).
- 유틸: camelCase + `Utils` 접미사 (`errorHandlerUtils.ts`, `validationUtils.ts`).
- API: 도메인 + `.api.ts` (`auth.api.ts`).
- Provider: 전용 `providers/` 디렉터리에서 camelCase 파일 (`reactQueryProvider.tsx`).
- SVG 등 에셋: 소문자 camelCase (`eyeOpen.svg`, `signIn/greenCheck.svg`).

## 에셋 디렉터리

- MCP에서 내려받은 SVG는 `assets/svgs/{도메인}` 구조 유지.
- 상태/컨텍스트별 하위 디렉터리는 camelCase (`login/loginForm`, `login/signIn`).

## 공통 원칙

- 새 파일/폴더 추가 시 위 규칙을 먼저 확인한 뒤 생성.
- 오탈자나 대소문자 불일치 발견 시 즉시 경로와 모든 import를 수정.
- 구조 변경 후에는 관련 문서를 갱신하고 팀과 공유.
