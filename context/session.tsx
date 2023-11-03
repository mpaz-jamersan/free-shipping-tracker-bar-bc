import jwt from 'jsonwebtoken';
import { useRouter } from 'next/router';
import { createContext, useContext, useEffect, useState } from 'react';
import { bigCommerceSDK } from '../scripts/bcSdk';

const SessionContext = createContext({ sub: '' });

const SessionProvider = ({ children }) => {
    const { query } = useRouter();
    const [sub, setContext] = useState('');

    useEffect(() => {
        const signedPayloadJwt = query.signed_payload_jwt;
        const decodedToken = jwt.decode(signedPayloadJwt, { complete: true });
        if (!decodedToken) {
            return;
        }

        const payload = decodedToken.payload;
        if (payload.sub) {
            setContext(payload.sub.toString());
            // Keeps app in sync with BC (e.g. heatbeat, user logout, etc)
            bigCommerceSDK(payload.sub);
        }
    }, [query.signed_payload_jwt]);

    return (
        <SessionContext.Provider value={{ sub }}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSession = () => useContext(SessionContext);

export default SessionProvider;
