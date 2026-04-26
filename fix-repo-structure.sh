#!/bin/bash
# ═══════════════════════════════════════════════════════════
# Run this from inside your local momentum-compounder repo
# It moves every file into the correct Next.js folder structure
# ═══════════════════════════════════════════════════════════

echo "🔧 Restructuring repo for Next.js App Router..."

# Create the folder structure
mkdir -p app/api/scanner
mkdir -p lib
mkdir -p types
mkdir -p public

# Move files into correct locations
# ── App Router ──
mv page.tsx app/page.tsx 2>/dev/null
mv layout.tsx app/layout.tsx 2>/dev/null
mv globals.css app/globals.css 2>/dev/null
mv route.ts app/api/scanner/route.ts 2>/dev/null

# ── Libraries ──
mv finnhub.ts lib/finnhub.ts 2>/dev/null
mv scanner-engine.ts lib/scanner-engine.ts 2>/dev/null

# ── Types ──
mv scanner.ts types/scanner.ts 2>/dev/null

# ── Config files stay in root (already correct) ──
# package.json, tsconfig.json, tailwind.config.ts,
# postcss.config.js, next.config.mjs, vercel.json,
# next-env.d.ts, .gitignore, .eslintrc.json, .env.example

echo ""
echo "✅ Done! New structure:"
find . -type f -not -path './.git/*' -not -name '*.jsx' | sort
echo ""
echo "📌 Next steps:"
echo "   git add -A"
echo "   git commit -m 'fix: restructure into Next.js App Router folders'"
echo "   git push"
