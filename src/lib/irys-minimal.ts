import { WebIrys } from '@irys/sdk';
import { ethers } from 'ethers';

// Irys configuration
const IRYS_NODE = 'https://testnet-rpc.irys.xyz/v1/execution-rpc';
const IRYS_CURRENCY = 'IRYS';
const IRYS_NETWORK = 'testnet';

// Enhanced data structures with additional fields
export interface LinktreeData {
  username: string;
  displayName: string;
  bio: string;
  avatar?: string;
  coverImage?: string;
  links: Link[];
  socialLinks: SocialLink[];
  theme: Theme;
  contactInfo: ContactInfo;
  location: Location;
  monetization?: MonetizationData;
  createdAt: string;
  updatedAt: string;
}

export interface ContactInfo {
  email?: string;
  phone?: string;
  website?: string;
}

export interface Location {
  city?: string;
  country?: string;
  timezone?: string;
}

// Add missing monetization interfaces
export interface PaymentLink {
  id: string;
  title: string;
  url: string;
  amount?: number;
  currency?: string;
  description?: string;
  active: boolean;
  createdAt: string;
  analytics?: {
    clicks: number;
    conversions: number;
    revenue: number;
  };
}

export interface DonationSettings {
  enabled: boolean;
  title: string;
  description: string;
  suggestedAmounts: number[];
  currency: string;
}

export interface AffiliateLink {
  id: string;
  title: string;
  url: string;
  commission?: number;
  description?: string;
  active: boolean;
  createdAt: string;
  originalUrl?: string;
  affiliateUrl?: string;
  analytics?: {
    clicks: number;
    earnings: number;
    conversions: number;
  };
}

export interface MonetizationData {
  paymentLinks: PaymentLink[];
  donationSettings: DonationSettings;
  affiliateLinks: AffiliateLink[];
}

export interface Link {
  id: string;
  title: string;
  url: string;
  active: boolean;
  order: number;
  clicks: number;
  customIcon?: string;
  createdAt: string;
  analytics?: {
    clicks: number;
    uniqueClicks: number;
    clicksByDate: Record<string, number>;
    referrers: string[];
    conversionRate: number;
  };
  customization?: {
    backgroundColor: string;
    textColor: string;
    borderRadius: number;
  };
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface Theme {
  name: string;
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  borderRadius: number;
  fontFamily?: string;
  backgroundPattern?: string;
  spacing?: number;
  customCSS?: string;
}

// Enhanced preset themes
export const PRESET_THEMES: Record<string, Theme> = {
  irys: {
    name: 'Irys',
    primaryColor: '#8b5cf6',
    backgroundColor: '#0f0f23',
    textColor: '#ffffff',
    borderRadius: 12,
    fontFamily: 'Inter, sans-serif',
    spacing: 16
  },
  dark: {
    name: 'Dark',
    primaryColor: '#6366f1',
    backgroundColor: '#1e1b4b',
    textColor: '#ffffff',
    borderRadius: 8,
    fontFamily: 'Inter, sans-serif',
    spacing: 16
  },
  light: {
    name: 'Light',
    primaryColor: '#3b82f6',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    borderRadius: 8,
    fontFamily: 'Inter, sans-serif',
    spacing: 16
  },
  minimal: {
    name: 'Minimal',
    primaryColor: '#000000',
    backgroundColor: '#f8fafc',
    textColor: '#1f2937',
    borderRadius: 4,
    fontFamily: 'Inter, sans-serif',
    spacing: 12
  },
  gradient: {
    name: 'Gradient',
    primaryColor: '#ec4899',
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    textColor: '#ffffff',
    borderRadius: 16,
    fontFamily: 'Poppins, sans-serif',
    spacing: 20
  },
  neon: {
    name: 'Neon',
    primaryColor: '#00ff88',
    backgroundColor: '#0a0a0a',
    textColor: '#ffffff',
    borderRadius: 8,
    fontFamily: 'Roboto, sans-serif',
    backgroundPattern: 'grid',
    spacing: 16
  }
};

export class IrysLinktree {
  private irys: WebIrys | null = null;
  private wallet: ethers.Wallet | null = null;

  async initialize(): Promise<void> {
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send('eth_requestAccounts', []);
        const signer = await provider.getSigner();
        
        this.irys = new WebIrys({
          url: IRYS_NODE,
          token: IRYS_CURRENCY,
          wallet: {
            provider: signer
          }
        });
        
        await this.irys.ready();
      } else {
        throw new Error('MetaMask not found');
      }
    } catch (error) {
      console.error('Failed to initialize Irys:', error);
      throw error;
    }
  }

  async uploadLinktree(data: LinktreeData): Promise<string> {
    if (!this.irys) {
      throw new Error('Irys not initialized');
    }

    try {
      const dataString = JSON.stringify({
        ...data,
        updatedAt: new Date().toISOString()
      });
      
      const tags = [
        { name: 'Content-Type', value: 'application/json' },
        { name: 'App-Name', value: 'IrysLinktree' },
        { name: 'App-Version', value: '1.0.0' },
        { name: 'Username', value: data.username }
      ];

      const receipt = await this.irys.upload(dataString, { tags });
      return receipt.id;
    } catch (error) {
      console.error('Failed to upload to Irys:', error);
      throw error;
    }
  }

  async getLinktree(transactionId: string): Promise<LinktreeData | null> {
    try {
      const response = await fetch(`${IRYS_NODE}/${transactionId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const data = await response.json();
      return data as LinktreeData;
    } catch (error) {
      console.error('Failed to get linktree:', error);
      return null;
    }
  }

  async getBalance(): Promise<string> {
    if (!this.irys) {
      return '0';
    }

    try {
      const balance = await this.irys.getLoadedBalance();
      return ethers.formatEther(balance.toString());
    } catch (error) {
      console.error('Failed to get balance:', error);
      return '0';
    }
  }

  async fundAccount(amount: string): Promise<void> {
    if (!this.irys) {
      throw new Error('Irys not initialized');
    }

    try {
      const amountInWei = ethers.parseEther(amount);
      await this.irys.fund(amountInWei);
    } catch (error) {
      console.error('Failed to fund account:', error);
      throw error;
    }
  }
}

// Utility functions
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const createEmptyLink = (): Link => ({
  id: generateId(),
  title: '',
  url: '',
  active: true,
  order: 0,
  clicks: 0,
  createdAt: new Date().toISOString()
});

export const createEmptySocialLink = (): SocialLink => ({
  platform: '',
  url: ''
});

export const createEmptyLinktreeData = (): LinktreeData => ({
  username: '',
  displayName: '',
  bio: '',
  avatar: '',
  coverImage: '',
  links: [],
  socialLinks: [],
  theme: PRESET_THEMES.irys,
  contactInfo: {
    email: '',
    phone: '',
    website: ''
  },
  location: {
    city: '',
    country: '',
    timezone: ''
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});