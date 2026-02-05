"use client";

import { useEffect } from "react";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("Global error caught:", error);
  }, [error]);

  return (
    <html lang="ja">
      <body
        style={{
          margin: 0,
          minHeight: "100svh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily:
            "'Zen Maru Gothic', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', sans-serif",
          backgroundColor: "#ffffff",
          color: "#333333",
        }}
      >
        <div
          style={{
            maxWidth: "28rem",
            padding: "1.5rem",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontSize: "3.75rem",
              fontWeight: "bold",
              color: "#c94b4b",
              margin: 0,
            }}
          >
            Error
          </h1>
          <h2
            style={{
              fontSize: "1.5rem",
              marginTop: "1rem",
              fontFamily:
                "'Shippori Mincho B1', 'Hiragino Mincho ProN', 'Yu Mincho', serif",
            }}
          >
            重大なエラーが発生しました
          </h2>
          <p
            style={{
              fontSize: "0.875rem",
              marginTop: "1rem",
              lineHeight: 1.6,
              color: "#666666",
            }}
          >
            アプリケーションの読み込み中にエラーが発生しました。再試行するか、しばらくしてからもう一度お試しください。
          </p>
          {process.env.NODE_ENV === "development" && (
            <div
              style={{
                marginTop: "1.5rem",
                padding: "1rem",
                borderRadius: "0.5rem",
                border: "1px solid rgba(201, 75, 75, 0.3)",
                backgroundColor: "rgba(201, 75, 75, 0.05)",
                textAlign: "left",
              }}
            >
              <p
                style={{
                  fontSize: "0.75rem",
                  fontWeight: "600",
                  color: "#c94b4b",
                  margin: 0,
                }}
              >
                開発環境のみ表示
              </p>
              <p
                style={{
                  fontSize: "0.75rem",
                  marginTop: "0.5rem",
                  fontFamily: "monospace",
                  color: "#666666",
                  wordBreak: "break-all",
                }}
              >
                {error.message}
              </p>
              {error.digest && (
                <p
                  style={{
                    fontSize: "0.75rem",
                    marginTop: "0.25rem",
                    fontFamily: "monospace",
                    color: "#666666",
                  }}
                >
                  Digest: {error.digest}
                </p>
              )}
            </div>
          )}
          <div
            style={{
              marginTop: "1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            <button
              onClick={reset}
              style={{
                padding: "0.5rem 1rem",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "#ffffff",
                backgroundColor: "#4a7c59",
                border: "none",
                borderRadius: "0.375rem",
                cursor: "pointer",
              }}
            >
              再試行
            </button>
            {/* Using <a> intentionally - Link may not work when root layout fails */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              style={{
                padding: "0.5rem 1rem",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "#333333",
                backgroundColor: "transparent",
                border: "1px solid #e5e5e5",
                borderRadius: "0.375rem",
                textDecoration: "none",
              }}
            >
              ホームに戻る
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
