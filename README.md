# 멍때리기 (Spacing Out App)

마음을 편안하게 하는 시각적 명상 애플리케이션입니다. 부드러운 애니메이션과 차분한 색상으로 장시간 바라봐도 눈이 피로하지 않은 환경을 제공합니다.

## 프로젝트 개요

이 프로젝트는 바쁜 일상에서 벗어나 마음의 여유를 찾을 수 있도록 도와주는 웹 애플리케이션입니다. 다음과 같은 특징을 가지고 있습니다:

- **시각적 편안함**: 부드럽고 과하지 않은 애니메이션
- **접근성 우선**: 키보드 탐색, 스크린 리더 지원, 움직임 민감 사용자 고려
- **반응형 디자인**: 모바일과 데스크톱 모두에서 최적화된 경험
- **테마 지원**: 밝은 테마와 어두운 테마 전환 가능
- **PWA 준비**: 추후 프로그레시브 웹 앱으로 확장 가능하도록 설계

## 기술 스택

### Core Technologies
- **React 18** - 사용자 인터페이스 라이브러리
- **TypeScript** - 타입 안전성을 위한 JavaScript 상위 집합
- **Vite** - 빠른 개발 서버와 빌드 도구
- **Tailwind CSS** - 유틸리티 우선 CSS 프레임워크

### Animation & State Management
- **Framer Motion** - 부드러운 애니메이션 라이브러리
- **Zustand** - 간단하고 강력한 상태 관리 라이브러리

### Development Tools
- **ESLint** - 코드 품질과 일관성 검사
- **Prettier** - 코드 자동 포맷팅
- **PostCSS** - CSS 후처리 도구

## 실행 방법

### Prerequisites
- Node.js 16.0 이상
- npm 또는 yarn

### Installation & Development

```bash
# 저장소 클론
git clone <repository-url>
cd spacing-out-app

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 브라우저에서 http://localhost:3000 접속
```

### Production Build

```bash
# 프로덕션 빌드 생성
npm run build

# 빌드된 파일 미리보기
npm run preview
```

## 디렉토리 구조

```
src/
├── components/          # 재사용 가능한 UI 컴포넌트들
│   ├── ThemeToggle.tsx  # 테마 전환 버튼 컴포넌트
│   └── ...
├── hooks/              # 커스텀 React 훅들
│   ├── useBackgroundAnimation.ts  # 배경 애니메이션 훅
│   └── ...
├── lib/                # 유틸리티 함수와 설정들
│   ├── store.ts        # Zustand 상태 관리 스토어
│   └── ...
├── pages/              # 페이지 컴포넌트들 (현재 단일 페이지)
├── types/              # TypeScript 타입 정의들
│   └── app.ts          # 애플리케이션 관련 타입들
├── App.tsx             # 메인 애플리케이션 컴포넌트
├── main.tsx            # React 애플리케이션 엔트리 포인트
└── index.css           # 전역 스타일시트

public/                 # 정적 파일들
├── vite.svg           # Vite 로고
└── ...

# 설정 파일들 (루트 레벨)
├── vite.config.ts     # Vite 설정
├── tailwind.config.js # Tailwind CSS 설정
├── tsconfig.json      # TypeScript 설정
├── tsconfig.node.json # Node.js 관련 TypeScript 설정
├── postcss.config.js  # PostCSS 설정
├── .eslintrc.cjs      # ESLint 설정
└── .prettierrc        # Prettier 설정
```

## 개발 규칙

### 코드 스타일
- **ESLint**: 모든 코드에 적용되는 린팅 규칙
- **Prettier**: 일관된 코드 포맷팅
- **TypeScript**: 엄격한 타입 검사 (strict 모드)

### 커밋 컨벤션
```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 업데이트
style: 코드 포맷팅, 세미콜론 누락 등
refactor: 코드 리팩토링
test: 테스트 코드 추가/수정
chore: 빌드 프로세스, 의존성 업데이트 등
```

### 브랜치 전략
- `main`: 프로덕션 브랜치
- `develop`: 개발 브랜치
- `feature/기능명`: 새로운 기능 개발 브랜치
- `hotfix/이슈명`: 긴급 수정 브랜치

## 접근성 가이드라인

이 애플리케이션은 웹 접근성 표준(WCAG 2.1)을 준수합니다:

### 키보드 접근성
- 모든 인터랙티브 요소는 키보드로 접근 가능
- Tab 키로 포커스 이동
- Enter/Space 키로 버튼 활성화

### 스크린 리더 지원
- 의미있는 HTML 구조 사용 (main, nav, section 등)
- ARIA 라벨과 설명 적절히 활용
- 장식 요소는 `aria-hidden="true"` 처리

### 시각적 접근성
- 충분한 색상 대비 (4.5:1 이상)
- 텍스트 크기 조절 가능
- 움직임 민감 사용자 고려 (prefers-reduced-motion)

### 모션 설정
사용자의 모션 선호도에 따라 애니메이션 강도를 조절:
- `prefers-reduced-motion: reduce` 설정 시 최소 애니메이션만 표시

## 향후 개선 방향

### 기능 확장
- [ ] 배경 음악/사운드 추가
- [ ] 명상 타이머 기능
- [ ] 사용자 설정 저장 및 동기화
- [ ] 다양한 배경 애니메이션 패턴

### 기술적 개선
- [ ] 서비스 워커 추가 (PWA 지원)
- [ ] 오프라인 기능 구현
- [ ] 성능 최적화 (코드 분할, 이미지 최적화)
- [ ] 테스트 코드 작성 (Jest, React Testing Library)

### 접근성 향상
- [ ] 더 많은 언어 지원 (i18n)
- [ ] 고대비 테마 추가
- [ ] 음성 명령 지원
- [ ] 점자 디스플레이 지원

### 플랫폼 확장
- [ ] 모바일 앱 (React Native)
- [ ] 데스크톱 앱 (Electron)
- [ ] 브라우저 확장 프로그램

## 핵심 목표

### 시각적 편안함
장시간 사용해도 눈이 피로하지 않도록:
- 부드러운 색상 팔레트 사용
- 적절한 명도 대비
- 최소한의 시각적 자극

### 구조적 완성도
유지보수와 확장이 용이하도록:
- 명확한 컴포넌트 분리
- 타입 안전성 보장
- 일관된 코드 스타일

### 의미적 명료함
코드와 사용자 경험 모두에서:
- 직관적인 네이밍
- 명확한 목적과 기능
- 불필요한 복잡성 제거

이 프로젝트는 단순함과 편안함을 추구하며, 사용자가 진정으로 휴식을 취할 수 있는 디지털 공간을 만들어갑니다.
