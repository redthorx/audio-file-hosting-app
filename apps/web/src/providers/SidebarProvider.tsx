import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useSession } from './SessonProvider';

//set this somewhere else later
export const SidebarNavLink = ['Audio Upload', 'User management'] as const
export type SidebarNavLink = typeof SidebarNavLink[number]

export const adminLinks:SidebarNavLink[]= ['Audio Upload','User management']
export const userLinks:SidebarNavLink[] = ['Audio Upload']


interface SidebarContextProps {
    selected:SidebarNavLink,
    availableLinks:SidebarNavLink[],
    setSelected:(link:SidebarNavLink)=>void
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) throw new Error('useSidebar must be used within SidebarProvider');
  return context;
};

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const session = useSession();
  const [availableLinks, setAvailableLinks] = useState<SidebarNavLink[]>([])
  const [selected, setSelected] = useState<SidebarNavLink>('Audio Upload');
  useEffect(()=>{
    if(!session.loading){
      if(session.isAdmin){
        setAvailableLinks(adminLinks);
        return;
      }
      setAvailableLinks(userLinks)
    }
  },[session])
  return (
    <SidebarContext.Provider value={{ selected,availableLinks,setSelected }}>
      {children}
    </SidebarContext.Provider>
  );
};