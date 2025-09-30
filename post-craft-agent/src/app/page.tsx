// "use client";
// import { useState } from "react";

// export default function LinkedInPostGenerator() {
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [posts, setPosts] = useState<string[]>([]);

//   async function generatePosts() {
//     if (!input.trim()) return;
//     setLoading(true);
//     setPosts([]);

//     try {
//       const res = await fetch("/api/generate-posts", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ text: input }),
//       });

//       if (!res.ok) {
//         console.error("API error", res.status);
//         return;
//       }

//       const data = await res.json();
//       setPosts(Array.isArray(data.posts) ? data.posts : []);
//     } catch (error) {
//       console.error("Error generating posts", error);
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="max-w-3xl mx-auto p-6 space-y-6">
//       <h1 className="text-3xl font-bold text-center">Post Generator</h1>

//       <textarea
//         className="w-full p-4 rounded-lg border border-gray-300 focus:ring focus:ring-blue-300 "
//         rows={6}
//         placeholder="Paste blog link, text, or idea..."
//         value={input}
//         onChange={(e) => setInput(e.target.value)}
//       />

//       <button
//         onClick={generatePosts}
//         disabled={loading}
//         className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
//       >
//         {loading ? "Generating..." : "Generate Posts"}
//       </button>

//       {Array.isArray(posts) && posts.length > 0 && (
//         <div className="space-y-4">
//           {posts.map((post, idx) => (
//             <div
//               key={idx}
//               className="rounded-lg border p-4 shadow-sm"
//             >
//               <p className="whitespace-pre-line">{post}</p>
//               <button
//                 className="mt-2 rounded-md border px-3 py-1 text-sm"
//                 onClick={() => navigator.clipboard.writeText(post)}
//               >
//                 Copy
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";

const toneOptions = ["professional", "casual", "inspirational", "funny"];

export default function LinkedInPostGenerator() {
  const [input, setInput] = useState("");
  const [tones, setTones] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  // const [posts, setPosts] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cookieAccepted, setCookieAccepted] = useState(false);
  const [showCookieBanner, setShowCookieBanner] = useState(true);
  const [posts, setPosts] = useState<string[]>([
    // Professional
    "💼 Example (Professional): Effective communication is the foundation of successful teamwork. By keeping our processes clear and transparent, we ensure better outcomes for clients and colleagues alike. #Leadership #Teamwork",

    // Casual
    "😎 Example (Casual): Just wrapped up a late-night debugging session. Code finally works — time for coffee ☕️ and a nap. Anyone else living the developer life? 😂 #DevLife #CoffeePowered",

    // Inspirational
    "🌟 Example (Inspirational): Every big achievement is the sum of small, consistent steps. Keep pushing forward, no matter how small the progress may seem. 🚀 #Motivation #GrowthMindset",

    // Funny
    "😂 Example (Funny): Tried explaining my job to my grandma… now she thinks I ‘fix the internet’ for everyone. Close enough, right? #TechHumor #DeveloperLife",
  ]);

  const toggleTone = (tone: string) => {
    setTones((prev) => {
      if (prev.includes(tone)) {
        return prev.filter((t) => t !== tone);
      } else if (prev.length < 2) {
        return [...prev, tone];
      } else {
        return prev; // max 2
      }
    });
  };

  async function generatePosts() {
    if (!input.trim()) return;
    setLoading(true);
    setPosts([]);

    try {
      const res = await fetch("/api/generate-posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });

      if (!res.ok) {
        console.error("API error", res.status);
        return;
      }

      const data = await res.json();
      setPosts(Array.isArray(data.posts) ? data.posts : []);
    } catch (error) {
      console.error("Error generating posts", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {showCookieBanner && (
        <Card className="fixed bottom-0 inset-x-0  border-t m-4 py-4 px-8 shadow-md z-50">
          <div className="flex items-center justify-between gap-2 ">
            <div className="flex items-center gap-2">
              <Checkbox id="cookie-consent" checked={cookieAccepted} onCheckedChange={(val) => setCookieAccepted(!!val)} />
              <Label htmlFor="cookie-consent">I accept cookies for the best experience</Label>
            </div>
            <Button
              size="sm"
              onClick={() => {
                if (cookieAccepted) setShowCookieBanner(false);
              }}
            >
              Accept
            </Button>
          </div>
        </Card>
      )}

      <Card className="overflow-visible">
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <CardTitle className="text-2xl">LinkedIn Post Generator</CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="sm" variant="ghost" onClick={() => { setInput(''); setPosts([]); setTones([]); }}>
                    Clear
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Clear input and results</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div>
            <Label htmlFor="source">Source (paste text or article link)</Label>
            <Textarea
              id="source"
              className="mt-2"
              rows={6}
              placeholder="Share an idea, short article, or bullet points."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>

          <div>
            <Label>Select Tone(s)</Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between mt-2">
                  {tones.length > 0 ? (
                    <div className="flex gap-2 flex-wrap">
                      {tones.map((tone) => (
                        <Badge key={tone} variant="secondary" className="capitalize">{tone}</Badge>
                      ))}
                    </div>
                  ) : (
                    <span>Select up to 2 tones</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandList>
                    <CommandGroup>
                      {toneOptions.map((tone) => (
                        <CommandItem
                          key={tone}
                          onSelect={() => toggleTone(tone)}
                          className="capitalize cursor-pointer"
                        >
                          {tones.includes(tone) ? "✅" : "➕"} {tone}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex justify-end">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button disabled={loading || tones.length === 0}>
                  {loading ? "Generating..." : "Generate Posts"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure you want to generate posts?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will send your input and selected tones to the AI model to create posts.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={generatePosts}>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <Separator />

          {posts.length === 0 ? (
            <div className="text-sm text-muted-foreground">No posts yet — enter text, choose tones, and click Generate.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.isArray(posts) && posts.length > 0 && posts.map((post, idx) => (
                <article key={idx} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className=" text-sm">{post}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(post); toast.success("Copied to clipboard!"); }}>
                              Copy
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">Copy post to clipboard</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </CardContent>

        <CardFooter>
          <div className="text-xs">Built with Gemini · ShadCN UI · Next.js</div>
        </CardFooter>
      </Card>
    </div>
  );
}
