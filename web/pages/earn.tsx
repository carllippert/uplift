import { Button } from "../components/Button";
import Layout from "../components/Layout";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import abi from "../../contracts/out/Task.sol/Task.json";

const Tasks = () => {

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

  const fire = () => {
    console.log("fire");
    write?.();
  };

  
  return (
    <Layout>
      <div className="mx-auto mt-16 max-w-7xl px-4 sm:mt-24">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Pay</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>3</th>
              <td>Quality Assurance - Software</td>
              <td>$50</td>
              <td>
                <Button onClick={fire}>Claim</Button>
              </td>
            </tr>
            <tr>
              <th>3</th>
              <td>Quality Assurance - Software</td>
              <td>$50</td>
              <td>
                <Button>Claim</Button>
              </td>
            </tr>
            <tr>
              <th>3</th>
              <td>Quality Assurance - Software</td>
              <td>$50</td>
              <td>
                <Button>Claim</Button>
              </td>
            </tr>
            <tr>
              <th>3</th>
              <td>Quality Assurance - Software</td>
              <td>$50</td>
              <td>
                <Button>Claim</Button>
              </td>
            </tr>
            <tr>
              <th>3</th>
              <td>Quality Assurance - Software</td>
              <td>$50</td>
              <td>
                <Button>Claim</Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default Tasks;
