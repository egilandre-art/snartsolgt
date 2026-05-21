import { headers } from "next/headers";
import { Webhook } from "svix";
import { db } from "@/lib/db";
import type { Rolle } from "@prisma/client";

export async function POST(req: Request) {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return new Response("Webhook secret mangler", { status: 500 });
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Mangler svix headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(webhookSecret);
  let evt: { type: string; data: Record<string, unknown> };

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as typeof evt;
  } catch {
    return new Response("Ugyldig webhook-signatur", { status: 400 });
  }

  if (evt.type === "user.created" || evt.type === "user.updated") {
    const data = evt.data;
    const clerkId = data.id as string;
    const emails = data.email_addresses as Array<{ email_address: string; id: string }>;
    const primaryEmailId = data.primary_email_address_id as string;
    const primaryEmail = emails.find((e) => e.id === primaryEmailId)?.email_address ?? emails[0]?.email_address ?? "";
    const metadata = data.public_metadata as Record<string, unknown>;
    const rolle = (metadata?.rolle as Rolle) ?? "BOLIGEIER";

    await db.bruker.upsert({
      where: { clerkId },
      update: {
        email: primaryEmail,
        fornavn: (data.first_name as string) ?? "",
        etternavn: (data.last_name as string) ?? "",
        rolle,
      },
      create: {
        clerkId,
        email: primaryEmail,
        fornavn: (data.first_name as string) ?? "",
        etternavn: (data.last_name as string) ?? "",
        rolle,
      },
    });
  }

  return new Response("OK", { status: 200 });
}
