import type { NextPage } from "next";
import Layout from "../components/Layout";

import { MUMBAI_CONTRACT_ADDRESS } from "../../contracts/contract_address";
import { abi } from "../../contracts/out/Task.sol/Task.json";
const EDU_NFT_ADDRESS = "0x81Ab35cb4FbE92383aa5279B91dD6E9a49cc4676"; 

const Home: NextPage = () => {
  return <Layout>Hello derp</Layout>;
};

export default Home;
