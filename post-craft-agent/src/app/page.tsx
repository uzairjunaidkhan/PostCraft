// "use client";

// import { useState, useEffect } from "react";
// import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
// import { Badge } from "@/components/ui/badge";
// import { toast } from "sonner";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { RefreshCw, Copy, Edit2, Save, X, Info, Trash2, FileText } from "lucide-react";

// const toneOptions = [
//   { value: "professional", label: "Professional", description: "Insights, data-driven, business terminology" },
//   { value: "casual", label: "Casual", description: "Conversational, personal anecdotes, everyday language" },
//   { value: "inspirational", label: "Inspirational", description: "Emotional, transformational, motivational" },
//   { value: "funny", label: "Funny", description: "Humorous, unexpected twists, light-hearted" },
//   { value: "thought-provoking", label: "Thought-Provoking", description: "Challenges assumptions, deep questions" },
//   { value: "controversial", label: "Controversial", description: "Bold opinions, debate-starting" },
//   { value: "educational", label: "Educational", description: "Teaching, how-to, informative" },
//   { value: "authentic", label: "Authentic", description: "Vulnerable, real, behind-the-scenes" }
// ];

// const MAX_LINKEDIN_CHARS = 3000;

// export default function LinkedInPostGenerator() {
//   const [input, setInput] = useState("");
//   const [tones, setTones] = useState<string[]>([]);
//   const [customTone, setCustomTone] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [open, setOpen] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [cookieAccepted, setCookieAccepted] = useState(false);
//   const [showCookieBanner, setShowCookieBanner] = useState(true);
//   const [posts, setPosts] = useState<any[]>([]);
//   const [editingPost, setEditingPost] = useState<number | null>(null);
//   const [editedContent, setEditedContent] = useState<any>(null);
//   const [regeneratingPost, setRegeneratingPost] = useState<number | null>(null);
//   const [drafts, setDrafts] = useState<any[]>([]);
//   const [activeTab, setActiveTab] = useState("generated");

//   // Load drafts from sessionStorage on mount
//   useEffect(() => {
//     try {
//       const savedDrafts = sessionStorage.getItem('linkedinDrafts');
//       if (savedDrafts) {
//         setDrafts(JSON.parse(savedDrafts));
//       }
//     } catch (error) {
//       console.error('Error loading drafts from sessionStorage:', error);
//     }
//   }, []);

//   // Save drafts to sessionStorage whenever they change
//   useEffect(() => {
//     try {
//       sessionStorage.setItem('linkedinDrafts', JSON.stringify(drafts));
//     } catch (error) {
//       console.error('Error saving drafts to sessionStorage:', error);
//     }
//   }, [drafts]);

//   const toggleTone = (tone: string) => {
//     setTones((prev) => {
//       if (prev.includes(tone)) {
//         return prev.filter((t) => t !== tone);
//       } else if (prev.length < 2) {
//         return [...prev, tone];
//       } else {
//         toast.error("Maximum 2 tones allowed");
//         return prev;
//       }
//     });
//   };

//   const addCustomTone = () => {
//     if (!customTone.trim()) return;
//     if (tones.length >= 2) {
//       toast.error("Maximum 2 tones allowed");
//       return;
//     }
//     setTones([...tones, customTone.trim()]);
//     setCustomTone("");
//     setOpen(false);
//   };

//   const formatPostForCopy = (post: any) => {
//     let formatted = post.hook;

//     if (post.story) formatted += `\n\n${post.story}`;
//     if (post.value) formatted += `\n\n${post.value}`;

//     if (post.quote) formatted += `\n\n"${post.quote}"`;
//     if (post.stat) formatted += `\n\n📊 ${post.stat}`;

//     if (post.list && post.list.length > 0) {
//       formatted += '\n\n' + post.list.map((item: string) => `• ${item}`).join('\n');
//     }

//     if (post.cta) formatted += `\n\n${post.cta}`;

//     if (post.hashtags && post.hashtags.length > 0) {
//       formatted += `\n\n${post.hashtags.join(' ')}`;
//     }

//     return formatted;
//   };

//   const copyPost = (post: any) => {
//     const formatted = formatPostForCopy(post);
//     navigator.clipboard.writeText(formatted);
//     toast.success("Post copied to clipboard!");
//   };

//   const saveDraft = (post: any) => {
//     setDrafts([...drafts, { ...post, savedAt: new Date().toISOString(), id: Date.now() }]);
//     toast.success("Draft saved to session storage!");
//     setActiveTab("drafts");
//   };

//   const deleteDraft = (id: number) => {
//     setDrafts(drafts.filter(draft => draft.id !== id));
//     toast.success("Draft deleted!");
//   };

//   const clearAllDrafts = () => {
//     setDrafts([]);
//     sessionStorage.removeItem('linkedinDrafts');
//     toast.success("All drafts cleared!");
//   };

//   const loadDraftToGenerated = (draft: any) => {
//     setPosts([...posts, draft]);
//     setActiveTab("generated");
//     toast.success("Draft loaded to generated posts!");
//   };

//   const startEditing = (idx: number) => {
//     setEditingPost(idx);
//     setEditedContent({ ...posts[idx] });
//   };

