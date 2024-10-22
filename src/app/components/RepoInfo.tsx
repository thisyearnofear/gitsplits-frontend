import React, { useState } from "react";
import axios from "axios";

async function getRepoInfo(url: string) {
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

const RepoInfo: React.FC = () => {
  const [url, setUrl] = useState("");
  const [repoInfo, setRepoInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFetchRepoInfo = async () => {
    try {
      const info = await getRepoInfo(url);
      setRepoInfo(info);
      setError(null);
    } catch (err) {
      setError("Failed to fetch repository information. Please check the URL.");
      setRepoInfo(null);
    }
  };

  return (
    <div className="repo-info">
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter GitHub repository URL"
        className="input"
      />
      <button onClick={handleFetchRepoInfo} className="button">
        Fetch Repo Info
      </button>

      {error && <div className="error">{error}</div>}

      {repoInfo && (
        <div className="repo-details">
          <h2>
            {repoInfo.name} by {repoInfo.owner}
          </h2>
          {repoInfo.isFork && repoInfo.originalRepo && (
            <p>
              Forked from {repoInfo.originalRepo.owner}/
              {repoInfo.originalRepo.name}
            </p>
          )}
          <h3>Contributors:</h3>
          <ul>
            {repoInfo.contributors.map((contributor: any) => (
              <li key={contributor.username}>
                {contributor.username}: {contributor.contributions}{" "}
                contributions
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RepoInfo;
