import { NextRequest, NextResponse } from "next/server"

/**
 * Searches TCG APIs for card auto-complete.
 * Returns card name, type, image URL, price, rarity, set — ready to fill the form.
 */
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")
  if (!q || q.length < 2) return NextResponse.json([])

  const results: CardSuggestion[] = []

  try {
    // Search One Piece (optcgapi.com)
    const opRes = await fetch(`https://optcgapi.com/api/sets/filtered/?card_name=${encodeURIComponent(q)}`)
    if (opRes.ok) {
      const opCards = await opRes.json()
      for (const c of (Array.isArray(opCards) ? opCards : []).slice(0, 10)) {
        results.push({
          id: c.card_set_id,
          name: c.card_name,
          type: mapOnePieceType(c.card_type),
          imageUrl: c.card_image || "",
          rarity: c.rarity,
          set: c.set_name,
          price: c.market_price || c.inventory_price || null,
          tcg: "One Piece",
          categorySlug: "singles",
        })
      }
    }
  } catch {}

  try {
    // Search Pokemon (TCGdex.io)
    const pkRes = await fetch(`https://api.tcgdex.net/v2/en/cards?name=${encodeURIComponent(q)}`)
    if (pkRes.ok) {
      const pkCards = await pkRes.json()
      for (const c of (Array.isArray(pkCards) ? pkCards : []).slice(0, 10)) {
        if (!c.image) continue
        results.push({
          id: c.id,
          name: c.name,
          type: mapPokemonType(c),
          imageUrl: `${c.image}/high.png`,
          rarity: c.rarity || "",
          set: c.set?.name || "",
          price: c.pricing?.cardmarket?.avg || c.pricing?.tcgplayer?.normal?.marketPrice || null,
          tcg: "Pokémon",
          categorySlug: "pokemon-singles",
        })
      }
    }
  } catch {}

  return NextResponse.json(results)
}

type CardSuggestion = {
  id: string; name: string; type: string; imageUrl: string
  rarity: string; set: string; price: number | null; tcg: string; categorySlug: string
}

function mapOnePieceType(ct: string): string {
  if (ct?.includes("Leader")) return "SINGLE"
  if (ct?.includes("Character")) return "SINGLE"
  if (ct?.includes("Event")) return "SINGLE"
  if (ct?.includes("Stage")) return "SINGLE"
  return "SINGLE"
}

function mapPokemonType(c: { category?: string; supertype?: string }): string {
  if (c.supertype === "Pokémon") return "SINGLE"
  if (c.supertype === "Trainer") return "SINGLE"
  if (c.supertype === "Energy") return "SINGLE"
  return "SINGLE"
}
