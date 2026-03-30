# 노션 연동 설정 가이드

영상 기획서를 노션(Notion)에 동기화하여 팀과 공유하는 방법을 설명합니다.

---

## 사전 준비

1. [Notion](https://www.notion.so) 계정이 있어야 합니다
2. Claude Code가 설치되어 있어야 합니다
3. Notion MCP 서버 설정이 필요합니다

---

## 1단계: Notion MCP 서버 설정

### 1.1 Notion API 통합 생성

1. [Notion Developers](https://www.notion.so/my-integrations)에 접속합니다
2. "새 통합 만들기(New integration)"를 클릭합니다
3. 통합 이름을 입력합니다 (예: "first-cut")
4. 연결할 워크스페이스를 선택합니다
5. "제출(Submit)"을 클릭합니다
6. 생성된 **Internal Integration Token**을 복사합니다

### 1.2 Notion 페이지 권한 설정

기획서를 저장할 Notion 페이지에서:

1. 페이지 우측 상단의 "..." 메뉴를 클릭합니다
2. "연결(Connections)" > "연결 추가(Add connections)"를 선택합니다
3. 앞서 만든 통합("first-cut")을 선택합니다
4. "확인(Confirm)"을 클릭합니다

### 1.3 Claude Code 설정

Claude Code의 설정 파일에 Notion MCP 서버를 추가합니다:

```json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["-y", "@notionhq/notion-mcp-server"],
      "env": {
        "OPENAPI_MCP_HEADERS": "{\"Authorization\": \"Bearer <your-integration-token>\", \"Notion-Version\": \"2022-06-28\"}"
      }
    }
  }
}
```

`<your-integration-token>` 부분을 1.1 단계에서 복사한 토큰으로 교체합니다.

---

## 2단계: /notion-sync 사용하기

설정이 완료되면 기획서를 노션에 동기화할 수 있습니다:

```
/notion-sync
```

**예시 대화:**

```
사용자: /notion-sync

AI: 노션 연동을 시작합니다.
    기획서를 어느 페이지에 저장할까요?

사용자: "영상 프로젝트" 페이지 아래에 저장해줘

AI: "영상 프로젝트" 페이지를 찾았습니다.
    다음 내용을 노션에 동기화합니다:

    - 프로젝트 개요 페이지
    - 씬 리스트 데이터베이스
    - 촬영 체크리스트
    - 장비 목록

    진행할까요?

사용자: 네

AI: 노션 동기화가 완료되었습니다!
    - 프로젝트 개요: [링크]
    - 씬 리스트: [링크]
    - 체크리스트: [링크]
```

---

## 동기화되는 내용

| 항목 | 노션 형태 | 설명 |
|------|----------|------|
| 프로젝트 개요 | 페이지 | 영상 컨셉, 목적, 타겟 등 |
| 씬 리스트 | 데이터베이스 | 장면별 상세 기획 (필터/정렬 가능) |
| 촬영 체크리스트 | 체크리스트 | 촬영 당일 확인 사항 |
| 장비 목록 | 테이블 | 필요 장비와 수량 |
| 일정 | 캘린더 | 촬영/편집 일정 |

---

## 문제 해결

| 문제 | 해결 방법 |
|------|-----------|
| "Notion 연결 실패" | API 토큰이 올바른지 확인하세요 |
| "페이지를 찾을 수 없음" | 해당 페이지에 통합 권한이 추가되었는지 확인하세요 |
| "권한 부족" | Notion 통합 설정에서 적절한 권한(읽기/쓰기)이 부여되었는지 확인하세요 |
| MCP 서버 연결 오류 | `npx @notionhq/notion-mcp-server`를 직접 실행하여 오류 메시지를 확인하세요 |

---

## 참고

- 노션 연동은 선택 사항입니다. `/export-plan`으로 마크다운 파일을 내보내는 것만으로도 충분합니다.
- 동기화는 단방향(first-cut → Notion)입니다. 노션에서 수정한 내용은 first-cut에 반영되지 않습니다.
