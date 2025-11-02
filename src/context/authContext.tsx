import { createContext, useState, useContext,useEffect, type ReactNode } from "react";
import { refreshAccessToken } from "@/api/auth";
import { setStoredAccessToken } from "@/lib/authToken";


type AuthContextType = {
    accessToken: string | null;
    setAccessToken: (token: string) => void;
    user: {name:string, id:string, email:string} | null;
    setUser: (user: AuthContextType['user']) => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider = ({children}: {children: ReactNode}) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [user, setUser] = useState<AuthContextType['user'] | null>(null);
    useEffect(() => {
        const loadAuth = async () => {
            try {
                const {accessToken: newToken, user} =await refreshAccessToken()
                setAccessToken(newToken)
                setUser(user)
                setStoredAccessToken(newToken)
            } catch (err:any) {
                console.log('Failed to fetch access token')
            }
        }
        loadAuth();
    }, [])

    useEffect(() => {
        setStoredAccessToken(accessToken)
    }, [accessToken])
    return (
        <AuthContext.Provider value={{accessToken, setAccessToken, user, setUser}}>
            {children}
        </AuthContext.Provider>
    )

}


export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within a provider')
    }
    return context
}
