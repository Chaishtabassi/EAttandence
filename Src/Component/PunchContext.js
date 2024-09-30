import React, { createContext, useState } from 'react';

export const PunchContext = createContext();

export const PunchProvider = ({ children }) => {
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [punchInTime, setPunchInTime] = useState(null); 

  return (
    <PunchContext.Provider value={{ isPunchedIn, setIsPunchedIn, punchInTime, setPunchInTime }}>
      {children}
    </PunchContext.Provider>
  );
};
