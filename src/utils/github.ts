// utils/github.ts

import axios from "axios";
import { RepoInfo } from "@/types";

// Existing function for repo info
export async function getRepoInfo(url: string): Promise<RepoInfo> {
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

// New function to validate GitHub username
export async function validateGitHubUsername(
  username: string
): Promise<boolean> {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`);
    return response.status === 200;
  } catch (error) {
    console.error("Error validating GitHub username:", error);
    return false;
  }
}
