import axios from "axios";

const LANGUAGE_TOOL_API = "https://api.languagetool.org/v2/check";

export type LTMatch = {
  message: string;
  shortMessage?: string;
  replacements: { value: string }[];
  offset: number;
  length: number;
  context: { text: string; offset: number; length: number };
  rule: { id: string; description: string; issueType: string };
};

export async function checkTextWithLT(text: string, language = "en-US") {
  if (!text.trim()) return [];

  const res = await axios.post(
    LANGUAGE_TOOL_API,
    new URLSearchParams({ text, language }),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );

  return res.data.matches as LTMatch[];
}
