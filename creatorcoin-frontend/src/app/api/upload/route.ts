import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    const pinataForm = new FormData();
    pinataForm.append("file", file);

    const res = await fetch(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      {
        method: "POST",
        headers: {
          pinata_api_key: process.env.PINATA_API_KEY!,
          pinata_secret_api_key: process.env.PINATA_API_SECRET!,
        },
        body: pinataForm,
      }
    );

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: text },
        { status: 500 }
      );
    }

    const data = await res.json();
    return NextResponse.json({ cid: data.IpfsHash });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
