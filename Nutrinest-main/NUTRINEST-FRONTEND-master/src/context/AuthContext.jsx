import { createContext, useState, useEffect, useContext } from 'react';
import axiosClient from '../api/axiosClient';
import { jwtDecode } from 'jwt-decode';
import toast from 'react-hot-toast';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded); 
      } catch (error) {
        console.error("Invalid token", error);
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await axiosClient.post('/auth/login', credentials);
      const { token, user: userData, role } = response.data;
      
      const savedToken = token;
      localStorage.setItem('token', savedToken);
      
      const decoded = jwtDecode(savedToken);
      setUser(decoded); 
      
      toast.success('Logged in successfully');
      // Return userData or role so the component can redirect
      return { success: true, role: role || userData?.role || 'user' };
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Login failed');
      return { success: false };
    }
  };

  const signup = async (userData) => {
    try {
      await axiosClient.post('/auth/signup', userData);
      toast.success('Account created! Please login.');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Signup failed');
      return false;
    }
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      const response = await axiosClient.post('/auth/google', { idToken });
      const { token, user: userData, role } = response.data;
      localStorage.setItem('token', token);
      setUser(jwtDecode(token));
      toast.success(`Welcome${userData?.name ? `, ${userData.name}` : ''}!`);
      return { success: true, role: role || 'user' };
    } catch (error) {
      console.error('Google sign-in failed', error);
      if (error.code === 'auth/popup-closed-by-user') {
        toast.error('Google sign-in was cancelled.');
      } else if (error.code === 'auth/popup-blocked') {
        toast.error('Your browser blocked the Google sign-in popup. Please allow popups and try again.');
      } else {
        toast.error(error.response?.data?.message || error.message || 'Google sign-in failed');
      }
      return { success: false };
    }
  };

  const loginWithPhone = async (phone, otp) => {
    try {
      const response = await axiosClient.post('/auth/verify-otp', { phone, otp });
      const { token, user: userData, role } = response.data;
      localStorage.setItem('token', token);
      setUser(jwtDecode(token));
      toast.success(`Welcome${userData?.name ? `, ${userData.name}` : ''}!`);
      return { success: true, role: role || 'user' };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Phone verification failed');
      return { success: false };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out');
  };

  const forgotPassword = async (email) => {
     try {
      await axiosClient.post('/auth/forgot-password', { email });
      toast.success('Password reset link sent');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Request failed');
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, loginWithGoogle, loginWithPhone, logout, forgotPassword, loading }}>
        {!loading && children}
    </AuthContext.Provider>
  );
};
