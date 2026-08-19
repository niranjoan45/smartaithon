import { create } from 'zustand';

export type UserRole = 'ADMIN' | 'USER';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  department?: string;
}

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  loginAsRole: (role: UserRole) => void;
  logout: () => void;
  setRole: (role: UserRole) => void;
  setUser: (user: UserProfile) => void;
  toggleRole: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,

  loginAsRole: (role: UserRole) => {
    const profile: UserProfile = {
      id: role === 'ADMIN' ? 'usr-admin-01' : 'usr-citizen-02',
      name: role === 'ADMIN' ? 'Commander Sarah Vance' : 'Citizen Alex Mercer',
      email: role === 'ADMIN' ? 's.vance@cityguardian.gov' : 'alex.mercer@citycitizen.org',
      role,
      department: role === 'ADMIN' ? 'Executive Emergency Command' : 'Resident Citizen'
    };

    set({
      user: profile,
      isAuthenticated: true
    });
  },

  logout: () => {
    set({
      user: null,
      isAuthenticated: false
    });
  },

  setRole: (role: UserRole) => {
    set((state) => ({
      user: state.user ? {
        ...state.user,
        role,
        name: role === 'ADMIN' ? 'Commander Sarah Vance' : 'Citizen Alex Mercer',
        email: role === 'ADMIN' ? 's.vance@cityguardian.gov' : 'alex.mercer@citycitizen.org',
        department: role === 'ADMIN' ? 'Executive Emergency Command' : 'Resident Citizen'
      } : {
        id: 'usr-default',
        name: role === 'ADMIN' ? 'Commander Sarah Vance' : 'Citizen Alex Mercer',
        email: role === 'ADMIN' ? 's.vance@cityguardian.gov' : 'alex.mercer@citycitizen.org',
        role,
        department: role === 'ADMIN' ? 'Executive Emergency Command' : 'Resident Citizen'
      },
      isAuthenticated: true
    }));
  },

  setUser: (user: UserProfile) => set({ user, isAuthenticated: true }),

  toggleRole: () => {
    const currentRole = get().user?.role || 'USER';
    const newRole: UserRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
    get().setRole(newRole);
  }
}));
