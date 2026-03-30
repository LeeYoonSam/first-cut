# First-Cut: 영상 기획 AI 하니스

## 프로젝트 목적

First-Cut은 영상 제작 기획을 체계적으로 수행할 수 있도록 돕는 AI 워크플로우 환경입니다.
유튜브, 브이로그, 다큐멘터리, 광고, 숏폼 등 모든 유형의 영상 기획을 지원합니다.

**주요 산출물**: 씬별 촬영·사운드·편집 기법이 명시된 마크다운 기획서 (`plans/` 디렉토리)

---

## 디렉토리 구조

```
first-cut/
├── .claude/
│   ├── skills/         # 영상 기법 스킬 파일 (결정 매트릭스 중심, AI가 참조)
│   └── rules/          # 프로젝트 규칙
├── docs/
│   ├── glossary.md     # 영상 제작 용어집
│   ├── techniques/     # 기법별 상세 문서 (사람이 직접 읽는 레퍼런스)
│   └── workflows/      # 워크플로우 가이드
├── plans/
│   ├── drafts/         # 작업 중인 기획 초안 (git 미추적)
│   └── YYYY-MM-DD-{제목}.md  # 최종 기획서
├── CLAUDE.md           # 이 파일
└── README.md           # 아키텍처 & 사용법
```

---

## 워크플로우 오케스트레이션 지침

### 메인 워크플로우 시작

사용자가 `/first-cut`을 호출하거나 영상 기획 요청을 하면 `.claude/skills/first-cut/SKILL.md`의 워크플로우를 따르세요.

**진행 순서**:
1. `plans/drafts/` 디렉토리를 확인하여 이전에 진행 중이던 기획이 있으면 이어서 진행할지 사용자에게 물어보세요
2. 사용자의 영상 아이디어를 받고 장르, 타겟, 길이, 분위기, 레퍼런스, 장비 수준을 순차적으로 질문하세요
3. 벤치마크가 필요하면 `.claude/skills/benchmark/SKILL.md`를 참고하고 웹 검색 도구를 사용하세요
4. 씬 구성 시 `.claude/skills/scene-builder/SKILL.md`를 따라 각 씬을 대화형으로 구체화하세요
5. 각 씬마다 아래 스킬들의 결정 매트릭스를 참고하여 기법을 추천하세요:
   - **촬영**: `.claude/skills/cinematography/SKILL.md`
   - **사운드**: `.claude/skills/sound-design/SKILL.md`
   - **편집**: `.claude/skills/editing/SKILL.md`
   - **연출**: `.claude/skills/directing/SKILL.md`
   - **색보정**: `.claude/skills/color-grading/SKILL.md`
   - **장르**: `.claude/skills/genre-guide/SKILL.md`
6. 최종 기획서는 `.claude/skills/export-plan/SKILL.md`를 참고하여 포맷팅하세요
7. 노션 동기화를 원하면 `.claude/skills/notion-sync/SKILL.md`를 참고하세요

### 개별 스킬 호출

각 기법 스킬은 독립적으로 호출할 수 있습니다:

| 호출 | 스킬 파일 | 용도 |
|------|-----------|------|
| `/first-cut` | `.claude/skills/first-cut/SKILL.md` | 전체 영상 기획 워크플로우 |
| `/cinematography` | `.claude/skills/cinematography/SKILL.md` | 촬영 기법 추천 |
| `/sound-design` | `.claude/skills/sound-design/SKILL.md` | 사운드 디자인 추천 |
| `/editing` | `.claude/skills/editing/SKILL.md` | 편집 기법 추천 |
| `/directing` | `.claude/skills/directing/SKILL.md` | 연출 기법 추천 |
| `/color-grading` | `.claude/skills/color-grading/SKILL.md` | 색보정 추천 |
| `/pre-production` | `.claude/skills/pre-production/SKILL.md` | 사전 기획 체크리스트 |
| `/genre-guide` | `.claude/skills/genre-guide/SKILL.md` | 장르별 특화 기법 |
| `/vfx-motion` | `.claude/skills/vfx-motion/SKILL.md` | VFX/모션 그래픽 |
| `/benchmark` | `.claude/skills/benchmark/SKILL.md` | 벤치마크/트렌드 리서치 |
| `/scene-builder` | `.claude/skills/scene-builder/SKILL.md` | 씬 상세 구성 |
| `/export-plan` | `.claude/skills/export-plan/SKILL.md` | 최종 기획서 생성 |
| `/notion-sync` | `.claude/skills/notion-sync/SKILL.md` | 노션 동기화 |

