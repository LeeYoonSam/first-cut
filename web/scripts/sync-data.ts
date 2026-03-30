import { remark } from "remark";
import remarkGfm from "remark-gfm";
import { visit } from "unist-util-visit";
import { toString } from "mdast-util-to-string";
import * as fs from "fs";
import * as path from "path";
import type { Root, Heading, Table, TableRow, Paragraph, List } from "mdast";

// 프로젝트 루트 기준 경로 (web/scripts/ → web/ → first-cut/)
const ROOT = path.resolve(__dirname, "../../");
const DATA_OUT = path.resolve(__dirname, "../src/data");

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function parseMarkdown(content: string): Root {
  const processor = remark().use(remarkGfm);
  return processor.parse(content) as Root;
}

function readFile(filePath: string): string {
  return fs.readFileSync(filePath, "utf-8");
}

function writeJson(filePath: string, data: unknown) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  console.log(`  wrote: ${path.relative(ROOT, filePath)}`);
}

// 테이블 노드에서 헤더와 행 추출
function extractTable(tableNode: Table): { headers: string[]; rows: string[][] } {
  const rows: string[][] = [];
  let headers: string[] = [];

  tableNode.children.forEach((row: TableRow, rowIndex: number) => {
    const cells = row.children.map((cell) => toString(cell).trim());
    if (rowIndex === 0) {
      headers = cells;
    } else {
      rows.push(cells);
    }
  });

  return { headers, rows };
}

// ============================================================
// A) glossary.md 파싱
// ============================================================

// 참조 링크 파일명 → 기법 카테고리 매핑
const TECHNIQUE_CATEGORY_MAP: Record<string, string> = {
  "cinematography": "촬영",
  "directing": "연출",
  "editing": "편집",
  "sound-design": "사운드",
  "color-grading": "색보정",
  "vfx-motion": "VFX",
  "pre-production": "사전기획",
  "genre-specific": "장르",
};

// 키워드 기반 카테고리 추론 (참조 링크가 없는 용어용)
function inferCategory(term: string, description: string): string {
  const text = (term + " " + description).toLowerCase();
  if (/촬영|카메라|렌즈|앵글|샷|프레임|조리개|셔터|iso|노출|포커스|팬|틸트|달리|짐벌|드론|삼각대|기어/.test(text)) return "촬영";
  if (/편집|컷|트랜지션|전환|타임라인|시퀀스|프록시|자막|몽타주|렌더링/.test(text)) return "편집";
  if (/사운드|오디오|음향|녹음|믹싱|마이크|bgm|sfx|음악|나레이션|다이제틱|볼륨|데시벨|앰비언스|이퀄라이저|컴프레서|리버브/.test(text)) return "사운드";
  if (/색보정|컬러|그레이딩|lut|감마|화이트밸런스|색온도|채도|hue|톤|노출|로그\s*촬영|다이내믹\s*레인지|di/.test(text)) return "색보정";
  if (/vfx|모션|합성|크로마키|그린\s*스크린|로토스코핑|트래킹|파티클|cg|cgi|키프레임/.test(text)) return "VFX";
  if (/연출|미장센|블로킹|스토리보드|콘티|각본|시나리오|감독/.test(text)) return "연출";
  if (/사전기획|프리프로덕션|로케이션|섭외|캐스팅|예산|기획|래핑/.test(text)) return "사전기획";
  return "일반";
}

