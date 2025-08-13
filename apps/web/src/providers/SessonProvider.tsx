import { createContext,useState,useEffect,useContext, ReactNode, useCallback } from "react";
import { getSession } from "../utils/webFetch";

interface SessionContextProps{
    username:string|null,
    loading:boolean,
    isAdmin:boolean,
    fetchSession:()=>void,
    /**
     * For explicitly setting the session, for example in login
     * @param username username of the user
     * @returns void
     */
    setSession:(username:string|null)=>void,
}
const SessionContext = createContext<SessionContextProps | undefined>(undefined);

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) throw new Error('useSession must be used within SessionContext');
  return context;
};

export const SessionProvider = ({ children }: { children: ReactNode })=>{
  const [username, setUsername] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true);

  const fetchSession = useCallback(async ()=>{
    setLoading(true);
    const user = await getSession();
    console.log(JSON.stringify(user))
    setUsername(user?.username);
    setIsAdmin(!!user.isAdmin);
    setLoading(false);
  },[]
)
  const setSession = (username:string | null)=>setUsername(username)

  useEffect(()=>{
    fetchSession();
  },[])

    return (
    <SessionContext.Provider value={{ username, loading, isAdmin,fetchSession, setSession }}>
      {children}
    </SessionContext.Provider>
  );

}