import React, { createContext, useContext, useEffect, useState } from 'react';
import sdk from '@farcaster/miniapp-sdk';
import { useConnect, useAccount } from 'wagmi';

const FarcasterContext = createContext({
    context: undefined,
    isLoaded: false,
});

export const FarcasterProvider = ({ children }) => {
    const [context, setContext] = useState();
    const [isLoaded, setIsLoaded] = useState(false);
    const { connect, connectors } = useConnect();
    const { isConnected } = useAccount();

    useEffect(() => {
        const load = async () => {
            try {
                const frameContext = await sdk.context;
                setContext(frameContext);

                // Auto-connect Farcaster wallet if available and not connected
                if (frameContext && !isConnected) {
                    const farcasterConnector = connectors.find(c => c.id === 'farcasterFrame');
                    if (farcasterConnector) {
                        connect({ connector: farcasterConnector });
                    }
                }
            } catch (error) {
                console.error('Error loading Farcaster context:', error);
            } finally {
                setIsLoaded(true);
                // Signal to Farcaster that the frame is ready
                sdk.actions.ready();
            }
        };

        if (!isLoaded) {
            load();
        }
    }, [connect, connectors, isConnected, isLoaded]);

    return (
        <FarcasterContext.Provider value={{ context, isLoaded }}>
            {children}
        </FarcasterContext.Provider>
    );
};

export const useFarcaster = () => useContext(FarcasterContext);
