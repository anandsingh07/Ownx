"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { uploadImageToPinata } from '@/lib/pinata';
import { FactoryConfig } from "@/lib/contracts";
import { getSigner } from "@/lib/provider";

export default function CreateTokenPage() {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [supply, setSupply] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(0);
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function createToken() {
    try {
      if (!image) return alert("Upload image");
      if (!name || !symbol || !supply)
        return alert("Fill all fields");

      setLoading(true);

      // 1. Upload image to Pinata
      const imageCID = await uploadImageToPinata(image);

      // 2. Create token on-chain
      const signer = await getSigner();
      const factory = new ethers.Contract(
        FactoryConfig.address,
        FactoryConfig.abi,
        signer
      );

      const tx = await factory.createToken(
        name,
        symbol,
        ethers.parseUnits(supply, 18),
        imageCID,
        description,
        category
      );

      await tx.wait();

      alert("✅ Token created successfully");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <h1>Create Token</h1>

      <input placeholder="Name" onChange={e => setName(e.target.value)} />
      <input placeholder="Symbol" onChange={e => setSymbol(e.target.value)} />
      <input
        placeholder="Total Supply"
        onChange={e => setSupply(e.target.value)}
      />

      <textarea
        placeholder="Description"
        onChange={e => setDescription(e.target.value)}
      />

      <select onChange={e => setCategory(Number(e.target.value))}>
        <option value={0}>Meme</option>
        <option value={1}>Community</option>
        <option value={2}>Utility</option>
        <option value={3}>Experimental</option>
      </select>

      <input
        type="file"
        accept="image/*"
        onChange={e => setImage(e.target.files?.[0] || null)}
      />

      <button onClick={createToken} disabled={loading}>
        {loading ? "Creating..." : "Create Token"}
      </button>
    </main>
  );
}
