import { ethers, Provider } from "ethers";
import GitHubSplitsABI from "../contracts/GitHubSplits.json";

export const CONTRACT_ADDRESS = "0xa076D95476003420bae2E726B4fBdD968d3F98C1";

export const getContract = (signer: ethers.Signer) => {
  return new ethers.Contract(CONTRACT_ADDRESS, GitHubSplitsABI.abi, signer);
};

export const addShare = async (
  signer: ethers.Signer,
  githubUsername: string,
  shareAmount: number
) => {
  const contract = getContract(signer);
  const tx = await contract.addShare(githubUsername, shareAmount);
  await tx.wait();
};

export const claimFunds = async (
  signer: ethers.Signer,
  githubUsername: string,
  proof: string
) => {
  const contract = getContract(signer);
  const tx = await contract.claim(githubUsername, proof);
  await tx.wait();
};
export const getContractBalance = async (provider: Provider) => {
  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    GitHubSplitsABI.abi,
    provider
  );
  return await contract.getContractBalance();
};
