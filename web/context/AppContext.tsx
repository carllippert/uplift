import { Web3Auth } from "@web3auth/web3auth";
import React, { useState, createContext, useContext, useEffect } from "react";
import { CHAIN_NAMESPACES, SafeEventEmitterProvider } from "@web3auth/base";

export interface AppContext {
  login: () => void;
  web3auth: Web3Auth | null;
  provider: SafeEventEmitterProvider | null;
}

const AppContext = createContext<AppContext>({
  login: () => {},
  web3auth: null,
  provider: null,
});

export interface Props {
  [propName: string]: any;
}

const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || "";

export const AppContextProvider = (props: Props) => {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(
    null
  );

  useEffect(() => {
    const init = async () => {
      try {
        const web3auth = new Web3Auth({
          clientId,
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: "0x13881", // hex of 80001, polygon testnet
            rpcTarget: "https://rpc.ankr.com/polygon_mumbai", // This is the public RPC we have added, please pass on your own endpoint while creating an app
          },
        });

        setWeb3auth(web3auth);

        await web3auth.initModal();
        if (web3auth.provider) {
          setProvider(web3auth.provider);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const login = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const web3authProvider = await web3auth.connect();
    setProvider(web3authProvider);
  };

  const value = {
    login,
    web3auth,
    provider,
  };

  return <AppContext.Provider value={value} {...props} />;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error(`useAppContext must be used within a AppContextProvider.`);
  }
  return context;
};
