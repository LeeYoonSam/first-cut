# 웹앱 데이터 동기화 규칙

## 개요

`web/` 디렉토리는 first-cut 프로젝트의 정적 웹 인터페이스입니다.
`web/src/data/` 디렉토리는 마크다운 소스에서 자동 생성되며 git에 추적되지 않습니다.

## 동기화 트리거

아래 파일이 변경되면 `cd web && npm run sync`를 실행하여 JSON 데이터를 재생성해야 합니다:

- `docs/glossary.md` → `web/src/data/glossary.json`
- `docs/techniques/*.md` → `web/src/data/techniques/*.json`
- `.claude/skills/*/SKILL.md` → `web/src/data/skills/*.json`, `web/src/data/decision-matrices.json`
- `.claude/skills/first-cut/SKILL.md` + `docs/workflows/full-workflow.md` → `web/src/data/workflow.json`

## 웹앱 개발 명령어

```bash
cd web

# 데이터 동기화만 실행
npm run sync

# 개발 서버 (sync + next dev)
npm run dev

# 프로덕션 빌드 (sync + next build)
npm run build
```

## 빌드 출력

`npm run build` 실행 시 `web/out/` 디렉토리에 정적 HTML/CSS/JS가 생성됩니다.
`output: 'export'` 설정으로 서버 없이 정적 파일 서빙이 가능합니다.

## 파일 구조

```
web/
├── scripts/sync-data.ts   # 마크다운 → JSON 변환 스크립트
├── src/
│   ├── app/               # Next.js App Router 페이지
│   │   ├── page.tsx           # 홈
│   │   ├── glossary/          # 용어집
│   │   ├── techniques/        # 기법 학습
│   │   ├── decision-matrix/   # 결정 매트릭스
│   │   └── workflow/          # 워크플로우
│   ├── components/        # 공통 컴포넌트
│   ├── data/              # 생성된 JSON (git 미추적)
│   ├── lib/types.ts       # TypeScript 타입 정의
│   └── styles/globals.css # 전역 스타일
└── package.json
```
