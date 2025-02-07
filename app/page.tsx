// page.tsx
"use client"; // 最初に配置

import { useState } from "react";
import { postAction } from "../app/api/gemini/action";

export default function Page() {
  const [result, setResult] = useState("");

  const handleSubmit = async (formData: FormData) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY; // クライアントサイドでは NEXT_PUBLIC_ プレフィックスが必要
      if (!apiKey) {
        throw new Error("APIキーが設定されていません。");
      }
      const res = await postAction(formData.get("prompt") as string, apiKey); // APIキーを渡す
      setResult(res);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="p-10">
      <h1>Gemini</h1>

      <form action={handleSubmit}>
        <input
          type="text"
          name="prompt"
          className="dark:text-neutral-900 w-2/5"
        />
        <button type="submit">送信</button>
      </form>

      <div>{result}</div>
    </div>
  );
}
