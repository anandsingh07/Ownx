"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Link from "next/link";
import { FactoryConfig } from "@/lib/contracts";
import WalletButton from "@/components/WalletButton";

export default function Home() {
  const [tokens, setTokens] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTokens() {
      if (!(window as any).ethereum) return;

      try {
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
      } catch (err) {
        console.error("Error loading tokens:", err);
      } finally {
        setLoading(false);
      }
    }

    loadTokens();
  }, []);

  function renderStatus(status: number) {
    if (status === 0) return "🟢 Active";
    if (status === 1) return "🟡 Paused";
    return "🔴 Deactivated";
  }

  return (
    <main style={{ padding: "20px" }}>
      <WalletButton />

      {/* ✅ CREATE TOKEN CTA */}
      <div style={{ marginTop: "16px" }}>
        <Link
          href="/create"
          style={{
            display: "inline-block",
            padding: "10px 16px",
            background: "#000",
            color: "#fff",
            borderRadius: "6px",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          + Create Token
        </Link>
      </div>

      <h1 style={{ marginTop: "24px" }}>Marketplace</h1>

      {loading && <p>Loading tokens...</p>}
      {!loading && tokens.length === 0 && (
        <p>No tokens created yet.</p>
      )}

      <div style={{ display: "grid", gap: "16px" }}>
        {tokens.map((t, i) => (
          <Link
            key={i}
            href={`/token/${t.token}`}
            style={{
              border: "1px solid #ddd",
              padding: "12px",
              borderRadius: "8px",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div style={{ display: "flex", gap: "12px" }}>
              <img
                src={`https://gateway.pinata.cloud/ipfs/${t.imageCID}`}
                width={80}
                height={80}
                style={{ borderRadius: "6px", objectFit: "cover" }}
                alt={t.name}
              />

              <div>
                <h3>
                  {t.name} ({t.symbol})
                </h3>

                <p style={{ margin: "4px 0" }}>
                  {renderStatus(t.status)}
                </p>

                <p style={{ fontSize: "14px", opacity: 0.8 }}>
                  {t.description}
                </p>

                <p style={{ fontSize: "12px", marginTop: "6px" }}>
                  Created:{" "}
                  {new Date(
                    Number(t.createdAt) * 1000
                  ).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
