Skip to main content
Web3Auth's Logo
Integration Builder
SDKs
Guides
Enterprise Demo

Dashboard
Language/Framework:
Next JS
Blockchain:
Ethereum
Custom Authentication:

Whitelabel:

EVM Chain Framework:
web3.js

Using Web3Auth NextJS Quick Start Guide

To use this NextJS Quick Start Guide, you can either study the steps and the different snippets of code and add them to your application, or simply copy paste the entire files and run them on your own.

If you face any problem anytime, you can always refer to the Web3Auth Discussions Page for us to help you out as soon as possible!

To build this project locally, create a new nextjs project using the following command:

yarn create next-app --typescript


Replace the file package.json in the root folder.

In the pages/ folder with replace App.tsx & add your blockchain specific .ts file.

Finally, replace the file globals.css in the styles folder.

Run the app using

npm run-script dev


Install web3.js

Install web3.js using either npm or yarn:

npm
Yarn
npm install --save web3


TIP
Add the file web3RPC.ts to the project. This file contains the code to interact with the blockchain.

Install Web3Auth

Install @web3auth/web3auth & @web3auth/base using either npm or yarn:

npm
Yarn
npm install --save @web3auth/web3auth @web3auth/base


Npm package monthly downloads 

Import the Web3Auth Modules into your project

@web3auth/web3auth

This is the main Plug and Play UI package that contains the Web3Auth SDK with a login UI, giving you a simple way of implementing Web3Auth within your interface.

@web3auth/base

Since we're using typescript, we need the base package to provide types of the different variables we'll be using throughout the app building process. This reduces errors to a very large extent.

Additionally, import the RPC file for your selected blockchain.

Register your application

In order to use Web3Auth, you'll need to create a project in the Developer Dashboard and get your clientId. This clientId is required for instantiating the SDK and registering your application. You can also enable interoperability options within the project while initialising it.

This is not required on localhost enviroment, however, we recommend creating a project in the dashboard for testing purposes in a hosted demo applicaiton. While moving to a production environment, make sure to convert your project to mainnet or cyan, otherwise you'll end up losing users and keys.

Create the Web3Auth instance

It's time to create an instance of the Web3Auth in the project.

We need clientId and chainNamespace to initialize web3auth class. You can get your clientId from registering (above), whereas chainNamespace signifies the type of chain you want to initialize web3auth with, which will depend on the blockchain you've selected here. Please go through the connect blockchain documentation, which contains all the details of the respective blockchain you have selected here.

There might be cases you will be getting an JSON-RPC error, which comes from the overloading of the test node server mentioned in this example. In that case, we recommend you to pass on your own node server in the rpcTarget value, which can be easily created by using a service like Infura, Quicknode etc. Checkout our troubleshooting guide around it.

TIP
Additionally, there are multiple other parameters, as mentioned in our SDK Reference

Initializing

Finally, it is time to initialise the SDK within your application. Here is where you choose your logins, whether to login with popups or redirects, whitelabel config and more. You can use the default set of logins & wallets (adapters), by not passing any argument into the function or choose the specifics for yourself.

More about initialising Web3Auth and its parameters here.

Logging in your User

Use the connect function of web3auth to display the modal. Here, the user can log in with the social logins of their choice, or connect using one of their external wallets.

After a successful user login, the web3auth the function will return a provider which will be used to interact with the blockchain and sign transactions. The app scoped private key can also be accessed from the provider.

Get User Info

Once logged in, Web3Auth instance returns you some information about your logged in user. This is fetched directly from the JWT token and Web3Auth doesn't store this info anywhere. Hence, this information in available in social logins only after the user has logged into your application.

Know more about the getUserInfo() function.

Interacting with an EVM Compatible Blockchain

Once a user logs in, the Web3Auth SDK returns a provider. Using this provider we can sign transactions and make RPC calls to any EVM Blockchain.

Refer to the EIP1193 Provider Documentation to know more about how to use the provider to make calls on any EVM blockchain.

Log the user out

Use the logout function of web3auth to log the user out. This will also clean up any artifacts created by the connected adapter.

import type { SafeEventEmitterProvider } from "@web3auth/base";
import Web3 from "web3";

export default class EthereumRpc {
  private provider: SafeEventEmitterProvider;

  constructor(provider: SafeEventEmitterProvider) {
    this.provider = provider;
  }

  async getChainId(): Promise<string> {
    try {
      const web3 = new Web3(this.provider as any);

      // Get the connected Chain's ID
      const chainId = await web3.eth.getChainId();

      return chainId.toString();
    } catch (error) {
      return error as string;
    }
  }

  async getAccounts(): Promise<any> {
    try {
      const web3 = new Web3(this.provider as any);

      // Get user's Ethereum public address
      const address = (await web3.eth.getAccounts())[0];

      return address;
    } catch (error) {
      return error;
    }
  }

  async getBalance(): Promise<string> {
    try {
      const web3 = new Web3(this.provider as any);

      // Get user's Ethereum public address
      const address = (await web3.eth.getAccounts())[0];

      // Get user's balance in ether
      const balance = web3.utils.fromWei(
        await web3.eth.getBalance(address) // Balance is in wei
      );

      return balance;
    } catch (error) {
      return error as string;
    }
  }

  async sendTransaction(): Promise<any> {
    try {
      const web3 = new Web3(this.provider as any);

      // Get user's Ethereum public address
      const fromAddress = (await web3.eth.getAccounts())[0];

      const destination = fromAddress;

      const amount = web3.utils.toWei("0.001"); // Convert 1 ether to wei

      // Submit transaction to the blockchain and wait for it to be mined
      const receipt = await web3.eth.sendTransaction({
        from: fromAddress,
        to: destination,
        value: amount,
        maxPriorityFeePerGas: "5000000000", // Max priority fee per gas
        maxFeePerGas: "6000000000000", // Max fee per gas
      });

      return receipt;
    } catch (error) {
      return error as string;
    }
  }

  async signMessage() {
    try {
      const web3 = new Web3(this.provider as any);

      // Get user's Ethereum public address
      const fromAddress = (await web3.eth.getAccounts())[0];

      const originalMessage = "YOUR_MESSAGE";

      // Sign the message
      const signedMessage = await web3.eth.personal.sign(
        originalMessage,
        fromAddress,
        "test password!" // configure your own password here.
      );

      return signedMessage;
    } catch (error) {
      return error as string;
    }
  }

  async getPrivateKey(): Promise<any> {
    try {
      const privateKey = await this.provider.request({
        method: "eth_private_key",
      });

      return privateKey;
    } catch (error) {
      return error as string;
    }
  }
}