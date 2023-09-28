import React, { FC, createContext } from 'react'

interface ReactGridIdContextProps {
  id: string;
  children: React.ReactNode;
}

const ReactGridIdContext = createContext<string>("");

export const ReactGridIdProvider: FC<ReactGridIdContextProps> = ({ id, children }) => (
  <ReactGridIdContext.Provider value={id}>
    {children}
  </ReactGridIdContext.Provider>
)

export const useReactGridId = (): string => React.useContext(ReactGridIdContext);