//   const saveEdit = () => {
//     if (editingPost === null) return;
//     const newPosts = [...posts];
//     newPosts[editingPost] = editedContent;
//     setPosts(newPosts);
//     setEditingPost(null);
//     setEditedContent(null);
//     toast.success("Post updated!");
//   };

//   const cancelEdit = () => {
//     setEditingPost(null);
//     setEditedContent(null);
//   };

//   const regeneratePost = async (idx: number, tone: string) => {
//     if (!input.trim()) return;
//     setRegeneratingPost(idx);
//     setError(null);

//     try {
//       const res = await fetch("/api/generate-posts", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ text: input, tones: [tone] }),
//       });

//       if (!res.ok) {
//         throw new Error(`API error: ${res.status}`);
//       }

//       const data = await res.json();
//       let rawPosts = Array.isArray(data.posts) ? data.posts : [];

//       if (rawPosts.length > 0) {
//         const clean = rawPosts[0].replace(/```json|```/g, "").trim();
//         const parsed = JSON.parse(clean);

//         if (parsed.post) {
//           const newPosts = [...posts];
//           newPosts[idx] = parsed.post;
//           setPosts(newPosts);
//           toast.success("Post regenerated!");
//         }
//       }
//     } catch (error) {
//       console.error("Error regenerating post", error);
//       setError("Failed to regenerate post. Please try again.");
//       toast.error("Failed to regenerate post");
//     } finally {
//       setRegeneratingPost(null);
//     }
//   };

//   async function generatePosts() {
//     if (!input.trim() || tones.length === 0) {
//       toast.error("Please enter text and select at least one tone");
//       return;
//     }

//     setLoading(true);
//     setPosts([]);
//     setError(null);

//     try {
//       const res = await fetch("/api/generate-posts", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ text: input, tones }),
//       });

//       if (!res.ok) {
//         throw new Error(`API error: ${res.status}`);
//       }

//       const data = await res.json();
//       let rawPosts = Array.isArray(data.posts) ? data.posts : [];
//       let formattedPosts: any[] = [];

//       rawPosts.forEach((p: any) => {
//         try {
//           const clean = p.replace(/```json|```/g, "").trim();
//           const parsed = JSON.parse(clean);

//           if (parsed.post) {
//             formattedPosts.push(parsed.post);
//           }
//         } catch (err) {
//           console.error("Parse error:", err);
//         }
//       });

//       if (formattedPosts.length === 0) {
//         throw new Error("No valid posts generated");
//       }

//       setPosts(formattedPosts);
//       toast.success(`Generated ${formattedPosts.length} post${formattedPosts.length > 1 ? 's' : ''}!`);
//     } catch (error) {
//       console.error("Error generating posts", error);
//       setError("Failed to generate posts. Please try again.");
//       toast.error("Failed to generate posts");
//     } finally {
//       setLoading(false);
//     }
//   }

//   const charCount = input.length;
//   const isNearLimit = charCount > MAX_LINKEDIN_CHARS * 0.8;
//   const isOverLimit = charCount > MAX_LINKEDIN_CHARS;

//   return (
//     <div className="max-w-7xl mx-auto p-6">
//       {showCookieBanner && (
//         <Card className="fixed bottom-0 inset-x-0 border-t m-4 py-4 px-8 shadow-md z-50">
//           <div className="flex items-center justify-between gap-2">
//             <div className="flex items-center gap-2">
//               <Checkbox id="cookie-consent" checked={cookieAccepted} onCheckedChange={(val) => setCookieAccepted(!!val)} />
//               <Label htmlFor="cookie-consent">I accept cookies for the best experience</Label>
//             </div>
//             <Button
//               size="sm"
//               onClick={() => {
//                 if (cookieAccepted) setShowCookieBanner(false);
//               }}
//             >
//               Accept
//             </Button>
//           </div>
//         </Card>
//       )}

//       <Card className="overflow-visible">
//         <CardHeader>
//           <div className="flex items-center justify-between gap-4">
//             <CardTitle className="text-2xl">LinkedIn Post Generator</CardTitle>
//             <TooltipProvider>
//               <Tooltip>
//                 <TooltipTrigger asChild>
//                   <Button size="sm" variant="ghost" onClick={() => { setInput(''); setPosts([]); setTones([]); setError(null); }}>
//                     Clear All
//                   </Button>
//                 </TooltipTrigger>
//                 <TooltipContent side="bottom">Clear input and results</TooltipContent>
//               </Tooltip>
//             </TooltipProvider>
//           </div>
//         </CardHeader>

//         <CardContent className="space-y-4">
//           {error && (
//             <Alert variant="destructive">
//               <AlertTitle>Error</AlertTitle>
//               <AlertDescription>{error}</AlertDescription>
//             </Alert>
//           )}

