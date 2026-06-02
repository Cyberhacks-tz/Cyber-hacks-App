export interface HomePost {
  id: string;
  title: string;
  image: string;
  link: string;
  createdAt?: any;
  reactions?: {
    laugh?: number;
    think?: number;
    angry?: number;
  };
  userReactions?: {
    [userId: string]: 'laugh' | 'think' | 'angry';
  };
  password?: string;
  passwordRequestMsg?: string;
}

export interface PremiumApp {
  id: string;
  name: string;
  description: string;
  image: string;
  downloadLink?: string;
  createdAt?: any;
  password?: string;
  passwordRequestMsg?: string;
}

export interface AiPrompt {
  id: string;
  image: string;
  promptText: string;
  createdAt?: any;
  title?: string;
  password?: string;
  passwordRequestMsg?: string;
}

export interface CyberNews {
  id: string;
  title: string;
  content: string;
  image?: string;
  createdAt?: any;
  password?: string;
  passwordRequestMsg?: string;
}

export interface CustomAd {
  id: string;
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
  email: string;
  displayName: string;
  photoURL: string;
  isPremium: boolean;
  role: 'admin' | 'user';
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