function parseGlossary() {
  console.log("\n[1/5] 용어집 파싱...");
  const content = readFile(path.join(ROOT, "docs/glossary.md"));
  const tree = parseMarkdown(content);

  const terms: Array<{
    term: string;
    english?: string;
    description: string;
    category: string;
    relatedTerms?: string[];
  }> = [];

  const nodes = tree.children;
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];

    if (node.type === "heading") {
      const headingNode = node as Heading;
      const text = toString(headingNode).trim();

      if (headingNode.depth === 3) {
        // ### 용어명 (영문명) 형태
        const termText = text;
        const parenMatch = termText.match(/^(.+?)\s*\(([^)]+)\)\s*$/);
        let termName: string;
        let englishName: string | undefined;

        if (parenMatch) {
          termName = parenMatch[1].trim();
          englishName = parenMatch[2].trim();
        } else {
          termName = termText;
          englishName = undefined;
        }

        // 다음 paragraph 노드에서 설명 + 참조 링크 추출
        let description = "";
        let category = "";
        const nextNode = nodes[i + 1];
        if (nextNode && nextNode.type === "paragraph") {
          const rawText = toString(nextNode as Paragraph).trim();

          // "→ [촬영 기법 문서](techniques/cinematography.md) 참고. 설명..." 패턴에서 카테고리 추출
          const refMatch = rawText.match(/→\s*\[.+?\]\(techniques\/([^)]+)\.md\)/);
          if (refMatch) {
            const techFile = refMatch[1];
            category = TECHNIQUE_CATEGORY_MAP[techFile] ?? "";
          }

          // 설명 추출: "→ [링크] 참고. 실제설명" 패턴 처리
          const arrowMatch = rawText.match(/^→.+?참고\.\s*(.+)$/s);
          if (arrowMatch) {
            description = arrowMatch[1].trim();
          } else {
            description = rawText;
          }
        }

        // 참조 링크가 없으면 키워드 기반 카테고리 추론
        if (!category) {
          category = inferCategory(termName, description);
        }

        terms.push({
          term: termName,
          english: englishName,
          description,
          category,
        });
      }
    }
  }

  // 가나다순 정렬
  terms.sort((a, b) => a.term.localeCompare(b.term, "ko"));

  ensureDir(DATA_OUT);
  writeJson(path.join(DATA_OUT, "glossary.json"), terms);

  // 카테고리 분포 출력
  const catCounts = new Map<string, number>();
  for (const t of terms) {
    catCounts.set(t.category, (catCounts.get(t.category) ?? 0) + 1);
  }
  console.log(`  총 ${terms.length}개 용어 파싱 완료`);
  console.log(`  카테고리 분포: ${[...catCounts.entries()].map(([k, v]) => `${k}(${v})`).join(", ")}`);
}