//           <div>
//             <div className="flex items-center justify-between mb-2">
//               <Label htmlFor="source">Source (paste text or article link)</Label>
//               <span className={`text-xs ${isOverLimit ? 'text-red-600 font-semibold' : isNearLimit ? 'text-orange-600' : 'text-muted-foreground'}`}>
//                 {charCount} / {MAX_LINKEDIN_CHARS} characters
//               </span>
//             </div>
//             <Textarea
//               id="source"
//               className={`mt-2 ${isOverLimit ? 'border-red-500' : ''}`}
//               rows={6}
//               placeholder="Share an idea, short article, or bullet points."
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//             />
//             {isOverLimit && (
//               <p className="text-xs text-red-600 mt-1">Content exceeds LinkedIn's character limit</p>
//             )}
//           </div>

//           <div>
//             <div className="flex items-center gap-2 mb-2">
//               <Label>Select Tone(s)</Label>
//               <TooltipProvider>
//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <Info className="h-4 w-4 text-muted-foreground cursor-help" />
//                   </TooltipTrigger>
//                   <TooltipContent side="right" className="max-w-xs">
//                     Select up to 2 tones to generate different variations of your post
//                   </TooltipContent>
//                 </Tooltip>
//               </TooltipProvider>
//             </div>
//             <Popover open={open} onOpenChange={setOpen}>
//               <PopoverTrigger asChild>
//                 <Button variant="outline" className="w-full justify-between mt-2">
//                   {tones.length > 0 ? (
//                     <div className="flex gap-2 flex-wrap">
//                       {tones.map((tone) => (
//                         <Badge key={tone} variant="secondary" className="capitalize">{tone}</Badge>
//                       ))}
//                     </div>
//                   ) : (
//                     <span>Select up to 2 tones</span>
//                   )}
//                 </Button>
//               </PopoverTrigger>
//               <PopoverContent className="w-full p-0">
//                 <Command>
//                   <CommandList>
//                     <CommandGroup>
//                       {toneOptions.map((tone) => (
//                         <CommandItem
//                           key={tone.value}
//                           onSelect={() => toggleTone(tone.value)}
//                           className="cursor-pointer flex-col items-start"
//                         >
//                           <div className="flex items-center gap-2 w-full">
//                             <span>{tones.includes(tone.value) ? "✅" : "➕"}</span>
//                             <span className="font-medium">{tone.label}</span>
//                           </div>
//                           <span className="text-xs text-muted-foreground ml-6">{tone.description}</span>
//                         </CommandItem>
//                       ))}
//                     </CommandGroup>
//                     <div className="p-2 border-t">
//                       <div className="flex gap-2">
//                         <Input
//                           placeholder="Custom tone..."
//                           value={customTone}
//                           onChange={(e) => setCustomTone(e.target.value)}
//                           onKeyDown={(e) => e.key === 'Enter' && addCustomTone()}
//                         />
//                         <Button size="sm" onClick={addCustomTone}>Add</Button>
//                       </div>
//                     </div>
//                   </CommandList>
//                 </Command>
//               </PopoverContent>
//             </Popover>
//           </div>

//           <div className="flex justify-end gap-2">
//             {drafts.length > 0 && (
//               <TooltipProvider>
//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <Badge
//                       variant="outline"
//                       className="cursor-pointer hover:bg-accent"
//                       onClick={() => setActiveTab("drafts")}
//                     >
//                       <FileText className="h-3 w-3 mr-1" />
//                       {drafts.length} draft{drafts.length > 1 ? 's' : ''}
//                     </Badge>
//                   </TooltipTrigger>
//                   <TooltipContent side="top" className="max-w-xs">
//                     <p className="font-semibold mb-1">⚠️ Session Storage</p>
//                     <p className="text-xs">Drafts are stored in your browser's session storage. They will be cleared when you close this tab or browser window.</p>
//                   </TooltipContent>
//                 </Tooltip>
//               </TooltipProvider>
//             )}
//             <AlertDialog>
//               <AlertDialogTrigger asChild>
//                 <Button disabled={loading || tones.length === 0 || !input.trim() || isOverLimit}>
//                   {loading ? "Generating..." : "Generate Posts"}
//                 </Button>
//               </AlertDialogTrigger>
//               <AlertDialogContent>
//                 <AlertDialogHeader>
//                   <AlertDialogTitle>Generate LinkedIn Posts?</AlertDialogTitle>
//                   <AlertDialogDescription>
//                     This will create {tones.length} post{tones.length > 1 ? 's' : ''} using AI based on your input and selected tones.
//                   </AlertDialogDescription>
//                 </AlertDialogHeader>
//                 <AlertDialogFooter>
//                   <AlertDialogCancel>Cancel</AlertDialogCancel>
//                   <AlertDialogAction onClick={generatePosts}>Continue</AlertDialogAction>
//                 </AlertDialogFooter>
//               </AlertDialogContent>
//             </AlertDialog>
//           </div>


//           <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//             <TabsList className="grid w-full grid-cols-2">
//               <TabsTrigger value="generated">
//                 Generated Posts ({posts.length})
//               </TabsTrigger>
//               <TabsTrigger value="drafts">
//                 Drafts ({drafts.length})
//               </TabsTrigger>
//             </TabsList>

