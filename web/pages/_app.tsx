import "@rainbow-me/rainbowkit/styles.css";
import { useState, useEffect } from "react";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import {
  ConnectButton,
  connectorsForWallets,
  RainbowKitProvider,
  getDefaultWallets,
} from "@rainbow-me/rainbowkit";

import { Web3Auth } from "@web3auth/web3auth";
import { CHAIN_NAMESPACES, SafeEventEmitterProvider } from "@web3auth/base";
// import RPC from "../auth/ethersRPC";

import { Web3AuthConnector } from "@web3auth/web3auth-wagmi-connector";
import { InjectedConnector } from "wagmi/connectors/injected";
import { publicProvider } from "wagmi/providers/public";

import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { AppContextProvider } from "../context/AppContext";

const { chains, provider } = configureChains(

  [chain.mainnet, chain.polygon, chain.goerli],
  [publicProvider()]
);

const wallets = getDefaultWallets({ appName: "OnboardingFrens", chains });

const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || "";

const rainbowWeb3AuthConnector = ({ chains }: { chains: any }) => ({
  id: "web3auth",
  name: "Web3Auth",
  iconUrl: "https://web3auth.io/images/w3a-L-Favicon-1.svg",
  iconBackground: "#fff",
  createConnector: () => {
    const connector = new Web3AuthConnector({
      chains: chains,
      options: {
        enableLogging: true,
        clientId, // Get your own client id from https://dashboard.web3auth.io
        network: "testnet", // web3auth network, "mainnet", "cyan", or "aqua"
        chainId: "0x1", // chainId that you want to connect with
        socialLoginConfig: {},
      },
    });
    return {
      connector,
    };
  },
});

const connectors = connectorsForWallets([
  ...wallets.wallets,
  {
    groupName: "Recommended",
    wallets: [rainbowWeb3AuthConnector({ chains })],
  },
]);
const wagmiClient = createClient({
  connectors,
  provider,
});

function MyApp({ Component, pageProps }: AppProps) {
  // const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  // const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(
  //   null
  // );

  // useEffect(() => {
  //   const init = async () => {
  //     try {
  //       const web3auth = new Web3Auth({
  //         clientId,
  //         chainConfig: {
  //           chainNamespace: CHAIN_NAMESPACES.EIP155,
  //           chainId: "0x1",
  //           rpcTarget: "https://rpc.ankr.com/eth", // This is the public RPC we have added, please pass on your own endpoint while creating an app
  //         },
  //       });

  //       setWeb3auth(web3auth);

  //       await web3auth.initModal();
  //       if (web3auth.provider) {
  //         setProvider(web3auth.provider);
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   init();
  // }, []);

  // const login = async () => {
  //   if (!web3auth) {
  //     console.log("web3auth not initialized yet");
  //     return;
  //   }
  //   const web3authProvider = await web3auth.connect();
  //   setProvider(web3authProvider);
  // };

  // const getUserInfo = async () => {
  //   if (!web3auth) {
  //     console.log("web3auth not initialized yet");
  //     return;
  //   }
  //   const user = await web3auth.getUserInfo();
  //   console.log(user);
  // };

  // const logout = async () => {
  //   if (!web3auth) {
  //     console.log("web3auth not initialized yet");
  //     return;
  //   }
  //   await web3auth.logout();
  //   setProvider(null);
  // };

  // const getChainId = async () => {
  //   if (!provider) {
  //     console.log("provider not initialized yet");
  //     return;
  //   }
  //   const rpc = new RPC(provider);
  //   const chainId = await rpc.getChainId();
  //   console.log(chainId);
  // };
  // const getAccounts = async () => {
  //   if (!provider) {
  //     console.log("provider not initialized yet");
  //     return;
  //   }
  //   const rpc = new RPC(provider);
  //   const address = await rpc.getAccounts();
  //   console.log(address);
  // };

  // const getBalance = async () => {
  //   if (!provider) {
  //     console.log("provider not initialized yet");
  //     return;
  //   }
  //   const rpc = new RPC(provider);
  //   const balance = await rpc.getBalance();
  //   console.log(balance);
  // };

  // const sendTransaction = async () => {
  //   if (!provider) {
  //     console.log("provider not initialized yet");
  //     return;
  //   }
  //   const rpc = new RPC(provider);
  //   const receipt = await rpc.sendTransaction();
  //   console.log(receipt);
  // };

  // const signMessage = async () => {
  //   if (!provider) {
  //     console.log("provider not initialized yet");
  //     return;
  //   }
  //   const rpc = new RPC(provider);
  //   const signedMessage = await rpc.signMessage();
  //   console.log(signedMessage);
  // };

  // const getPrivateKey = async () => {
  //   if (!provider) {
  //     console.log("provider not initialized yet");
  //     return;
  //   }
  //   const rpc = new RPC(provider);
  //   const privateKey = await rpc.getPrivateKey();
  //   console.log(privateKey);
  // };

  return (
    <AppContextProvider>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains}>
          <Component {...pageProps} />
        </RainbowKitProvider>
      </WagmiConfig>
    </AppContextProvider>
  );
}

export default MyApp;
