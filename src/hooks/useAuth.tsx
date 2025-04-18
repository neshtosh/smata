import { useState, createContext, useContext, ReactNode } from 'react';

// Dummy credentials for testing
const DUMMY_PHONE = '+254700000000';
const DUMMY_OTP = '123456';

interface AuthContextType {
  user: any;
  loading: boolean;
  error: string | null;
  signInWithPhone: (phone: string) => Promise<boolean>;
  verifyOtp: (phone: string, otp: string) => Promise<boolean>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signInWithPhone = async (phone: string) => {
    try {
      setLoading(true);
      setError(null);
      
      if (phone !== DUMMY_PHONE) {
        setError('Please use the dummy phone number: ' + DUMMY_PHONE);
        return false;
      }
      
      // Store phone for OTP verification
      localStorage.setItem('pendingPhone', phone);
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (phone: string, otp: string) => {
    try {
      setLoading(true);
      setError(null);
      
      if (phone !== DUMMY_PHONE) {
        setError('Invalid phone number');
        return false;
      }
      
      if (otp === DUMMY_OTP) {
        setUser({ phone });
        localStorage.removeItem('pendingPhone');
        return true;
      } else {
        setError('Invalid verification code. Use: ' + DUMMY_OTP);
        return false;
      }
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      setUser(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    signInWithPhone,
    verifyOtp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
