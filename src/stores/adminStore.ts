import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Role, Permission, AdminUser } from '../types/admin';
import toast from 'react-hot-toast';

interface Organization {
  id: string;
  name: string;
  description?: string;
  type: 'team' | 'company';
  logo?: string;
  status: 'active' | 'inactive' | 'suspended';
  members: Array<{
    id: string;
    userId: string;
    role: 'admin' | 'member';
  }>;
  website?: string;
  industry?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface AdminStore {
  roles: Role[];
  permissions: Permission[];
  adminUsers: AdminUser[];
  organizations: Organization[];
  isLoading: boolean;
  error: string | null;

  // Rol işlemleri
  createRole: (data: Partial<Role>) => Promise<void>;
  updateRole: (id: string, data: Partial<Role>) => Promise<void>;
  deleteRole: (id: string) => Promise<void>;
  assignPermissionsToRole: (roleId: string, permissionIds: string[]) => Promise<void>;

  // Yetkili işlemleri
  createAdminUser: (data: Partial<AdminUser>) => Promise<void>;
  updateAdminUser: (id: string, data: Partial<AdminUser>) => Promise<void>;
  deleteAdminUser: (id: string) => Promise<void>;

  // Organizasyon işlemleri
  createOrganization: (data: Partial<Organization>) => Promise<void>;
  updateOrganization: (id: string, data: Partial<Organization>) => Promise<void>;
  deleteOrganization: (id: string) => Promise<void>;
  addOrganizationMember: (orgId: string, userId: string, role: 'admin' | 'member') => Promise<void>;
  removeOrganizationMember: (orgId: string, userId: string) => Promise<void>;
}

// Örnek veriler
const defaultOrganizations: Organization[] = [
  {
    id: '1',
    name: 'Yazılım Ekibi',
    description: 'Ana yazılım geliştirme ekibi',
    type: 'team',
    status: 'active',
    members: [
      { id: '1', userId: 'user1', role: 'admin' },
      { id: '2', userId: 'user2', role: 'member' },
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'ABC Şirketi',
    description: 'Kurumsal müşteri',
    type: 'company',
    status: 'active',
    website: 'https://abc.com',
    industry: 'Teknoloji',
    members: [
      { id: '3', userId: 'user3', role: 'admin' },
    ],
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
];

export const useAdminStore = create<AdminStore>()(
  persist(
    (set, get) => ({
      roles: [],
      permissions: [],
      adminUsers: [],
      organizations: defaultOrganizations,
      isLoading: false,
      error: null,

      createRole: async (data: Partial<Role>) => {
        set({ isLoading: true, error: null });
        try {
          const newRole: Role = {
            id: crypto.randomUUID(),
            ...data,
            permissions: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          } as Role;

          set(state => ({
            roles: [...state.roles, newRole]
          }));
          toast.success('Rol başarıyla oluşturuldu');
        } catch (error: any) {
          set({ error: error.message });
          toast.error('Rol oluşturulamadı');
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      updateRole: async (id: string, data: Partial<Role>) => {
        set({ isLoading: true, error: null });
        try {
          set(state => ({
            roles: state.roles.map(role =>
              role.id === id
                ? { ...role, ...data, updatedAt: new Date() }
                : role
            )
          }));
          toast.success('Rol güncellendi');
        } catch (error: any) {
          set({ error: error.message });
          toast.error('Rol güncellenemedi');
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      deleteRole: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          set(state => ({
            roles: state.roles.filter(role => role.id !== id)
          }));
          toast.success('Rol silindi');
        } catch (error: any) {
          set({ error: error.message });
          toast.error('Rol silinemedi');
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      assignPermissionsToRole: async (roleId: string, permissionIds: string[]) => {
        set({ isLoading: true, error: null });
        try {
          set(state => ({
            roles: state.roles.map(role =>
              role.id === roleId
                ? {
                    ...role,
                    permissions: permissionIds.map(id =>
                      state.permissions.find(p => p.id === id)
                    ).filter(Boolean) as Permission[],
                    updatedAt: new Date()
                  }
                : role
            )
          }));
          toast.success('İzinler atandı');
        } catch (error: any) {
          set({ error: error.message });
          toast.error('İzinler atanamadı');
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      createAdminUser: async (data: Partial<AdminUser>) => {
        set({ isLoading: true, error: null });
        try {
          const newAdmin: AdminUser = {
            id: crypto.randomUUID(),
            ...data,
            status: 'active',
            createdAt: new Date(),
            updatedAt: new Date(),
          } as AdminUser;

          set(state => ({
            adminUsers: [...state.adminUsers, newAdmin]
          }));
          toast.success('Yetkili kullanıcı oluşturuldu');
        } catch (error: any) {
          set({ error: error.message });
          toast.error('Yetkili kullanıcı oluşturulamadı');
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      updateAdminUser: async (id: string, data: Partial<AdminUser>) => {
        set({ isLoading: true, error: null });
        try {
          set(state => ({
            adminUsers: state.adminUsers.map(admin =>
              admin.id === id
                ? { ...admin, ...data, updatedAt: new Date() }
                : admin
            )
          }));
          toast.success('Yetkili kullanıcı güncellendi');
        } catch (error: any) {
          set({ error: error.message });
          toast.error('Yetkili kullanıcı güncellenemedi');
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      deleteAdminUser: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          set(state => ({
            adminUsers: state.adminUsers.filter(admin => admin.id !== id)
          }));
          toast.success('Yetkili kullanıcı silindi');
        } catch (error: any) {
          set({ error: error.message });
          toast.error('Yetkili kullanıcı silinemedi');
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      createOrganization: async (data: Partial<Organization>) => {
        set({ isLoading: true, error: null });
        try {
          const newOrg: Organization = {
            id: crypto.randomUUID(),
            ...data,
            members: [],
            status: 'active',
            createdAt: new Date(),
            updatedAt: new Date(),
          } as Organization;

          set(state => ({
            organizations: [...state.organizations, newOrg]
          }));
          toast.success('Organizasyon oluşturuldu');
        } catch (error: any) {
          set({ error: error.message });
          toast.error('Organizasyon oluşturulamadı');
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      updateOrganization: async (id: string, data: Partial<Organization>) => {
        set({ isLoading: true, error: null });
        try {
          set(state => ({
            organizations: state.organizations.map(org =>
              org.id === id
                ? { ...org, ...data, updatedAt: new Date() }
                : org
            )
          }));
          toast.success('Organizasyon güncellendi');
        } catch (error: any) {
          set({ error: error.message });
          toast.error('Organizasyon güncellenemedi');
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      deleteOrganization: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          set(state => ({
            organizations: state.organizations.filter(org => org.id !== id)
          }));
          toast.success('Organizasyon silindi');
        } catch (error: any) {
          set({ error: error.message });
          toast.error('Organizasyon silinemedi');
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      addOrganizationMember: async (orgId: string, userId: string, role: 'admin' | 'member') => {
        set({ isLoading: true, error: null });
        try {
          set(state => ({
            organizations: state.organizations.map(org =>
              org.id === orgId
                ? {
                    ...org,
                    members: [
                      ...org.members,
                      {
                        id: crypto.randomUUID(),
                        userId,
                        role,
                      },
                    ],
                    updatedAt: new Date(),
                  }
                : org
            ),
          }));
          toast.success('Üye eklendi');
        } catch (error: any) {
          set({ error: error.message });
          toast.error('Üye eklenemedi');
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      removeOrganizationMember: async (orgId: string, userId: string) => {
        set({ isLoading: true, error: null });
        try {
          set(state => ({
            organizations: state.organizations.map(org =>
              org.id === orgId
                ? {
                    ...org,
                    members: org.members.filter(member => member.userId !== userId),
                    updatedAt: new Date(),
                  }
                : org
            ),
          }));
          toast.success('Üye çıkarıldı');
        } catch (error: any) {
          set({ error: error.message });
          toast.error('Üye çıkarılamadı');
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'admin-store',
      partialize: (state) => ({
        roles: state.roles,
        permissions: state.permissions,
        adminUsers: state.adminUsers,
        organizations: state.organizations,
      }),
    }
  )
);