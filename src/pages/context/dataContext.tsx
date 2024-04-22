import { ReactNode, createContext, useContext, useState } from "react";
import { Data, LoadingContextType } from "../../@types/context";

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [apiData, setApiData] = useState<Data[] | null>(null);

    return (
        <LoadingContext.Provider value={{ loading, setLoading, apiData, setApiData }}>
          {children}
        </LoadingContext.Provider>
      );
}

export const useLoadingContext = (): LoadingContextType => {
    const context = useContext(LoadingContext);
    if (!context) {
      throw new Error('useLoadingContext must be used within a LoadingProvider');
    }
    return context;
  };