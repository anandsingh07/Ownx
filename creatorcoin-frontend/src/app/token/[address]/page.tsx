"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useParams } from "next/navigation";
import { FactoryConfig, MarketplaceConfig } from "@/lib/contracts";
import { getSigner } from "@/lib/provider";

export default function TokenPage() {
  const params = useParams();
  const tokenAddress = params.address as string;

  const [token, setToken] = useState<any>(null);
  const [ethAmount, setEthAmount] = useState("");
  const [sellAmount, setSellAmount] = useState("");
  const [trades, setTrades] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      const provider = new ethers.BrowserProvider(
        (window as any).ethereum
      );

      const factory = new ethers.Contract(
        FactoryConfig.address,
        FactoryConfig.abi,
        provider
      );

      const all = await factory.getAllTokens();
      const t = all.find((x: any) => x.token === tokenAddress);
      setToken(t);

      const market = new ethers.Contract(
        MarketplaceConfig.address,
        MarketplaceConfig.abi,
        provider
      );

      const history = await market.getTokenTrades(tokenAddress);
      setTrades(history);
    }

    loadData();
  }, [tokenAddress]);

  async function buy() {
    const signer = await getSigner();
    const market = new ethers.Contract(
      MarketplaceConfig.address,
      MarketplaceConfig.abi,
      signer
    );

    const tx = await market.buy(tokenAddress, {
      value: ethers.parseEther(ethAmount),
    });
    await tx.wait();

    alert("Buy successful");
  }

  async function sell() {
    const signer = await getSigner();
    const market = new ethers.Contract(
      MarketplaceConfig.address,
      MarketplaceConfig.abi,
      signer
    );

    const erc20 = new ethers.Contract(
      tokenAddress,
      ["function approve(address,uint256) public returns(bool)"],
      signer
    );

    const amount = ethers.parseUnits(sellAmount, 18);
    await erc20.approve(MarketplaceConfig.address, amount);

    const tx = await market.sell(tokenAddress, amount);
    await tx.wait();

    alert("Sell successful");
  }

  if (!token) return <p>Loading...</p>;

  return (
    <main>
      <h1>{token.name} ({token.symbol})</h1>

      <img
        src={`https://gateway.pinata.cloud/ipfs/${token.imageCID}`}
        width={150}
      />

      <p>{token.description}</p>

      <h3>Buy</h3>
      <input
        placeholder="ETH amount"
        onChange={e => setEthAmount(e.target.value)}
      />
      <button onClick={buy}>Buy</button>

      <h3>Sell</h3>
      <input
        placeholder="Token amount"
        onChange={e => setSellAmount(e.target.value)}
      />
      <button onClick={sell}>Sell</button>

      <h3>Trade History</h3>
      {trades.map((t, i) => (
        <div key={i}>
          <span>
            {t.isBuy ? "BUY" : "SELL"} |{" "}
            {ethers.formatEther(t.ethAmount)} ETH
          </span>
        </div>
      ))}
    </main>
  );
}
