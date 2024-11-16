export interface Permission {
  id: string;
  name: string;
  description: string;
  key: string;
  module: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ... (diğer mevcut tipler)