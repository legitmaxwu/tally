export type Question = {
  title: string;
  descriptionHtml: string;
};

export type Answer = {
  questionId: string;
  text: string;
  upvotes: number;
  timestamp: number;
};
