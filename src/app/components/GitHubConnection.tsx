import React from "react";
import { Button } from "@/components/ui/button";

interface GitHubConnectionProps {
  onConnect: () => void;
}

const GitHubConnection: React.FC<GitHubConnectionProps> = ({ onConnect }) => {
  const handleConnect = async () => {
    // Implement GitHub OAuth flow here
    // For now, we'll just simulate a successful connection
    setTimeout(() => {
      onConnect();
    }, 1000);
  };

  return <Button onClick={handleConnect}>Connect GitHub Account</Button>;
};

export default GitHubConnection;
