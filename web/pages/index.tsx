import type { NextPage } from "next";
import Layout from "../components/Layout";
// import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
// import { ChevronRightIcon } from "@heroicons/react/20/solid";
// import Image from "next/image";
// import dreamer from "../images/undraw_dreamer.svg";

const Home: NextPage = () => {
  return (
    <Layout>
      {" "}
      <main className="mx-auto mt-16 max-w-7xl px-4 sm:mt-24">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-100 sm:text-5xl md:text-6xl">
            <span className="block xl:inline">The Simple Path</span>{" "}
            <span className="block text-indigo-600 xl:inline">
              to your bright future
            </span>
          </h1>
          <p className="mx-auto mt-3 max-w-md text-base text-gray-200 sm:text-lg md:mt-5 md:max-w-3xl md:text-xl">
            Put in the work, starting part time, and we gurantee you will be
            further ahead in life then you could have ever imagined.
          </p>
          <div className="mx-auto mt-5 max-w-md sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <a
                href="/learn"
                className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 md:py-4 md:px-10 md:text-lg"
              >
                Learn
              </a>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <a
                href="/earn"
                className="flex w-full items-center justify-center rounded-md border border-transparent bg-white px-8 py-3 text-base font-medium text-indigo-600 hover:bg-gray-50 md:py-4 md:px-10 md:text-lg"
              >
                Earn
              </a>
            </div>
          </div>
        </div>
        {/* end here */}
      </main>
    </Layout>
  );
};

export default Home;
