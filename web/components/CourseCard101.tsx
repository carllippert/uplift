import { useAccount, useContractRead } from "wagmi";
import BadgesABI from "./Badges.json";

const CourseCard101 = ({ badgeId }: { badgeId: number }) => {
  const { address, isConnected } = useAccount();
  const { data, isError, isLoading } = useContractRead({
    addressOrName: "0x813147e63c5B8FE2E8fb75df26f15186874b3901",
    contractInterface: BadgesABI.abi,
    functionName: "holdsBadge",
    args: [address, badgeId],
    enabled: address ? true : false,
  });

  return <div></div>;
};

export default CourseCard101;
