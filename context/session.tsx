//import { useRouter } from 'next/router';
import { createContext, useContext, useEffect, useState } from 'react';
import { bigCommerceSDK } from '../scripts/bcSdk';

const SessionContext = createContext({ context: '' });

const SessionProvider = ({ children }) => {
    //const { query } = useRouter();
    const [context, setContext] = useState('');

    useEffect(() => {
        const currentUrl = window.location.href;
        const urlParams = new URLSearchParams(currentUrl);
        const context = urlParams.get('context');
        if (context) {
            setContext(context.toString());
            // Keeps app in sync with BC (e.g. heatbeat, user logout, etc)
            bigCommerceSDK(context);
        }
    }, []);

    return (
        <SessionContext.Provider value={{ context }}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSession = () => useContext(SessionContext);

export default SessionProvider;