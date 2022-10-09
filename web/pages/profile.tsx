import { Button } from "../components/Button";
import Layout from "../components/Layout";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import abi from "../../contracts/out/Task.sol/Task.json";

const Profile = () => {
  const { config } = usePrepareContractWrite({
    addressOrName: "0x4D63061Cf9d4faB1a397a7A35c07BFEd455C14Fd",
    contractInterface: abi.abi,
    functionName: "claimTask",
    args: [
      "1",
      "0x2BfC102290Bc92767B290B60fdfeCa120058ECD0",
      "0x2BfC102290Bc92767B290B60fdfeCa120058ECD0",
    ],
  });

  const { data, isLoading, isSuccess, write } = useContractWrite(config);

  const claimStream = () => {
    write?.();
  };

  return (
    <Layout>
      <main className="mx-auto mt-16 max-w-7xl px-4 sm:mt-24">
        <Button onClick={claimStream}>Your Employable! Claim Stream!</Button>
      </main>
    </Layout>
  );
};
