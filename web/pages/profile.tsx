import { Button } from "../components/Button";
import Layout from "../components/Layout";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import abi from "../../contracts/out/Task.sol/Task.json";

const Profile = () => {
  const { config } = usePrepareContractWrite({
    addressOrName: "0x4D63061Cf9d4faB1a397a7A35c07BFEd455C14Fd",
    contractInterface: abi.abi,
    functionName: "claimSalary",
    args: "0x2BfC102290Bc92767B290B60fdfeCa120058ECD0",
  });

  const { data, isLoading, isSuccess, write } = useContractWrite(config);

  const claimStream = () => {
    write?.();
  };

  return (
    <Layout>
      <main className="mt-60 pl-60 ml-60 mx-auto max-w-7xl">
        <Button
          className="bg-green-500 h-22 w-1/2 text-2xl "
          onClick={claimStream}
        >
          Your Employable! Claim Stream!
        </Button>
      </main>
    </Layout>
  );
};

export default Profile;
