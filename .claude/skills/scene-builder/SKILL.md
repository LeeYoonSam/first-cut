---
name: scene-builder
description: 개별 씬의 상세 구성을 대화형으로 진행하는 씬 빌더 가이드
---

## 목적

영상의 각 씬(장면)을 사용자와 함께 대화하며 구체화합니다.
씬의 목적, 감정, 촬영·사운드·편집 기법을 결정하고, 씬 간 전환까지 설계합니다.

## 사용 시점

- 사용자가 `/scene-builder`를 호출했을 때
- 메인 워크플로우(`first-cut.md`)의 5단계 씬별 구체화 단계에서
- 특정 씬 하나를 집중적으로 다듬고 싶을 때

---

## 씬 구성 지침

### 1단계: 씬 기본 정보 확인

다음 항목을 순서대로 확인하세요.
선택지가 있는 질문은 `AskUserQuestion`을 사용하여 클릭 가능한 옵션으로 제공하세요.
자유 입력이 필요한 질문은 일반 텍스트로 질문하세요.

1. **씬 번호와 제목** (일반 텍스트): "몇 번째 씬인가요? 이 씬에 제목을 붙인다면?"

2. **씬의 목적** (AskUserQuestion 사용):
```
AskUserQuestion:
  question: "이 장면이 전체 영상에서 어떤 역할을 하나요?"
  header: "씬 목적"
  options:
    - label: "소개/오프닝"
      description: "영상의 시작, 주제나 인물을 처음 보여주는 장면"
    - label: "본론/정보 전달"
      description: "핵심 내용을 전달하는 메인 장면"
    - label: "클라이맥스"
      description: "영상에서 가장 극적이거나 중요한 장면"
    - label: "감정 전환/마무리"
      description: "분위기를 바꾸거나 영상을 마무리하는 장면"
```

3. **전달하려는 감정** (AskUserQuestion 사용):
```
AskUserQuestion:
  question: "이 씬에서 시청자가 어떤 감정을 느끼길 원하시나요?"
  header: "감정"
  options:
    - label: "호기심/기대감"
      description: "궁금하게 만들고 다음이 보고 싶어지는 느낌"
    - label: "즐거움/재미"
      description: "밝고 경쾌하며 유쾌한 느낌"
    - label: "감동/따뜻함"
      description: "마음이 뭉클하거나 따뜻해지는 느낌"
    - label: "긴장감/몰입"
      description: "집중하게 만드는 긴장되고 빠져드는 느낌"
```

4. **예상 길이** (AskUserQuestion 사용):
```
AskUserQuestion:
  question: "이 씬은 얼마나 길게 생각하시나요?"
  header: "씬 길이"
  options:
    - label: "짧게 (5~15초)"
      description: "인서트, 전환, 짧은 컷 등"
    - label: "보통 (15~60초)"
      description: "한 가지 주제나 행동을 담는 일반적인 씬"
    - label: "길게 (1~3분)"
      description: "깊이 있는 설명이나 핵심 장면"
    - label: "매우 길게 (3분 이상)"
      description: "인터뷰, 긴 시퀀스 등"
```

5. **장소** (일반 텍스트): "어디서 촬영하나요? (실내/실외, 구체적인 장소)"

6. **등장인물** (일반 텍스트): "이 씬에 누가 등장하나요?"

### 2단계: 기법 추천

수집된 정보를 바탕으로 각 기법 스킬의 결정 매트릭스를 참조하여 추천하세요.

**촬영 기법** → `.claude/skills/cinematography/SKILL.md`의 결정 매트릭스를 참고하세요
- 씬의 감정과 목적에 맞는 샷 사이즈, 앵글, 카메라 무브먼트 추천
- 각 추천 기법에 쉬운 설명을 괄호로 덧붙이세요

**사운드 디자인** → `.claude/skills/sound-design/SKILL.md`의 결정 매트릭스를 참고하세요
- 씬 분위기에 맞는 BGM 장르/템포, SFX, 앰비언스 추천

**편집 기법** → `.claude/skills/editing/SKILL.md`의 결정 매트릭스를 참고하세요
- 씬 내부의 컷 리듬, 페이싱 추천

**색보정** → `.claude/skills/color-grading/SKILL.md`의 결정 매트릭스를 참고하세요
- 씬의 감정에 맞는 컬러 톤 추천

### 3단계: 피드백 반영

추천한 기법에 대해 `AskUserQuestion`으로 사용자의 의견을 받으세요:

```
AskUserQuestion:
  question: "추천 기법들이 마음에 드시나요?"
  header: "기법 피드백"
  options:
    - label: "전체 OK (Recommended)"
      description: "추천된 기법 그대로 진행합니다"
    - label: "일부 수정"
      description: "대체로 좋지만 일부 기법을 바꾸고 싶습니다"
    - label: "다시 추천"
      description: "다른 방향으로 전체적으로 다시 추천받고 싶습니다"
```

피드백을 반영하여 기법을 조정하세요.

### 4단계: 씬 간 전환 설계

현재 씬에서 다음 씬으로 넘어가는 전환 기법을 제안하세요.
`.claude/skills/editing/SKILL.md`의 트랜지션 매트릭스를 참고하세요.

전환 선택 시 고려할 점:
- 두 씬 사이의 감정 변화 (부드럽게? 급격하게?)
- 시간적 연속성 (같은 시간? 시간 경과?)
- 장소 변화 (같은 장소? 다른 장소?)

### 5단계: 씬 저장

완성된 씬을 `plans/drafts/{프로젝트명}-scene{N}.md`에 저장하세요.

```markdown
# 씬 {N}: {씬 제목}

## 기본 정보
- 목적: ...
- 감정: ...
- 예상 길이: ...
- 장소: ...
- 등장인물: ...

## 촬영 기법
- 샷 사이즈: ...
- 앵글: ...
- 카메라 무브먼트: ...
- 조명: ...

## 사운드
- BGM: ...
- SFX: ...
- 앰비언스: ...
- 나레이션: ...

## 편집
- 페이싱: ...
- 컷 방식: ...

## 색보정
- 컬러 톤: ...

## 다음 씬 전환
- 전환 기법: ...
- 이유: ...
```

---

## 씬 유형별 빠른 참조

| 씬 유형 | 참고할 기법 |
|---------|-------------|
| 인트로 (오프닝) | 와이드샷으로 시작, 훅(hook) 요소 우선 배치 |
| 감정적 클라이맥스 | 클로즈업, 슬로우모션, 감성 BGM |
| 정보 전달 | 미디엄샷, 안정적 구도, 명확한 나레이션 |
| 시간 경과 | 타임랩스, 몽타주, 디졸브 전환 |
| 아웃트로 | 와이드샷으로 마무리, 페이드아웃, CTA 자막 |

---

## 용어 설명

- **씬(Scene)**: 영상을 구성하는 하나의 장면 단위. 장소나 시간이 바뀌면 새로운 씬
- **페이싱(Pacing)**: 편집의 속도감. 빠른 컷은 긴장감, 느린 컷은 여유로운 분위기를 만듦
- **CTA(Call To Action)**: 시청자에게 행동을 유도하는 요소. "구독", "좋아요", "댓글" 등
- **훅(Hook)**: 시청자의 관심을 처음 3~5초 안에 잡아끄는 요소

## 참조

- 촬영 기법: `.claude/skills/cinematography/SKILL.md`
- 사운드: `.claude/skills/sound-design/SKILL.md`
- 편집: `.claude/skills/editing/SKILL.md`
- 색보정: `.claude/skills/color-grading/SKILL.md`
- 메인 워크플로우: `.claude/skills/first-cut/SKILL.md`
