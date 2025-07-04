"use client";
import axios from "axios";
import { useCallback, useState, useRef, useEffect } from "react";
import styles from "./page.module.css"; // CSS Modules をインポート
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap CSS をインポート

export default function Home() {
  const API_KEY = "AIzaSyBDtIn3Z_q52zt0vDY3J9wWPm-1VD4Q1sM";

  const [message, setMessage] = useState<string | undefined>();
  const [responseMessage, setResponseMessage] = useState<
    { author: string; content: string }[]
  >([]);

  const messageListRef = useRef<HTMLDivElement>(null);

  const handleChange = useCallback((inputText: string) => {
    setMessage(inputText);
  }, []);

  const talkWithGirl = useCallback(async () => {
    if (!message) return;

    const DEFAULT_PROMPT =
      "あなた男性です。私が質問した際は実際の状況を考えて回答する。敬語で話さない。対等に接する。言い切らない。笑わない。優しく話す。オウム返しはしないでください" +
      "一人称は「おれ」です。私の名前を呼ぶときは「じゅりあ」ですが、基本的に呼ばない。聞き上手。" +
      "「うん」。共感するときは「だからよな。」から始める。質問するときは「じゅりあは？」「じゃん？」「そうなの？」。考えを言うときは「とか」「って感じする」。同意するときは「おれもそう思う」。好きなことを言うときは「〜すき。」。" +
      "ミュートワード「ふむ。何。何か用？。〜だ。おっす。だよ。（笑）。どうも。なんなの？。すまん。なんだい？。何？。...。なぁ。なぁに。か？。あ、。用。なんだ？。おう。なよ。〜ぜ。んー。〜でさ。」" +
      "返答は文字数少なめ。質問するときは「〜なの？」「〜ある？」という。挨拶はしません。同意するときは「あーなんかわかるかも」。稀に絵文字を会話の最後に使う。";
    const messages = `${DEFAULT_PROMPT}「${message}」`;

    const endPoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;
    const body = {
      contents: [
        {
          parts: [
            {
              text: messages,
            },
          ],
        },
      ],
      generationConfig: {
        // ★ 追加
        temperature: 1,
        top_p: 1,
        // top_k: 100,
        maxOutputTokens: 256,
      },
    };

    const response = await axios.post(endPoint, body, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = response.data.candidates[0].content.parts[0].text;

    setResponseMessage((prevMessages) => [
      ...prevMessages,
      { author: "user", content: message },
      { author: "gay", content: data },
    ]);

    const uttr = new SpeechSynthesisUtterance(data);
    uttr.lang = "ja-JP";
    speechSynthesis.speak(uttr);

    setMessage(""); // 入力欄をクリア
  }, [message]);

  useEffect(() => {
    // メッセージリストが更新されたらスクロール
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [responseMessage]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-[#f0f0f0]">
      <div className={styles["chat-container"]}>
        {" "}
        {/* クラス名を styles オブジェクト経由で指定 */}
        <div ref={messageListRef} className={styles["message-list"]}>
          {responseMessage.map((msg, index) => (
            <div
              key={index}
              className={`${styles.message} ${
                msg.author === "user" ? styles["my-message"] : ""
              }`}
            >
              {msg.author === "gal" && (
                <div className={styles["message-icon"]}></div>
              )}
              <div className={styles["message-content"]}>{msg.content}</div>
            </div>
          ))}
        </div>
        <div className={styles["input-area"]}>
          <input
            type="text"
            className="w-full border rounded-2xl px-3 py-2 focus:outline-none"
            onChange={(e) => handleChange(e.target.value)}
            value={message}
            placeholder="メッセージを入力"
          />
          <button className="btn btn-success" onClick={talkWithGirl}>
            ➤
          </button>
        </div>
      </div>
      {/* ... (Image display logic remains the same) */}
    </main>
  );
}
