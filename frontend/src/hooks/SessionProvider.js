import React, { createContext, useContext } from 'react';
import useOpenViduSession from '../hooks/useOpenViduSession';

const SessionContext = createContext(null);

export const SessionProvider = ({ scheduleId, children }) => {
    const sessionData = useOpenViduSession(scheduleId);

    return <SessionContext.Provider value={sessionData}>{children}</SessionContext.Provider>;
};

export const useSession = () => {
    return useContext(SessionContext);
};