//             <TabsContent value="generated" className="mt-4">
//               {posts.length === 0 ? (
//                 <div className="text-sm text-muted-foreground text-center py-8">
//                   No posts yet — enter text, choose tones, and click Generate.
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {posts.map((post, idx) => (
//                     <article key={idx} className="border rounded-xl p-4 space-y-3 relative">
//                       {regeneratingPost === idx && (
//                         <div className="absolute inset-0 bg-background/80 rounded-xl flex items-center justify-center z-10">
//                           <RefreshCw className="h-6 w-6 animate-spin" />
//                         </div>
//                       )}

//                       {editingPost === idx ? (
//                         <div className="space-y-3">
//                           <div className="flex justify-between items-start gap-2">
//                             <Textarea
//                               value={editedContent.hook}
//                               onChange={(e) => setEditedContent({ ...editedContent, hook: e.target.value })}
//                               className="font-bold text-xl"
//                               rows={2}
//                             />
//                             <div className="flex gap-1">
//                               <Button size="sm" variant="outline" onClick={saveEdit}>
//                                 <Save className="h-4 w-4" />
//                               </Button>
//                               <Button size="sm" variant="outline" onClick={cancelEdit}>
//                                 <X className="h-4 w-4" />
//                               </Button>
//                             </div>
//                           </div>
//                           <Textarea
//                             value={editedContent.story}
//                             onChange={(e) => setEditedContent({ ...editedContent, story: e.target.value })}
//                             rows={4}
//                           />
//                           {editedContent.value && (
//                             <Textarea
//                               value={editedContent.value}
//                               onChange={(e) => setEditedContent({ ...editedContent, value: e.target.value })}
//                               rows={2}
//                             />
//                           )}
//                         </div>
//                       ) : (
//                         <>
//                           <div className="flex justify-between gap-2">
//                             <h3 className="font-bold text-xl">{post.hook}</h3>
//                             <div className="flex gap-1 shrink-0">
//                               <TooltipProvider>
//                                 <Tooltip>
//                                   <TooltipTrigger asChild>
//                                     <Button size="sm" variant="outline" onClick={() => startEditing(idx)}>
//                                       <Edit2 className="h-4 w-4" />
//                                     </Button>
//                                   </TooltipTrigger>
//                                   <TooltipContent side="bottom">Edit post</TooltipContent>
//                                 </Tooltip>
//                               </TooltipProvider>
//                               <TooltipProvider>
//                                 <Tooltip>
//                                   <TooltipTrigger asChild>
//                                     <Button size="sm" variant="outline" onClick={() => regeneratePost(idx, tones[idx] || tones[0])}>
//                                       <RefreshCw className="h-4 w-4" />
//                                     </Button>
//                                   </TooltipTrigger>
//                                   <TooltipContent side="bottom">Regenerate post</TooltipContent>
//                                 </Tooltip>
//                               </TooltipProvider>
//                               <TooltipProvider>
//                                 <Tooltip>
//                                   <TooltipTrigger asChild>
//                                     <Button size="sm" variant="outline" onClick={() => copyPost(post)}>
//                                       <Copy className="h-4 w-4" />
//                                     </Button>
//                                   </TooltipTrigger>
//                                   <TooltipContent side="bottom">Copy to clipboard</TooltipContent>
//                                 </Tooltip>
//                               </TooltipProvider>
//                             </div>
//                           </div>

//                           <p className="text-sm whitespace-pre-wrap">{post.story}</p>
//                           {post.value && <p className="text-sm font-medium whitespace-pre-wrap">{post.value}</p>}

//                           {post.quote && (
//                             <blockquote className="italic border-l-4 pl-3 text-gray-600">
//                               "{post.quote}"
//                             </blockquote>
//                           )}

//                           {post.stat && (
//                             <p className="text-sm text-blue-700 font-semibold">
//                               📊 {post.stat}
//                             </p>
//                           )}

//                           {post.list && post.list.length > 0 && (
//                             <ul className="list-disc pl-5 text-sm space-y-1">
//                               {post.list.map((tip: string, i: number) => (
//                                 <li key={i}>{tip}</li>
//                               ))}
//                             </ul>
//                           )}

//                           {post.cta && (
//                             <p className="mt-2 font-semibold text-sm">{post.cta}</p>
//                           )}

//                           <div className="flex flex-wrap gap-2 mt-2 text-xs text-blue-600">
//                             {post.hashtags?.map((tag: string, i: number) => (
//                               <span key={i}>{tag}</span>
//                             ))}
//                           </div>

//                           <div className="pt-2 border-t">
//                             <Button size="sm" variant="ghost" className="w-full" onClick={() => saveDraft(post)}>
//                               Save as Draft
//                             </Button>
//                           </div>
//                         </>
//                       )}
//                     </article>
//                   ))}
//                 </div>
//               )}

//             </TabsContent>

//             <TabsContent value="drafts" className="mt-4">
//               {drafts.length === 0 ? (
//                 <div className="text-sm text-muted-foreground text-center py-8">
//                   No drafts saved yet. Generate posts and click "Save as Draft" to save them here.
//                 </div>
//               ) : (
//                 <>
//                   <div className="flex justify-between items-center mb-4">
//                     <div className="flex items-center gap-2">
//                       <Info className="h-4 w-4 text-muted-foreground" />
//                       <p className="text-xs text-muted-foreground">
//                         Drafts are stored in session storage and will be cleared when you close this tab
//                       </p>
//                     </div>
//                     <AlertDialog>
//                       <AlertDialogTrigger asChild>
//                         <Button size="sm" variant="destructive">
//                           <Trash2 className="h-4 w-4 mr-1" />
//                           Clear All
//                         </Button>
//                       </AlertDialogTrigger>
//                       <AlertDialogContent>
//                         <AlertDialogHeader>
//                           <AlertDialogTitle>Clear all drafts?</AlertDialogTitle>
//                           <AlertDialogDescription>
//                             This will permanently delete all {drafts.length} saved draft{drafts.length > 1 ? 's' : ''}. This action cannot be undone.
//                           </AlertDialogDescription>
//                         </AlertDialogHeader>
//                         <AlertDialogFooter>
//                           <AlertDialogCancel>Cancel</AlertDialogCancel>
//                           <AlertDialogAction onClick={clearAllDrafts}>Delete All</AlertDialogAction>
//                         </AlertDialogFooter>
//                       </AlertDialogContent>
//                     </AlertDialog>
//                   </div>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {drafts.map((draft, idx) => (
//                       <article key={draft.id || idx} className="border rounded-xl p-4 space-y-3 bg-muted/30">
//                         <div className="flex justify-between gap-2">
//                           <h3 className="font-bold text-xl">{draft.hook}</h3>
//                           <div className="flex gap-1 shrink-0">
//                             <TooltipProvider>
//                               <Tooltip>
//                                 <TooltipTrigger asChild>
//                                   <Button size="sm" variant="outline" onClick={() => loadDraftToGenerated(draft)}>
//                                     <RefreshCw className="h-4 w-4" />
//                                   </Button>
//                                 </TooltipTrigger>
//                                 <TooltipContent side="bottom">Load to generated</TooltipContent>
//                               </Tooltip>
//                             </TooltipProvider>
//                             <TooltipProvider>
//                               <Tooltip>
//                                 <TooltipTrigger asChild>
//                                   <Button size="sm" variant="outline" onClick={() => copyPost(draft)}>
//                                     <Copy className="h-4 w-4" />
//                                   </Button>
//                                 </TooltipTrigger>
//                                 <TooltipContent side="bottom">Copy to clipboard</TooltipContent>
//                               </Tooltip>
//                             </TooltipProvider>
//                             <TooltipProvider>
//                               <Tooltip>
//                                 <TooltipTrigger asChild>
//                                   <Button size="sm" variant="destructive" onClick={() => deleteDraft(draft.id)}>
//                                     <Trash2 className="h-4 w-4" />
//                                   </Button>
//                                 </TooltipTrigger>
//                                 <TooltipContent side="bottom">Delete draft</TooltipContent>
//                               </Tooltip>
//                             </TooltipProvider>
//                           </div>
//                         </div>

//                         <p className="text-sm whitespace-pre-wrap">{draft.story}</p>
//                         {draft.value && <p className="text-sm font-medium whitespace-pre-wrap">{draft.value}</p>}

//                         {draft.quote && (
//                           <blockquote className="italic border-l-4 pl-3 text-gray-600">
//                             "{draft.quote}"
//                           </blockquote>
//                         )}

//                         {draft.stat && (
//                           <p className="text-sm text-blue-700 font-semibold">
//                             📊 {draft.stat}
//                           </p>
//                         )}

//                         {draft.list && draft.list.length > 0 && (
//                           <ul className="list-disc pl-5 text-sm space-y-1">
//                             {draft.list.map((tip: string, i: number) => (
//                               <li key={i}>{tip}</li>
//                             ))}
//                           </ul>
//                         )}

//                         {draft.cta && (
//                           <p className="mt-2 font-semibold text-sm">{draft.cta}</p>
//                         )}

//                         <div className="flex flex-wrap gap-2 mt-2 text-xs text-blue-600">
//                           {draft.hashtags?.map((tag: string, i: number) => (
//                             <span key={i}>{tag}</span>
//                           ))}
//                         </div>

//                         <div className="pt-2 border-t text-xs text-muted-foreground">
//                           Saved: {new Date(draft.savedAt).toLocaleString()}
//                         </div>
//                       </article>
//                     ))}
//                   </div>
//                 </>
//               )}
//             </TabsContent>
//           </Tabs>
//         </CardContent>

//         <CardFooter>
//           <div className="text-xs text-muted-foreground">Built with Gemini · ShadCN UI · Next.js</div>
//         </CardFooter>
//       </Card>
//     </div>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, Copy, Edit2, Save, X, Info, Trash2, FileText } from "lucide-react";

interface PostContent {
  hook: string;
  story: string;
  value?: string;
  list?: string[];
  cta?: string;
  quote?: string;
  stat?: string;
  hashtags?: string[];
  savedAt?: string;
  id?: number;
}

const toneOptions = [
  { value: "professional", label: "Professional", description: "Insights, data-driven, business terminology" },
  { value: "casual", label: "Casual", description: "Conversational, personal anecdotes, everyday language" },
  { value: "inspirational", label: "Inspirational", description: "Emotional, transformational, motivational" },
  { value: "funny", label: "Funny", description: "Humorous, unexpected twists, light-hearted" },
  { value: "thought-provoking", label: "Thought-Provoking", description: "Challenges assumptions, deep questions" },
  { value: "controversial", label: "Controversial", description: "Bold opinions, debate-starting" },
  { value: "educational", label: "Educational", description: "Teaching, how-to, informative" },
  { value: "authentic", label: "Authentic", description: "Vulnerable, real, behind-the-scenes" }
];

const MAX_LINKEDIN_CHARS = 3000;

export default function LinkedInPostGenerator() {
  const [input, setInput] = useState("");
  const [tones, setTones] = useState<string[]>([]);
  const [customTone, setCustomTone] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cookieAccepted, setCookieAccepted] = useState(false);
  const [showCookieBanner, setShowCookieBanner] = useState(true);
  const [posts, setPosts] = useState<PostContent[]>([]);
  const [editingPost, setEditingPost] = useState<number | null>(null);
  const [editedContent, setEditedContent] = useState<PostContent | null>(null);
  const [regeneratingPost, setRegeneratingPost] = useState<number | null>(null);
  const [drafts, setDrafts] = useState<PostContent[]>([]);
  const [activeTab, setActiveTab] = useState("generated");

  // Load drafts from sessionStorage on mount
  useEffect(() => {
    try {
      const savedDrafts = sessionStorage.getItem('linkedinDrafts');
      if (savedDrafts) {
        setDrafts(JSON.parse(savedDrafts));
      }
    } catch (error) {
      console.error('Error loading drafts from sessionStorage:', error);
    }
  }, []);

  // Save drafts to sessionStorage whenever they change
  useEffect(() => {
    try {
      sessionStorage.setItem('linkedinDrafts', JSON.stringify(drafts));
    } catch (error) {
      console.error('Error saving drafts to sessionStorage:', error);
    }
  }, [drafts]);

  const toggleTone = (tone: string) => {
    setTones((prev) => {
      if (prev.includes(tone)) {
        return prev.filter((t) => t !== tone);
      } else if (prev.length < 2) {
        return [...prev, tone];
      } else {
        toast.error("Maximum 2 tones allowed");
        return prev;
      }
    });
  };

  const addCustomTone = () => {
    if (!customTone.trim()) return;
    if (tones.length >= 2) {
      toast.error("Maximum 2 tones allowed");
      return;
    }
    setTones([...tones, customTone.trim()]);
    setCustomTone("");
    setOpen(false);
  };

  const formatPostForCopy = (post: PostContent) => {
    let formatted = post.hook;

    if (post.story) formatted += `\n\n${post.story}`;
    if (post.value) formatted += `\n\n${post.value}`;

    if (post.quote) formatted += `\n\n"${post.quote}"`;
    if (post.stat) formatted += `\n\n📊 ${post.stat}`;

    if (post.list && post.list.length > 0) {
      formatted += '\n\n' + post.list.map((item: string) => `• ${item}`).join('\n');
    }

    if (post.cta) formatted += `\n\n${post.cta}`;

    if (post.hashtags && post.hashtags.length > 0) {
      formatted += `\n\n${post.hashtags.join(' ')}`;
    }

    return formatted;
  };

  const copyPost = (post: PostContent) => {
    const formatted = formatPostForCopy(post);
    navigator.clipboard.writeText(formatted);
    toast.success("Post copied to clipboard!");
  };

  const saveDraft = (post: PostContent) => {
    setDrafts([...drafts, { ...post, savedAt: new Date().toISOString(), id: Date.now() }]);
    toast.success("Draft saved to session storage!");
    setActiveTab("drafts");
  };

  const deleteDraft = (id: number) => {
    setDrafts(drafts.filter(draft => draft.id !== id));
    toast.success("Draft deleted!");
  };

  const clearAllDrafts = () => {
    setDrafts([]);
    sessionStorage.removeItem('linkedinDrafts');
    toast.success("All drafts cleared!");
  };

  const loadDraftToGenerated = (draft: PostContent) => {
    setPosts([...posts, draft]);
    setActiveTab("generated");
    toast.success("Draft loaded to generated posts!");
  };

  const startEditing = (idx: number) => {
    setEditingPost(idx);
    setEditedContent({ ...posts[idx] });
  };

  const saveEdit = () => {
    if (editingPost === null) return;
    const newPosts = [...posts];
    newPosts[editingPost] = editedContent as PostContent;
    setPosts(newPosts);
    setEditingPost(null);
    setEditedContent(null);
    toast.success("Post updated!");
  };

  const cancelEdit = () => {
    setEditingPost(null);
    setEditedContent(null);
  };

  const regeneratePost = async (idx: number, tone: string) => {
    if (!input.trim()) return;
    setRegeneratingPost(idx);
    setError(null);

    try {
      const res = await fetch("/api/generate-posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input, tones: [tone] }),
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const data = await res.json();
      const rawPosts = Array.isArray(data.posts) ? data.posts : [];

      if (rawPosts.length > 0) {
        const clean = rawPosts[0].replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(clean);

        if (parsed.post) {
          const newPosts = [...posts];
          newPosts[idx] = parsed.post;
          setPosts(newPosts);
          toast.success("Post regenerated!");
        }
      }
    } catch (error) {
      console.error("Error regenerating post", error);
      setError("Failed to regenerate post. Please try again.");
      toast.error("Failed to regenerate post");
    } finally {
      setRegeneratingPost(null);
    }
  };

  async function generatePosts() {
    if (!input.trim() || tones.length === 0) {
      toast.error("Please enter text and select at least one tone");
      return;
    }

    setLoading(true);
    setPosts([]);
    setError(null);

    try {
      const res = await fetch("/api/generate-posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input, tones }),
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const data = await res.json();
      const rawPosts = Array.isArray(data.posts) ? data.posts : [];
      const formattedPosts: PostContent[] = [];

      rawPosts.forEach((p: string) => {
        try {
          const clean = p.replace(/```json|```/g, "").trim();
          const parsed = JSON.parse(clean);

          if (parsed.post) {
            formattedPosts.push(parsed.post);
          }
        } catch (err) {
          console.error("Parse error:", err);
        }
      });

      if (formattedPosts.length === 0) {
        throw new Error("No valid posts generated");
      }

      setPosts(formattedPosts);
      toast.success(`Generated ${formattedPosts.length} post${formattedPosts.length > 1 ? 's' : ''}!`);
    } catch (error) {
      console.error("Error generating posts", error);
      setError("Failed to generate posts. Please try again.");
      toast.error("Failed to generate posts");
    } finally {
      setLoading(false);
    }
  }

  const charCount = input.length;
  const isNearLimit = charCount > MAX_LINKEDIN_CHARS * 0.8;
  const isOverLimit = charCount > MAX_LINKEDIN_CHARS;

  return (
    <div className="max-w-7xl mx-auto p-6">
      {showCookieBanner && (
        <Card className="fixed bottom-0 inset-x-0 border-t m-4 py-4 px-8 shadow-md z-50">
          <div className="flex items-center justify-between gap-2">
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
                  <Button size="sm" variant="ghost" onClick={() => { setInput(''); setPosts([]); setTones([]); setError(null); }}>
                    Clear All
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
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="source">Source (paste text or article link)</Label>
              <span className={`text-xs ${isOverLimit ? 'text-red-600 font-semibold' : isNearLimit ? 'text-orange-600' : 'text-muted-foreground'}`}>
                {charCount} / {MAX_LINKEDIN_CHARS} characters
              </span>
            </div>
            <Textarea
              id="source"
              className={`mt-2 ${isOverLimit ? 'border-red-500' : ''}`}
              rows={6}
              placeholder="Share an idea, short article, or bullet points."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            {isOverLimit && (
              <p className="text-xs text-red-600 mt-1">Content exceeds LinkedIn&apos;s character limit</p>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Label>Select Tone(s)</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    Select up to 2 tones to generate different variations of your post
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
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
                          key={tone.value}
                          onSelect={() => toggleTone(tone.value)}
                          className="cursor-pointer flex-col items-start"
                        >
                          <div className="flex items-center gap-2 w-full">
                            <span>{tones.includes(tone.value) ? "✅" : "➕"}</span>
                            <span className="font-medium">{tone.label}</span>
                          </div>
                          <span className="text-xs text-muted-foreground ml-6">{tone.description}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                    <div className="p-2 border-t">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Custom tone..."
                          value={customTone}
                          onChange={(e) => setCustomTone(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && addCustomTone()}
                        />
                        <Button size="sm" onClick={addCustomTone}>Add</Button>
                      </div>
                    </div>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex justify-end gap-2">
            {drafts.length > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge
                      variant="outline"
                      className="cursor-pointer hover:bg-accent"
                      onClick={() => setActiveTab("drafts")}
                    >
                      <FileText className="h-3 w-3 mr-1" />
                      {drafts.length} draft{drafts.length > 1 ? 's' : ''}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <p className="font-semibold mb-1">⚠️ Session Storage</p>
                    <p className="text-xs">Drafts are stored in your browser&apos;s session storage. They will be cleared when you close this tab or browser window.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button disabled={loading || tones.length === 0 || !input.trim() || isOverLimit}>
                  {loading ? "Generating..." : "Generate Posts"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Generate LinkedIn Posts?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will create {tones.length} post{tones.length > 1 ? 's' : ''} using AI based on your input and selected tones.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={generatePosts}>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="generated">
                Generated Posts ({posts.length})
              </TabsTrigger>
              <TabsTrigger value="drafts">
                Drafts ({drafts.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="generated" className="mt-4">
              {posts.length === 0 ? (
                <div className="text-sm text-muted-foreground text-center py-8">
                  No posts yet — enter text, choose tones, and click Generate.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {posts.map((post, idx) => (
                    <article key={idx} className="border rounded-xl p-4 space-y-3 relative">
                      {regeneratingPost === idx && (
                        <div className="absolute inset-0 bg-background/80 rounded-xl flex items-center justify-center z-10">
                          <RefreshCw className="h-6 w-6 animate-spin" />
                        </div>
                      )}

                      {editingPost === idx ? (
                        <div className="space-y-3">
                          <div className="flex justify-between items-start gap-2">
                            <Textarea
                              value={editedContent?.hook || ''}
                              onChange={(e) => setEditedContent({ ...editedContent!, hook: e.target.value })}
                              className="font-bold text-xl"
                              rows={2}
                            />
                            <div className="flex gap-1">
                              <Button size="sm" variant="outline" onClick={saveEdit}>
                                <Save className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={cancelEdit}>
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <Textarea
                            value={editedContent?.story || ''}
                            onChange={(e) => setEditedContent({ ...editedContent!, story: e.target.value })}
                            rows={4}
                          />
                          {editedContent?.value && (
                            <Textarea
                              value={editedContent.value}
                              onChange={(e) => setEditedContent({ ...editedContent, value: e.target.value })}
                              rows={2}
                            />
                          )}
                        </div>
                      ) : (
                        <>
                          <div className="flex justify-between gap-2">
                            <h3 className="font-bold text-xl">{post.hook}</h3>
                            <div className="flex gap-1 shrink-0">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button size="sm" variant="outline" onClick={() => startEditing(idx)}>
                                      <Edit2 className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent side="bottom">Edit post</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button size="sm" variant="outline" onClick={() => regeneratePost(idx, tones[idx] || tones[0])}>
                                      <RefreshCw className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent side="bottom">Regenerate post</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button size="sm" variant="outline" onClick={() => copyPost(post)}>
                                      <Copy className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent side="bottom">Copy to clipboard</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </div>

                          <p className="text-sm whitespace-pre-wrap">{post.story}</p>
                          {post.value && <p className="text-sm font-medium whitespace-pre-wrap">{post.value}</p>}

                          {post.quote && (
                            <blockquote className="italic border-l-4 pl-3 text-gray-600">
                              &ldquo;{post.quote}&rdquo;
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

                          <div className="flex flex-wrap gap-2 mt-2 text-xs text-blue-600">
                            {post.hashtags?.map((tag: string, i: number) => (
                              <span key={i}>{tag}</span>
                            ))}
                          </div>

                          <div className="pt-2 border-t">
                            <Button size="sm" variant="ghost" className="w-full" onClick={() => saveDraft(post)}>
                              Save as Draft
                            </Button>
                          </div>
                        </>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="drafts" className="mt-4">
              {drafts.length === 0 ? (
                <div className="text-sm text-muted-foreground text-center py-8">
                  No drafts saved yet. Generate posts and click &ldquo;Save as Draft&rdquo; to save them here.
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <Info className="h-4 w-4 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">
                        Drafts are stored in session storage and will be cleared when you close this tab
                      </p>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="h-4 w-4 mr-1" />
                          Clear All
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Clear all drafts?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete all {drafts.length} saved draft{drafts.length > 1 ? 's' : ''}. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={clearAllDrafts}>Delete All</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {drafts.map((draft, idx) => (
                      <article key={draft.id || idx} className="border rounded-xl p-4 space-y-3 bg-muted/30">
                        <div className="flex justify-between gap-2">
                          <h3 className="font-bold text-xl">{draft.hook}</h3>
                          <div className="flex gap-1 shrink-0">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button size="sm" variant="outline" onClick={() => loadDraftToGenerated(draft)}>
                                    <RefreshCw className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="bottom">Load to generated</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button size="sm" variant="outline" onClick={() => copyPost(draft)}>
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="bottom">Copy to clipboard</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button size="sm" variant="destructive" onClick={() => deleteDraft(draft.id!)}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="bottom">Delete draft</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>

                        <p className="text-sm whitespace-pre-wrap">{draft.story}</p>
                        {draft.value && <p className="text-sm font-medium whitespace-pre-wrap">{draft.value}</p>}

                        {draft.quote && (
                          <blockquote className="italic border-l-4 pl-3 text-gray-600">
                            &ldquo;{draft.quote}&rdquo;
                          </blockquote>
                        )}

                        {draft.stat && (
                          <p className="text-sm text-blue-700 font-semibold">
                            📊 {draft.stat}
                          </p>
                        )}

                        {draft.list && draft.list.length > 0 && (
                          <ul className="list-disc pl-5 text-sm space-y-1">
                            {draft.list.map((tip: string, i: number) => (
                              <li key={i}>{tip}</li>
                            ))}
                          </ul>
                        )}

                        {draft.cta && (
                          <p className="mt-2 font-semibold text-sm">{draft.cta}</p>
                        )}

                        <div className="flex flex-wrap gap-2 mt-2 text-xs text-blue-600">
                          {draft.hashtags?.map((tag: string, i: number) => (
                            <span key={i}>{tag}</span>
                          ))}
                        </div>

                        <div className="pt-2 border-t text-xs text-muted-foreground">
                          Saved: {draft.savedAt ? new Date(draft.savedAt).toLocaleString() : 'Unknown'}
                        </div>
                      </article>
                    ))}
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter>
          <div className="text-xs text-muted-foreground">Built with Gemini · ShadCN UI · Next.js</div>
        </CardFooter>
      </Card>
    </div>
  );
}