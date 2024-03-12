import { createContext, useState } from "react";

export const DataContext = createContext(null);
export function DataProvider({ children }) {
  const [session, setSession] = useState({});
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  return (
    <DataContext.Provider
      value={{
        session: { session, setSession },
        loading: { loading, setLoading },
        socket: { socket, setSocket },
      }}>
      {children}
    </DataContext.Provider>
  );
}
