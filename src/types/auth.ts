export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  companyName?: string;
  createdAt: Date;
  subscription: {
    plan: 'free' | 'pro' | 'enterprise';
    status: 'active' | 'expired' | 'trial';
    expiresAt: Date;
  };
}

export interface AuthResponse {
  user: User;
  token: string;
}