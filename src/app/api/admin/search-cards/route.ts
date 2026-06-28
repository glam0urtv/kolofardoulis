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

  // Search Pokemon sealed products (booster boxes, ETBs) — pokemontcg.io, FREE
  try {
    const pkSealed = await fetch(`https://api.pokemontcg.io/v2/sealed?q=name:${encodeURIComponent(q)}&pageSize=5`)
    if (pkSealed.ok) {
      const pkData = await pkSealed.json()
      for (const s of (pkData.data || []).slice(0, 5)) {
        const isBooster = s.type?.toLowerCase().includes("booster")
        const isETB = s.type?.toLowerCase().includes("elite trainer")
        if (!isBooster && !isETB) continue
        results.push({
          id: s.id,
          name: s.name,
          type: isETB ? "BOOSTER_BOX" : "BOOSTER_BOX",
          imageUrl: s.images?.large || s.images?.small || "",
          rarity: s.type || "",
          set: s.set?.name || "",
          price: s.tcgplayer?.prices?.normal?.market || null,
          tcg: "Pokémon",
          categorySlug: isETB ? "pokemon-etb" : "pokemon-booster-boxes",
        })
      }
    }
  } catch {}

  // Search Riftbound from public Scrydex CDN (images only, no search API)
  // Use known card IDs for Riftbound Origins set
  if (q.length >= 2) {
    const riftCards = [
      { id: "OGN-001", name: "Ahri", type: "SINGLE", rarity: "Champion", set: "Origins" },
      { id: "OGN-014", name: "Jinx", type: "SINGLE", rarity: "Champion", set: "Origins" },
      { id: "OGN-027", name: "Lee Sin", type: "SINGLE", rarity: "Champion", set: "Origins" },
      { id: "OGN-052", name: "Yasuo", type: "SINGLE", rarity: "Champion", set: "Origins" },
      { id: "OGN-078", name: "Viktor", type: "SINGLE", rarity: "Champion", set: "Origins" },
      { id: "OGN-103", name: "Darius", type: "SINGLE", rarity: "Champion", set: "Origins" },
      { id: "OGN-145", name: "Volibear", type: "SINGLE", rarity: "Champion", set: "Origins" },
      { id: "OGN-200", name: "Baron Nashor", type: "SINGLE", rarity: "Epic", set: "Origins" },
      { id: "OGN-296", name: "Void Gate", type: "SINGLE", rarity: "Rare", set: "Origins" },
      { id: "OGN-310", name: "Rift Herald", type: "SINGLE", rarity: "Uncommon", set: "Origins" },
    ]
    for (const rc of riftCards) {
      if (rc.name.toLowerCase().includes(q.toLowerCase())) {
        results.push({
          id: rc.id,
          name: rc.name,
          type: rc.type,
          imageUrl: `https://images.scrydex.com/riftbound/${rc.id}/large`,
          rarity: rc.rarity,
          set: rc.set,
          price: null,
          tcg: "Riftbound",
          categorySlug: "riftbound-singles",
        })
      }
    }
  }

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
