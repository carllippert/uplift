import { useAccount, useContractRead } from "wagmi";
import BadgesABI from "./Badges.json";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

const CourseCard101 = ({
  courseId,
  image,
  title,
  complete,
  setComplete,
}: {
  courseId: string;
  image: string;
  title: string;
  complete?: boolean;
  setComplete: () => void;
}) => {
  const val = (
    <div
      className={`rounded-md border-2 border-indigo-800 p-4 m-4 bg-gray-700 hover:bg-gray-800 transition-all ease-in-out duration-100 ${
        complete ? "border-green-700 bg-green-900 hover:bg-gray-700" : ""
      }`}
      onClick={() => {
        if (!complete) {
          setComplete();
        }
      }}
    >
      <img src={image} className="max-w-[150px] m-auto" />
      <div className="flex">
        {complete && (
          <CheckCircleIcon className="h-6 mt-2 mr-1 stroke-green-700" />
        )}{" "}
        <p className="text-white mt-2 text-center font-bold max-w-[10em]">{title}</p>
      </div>
    </div>
  );

  if (!complete)
    return (
      <a
        href={`https://101.xyz/course/${courseId}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {val}
      </a>
    );
  return val;
};

export default CourseCard101;
