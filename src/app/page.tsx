"use client";

import { Suspense, useState } from "react";
import dynamic from "next/dynamic";
import { useAppKitAccount, useAppKit } from "@reown/appkit/react";
import Header from "@/app/components/Header";
import { HomeProps, LandingPageProps } from "@/types";
import { TooltipProvider } from "@/components/ui/tooltip";

const LandingPage = dynamic(() => import("@/app/components/LandingPage"), {
  ssr: false,
});
const Dashboard = dynamic(() => import("@/app/components/Dashboard"), {
  ssr: false,
});

const Home: React.FC<HomeProps> = () => {
  const { isConnected } = useAppKitAccount();
  const { open } = useAppKit();
  const [isGitHubConnected, setIsGitHubConnected] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  const handleDashboardClick = () => {
    setShowDashboard(true);
  };

  const handleLoginPrompt = () => {
    if (!isConnected) {
      open(); // This opens the modal for connecting
    }
  };

  const landingPageProps: LandingPageProps = {
    isConnected,
    onDashboardClick: handleDashboardClick,
    onLoginPrompt: handleLoginPrompt,
  };

  return (
    <TooltipProvider>
      <Header />
      <Suspense fallback={<div>Loading...</div>}>
        {!showDashboard ? (
          <LandingPage {...landingPageProps} />
        ) : (
          <Dashboard
            isGitHubConnected={isGitHubConnected}
            setIsGitHubConnected={setIsGitHubConnected}
          />
        )}
      </Suspense>
    </TooltipProvider>
  );
};

export default Home;