// ============================================================
// B) docs/techniques/*.md 파싱
// ============================================================
function parseTechniques() {
  console.log("\n[2/5] 기법 문서 파싱...");
  const techDir = path.join(ROOT, "docs/techniques");
  const techOutDir = path.join(DATA_OUT, "techniques");
  ensureDir(techOutDir);

  const files = fs.readdirSync(techDir).filter((f) => f.endsWith(".md"));

  for (const file of files) {
    const content = readFile(path.join(techDir, file));
    const tree = parseMarkdown(content);
    const techniques: Array<{
      name: string;
      english?: string;
      category: string;
      description: string;
      whenToUse?: string;
      howToExecute?: string;
      commonMistakes?: string;
      examples?: string;
    }> = [];

    let currentTechnique: (typeof techniques)[0] | null = null;
    let currentSubSection = "";

    const nodes = tree.children;
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];

      if (node.type === "heading") {
        const headingNode = node as Heading;
        const text = toString(headingNode).trim();

        if (headingNode.depth === 2 || headingNode.depth === 3) {
          // 서브섹션 키워드 확인
          const lowerText = text.toLowerCase();
          if (
            lowerText.includes("사용 시기") ||
            lowerText.includes("사용 상황") ||
            lowerText.includes("when to use")
          ) {
            currentSubSection = "whenToUse";
          } else if (
            lowerText.includes("실행 방법") ||
            lowerText.includes("how to") ||
            lowerText.includes("방법")
          ) {
            currentSubSection = "howToExecute";
          } else if (lowerText.includes("실수") || lowerText.includes("주의")) {
            currentSubSection = "commonMistakes";
          } else if (
            lowerText.includes("예시") ||
            lowerText.includes("예제") ||
            lowerText.includes("example")
          ) {
            currentSubSection = "examples";
          } else {
            // 새 기법 섹션
            if (currentTechnique) {
              techniques.push(currentTechnique);
            }
            currentSubSection = "description";

            // 번호 접두사 제거: "1. 와이드 샷 / 롱 샷 (Wide Shot / Long Shot)" → ...
            const cleanText = text.replace(/^\d+\.\s*/, "");
            const parenMatch = cleanText.match(/^(.+?)\s*[(/（]([^)/）]+)[)/）]\s*$/);
            let termName: string;
            let englishName: string | undefined;

            if (parenMatch) {
              termName = parenMatch[1].trim();
              englishName = parenMatch[2].trim();
            } else {
              termName = cleanText;
              englishName = undefined;
            }

            currentTechnique = {
              name: termName,
              english: englishName,
              category: file.replace(".md", ""),
              description: "",
            };
          }
        } else if (headingNode.depth === 4) {
          // #### 서브서브섹션
          const lowerText = text.toLowerCase();
          if (lowerText.includes("정의")) {
            currentSubSection = "description";
          } else if (lowerText.includes("사용")) {
            currentSubSection = "whenToUse";
          } else if (lowerText.includes("실행") || lowerText.includes("방법")) {
            currentSubSection = "howToExecute";
          } else if (lowerText.includes("실수") || lowerText.includes("주의")) {
            currentSubSection = "commonMistakes";
          } else if (lowerText.includes("예시")) {
            currentSubSection = "examples";
          }
        }
      } else if (node.type === "paragraph" || node.type === "list") {
        if (!currentTechnique) continue;
        const text = toString(node).trim();
        if (!text) continue;

        if (currentSubSection === "description" || !currentSubSection) {
          // bullet list 항목 파싱: "- **정의**: ..." 패턴 처리
          if (node.type === "list") {
            const listNode = node as List;
            for (const item of listNode.children) {
              const itemText = toString(item).trim();
              const defMatch = itemText.match(/^\*\*정의\*\*[:\s]+(.+)/s) ||
                itemText.match(/^정의[:\s]+(.+)/s);
              const useMatch = itemText.match(/^\*\*사용 상황\*\*[:\s]+(.+)/s) ||
                itemText.match(/^사용 상황[:\s]+(.+)/s);
              const effectMatch = itemText.match(/^\*\*감정적 효과\*\*[:\s]+(.+)/s);
              const exampleMatch = itemText.match(/^\*\*예시 장면\*\*[:\s]+(.+)/s);

              if (defMatch) currentTechnique.description = defMatch[1].trim();
              else if (useMatch) currentTechnique.whenToUse = useMatch[1].trim();
              else if (effectMatch)
                currentTechnique.howToExecute = effectMatch[1].trim();
              else if (exampleMatch)
                currentTechnique.examples = exampleMatch[1].trim();
            }
          } else {
            if (!currentTechnique.description) {
              currentTechnique.description = text;
            }
          }
        } else if (currentSubSection === "whenToUse") {
          currentTechnique.whenToUse = (currentTechnique.whenToUse || "") + text;
        } else if (currentSubSection === "howToExecute") {
          currentTechnique.howToExecute =
            (currentTechnique.howToExecute || "") + text;
        } else if (currentSubSection === "commonMistakes") {
          currentTechnique.commonMistakes =
            (currentTechnique.commonMistakes || "") + text;
        } else if (currentSubSection === "examples") {
          currentTechnique.examples = (currentTechnique.examples || "") + text;
        }
      }
    }

    if (currentTechnique) {
      techniques.push(currentTechnique);
    }

    const outFile = path.join(techOutDir, file.replace(".md", ".json"));
    writeJson(outFile, techniques);
    console.log(`  ${file}: ${techniques.length}개 기법`);
  }
}

// ============================================================
// C) .claude/skills/*/SKILL.md 파싱 → 결정 매트릭스 추출
// ============================================================
const TARGET_SKILLS = [
  "cinematography",
  "directing",
  "editing",
  "sound-design",
  "color-grading",
  "vfx-motion",
  "genre-guide",
  "pre-production",
];

