import { ethers } from "ethers";

export async function getProvider() {
  if (!(window as any).ethereum) {
    throw new Error("MetaMask not installed");
  }

  const provider = new ethers.BrowserProvider(
    (window as any).ethereum
  );
  await provider.send("eth_requestAccounts", []);
  return provider;
}

export async function getSigner() {
  const provider = await getProvider();
  return provider.getSigner();
}
