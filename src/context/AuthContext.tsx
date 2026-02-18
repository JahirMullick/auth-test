import React, { createContext, useContext, useEffect, useState, ReactNode, useMemo } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { isTokenValid } from '../services/authHelper';

const TOKEN_KEY = 'auth_token';

// User info decoded from JWT
export interface User {
    sub: string;
    name: string;
    email: string;
    iat: number;
    exp: number;
}

interface AuthContextType {
    isLoading: boolean;
    isAuthenticated: boolean;
    token: string | null;
    user: User | null;
    signIn: (token: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Storage helper for cross-platform support (SecureStore for native, localStorage for web)
const storage = {
    async getItem(key: string): Promise<string | null> {
        if (Platform.OS === 'web') {
            return localStorage.getItem(key);
        }
        return await SecureStore.getItemAsync(key);
    },
    async setItem(key: string, value: string): Promise<void> {
        if (Platform.OS === 'web') {
            localStorage.setItem(key, value);
            return;
        }
        await SecureStore.setItemAsync(key, value);
    },
    async removeItem(key: string): Promise<void> {
        if (Platform.OS === 'web') {
            localStorage.removeItem(key);
            return;
        }
        await SecureStore.deleteItemAsync(key);
    },
};

// Base64 decode that works on web, iOS, and Android (no atob/Buffer dependency)
function base64Decode(input: string): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    // Convert base64url to standard base64
    let str = input.replace(/-/g, '+').replace(/_/g, '/');
    // Add padding
    while (str.length % 4 !== 0) {
        str += '=';
    }
    let output = '';
    for (let i = 0; i < str.length; i += 4) {
        const a = chars.indexOf(str[i]);
        const b = chars.indexOf(str[i + 1]);
        const c = chars.indexOf(str[i + 2]);
        const d = chars.indexOf(str[i + 3]);
        output += String.fromCharCode((a << 2) | (b >> 4));
        if (c !== 64) output += String.fromCharCode(((b & 15) << 4) | (c >> 2));
        if (d !== 64) output += String.fromCharCode(((c & 3) << 6) | d);
    }
    return output;
}

// Decode JWT payload to extract user info (cross-platform)
function decodeToken(token: string): User | null {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        const decoded = base64Decode(parts[1]);
        const data = JSON.parse(decoded);
        return {
            sub: data.sub,
            name: data.name,
            email: data.email,
            iat: data.iat,
            exp: data.exp,
        };
    } catch {
        return null;
    }
}

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [token, setToken] = useState<string | null>(null);

    // Derive user from token
    const user = useMemo(() => {
        if (!token) return null;
        return decodeToken(token);
    }, [token]);

    // Check for existing token on app launch
    useEffect(() => {
        async function loadToken() {
            try {
                // Minimum 2 second splash screen delay
                const minDelay = new Promise(resolve => setTimeout(resolve, 2000));

                const [storedToken] = await Promise.all([
                    storage.getItem(TOKEN_KEY),
                    minDelay,
                ]);

                if (storedToken) {
                    if (isTokenValid(storedToken)) {
                        setToken(storedToken);
                    } else {
                        // Token expired, remove it
                        await storage.removeItem(TOKEN_KEY);
                    }
                }
            } catch (error) {
                console.error('Error loading auth token:', error);
            } finally {
                setIsLoading(false);
            }
        }
        loadToken();
    }, []);

    const signIn = async (newToken: string) => {
        try {
            await storage.setItem(TOKEN_KEY, newToken);
            setToken(newToken);
        } catch (error) {
            console.error('Error saving auth token:', error);
            throw error;
        }
    };

    const signOut = async () => {
        try {
            await storage.removeItem(TOKEN_KEY);
            setToken(null);
        } catch (error) {
            console.error('Error removing auth token:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                isLoading,
                isAuthenticated: !!token,
                token,
                user,
                signIn,
                signOut,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
