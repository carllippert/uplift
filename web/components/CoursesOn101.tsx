import { useState } from "react";
import { useAccount, useContractReads } from "wagmi";
import { CourseViewer } from "@101xyz/course-viewer";
import Badges from "./Badges.json";

const COURSES: { badgeId: number; courseId: string }[] = [
  { courseId: "", badgeId: 3 },
];

const contractCallStuff = {
  addressOrName: "0x813147e63c5B8FE2E8fb75df26f15186874b3901",
  contractInterface: Badges.abi,
  functionName: "holdsBadge",
};

const CoursesOn101 = () => {
  const [openedCourse, setOpenedCourse] = useState<string | undefined>();
  const setDisplay = (display: boolean) => {
    if (!display) setOpenedCourse(undefined);
  };
  const { address, isConnected } = useAccount();
  const { data, isError, isLoading, refetch } = useContractReads({
    enabled: address ? true : false,
    contracts: COURSES.map((course) => ({
      ...contractCallStuff,
      args: [address, course.badgeId],
    })),
  });

  console.log(data);

  return (
    <>
      <CourseViewer
        display={openedCourse !== undefined}
        setDisplay={setDisplay}
        courseId={openedCourse || ""}
        onCourseComplete={() => refetch()}
      />
      <div>{}</div>
    </>
  );
};

export default CoursesOn101;
