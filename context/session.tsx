import jwt from 'jsonwebtoken';
import { useRouter } from 'next/router';
import { createContext, useContext, useEffect, useState } from 'react';
import { bigCommerceSDK } from '../scripts/bcSdk';

const SessionContext = createContext({ context: '' });

const SessionProvider = ({ children }) => {
    const { query } = useRouter();
    const [context, setContext] = useState('');

    useEffect(() => {
        const signedPayloadJwt = query.signed_payload_jwt;
        const decodedToken = jwt.decode(signedPayloadJwt, { complete: true });
        const payload = decodedToken.payload;
        const context = payload.context;
        if (context) {
            setContext(context.toString());
            // Keeps app in sync with BC (e.g. heatbeat, user logout, etc)
            bigCommerceSDK(context);
        }
    }, [query.signed_payload_jwt]);

    return (
        <SessionContext.Provider value={{ context }}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSession = () => useContext(SessionContext);

export default SessionProvider;
