// src/app/components/enhancer-app.tsx

"use client"; // This directive marks the component as a Client Component.

import { useState } from "react";
import { Copy, Sparkles } from "lucide-react";

// Import UI components from shadcn/ui
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PostGenerationRequest } from "@/lib/types";

export function EnhancerApp() {
  // --- STATE MANAGEMENT ---
  // Form input states
  const [context, setContext] = useState("");
  const [idea, setIdea] = useState("");
  const [audience, setAudience] = useState("General Professional");
  const [tone, setTone] = useState<PostGenerationRequest['tone']>('informational');

  // Application flow states
  const [isLoading, setIsLoading] = useState(false);
  const [generatedPost, setGeneratedPost] = useState("");
  const [error, setError] = useState<string | null>(null);

  // --- HANDLER FUNCTIONS ---
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission
    setIsLoading(true);
    setError(null);
    setGeneratedPost("");

    try {
      const requestBody: PostGenerationRequest = {
        context,
        idea,
        audience,
        tone,
        cta: "Ask a Question", // CTA is static for now as per simplicity requirement
      };

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        // Handle HTTP errors
        const errorData = await response.json();
        throw new Error(errorData.error || `Error: ${response.status}`);
      }

      const data = await response.json();
      setGeneratedPost(data.post);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (generatedPost) {
      navigator.clipboard.writeText(generatedPost);
      // Optionally, add a toast notification here for better UX
      alert("Post copied to clipboard!");
    }
  };
  
  // --- RENDER ---
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* LEFT SIDE: INPUT FORM */}
      <Card>
        <CardHeader>
          <CardTitle>1. Provide Your Details</CardTitle>
          <CardDescription>
            Fill in the details below to generate your post.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="context" className="font-semibold">Company/Project Overview</label>
              <Textarea
                id="context"
                placeholder="e.g., We are a B2B SaaS company that helps sales teams close deals faster with our AI-powered CRM."
                value={context}
                onChange={(e) => setContext(e.target.value)}
                required
                className="mt-2"
                rows={4}
              />
            </div>

            <div>
              <label htmlFor="idea" className="font-semibold">Post Idea</label>
              <Textarea
                id="idea"
                placeholder="e.g., Announce our new integration with Salesforce that syncs customer data in real-time."
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                required
                className="mt-2"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="audience" className="font-semibold">Audience</label>
                 <Select value={audience} onValueChange={setAudience} required>
                    <SelectTrigger id="audience" className="mt-2">
                      <SelectValue placeholder="Select an audience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="General Professional">General Professional</SelectItem>
                      <SelectItem value="Industry Experts">Industry Experts</SelectItem>
                      <SelectItem value="C-Level Executives">C-Level Executives</SelectItem>
                      <SelectItem value="Potential Clients">Potential Clients</SelectItem>
                      <SelectItem value="Recruiters">Recruiters</SelectItem>
                    </SelectContent>
                  </Select>
              </div>
              <div>
                 <label htmlFor="tone" className="font-semibold">Tone</label>
                 <Select value={tone} onValueChange={(v: any) => setTone(v)} required>
                    <SelectTrigger id="tone" className="mt-2">
                      <SelectValue placeholder="Select a tone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="informational">Informational</SelectItem>
                      <SelectItem value="inspirational">Inspirational</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="formal">Formal</SelectItem>
                    </SelectContent>
                  </Select>
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Generating..." : "Generate Post"}
              <Sparkles className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* RIGHT SIDE: OUTPUT */}
      <Card>
        <CardHeader>
          <CardTitle>2. Your Generated Post</CardTitle>
          <CardDescription>
            Review, edit, and copy your AI-generated post.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4">
              <p><span className="font-bold">Error:</span> {error}</p>
            </div>
          )}
          
          <div className="relative">
            <Textarea
              placeholder="Your post will appear here..."
              value={generatedPost}
              onChange={(e) => setGeneratedPost(e.target.value)}
              className="w-full h-80 text-base"
              readOnly={!generatedPost && !isLoading}
            />
            {generatedPost && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                className="absolute top-2 right-2"
                aria-label="Copy post to clipboard"
              >
                <Copy className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}