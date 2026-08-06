/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut, 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { 
  collection, 
  onSnapshot, 
  doc, 
  getDoc, 
  setDoc, 
  addDoc, 
  deleteDoc, 
  updateDoc,
  query,
  where,
  orderBy,
  getDocFromServer,
  serverTimestamp,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { 
  Home, 
  Shield, 
  MessageSquare, 
  Settings, 
  LogOut, 
  User as UserIcon, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Download, 
  Moon, 
  Sun,
  Lock,
  Globe,
  Phone,
  Users,
  Info,
  ChevronRight,
  Mail,
  Key,
  Search, ChevronLeft,
  X,
  Pencil,
  Send,
  HelpCircle,
  Bell,
  Newspaper,
  Check,
  Copy,
  Eye,
  EyeOff,
  Heart,
  Share2,
  Languages,
  Loader2,
  MonitorPlay,
  RefreshCw,
  BadgeCheck,
  Ban
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { auth, db, googleProvider, storage } from './firebase';
import { GoogleGenAI } from '@google/genai';
import { HomePost, PremiumApp, CyberNews, UserProfile, CustomAd, AiPrompt, OperationType, FirestoreErrorInfo } from './types';
import { cn } from './lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const translations = {
  en: {
    welcome: "Welcome back",
    home: "Home",
    premium: "Premium",
    chat: "AI PROMT",
    settings: "Settings",
    profile: "Profile",
    eliteAccess: "Elite Access to Cyber Resources",
    googleLogin: "Continue with Google",
    or: "or",
    email: "Email address",
    password: "Password",
    signIn: "Sign In",
    noHacks: "No hacks found yet.",
    addNewHack: "Add New Hack",
    freeAccess: "FREE ACCESS",
    enjoyFree: "Enjoy elite APKs and tools for free.",
    noApps: "No premium apps listed.",
    addPremiumApp: "Add Premium App",
    hackerAi: "Hacker AI",
    aiDesc: "Get instant answers to your cyber security questions.",
    launchChat: "Launch AI PROMT",
    language: "Language",
    theme: "Theme",
    support: "Support & Community",
    contactWa: "Contact WhatsApp",
    officialGroup: "Official Group",
    legal: "Legal",
    privacy: "Privacy Policy",
    signOut: "Sign Out",
    freeMember: "Free Member",
    premiumMember: "Premium Member",
    noAccount: "Don't have an account?",
    hasAccount: "Already have an account?",
    signUp: "Sign Up",
    login: "Login",
    forgotPassword: "Forgot Password?",
    resetEmailSent: "Password reset link sent to your email!",
    sendResetLink: "Send Reset Link",
    enterTitle: "Enter title:",
    enterImageUrl: "Enter image URL:",
    enterLink: "Enter link:",
    enterAppName: "Enter app name:",
    enterDescription: "Enter description:",
    enterDownloadLink: "Enter download link:",
    langName: "English",
    searchPlaceholder: "Search hacks or apps...",
    add: "Add",
    edit: "Edit",
    cancel: "Cancel",
    title: "Title",
    imageUrl: "Image URL or Upload",
    link: "Link",
    appName: "App Name",
    description: "Description",
    downloadLink: "Download Link",
    deleteConfirm: "Are you sure you want to delete this?",
    delete: "Delete",
    selectImage: "Select Image File",
    update: "Update",
    feedback: "Feedback & Support",
    feedbackDesc: "Tell us your suggestions or report an issue.",
    feedbackPlaceholder: "Type your message here...",
    submit: "Submit",
    feedbackSent: "Feedback sent successfully!",
    newPostNotification: "New hack added!",
    logoutConfirm: "Are you sure you want to log out?",
    yes: "Yes",
    no: "No",
    cyberNews: "Cyber News",
    noNews: "No news available.",
    addNews: "Add News",
    seeMore: "See more...",
    seeLess: "See less",
    content: "Content",
    passwordPrompt: "Enter Password",
    enterPassword: "Enter password to access",
    getPassword: "Get Password",
    incorrectPassword: "Incorrect password",
    passwordOptional: "Password (Optional)",
    processing: "Processing...",
    pleaseWait: "Please wait as we redirect you..."
  },
  sw: {
    welcome: "Karibu tena",
    home: "Nyumbani",
    premium: "Premium",
    chat: "AI PROMT",
    settings: "Mipangilio",
    profile: "Profaili",
    eliteAccess: "Ufikiaji wa Wasomi kwa Rasilimali za Mtandao",
    googleLogin: "Endelea na Google",
    or: "au",
    email: "Anwani ya barua pepe",
    password: "Nenosiri",
    signIn: "Ingia",
    noHacks: "Hakuna hacks zilizopatikana bado.",
    addNewHack: "Ongeza Hack Mpya",
    freeAccess: "UFIKIAJI WA BURE",
    enjoyFree: "Furahia APK na zana za wasomi bila malipo.",
    noApps: "Hakuna programu za premium zilizoorodheshwa.",
    addPremiumApp: "Ongeza Programu ya Premium",
    hackerAi: "Hacker AI",
    aiDesc: "Pata majibu ya papo hapo kwa maswali yako ya usalama wa mtandao.",
    launchChat: "Anzisha AI PROMT",
    language: "Lugha",
    theme: "Mandhari",
    support: "Msaada na Jamii",
    contactWa: "Wasiliana na WhatsApp",
    officialGroup: "Kikundi Rasmi",
    legal: "Kisheria",
    privacy: "Sera ya Faragha",
    signOut: "Ondoka",
    freeMember: "Mwanachama wa Bure",
    premiumMember: "Mwanachama wa Premium",
    noAccount: "Hauna akaunti?",
    hasAccount: "Tayari una akaunti?",
    signUp: "Jisajili",
    login: "Ingia",
    forgotPassword: "Umesahau Nenosiri?",
    resetEmailSent: "Link ya kubadilisha nenosiri imetumwa kwenye email yako!",
    sendResetLink: "Tuma Link ya Kubadilisha",
    enterTitle: "Ingiza kichwa:",
    enterImageUrl: "Ingiza URL ya picha:",
    enterLink: "Ingiza kiungo:",
    enterAppName: "Ingiza jina la programu:",
    enterDescription: "Ingiza maelezo:",
    enterDownloadLink: "Ingiza kiungo cha kupakua:",
    langName: "Kiswahili",
    searchPlaceholder: "Tafuta hacks au programu...",
    add: "Ongeza",
    edit: "Hariri",
    cancel: "Ghairi",
    title: "Kichwa",
    imageUrl: "URL ya Picha au Pakia",
    link: "Kiungo",
    appName: "Jina la Programu",
    description: "Maelezo",
    downloadLink: "Kiungo cha Kupakua",
    deleteConfirm: "Je, una uhakika unataka kufuta hii?",
    delete: "Futa",
    selectImage: "Chagua Picha",
    update: "Sasisha",
    feedback: "Maoni na Msaada",
    feedbackDesc: "Tuambie mapendekezo yako au ripoti tatizo.",
    feedbackPlaceholder: "Andika ujumbe wako hapa...",
    submit: "Tuma",
    feedbackSent: "Maoni yametumwa kikamilifu!",
    newPostNotification: "Hack mpya imeongezwa!",
    logoutConfirm: "Je, una uhakika unataka kuondoka?",
    yes: "Ndiyo",
    no: "Hapana",
    cyberNews: "Habari za Mtandao",
    noNews: "Hakuna habari zilizopo.",
    addNews: "Ongeza Habari",
    seeMore: "Soma zaidi...",
    seeLess: "Funga",
    content: "Yaliyomo",
    passwordPrompt: "Weka Nenosiri",
    enterPassword: "Weka nenosiri kufungua",
    getPassword: "Pata Nenosiri",
    incorrectPassword: "Nenosiri sio sahihi",
    passwordOptional: "Nenosiri (Sio lazima)",
    processing: "Inafungua...",
    pleaseWait: "Tafadhali subiri..."
  }
};

type Language = 'en' | 'sw';

// Error Handler
function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  // In a real app, we might show a toast or alert here
}

// --- Custom Events & Helpers ---
export const handleExternalLink = (url: string) => {
  window.dispatchEvent(new CustomEvent('show-link-loader'));
  setTimeout(() => {
    window.open(url, '_blank');
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('hide-link-loader'));
    }, 2000);
  }, 50);
};

// --- Components ---

const preprocessMarkdown = (text: string) => {
  if (!text) return '';
  let processed = text;
  
  // 1. Add spaces before http/https if missing (e.g. "Join:https://..." -> "Join: https://...")
  processed = processed.replace(/([^ \n\[\(<])(https?:\/\/)/gi, '$1 $2');
  
  // 2. Prefix common links and bare domains (e.g., Richard.com, t.me, wa.me) with https://
  // Matches domain structures and stops at spaces or closing brackets
  const domainRegex = /(^|[\s\(\[<])(wa\.me\/[^\s\)\]>]+|t\.me\/[^\s\)\]>]+|([a-zA-Z0-9-]+\.)+(com|net|org|io|me|co|tz|xyz|site|link|app|info|biz)(?:\/[^\s\)\]>]*)?)/gi;
  processed = processed.replace(domainRegex, (match, prefix, url) => {
    if (url.toLowerCase().startsWith('http')) return match;
    return prefix + 'https://' + url;
  });

  return processed;
};

const CodeBlock = ({ inline, className, children, ...props }: any) => {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const isInline = inline || (!match && !className?.includes('language-'));
  
  if (!isInline && match) {
    const codeString = String(children).replace(/\n$/, '');
    const handleCopy = () => {
      navigator.clipboard.writeText(codeString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };
    return (
      <div className="relative group mt-4 mb-4 rounded-xl overflow-hidden border border-zinc-800">
        <div className="flex justify-between items-center bg-zinc-900 px-4 py-2 border-b border-zinc-800">
          <span className="text-xs text-zinc-400 font-mono uppercase">{match[1]}</span>
          <button 
            onClick={handleCopy} 
            className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-medium"
          >
            {copied ? <><Check size={14} className="text-green-400" /> Copied</> : <><Copy size={14} /> Copy</>}
          </button>
        </div>
        <SyntaxHighlighter
          style={vscDarkPlus as any}
          language={match[1]}
          PreTag="div"
          customStyle={{ margin: 0, padding: '1rem', background: '#18181b', fontSize: '0.875rem' }}
          {...props}
        >
          {codeString}
        </SyntaxHighlighter>
        
      
      
    </div>
  );
}
  
  return (
    <code className={cn("bg-zinc-800 px-1.5 py-0.5 rounded text-sm text-green-400 font-mono", className)} {...props}>
      {children}
    </code>
  );
};

const MarkdownRenderer = ({ content }: { content: string }) => {
  return (
    <div className="markdown-body whitespace-pre-wrap text-zinc-300 leading-relaxed text-lg">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={{
          a: ({ node, href, ...props }) => (
            <a 
              href={href}
              className="!text-blue-500 !underline hover:!text-blue-400 break-words cursor-pointer" 
              onClick={(e) => {
                e.preventDefault();
                if (href) handleExternalLink(href);
              }}
              {...props} 
            />
          ),
          code: CodeBlock
        }}
      >
        {preprocessMarkdown(content)}
      </ReactMarkdown>

      

      
      
      
    </div>
  );
};

const PasswordModal = ({ isOpen, onClose, onSuccess, expectedPassword, requestMessage, t }: { isOpen: boolean, onClose: () => void, onSuccess: () => void, expectedPassword?: string, requestMessage?: string, t: (k: string) => string }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [colorIndex, setColorIndex] = useState(0);
  const colors = ['text-red-500', 'text-green-400', 'text-blue-500', 'text-yellow-500', 'text-purple-500'];

  useEffect(() => {
    if (!isOpen) {
      setInput('');
      setError(false);
      setShowPassword(false);
      return;
    }
    const interval = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % colors.length);
    }, 500);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === expectedPassword) {
      setError(false);
      setInput('');
      setShowPassword(false);
      onSuccess();
      onClose();
    } else {
      setError(true);
    }
  };

  const handleGetPassword = () => {
    const text = encodeURIComponent(requestMessage || '『App』password from app');
    handleExternalLink(`https://wa.me/255686586707?text=${text}`);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative w-full max-w-xs bg-zinc-900 border border-zinc-800 rounded-3xl p-6 text-center shadow-2xl"
      >
        <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-purple-600/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <Key size={32} />
        </div>
        <h3 className="text-lg font-bold mb-4">{t('passwordPrompt')}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"}
              value={input}
              onChange={(e) => { setInput(e.target.value); setError(false); }}
              placeholder={t('enterPassword')}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 pr-12 focus:outline-none focus:border-purple-500 text-center"
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {error && <p className="text-red-500 text-xs">{t('incorrectPassword')}</p>}
          <button 
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-green-600 to-purple-600 text-zinc-100 font-bold rounded-xl hover:bg-green-600 transition-colors"
          >
            {t('submit')}
          </button>
          <button 
            type="button"
            onClick={handleGetPassword}
            className={`w-full py-2 font-black uppercase tracking-wider transition-colors duration-300 ${colors[colorIndex]}`}
          >
            {t('getPassword')}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

const Navbar = ({ activeTab, setActiveTab, t, theme }: { activeTab: string, setActiveTab: (t: string) => void, t: (k: string) => string, theme: string }) => {
  const tabs = [
    { id: 'home', icon: Home, label: t('home') },
    { id: 'premium', icon: Shield, label: t('premium') },
    { id: 'news', icon: Newspaper, label: t('cyberNews') },
    { id: 'chat', label: 'AI✦' },
    { id: 'profile', icon: UserIcon, label: t('profile') },
  ];

  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 backdrop-blur-xl border-t px-6 py-3 z-50 transition-colors",
      theme === 'dark' ? "bg-black/80 border-white/5" : "bg-white/80 border-zinc-200"
    )}>
      <div className="max-w-md mx-auto flex justify-between items-center">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex flex-col items-center justify-center min-w-[50px] gap-1 transition-colors relative",
              activeTab === tab.id 
                ? (theme === 'dark' ? "text-green-400" : "text-green-600") 
                : (theme === 'dark' ? "text-zinc-500 hover:text-zinc-300" : "text-zinc-400 hover:text-zinc-600")
            )}
          >
            {tab.id === 'chat' ? (
               <div className="flex items-center justify-center font-black tracking-tighter text-lg leading-none h-[24px]">
                 AI<span className="text-purple-500 ml-[1px]">✦</span>
               </div>
            ) : (
               tab.icon && <tab.icon size={24} />
            )}
            <span className="text-[10px] font-bold uppercase tracking-wider">{tab.id === 'chat' ? 'PROMPT' : tab.label}</span>
            {activeTab === tab.id && (
              <motion.div
                layoutId="nav-indicator"
                className={cn("absolute -top-4 w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.8)]", theme === 'dark' ? "bg-green-400" : "bg-green-600")}
              />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};

interface CardProps {
  title: string;
  image: string;
  link?: string;
  onClick?: () => void;
  isAdmin?: boolean;
  canEdit?: boolean;
  onDelete?: () => void;
  onEdit?: () => void;
  reactions?: { like?: number };
  userReaction?: 'like' | null;
  onReact?: (type: 'like') => void;
  createdAt?: any;
  password?: string;
  passwordRequestMsg?: string;
  t: (k: string) => string;
  index?: number;
  author?: UserProfile;
  onAuthorClick?: () => void;
  currentUserId?: string;
  onFollowToggle?: (targetUid: string) => void;
}

const Card: React.FC<CardProps> = ({ title, image, link, onClick, isAdmin, canEdit, onDelete, onEdit, reactions, userReaction, onReact, createdAt, password, passwordRequestMsg, t, index = 0, author, onAuthorClick, currentUserId, onFollowToggle }) => {
  const [isOpening, setIsOpening] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  
  const isLiked = userReaction === 'like';

  const handleOpen = async () => {
    if (password && password.trim() !== '' && !isAdmin) {
      setShowPasswordPrompt(true);
      return;
    }
    if (onClick) {
      onClick();
      return;
    }
    if (link) {
      setIsOpening(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      handleExternalLink(link);
      setIsOpening(false);
    }
  };

  const executeOpen = async () => {
    if (onClick) {
      onClick();
      return;
    }
    if (link) {
      setIsOpening(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      handleExternalLink(link);
      setIsOpening(false);
    }
  };

  return (
    <>
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-xl group cursor-pointer relative flex flex-col transition-colors"
    >
      {isOpening && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full"
          />
          <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest animate-pulse">Connecting...</span>
        </div>
      )}
      {(isAdmin || canEdit) && (
      <div className="absolute top-2 right-2 z-10 flex gap-2">
        {password && isAdmin && (
          <div className="px-2 py-1 bg-black/80 text-green-400 rounded text-[10px] font-mono flex items-center gap-1">
            <Key size={10} /> {password}
          </div>
        )}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onEdit?.();
          }}
          className="p-2 bg-gradient-to-r from-green-600 to-purple-600/80 text-white rounded-full hover:bg-green-600 transition-colors"
        >
          <Pencil size={14} />
        </button>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.();
          }}
          className="p-2 bg-red-500/80 text-white rounded-full hover:bg-red-600 transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </div>
    )}
    <div className="p-3" onClick={handleOpen}>
      <h3 className="text-sm font-semibold dark:text-zinc-100 text-zinc-100 truncate">
        {title} {password && password.trim() !== '' && <span className="ml-1" title="Premium">👑</span>}
      </h3>
    </div>
    <div className="aspect-square relative overflow-hidden" onClick={handleOpen}>
      {image ? (
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
          <Globe size={32} className="text-zinc-700" />
        </div>
      )}
      <div className="absolute bottom-2 right-2 z-10 flex gap-2">
        {author && currentUserId && author.uid !== currentUserId && onFollowToggle && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFollowToggle(author.uid);
            }}
            className={cn("px-3 py-1 rounded-full text-[10px] font-bold transition-colors shadow-lg backdrop-blur-md border border-white/10", 
              author.followers?.includes(currentUserId) 
              ? "bg-black/50 text-white hover:bg-black/70" 
              : "bg-blue-600/90 text-white hover:bg-blue-600"
            )}
          >
            {author.followers?.includes(currentUserId) ? 'Following' : 'Follow'}
          </button>
        )}
      </div>
    </div>
    <div className="p-3 flex justify-between items-center bg-zinc-50 dark:bg-zinc-800/50">
      <div className="flex items-center gap-2 flex-1 min-w-0" onClick={(e) => {
        if(onAuthorClick) { e.stopPropagation(); onAuthorClick(); }
      }}>
        {author?.photoURL ? (
          <img src={author.photoURL} alt={author.displayName} className="w-6 h-6 rounded-full flex-shrink-0 object-cover border border-zinc-200 dark:border-zinc-700" />
        ) : (
          <div className="w-6 h-6 rounded-full flex-shrink-0 bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center">
            <UserIcon size={12} className="text-zinc-500 dark:text-zinc-400" />
          </div>
        )}
        <div className="flex flex-col items-start min-w-0">
          <div className="flex items-center">
            <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:underline truncate">{author?.displayName || 'User'}</span>
            {author?.verified && <BadgeCheck size={12} className="text-blue-500 ml-1 flex-shrink-0" />}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2 flex-shrink-0">
        
        <motion.button
        whileTap={{ scale: 0.8 }}
        onClick={(e) => {
          e.stopPropagation();
          onReact?.('like');
        }}
        className={cn(
          "flex items-center gap-1 text-xs px-2 py-1 rounded-full transition-colors duration-300",
          isLiked ? "bg-red-900/30 text-red-500" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-red-500"
        )}
      >
        <Heart size={12} className={(userReaction === "like") ? "fill-red-500 text-red-500" : "fill-transparent text-zinc-800 dark:text-zinc-300"} />
      </motion.button>
      </div>
    </div>
  </motion.div>
  <PasswordModal 
    isOpen={showPasswordPrompt}
    onClose={() => setShowPasswordPrompt(false)}
    onSuccess={executeOpen}
    expectedPassword={password}
    requestMessage={passwordRequestMsg}
    t={t}
  />
  </>);
};

