import { USER } from "./USER";

export interface POST {
  _id: string;
  text: string;
  user: USER;
  image: string;
  likes: string[];
  comments: COMMENT[];
  createdAt: string;
  updatedAt: string;
}

export type COMMENT = {
  text: string;
  user: USER;
  _id: string;
};
