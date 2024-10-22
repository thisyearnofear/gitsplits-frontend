import React from "react";
import { useAppKitAccount } from "@reown/appkit/react";
import GitSplitsApp from "./GitSplitsApp";
import GitHubConnection from "@/app/components/GitHubConnection";
import { Card, CardContent } from "@/components/ui/card";
import { Github } from "lucide-react";

interface DashboardProps {
  isGitHubConnected: boolean;
  setIsGitHubConnected: (value: boolean) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  isGitHubConnected,
  setIsGitHubConnected,
}) => {
  const { address } = useAppKitAccount();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gentle-blue via-gentle-purple to-gentle-orange">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4 text-white">
          Your GitSplits Dashboard
        </h1>

        {!isGitHubConnected && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-2 flex items-center">
                <Github className="mr-2" /> Connect GitHub (Optional)
              </h2>
              <p className="mb-4">
                Enhance your GitSplits experience by connecting your GitHub
                account. This allows for automatic repository syncing and more
                accurate contribution tracking.
              </p>
              <GitHubConnection onConnect={() => setIsGitHubConnected(true)} />
            </CardContent>
          </Card>
        )}

        <GitSplitsApp isGitHubConnected={isGitHubConnected} />
      </div>
    </div>
  );
};

export default Dashboard;