interface PremiumCardProps {
  app: PremiumApp;
  isPremium: boolean;
  onDownload: () => void;
  isAdmin?: boolean;
  canEdit?: boolean;
  onDelete?: () => void;
  onEdit?: () => void;
  t: (k: string) => string;
  index?: number;
  author?: UserProfile;
  onAuthorClick?: () => void;
  reactions?: { like?: number };
  userReaction?: 'like' | null;
  onReact?: (type: 'like') => void;
  currentUserId?: string;
  onFollowToggle?: (targetUid: string) => void;
}
const PremiumCard: React.FC<PremiumCardProps> = ({ app, onDownload, isAdmin, canEdit, onDelete, onEdit, t, index = 0, author, onAuthorClick, reactions, userReaction, onReact, currentUserId, onFollowToggle }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDownload = async () => {
    if (app.password && app.password.trim() !== '' && !isAdmin) {
      setShowPasswordPrompt(true);
      return;
    }
    executeDownload();
  };

  const executeDownload = async () => {
    setIsDownloading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    onDownload();
    setIsDownloading(false);
  };

  return (
    <>
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800 flex flex-col gap-4 shadow-lg relative overflow-hidden"
    >
      {isDownloading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 z-20 bg-black/40 backdrop-blur-[1px] flex items-center justify-center"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <Download size={24} className="text-green-400" />
          </motion.div>
        </motion.div>
      )}
      <div className="flex gap-4 items-center">
        <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-zinc-800">
          {app.image ? (
            <img src={app.image} alt={app.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Shield size={24} className="text-zinc-700" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-zinc-100 truncate">
            {app.name} {app.password && app.password.trim() !== '' && <span className="ml-1" title="Premium">👑</span>}
          </h3>
          <div className="relative">
            <p className={cn("text-xs text-zinc-400 whitespace-pre-wrap", !isExpanded && "line-clamp-2")}>
              {app.description || ''}
            </p>
            {((app.description || '').length > 50 || (app.description || '').includes('\n')) && (
              <button 
                onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }} 
                className="text-xs text-green-400 font-medium mt-1 hover:underline"
              >
                {isExpanded ? t('seeLess') : t('seeMore')}
              </button>
            )}
          </div>
          {(isAdmin || canEdit) && app.password && (
            <div className="mt-1 px-2 py-0.5 bg-black/80 text-green-400 rounded text-[10px] font-mono inline-flex items-center gap-1">
              <Key size={10} /> {app.password}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2 shrink-0">
          <button 
            onClick={handleDownload}
            className="p-3 rounded-xl transition-all bg-gradient-to-r from-green-600 to-purple-600 text-zinc-100 hover:from-green-500 hover:to-purple-500"
          >
            <Download size={20} />
          </button>
          {isAdmin && (
            <div className="flex gap-2">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.();
                }}
                className="p-3 bg-zinc-800 text-zinc-400 rounded-xl hover:bg-zinc-700 transition-colors"
              >
                <Pencil size={20} />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.();
                }}
                className="p-3 bg-red-500/20 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center justify-between border-t border-zinc-800 pt-3">
        <div className="flex items-center gap-3 cursor-pointer flex-1 min-w-0" onClick={(e) => {
          if(onAuthorClick) { e.stopPropagation(); onAuthorClick(); }
        }}>
          {author?.photoURL ? (
            <img src={author.photoURL} alt={author.displayName} className="w-8 h-8 rounded-full flex-shrink-0 object-cover border border-zinc-600" />
          ) : (
            <div className="w-8 h-8 rounded-full flex-shrink-0 bg-zinc-700 flex items-center justify-center border border-zinc-600">
              <UserIcon size={14} className="text-zinc-400" />
            </div>
          )}
          <div className="flex items-center min-w-0">
            <span className="text-xs font-bold text-zinc-200 hover:underline truncate">{author?.displayName || 'User'}</span>
            {author?.verified && <BadgeCheck size={14} className="text-blue-500 ml-1 flex-shrink-0" />}
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          {author && currentUserId && author.uid !== currentUserId && onFollowToggle && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFollowToggle(author.uid);
              }}
              className={cn("px-4 py-1.5 rounded-full text-[10px] font-bold transition-colors shadow-sm", 
                author.followers?.includes(currentUserId) 
                ? "bg-zinc-800 text-zinc-400" 
                : "bg-blue-600 text-white hover:bg-blue-700"
              )}
            >
              {author.followers?.includes(currentUserId) ? 'Following' : 'Follow'}
            </button>
          )}
          <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={(e) => { e.stopPropagation(); onReact?.('like'); }}
          className={`flex items-center gap-1 text-[10px] px-2 py-1 rounded-full transition-colors duration-300 ${userReaction === 'like' ? 'bg-red-900/30 text-red-500' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-red-500'}`}
        >
          <Heart size={12} className={(userReaction === "like") ? "fill-red-500 text-red-500" : "fill-transparent text-zinc-800 dark:text-zinc-300"} />
        </motion.button>
        </div>
      </div>
    </motion.div>
    <PasswordModal 
      isOpen={showPasswordPrompt}
      onClose={() => setShowPasswordPrompt(false)}
      onSuccess={executeDownload}
      expectedPassword={app.password}
      requestMessage={app.passwordRequestMsg}
      t={t}
    />
    </>
  );
};

interface AiPromptCardProps {
  prompt: AiPrompt;
  isAdmin?: boolean;
  canEdit?: boolean;
  onDelete?: () => void;
  onEdit?: () => void;
  onClick: () => void;
  index?: number;
  author?: UserProfile;
  onAuthorClick?: () => void;
  reactions?: { like?: number };
  userReaction?: 'like' | null;
  onReact?: (type: 'like') => void;
  currentUserId?: string;
  onFollowToggle?: (targetUid: string) => void;
}
const AiPromptCard: React.FC<AiPromptCardProps> = ({ prompt, isAdmin, canEdit, onDelete, onEdit, onClick, index = 0, author, onAuthorClick, reactions, userReaction, onReact, currentUserId, onFollowToggle }) => {
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [pendingAction, setPendingAction] = useState<'view' | 'copy' | null>(null);
  const [copied, setCopied] = useState(false);

  const handleAction = (action: 'view' | 'copy') => {
    if (prompt.password && prompt.password.trim() !== '' && !isAdmin) {
      setPendingAction(action);
      setShowPasswordPrompt(true);
    } else {
      executeAction(action);
    }
  };

  const executeAction = (action: 'view' | 'copy') => {
    if (action === 'view') {
      onClick();
    } else {
      navigator.clipboard.writeText(prompt.promptText || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      className="relative rounded-[2.5rem] overflow-hidden w-full aspect-[4/5] sm:h-[420px] sm:aspect-auto group cursor-pointer shadow-xl border-2 border-white/5 dark:border-white/10"
      onClick={() => handleAction('view')}
    >
      {prompt.image ? (
        <img 
          src={prompt.image} 
          alt={prompt.title || 'AI Prompt'} 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-tr from-purple-100 via-white to-zinc-50 dark:from-purple-950 dark:via-zinc-900 dark:to-black flex items-center justify-center">
          <MessageSquare size={48} className="text-purple-900/20 dark:text-purple-300/10" />
        </div>
      )}
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end opacity-80 group-hover:opacity-100 transition-opacity duration-300">
        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 mb-10 sm:mb-14">
          <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-3 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
            <div className="px-3 py-1 bg-purple-500/20 text-purple-300 text-[10px] font-black uppercase tracking-widest rounded-full border border-purple-500/30 backdrop-blur-md">
              AI Prompt
            </div>
            {prompt.password && (
              <div className="px-3 py-1 bg-yellow-500/20 text-yellow-500 text-[10px] font-black uppercase tracking-widest rounded-full border border-yellow-500/30 backdrop-blur-md flex items-center gap-1">
                <Lock size={10} /> Protected
              </div>
            )}
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white leading-tight drop-shadow-lg line-clamp-2">
            {prompt.title || 'Untitled Prompt'}
          </h3>
          <p className="mt-1 text-zinc-300 text-xs sm:text-sm line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75">
            {prompt.promptText}
          </p>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-3 sm:p-5 flex gap-2 justify-center pointer-events-none opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            handleAction('view');
          }}
          className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 bg-black/60 text-white px-2 sm:px-4 py-3 sm:py-4 rounded-2xl font-bold hover:bg-black/80 transition-all backdrop-blur-xl border border-white/20 active:scale-95 text-[10px] sm:text-xs pointer-events-auto"
        >
          <Eye size={18} className="sm:hidden" />
          <Eye size={16} className="hidden sm:block" />
          <span>View Prompt</span>
        </button>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            handleAction('copy');
          }}
          className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 bg-white/90 text-black px-2 sm:px-4 py-3 sm:py-4 rounded-2xl font-bold hover:bg-white transition-all backdrop-blur-xl active:scale-95 border border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.1)] text-[10px] sm:text-xs pointer-events-auto"
        >
          {copied ? <Check size={18} className="text-green-600 sm:hidden" /> : <Copy size={18} className="sm:hidden" />}
          {copied ? <Check size={16} className="text-green-600 hidden sm:block" /> : <Copy size={16} className="hidden sm:block" />}
          <span>{copied ? 'Copied' : 'Copy Prompt'}</span>
        </button>
      </div>

      <div className="absolute top-3 left-3 z-20 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-lg" onClick={(e) => {
        if(onAuthorClick) { e.stopPropagation(); onAuthorClick(); }
      }}>
        {author?.photoURL ? (
          <img src={author.photoURL} alt={author.displayName} className="w-8 h-8 rounded-full flex-shrink-0 object-cover border border-zinc-600" />
        ) : (
          <div className="w-8 h-8 rounded-full flex-shrink-0 bg-zinc-700 flex items-center justify-center border border-zinc-600">
            <UserIcon size={14} className="text-zinc-400" />
          </div>
        )}
        <div className="flex items-center min-w-0 mr-1">
          <span className="text-xs font-bold text-zinc-100 hover:underline truncate">{author?.displayName || 'User'}</span>
          {author?.verified && <BadgeCheck size={14} className="text-blue-500 ml-1 flex-shrink-0" />}
        </div>
        {author && currentUserId && author.uid !== currentUserId && onFollowToggle && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFollowToggle(author.uid);
            }}
            className={cn("px-3 py-1 ml-1 rounded-full text-[10px] font-bold transition-colors shadow-sm", 
              author.followers?.includes(currentUserId) 
              ? "bg-white/20 text-zinc-100 hover:bg-white/30" 
              : "bg-blue-600 text-white hover:bg-blue-500"
            )}
          >
            {author.followers?.includes(currentUserId) ? 'Following' : 'Follow'}
          </button>
        )}
      </div>

      {(isAdmin || canEdit) && (
        <div className="absolute top-3 right-3 flex gap-2 z-20" onClick={e => e.stopPropagation()}>
          <button 
             onClick={(e) => { e.stopPropagation(); onEdit?.(); }} 
             className="w-8 h-8 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-md text-zinc-300 hover:text-white hover:bg-black/70 transition-colors"
          >
             <Pencil size={14} />
          </button>
          <button 
             onClick={(e) => { e.stopPropagation(); onDelete?.(); }} 
             className="w-8 h-8 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-md text-red-400 hover:text-red-500 hover:bg-black/70 transition-colors"
          >
             <Trash2 size={14} />
          </button>
        </div>
      )}
    </motion.div>
    <PasswordModal 
      isOpen={showPasswordPrompt}
      onClose={() => setShowPasswordPrompt(false)}
      onSuccess={() => {
        setShowPasswordPrompt(false);
        if (pendingAction) {
          executeAction(pendingAction);
        }
      }}
      expectedPassword={prompt.password}
      requestMessage={prompt.passwordRequestMsg}
      t={(k) => k}
    />
    </>
  );
};

interface NewsCardProps {
  news: CyberNews;
  isAdmin?: boolean;
  canEdit?: boolean;
  onDelete?: () => void;
  onEdit?: () => void;
  onClick: () => void;
  t: (k: string) => string;
  index?: number;
  author?: UserProfile;
  onAuthorClick?: () => void;
  reactions?: { like?: number };
  userReaction?: 'like' | null;
  onReact?: (type: 'like') => void;
  currentUserId?: string;
  onFollowToggle?: (targetUid: string) => void;
}
const NewsCard: React.FC<NewsCardProps> = ({ news, isAdmin, canEdit, onDelete, onEdit, onClick, t, index = 0, author, onAuthorClick, reactions, userReaction, onReact, currentUserId, onFollowToggle }) => {
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);

  const handleOpen = () => {
    if (news.password && news.password.trim() !== '' && !isAdmin) {
      setShowPasswordPrompt(true);
    } else {
      onClick();
    }
  };

  return (
    <>
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="relative rounded-3xl overflow-hidden aspect-[3/4] group cursor-pointer shadow-xl border border-zinc-800"
      onClick={handleOpen}
    >
      {news.image ? (
        <img 
          src={news.image} 
          alt={news.title} 
          className="absolute inset-0 w-full h-full object-cover blur-[2px] brightness-50 group-hover:blur-none transition-all duration-500"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="absolute inset-0 bg-zinc-800 flex items-center justify-center">
          <Newspaper size={48} className="text-zinc-700" />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      
      {(isAdmin || canEdit) && (
        <div className="absolute top-3 right-3 z-10 flex gap-2">
          {news.password && (
            <div className="px-2 py-1 bg-black/80 text-green-400 rounded text-[10px] font-mono flex items-center gap-1">
              <Key size={10} /> {news.password}
            </div>
          )}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.();
            }}
            className="p-2 bg-gradient-to-r from-green-600 to-purple-600/80 text-white rounded-full hover:bg-green-600 transition-colors"
          >
            <Pencil size={14} />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.();
            }}
            className="p-2 bg-red-500/80 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
          {news.title} {news.password && news.password.trim() !== '' && <span className="ml-1" title="Premium">👑</span>}
        </h3>
        <p className="text-sm text-zinc-300 line-clamp-2">{news.content}</p>
        <span className="text-green-400 text-xs font-bold mt-2 block">{t('seeMore')}</span>

        <div className="mt-3 flex items-center justify-between border-t border-zinc-700/50 pt-2">
          <div className="flex items-center gap-3 cursor-pointer flex-1 min-w-0" onClick={(e) => {
            if(onAuthorClick) { e.stopPropagation(); onAuthorClick(); }
          }}>
            {author?.photoURL ? (
              <img src={author.photoURL} alt={author.displayName} className="w-8 h-8 rounded-full flex-shrink-0 object-cover border border-zinc-700" />
            ) : (
              <div className="w-8 h-8 rounded-full flex-shrink-0 bg-zinc-700 flex items-center justify-center">
                <UserIcon size={14} className="text-zinc-400" />
              </div>
            )}
            <div className="flex items-center min-w-0">
              <span className="text-xs font-bold text-zinc-200 hover:underline truncate">{author?.displayName || 'User'}</span>
              {author?.verified && <BadgeCheck size={14} className="text-blue-500 ml-1 flex-shrink-0" />}
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            {author && currentUserId && author.uid !== currentUserId && onFollowToggle && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onFollowToggle(author.uid);
                }}
                className={cn("px-4 py-1.5 rounded-full text-[10px] font-bold transition-colors shadow-sm", 
                  author.followers?.includes(currentUserId) 
                  ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700" 
                  : "bg-blue-600 text-white hover:bg-blue-500"
                )}
              >
                {author.followers?.includes(currentUserId) ? 'Following' : 'Follow'}
              </button>
            )}
            <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={(e) => { e.stopPropagation(); onReact?.('like'); }}
            className={`flex items-center gap-1 text-[10px] px-2 py-1 rounded-full transition-colors duration-300 ${userReaction === 'like' ? 'bg-red-900/30 text-red-500' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-red-500'}`}
          >
            <Heart size={12} className={(userReaction === "like") ? "fill-red-500 text-red-500" : "fill-transparent text-zinc-800 dark:text-zinc-300"} />
          </motion.button>
          </div>
        </div>

      </div>
    </motion.div>
    <PasswordModal 
      isOpen={showPasswordPrompt}
      onClose={() => setShowPasswordPrompt(false)}
      onSuccess={onClick}
      expectedPassword={news.password}
      requestMessage={news.passwordRequestMsg}
      t={t}
    />
    </>
  );
};

const DOODLE_PATTERN = `url("data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`;

