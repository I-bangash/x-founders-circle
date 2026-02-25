import fs from "fs";
import path from "path";

const dbPath = path.join(process.cwd(), "local_db.json");

export interface User {
  _id?: string;
  id: string;
  twitterId: string;
  username: string;
  name: string;
  profileImageUrl: string;
  followersCount: number;
  joinedAt: number;
}

export interface Post {
  _id?: string;
  id: string;
  tweetId: string;
  authorTwitterId: string;
  authorUsername: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: number;
  fetchedAt: number;
  threadData?: any; // Store parsed threads for display
}

export interface Engagement {
  _id?: string;
  id: string;
  postId: string;
  twitterUserId: string;
  engagedAt: number;
}

export interface Database {
  users: User[];
  posts: Post[];
  engagements: Engagement[];
}

const defaultDb: Database = {
  users: [
    {
      id: "1",
      twitterId: "838395402277826560",
      username: "LightedCoach",
      name: "Francis Erokwu",
      profileImageUrl:
        "https://pbs.twimg.com/profile_images/1996549855401881600/a2fOwZsh_normal.jpg",
      followersCount: 2281,
      joinedAt: Date.now(),
    },
    {
      id: "2",
      twitterId: "1676928696341475328",
      username: "artyatskevich",
      name: "Artyom Yatskevich",
      profileImageUrl:
        "https://pbs.twimg.com/profile_images/1888684387962662913/gwsq14YD_normal.jpg",
      followersCount: 121,
      joinedAt: Date.now(),
    },
    {
      id: "3",
      twitterId: "1958209503091916800",
      username: "JoseInNorte",
      name: "Jose Sanchez",
      profileImageUrl:
        "https://pbs.twimg.com/profile_images/1974369256977436673/eVOfur6P_normal.jpg",
      followersCount: 684,
      joinedAt: Date.now(),
    },
  ],
  posts: [],
  engagements: [],
};

export function getDb(): Database {
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify(defaultDb, null, 2));
    return defaultDb;
  }
  const data = fs.readFileSync(dbPath, "utf8");
  return JSON.parse(data);
}

export function saveDb(db: Database) {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}
