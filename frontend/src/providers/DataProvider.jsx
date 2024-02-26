import { createContext, useState } from "react";

export const DataContext = createContext(null);
export function DataProvider({ children }) {
  const [session, setSession] = useState({});
  const [loading, setLoading] = useState(false);
  return (
    <DataContext.Provider
      value={{
        session: { session, setSession },
        loading: { loading, setLoading },
      }}>
      {children}
    </DataContext.Provider>
  );
}
