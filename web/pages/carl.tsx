import Layout from "../components/Layout";
import { useContractRead, useBalance } from "wagmi";
// import { MUMBAI_CONTRACT_ADDRESS } from "../../../contracts/contract_address";
import abi from "../../contracts/out/Task.sol/Task.json";
import { useEffect } from "react";

const Carl = () => {
  const { data, isError, isLoading, error } = useContractRead({
    addressOrName: "0x652bF01c301140d047201E88483808c96C58170D",
    contractInterface: abi.abi,
    functionName: "getTask",
    args: "1",
  });

  // const { data, isError, isLoading, error } = useBalance({
  //   addressOrName: "0x652bF01c301140d047201E88483808c96C58170D",
  // });

  useEffect(() => {
    console.log("Hit?");
    console.log(data);
    console.log(error);
  }, [data]);

  return (
    <Layout>
      <div>data</div>
    </Layout>
  );
};

export default Carl;
