"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { FactoryConfig } from "@/lib/contracts";
import { getSigner } from "@/lib/provider";
import WalletButton from "@/components/WalletButton";

enum TokenStatus {
  Active,
  Paused,
  Deactivated,
}

export default function DashboardPage() {
  const [tokens, setTokens] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      const signer = await getSigner();
      const addr = await signer.getAddress();

      const provider = signer.provider!;
      const factory = new ethers.Contract(
        FactoryConfig.address,
        FactoryConfig.abi,
        provider
      );

      // ✅ SAFE + CORRECT WAY
      const created: string[] = await factory.getCreatorTokens(addr);

      const tokenInfos = await Promise.all(
        created.map((tokenAddr: string) =>
          factory.getTokenInfo(tokenAddr)
        )
      );

      setTokens(tokenInfos);
    }

    load();
  }, []);

  async function updateStatus(
    token: string,
    action: "pause" | "activate" | "deactivate"
  ) {
    try {
      setLoading(true);

      const signer = await getSigner();
      const factory = new ethers.Contract(
        FactoryConfig.address,
        FactoryConfig.abi,
        signer
      );

      let tx;
      if (action === "pause") tx = await factory.pauseToken(token);
      if (action === "activate") tx = await factory.activateToken(token);
      if (action === "deactivate") tx = await factory.deactivateToken(token);

      await tx.wait();

      // reload state instead of full page refresh
      location.reload();
    } catch (e: any) {
      alert(e.message || "Action failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <WalletButton />
      <h1>Creator Dashboard</h1>

      {tokens.length === 0 && <p>No tokens created yet.</p>}

      {tokens.map((t, i) => (
        <div
          key={i}
          style={{ border: "1px solid #ddd", padding: 12, marginBottom: 12 }}
        >
          <h3>
            {t.name} ({t.symbol})
          </h3>

          <img
            src={`https://gateway.pinata.cloud/ipfs/${t.imageCID}`}
            width={80}
          />

          <p>{t.description}</p>

          <p>
            Status: <b>{TokenStatus[t.status]}</b>
          </p>

          <div style={{ display: "flex", gap: 8 }}>
            {t.status === TokenStatus.Active && (
              <button
                disabled={loading}
                onClick={() => updateStatus(t.token, "pause")}
              >
                Pause
              </button>
            )}

            {t.status === TokenStatus.Paused && (
              <button
                disabled={loading}
                onClick={() => updateStatus(t.token, "activate")}
              >
                Activate
              </button>
            )}

            {t.status !== TokenStatus.Deactivated && (
              <button
                disabled={loading}
                onClick={() => updateStatus(t.token, "deactivate")}
              >
                Deactivate
              </button>
            )}
          </div>
        </div>
      ))}
    </main>
  );
}
