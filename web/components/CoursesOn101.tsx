import { useState } from "react";
import { useAccount, useContractReads } from "wagmi";
import { CourseViewer } from "@101xyz/course-viewer";
import Badges from "./Badges.json";
import CourseCard101 from "./CourseCard101";

const COURSES: {
  courseId: string;
  image: string;
  title: string;
  complete?: boolean;
}[] = [
  {
    courseId: "cl70km22g301109mkm5kt1rov",
    image:
      "https://101-open.mypinata.cloud/ipfs/QmR7YhtmfQpyHcBNdDEnys7Zxa3BZpd7zC9AScstthVG6B",
    title: "Intro to Pinata",
    complete: true,
  },
  {
    courseId: "cl59hfo69044209ju7lfhlpph",
    image:
      "https://101-open.mypinata.cloud/ipfs/QmTBfFYqNyBc8F8PMwVswGiUDkrnxSwk6otkFaLCJxCR4e",
    title: "Understanding Hop Protocol",
  },
  {
    courseId: "cl78dwat1044609l6uppq060q",
    image:
      "https://101-open.mypinata.cloud/ipfs/QmU5PYCsts4Ezg8dAa2pM3KJsTnYB1UaFzWLggBgWsdweW",
    title: "What is Quadratic Funding?",
  },
];

const CoursesOn101 = () => {
  const [openedCourse, setOpenedCourse] = useState<string | undefined>();
  const [completeds, setCompleteds] = useState<boolean[]>(
    COURSES.map((_, idx) => idx === 0)
  );
  const setDisplay = (display: boolean) => {
    if (!display) setOpenedCourse(undefined);
  };

  const allComplete = completeds.every((completed) => completed);

  return (
    <>
      <div className="flex flex-row flex-wrap justify-center w-full">
        {COURSES.map((course, idx) => (
          <CourseCard101
            courseId={course.courseId}
            key={course.courseId}
            image={course.image}
            title={course.title}
            complete={completeds[idx]}
            setComplete={() => {
              console.log(completeds);
              completeds[idx] = true;
              console.log(completeds);
              setCompleteds([...completeds]);
            }}
          />
        ))}
      </div>
      <div className="w-full flex">
        <button className="btn btn-secondary my-8 mx-auto min-w-[15em]" disabled={!allComplete}>Continue</button>
      </div>
    </>
  );
};

export default CoursesOn101;
