export interface HomePost {
  id: string;
  authorId?: string;
  title: string;
  image: string;
  link: string;
  createdAt?: any;
  reactions?: {
    like?: number;
  };
  userReactions?: {
    [userId: string]: 'like';
  };
  password?: string;
  passwordRequestMsg?: string;
}

export interface PremiumApp {
  id: string;
  authorId?: string;
  name: string;
  description: string;
  image: string;
  downloadLink?: string;
  createdAt?: any;
  password?: string;
  passwordRequestMsg?: string;
  reactions?: { like?: number };
  userReactions?: { [userId: string]: 'like' };
}

export interface AiPrompt {
  id: string;
  authorId?: string;
  image: string;
  promptText: string;
  createdAt?: any;
  title?: string;
  password?: string;
  passwordRequestMsg?: string;
  reactions?: { like?: number };
  userReactions?: { [userId: string]: 'like' };
}

export interface CyberNews {
  id: string;
  authorId?: string;
  title: string;
  content: string;
  image?: string;
  createdAt?: any;
  password?: string;
  passwordRequestMsg?: string;
  reactions?: { like?: number };
  userReactions?: { [userId: string]: 'like' };
}

export interface CustomAd {
  id: string;
  authorId?: string;
  title: string;
  mediaUrls: string[];
  mediaType: 'image' | 'video';
  transitionType: 'fade' | 'slide' | 'zoom' | 'flip' | 'bounce';
  displayTiming: 'startup' | 'interval';
  intervalMinutes?: number;
  durationDays?: number;
  expiresAt?: number;
  isActive: boolean;
  soundUrl?: string;
  audioStartTime?: number;
  autoCloseSeconds?: number;
  adLinkUrl?: string;
  cancelAction?: 'dismiss' | 'link';
  cancelLinkUrl?: string;
  createdAt?: any;
}

export interface UserProfile {
  uid: string;
  authorId?: string;
  email: string;
  displayName: string;
  photoURL: string;
  isPremium: boolean;
  followers?: string[];
  following?: string[];
  role: 'admin' | 'user';
  verified?: boolean;
  verifiedType?: '1' | '2';
  banned?: boolean;
  lastActiveDate?: string;
  createdAt?: any;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string;
    email?: string | null;
    emailVerified?: boolean;
    isAnonymous?: boolean;
    tenantId?: string | null;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}
