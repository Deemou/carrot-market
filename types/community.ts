import { Answer, Post, User } from '@prisma/client';

interface AnswerWithUser extends Answer {
  user: User;
}

interface PostWithUser extends Post {
  user: User;
  _count: {
    answers: number;
    wonderings: number;
  };
  answers: AnswerWithUser[];
}

export interface CommunityPostResponse {
  ok: boolean;
  post: PostWithUser;
  isWondering: boolean;
}

export interface IPostForm {
  question: string;
}

export interface PostResponse {
  ok: boolean;
  post: Post;
}

export interface IAnswerForm {
  answer: string;
}

export interface AnswerResponse {
  ok: boolean;
  Answer: Answer;
}
