
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
  const [posts, setPosts] = useState<any[]>(
    [
      {
        "hook": "We spent 6 months building a feature. Users tried it for 30 seconds and vanished faster than free donuts at a meeting. 🍩💨",
        "story": "Our team poured our hearts, souls, and an alarming amount of caffeine into this new 'game-changing' feature. We envisioned standing ovations, tearful thank-yous, and maybe even a Nobel Prize for user experience. Instead, we got... crickets. And a single, polite un-install. Apparently, our magnum opus was less 'revolutionary discovery' and more 'slightly inconvenient detour'. 🤷‍♀️",
        "value": null,
        "list": null,
        "cta": "What's the shortest amount of time you've spent with a feature before deciding it wasn't your soulmate? Asking for a friend (it's me, I'm the friend). 👇",
        "quote": null,
        "stat": null,
        "hashtags": [
          "#productdevelopment",
          "#startupfail",
          "#userfeedback",
          "#tech"
        ]
      },
      {
        "hook": "Six months of development. Thirty seconds of user testing. A stark lesson in product-market fit.",
        "story": "We invested significant resources into building a new feature, believing it would solve a key user pain point. Post-launch, we observed an alarming trend: users engaged for less than 30 seconds before abandoning the feature entirely. This wasn't a bug; it was a signal that our assumptions about user needs were misaligned with reality.",
        "value": "This experience underscores the critical importance of continuous, early-stage user validation throughout the development lifecycle. Prioritizing qualitative feedback and rapid iteration cycles over extended, feature-focused development can prevent costly missteps and ensure resources are directed towards truly valuable solutions.",
        "list": null,
        "cta": "How do you balance deep development cycles with agile user validation to de-risk new feature launches?",
        "quote": null,
        "stat": null,
        "hashtags": [
          "#productmanagement",
          "#userexperience",
          "#productdevelopment",
          "#leanstartup"
        ]
      }
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

  // async function generatePosts() {
  //   if (!input.trim()) return;
  //   setLoading(true);
  //   setPosts([]);

  //   try {
  //     const res = await fetch("/api/generate-posts", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ text: input }),
  //     });

  //     if (!res.ok) {
  //       console.error("API error", res.status);
  //       return;
  //     }

  //     const data = await res.json();
  //     setPosts(Array.isArray(data.posts) ? data.posts : []);
  //   } catch (error) {
  //     console.error("Error generating posts", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // }
  async function generatePosts() {
    if (!input.trim() || tones.length === 0) return;
    setLoading(true);
    setPosts([]);

    try {
      const res = await fetch("/api/generate-posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input, tones }),
      });

      if (!res.ok) {
        console.error("API error", res.status);
        return;
      }

      const data = await res.json();
      let rawPosts = Array.isArray(data.posts) ? data.posts : [];
      let formattedPosts: any[] = [];

      rawPosts.forEach((p: any) => {
        try {
          // Remove markdown fences
          const clean = p.replace(/```json|```/g, "").trim();

          // Parse JSON
          const parsed = JSON.parse(clean);

          if (parsed.post) {
            formattedPosts.push(parsed.post); // keep structured
          }
        } catch (err) {
          console.error("Parse error:", err);
        }
      });
      console.log('formattedPosts', formattedPosts);

      setPosts(formattedPosts);


    } catch (error) {
      console.error("Error generating posts", error);
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="max-w-7xl mx-auto p-6">
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
            <CardTitle className="text-2xl">Post Generator</CardTitle>
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

          {/* <Separator /> */}

          {posts.length === 0 ? (
            <div className="text-sm text-muted-foreground">No posts yet — enter text, choose tones, and click Generate.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.isArray(posts) && posts.length > 0 &&
                posts.map((post, idx) => (
                  <article key={idx} className="border rounded-xl p-4 space-y-3">
                    <div className="flex flex-row justify-between gap-2">
                      {/* Hook */}
                      <h3 className="font-bold text-xl">{post.hook}</h3>
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

                    <p className="text-sm">{post.story}</p>
                    <p className="text-sm font-medium">{post.value}</p>

                    {post.quote && (
                      <blockquote className="italic border-l-4 pl-3 text-gray-600">
                        “{post.quote}”
                      </blockquote>
                    )}

                    {post.stat && (
                      <p className="text-sm text-blue-700 font-semibold">
                        📊 {post.stat}
                      </p>
                    )}

                    {post.list && post.list.length > 0 && (
                      <ul className="list-disc pl-5 text-sm space-y-1">
                        {post.list.map((tip: string, i: number) => (
                          <li key={i}>{tip}</li>
                        ))}
                      </ul>
                    )}

                    {post.cta && (
                      <p className="mt-2 font-semibold text-sm">{post.cta}</p>
                    )}

                    <div className="flex flex-wrap gap-2 mt-2 text-xs">
                      {post.hashtags?.map((tag: string, i: number) => (
                        <span key={i}>{tag}</span>
                      ))}
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