---

## 용어 설명 수준 가이드라인

**대상 사용자**: 영상 제작에 관심은 있지만 전문 용어가 익숙하지 않은 일반 사용자

- 모든 전문 용어를 처음 사용할 때 괄호로 쉬운 설명을 덧붙이세요
  - 예: "클로즈업(인물의 얼굴이나 사물을 화면 가득 채우는 샷)"
  - 예: "디졸브(한 장면이 서서히 사라지며 다음 장면으로 넘어가는 전환 효과)"
- 전문 용어는 영문과 한국어를 함께 표기하세요
  - 예: "핸드헬드(Handheld) 촬영"
- 추천 이유를 항상 쉽게 설명하세요
  - 나쁜 예: "로우앵글을 사용하세요"
  - 좋은 예: "로우앵글(카메라를 낮게 두고 위를 올려다보며 찍는 방식)을 사용하면 인물이 더 강하고 위압적으로 보입니다"
- 자세한 용어 설명은 `docs/glossary.md`를 참조하세요

---

## 중간 저장 지침

영상 기획은 여러 세션에 걸쳐 진행될 수 있습니다. 중간 작업 내용을 보존하세요.

- **각 단계 완료 시**: `plans/drafts/{프로젝트명}-step{N}.md`에 현재 진행 상태를 저장하세요
- **씬 완성 시**: `plans/drafts/{프로젝트명}-scene{N}.md`에 씬 내용을 저장하세요
- **벤치마크 완료 시**: `plans/drafts/{프로젝트명}-benchmark.md`에 분석 결과를 저장하세요
- **세션 시작 시**: `plans/drafts/` 디렉토리를 확인하여 기존 진행 파일이 있으면 사용자에게 이어서 진행할지 물어보세요
- **최종 기획서**: `plans/YYYY-MM-DD-{제목}.md` 형식으로 저장하세요 (예: `plans/2026-03-30-요리영상기획.md`)

---

## 노션 연동

노션 동기화 요청 시 아래 순서로 처리하세요:

1. 먼저 사용 가능한 노션 관련 MCP 도구가 있는지 확인하세요
2. 노션 MCP 도구가 사용 가능하면 기획서를 노션 페이지로 변환하여 업로드하세요
3. 노션 MCP가 사용 불가능하면:
   - 사용자에게 MCP 미연결 상태임을 알려주세요
   - 마크다운 기획서가 `plans/` 디렉토리에 있음을 안내하세요
   - 노션 MCP 설정 방법을 안내하거나 수동 복사 방법을 안내하세요

자세한 지침은 `.claude/skills/notion-sync/SKILL.md`를 참조하세요.

---

## 보안 지침

- **개인정보**: 기획서에 실명, 연락처, 주소 등 개인정보가 포함되지 않도록 주의하세요
- **API 키 및 비밀번호**: `.env`, `*.secret`, `*.key` 파일은 절대 git에 커밋하지 마세요. `.gitignore`에 이미 포함되어 있습니다
- **저작권**: 레퍼런스 영상이나 음악을 추천할 때 저작권 및 라이선스 정보를 항상 함께 안내하세요
  - 예: "이 음악은 Creative Commons 라이선스로 상업적 사용이 가능합니다"
  - 예: "이 영상은 참고용으로만 활용하고, 직접 인용 시 저작권자에게 허가를 받으세요"
- **외부 서비스**: 노션 등 외부 서비스 연동 시 민감한 프로젝트 내용이 외부에 저장됨을 사용자에게 알려주세요
