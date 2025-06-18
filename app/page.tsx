"use client";
import { useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Toaster } from "../components/ui/sonner";
import { toast } from "sonner";
import Image from "next/image";

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
      console.error(err);
      toast.error("Failed to capture screenshots");
    } finally {
      setLoading(false);
    }
  };

  // Proxy API route for local dev (Next.js -> FastAPI)
  // You should create a file at frontend/pages/api/screenshot.ts to forward requests to FastAPI

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-2 sm:p-4">
      <Toaster position="top-center" />
      {/* Logo and heading */}
      <div className="flex flex-col items-center gap-2 mt-8 mb-4">
        <div className="rounded-full bg-blue-600/10 p-3 shadow-md">
          {/* Minimal logo placeholder */}
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="40" rx="12" fill="#2563eb" fillOpacity="0.2"/>
            <path d="M12 28L28 12M12 12L28 28" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center tracking-tight text-blue-900 dark:text-white drop-shadow-sm">Website Screenshot Tool</h1>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 text-center max-w-xl">Enter a website URL to capture screenshots of all internal pages. Download them as a ZIP for easy sharing!</p>
      </div>
      <Card className="w-full max-w-2xl p-6 sm:p-10 shadow-xl flex flex-col gap-6 relative">
        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 flex flex-col items-center justify-center z-10 rounded-lg">
            <svg className="animate-spin h-10 w-10 text-blue-600 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            <span className="text-blue-700 dark:text-blue-200 font-semibold">Processing...</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full">
          <Input
            type="url"
            placeholder="Enter website URL (e.g. https://onelensmedia.org/)"
            value={url}
            onChange={e => setUrl(e.target.value)}
            required
            className="flex-1 text-base"
            disabled={loading}
            aria-label="Website URL"
          />
          <Button type="submit" disabled={loading || !url} className="transition-all duration-150 shadow-md hover:scale-105">
            {loading ? "Processing..." : "Capture"}
          </Button>
        </form>
        {screenshots.length > 0 && (
          <div className="flex flex-col gap-4 mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
              {screenshots.map((src, i) => (
                <Card key={src} className="p-2 w-full transition-all duration-150 hover:shadow-2xl hover:scale-[1.03] cursor-pointer">
                  <Image
                    src={src}
                    alt={`Screenshot ${i + 1}`}
                    width={400}
                    height={250}
                    className="rounded shadow object-cover w-full h-40 sm:h-36 md:h-32"
                  />
                  <div className="text-xs text-center mt-2 text-gray-700 dark:text-gray-200">Screenshot {i + 1}</div>
                </Card>
              ))}
            </div>
            {folder && (
              <a
                href={`${BACKEND_URL}/download_zip/${encodeURIComponent(folder)}`}
                className="mt-2"
              >
                <Button className="w-full transition-all duration-150 shadow-md hover:scale-105">Download All as ZIP</Button>
              </a>
            )}
          </div>
        )}
      </Card>
      <footer className="mt-10 mb-4 text-gray-500 text-xs text-center w-full px-2">
        &copy; {new Date().getFullYear()} Website Screenshot Tool. Powered by Next.js, FastAPI, and shadcn/ui.
      </footer>
    </div>
  );
}
