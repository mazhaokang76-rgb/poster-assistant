export interface PosterTextData {
  title: string;
  intro: string;
  facts: string;
  relations: string;
}

export interface PosterState {
  topic: string;
  grade: string;
  isLoading: boolean;
  generatedText: PosterTextData | null;
  generatedImage: string | null;
  date: string;
}

export enum GradeLevel {
  PRIMARY_LOW = "小学低年级 (1-2年级)",
  PRIMARY_HIGH = "小学高年级 (3-6年级)",
  JUNIOR = "初中",
  SENIOR = "高中"
}