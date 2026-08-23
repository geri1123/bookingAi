import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma-client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// ============================================================================
// BAZA E LLOGARITJES SE KOSTOS (gusht 2026, Claude Sonnet 5, $2/$10 per MTok)
// ============================================================================
// 1 shkembim mesazhi (input ~2000 token: system prompt + tools + histori,
// output ~300 token + buffer per runde tool-use):
//   input:  2000/1_000_000 * $2  = $0.004
//   output:  300/1_000_000 * $10 = $0.003
//   + buffer per tool-use rounds (deri 4 runde, MAX_TOOL_ROUNDS)
//   ≈ $0.02 per mesazh (vlerësim KONSERVATOR, per siguri)
//
// Kur te kesh tracking real te token-ave (usage.input_tokens/output_tokens
// nga Anthropic API), zevendeso keto limite me vlera te bazuara ne koston
// REALE mesatare per biznes, jo ne vleresim.
// ============================================================================

const COST_PER_MESSAGE_USD = 0.02; // vleresim konservator, rishiko kur te kesh te dhena reale

interface PlanSeed {
  tier: "FREE" | "STARTER" | "PRO" | "PRO_PLUS";
  name: string;
  priceCents: number;
  messageLimit: number | null;
  durationDays: number;
}

const PLANS: PlanSeed[] = [
  {
    // Kosto max AI: 20 * $0.02 = $0.40/muaj per user falas — kosto acceptable
    // acquisition (CAC), s'te fut ne humbje edhe nese s'konverton kurre.
    tier: "FREE",
    name: "Falas",
    priceCents: 0,
    messageLimit: 20,
    durationDays: 30,
  },
  {
    // Kosto max AI: 400 * $0.02 = $8. Te ardhura $19 -> marzh ~$11 (58%).
    tier: "STARTER",
    name: "Starter",
    priceCents: 1900,
    messageLimit: 400,
    durationDays: 30,
  },
  {
    // Kosto max AI: 1000 * $0.02 = $20. Te ardhura $49 -> marzh ~$29 (59%).
    // QELLIMISHT jo "pakufi" (null) — nje plan pa limit real eshte rrezik
    // financiar: 1 biznes qe dergon 5000 mesazhe/muaj te fut ne humbje ne
    // vend te fitimit. Nese nje klient PRO ka nevoje per me shume, rrit
    // limitin manualisht per te (update direkt ne DB) ose shto nje tier
    // te ri (p.sh. "PRO_PLUS") ne vend qe ta besh kete plan pakufi.
    tier: "PRO",
    name: "Pro",
    priceCents: 4900,
    messageLimit: 1000,
    durationDays: 30,
  },
   {
    // Kosto max AI: 5000 * $0.02 = $100. Te ardhura $149 -> marzh ~$49 (33%).
    // Marzh me i vogel se STARTER/PRO (58-59%) me qellim - eshte tier "zbritje
    // volumi" per bizneset me trafik te larte, jo per fitim maksimal per
    // mesazh. Rishiko COST_PER_MESSAGE_USD periodikisht me te dhena reale.
    tier: "PRO_PLUS",
    name: "Pro+",
    priceCents: 14900,
    messageLimit: 5000,
    durationDays: 30,
  },
];

async function main() {
  console.log("Seeding plans...\n");

  for (const plan of PLANS) {
    const maxCostUsd = plan.messageLimit ? (plan.messageLimit * COST_PER_MESSAGE_USD).toFixed(2) : "E PAKUFIZUAR";
    const revenueUsd = (plan.priceCents / 100).toFixed(2);

    await prisma.plan.upsert({
      where: { tier: plan.tier },
      update: {
        name: plan.name,
        priceCents: plan.priceCents,
        messageLimit: plan.messageLimit,
        durationDays: plan.durationDays,
      },
      create: plan,
    });

    console.log(
      `✓ ${plan.tier.padEnd(8)} $${revenueUsd}/muaj  |  limit=${plan.messageLimit ?? "pakufi"}  |  kosto max AI≈$${maxCostUsd}`,
    );
  }

  console.log("\nSeed u krye.");
}

main()
  .catch((err) => {
    console.error("Seed deshtoi:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });