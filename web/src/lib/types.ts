export interface GlossaryTerm {
  term: string;
  english?: string;
  description: string;
  category: string;
  relatedTerms?: string[];
}

export interface Technique {
  name: string;
  english?: string;
  category: string;
  description: string;
  whenToUse?: string;
  howToExecute?: string;
  commonMistakes?: string;
  examples?: string;
}

export interface DecisionMatrixRow {
  cells: string[];
}

export interface DecisionMatrix {
  skillName: string;
  tableName: string;
  description?: string;
  headers: string[];
  rows: DecisionMatrixRow[];
}

export interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  skillRef?: string;
  subSteps?: string[];
  inputs?: string[];
  outputs?: string[];
}

export interface SkillData {
  name: string;
  description?: string;
  decisionMatrices: DecisionMatrix[];
}

export interface WorkflowData {
  steps: WorkflowStep[];
  skills: { name: string; description: string; ref: string }[];
}