let _ai: GoogleGenAI | null = null;
const getAI = () => {
  if (!_ai) {
    // Process is injected by Vite plugins in AI Studio
    const apiKey = (process.env as any).GEMINI_API_KEY || (import.meta as any).env.VITE_GEMINI_API_KEY;
    if (apiKey) {
      _ai = new GoogleGenAI({ apiKey });
    }
  }
  return _ai;
};

const translateText = async (text: string, targetLang: 'en' | 'sw'): Promise<string> => {
  try {
    const ai = getAI();
    if (!ai) return text;
    const prompt = `You are a professional translator. Translate the following news content to ${targetLang === 'sw' ? 'Swahili (Kiswahili)' : 'English'}. Preserve all markdown formatting, URLs, and code blocks exactly as they are. Output only the translated text.\n\n${text}`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || text;
  } catch (error) {
    console.error("Translation error", error);
    return text;
  }
};

const THEMES = [
  "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1531297172867-133649692408?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1515630278258-407f66498911?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&q=80&w=2000"
];

const StaticChatBackground = () => {
    const [themeUrl] = useState(() => THEMES[Math.floor(Math.random() * THEMES.length)]);

    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img src={themeUrl} alt="Background" className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-screen" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/80 to-black" />
      </div>
    );
};

const NewsDetailModal = ({ news, onClose, t }: { news: CyberNews | null, onClose: () => void, t: (k: string) => string }) => {
  const [translatedNews, setTranslatedNews] = useState<CyberNews | null>(news);
  const [targetLang, setTargetLang] = useState<'en' | 'sw' | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    setTranslatedNews(news);
    setTargetLang(null);
  }, [news]);

  const handleTranslate = async (lang: 'en' | 'sw') => {
    if (!news) return;
    if (targetLang === lang) return;
    
    setIsTranslating(true);
    setTargetLang(lang);
    try {
      const translatedTitle = await translateText(news.title, lang);
      const translatedContent = await translateText(news.content, lang);
      setTranslatedNews({
        ...news,
        title: translatedTitle,
        content: translatedContent
      });
    } catch (e) {
      console.error(e);
      // fallback
    } finally {
      setIsTranslating(false);
    }
  };

  if (!news || !translatedNews) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, y: "100%" }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="relative w-full max-w-2xl bg-black text-zinc-100 sm:rounded-3xl rounded-t-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
      >
        {translatedNews.image ? (
           <div className="absolute inset-0 overflow-hidden pointer-events-none">
             <img src={translatedNews.image} alt="Background" className="absolute inset-0 w-full h-full object-cover opacity-20 blur-[2px]" referrerPolicy="no-referrer" />
             <div className="absolute inset-0 bg-black/60" />
             <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/80 to-black" />
           </div>
        ) : (
           <StaticChatBackground />
        )}
        
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          {(!targetLang || targetLang === 'en') ? (
             <button 
               onClick={() => handleTranslate('sw')} 
               disabled={isTranslating}
               className="px-3 py-1.5 bg-black/60 text-white rounded-full backdrop-blur-md hover:bg-black/80 transition-colors flex items-center gap-2 text-sm font-medium disabled:opacity-50"
             >
               {isTranslating ? <Loader2 size={16} className="animate-spin" /> : <Languages size={16} />}
               Tafsiri Kiswahili
             </button>
          ) : (
            <button 
               onClick={() => handleTranslate('en')} 
               disabled={isTranslating}
               className="px-3 py-1.5 bg-black/60 text-white rounded-full backdrop-blur-md hover:bg-black/80 transition-colors flex items-center gap-2 text-sm font-medium disabled:opacity-50"
             >
               {isTranslating ? <Loader2 size={16} className="animate-spin" /> : <Languages size={16} />}
               Translate English
             </button>
          )}

          <button onClick={onClose} className="p-2 bg-black/50 text-white rounded-full backdrop-blur-md hover:bg-black/70 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="overflow-y-auto flex-1 relative z-10 p-6 sm:p-8 pt-16">
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-6 leading-tight">{translatedNews.title}</h2>
            <MarkdownRenderer content={translatedNews.content} />
        </div>
      </motion.div>
    </div>
  );
};

const AiPromptDetailModal = ({ prompt, onClose }: { prompt: AiPrompt | null, onClose: () => void }) => {
  const [showText, setShowText] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!prompt) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.promptText || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (showText) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 pb-20 sm:pb-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowText(false)}
          className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl h-[85vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl border border-white/10"
        >
          <div className="absolute inset-0 z-0">
             <img src={prompt.image} alt={prompt.title || 'AI Prompt'} className="w-full h-full object-cover opacity-30 blur-xl scale-110" referrerPolicy="no-referrer" />
             <div className="absolute inset-0 bg-black/60 mix-blend-multiply" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/80" />
          </div>

          <div className="flex items-center justify-between p-6 relative z-10 border-b border-white/10 bg-black/40 backdrop-blur-md shrink-0">
             <h2 className="text-xl sm:text-2xl font-black text-white drop-shadow-md truncate pr-4">{prompt.title || 'AI PROMPT'}</h2>
             <button onClick={() => setShowText(false)} className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-colors shrink-0">
                <X size={20} />
             </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 relative z-10 custom-scrollbar">
             <div className="bg-black/60 rounded-2xl p-6 border border-white/10 backdrop-blur-md shadow-inner min-h-full">
               <MarkdownRenderer content={prompt.promptText} />
             </div>
          </div>

          <div className="p-6 relative z-10 border-t border-white/10 bg-black/40 backdrop-blur-md shrink-0 flex justify-end">
            <button 
               onClick={handleCopy}
               className="flex items-center gap-2 bg-white text-zinc-100 px-6 py-3 rounded-2xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
               {copied ? <Check size={18} /> : <Copy size={18} />}
               {copied ? 'Copied!' : 'Copy Prompt'}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/95 backdrop-blur-2xl">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0"
        onClick={onClose}
      />
      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 sm:top-8 sm:right-8 p-4 text-white hover:text-red-400 z-50 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-all active:scale-95"
      >
        <X size={24} />
      </button>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-4xl max-h-[85vh] flex flex-col items-center justify-center pointer-events-none"
      >
        <div className="w-full pb-[100px] pointer-events-auto">
          {prompt.image ? (
            <img 
              src={prompt.image} 
              alt={prompt.title || 'AI Prompt'} 
              className="max-w-full max-h-[65vh] object-contain rounded-2xl drop-shadow-2xl mx-auto" 
              referrerPolicy="no-referrer" 
            />
          ) : (
            <div className="w-full max-w-lg aspect-square mx-auto bg-zinc-900 rounded-2xl flex items-center justify-center border border-white/5">
              <MessageSquare size={64} className="text-white/10" />
            </div>
          )}
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="absolute bottom-6 sm:bottom-12 left-0 right-0 flex justify-center gap-3 sm:gap-6 px-4 z-50 pointer-events-auto"
      >
        <button 
          onClick={() => setShowText(true)}
          className="flex-1 max-w-[180px] sm:max-w-[220px] shadow-2xl flex items-center justify-center gap-2 bg-zinc-800 text-white px-4 sm:px-6 py-4 sm:py-5 rounded-2xl font-bold hover:bg-zinc-700 transition-all border border-white/10 hover:border-white/30 active:scale-95"
        >
          <Eye size={20} />
          <span className="hidden sm:inline">View Prompt</span>
          <span className="sm:hidden">View</span>
        </button>
        <button 
          onClick={handleCopy}
          className="flex-1 max-w-[180px] sm:max-w-[220px] shadow-2xl flex items-center justify-center gap-2 bg-white text-zinc-100 px-4 sm:px-6 py-4 sm:py-5 rounded-2xl font-bold hover:bg-gray-200 transition-all active:scale-95 border border-white/20"
        >
          {copied ? <Check size={20} className="text-green-600" /> : <Copy size={20} />}
          {copied ? 'Copied' : <><span className="hidden sm:inline">Copy Prompt</span><span className="sm:hidden">Copy</span></>}
        </button>
      </motion.div>
    </div>
  );
};

