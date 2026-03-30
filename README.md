# First-Cut: 영상 기획 AI 어시스턴트

> 영상 제작 초보자도 전문적인 기획서를 만들 수 있도록 돕는 AI 워크플로우 환경

First-Cut은 [Claude Code](https://claude.ai/code)의 스킬 시스템을 활용하여, 대화형으로 영상 기획서를 작성할 수 있는 프로젝트입니다. 유튜브, 브이로그, 광고, 다큐멘터리, 숏폼 등 모든 유형의 영상 기획을 지원합니다.

---

## 주요 기능

- 대화형 영상 기획 워크플로우 (`/first-cut`)
- 촬영, 편집, 사운드, 연출, 색보정 등 전문 기법 추천
- 장면(씬)별 상세 설계
- 벤치마크/레퍼런스 영상 분석
- 마크다운 기획서 자동 생성 및 노션 동기화
- 초보자 친화적 용어 설명

---

## 아키텍처

```
┌─────────────────────────────────────────────────────┐
│                    사용자 입력                        │
│            "카페 브이로그를 만들고 싶어요"              │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────┐
│              /first-cut (메인 워크플로우)               │
│                                                      │
│  ┌────────────┐  ┌────────────┐  ┌────────────────┐  │
│  │ /benchmark │  │/pre-produc │  │ /scene-builder │  │
│  │ 레퍼런스   │  │ tion       │  │  장면 설계     │  │
│  │ 분석       │  │ 사전 기획  │  │                │  │
│  └────────────┘  └────────────┘  └───────┬────────┘  │
│                                          │           │
│              ┌───────────────────────────┐│           │
│              │     기법 스킬 참조        ││           │
│              │                           ▼│           │
│  ┌───────────┼──────────────────────────┐ │           │
│  │           │  촬영 · 편집 · 사운드    │ │           │
│  │           │  연출 · 색보정 · VFX     │ │           │
│  │           │  장르별 · 사전기획       │ │           │
│  └───────────┴──────────────────────────┘ │           │
│                                           │           │
│  ┌─────────────┐  ┌──────────────┐        │           │
│  │/export-plan │  │ /notion-sync │        │           │
│  │ 기획서 출력 │  │ 노션 동기화  │        │           │
│  └─────────────┘  └──────────────┘        │           │
└──────────────────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────┐
│             plans/YYYY-MM-DD-제목.md                  │
│                  최종 기획서                           │
└──────────────────────────────────────────────────────┘
```

---

## 디렉토리 구조

```
first-cut/
├── .claude/
│   ├── skills/              # AI 스킬 파일 (결정 매트릭스 중심)
│   │   ├── first-cut/SKILL.md       # 메인 워크플로우
│   │   ├── cinematography/SKILL.md  # 촬영 기법
│   │   ├── sound-design/SKILL.md    # 사운드 디자인
│   │   ├── editing/SKILL.md         # 편집 기법
│   │   ├── directing/SKILL.md       # 연출 기법
│   │   ├── color-grading/SKILL.md   # 색보정
│   │   ├── pre-production/SKILL.md  # 사전 기획
│   │   ├── genre-guide/SKILL.md     # 장르별 기법
│   │   ├── vfx-motion/SKILL.md      # VFX/모션 그래픽
│   │   ├── benchmark/SKILL.md       # 벤치마크 리서치
│   │   ├── scene-builder/SKILL.md   # 장면 설계
│   │   ├── export-plan/SKILL.md     # 기획서 내보내기
│   │   └── notion-sync/SKILL.md     # 노션 동기화
│   └── rules/               # 프로젝트 규칙
├── docs/
│   ├── glossary.md           # 영상 제작 용어집 (130+ 용어)
│   ├── techniques/           # 기법별 상세 레퍼런스 (사람용)
│   │   ├── pre-production.md
│   │   ├── cinematography.md
│   │   ├── directing.md
│   │   ├── editing.md
│   │   ├── sound-design.md
│   │   ├── color-grading.md
│   │   ├── vfx-motion.md
│   │   └── genre-specific.md
│   └── workflows/            # 워크플로우 가이드
│       ├── quick-start.md        # 빠른 시작 (5분 가이드)
│       ├── full-workflow.md      # 전체 워크플로우 상세
│       ├── notion-setup.md       # 노션 연동 설정
│       └── adding-new-technique.md  # 새 기법 추가 절차
├── plans/
│   ├── drafts/               # 작업 중인 기획 초안
│   └── YYYY-MM-DD-제목.md    # 최종 기획서
├── CLAUDE.md                 # AI 오케스트레이션 설정
└── README.md                 # 이 파일
```

---

## 빠른 시작

### 사전 준비

- [Claude Code](https://claude.ai/code) 설치

### 시작하기

```bash
# 1. 프로젝트 클론
git clone <저장소-URL>
cd first-cut

# 2. Claude Code 실행
claude

# 3. 영상 기획 시작
/first-cut
```

AI가 영상에 대해 질문하면 답변하세요. 몇 분 안에 전문적인 기획서가 완성됩니다.

자세한 안내는 [빠른 시작 가이드](docs/workflows/quick-start.md)를 참고하세요.

---

## 스킬 목록

First-Cut은 13개의 AI 스킬로 구성되어 있습니다.

### 워크플로우 스킬

| 호출 명령어 | 스킬 파일 | 설명 |
|------------|-----------|------|
| `/first-cut` | [SKILL.md](.claude/skills/first-cut/SKILL.md) | 전체 영상 기획 워크플로우 시작 |
| `/benchmark` | [SKILL.md](.claude/skills/benchmark/SKILL.md) | 레퍼런스 영상 분석 및 트렌드 리서치 |
| `/scene-builder` | [SKILL.md](.claude/skills/scene-builder/SKILL.md) | 장면(씬)별 상세 설계 |
| `/export-plan` | [SKILL.md](.claude/skills/export-plan/SKILL.md) | 최종 기획서 마크다운 생성 |
| `/notion-sync` | [SKILL.md](.claude/skills/notion-sync/SKILL.md) | 노션 페이지 동기화 |

### 기법 스킬

| 호출 명령어 | 스킬 파일 | 설명 | 레퍼런스 문서 |
|------------|-----------|------|--------------|
| `/cinematography` | [SKILL.md](.claude/skills/cinematography/SKILL.md) | 촬영 기법 추천 (앵글, 카메라 움직임, 조명) | [촬영 기법](docs/techniques/cinematography.md) |
| `/sound-design` | [SKILL.md](.claude/skills/sound-design/SKILL.md) | 사운드 디자인 추천 (효과음, 믹싱, 음악) | [사운드 기법](docs/techniques/sound-design.md) |
| `/editing` | [SKILL.md](.claude/skills/editing/SKILL.md) | 편집 기법 추천 (컷, 전환, 리듬) | [편집 기법](docs/techniques/editing.md) |
| `/directing` | [SKILL.md](.claude/skills/directing/SKILL.md) | 연출 기법 추천 (미장센, 블로킹, 동선) | [연출 기법](docs/techniques/directing.md) |
| `/color-grading` | [SKILL.md](.claude/skills/color-grading/SKILL.md) | 색보정/그레이딩 추천 (색온도, LUT, 톤) | [색보정 기법](docs/techniques/color-grading.md) |
| `/pre-production` | [SKILL.md](.claude/skills/pre-production/SKILL.md) | 사전 기획 체크리스트 | [사전 기획](docs/techniques/pre-production.md) |
| `/genre-guide` | [SKILL.md](.claude/skills/genre-guide/SKILL.md) | 장르별 특화 기법 추천 | [장르별 기법](docs/techniques/genre-specific.md) |
| `/vfx-motion` | [SKILL.md](.claude/skills/vfx-motion/SKILL.md) | VFX 및 모션 그래픽 기법 | [VFX 기법](docs/techniques/vfx-motion.md) |

---

## 기법 레퍼런스 문서

각 기법 카테고리별로 10개 이상의 기법이 상세하게 정리되어 있습니다.

| 카테고리 | 문서 | 포함 기법 수 | 주요 내용 |
|---------|------|-------------|----------|
| 사전 기획 | [pre-production.md](docs/techniques/pre-production.md) | 12개 | 스토리보드, 콘티, 샷리스트, 로케이션 헌팅 등 |
| 촬영 | [cinematography.md](docs/techniques/cinematography.md) | 13개 | 와이드샷, 클로즈업, 트래킹, 핸드헬드 등 |
| 연출 | [directing.md](docs/techniques/directing.md) | 12개 | 미장센, 블로킹, 시선 유도, 교차 편집 등 |
| 편집 | [editing.md](docs/techniques/editing.md) | 12개 | 컷, 점프컷, 매치컷, L/J컷, 몽타주 등 |
| 사운드 | [sound-design.md](docs/techniques/sound-design.md) | 12개 | 다이제틱, 폴리, 앰비언스, 사운드 브릿지 등 |
| 색보정 | [color-grading.md](docs/techniques/color-grading.md) | 12개 | 색온도, 틸오렌지, LUT, 블리치 바이패스 등 |
| VFX/모션 | [vfx-motion.md](docs/techniques/vfx-motion.md) | 12개 | 그린스크린, 모션트래킹, 합성, 스피드램핑 등 |
| 장르별 | [genre-specific.md](docs/techniques/genre-specific.md) | 12개 | 호러 서스펜스, 점프스케어, 비트싱크 등 |

전체 용어 목록은 [용어집](docs/glossary.md) (130+ 용어)을 참고하세요.

---

## 워크플로우 가이드

| 가이드 | 설명 |
|--------|------|
| [빠른 시작](docs/workflows/quick-start.md) | 5분 안에 첫 기획서 만들기 |
| [전체 워크플로우](docs/workflows/full-workflow.md) | 6단계 워크플로우 상세 설명 |
| [노션 연동 설정](docs/workflows/notion-setup.md) | Notion MCP 서버 설정 및 동기화 |
| [새 기법 추가](docs/workflows/adding-new-technique.md) | 프로젝트에 새 기법을 추가하는 절차 |

---

## 보안 참고사항

- 기획서에 실명, 연락처 등 개인정보가 포함되지 않도록 주의하세요
- `.env`, `*.secret`, `*.key` 파일은 `.gitignore`에 의해 git 추적에서 제외됩니다
- 레퍼런스 영상/음악 추천 시 저작권 정보를 항상 확인하세요
- 노션 등 외부 서비스 연동 시 민감한 내용이 외부에 저장될 수 있습니다

---

## 기여하기

새로운 영상 제작 기법을 추가하고 싶다면 [새 기법 추가 절차](docs/workflows/adding-new-technique.md)를 참고하세요.

---

## 라이선스

이 프로젝트는 교육 및 창작 지원 목적으로 제작되었습니다.
