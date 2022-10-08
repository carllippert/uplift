import type { NextPage } from "next";
import Layout from "../components/Layout";

import { MUMBAI_CONTRACT_ADDRESS } from "../../contracts/contract_address";
import { abi } from "../../contracts/out/Task.sol/Task.json";

const Home: NextPage = () => {
  return <Layout>Hello derp</Layout>;
};

export default Home;
