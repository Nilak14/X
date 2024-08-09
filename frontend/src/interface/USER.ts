export interface USER {
  likedPost: string[];
  _id: string;
  username: string;
  fullName: string;
  email?: string;
  followers: string[];
  following: string[];
  profileImg: string;
  coverImg: string;
  bio: string;
  link: string;
  createdAt: string;
  updatedAt: string;
  password?: string;
}
