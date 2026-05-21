import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `Du er en erfaren norsk eiendomsmegler og tekstforfatter som skriver boligannonser.
Skriv alltid på norsk bokmål. Vær entusiastisk men ærlig. Fokuser på boligens styrker.
Du returnerer alltid gyldig JSON.`;

const BeskrivelseSchema = z.object({
  kortBeskrivelse: z.string(),
  langBeskrivelse: z.string(),
  nabolagsBeskrivelse: z.string(),
});

export type Beskrivelse = z.infer<typeof BeskrivelseSchema>;

interface BoligData {
  gate: string;
  nummer: string;
  poststed: string;
  kommune: string;
  boligtype: string;
  bruksareal?: number | null;
  soverom?: number | null;
  antallRom?: number | null;
  byggeaar?: number | null;
  prisantydning?: number | null;
  fellesgjeld?: number | null;
  fellesutgifter?: number | null;
  bildeUrler?: string[];
}

export async function genererBeskrivelse(bolig: BoligData): Promise<Beskrivelse> {
  const prompt = `Generer en boligannonse for følgende bolig:

${JSON.stringify(bolig, null, 2)}

Returner et JSON-objekt med disse tre feltene:
- kortBeskrivelse: 2-3 setninger som oppsummerer boligen (brukes som ingress)
- langBeskrivelse: 300-500 ord som beskriver boligen i detalj (norsk annonse-stil)
- nabolagsBeskrivelse: 1 avsnitt om nabolaget, bydelen og beliggenheten basert på kommunen og poststedet

Svar KUN med gyldig JSON, ingen annen tekst.`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1500,
    system: [
      {
        type: "text",
        text: SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Ugyldig AI-respons");

  return BeskrivelseSchema.parse(JSON.parse(jsonMatch[0]));
}
