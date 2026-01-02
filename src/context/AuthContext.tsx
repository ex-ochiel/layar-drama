"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string) => Promise<void>;
    register: (name: string, email: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data storage key
const STORAGE_KEY = "layar-drama-auth";

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Load user from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setUser(JSON.parse(stored));
            }
        } catch (error) {
            console.error("Error loading auth state:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const login = async (email: string) => {
        setIsLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const mockUser: User = {
            id: "user-1",
            name: email.split("@")[0] || "User",
            email: email,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        };

        setUser(mockUser);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser));
        setIsLoading(false);
        router.push("/");
    };

    const register = async (name: string, email: string) => {
        setIsLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const mockUser: User = {
            id: "user-1",
            name: name,
            email: email,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
        };

        setUser(mockUser);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser));
        setIsLoading(false);
        router.push("/");
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem(STORAGE_KEY);
        router.push("/login"); // Redirect to login after logout
        router.refresh(); // Refresh to update UI states
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
