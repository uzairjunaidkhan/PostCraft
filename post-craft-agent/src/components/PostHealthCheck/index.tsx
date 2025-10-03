"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { analyzeText, Suggestion } from "../../utils/Helpers";
import { CheckCircle2, AlertTriangle, Lightbulb, TrendingUp } from "lucide-react";


export default function PostHealthCheck({ text, context }: { text: string; context: "user" | "ai" }) {
  const suggestion: Suggestion = analyzeText(text, context);

  const getScoreColor = (score: number) => {
    if (score > 75) return "bg-green-600";
    if (score > 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getSentimentStyle = (label: string) => {
    if (label === "Positive") return "bg-green-100 text-green-700";
    if (label === "Negative") return "bg-red-100 text-red-700";
    if (label === "Mixed") return "bg-yellow-100 text-yellow-700";
    return "bg-gray-100 text-gray-700";
  };

  const getSuitabilityColor = (score: number) => {
    if (score > 75) return "text-green-600";
    if (score > 50) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Card className="w-full shadow-md rounded-2xl" >
      <CardHeader>
        <CardTitle className="text-lg font-semibold" > Post Health Check </CardTitle>
      </CardHeader>
      < CardContent className="space-y-4" >
        {/* Quality Score */}
        < div >
          <div className="flex justify-between mb-2" >
            <span className="font-medium" > Quality Score </span>
            < span className="text-sm font-semibold" > {suggestion.qualityScore} / 100 </span>
          </div>
          < Progress value={suggestion.qualityScore} className={`h-3 ${getScoreColor(suggestion.qualityScore)}`
          } />
        </div>

        < Separator />

        {/* Tones */}
        < div >
          <p className="font-medium mb-2" > Detected Tones </p>
          < div className="flex flex-wrap gap-2" >
            {
              suggestion.tones.map((tone, idx) => (
                <Badge key={idx} variant="outline" >
                  {tone.tone}({tone.confidence} %)
                </Badge>
              ))
            }
          </div>
        </div>

        < Separator />

        {/* Sentiment */}
        < div >
          <p className="font-medium mb-1" > Sentiment </p>
          < Badge className={`px-2 py-1 rounded-md ${getSentimentStyle(suggestion.sentiment.label)}`}>
            {suggestion.sentiment.label}({suggestion.sentiment.score} %)
          </Badge>
        </div>

        < Separator />

        {/* Improvements */}
        {
          suggestion.improvements.length > 0 && (
            <div>
              <p className="flex items-center gap-2 font-medium mb-2 text-blue-700" >
                <Lightbulb className="h-4 w-4" /> Improvements
              </p>
              < ul className="list-disc pl-6 text-sm space-y-1" >
                {
                  suggestion.improvements.map((imp, i) => (
                    <li key={i} > {imp} </li>
                  ))
                }
              </ul>
            </div>
          )
        }

        {/* Issues */}
        {
          suggestion.issues.length > 0 && (
            <div>
              <p className="flex items-center gap-2 font-medium mb-2 text-red-700" >
                <AlertTriangle className="h-4 w-4" /> Issues
              </p>
              < ul className="list-disc pl-6 text-sm space-y-1" >
                {
                  suggestion.issues.map((issue, i) => (
                    <li key={i} > {issue} </li>
                  ))
                }
              </ul>
            </div>
          )
        }

        <Separator />

        {/* Analytics */}
        <div>
          <p className="flex items-center gap-2 font-medium mb-2 text-gray-700" >
            <TrendingUp className="h-4 w-4" /> Analytics
          </p>
          < div className="grid grid-cols-2 gap-y-2 text-sm" >
            <span>Words: {suggestion.analytics.wordCount} </span>
            < span > Chars: {suggestion.analytics.characterCount} </span>
            < span > Hashtags: {suggestion.analytics.hashtagCount} </span>
            < span > Emojis: {suggestion.analytics.emojiCount} </span>
            < span > Mentions: {suggestion.analytics.mentionCount} </span>
            < span > Links: {suggestion.analytics.linkCount} </span>
            < span > Readability: {suggestion.analytics.readabilityScore} </span>
            < span > Read time: {suggestion.analytics.estimatedReadTime} </span>
          </div>
        </div>

        < Separator />

        {/* Platform Recommendations */}
        {
          suggestion.platformRecommendations &&
          suggestion.platformRecommendations.length > 0 && (
            <div>
              <p className="font-medium mb-2" > Platform Suitability </p>
              < div className="space-y-2" >
                {
                  suggestion.platformRecommendations.map((rec, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-sm border rounded-lg px-3 py-2"
                    >
                      <span className="font-medium" > {rec.platform} </span>
                      < span className={`font-semibold ${getSuitabilityColor(rec.suitability)}`} >
                        {rec.suitability} %
                      </span>
                    </div>
                  ))
                }
              </div>
            </div>
          )}
      </CardContent>
    </Card>
  );
}
