import { createContext, useState, useContext } from 'react';

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  return (
    <SidebarContext.Provider value={{ isSidebarOpen, toggleSidebar ,setIsSidebarOpen}}>
      {children}
    </SidebarContext.Provider>
  );
};
    
export const useSidebar = () => {
  return useContext(SidebarContext);
};  