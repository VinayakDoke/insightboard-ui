"use client";

import { useState } from "react";
import { submitTranscript } from "@/utils/api";
import { useRouter } from "next/navigation";

export default function Home() {
  const [text, setText] = useState("");
  const router = useRouter();

  async function handleSubmit() {
    const res = await submitTranscript(text);
    router.push(`/jobs/${res.data.jobId}`);
  }

  return (
    <div className="p-10 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Upload Transcript</h1>

      <textarea
        className="border w-full h-64 p-2"
        value={text}
        onChange={e => setText(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className="mt-4 bg-black text-white px-4 py-2 rounded"
      >
        Submit
      </button>
    </div>
  );
}
