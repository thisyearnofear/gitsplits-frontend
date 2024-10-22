"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { useAppKitAccount } from "@reown/appkit/react";
import Header from "@/app/components/Header";
import { HomeProps } from "@/types";

const LandingPage = dynamic(() => import("@/app/components/LandingPage"), {
  ssr: false,
});
const GitSplitsApp = dynamic(() => import("@/app/components/GitSplitsApp"), {
  ssr: false,
});

const Home: React.FC<HomeProps> = () => {
  const { isConnected } = useAppKitAccount();

  return (
    <>
      <Header />
      <Suspense fallback={<div>Loading...</div>}>
        {!isConnected ? <LandingPage /> : <GitSplitsApp />}
      </Suspense>
    </>
  );
};

export default Home;