const AddModal = ({ 
  isOpen, 
  onClose, 
  onAdd, 
  type, 
  t,
  initialData,
  isAdmin
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  onAdd: (data: any) => Promise<void>, 
  type: 'post' | 'app' | 'news' | 'aiprompt',
  t: (k: string) => string,
  initialData?: any,
  isAdmin?: boolean
}) => {
  const [formData, setFormData] = useState<any>(initialData || {});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFormData(initialData || {});
  }, [initialData]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Compress to JPEG to reduce size significantly
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          setFormData({ ...formData, image: dataUrl });
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-xl font-bold mb-6 text-green-400">
          {initialData ? t('edit') : (type === 'post' ? t('addNewHack') : type === 'news' ? t('addNews') : t('addPremiumApp'))}
        </h2>
        
        <div className="space-y-4">
          {type === 'post' ? (
            <>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-2">{t('title')}</label>
                <input 
                  autoFocus
                  value={formData.title || ''}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 focus:outline-none focus:border-purple-500 transition-colors"
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-2">{t('imageUrl')}</label>
                <div className="flex gap-2">
                  <input 
                    value={formData.image || ''}
                    className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 focus:outline-none focus:border-purple-500 transition-colors"
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://..."
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3 bg-zinc-800 border border-zinc-700 rounded-xl hover:bg-zinc-700 transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
                {formData.image && (
                  <div className="mt-2 w-20 h-20 rounded-xl overflow-hidden border border-zinc-700">
                    <img src={formData.image} className="w-full h-full object-cover" alt="Preview" />
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-2">{t('link')}</label>
                <input 
                  value={formData.link || ''}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 focus:outline-none focus:border-purple-500 transition-colors"
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                />
              </div>
              {isAdmin && (
                <>
                  <div className="space-y-1">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-2">{t('passwordOptional')}</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={formData.password || ''}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 pr-12 focus:outline-none focus:border-purple-500 transition-colors"
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-2">WhatsApp Request Text (Optional)</label>
                <input 
                  value={formData.passwordRequestMsg || ''}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 focus:outline-none focus:border-purple-500 transition-colors"
                  onChange={(e) => setFormData({ ...formData, passwordRequestMsg: e.target.value })}
                  placeholder="『App』password from app"
                />
              </div>
                </>
              )}

            </>
          ) : type === 'news' ? (
            <>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-2">{t('title')}</label>
                <input 
                  autoFocus
                  value={formData.title || ''}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 focus:outline-none focus:border-purple-500 transition-colors"
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-2">{t('content')}</label>
                <textarea 
                  value={formData.content || ''}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 focus:outline-none focus:border-purple-500 transition-colors h-32 resize-none"
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-2">{t('imageUrl')}</label>
                <div className="flex gap-2">
                  <input 
                    value={formData.image || ''}
                    className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 focus:outline-none focus:border-purple-500 transition-colors"
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://..."
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3 bg-zinc-800 border border-zinc-700 rounded-xl hover:bg-zinc-700 transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
                {formData.image && (
                  <div className="mt-2 w-20 h-20 rounded-xl overflow-hidden border border-zinc-700">
                    <img src={formData.image} className="w-full h-full object-cover" alt="Preview" />
                  </div>
                )}
              </div>
              {isAdmin && (
                <>
                  <div className="space-y-1">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-2">{t('passwordOptional')}</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={formData.password || ''}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 pr-12 focus:outline-none focus:border-purple-500 transition-colors"
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-2">WhatsApp Request Text (Optional)</label>
                <input 
                  value={formData.passwordRequestMsg || ''}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 focus:outline-none focus:border-purple-500 transition-colors"
                  onChange={(e) => setFormData({ ...formData, passwordRequestMsg: e.target.value })}
                  placeholder="『App』password from app"
                />
              </div>
                </>
              )}

            </>
          ) : type === 'aiprompt' ? (
            <>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-2">Prompt Title</label>
                <input 
                  autoFocus
                  value={formData.title || ''}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 focus:outline-none focus:border-purple-500 transition-colors"
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Code Review Prompt"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-2">Prompt Text</label>
                <textarea 
                  value={formData.promptText || ''}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 focus:outline-none focus:border-purple-500 transition-colors h-32 resize-none"
                  onChange={(e) => setFormData({ ...formData, promptText: e.target.value })}
                  placeholder="Act as a senior developer..."
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-2">Background Image URL</label>
                <div className="flex gap-2">
                  <input 
                    value={formData.image || ''}
                    className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 focus:outline-none focus:border-purple-500 transition-colors"
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://..."
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3 bg-zinc-800 border border-zinc-700 rounded-xl hover:bg-zinc-700 transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
                {formData.image && (
                  <div className="mt-2 w-20 h-20 rounded-xl overflow-hidden border border-zinc-700">
                    <img src={formData.image} className="w-full h-full object-cover" alt="Preview" />
                  </div>
                )}
              </div>
              {isAdmin && (
                <>
                  <div className="space-y-1">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-2">{t('passwordOptional')}</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={formData.password || ''}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 pr-12 focus:outline-none focus:border-purple-500 transition-colors"
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-2">WhatsApp Request Text (Optional)</label>
                <input 
                  value={formData.passwordRequestMsg || ''}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 focus:outline-none focus:border-purple-500 transition-colors"
                  onChange={(e) => setFormData({ ...formData, passwordRequestMsg: e.target.value })}
                  placeholder="『App』password from app"
                />
              </div>
                </>
              )}

            </>
          ) : (
            <>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-2">{t('appName')}</label>
                <input 
                  autoFocus
                  value={formData.name || ''}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 focus:outline-none focus:border-purple-500 transition-colors"
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-2">{t('description')}</label>
                <textarea 
                  value={formData.description || ''}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 focus:outline-none focus:border-purple-500 transition-colors h-24 resize-none"
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-2">{t('imageUrl')}</label>
                <div className="flex gap-2">
                  <input 
                    value={formData.image || ''}
                    className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 focus:outline-none focus:border-purple-500 transition-colors"
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://..."
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3 bg-zinc-800 border border-zinc-700 rounded-xl hover:bg-zinc-700 transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
                {formData.image && (
                  <div className="mt-2 w-20 h-20 rounded-xl overflow-hidden border border-zinc-700">
                    <img src={formData.image} className="w-full h-full object-cover" alt="Preview" />
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-2">{t('downloadLink')}</label>
                <input 
                  value={formData.downloadLink || ''}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 focus:outline-none focus:border-purple-500 transition-colors"
                  onChange={(e) => setFormData({ ...formData, downloadLink: e.target.value })}
                />
              </div>
              {isAdmin && (
                <>
                  <div className="space-y-1">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-2">{t('passwordOptional')}</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={formData.password || ''}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 pr-12 focus:outline-none focus:border-purple-500 transition-colors"
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-2">WhatsApp Request Text (Optional)</label>
                <input 
                  value={formData.passwordRequestMsg || ''}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 focus:outline-none focus:border-purple-500 transition-colors"
                  onChange={(e) => setFormData({ ...formData, passwordRequestMsg: e.target.value })}
                  placeholder="『App』password from app"
                />
              </div>
                </>
              )}

            </>
          )}
        </div>

        <div className="flex gap-3 mt-8">
          <button 
            onClick={onClose}
            className="flex-1 py-4 bg-zinc-800 text-zinc-400 font-bold rounded-2xl hover:bg-zinc-700 transition-colors"
          >
            {t('cancel')}
          </button>
          <button 
            onClick={async () => {
              if (isSubmitting) return;
              setIsSubmitting(true);
              const dataToSubmit = { ...formData };
              if (!dataToSubmit.password || dataToSubmit.password.trim() === '') {
                delete dataToSubmit.password;
              } else {
                dataToSubmit.password = dataToSubmit.password.trim();
              }
              if (!dataToSubmit.passwordRequestMsg || dataToSubmit.passwordRequestMsg.trim() === '') {
                delete dataToSubmit.passwordRequestMsg;
              } else {
                dataToSubmit.passwordRequestMsg = dataToSubmit.passwordRequestMsg.trim();
              }
              try {
                await onAdd(dataToSubmit);
              } catch (e) {
                console.error(e);
              } finally {
                setIsSubmitting(false);
              }
            }}
            disabled={isSubmitting}
            className="flex-1 py-4 bg-gradient-to-r from-green-600 to-purple-600 text-zinc-100 font-bold rounded-2xl hover:from-green-500 hover:to-purple-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-black border-t-transparent rounded-full"
                />
                Processing...
              </>
            ) : (
              initialData ? t('update') : t('add')
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const AdminAudioPreview = ({ soundUrl, audioStartTime }: { soundUrl: string, audioStartTime: string }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  
  useEffect(() => {
    if (audioRef.current && soundUrl) {
      audioRef.current.currentTime = parseFloat(audioStartTime) || 0;
    }
  }, [audioStartTime, soundUrl]);

  return (
    <>
      <audio 
        ref={audioRef}
        src={soundUrl} 
        autoPlay 
        onEnded={(e) => {
          e.currentTarget.currentTime = parseFloat(audioStartTime) || 0;
          e.currentTarget.play();
        }}
        onLoadedMetadata={(e) => {
          e.currentTarget.currentTime = parseFloat(audioStartTime) || 0;
        }}
      />
      <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 z-20 flex items-center gap-2">
         <span className="w-2 h-2 rounded-full bg-gradient-to-r from-green-600 to-purple-600 animate-pulse" />
         <span className="text-[10px] text-white font-bold uppercase tracking-widest">Audio Playing</span>
      </div>
    </>
  );
};

const AdminAdsManager = ({ t, onBack }: { t: (k: string) => string; onBack: () => void }) => {
  const [ads, setAds] = useState<CustomAd[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [title, setTitle] = useState('');
  const [mediaUrls, setMediaUrls] = useState<string[]>(['']);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [transitionType, setTransitionType] = useState<'fade' | 'slide' | 'zoom' | 'flip' | 'bounce'>('fade');
  const [displayTiming, setDisplayTiming] = useState<'startup' | 'interval'>('startup');
  const [intervalMinutes, setIntervalMinutes] = useState('5');
  const [durationDays, setDurationDays] = useState('7');
  const [isActive, setIsActive] = useState(true);
  
  const [soundUrl, setSoundUrl] = useState('');
  const [audioStartTime, setAudioStartTime] = useState('0');
  const [autoCloseSeconds, setAutoCloseSeconds] = useState('0');
  const [adLinkUrl, setAdLinkUrl] = useState('');
  const [cancelAction, setCancelAction] = useState<'dismiss' | 'link'>('dismiss');
  const [cancelLinkUrl, setCancelLinkUrl] = useState('');

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'ads'), (snap) => {
      setAds(snap.docs.map(d => ({ id: d.id, ...d.data() } as CustomAd)));
    });
    return unsub;
  }, []);

  const handleFileUpload = async (index: number | 'sound', file: File) => {
    if (!file) return;
    
    // Check file size (Firestore limit is ~1MB, block video/audio if > 750KB)
    if (!file.type.startsWith('image/')) {
      if (file.size > 750 * 1024) {
        alert('KOSA: File ulilochagua ni kubwa sana kwa mfumo huu. Hakikisha audio/video haizidi 700KB.\n\nUSHAURI: Tafadhali upload File hilo sehemu nyingine kisha uweke Link (URL) yake hapa.');
        return;
      }
    } else if (file.size > 3 * 1024 * 1024) {
        alert('WARNING: Image is very large and might fail to load. Processing anyway...');
    }

    setIsUploading(true);
    
    try {
      if (file.type.startsWith('image/')) {
        // Compress image like in AddModal
        const reader = new FileReader();
        reader.onloadend = () => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 800;
            const MAX_HEIGHT = 800;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);
            
            const url = canvas.toDataURL('image/jpeg', 0.8);
            if (index === 'sound') {
              setSoundUrl(url);
            } else {
              const newUrls = [...mediaUrls];
              newUrls[index] = url;
              setMediaUrls(newUrls);
            }
            setIsUploading(false);
          };
          img.src = reader.result as string;
        };
        reader.readAsDataURL(file);
      } else {
        // Audio or Video: just read as base64
        const reader = new FileReader();
        reader.onloadend = () => {
          const url = reader.result as string;
          if (index === 'sound') {
            setSoundUrl(url);
          } else {
            const newUrls = [...mediaUrls];
            newUrls[index] = url;
            setMediaUrls(newUrls);
          }
          setIsUploading(false);
        };
        reader.readAsDataURL(file);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed: ' + (error as Error).message);
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    
    // Clean empty URLs
    const urls = mediaUrls.filter(u => u.trim() !== '');
    if (urls.length === 0) return;

    setIsSaving(true);
    try {
      const expiresAt = Date.now() + (parseInt(durationDays) || 7) * 24 * 60 * 60 * 1000;
      await addDoc(collection(db, 'ads'), {
        title,
        mediaUrls: urls,
        mediaType,
        transitionType,
        displayTiming,
        intervalMinutes: parseInt(intervalMinutes) || 5,
        durationDays: parseInt(durationDays) || 7,
        expiresAt,
        isActive,
        soundUrl: soundUrl.trim() || null,
        audioStartTime: parseFloat(audioStartTime) || 0,
        autoCloseSeconds: parseFloat(autoCloseSeconds) || 0,
        adLinkUrl: adLinkUrl.trim() || null,
        cancelAction,
        cancelLinkUrl: cancelLinkUrl.trim() || null,
        createdAt: serverTimestamp()
      });
      setIsEditing(false);
      setTitle('');
      setMediaUrls(['']);
      setMediaType('image');
      setTransitionType('fade');
      setDisplayTiming('startup');
      setSoundUrl('');
      setAudioStartTime('0');
      setAutoCloseSeconds('0');
      setAdLinkUrl('');
      setCancelAction('dismiss');
      setCancelLinkUrl('');
    } catch(err) {
      handleFirestoreError(err, OperationType.WRITE, 'ads');
      alert("Imeshindwa kusave ad. Huenda base64 data ni kubwa sana (>1MB). Tafadhali tumia URL badala ya ku-upload files.");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteAd = async (id: string) => {
    if(confirm('Are you sure you want to delete this ad?')) {
      await deleteDoc(doc(db, 'ads', id));
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onBack}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-xl bg-zinc-900 rounded-3xl p-6 border border-zinc-800 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar flex flex-col"
      >
        <button onClick={onBack} className="absolute top-4 right-4 p-2 bg-zinc-800 hover:bg-zinc-700 rounded-full text-white transition-colors z-[210]">
          <X size={20} />
        </button>

        <div className="flex justify-start items-center mb-6 gap-4 border-b border-zinc-800 pb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-purple-600/20 rounded-2xl flex items-center justify-center border border-purple-500/30">
            <MonitorPlay className="text-green-400" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-wider">Ads Manager</h2>
            <p className="text-green-400/70 text-[10px] tracking-[0.2em] uppercase font-mono">Control Network Transmissions</p>
          </div>
        </div>

        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="w-full mb-6 bg-zinc-800 text-white py-3 rounded-xl text-sm font-bold hover:bg-zinc-700 border border-zinc-700 transition flex items-center justify-center gap-2"
        >
          {isEditing ? <><X size={18} /> Cancel Draft</> : <><Plus size={18} /> Create New Transfer</>}
        </button>

        {isEditing && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="flex flex-col">
              <div className="w-full max-w-[280px] mx-auto aspect-[4/5] bg-black rounded-3xl overflow-hidden border-4 border-zinc-800 shadow-2xl relative sticky top-0">
                <div className="absolute top-0 left-0 w-full bg-gradient-to-b from-black/80 to-transparent p-4 z-20 flex justify-between items-center">
                  <span className="text-white text-xs font-bold tracking-widest uppercase flex items-center gap-2"><Eye size={14} className="text-green-400" /> Live Preview</span>
                  <button disabled className="p-2 bg-black/50 rounded-full text-white backdrop-blur-md">
                    <X size={16} />
                  </button>
                </div>
                
                {mediaUrls[0] ? (
                  <div className="w-full h-full">
                    {mediaType === 'video' ? (
                      <video src={mediaUrls[0]} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                    ) : (
                      <img src={mediaUrls[0]} className="w-full h-full object-cover" />
                    )}
                  </div>
                ) : (
                   <div className="w-full h-full flex items-center justify-center text-zinc-600 bg-zinc-900/50">
                     <div className="text-center">
                       <MonitorPlay size={48} className="mx-auto mb-2 opacity-50" />
                       <span className="text-[10px] uppercase tracking-widest font-bold">No Media Displayed</span>
                     </div></div>)}
                {soundUrl && (
                  <AdminAudioPreview soundUrl={soundUrl} audioStartTime={audioStartTime} />
                )}
                {mediaUrls.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2 z-10">
                    {mediaUrls.filter(u => u.trim() !== '').map((_, i) => (
                      <div key={i} className={cn("w-1.5 h-1.5 rounded-full transition-colors duration-300", 0 === i ? "bg-gradient-to-r from-green-600 to-purple-600 shadow-[0_0_8px_#22c55e] scale-125" : "bg-zinc-600")} />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1">
              <form onSubmit={handleSubmit} className="space-y-6 bg-black/40 p-5 rounded-2xl border border-zinc-800/80 shadow-inner">
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1 mb-2 block">Campaign Title</label>
                  <input 
                    type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Summer Promo" className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-white outline-none focus:border-purple-500/50 transition-colors" required
                  />
                </div>
                
                <div className="space-y-4 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/50">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1 block">Media Assets (up to 5)</label>
                  {mediaUrls.map((url, i) => (
                    <div key={i} className="flex gap-2">
                      <input 
                        type="url" value={url} 
                        onChange={(e) => {
                          const newUrls = [...mediaUrls];
                          newUrls[i] = e.target.value;
                          setMediaUrls(newUrls);
                        }}
                        placeholder={`Image or Video URL ${i + 1}`} className="flex-1 bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-white outline-none focus:border-purple-500/50" 
                      />
                      <label className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-4 rounded-xl flex items-center justify-center cursor-pointer transition-colors relative overflow-hidden group">
                        <input type="file" accept="image/*,video/*" className="hidden" onChange={(e) => {
                          if(e.target.files?.[0]) handleFileUpload(i, e.target.files[0]);
                        }} />
                        {isUploading ? <Loader2 size={18} className="animate-spin text-green-400" /> : <Plus size={18} className="text-zinc-400 group-hover:text-green-400" />}
                      </label>
                      {mediaUrls.length > 1 && (
                        <button type="button" onClick={() => setMediaUrls(mediaUrls.filter((_, idx) => idx !== i))} className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-xl">
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                  {mediaUrls.length < 5 && (
                    <button 
                      type="button" onClick={() => setMediaUrls([...mediaUrls, ''])}
                      className="w-full py-3 bg-zinc-900 border border-dashed border-zinc-800 rounded-xl text-green-400 text-sm font-bold hover:bg-zinc-800/50 transition"
                    >
                      + Add Another Asset
                    </button>
                  )}
                </div>

                <div className="space-y-4 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/50">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1 block">Audio / Soundtrack</label>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                        <input 
                          type="url" value={soundUrl} 
                          onChange={(e) => setSoundUrl(e.target.value)}
                          placeholder="URL for audio/music (Optional)" className="flex-1 bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-white outline-none focus:border-purple-500/50" 
                        />
                        <label className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-4 rounded-xl flex items-center justify-center cursor-pointer transition-colors relative overflow-hidden group">
                          <input type="file" accept="audio/*" className="hidden" onChange={(e) => {
                            if(e.target.files?.[0]) handleFileUpload('sound', e.target.files[0]);
                          }} />
                          {isUploading ? <Loader2 size={18} className="animate-spin text-green-400" /> : <Plus size={18} className="text-zinc-400 group-hover:text-green-400" />}
                        </label>
                    </div>
                    {soundUrl && (
                      <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1 mb-1 block">Start Time (Seconds, 0 = beginning)</label>
                        <input 
                          type="number" step="0.1" min="0" value={audioStartTime} 
                          onChange={(e) => setAudioStartTime(e.target.value)}
                          className="w-full sm:w-1/2 bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-white outline-none focus:border-purple-500/50" 
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1 mb-2 block">Media Content</label>
                    <select value={mediaType} onChange={(e) => setMediaType(e.target.value as any)} className="w-full bg-zinc-900 border border-zinc-800 p-3.5 rounded-xl text-white outline-none">
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1 mb-2 block">Animation FX</label>
                    <select value={transitionType} onChange={(e) => setTransitionType(e.target.value as any)} className="w-full bg-zinc-900 border border-zinc-800 p-3.5 rounded-xl text-white outline-none">
                      <option value="fade">Fade FX</option>
                      <option value="slide">Slide FX</option>
                      <option value="zoom">Zoom FX</option>
                      <option value="flip">Flip FX</option>
                      <option value="bounce">Bounce FX</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1 mb-2 block">Display Sequence</label>
                    <select value={displayTiming} onChange={(e) => setDisplayTiming(e.target.value as any)} className="w-full bg-zinc-900 border border-zinc-800 p-3.5 rounded-xl text-white outline-none">
                      <option value="startup">On System Start</option>
                      <option value="interval">Repeating Interval</option>
                    </select>
                  </div>
                  {displayTiming === 'interval' && (
                    <div>
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1 mb-2 block">Interval (Mins)</label>
                      <input type="number" value={intervalMinutes} onChange={(e) => setIntervalMinutes(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 p-3.5 rounded-xl text-white outline-none" min="1" />
                    </div>
                  )}
                  
                  <div className="pt-2 border-t border-zinc-800/50">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1 block mb-2">Ad Target URL (Optional)</label>
                    <input type="url" value={adLinkUrl} onChange={(e) => setAdLinkUrl(e.target.value)} placeholder="https://example.com" className="w-full bg-zinc-900 border border-zinc-800 p-3.5 rounded-xl text-white outline-none mb-4" />

                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1 block mb-2">Auto-Close Ad (Seconds, 0 = never)</label>
                    <input type="number" step="1" min="0" value={autoCloseSeconds} onChange={(e) => setAutoCloseSeconds(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 p-3.5 rounded-xl text-white outline-none mb-4" />
                    
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1 block mb-2">Cancel Action (X Button)</label>
                    <div className="flex flex-col gap-3">
                       <select value={cancelAction} onChange={(e) => setCancelAction(e.target.value as any)} className="w-full bg-zinc-900 border border-zinc-800 p-3.5 rounded-xl text-white outline-none">
                        <option value="dismiss">Dismiss Ad</option>
                        <option value="link">Open URL Link</option>
                      </select>
                      {cancelAction === 'link' && (
                        <input type="url" placeholder="https://..." value={cancelLinkUrl} onChange={e => setCancelLinkUrl(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 p-3.5 rounded-xl text-white outline-none" required />
                      )}
                    </div>
                  </div>

                  <div>
                     <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1 mb-2 mt-2 block">Campaign Duration (Days)</label>
                     <input type="number" value={durationDays} onChange={(e) => setDurationDays(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 p-3.5 rounded-xl text-white outline-none" min="1" />
                  </div>

                  <div className="flex items-center mt-6 pl-1">
                    <label className="flex items-center space-x-3 cursor-pointer group">
                      <div className={cn("w-6 h-6 rounded-md flex items-center justify-center border transition-colors", isActive ? "bg-gradient-to-r from-green-600 to-purple-600 border-purple-500" : "bg-zinc-900 border-zinc-700 group-hover:border-zinc-500")}>
                        {isActive && <Check size={16} className="text-zinc-100" />}
                      </div>
                      <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="hidden" />
                      <span className="text-white font-bold tracking-wide">ACTIVE SYNC</span>
                    </label>
                  </div>
                </div>
                
                <button type="submit" disabled={isUploading || isSaving} className="w-full bg-gradient-to-r from-green-600 to-purple-600 hover:from-green-500 hover:to-purple-500 text-zinc-100 font-black tracking-widest py-4 rounded-xl uppercase transition-colors disabled:opacity-50 mt-4">
                  {isSaving ? 'Inasave kwenye Database...' : isUploading ? 'Uploading Data...' : 'Deploy Ad Campaign'}
                </button>
              </form>
            </div></div>)}

        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white mb-4">Active Deployments</h3>
          {ads.map(ad => {
            const mediaUrls = ad.mediaUrls || [];
            return (
            <div key={ad.id} className="bg-black/30 border border-zinc-800/80 p-5 rounded-2xl flex md:items-center justify-between flex-col md:flex-row gap-4">
              <div className="flex gap-4 items-center">
                <div className="w-16 h-16 bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 shrink-0">
                  {ad.mediaType === 'image' ? (
                    <img src={mediaUrls[0] || ''} className="w-full h-full object-cover" />
                  ) : (
                    <video src={mediaUrls[0] || ''} className="w-full h-full object-cover" />
                  )}
                </div>
                <div>
                  <h4 className="text-white font-bold tracking-wide text-lg flex items-center gap-2">
                    {ad.title} 
                    <span className="bg-zinc-800 border border-zinc-700 px-2 flex items-center h-5 rounded-md text-[10px] text-zinc-300 font-mono">
                      {mediaUrls.length} {ad.mediaType}
                    </span>
                  </h4>
                  <p className="text-xs text-zinc-500 font-mono mt-1.5 flex gap-3">
                    <span><MonitorPlay size={12} className="inline mr-1" />{ad.displayTiming === 'startup' ? 'On Load' : `@ ${ad.intervalMinutes}m`}</span>
                    <span>{ad.isActive ? <span className="text-green-400"><Check size={10} className="inline" /> ACTV</span> : <span className="text-red-500"><X size={10} className="inline" /> INAC</span>}</span>
                  </p>
                </div>
              </div>
              <button onClick={() => deleteAd(ad.id)} className="w-full md:w-auto p-3 flex items-center justify-center gap-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-400 rounded-xl transition-colors shrink-0">
                <Trash2 size={18} />
                <span className="text-sm font-bold md:hidden">Revoke</span>
              </button>
            </div>
            );
          })}
          {ads.length === 0 && (
             <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 text-center">
               <MonitorPlay className="mx-auto text-zinc-600 mb-2" size={32} />
               <p className="text-zinc-500 text-sm font-bold">No running campaigns</p>
             </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const AdDisplay = () => {
  const [ads, setAds] = useState<CustomAd[]>([]);
  const [currentAd, setCurrentAd] = useState<CustomAd | null>(null);
  const [mediaIndex, setMediaIndex] = useState(0);

  useEffect(() => {
    const unsub = onSnapshot(query(collection(db, 'ads'), where('isActive', '==', true)), (snap) => {
      const fetched = snap.docs.map(d => ({id: d.id, ...d.data()} as CustomAd));
      const now = Date.now();
      // Auto-delete expired ads
      const validAds = fetched.filter(ad => {
        if (!ad.expiresAt) return true;
        return ad.expiresAt >= now;
      });
      setAds(validAds);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (ads.length === 0 || currentAd) return;
    
    const startupAds = ads.filter(a => a.displayTiming === 'startup');
    if (startupAds.length > 0 && !sessionStorage.getItem('startupAdShown')) {
      setCurrentAd(startupAds[Math.floor(Math.random() * startupAds.length)]);
      sessionStorage.setItem('startupAdShown', 'true');
      return;
    }

    const intervalAds = ads.filter(a => a.displayTiming === 'interval');
    if (intervalAds.length > 0) {
      const interval = setInterval(() => {
        const randomAd = intervalAds[Math.floor(Math.random() * intervalAds.length)];
        setCurrentAd(randomAd);
      }, (intervalAds[0].intervalMinutes || 5) * 60000);
      return () => clearInterval(interval);
    }
  }, [ads, currentAd]);

  useEffect(() => {
    if (!currentAd) return;
    const mediaUrls = currentAd.mediaUrls || [];
    if (mediaUrls.length > 1 && currentAd.mediaType === 'image') {
      const timer = setInterval(() => {
        setMediaIndex((prev) => (prev + 1) % mediaUrls.length);
      }, 5000); // 5 sec per image
      return () => clearInterval(timer);
    }
  }, [currentAd]);

  useEffect(() => {
    if (!currentAd || !currentAd.autoCloseSeconds || currentAd.autoCloseSeconds <= 0) return;
    
    const timeout = setTimeout(() => {
      setCurrentAd(null);
      setMediaIndex(0);
    }, currentAd.autoCloseSeconds * 1000);
    
    return () => clearTimeout(timeout);
  }, [currentAd]);

  const handleActionClose = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (currentAd?.cancelAction === 'link' && currentAd.cancelLinkUrl) {
      window.open(currentAd.cancelLinkUrl, '_blank', 'noopener,noreferrer');
    }
    setCurrentAd(null);
    setMediaIndex(0);
  };

  const forceCloseDismiss = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentAd(null);
    setMediaIndex(0);
  };

  if (!currentAd) return null;

  const mediaUrls = currentAd.mediaUrls || [];
  const mUrl = mediaUrls[mediaIndex] || '';
  
  const getAnimClass = () => {
    switch (currentAd.transitionType) {
      case 'slide': return { initial: { x: 300, opacity: 0 }, animate: { x: 0, opacity: 1 }, exit: { x: -300, opacity: 0 } };
      case 'zoom': return { initial: { scale: 0.8, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 1.2, opacity: 0 } };
      case 'flip': return { initial: { rotateY: 90, opacity: 0 }, animate: { rotateY: 0, opacity: 1 }, exit: { rotateY: -90, opacity: 0 } };
      case 'bounce': return { initial: { y: -500, opacity: 0 }, animate: { y: 0, opacity: 1 }, exit: { y: 500, opacity: 0 } };
      default: return { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }; // fade
    }
  };

  return (
    <div className="fixed inset-0 z-[500] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm" onClick={forceCloseDismiss}>
      {currentAd.soundUrl && (
        <audio 
          src={currentAd.soundUrl} 
          autoPlay 
          onEnded={(e) => {
            e.currentTarget.currentTime = currentAd.audioStartTime || 0;
            e.currentTarget.play();
          }}
          onLoadedMetadata={(e) => {
            e.currentTarget.currentTime = currentAd.audioStartTime || 0;
          }}
        />
      )}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className={cn(
          "relative w-[95vw] md:w-[85vw] max-w-3xl h-[85vh] bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col",
          currentAd.adLinkUrl ? "cursor-pointer" : ""
        )}
        onClick={(e) => {
          e.stopPropagation();
          if (currentAd.adLinkUrl) {
            window.open(currentAd.adLinkUrl, '_blank', 'noopener,noreferrer');
          }
        }}
      >
        <button onClick={handleActionClose} className="absolute top-4 right-4 p-3 bg-black/50 hover:bg-black/80 rounded-full text-white transition-colors z-[510] backdrop-blur-md">
          <X size={24} />
        </button>
        
        <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div 
              key={mUrl}
              {...getAnimClass()}
              transition={{ duration: 0.5, type: currentAd.transitionType === 'bounce' ? 'spring' : 'tween' }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {currentAd.mediaType === 'video' ? (
                <video src={mUrl} autoPlay playsInline controls={false} loop className="w-full h-full object-cover" />
              ) : (
                <img src={mUrl} alt="Ad content" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-2 z-10">
          <span className="text-[10px] text-zinc-300 font-bold uppercase tracking-widest">Sponsored</span>
        </div>
        
        {/* Ad Indicator line */}
        {mediaUrls.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2 z-10">
            {mediaUrls.map((_, i) => (
              <div key={i} className={cn("w-1.5 h-1.5 rounded-full transition-colors duration-300", mediaIndex === i ? "bg-gradient-to-r from-green-600 to-purple-600 shadow-[0_0_8px_#22c55e] scale-125" : "bg-zinc-600")} />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

const AdminDashboard = ({ t, theme, onUserClick }: { t: (k: string) => string, theme: string, onUserClick: (u: UserProfile) => void }) => {
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'users'), (snapshot) => {
      const u = snapshot.docs.map(doc => doc.data() as UserProfile);
      setUsersList(u);
      setLoadingUsers(false);
    }, (error) => {
       console.error("Error fetching users", error);
       setLoadingUsers(false);
    });
    return unsub;
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayLogins = usersList.filter(u => u.lastActiveDate === todayStr);

  return (
    <div className="space-y-6 pb-20">
      <div className={cn(
        "rounded-3xl p-6 relative overflow-hidden border shadow-sm",
        theme === 'dark' ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"
      )}>
        <h2 className={cn("text-xl font-bold mb-2", theme === 'dark' ? "text-white" : "text-zinc-100")}>Admin Dashboard</h2>
        <p className="text-zinc-500 text-sm">System & Users Overview</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className={cn(
          "p-5 rounded-2xl border shadow-sm",
          theme === 'dark' ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"
        )}>
          <div className="text-3xl font-black text-green-400">{usersList.length}</div>
          <div className="text-xs text-zinc-500 uppercase tracking-wider mt-1">Total Users</div>
        </div>
        <div className={cn(
          "p-5 rounded-2xl border shadow-sm",
          theme === 'dark' ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"
        )}>
          <div className="text-3xl font-black text-green-400">{todayLogins.length}</div>
          <div className="text-xs text-zinc-500 uppercase tracking-wider mt-1">Active Today</div>
        </div>
      </div>
      
      <div className={cn(
        "rounded-2xl p-6 border shadow-sm",
        theme === 'dark' ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"
      )}>
         <h3 className={cn("text-lg font-bold mb-4", theme === 'dark' ? "text-white" : "text-zinc-100")}>Active Today ({todayStr})</h3>
         <div className="space-y-4">
            {todayLogins.map(u => (
              <div key={u.uid} className={cn("flex items-center gap-3 border-b pb-3 last:border-0 last:pb-0", theme === 'dark' ? "border-zinc-800" : "border-zinc-100")}>
                 <img src={u.photoURL} className="w-10 h-10 rounded-full" alt="Profile" />
                 <div>
                   <p className={cn("text-sm font-medium", theme === 'dark' ? "text-white" : "text-zinc-100")}>{u.displayName}</p>
                   <p className="text-zinc-500 text-xs">{u.email}</p>
                 </div>
              </div>
            ))}
            {todayLogins.length === 0 && !loadingUsers && (
               <p className="text-zinc-500 text-sm text-center py-4">No active users yet.</p>
            )}
         </div>
      </div>

       <div className={cn(
        "rounded-2xl p-6 border shadow-sm",
        theme === 'dark' ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"
      )}>
         <h3 className={cn("text-lg font-bold mb-4", theme === 'dark' ? "text-white" : "text-zinc-100")}>All Users</h3>
         <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                        {usersList.map(u => (
              <div key={u.uid} className={cn("flex items-center gap-3 border-b pb-3 last:border-0 last:pb-0", theme === 'dark' ? "border-zinc-800" : "border-zinc-100")}>
                 <img src={u.photoURL} className="w-10 h-10 rounded-full" alt="Profile" />
                 <div className="flex-1">
                   <button onClick={() => onUserClick(u)} className={cn("text-sm font-medium hover:text-purple-400 text-left flex items-center gap-1 transition-colors", theme === 'dark' ? "text-white" : "text-zinc-100")}>
                     {u.displayName}
                     {u.verified && <BadgeCheck size={14} className="text-blue-500" />}
                   </button>
                   <p className="text-zinc-500 text-xs">{u.email}</p>
                 </div>
                 <div className="text-right flex flex-col items-end gap-1">
                    <button onClick={() => onUserClick(u)} className={cn("text-[10px] px-2 py-1 rounded-full uppercase font-bold hover:scale-105 active:scale-95 transition-transform", u.role === 'admin' ? "bg-red-500/10 text-red-500" : "bg-green-600/20 text-green-500")}>
                      {u.role}
                    </button>
                    {u.banned && <span className="text-[10px] font-bold text-red-500">BANNED</span>}
                 </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};


interface UserSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: UserProfile[];
  currentUserProfile: UserProfile | null;
  handleToggleFollowGlobal: (targetUid: string) => Promise<void>;
  onUserSelect: (uid: string) => void;
  t: (k: string) => string;
}

const UserSearchModal: React.FC<UserSearchModalProps> = ({ isOpen, onClose, users, currentUserProfile, handleToggleFollowGlobal, onUserSelect, t }) => {
  const [query, setQuery] = useState('');
  
  useEffect(() => {
    if (isOpen) {
      setQuery('');
    }
  }, [isOpen]);

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    return users.filter(u => (u.displayName || "").toLowerCase().includes(query.toLowerCase()) || u.uid === query);
  }, [query, users]);

  const suggestions = useMemo(() => {
    if (!currentUserProfile) return [];
    let pot = users.filter(u => u.uid !== currentUserProfile.uid && !currentUserProfile.following?.includes(u.uid));
    const today = new Date().toDateString();
    let seed = 0;
    for(let i = 0; i < today.length; i++) seed += today.charCodeAt(i);
    const shuffled = [...pot].sort((a, b) => {
      const hashA = (a.uid || "a").charCodeAt(0) + seed;
      const hashB = (b.uid || "b").charCodeAt(0) + seed;
      return (hashA % 7) - (hashB % 7);
    });
    return shuffled.slice(0, 10); // 10 suggestions as requested
  }, [users, currentUserProfile]);

  if (!isOpen) return null;

  const renderUser = (u: UserProfile, index: number) => {
    const isCurrentUser = currentUserProfile?.uid === u.uid;
    const isFollowing = currentUserProfile?.following?.includes(u.uid);
    const followsMe = currentUserProfile?.followers?.includes(u.uid);
    
    let btnText = 'Follow';
    if (isFollowing && followsMe) btnText = 'Friend';
    else if (isFollowing) btnText = 'Following';
    else if (followsMe) btnText = 'Follow back';

    return (
      <motion.div 
        key={u.uid} 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: index * 0.03 }}
        className="flex items-center justify-between p-2 hover:bg-zinc-800/50 rounded-xl transition-colors"
      >
        <div className="flex items-center gap-3 cursor-pointer flex-1 min-w-0" onClick={() => onUserSelect(u.uid)}>
          <img src={u.photoURL || ''} alt={u.displayName} className="w-10 h-10 rounded-full object-cover" />
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-sm text-zinc-100 flex items-center gap-1 truncate">
              {u.displayName}
              {u.verified && <BadgeCheck size={14} className="text-blue-500 flex-shrink-0" />}
            </span>
          </div>
        </div>
        {!isCurrentUser && (
           <button
             onClick={(e) => { e.stopPropagation(); handleToggleFollowGlobal(u.uid); }}
             className={`px-4 py-1.5 rounded-full text-[10px] font-bold transition-colors ml-2 ${
               isFollowing ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' : 'bg-blue-600 text-white hover:bg-blue-700'
             }`}
           >
             {btnText}
           </button>
        )}
      </motion.div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="bg-zinc-900 border border-zinc-800 sm:rounded-2xl rounded-t-2xl w-full max-w-md h-[80vh] sm:h-[70vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b border-zinc-800 shrink-0 relative">
          <button onClick={onClose} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 hover:bg-zinc-800 rounded-full text-zinc-400">
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-center font-bold text-zinc-100">Search Users</h2>
        </div>
        
        <div className="p-4 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input 
              type="text"
              placeholder="Search by username..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-zinc-800 text-zinc-100 pl-10 pr-4 py-3 rounded-xl outline-none border border-zinc-700 focus:border-purple-500 transition-colors"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {query.trim() ? (
            <div className="space-y-1">
              {searchResults.length > 0 ? searchResults.map((u, i) => renderUser(u, i)) : (
                <div className="text-center text-zinc-500 py-8">No users found</div>
              )}
            </div>
          ) : (
            <div>
              <h3 className="px-3 text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 mt-2">Suggestions</h3>
              <div className="space-y-1">
                {suggestions.map((u, i) => renderUser(u, i))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

interface NetworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab: 'followers' | 'following' | 'suggestions';
  displayedProfile: UserProfile | null;
  currentUserProfile: UserProfile | null;
  users: UserProfile[];
  handleToggleFollowGlobal: (targetUid: string) => Promise<void>;
  t: (k: string) => string;
}

const NetworkModal: React.FC<NetworkModalProps> = ({ isOpen, onClose, initialTab, displayedProfile, currentUserProfile, users, handleToggleFollowGlobal, t }) => {
  const [tab, setTab] = useState(initialTab);
  
  useEffect(() => {
    if (isOpen) setTab(initialTab);
  }, [isOpen, initialTab]);

  const followers = users.filter(u => displayedProfile?.followers?.includes(u.uid));
  const following = users.filter(u => displayedProfile?.following?.includes(u.uid));
  
  const suggestions = useMemo(() => {
    if (!currentUserProfile) return [];
    let pot = users.filter(u => u.uid !== currentUserProfile.uid && !currentUserProfile.following?.includes(u.uid));
    const today = new Date().toDateString();
    let seed = 0;
    for(let i = 0; i < today.length; i++) seed += today.charCodeAt(i);
    const shuffled = [...pot].sort((a, b) => {
      const hashA = (a.uid || "a").charCodeAt(0) + seed;
      const hashB = (b.uid || "b").charCodeAt(0) + seed;
      return (hashA % 7) - (hashB % 7);
    });
    return shuffled.slice(0, 50);
  }, [users, currentUserProfile]);

  if (!isOpen) return null;

  const renderUser = (u: UserProfile) => {
    const isCurrentUser = currentUserProfile?.uid === u.uid;
    const isFollowing = currentUserProfile?.following?.includes(u.uid);
    const followsMe = currentUserProfile?.followers?.includes(u.uid);
    
    let btnText = 'Follow';
    if (isFollowing && followsMe) btnText = 'Friend';
    else if (isFollowing) btnText = 'Following';
    else if (followsMe) btnText = 'Follow back';

    return (
      <div key={u.uid} className="flex items-center justify-between p-2 hover:bg-zinc-800/50 rounded-xl transition-colors">
        <div className="flex items-center gap-3 cursor-pointer">
          <img src={u.photoURL} alt={u.displayName} className="w-10 h-10 rounded-full object-cover" />
          <div className="flex flex-col">
            <span className="font-bold text-sm text-zinc-100 flex items-center gap-1">
              {u.displayName}
              {u.verified && <BadgeCheck size={14} className="text-blue-500" />}
            </span>
          </div>
        </div>
        {!isCurrentUser && (
           <button 
             onClick={() => handleToggleFollowGlobal(u.uid)}
             className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
               isFollowing ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' : 'bg-blue-600 text-white hover:bg-blue-700'
             }`}
           >
             {btnText}
           </button>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex border-b border-zinc-800 shrink-0">
          <button onClick={() => setTab('followers')} className={`flex-1 py-3 text-sm font-bold ${tab === 'followers' ? 'text-white border-b-2 border-white' : 'text-zinc-500'}`}>Followers</button>
          <button onClick={() => setTab('following')} className={`flex-1 py-3 text-sm font-bold ${tab === 'following' ? 'text-white border-b-2 border-white' : 'text-zinc-500'}`}>Following</button>
          <button onClick={() => setTab('suggestions')} className={`flex-1 py-3 text-sm font-bold ${tab === 'suggestions' ? 'text-white border-b-2 border-white' : 'text-zinc-500'}`}>Suggestions</button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {tab === 'followers' && followers.map(renderUser)}
          {tab === 'following' && following.map(renderUser)}
          {tab === 'suggestions' && suggestions.map(renderUser)}
          
          {tab === 'followers' && followers.length === 0 && <div className="text-center text-zinc-500 py-8">No followers yet</div>}
          {tab === 'following' && following.length === 0 && <div className="text-center text-zinc-500 py-8">Not following anyone</div>}
          {tab === 'suggestions' && suggestions.length === 0 && <div className="text-center text-zinc-500 py-8">No suggestions available</div>}
        </div>
      </motion.div>
    </div>
  );
};

// --- Main App ---


export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [profileTab, setProfileTab] = useState<'hacks' | 'apps' | 'news' | 'aiprompts'>('hacks');
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [lang, setLang] = useState<Language>('en');
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState<HomePost[]>([]);
  const [premiumApps, setPremiumApps] = useState<PremiumApp[]>([]);
  const [news, setNews] = useState<CyberNews[]>([]);
  const [aiPrompts, setAiPrompts] = useState<AiPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState<'post' | 'app' | 'news' | 'aiprompt' | null>(null);
  const [selectedNews, setSelectedNews] = useState<CyberNews | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<AiPrompt | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ collection: string, id: string } | null>(null);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [networkModalOpen, setNetworkModalOpen] = useState(false);
  const [networkModalTab, setNetworkModalTab] = useState<'followers' | 'following' | 'suggestions'>('followers');
  const [fabOpen, setFabOpen] = useState(false);
  const [editingUsername, setEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [viewingProfileId, setViewingProfileId] = useState<string | null>(null);
  const [selectedUserForAction, setSelectedUserForAction] = useState<UserProfile | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot'>('signup');
  const [email, setEmail] = useState('');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [globalLoading, setGlobalLoading] = useState(false);
  const [isProcessingLink, setIsProcessingLink] = useState(false);
  const [systemConfig, setSystemConfig] = useState<any>({ aviatorPassword: '123456' });
  const [showAviatorPasswordPrompt, setShowAviatorPasswordPrompt] = useState(false);
  const [pendingAiChatLink, setPendingAiChatLink] = useState<{url: string, name: string} | null>(null);
  const [configPassword, setConfigPassword] = useState('');
  const [showConfigPassword, setShowConfigPassword] = useState(false);
  const [adsManagerOpen, setAdsManagerOpen] = useState(false);
  const [userSearchModalOpen, setUserSearchModalOpen] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const isInitialLoad = React.useRef(true);


  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    
    try {
      setGlobalLoading(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = async () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 300;
          const MAX_HEIGHT = 300;
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          const base64Image = canvas.toDataURL('image/jpeg', 0.8);
          try {
            await updateProfile(user, { photoURL: base64Image });
            const userRef = doc(db, 'users', user.uid);
            await setDoc(userRef, { photoURL: base64Image }, { merge: true });
            if (profile) {
              setProfile({ ...profile, photoURL: base64Image });
            }
          } catch(err) {
             console.error('Error saving profile picture:', err);
             alert('Failed to update profile picture.');
          } finally {
            setGlobalLoading(false);
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      alert('Failed to update profile picture. Please try again.');
      setGlobalLoading(false);
    }
  };

  // Apply theme to document automatically
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    const showLoader = () => setIsProcessingLink(true);
    const hideLoader = () => setIsProcessingLink(false);
    window.addEventListener('show-link-loader', showLoader);
    window.addEventListener('hide-link-loader', hideLoader);
    return () => {
      window.removeEventListener('show-link-loader', showLoader);
      window.removeEventListener('hide-link-loader', hideLoader);
    };
  }, []);

  const t = (key: string) => {
    return (translations[lang] as any)[key] || key;
  };

  const filteredPosts = useMemo(() => {
    const query = (searchQuery || '').toLowerCase();
    return posts.filter(post => 
      (post.title || '').toLowerCase().includes(query)
    );
  }, [posts, searchQuery]);

  const filteredApps = useMemo(() => {
    const query = (searchQuery || '').toLowerCase();
    return premiumApps.filter(app => 
      (app.name || '').toLowerCase().includes(query) ||
      (app.description || '').toLowerCase().includes(query)
    );
  }, [premiumApps, searchQuery]);

  const filteredNews = useMemo(() => {
    const query = (searchQuery || '').toLowerCase();
    return news.filter(n => 
      (n.title || '').toLowerCase().includes(query) ||
      (n.content || '').toLowerCase().includes(query)
    );
  }, [news, searchQuery]);

  const filteredAiPrompts = useMemo(() => {
    const query = (searchQuery || '').toLowerCase();
    return aiPrompts.filter(p => 
      (p.title || '').toLowerCase().includes(query) ||
      (p.promptText || '').toLowerCase().includes(query)
    );
  }, [aiPrompts, searchQuery]);

  const isAdmin = useMemo(() => {
    return profile?.role === 'admin' || user?.email === 'richarddeogtatius18@gmail.com';
  }, [profile, user]);

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    const { collection: collectionName, id } = deleteConfirm;
    try {
      await deleteDoc(doc(db, collectionName, id));
      setDeleteConfirm(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${collectionName}/${id}`);
    }
  };

  useEffect(() => {
    setSearchQuery('');
  }, [activeTab]);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'system_config', 'main'), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setSystemConfig(data);
        setConfigPassword(data.aviatorPassword || '123456');
      } else {
        // Init with default if not exist, let admin do it later
        setConfigPassword('123456');
      }
    }, (error) => {
      // It might fail on free limits or permissions, just ignore
      console.warn('Config fetch error:', error);
    });
    return () => unsub();
  }, []);

  // Auth & Profile
  useEffect(() => {
    // Set persistence to local to avoid "missing initial state" errors in some environments
    setPersistence(auth, browserLocalPersistence).catch(err => console.error("Persistence error", err));

    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const isAdminEmail = u.email === 'richarddeogtatius18@gmail.com';
        // Set fallback profile immediately so UI is not blocked
        setProfile({
          uid: u.uid,
          email: u.email || '',
          displayName: u.displayName || 'User',
          photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.uid}`,
          isPremium: true,
          role: isAdminEmail ? 'admin' : 'user'
        });
        
        // Unblock the loading screen immediately!
        setIsAuthReady(true);
        setLoading(false);
        
        try {
          const userDoc = await getDoc(doc(db, 'users', u.uid));
          const todayStr = new Date().toISOString().split('T')[0];
          
          if (userDoc.exists()) {
            const data = userDoc.data() as UserProfile;
            let needsUpdate = false;
            let updateData: any = {};
            
            if (isAdminEmail && data.role !== 'admin') {
              updateData.role = 'admin';
              data.role = 'admin';
              needsUpdate = true;
            }
            if (data.lastActiveDate !== todayStr) {
              updateData.lastActiveDate = todayStr;
              data.lastActiveDate = todayStr;
              needsUpdate = true;
            }
            
            if (needsUpdate) {
              updateDoc(doc(db, 'users', u.uid), updateData).catch(() => {});
            }
            setProfile(data);
          } else {
            const newProfile: UserProfile = {
              uid: u.uid,
              email: u.email || '',
              displayName: u.displayName || 'User',
              photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.uid}`,
              isPremium: true,
              role: isAdminEmail ? 'admin' : 'user',
              lastActiveDate: todayStr,
              createdAt: serverTimestamp()
            };
            setDoc(doc(db, 'users', u.uid), newProfile).catch((error) => {
              console.warn("Failed to create profile, probably quota", error);
            });
            setProfile(newProfile);
          }
        } catch (error) {
          console.error("Failed to load user profile:", error);
        }
      } else {
        setProfile(null);
        setIsAuthReady(true);
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  // Data Fetching
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'users'), (snapshot) => {
      setUsers(snapshot.docs.map(doc => doc.data() as UserProfile));
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!user || !users.length) return;
    const adminUser = users.find(u => u.email === 'richarddeogtatius18@gmail.com');
    if (adminUser && user.email !== 'richarddeogtatius18@gmail.com') {
      const myProfile = users.find(u => u.uid === user.uid);
      if (myProfile && !myProfile.following?.includes(adminUser.uid)) {
        updateDoc(doc(db, 'users', user.uid), { following: arrayUnion(adminUser.uid) }).catch(() => {});
        updateDoc(doc(db, 'users', adminUser.uid), { followers: arrayUnion(user.uid) }).catch(() => {});
      }
    }
  }, [user, users]);

  useEffect(() => {
    if (!isAuthReady) return;

    const postsUnsubscribe = onSnapshot(
      query(collection(db, 'home_posts'), orderBy('createdAt', 'desc')),
      (snapshot) => {
        setPosts(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as HomePost)));
        setDataLoading(false);
        
        if (!isInitialLoad.current) {
          const hasNew = snapshot.docChanges().some(change => change.type === 'added');
          if (hasNew) {
            setToast(t('newPostNotification'));
            setTimeout(() => setToast(null), 3000);
          }
        }
      },
      (error) => handleFirestoreError(error, OperationType.LIST, 'home_posts')
    );

    const appsUnsubscribe = onSnapshot(
      query(collection(db, 'premium_apk'), orderBy('createdAt', 'desc')),
      (snapshot) => {
        setPremiumApps(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as PremiumApp)));
        
        if (!isInitialLoad.current) {
          const hasNew = snapshot.docChanges().some(change => change.type === 'added');
          if (hasNew) {
            setToast(t('newPostNotification'));
            setTimeout(() => setToast(null), 3000);
          }
        }
      },
      (error) => handleFirestoreError(error, OperationType.LIST, 'premium_apk')
    );

    const newsUnsubscribe = onSnapshot(
      query(collection(db, 'cyber_news'), orderBy('createdAt', 'desc')),
      (snapshot) => {
        setNews(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as CyberNews)));
      },
      (error) => handleFirestoreError(error, OperationType.LIST, 'cyber_news')
    );

    const promptsUnsubscribe = onSnapshot(
      query(collection(db, 'ai_prompts'), orderBy('createdAt', 'desc')),
      (snapshot) => {
        setAiPrompts(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as AiPrompt)));
      },
      (error) => handleFirestoreError(error, OperationType.LIST, 'ai_prompts')
    );

    // After a short delay, mark initial load as complete so subsequent additions trigger toast
    setTimeout(() => {
      isInitialLoad.current = false;
    }, 2000);

    return () => {
      postsUnsubscribe();
      appsUnsubscribe();
      newsUnsubscribe();
      promptsUnsubscribe();
    };
  }, [isAuthReady, lang]);

  const handleLogin = async () => {
    try {
      setAuthError(null);
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error("Login failed", error);
      let message = error.message;
      if (error.code === 'auth/network-request-failed') {
        message = lang === 'sw'
          ? "Hakuna mtandao. Tafadhali washa data yako na ujaribu tena."
          : "Network error. Please check your internet connection.";
      } else if (error.code === 'auth/popup-closed-by-user') {
        message = lang === 'sw'
          ? "Umesitisha kuingia kwa Google."
          : "Google login was cancelled.";
      }
      setAuthError(message);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      if (authMode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else if (authMode === 'signup') {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (displayName.trim()) {
          await updateProfile(userCredential.user, { displayName: displayName.trim() });
        }
      } else if (authMode === 'forgot') {
        await sendPasswordResetEmail(auth, email);
        setAuthError(t('resetEmailSent'));
        return;
      }
    } catch (error: any) {
      let message = error.message;
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        message = lang === 'sw' 
          ? "Email au nenosiri si sahihi. Tafadhali angalia tena." 
          : "Invalid email or password. Please check and try again.";
      } else if (error.code === 'auth/invalid-email') {
        message = lang === 'sw' 
          ? "Barua pepe uliyoweka si sahihi. Mfano: jina@gmail.com" 
          : "The email address is badly formatted. Example: name@gmail.com";
      } else if (error.code === 'auth/email-already-in-use') {
        message = lang === 'sw'
          ? "Akaunti tayari ipo. Tafadhali ingia (Login) badala yake."
          : "Account already exists. Please login instead.";
        setAuthMode('login');
      } else if (error.code === 'auth/weak-password') {
        message = lang === 'sw'
          ? "Nenosiri ni dhaifu sana. Tumia angalau herufi 6."
          : "Password is too weak. Use at least 6 characters.";
      } else if (error.code === 'auth/too-many-requests') {
        message = lang === 'sw'
          ? "Umejaribu mara nyingi mno. Tafadhali subiri kidogo kisha ujaribu tena."
          : "Too many attempts. Please try again later.";
      } else if (error.code === 'auth/operation-not-allowed') {
        message = lang === 'sw'
          ? "Login ya Email haijawezeshwa kwenye Firebase Console."
          : "Email login is not enabled in Firebase Console.";
      } else if (error.code === 'auth/network-request-failed') {
        message = lang === 'sw'
          ? "Hakuna mtandao. Tafadhali washa data yako na ujaribu tena."
          : "Network error. Please check your internet connection.";
      }
      setAuthError(message);
    }
  };

  const handleLogout = () => setLogoutConfirmOpen(true);

  const confirmLogout = () => {
    signOut(auth);
    setLogoutConfirmOpen(false);
  };

  const handleToggleFollowGlobal = async (targetUid: string) => {
    if (!user) return;
    const targetUser = users.find(u => u.uid === targetUid);
    if (!targetUser) return;
    const isFollowing = targetUser.followers?.includes(user.uid);
    const targetUserRef = doc(db, 'users', targetUid);
    const currentUserRef = doc(db, 'users', user.uid);
    try {
      if (isFollowing) {
        await updateDoc(targetUserRef, { followers: arrayRemove(user.uid) });
        await updateDoc(currentUserRef, { following: arrayRemove(targetUid) });
      } else {
        await updateDoc(targetUserRef, { followers: arrayUnion(user.uid) });
        await updateDoc(currentUserRef, { following: arrayUnion(targetUid) });
      }
    } catch (e) { console.error("Error following:", e); }
  };

    const handleReact = async (itemId: string, collectionName: string, type: 'like') => {
    if (!user) return;
    
    // Find item across all collections
    let item;
    let setItemState;
    if (collectionName === 'home_posts') { item = posts.find(p => p.id === itemId); setItemState = setPosts; }
    else if (collectionName === 'premium_apk') { item = premiumApps.find(p => p.id === itemId); setItemState = setPremiumApps; }
    else if (collectionName === 'cyber_news') { item = news.find(p => p.id === itemId); setItemState = setNews; }
    else if (collectionName === 'ai_prompts') { item = aiPrompts.find(p => p.id === itemId); setItemState = setAiPrompts; }
    
    if (!item || !setItemState) return;

    const currentReaction = item.userReactions?.[user.uid];
    const isRemoving = currentReaction === type;
    
    // Optimistic UI Update
    setItemState((prev: any[]) => prev.map(p => {
      if (p.id === itemId) {
        const currentReactionsCount = p.reactions?.[type] || 0;
        const newReactionsCount = isRemoving ? Math.max(0, currentReactionsCount - 1) : currentReactionsCount + 1;
        const newUserReactions = { ...p.userReactions };
        
        if (isRemoving) {
          delete newUserReactions[user.uid];
        } else {
          newUserReactions[user.uid] = type;
        }

        return {
          ...p,
          reactions: { ...p.reactions, [type]: newReactionsCount },
          userReactions: newUserReactions
        };
      }
      return p;
    }));

    const itemRef = doc(db, collectionName, itemId);

    try {
      if (isRemoving) {
        // Remove reaction
        await updateDoc(itemRef, {
          [`reactions.${type}`]: Math.max(0, (item.reactions?.[type] || 0) - 1),
          [`userReactions.${user.uid}`]: null
        });
      } else {
        // Change or add reaction
        const updates: any = {
          [`reactions.${type}`]: (item.reactions?.[type] || 0) + 1,
          [`userReactions.${user.uid}`]: type
        };
        if (currentReaction) {
          updates[`reactions.${currentReaction}`] = Math.max(0, (item.reactions?.[currentReaction] || 0) - 1);
        }
        await updateDoc(itemRef, updates);
      }
    } catch (error) {
      // Revert optimistic update
      setItemState((prev: any[]) => prev.map(p => {
        if (p.id === itemId) return item;
        return p;
      }));
      handleFirestoreError(error, OperationType.UPDATE, `${collectionName}/${itemId}`);
    }
  };

  const handleSaveConfig = async () => {
    try {
      await setDoc(doc(db, 'system_config', 'main'), {
        aviatorPassword: configPassword
      }, { merge: true });
      setToast(t('saved') || 'Saved');
    } catch(err) {
      console.error(err);
      setToast('Error saving');
    }
    setTimeout(() => setToast(null), 3000);
  };

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  if (!isAuthReady || loading) {
    return (
      <div className={cn(
        "min-h-screen flex flex-col items-center justify-center p-6 relative transition-colors duration-300",
        theme === 'dark' ? "bg-black text-white" : "bg-black text-white"
      )}>
        <div className="relative flex flex-col items-center">
          <div className="relative mb-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              className="absolute -inset-4 rounded-[40px] border border-purple-500/20"
              style={{ borderTopColor: 'transparent', borderBottomColor: 'transparent' }}
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
              className="absolute -inset-8 rounded-[48px] border border-purple-500/10"
              style={{ borderLeftColor: 'transparent', borderRightColor: 'transparent' }}
            />
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 bg-gradient-to-r from-green-600 to-purple-600 blur-3xl opacity-30 rounded-full"
            />
            <div className={cn(
              "relative z-10 flex items-center justify-center w-24 h-24 rounded-[32px] overflow-hidden backdrop-blur-xl border shadow-xl transition-colors duration-500",
              theme === 'dark' ? "bg-black border-zinc-800 shadow-purple-500/20" : "bg-black border-zinc-800 shadow-purple-500/20"
            )}>
              <div className="absolute inset-0 bg-gradient-to-tr from-green-500/10 via-black to-purple-500/10" />
              <motion.div
                animate={{ rotateY: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <span className="text-4xl drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]">🏆</span>
              </motion.div>
              <motion.div
                animate={{ y: ['100%', '-100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/20 to-transparent h-1/2 w-full"
              />
            </div>
          </div>
          
          <h2 className="text-xl font-bold tracking-tight mb-2 flex items-center justify-center">
            <span className="text-white">CYBER</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-purple-500 ml-1">HACKS</span>
          </h2>
          
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className={cn(
                "text-[10px] font-bold tracking-[0.3em] uppercase text-zinc-400"
              )}
            >
              {lang === 'sw' ? 'Inapakia Data...' : 'Loading Data...'}
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  if (profile?.banned) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6 text-center">
        <Ban size={64} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-black mb-2">Account Banned</h2>
        <p className="text-zinc-400 mb-8 max-w-sm">Your account has been banned. Create a new account.</p>
        <button onClick={() => auth.signOut()} className="bg-white text-black px-8 py-3 rounded-full font-bold">Logout</button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={cn(
        "min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 text-center transition-colors duration-300",
        theme === 'dark' ? "bg-black text-white" : "bg-black text-zinc-100"
      )}>
        <div className="relative z-10 w-full max-w-sm">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-8 flex flex-col items-center"
          >
            <div className={cn(
              "flex items-center justify-center w-16 h-16 mb-4 rounded-2xl shadow-sm border",
              theme === 'dark' ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"
            )}>
              <Shield size={28} className="text-green-400" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight mb-2">
              CYBER HACKS
            </h1>
            <p className="text-sm text-zinc-500">
              {lang === 'sw' ? 'Ingia ili kuendelea' : 'Sign in to continue'}
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1, type: "spring", stiffness: 200, damping: 20 }}
            className={cn(
              "p-6 sm:p-8 rounded-3xl shadow-sm border text-left",
              theme === 'dark' ? "bg-zinc-900/50 border-zinc-800" : "bg-white border-zinc-200"
            )}
          >
            <div className="relative z-10 w-full space-y-4">
              <form onSubmit={handleEmailAuth} className="space-y-4">
                <div className="space-y-3">
                  {authMode === 'signup' && (
                    <div className="relative">
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                      <input 
                        type="text" 
                        required
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Name or Nickname"
                        className={cn(
                          "w-full rounded-xl py-3 pl-11 pr-4 focus:outline-none transition-all text-sm border",
                          theme === 'dark' 
                            ? "bg-zinc-900/50 border-zinc-800 text-white focus:border-zinc-700 placeholder-zinc-600" 
                            : "bg-white border-zinc-200 text-zinc-100 focus:border-zinc-300 placeholder-zinc-400"
                        )}
                      />
                    </div>
                  )}

                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('email')}
                      className={cn(
                        "w-full rounded-xl py-3 pl-11 pr-4 focus:outline-none transition-all text-sm border",
                        theme === 'dark' 
                          ? "bg-zinc-900/50 border-zinc-800 text-white focus:border-zinc-700 placeholder-zinc-600" 
                          : "bg-white border-zinc-200 text-zinc-100 focus:border-zinc-300 placeholder-zinc-400"
                      )}
                    />
                  </div>
                  
                  {authMode !== 'forgot' && (
                    <div className="relative">
                      <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                      <input 
                        type={showLoginPassword ? "text" : "password"} 
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={t('password')}
                        className={cn(
                          "w-full rounded-xl py-3 pl-11 pr-11 focus:outline-none transition-all text-sm border",
                          theme === 'dark' 
                            ? "bg-zinc-900/50 border-zinc-800 text-white focus:border-zinc-700 placeholder-zinc-600" 
                            : "bg-white border-zinc-200 text-zinc-100 focus:border-zinc-300 placeholder-zinc-400"
                        )}
                      />
                      <button 
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                      >
                        {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  )}
                </div>
                
                {authError && (
                  <motion.p 
                    initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "text-xs font-medium p-3 rounded-lg border",
                      (authError.includes('sent') || authError.includes('itumwa'))
                        ? "text-emerald-600 bg-emerald-50 border-emerald-100 dark:text-emerald-400 dark:bg-emerald-500/10 dark:border-emerald-500/20" 
                        : "text-red-600 bg-red-50 border-red-100 dark:text-red-400 dark:bg-red-500/10 dark:border-red-500/20"
                    )}
                  >
                    {authError}
                  </motion.p>
                )}

                <button 
                  type="submit" 
                  className={cn(
                    "w-full font-semibold py-3 rounded-xl transition-all shadow-sm",
                    theme === 'dark' 
                      ? "bg-white text-zinc-100 hover:bg-zinc-200" 
                      : "bg-black text-white hover:bg-zinc-800"
                  )}
                >
                  {authMode === 'login' ? t('login') : (authMode === 'signup' ? t('signUp') : t('sendResetLink'))}
                </button>
              </form>

              <div className="flex flex-col gap-3 items-center pt-2">
                {authMode === 'login' && (
                  <button 
                    onClick={() => { setAuthMode('forgot'); setAuthError(null); }}
                    className="text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors"
                  >
                    {t('forgotPassword')}
                  </button>
                )}

                <button 
                  onClick={() => {
                    setAuthMode(prev => prev === 'login' ? 'signup' : 'login');
                    setAuthError(null);
                  }}
                  className={cn(
                    "w-full py-3 rounded-xl border flex items-center justify-center gap-2 text-sm font-semibold transition-all shadow-sm",
                    theme === 'dark'
                      ? "border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-300"
                      : "border-zinc-200 bg-black hover:bg-zinc-100 text-zinc-700"
                  )}
                >
                  <span className="font-normal opacity-70">
                    {authMode === 'login' ? t('noAccount') : t('hasAccount')}
                  </span>
                  <span className={cn(
                    theme === 'dark' ? "text-white" : "text-zinc-100"
                  )}>
                    {authMode === 'login' ? t('signUp') : t('login')}
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "min-h-screen pb-24 transition-colors duration-300",
      theme === 'dark' ? "bg-black text-white" : "bg-black text-zinc-100"
    )}>
      <AdDisplay />
      {/* Header */}
      {activeTab !== 'profile' && (
      <header className="sticky top-0 z-40 bg-inherit/80 backdrop-blur-md px-6 py-4 flex items-center justify-between max-w-md mx-auto gap-3">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-black italic tracking-tighter text-white truncate">CYBER HACKS</h1>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest truncate">{t('welcome')}, {profile?.displayName.split(' ')[0]}</p>
        </div>
        
        <button 
          onClick={() => setUserSearchModalOpen(true)}
          className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors shrink-0 shadow-lg border border-zinc-700"
        >
          <Search size={18} />
        </button>

        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-purple-500 shadow-lg shadow-purple-500/20 shrink-0 cursor-pointer" onClick={() => setActiveTab('profile')}>
          {profile?.photoURL ? (
            <img src={profile.photoURL} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
              <UserIcon size={20} className="text-zinc-500" />
            </div>
          )}
        </div>
      </header>
      )}

      <main className="max-w-md mx-auto px-6 pt-2">
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-gradient-to-r from-green-600 to-purple-600 text-zinc-100 px-4 py-2 rounded-full font-bold shadow-lg flex items-center gap-2"
          >
            <Bell size={16} />
            {toast}
          </motion.div>
        )}

        {['home', 'premium', 'news'].includes(activeTab) && (
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-12 focus:outline-none focus:border-purple-500 transition-colors text-sm"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                <X size={18} />
              </button>
            )}
          </div>
        )}

        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 gap-4">
                {filteredPosts.map((post, i) => (
                  <Card 
                    key={post.id} 
                    index={i}
                    title={post.title} 
                    image={post.image} 
                    link={post.link} 
                    isAdmin={isAdmin}
                    onDelete={() => setDeleteConfirm({ collection: 'home_posts', id: post.id })}
                    onEdit={() => {
                      setEditingItem(post);
                      setModalOpen('post');
                    }}
                    reactions={post.reactions}
                    userReaction={user ? post.userReactions?.[user.uid] : null}
                    onReact={(type) => handleReact(post.id, 'home_posts', type)}
                    createdAt={post.createdAt}
                    password={post.password}
                    passwordRequestMsg={post.passwordRequestMsg}
                    t={t}
                    author={users.find(u => u.uid === post.authorId)}
                    onAuthorClick={() => { if (post.authorId) { setViewingProfileId(post.authorId); setActiveTab('profile'); } }}
                    currentUserId={user?.uid}
                    onFollowToggle={handleToggleFollowGlobal}
                  />
                ))}
                {filteredPosts.length === 0 && !dataLoading && (
                  <div className="col-span-2 py-20 text-center text-zinc-500">
                    <Globe className="mx-auto mb-4 opacity-20" size={48} />
                    <p>{t('noHacks')}</p>
                  </div>
                )}
                {dataLoading && (
                  <div className="col-span-2 py-20 flex flex-col items-center justify-center text-zinc-500">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="mb-4 text-3xl">
                      ⚽
                    </motion.div>
                    <p className="text-sm uppercase tracking-widest font-bold opacity-50">Loading data...</p>
                  </div>
                )}
              </div>
              
              
            </motion.div>
          )}

          {activeTab === 'premium' && (
            <motion.div
              key="premium"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="bg-gradient-to-br from-green-500 to-purple-700 rounded-3xl p-6 text-zinc-100 mb-6">
                <h2 className="text-2xl font-black italic mb-1">{t('freeAccess')}</h2>
                <p className="text-sm font-medium opacity-80 mb-4">{t('enjoyFree')}</p>
              </div>

              <div className="space-y-3">
                {filteredApps.map((app, i) => (
                  <PremiumCard 
    key={app.id} 
    index={i}
    app={app} 
    isPremium={true} 
    onDownload={() => {
      handleExternalLink(app.downloadLink);
    }}
    isAdmin={isAdmin}
    canEdit={isAdmin || (user && user.uid === app.authorId)}
    onDelete={() => setDeleteConfirm({ collection: 'premium_apk', id: app.id })}
    onEdit={() => {
      setEditingItem(app);
      setModalOpen('app');
    }}
    t={t}
    author={users.find(u => u.uid === app.authorId)}
    onAuthorClick={() => {
      if (app.authorId) {
        setViewingProfileId(app.authorId);
        setActiveTab('profile');
      }
    }}
    currentUserId={user?.uid}
    onFollowToggle={handleToggleFollowGlobal}
    reactions={app.reactions}
    userReaction={user ? (app.userReactions?.[user.uid] as 'like' | null) : null}
    onReact={() => user && handleReact(app.id, 'premium_apk', 'like')}
  />
                ))}
                {filteredApps.length === 0 && (
                  <div className="py-20 text-center text-zinc-500">
                    <Shield className="mx-auto mb-4 opacity-20" size={48} />
                    <p>{t('noApps')}</p>
                  </div>
                )}
              </div>

              
            </motion.div>
          )}

          {activeTab === 'news' && (
            <motion.div
              key="news"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredNews.map((n, i) => (
                  <NewsCard 
    key={n.id} 
    index={i}
    news={n} 
    isAdmin={isAdmin}
    canEdit={isAdmin || (user && user.uid === n.authorId)}
    onDelete={() => setDeleteConfirm({ collection: 'cyber_news', id: n.id })}
    onEdit={() => {
      setEditingItem(n);
      setModalOpen('news');
    }}
    onClick={() => setSelectedNews(n)}
    t={t}
    author={users.find(u => u.uid === n.authorId)}
    onAuthorClick={() => {
      if (n.authorId) {
        setViewingProfileId(n.authorId);
        setActiveTab('profile');
      }
    }}
    currentUserId={user?.uid}
    onFollowToggle={handleToggleFollowGlobal}
    reactions={n.reactions}
    userReaction={user ? (n.userReactions?.[user.uid] as 'like' | null) : null}
    onReact={() => user && handleReact(n.id, 'cyber_news', 'like')}
  />
                ))}
                {filteredNews.length === 0 && (
                  <div className="col-span-1 sm:col-span-2 py-20 text-center text-zinc-500">
                    <Newspaper className="mx-auto mb-4 opacity-20" size={48} />
                    <p>{t('noNews')}</p>
                  </div>
                )}
              </div>
              
              
            </motion.div>
          )}

          {activeTab === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
                {filteredAiPrompts.map((p, i) => (
                  <AiPromptCard 
    key={p.id} 
    index={i}
    prompt={p} 
    isAdmin={isAdmin}
    canEdit={isAdmin || (user && user.uid === p.authorId)}
    onDelete={() => setDeleteConfirm({ collection: 'ai_prompts', id: p.id })}
    onEdit={() => {
      setEditingItem(p);
      setModalOpen('aiprompt');
    }}
    onClick={() => setSelectedPrompt(p)}
    author={users.find(u => u.uid === p.authorId)}
    onAuthorClick={() => {
      if (p.authorId) {
        setViewingProfileId(p.authorId);
        setActiveTab('profile');
      }
    }}
    currentUserId={user?.uid}
    onFollowToggle={handleToggleFollowGlobal}
    reactions={p.reactions}
    userReaction={user ? (p.userReactions?.[user.uid] as 'like' | null) : null}
    onReact={() => user && handleReact(p.id, 'ai_prompts', 'like')}
  />
                ))}
                {filteredAiPrompts.length === 0 && (
                  <div className="col-span-full py-20 flex flex-col items-center justify-center text-center text-zinc-500 rounded-3xl border border-dashed border-zinc-800/50">
                    <MessageSquare className="mx-auto mb-4 opacity-20" size={48} />
                    <p>No AI Prompts available yet.</p>
                  </div>
                )}
              </div>
              
              
            </motion.div>
          )}

                    {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6 pb-24"
            >
              {(() => {
                const isViewingOther = !!viewingProfileId && viewingProfileId !== user?.uid;
                const displayedProfile = isViewingOther ? users.find(u => u.uid === viewingProfileId) : profile;
                const displayedUid = viewingProfileId || user?.uid;
                const isOwnProfile = !isViewingOther;
                
                                const isRichard = displayedProfile?.email === 'richarddeogtatius18@gmail.com';
                const filterUserItems = (item: any) => item.authorId === displayedUid || (isRichard && !item.authorId);
                
                const userPosts = posts.filter(filterUserItems);
                const userApps = premiumApps.filter(filterUserItems);
                const userNews = news.filter(filterUserItems);
                const userPrompts = aiPrompts.filter(filterUserItems);
                
                const totalPostsCount = userPosts.length + userApps.length + userNews.length + userPrompts.length;
                const totalLikes = userPosts.reduce((acc, post) => {
                  return acc + (post.reactions?.like || 0);
                }, 0);
                const followersCount = (isAdmin && isOwnProfile) ? users.length : (displayedProfile?.followers?.length || 0);
                const isFollowing = user && displayedProfile?.followers?.includes(user.uid);
                const toggleFollow = async () => {
                  if (!user) return;
                  await handleToggleFollowGlobal(displayedUid);
                };

                
                return (
                  <>
                    <div className="flex justify-between items-center mb-6">
                      <div className="w-10">
                        {isViewingOther && (
                          <button onClick={() => setViewingProfileId(null)} className="p-2 -ml-2 rounded-full hover:bg-zinc-800/50 transition-colors">
                            <X size={24} className="text-zinc-100" />
                          </button>
                        )}
                      </div>
                      <div className="font-bold text-lg flex items-center gap-1">
                        {displayedProfile?.displayName || 'Profile'}
                        {displayedProfile?.verified && <BadgeCheck size={18} className="text-blue-500" />}
                      </div>
                      <div className="w-10">
                        {isOwnProfile && (
                          <button onClick={() => setActiveTab('settings')} className="p-2 -mr-2 rounded-full hover:bg-zinc-800/50 transition-colors">
                             <Settings size={24} className="text-zinc-100" />
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between px-2">
                      <div className="relative">
                        <div className="w-24 h-24 rounded-full overflow-hidden bg-zinc-800 border-2 border-zinc-700">
                          {displayedProfile?.photoURL ? (
                            <img src={displayedProfile.photoURL} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <UserIcon size={40} className="text-zinc-600" />
                            </div>
                          )}
                        </div>
                        {isOwnProfile && (
                          <label className="absolute bottom-0 right-0 p-2 bg-gradient-to-r from-green-600 to-purple-600 rounded-full border-[3px] border-black hover:scale-105 active:scale-95 transition-transform cursor-pointer">
                            <input type="file" accept="image/*" className="hidden" onChange={handleProfileImageUpload} />
                            <Pencil size={14} className="text-white" />
                          </label>
                        )}
                      </div>
                        
                      <div className="flex gap-6 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => {
                          setNetworkModalTab('followers');
                          setNetworkModalOpen(true);
                        }}>
                        <div className="flex flex-col items-center">
                          <span className="font-black text-xl text-zinc-100">{userPosts.length}</span>
                          <span className="text-xs text-zinc-500 font-medium">Posts</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="font-black text-xl text-zinc-100">{Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(followersCount)}</span>
                          <span className="text-xs text-zinc-500 font-medium">Followers</span>
                        </div>
                        
                        <div className="flex flex-col items-center">
                          <span className="font-black text-xl text-zinc-100">{Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(totalLikes)}</span>
                          <span className="text-xs text-zinc-500 font-medium">Likes</span>
                        </div>
                      </div>

                    </div>
                    
                    {!isOwnProfile && (
                        <div className="mt-4 mb-2 w-full flex justify-center px-2">
                          <button 
                            onClick={toggleFollow}
                            className={`px-8 py-2 rounded-xl font-bold transition-all text-sm w-full shadow-md active:scale-95 ${isFollowing ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90'}`}
                          >
                            {isFollowing ? 'Following' : 'Follow'}
                          </button>
                        </div>
                      )}
                      
                                        <div className="mt-8">
                      <div className="flex border-b border-zinc-800 w-full overflow-x-auto no-scrollbar">
                         <button onClick={() => setProfileTab('hacks')} className={cn("flex-1 whitespace-nowrap px-4 py-3 text-xs font-bold uppercase tracking-widest", profileTab === 'hacks' ? "text-zinc-100 border-b-2 border-zinc-100" : "text-zinc-500 hover:text-zinc-300")}>
                           Hacks
                         </button>
                         <button onClick={() => setProfileTab('apps')} className={cn("flex-1 whitespace-nowrap px-4 py-3 text-xs font-bold uppercase tracking-widest", profileTab === 'apps' ? "text-zinc-100 border-b-2 border-zinc-100" : "text-zinc-500 hover:text-zinc-300")}>
                           Premium
                         </button>
                         <button onClick={() => setProfileTab('news')} className={cn("flex-1 whitespace-nowrap px-4 py-3 text-xs font-bold uppercase tracking-widest", profileTab === 'news' ? "text-zinc-100 border-b-2 border-zinc-100" : "text-zinc-500 hover:text-zinc-300")}>
                           News
                         </button>
                         <button onClick={() => setProfileTab('aiprompts')} className={cn("flex-1 whitespace-nowrap px-4 py-3 text-xs font-bold uppercase tracking-widest", profileTab === 'aiprompts' ? "text-zinc-100 border-b-2 border-zinc-100" : "text-zinc-500 hover:text-zinc-300")}>
                           AI Prompts
                         </button>
                      </div>
                      <div className="py-4 space-y-4 px-2">
                        {profileTab === 'hacks' && (
                          userPosts.length === 0 ? (
                            <div className="py-20 flex flex-col items-center justify-center text-zinc-500">
                              <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-4">
                                 <Home size={24} className="text-zinc-600" />
                              </div>
                              <p className="text-sm font-medium">No hacks posted yet</p>
                            </div>
                          ) : (
                            userPosts.map((post, i) => (
                              <Card 
                                key={post.id} 
                                {...post} 
                                isAdmin={isAdmin}
                                onDelete={() => setDeleteConfirm({ collection: 'home_posts', id: post.id })}
                                onEdit={() => { setEditingItem(post); setModalOpen('post'); }}
                                userReaction={post.userReactions?.[user?.uid || '']}
                                onReact={(type) => user && handleReact(post.id, 'home_posts', type)}
                                password={post.password}
                                passwordRequestMsg={post.passwordRequestMsg}
                                t={t}
                                index={i}
                                author={users.find(u => u.uid === post.authorId)}
                                onAuthorClick={() => { if (post.authorId) { setViewingProfileId(post.authorId); setActiveTab('profile'); } }}
                                currentUserId={user?.uid}
                                onFollowToggle={handleToggleFollowGlobal}
                              />
                            ))
                          )
                        )}
                        
                        {profileTab === 'apps' && (
                          (() => {
                            
                            if (userApps.length === 0) return (
                              <div className="py-20 flex flex-col items-center justify-center text-zinc-500">
                                <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-4">
                                   <Shield size={24} className="text-zinc-600" />
                                </div>
                                <p className="text-sm font-medium">No apps posted yet</p>
                              </div>
                            );
                            return userApps.map((app, i) => (
                              <PremiumCard 
    key={app.id} 
    app={app} 
    isPremium={true}
    onDownload={() => handleExternalLink(app.downloadLink || '')} 
    isAdmin={isAdmin}
    canEdit={isAdmin || (user && user.uid === app.authorId)}
    onDelete={() => setDeleteConfirm({ collection: 'premium_apk', id: app.id })}
    onEdit={() => { setEditingItem(app); setModalOpen('app'); }}
    t={t}
    index={i}
    author={users.find(u => u.uid === app.authorId)}
    onAuthorClick={() => {
      if (app.authorId) {
        setViewingProfileId(app.authorId);
        setActiveTab('profile');
      }
    }}
    currentUserId={user?.uid}
    onFollowToggle={handleToggleFollowGlobal}
    reactions={app.reactions}
    userReaction={user ? (app.userReactions?.[user.uid] as 'like' | null) : null}
    onReact={() => user && handleReact(app.id, 'premium_apk', 'like')}
  />
                            ));
                          })()
                        )}

                        {profileTab === 'news' && (
                          (() => {
                            
                            if (userNews.length === 0) return (
                              <div className="py-20 flex flex-col items-center justify-center text-zinc-500">
                                <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-4">
                                   <Newspaper size={24} className="text-zinc-600" />
                                </div>
                                <p className="text-sm font-medium">No news posted yet</p>
                              </div>
                            );
                            return userNews.map((n, i) => (
                              <NewsCard 
    key={n.id} 
    news={n} 
    isAdmin={isAdmin}
    canEdit={isAdmin || (user && user.uid === n.authorId)}
    onClick={() => setSelectedNews(n)}
    onDelete={() => setDeleteConfirm({ collection: 'cyber_news', id: n.id })}
    onEdit={() => { setEditingItem(n); setModalOpen('news'); }}
    t={t}
    index={i}
    author={users.find(u => u.uid === n.authorId)}
    onAuthorClick={() => {
      if (n.authorId) {
        setViewingProfileId(n.authorId);
        setActiveTab('profile');
      }
    }}
    currentUserId={user?.uid}
    onFollowToggle={handleToggleFollowGlobal}
    reactions={n.reactions}
    userReaction={user ? (n.userReactions?.[user.uid] as 'like' | null) : null}
    onReact={() => user && handleReact(n.id, 'cyber_news', 'like')}
  />
                            ));
                          })()
                        )}

                        {profileTab === 'aiprompts' && (
                          (() => {
                            
                            if (userPrompts.length === 0) return (
                              <div className="py-20 flex flex-col items-center justify-center text-zinc-500">
                                <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-4">
                                   <MessageSquare size={24} className="text-zinc-600" />
                                </div>
                                <p className="text-sm font-medium">No prompts posted yet</p>
                              </div>
                            );
                            return userPrompts.map((prompt, i) => (
                              <AiPromptCard 
    key={prompt.id} 
    prompt={prompt} 
    isAdmin={isAdmin}
    canEdit={isAdmin || (user && user.uid === prompt.authorId)}
    onClick={() => setSelectedPrompt(prompt)}
    onDelete={() => setDeleteConfirm({ collection: 'ai_prompts', id: prompt.id })}
    onEdit={() => { setEditingItem(prompt); setModalOpen('aiprompt'); }}
    index={i}
    author={users.find(u => u.uid === prompt.authorId)}
    onAuthorClick={() => {
      if (prompt.authorId) {
        setViewingProfileId(prompt.authorId);
        setActiveTab('profile');
      }
    }}
    currentUserId={user?.uid}
    onFollowToggle={handleToggleFollowGlobal}
    reactions={prompt.reactions}
    userReaction={user ? (prompt.userReactions?.[user.uid] as 'like' | null) : null}
    onReact={() => user && handleReact(prompt.id, 'ai_prompts', 'like')}
  />
                            ));
                          })()
                        )}
                      </div>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6 pb-24"
            >
              <div className="flex items-center gap-4 mb-2">
                <button onClick={() => setActiveTab('profile')} className="p-2 -ml-2 rounded-full hover:bg-zinc-800/50 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left text-zinc-100"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
                </button>
                <div className="font-bold text-lg">{t('settings')}</div>
              </div>
                            <section className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800">
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-zinc-800">
                    {profile?.photoURL ? (
                      <img src={profile.photoURL} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <UserIcon size={32} className="text-zinc-700" />
                      </div>
                    )}
                    <label className="absolute bottom-0 right-0 p-1 bg-black/50 text-white cursor-pointer w-full text-center">
                      <input type="file" accept="image/*" className="hidden" onChange={handleProfileImageUpload} />
                      <Pencil size={12} className="mx-auto" />
                    </label>
                  </div>
                  <div className="flex-1">
                    {editingUsername ? (
                      <div className="flex gap-2">
                        <input 
                          autoFocus
                          value={newUsername} 
                          onChange={e => setNewUsername(e.target.value)}
                          className="bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1 flex-1 text-sm outline-none focus:border-purple-500 text-white"
                          placeholder="New username"
                        />
                        <button 
                          onClick={async () => {
                            if (!newUsername.trim() || !user) return;
                            try {
                              setGlobalLoading(true);
                              await updateProfile(user, { displayName: newUsername });
                              await setDoc(doc(db, 'users', user.uid), { displayName: newUsername }, { merge: true });
                              if (profile) setProfile({ ...profile, displayName: newUsername });
                              setEditingUsername(false);
                            } catch(e) {
                              console.error(e);
                              alert("Failed to update username");
                            } finally {
                              setGlobalLoading(false);
                            }
                          }}
                          className="bg-green-600 text-white px-2 py-1 rounded-lg text-xs font-bold"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg text-white">{profile?.displayName}</h3>
                        <button onClick={() => { setNewUsername(profile?.displayName || ''); setEditingUsername(true); }} className="text-zinc-500 hover:text-white">
                           <Pencil size={14} />
                        </button>
                      </div>
                    )}
                    <p className="text-xs text-zinc-500">{profile?.email}</p>
                    <span className={cn(
                      "inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-black uppercase",
                      profile?.isPremium ? "bg-gradient-to-r from-green-600 to-purple-600 text-zinc-100" : "bg-zinc-800 text-zinc-400"
                    )}>
                      {profile?.isPremium ? t('premiumMember') : t('freeMember')}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <button 
                    onClick={() => setLang(prev => prev === 'en' ? 'sw' : 'en')}
                    className="w-full flex items-center justify-between p-3 hover:bg-zinc-800 rounded-xl transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <Globe size={20} className="text-zinc-500 group-hover:text-green-400" />
                      <span className="text-sm font-medium">{t('language')}</span>
                    </div>
                    <span className="text-xs text-zinc-500">{t('langName')}</span>
                  </button>
                  <button 
                    onClick={toggleTheme}
                    className="w-full flex items-center justify-between p-3 hover:bg-zinc-800 rounded-xl transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                      <span className="text-sm font-medium">{t('theme')}</span>
                    </div>
                    <span className="text-xs text-zinc-500 uppercase">{theme}</span>
                  </button>
                </div>
              </section>

              <section className="space-y-3">
                <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-4">{t('support')}</h4>
                <div className="bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800">
                  <button 
                    onClick={() => handleExternalLink('https://wa.me/255686586707')}
                    className="w-full flex items-center justify-between p-4 hover:bg-zinc-800 transition-colors border-b border-zinc-800"
                  >
                    <div className="flex items-center gap-3">
                      <Phone size={20} className="text-green-400" />
                      <span className="text-sm font-medium">{t('contactWa')}</span>
                    </div>
                    <ChevronRight size={16} className="text-zinc-600" />
                  </button>
                  <button 
                    onClick={() => handleExternalLink('https://chat.whatsapp.com/I2J50RscRRA9T5qK0Bn4mp')}
                    className="w-full flex items-center justify-between p-4 hover:bg-zinc-800 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Users size={20} className="text-green-400" />
                      <span className="text-sm font-medium">{t('officialGroup')}</span>
                    </div>
                    <ChevronRight size={16} className="text-zinc-600" />
                  </button>
                </div>
              </section>

              {profile?.role === 'admin' && (
                <section className="space-y-3">
                  <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-4">Admin Config</h4>
                  <div className="bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800">
                    <button onClick={() => setAdsManagerOpen(true)} className="w-full flex items-center justify-between p-4 hover:bg-zinc-800 transition-colors">
                      <div className="flex items-center gap-3">
                        <MonitorPlay size={20} className="text-green-400" />
                        <span className="text-sm font-medium">Manage Ad Campaigns</span>
                      </div>
                      <ChevronRight size={16} className="text-zinc-600" />
                    </button>
                  </div>
                </section>
              )}

              <section className="space-y-3">
                <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-4">{t('legal')}</h4>
                <div className="bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800">
                  <button className="w-full flex items-center justify-between p-4 hover:bg-zinc-800 transition-colors">
                    <div className="flex items-center gap-3">
                      <Info size={20} className="text-zinc-500" />
                      <span className="text-sm font-medium">{t('privacy')}</span>
                    </div>
                    <ChevronRight size={16} className="text-zinc-600" />
                  </button>
                </div>
              </section>

              <button 
                onClick={handleLogout}
                className="w-full py-4 bg-zinc-900 text-red-500 font-bold rounded-2xl border border-zinc-800 flex items-center justify-center gap-2 hover:bg-red-500/10 transition-colors"
              >
                <LogOut size={20} />
                {t('signOut')}
              </button>

              {profile?.role === 'admin' && (
                <div className="pt-6 border-t border-zinc-800">
                  <AdminDashboard t={t} theme={theme} onUserClick={setSelectedUserForAction} />
                </div>
              )}

              <p className="text-center text-[10px] text-zinc-600 font-bold uppercase tracking-widest pb-4">
                Cyber Hacks v1.0.0
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

                  {/* Floating Action Button */}
      {user && activeTab === 'profile' && !viewingProfileId && (
        <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end gap-3 pointer-events-none">
          <AnimatePresence>
            {fabOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                className="flex flex-col gap-2 pointer-events-auto"
              >
                <button onClick={() => { setModalOpen('aiprompt'); setFabOpen(false); }} className="flex items-center justify-end gap-3 group">
                  <span className="bg-black/80 backdrop-blur-md text-white text-xs font-bold px-3 py-2 rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover:bg-purple-600 transition-colors border border-white/10">AI Prompt</span>
                  <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-zinc-400 group-hover:bg-purple-600 group-hover:text-white group-hover:border-purple-500 transition-colors shadow-lg shadow-black/20">
                    <MessageSquare size={18} />
                  </div>
                </button>
                <button onClick={() => { setModalOpen('news'); setFabOpen(false); }} className="flex items-center justify-end gap-3 group">
                  <span className="bg-black/80 backdrop-blur-md text-white text-xs font-bold px-3 py-2 rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover:bg-blue-500 transition-colors border border-white/10">Cyber News</span>
                  <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-zinc-400 group-hover:bg-blue-500 group-hover:text-white group-hover:border-blue-500 transition-colors shadow-lg shadow-black/20">
                    <Newspaper size={18} />
                  </div>
                </button>
                <button onClick={() => { setModalOpen('app'); setFabOpen(false); }} className="flex items-center justify-end gap-3 group">
                  <span className="bg-black/80 backdrop-blur-md text-white text-xs font-bold px-3 py-2 rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover:bg-yellow-500 transition-colors border border-white/10">Premium</span>
                  <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-zinc-400 group-hover:bg-yellow-500 group-hover:text-white group-hover:border-yellow-500 transition-colors shadow-lg shadow-black/20">
                    <Shield size={18} />
                  </div>
                </button>
                <button onClick={() => { setModalOpen('post'); setFabOpen(false); }} className="flex items-center justify-end gap-3 group">
                  <span className="bg-black/80 backdrop-blur-md text-white text-xs font-bold px-3 py-2 rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover:bg-green-500 transition-colors border border-white/10">Hack</span>
                  <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-zinc-400 group-hover:bg-green-500 group-hover:text-white group-hover:border-green-500 transition-colors shadow-lg shadow-black/20">
                    <Home size={18} />
                  </div>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          <button 
            onClick={() => setFabOpen(!fabOpen)}
            className="w-14 h-14 bg-gradient-to-r from-green-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-purple-500/30 hover:scale-105 active:scale-95 transition-transform pointer-events-auto border-2 border-black"
          >
            <motion.div
              animate={{ rotate: fabOpen ? 45 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Plus size={24} />
            </motion.div>
          </button>
        </div>
      )}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} t={t} theme={theme} />

      <AnimatePresence>
        {logoutConfirmOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLogoutConfirmOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-xs bg-zinc-900 border border-zinc-800 rounded-3xl p-6 text-center shadow-2xl"
            >
              <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogOut size={32} />
              </div>
              <h3 className="text-lg font-bold mb-2">{t('logoutConfirm')}</h3>
              <div className="flex gap-3 mt-6">
                <button 
                  onClick={() => setLogoutConfirmOpen(false)}
                  className="flex-1 py-3 bg-zinc-800 text-zinc-400 font-bold rounded-xl hover:bg-zinc-700 transition-colors"
                >
                  {t('no')}
                </button>
                <button 
                  onClick={confirmLogout}
                  className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors"
                >
                  {t('yes')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirm(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative w-full max-w-xs bg-zinc-900 border border-zinc-800 rounded-3xl p-6 text-center shadow-2xl"
            >
              <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={32} />
              </div>
              <h3 className="text-lg font-bold mb-2">{t('deleteConfirm')}</h3>
              <div className="flex gap-3 mt-6">
                <button 
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-3 bg-zinc-800 text-zinc-400 font-bold rounded-xl hover:bg-zinc-700 transition-colors"
                >
                  {t('cancel')}
                </button>
                <button 
                  onClick={handleDelete}
                  className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors"
                >
                  {t('delete')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

            <AnimatePresence>
        {selectedUserForAction && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 w-full max-w-sm"
            >
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-800">
                {selectedUserForAction.photoURL ? (
                  <img src={selectedUserForAction.photoURL} alt="" className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center">
                    <UserIcon size={24} className="text-zinc-600" />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-black text-white leading-tight flex items-center gap-1">
                    {selectedUserForAction.displayName}
                    {selectedUserForAction.verified && <BadgeCheck size={16} className="text-blue-500" />}
                  </h3>
                  <div className="text-xs text-zinc-500">{selectedUserForAction.email}</div>
                </div>
              </div>
              
              <div className="space-y-3">
                {!selectedUserForAction.verified && (
                  <button onClick={() => {
                    if (window.confirm("Are you sure you want to verify this account?")) {
                      updateDoc(doc(db, 'users', selectedUserForAction.uid), { verified: true }).then(() => setSelectedUserForAction(null));
                    }
                  }} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
                    <BadgeCheck size={18} /> Verify User
                  </button>
                )}
                
                {!selectedUserForAction.banned && (
                  <button onClick={() => {
                    if (window.confirm("Are you sure you want to ban this account?")) {
                      updateDoc(doc(db, 'users', selectedUserForAction.uid), { banned: true }).then(() => setSelectedUserForAction(null));
                    }
                  }} className="w-full bg-red-600 hover:bg-red-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
                    <Ban size={18} /> Ban Account
                  </button>
                )}
                
                <button onClick={() => {
                  setViewingProfileId(selectedUserForAction.uid);
                  setActiveTab('profile');
                  setSelectedUserForAction(null);
                }} className="w-full bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
                  <UserIcon size={18} /> View Profile
                </button>
                
                <button onClick={() => setSelectedUserForAction(null)} className="w-full bg-transparent text-zinc-500 hover:text-zinc-300 py-3 rounded-xl font-bold mt-4 border border-zinc-800 transition-colors">
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {modalOpen && (
          <AddModal isAdmin={isAdmin} 
            isOpen={!!modalOpen}
            type={modalOpen}
            onClose={() => {
              setModalOpen(null);
              setEditingItem(null);
            }}
            t={t}
            initialData={editingItem}
            onAdd={async (data) => {
              const collectionName = modalOpen === 'post' ? 'home_posts' : modalOpen === 'news' ? 'cyber_news' : modalOpen === 'aiprompt' ? 'ai_prompts' : 'premium_apk';
              try {
                if (editingItem) {
                  const { id, ...updateData } = data;
                  await updateDoc(doc(db, collectionName, editingItem.id), updateData);
                } else {
                  await addDoc(collection(db, collectionName), { ...data, createdAt: serverTimestamp(), authorId: user?.uid });
                }
                setModalOpen(null);
                setEditingItem(null);
              } catch (error) {
                handleFirestoreError(error, editingItem ? OperationType.UPDATE : OperationType.CREATE, collectionName);
              }
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedNews && (
          <NewsDetailModal 
            key={selectedNews.id}
            news={selectedNews}
            onClose={() => setSelectedNews(null)}
            t={t}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedPrompt && (
          <AiPromptDetailModal 
            key={selectedPrompt.id}
            prompt={selectedPrompt}
            onClose={() => setSelectedPrompt(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isProcessingLink && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-purple-500 border-t-transparent flex items-center justify-center rounded-full mb-6"
            >
              <div className="w-8 h-8 border-4 border-zinc-700 border-b-transparent rounded-full" />
            </motion.div>
            <h3 className="text-2xl font-black text-white mb-2 tracking-tight">{t('processing')}</h3>
            <p className="text-zinc-400 font-medium">{t('pleaseWait')}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <PasswordModal 
        isOpen={showAviatorPasswordPrompt}
        onClose={() => setShowAviatorPasswordPrompt(false)}
        onSuccess={() => handleExternalLink('https://aviatorpredict.com')}
        expectedPassword={systemConfig?.aviatorPassword || '123456'}
        requestMessage="『Aviator Predictor』password from app"
        t={t}
      />

      <PasswordModal 
        isOpen={!!pendingAiChatLink}
        onClose={() => setPendingAiChatLink(null)}
        onSuccess={() => {
          if (pendingAiChatLink) {
            handleExternalLink(pendingAiChatLink.url);
            setPendingAiChatLink(null);
          }
        }}
        expectedPassword="richard"
        requestMessage={`『${pendingAiChatLink?.name}』password`}
        t={t}
      />

      <AnimatePresence>
        {adsManagerOpen && (
          <AdminAdsManager t={t} onBack={() => setAdsManagerOpen(false)} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {networkModalOpen && (
          <NetworkModal
            isOpen={networkModalOpen}
            onClose={() => setNetworkModalOpen(false)}
            initialTab={networkModalTab}
            displayedProfile={activeTab === "profile" ? (viewingProfileId ? users.find(u => u.uid === viewingProfileId) : profile) || null : null}
            currentUserProfile={profile}
            users={users}
            handleToggleFollowGlobal={handleToggleFollowGlobal}
            t={t}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {userSearchModalOpen && (
          <UserSearchModal
            isOpen={userSearchModalOpen}
            onClose={() => setUserSearchModalOpen(false)}
            users={users}
            currentUserProfile={profile}
            handleToggleFollowGlobal={handleToggleFollowGlobal}
            onUserSelect={(uid) => {
              setViewingProfileId(uid);
              setActiveTab('profile');
              setUserSearchModalOpen(false);
            }}
            t={t}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
