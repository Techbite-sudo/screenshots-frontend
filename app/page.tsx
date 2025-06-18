"use client";
import { useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { toast, Toaster } from "../components/ui/sonner";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [folder, setFolder] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setScreenshots([]);
    setFolder(null);
    try {
      const res = await fetch(
        `${BACKEND_URL}/screenshot?url=${encodeURIComponent(url)}`
      );
      if (!res.ok) throw new Error("Failed to get screenshots");
      const data = await res.json();
      setScreenshots(data.screenshots.map((src: string) => `${BACKEND_URL}${src}`));
      setFolder(data.folder);
      toast.success("Screenshots captured!");
    } catch (err) {
      toast.error("Failed to capture screenshots");
    } finally {
      setLoading(false);
    }
  };

  // Proxy API route for local dev (Next.js -> FastAPI)
  // You should create a file at frontend/pages/api/screenshot.ts to forward requests to FastAPI

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800 p-4">
      <Toaster position="top-center" />
      <Card className="w-full max-w-xl p-8 shadow-lg flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-center mb-2">Website Screenshot Tool</h1>
        <form onSubmit={handleSubmit} className="flex gap-2 w-full">
          <Input
            type="url"
            placeholder="Enter website URL (e.g. https://onelensmedia.org/)"
            value={url}
            onChange={e => setUrl(e.target.value)}
            required
            className="flex-1"
            disabled={loading}
          />
          <Button type="submit" disabled={loading || !url}>
            {loading ? "Processing..." : "Capture"}
          </Button>
        </form>
        {screenshots.length > 0 && (
          <div className="flex flex-col gap-4 mt-4">
            <div className="flex flex-wrap gap-4 justify-center">
              {screenshots.map((src, i) => (
                <Card key={src} className="p-2 w-48">
                  <img
                    src={src}
                    alt={`Screenshot ${i + 1}`}
                    className="rounded shadow object-cover w-full h-32"
                  />
                  <div className="text-xs text-center mt-2">Screenshot {i + 1}</div>
                </Card>
              ))}
            </div>
            {folder && (
              <a
                href={`${BACKEND_URL}/download_zip/${encodeURIComponent(folder)}`}
                className="mt-2"
              >
                <Button className="w-full">Download All as ZIP</Button>
              </a>
            )}
          </div>
        )}
      </Card>
      <footer className="mt-8 text-gray-500 text-xs text-center">
        &copy; {new Date().getFullYear()} Website Screenshot Tool. Powered by Next.js, FastAPI, and shadcn/ui.
      </footer>
    </div>
  );
}
