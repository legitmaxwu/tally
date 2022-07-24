export type Question = {
  title: string;
  description: string;
};

export type Answer = {
  questionId: string;
  text: string;
  upvotes: number;
  timestamp: number;
};
