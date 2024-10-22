import React, { useState, useEffect } from "react";
import axios from "axios";
import { RepoInfo as RepoInfoType, Contributor } from "@/types";
import AttributionWidget from "./AttributionWidget";
import EmbedCodeGenerator from "./EmbedCodeGenerator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface RepoInfoProps {
  url: string;
}

async function getRepoInfo(url: string): Promise<RepoInfoType> {
  const [, owner, repo] = url.match(/github\.com\/([^\/]+)\/([^\/]+)/) || [];
  if (!owner || !repo) {
    throw new Error("Invalid GitHub URL");
  }

  try {
    const repoResponse = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}`
    );
    const repoData = repoResponse.data;

    const contributorsResponse = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/contributors`
    );
    const contributors = contributorsResponse.data;

    let originalRepo = null;
    if (repoData.fork) {
      const originalRepoResponse = await axios.get(repoData.source.url);
      originalRepo = originalRepoResponse.data;
    }

    return {
      name: repoData.name,
      owner: repoData.owner.login,
      isFork: repoData.fork,
      originalRepo: originalRepo
        ? {
            name: originalRepo.name,
            owner: originalRepo.owner.login,
          }
        : null,
      contributors: contributors.map((c: any) => ({
        username: c.login,
        contributions: c.contributions,
      })),
    };
  } catch (error) {
    console.error("Error fetching repo info:", error);
    throw error;
  }
}

const RepoInfo: React.FC<RepoInfoProps> = ({ url }) => {
  const [repoInfo, setRepoInfo] = useState<RepoInfoType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [displayStyle, setDisplayStyle] = useState<"minimal" | "expanded">(
    "expanded"
  );

  useEffect(() => {
    const fetchRepoInfo = async () => {
      setLoading(true);
      setError(null);
      try {
        const info = await getRepoInfo(url);
        setRepoInfo(info);
      } catch (err) {
        setError(
          "Failed to fetch repository information. Please check the URL."
        );
      } finally {
        setLoading(false);
      }
    };

    if (url) {
      fetchRepoInfo();
    }
  }, [url]);

  if (loading) {
    return (
      <div className="text-center py-8">Loading repository information...</div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  if (!repoInfo) {
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto mt-0 px-4">
      <div className="flex justify-center space-x-2 mb-4">
        <Button
          variant={displayStyle === "minimal" ? "default" : "outline"}
          onClick={() => setDisplayStyle("minimal")}
        >
          Minimal
        </Button>
        <Button
          variant={displayStyle === "expanded" ? "default" : "outline"}
          onClick={() => setDisplayStyle("expanded")}
        >
          Expanded
        </Button>
      </div>
      <Tabs defaultValue="preview" className="w-full">
        <div className="flex justify-center mb-4">
          <AttributionWidget
            repoInfo={repoInfo}
            contractAddress="0x1234567890123456789012345678901234567890" // Replace with actual contract address
            displayStyle={displayStyle}
          />
        </div>
        <div className="flex justify-center mt-4 mb-4">
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="embed">Embed Code</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="preview" className="flex justify-center">
          {/* Preview content is now above the tabs */}
        </TabsContent>
        <TabsContent value="embed" className="flex justify-center">
          <EmbedCodeGenerator
            repoInfo={repoInfo}
            contractAddress="0x1234567890123456789012345678901234567890" // Replace with actual contract address
            displayStyle={displayStyle}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RepoInfo;