function parseSkills() {
  console.log("\n[3/5] 스킬 결정 매트릭스 파싱...");
  const skillsOutDir = path.join(DATA_OUT, "skills");
  ensureDir(skillsOutDir);

  const allMatrices: Array<{
    skillName: string;
    tableName: string;
    description?: string;
    headers: string[];
    rows: Array<{ cells: string[] }>;
  }> = [];

  for (const skillName of TARGET_SKILLS) {
    const skillFile = path.join(
      ROOT,
      `.claude/skills/${skillName}/SKILL.md`
    );

    if (!fs.existsSync(skillFile)) {
      console.log(`  [skip] ${skillName}: 파일 없음`);
      continue;
    }

    const content = readFile(skillFile);
    const tree = parseMarkdown(content);

    // frontmatter에서 description 추출 (---...--- 블록)
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    let skillDescription = "";
    if (frontmatterMatch) {
      const descMatch = frontmatterMatch[1].match(/description:\s*(.+)/);
      if (descMatch) skillDescription = descMatch[1].trim();
    }

    const matrices: Array<{
      skillName: string;
      tableName: string;
      description?: string;
      headers: string[];
      rows: Array<{ cells: string[] }>;
    }> = [];

    let currentTableName = "";
    const nodes = tree.children;

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];

      if (node.type === "heading") {
        currentTableName = toString(node as Heading).trim();
      } else if (node.type === "table") {
        const { headers, rows } = extractTable(node as Table);
        if (headers.length > 0) {
          matrices.push({
            skillName,
            tableName: currentTableName,
            description: skillDescription,
            headers,
            rows: rows.map((r) => ({ cells: r })),
          });
        }
      }
    }

    const skillData = {
      name: skillName,
      description: skillDescription,
      decisionMatrices: matrices,
    };

    writeJson(path.join(skillsOutDir, `${skillName}.json`), skillData);
    console.log(`  ${skillName}: ${matrices.length}개 매트릭스`);

    allMatrices.push(...matrices);
  }

  // 통합 결정 매트릭스
  writeJson(path.join(DATA_OUT, "decision-matrices.json"), allMatrices);
  console.log(`  통합 결정 매트릭스: ${allMatrices.length}개`);
}

// ============================================================
// D) 워크플로우 데이터 파싱
// ============================================================
function parseWorkflow() {
  console.log("\n[4/5] 워크플로우 파싱...");

  const firstCutFile = path.join(ROOT, ".claude/skills/first-cut/SKILL.md");
  const fullWorkflowFile = path.join(ROOT, "docs/workflows/full-workflow.md");

  const content = readFile(firstCutFile);
  const tree = parseMarkdown(content);

  const steps: Array<{
    id: string;
    name: string;
    description: string;
    skillRef?: string;
    subSteps?: string[];
    inputs?: string[];
    outputs?: string[];
  }> = [];

  // SKILL.md에서 ### N단계: ... 패턴 파싱
  const nodes = tree.children;
  let currentStep: (typeof steps)[0] | null = null;

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];

    if (node.type === "heading") {
      const headingNode = node as Heading;
      const text = toString(headingNode).trim();

      // "### 0단계: 세션 재개 확인" 또는 "### 1단계: 아이디어 수집" 패턴
      const stepMatch = text.match(/^(\d+)단계[:\s：]+(.+)/);
      if (stepMatch && headingNode.depth === 3) {
        if (currentStep) {
          steps.push(currentStep);
        }
        const stepNum = stepMatch[1];
        const stepName = stepMatch[2].trim();

        // skillRef 추론
        let skillRef: string | undefined;
        const lowerName = stepName.toLowerCase();
        if (lowerName.includes("씬") || lowerName.includes("scene")) {
          skillRef = "scene-builder";
        } else if (lowerName.includes("벤치마크") || lowerName.includes("트렌드")) {
          skillRef = "benchmark";
        } else if (lowerName.includes("기획서") || lowerName.includes("내보내기")) {
          skillRef = "export-plan";
        } else if (lowerName.includes("노션")) {
          skillRef = "notion-sync";
        }

        currentStep = {
          id: `step-${stepNum}`,
          name: stepName,
          description: "",
          skillRef,
          subSteps: [],
        };
      }
    } else if (node.type === "paragraph" && currentStep) {
      const text = toString(node as Paragraph).trim();
      if (text && !currentStep.description) {
        currentStep.description = text;
      }
    } else if (node.type === "list" && currentStep) {
      const listNode = node as List;
      const items = listNode.children.map((item) =>
        toString(item).trim()
      );
      if (!currentStep.subSteps) currentStep.subSteps = [];
      currentStep.subSteps.push(...items);
    }
  }

  if (currentStep) {
    steps.push(currentStep);
  }

  // 워크플로우 스킬 목록 (CLAUDE.md 기준)
  const skills = [
    { name: "first-cut", description: "전체 영상 기획 워크플로우", ref: ".claude/skills/first-cut/SKILL.md" },
    { name: "cinematography", description: "촬영 기법 추천", ref: ".claude/skills/cinematography/SKILL.md" },
    { name: "sound-design", description: "사운드 디자인 추천", ref: ".claude/skills/sound-design/SKILL.md" },
    { name: "editing", description: "편집 기법 추천", ref: ".claude/skills/editing/SKILL.md" },
    { name: "directing", description: "연출 기법 추천", ref: ".claude/skills/directing/SKILL.md" },
    { name: "color-grading", description: "색보정 추천", ref: ".claude/skills/color-grading/SKILL.md" },
    { name: "pre-production", description: "사전 기획 체크리스트", ref: ".claude/skills/pre-production/SKILL.md" },
    { name: "genre-guide", description: "장르별 특화 기법", ref: ".claude/skills/genre-guide/SKILL.md" },
    { name: "vfx-motion", description: "VFX/모션 그래픽", ref: ".claude/skills/vfx-motion/SKILL.md" },
    { name: "benchmark", description: "벤치마크/트렌드 리서치", ref: ".claude/skills/benchmark/SKILL.md" },
    { name: "scene-builder", description: "씬 상세 구성", ref: ".claude/skills/scene-builder/SKILL.md" },
    { name: "export-plan", description: "최종 기획서 생성", ref: ".claude/skills/export-plan/SKILL.md" },
    { name: "notion-sync", description: "노션 동기화", ref: ".claude/skills/notion-sync/SKILL.md" },
  ];

  // full-workflow.md에서 추가 설명 보충
  if (fs.existsSync(fullWorkflowFile)) {
    const fwContent = readFile(fullWorkflowFile);
    const fwTree = parseMarkdown(fwContent);
    const fwNodes = fwTree.children;

    for (let i = 0; i < fwNodes.length; i++) {
      const node = fwNodes[i];
      if (node.type === "heading") {
        const text = toString(node as Heading).trim();
        const stepMatch = text.match(/^(\d+)단계[:\s：]+(.+)/);
        if (stepMatch) {
          const stepNum = stepMatch[1];
          const step = steps.find((s) => s.id === `step-${stepNum}`);
          if (step) {
            // 다음 paragraph로 설명 보충
            const nextNode = fwNodes[i + 1];
            if (nextNode && nextNode.type === "paragraph" && !step.description) {
              step.description = toString(nextNode as Paragraph).trim();
            }
          }
        }
      }
    }
  }

  writeJson(path.join(DATA_OUT, "workflow.json"), { steps, skills });
  console.log(`  워크플로우: ${steps.length}단계`);
}

