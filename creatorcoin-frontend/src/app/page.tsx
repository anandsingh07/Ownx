'use client'

import { useState , useEffect } from "react";
import {ethers} from 'ethers';
import { FactoryConfig } from "@/lib/contracts";
import WalletButton from "@/components/WalletButton";


export default function Home() {
  const [tokens, setTokens] = useState<any[]>([]);

  useEffect(() => {
    async function loadTokens() {
      const provider = new ethers.BrowserProvider(
        (window as any).ethereum
      );
      const factory = new ethers.Contract(
        FactoryConfig.address,
        FactoryConfig.abi,
        provider
      );

      const data = await factory.getAllTokens();
      setTokens(data);
    }

    loadTokens();
  }, []);

  return (
    <main>
      <WalletButton />

      <h1>Marketplace</h1>

      {tokens.map((t, i) => (
        <div key={i}>
          <h3>{t.name} ({t.symbol})</h3>
          <p>{t.description}</p>
          <img
            src={`https://gateway.pinata.cloud/ipfs/${t.imageCID}`}
            width={100}
          />
        </div>
      ))}
    </main>
  );
}
