import type { NextPage } from "next";
import Image from "next/image";
import Layout from "../components/Layout";
import Platzi from "../public/images/platzi.webp";

import { MUMBAI_CONTRACT_ADDRESS } from "../../contracts/contract_address";
import { abi } from "../../contracts/out/Task.sol/Task.json";
import Progress from "../components/Progress";
import { useState } from "react";
import CoursesOn101 from "../components/CoursesOn101";
const EDU_NFT_ADDRESS = "0x81Ab35cb4FbE92383aa5279B91dD6E9a49cc4676";

const Test: NextPage = () => {
  const [educatorSelected, setEducatorSelected] = useState(false);
  const STEPS = ["Starter", "Basic", "Intermediate", "Advanced", "Senior"];
  return (
    <Layout>
      <div className="w-5/6 md:w-4/6 m-auto mt-4 flex flex-col">
        <h2 className="text-3xl text-white my-4 font-extrabold">
          Learn to Level Up!
        </h2>
        <Progress steps={STEPS} completed={3} />
        <p className="text-white">
          You&apos;re eligible to advance to the intermediate level! Completed
          more courses to start earning!
        </p>
        <div className="w-full md:w-4/6 m-auto mt-4">
          <button
            className={`btn h-20 w-full my-2 ${
              educatorSelected ? "btn-primary" : ""
            }`}
            onClick={() => setEducatorSelected(true)}
          >
            <svg
              className={`h-12 cursor-pointer fill-white`}
              viewBox="0 0 154 53"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M50.536 52.4147V42.5326L33.0616 42.5501V52.4147H50.536ZM85.1731 0.0279999L75.3033 9.9101H63.9499V52.3487L52.6519 41.0705V9.88821L62.5121 0.0279999H85.1731V0.0279999ZM64.1579 52.4147L74.0277 42.5326H85.3811V0.0940018L96.6791 11.3722V42.5545L86.8189 52.4147H64.1579V52.4147ZM153.536 52.4147V42.5326L136.062 42.5501V52.4147H153.536ZM124.707 0L103.464 21.2432L110.452 28.2309L124.701 13.9816V42.5326H107.169V52.4147H126.139L135.992 42.5613L135.999 42.5608V42.5545L136.003 42.5501V42.5326H135.999V11.3052L124.707 0V0ZM21.7072 0L0.463989 21.2432L7.45169 28.2309L21.701 13.9816V42.5326H4.16889V52.4147H23.1389L32.9923 42.5613L32.9991 42.5608V42.5545L33.0035 42.5501V42.5326H32.9991V11.3052L21.7072 0V0Z"
              />
            </svg>
          </button>
          <button className="btn h-20 w-full my-2" disabled>
            <img src="/images/platzi.webp" className="h-full" />
          </button>
          <button className="btn h-20 w-full my-2" disabled>
            <svg
              viewBox="0 0 213 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-[80%]"
            >
              <path
                d="M33.059 19.088L16.528 9.544 0 19.088V9.544L16.53 0l16.531 9.544v9.544h-.002z"
                fill="#A435F0"
              />
              <path
                d="M0 27.101h8.659V48.14c0 5.437 4.058 8.085 7.872 8.085 3.842 0 7.872-2.72 7.872-8.157V27.1h8.658V48.64c0 5.008-1.573 8.872-4.722 11.52-3.15 2.648-7.086 3.936-11.88 3.936-4.795 0-8.731-1.288-11.808-3.936C1.573 57.512 0 53.792 0 48.853V27.101zM107.92 53.248c-2.621 2.333-5.608 3.477-9.013 3.477-6.208 0-10.376-3.538-10.846-9.018h27.979s.184-1.771.184-3.432c0-5.152-1.645-9.446-5.008-12.952-3.291-3.507-7.584-5.224-12.808-5.224-5.51 0-10.019 1.717-13.597 5.224-3.507 3.506-5.296 8.085-5.296 13.81v.286c0 5.653 1.789 10.16 5.296 13.525 3.506 3.363 8.157 5.08 13.81 5.08 6.574 0 11.806-2.592 15.731-7.064l-6.432-3.712zm-16.456-17.56c1.93-1.504 4.293-2.29 6.941-2.29 2.504 0 4.579.786 6.368 2.362 1.71 1.435 2.632 3.197 2.712 5.224H88.28c.277-2.093 1.336-3.859 3.184-5.296zM195.085 68.885C191.568 77.18 187.893 80 182.259 80h-3.904v-7.675h3.157c1.939 0 3.741-.728 5.459-4.693l1.717-3.965L173.875 27.1h8.802l10.52 26.334L204.003 27.1h8.802c-.002 0-14.101 33.248-17.72 41.784zM66.77 13.29v17.078c-2.837-2.544-7.25-4.056-11.52-4.056-5.08 0-9.373 1.79-12.88 5.437-3.434 3.579-5.151 8.014-5.151 13.382s1.717 9.802 5.152 13.453c3.506 3.579 7.8 5.368 12.88 5.368 5.861 0 9.562-2.301 11.52-4.107v3.32h8.586V13.291h-8.586zm-2.575 39.715c-2.075 2.075-4.723 3.15-7.8 3.15-3.078 0-5.582-1.075-7.656-3.15-2.003-2.074-3.006-4.722-3.006-7.872 0-3.149 1.003-5.797 3.006-7.872 2.074-2.074 4.578-3.149 7.656-3.149 3.077 0 5.725 1.075 7.8 3.15 2.146 2.074 3.221 4.722 3.221 7.871 0 3.15-1.075 5.798-3.221 7.872zM160.525 26.387c-6.522 0-9.914 2.706-12.237 5.312-.928-1.771-3.544-5.312-9.659-5.312-5.165 0-8.213 2.61-9.73 4.472v-3.755h-8.515v36.064h8.515V42.416c0-4.867 3.005-8.373 7.013-8.373 4.08 0 6.44 3.077 6.44 8.013v21.11h8.515V42.412c0-4.938 2.933-8.373 7.154-8.373 4.08 0 6.44 3.077 6.44 8.013v21.11h8.587V40.837c0-9.402-5.053-14.45-12.523-14.45z"
                fill="#fff"
              />
            </svg>
          </button>
        </div>
        <CoursesOn101/>
      </div>
    </Layout>
  );
};

export default Test;