// ============================================================
// E) 요약 통계
// ============================================================
function printSummary() {
  console.log("\n[5/5] 생성된 파일 확인...");
  const files = [
    path.join(DATA_OUT, "glossary.json"),
    path.join(DATA_OUT, "decision-matrices.json"),
    path.join(DATA_OUT, "workflow.json"),
  ];

  for (const f of files) {
    if (fs.existsSync(f)) {
      const data = JSON.parse(fs.readFileSync(f, "utf-8"));
      const count = Array.isArray(data) ? data.length : Object.keys(data).length;
      console.log(`  ${path.basename(f)}: ${count}개 항목`);
    }
  }

  const techDir = path.join(DATA_OUT, "techniques");
  if (fs.existsSync(techDir)) {
    const techFiles = fs.readdirSync(techDir);
    console.log(`  techniques/: ${techFiles.length}개 파일`);
  }

  const skillsDir = path.join(DATA_OUT, "skills");
  if (fs.existsSync(skillsDir)) {
    const skillFiles = fs.readdirSync(skillsDir);
    console.log(`  skills/: ${skillFiles.length}개 파일`);
  }
}

// ============================================================
// 메인 실행
// ============================================================
async function main() {
  console.log("=== first-cut 데이터 동기화 시작 ===");
  console.log(`소스 루트: ${ROOT}`);
  console.log(`출력 디렉토리: ${DATA_OUT}`);

  ensureDir(DATA_OUT);
  ensureDir(path.join(DATA_OUT, "techniques"));
  ensureDir(path.join(DATA_OUT, "skills"));

  parseGlossary();
  parseTechniques();
  parseSkills();
  parseWorkflow();
  printSummary();

  console.log("\n=== 동기화 완료 ===");
}

main().catch((err) => {
  console.error("오류 발생:", err);
  process.exit(1);
});
