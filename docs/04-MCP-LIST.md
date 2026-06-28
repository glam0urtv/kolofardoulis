# 04 — MCP Servers (ονομαστική λίστα)

> Μόνο ονόματα + λόγος χρήσης. Η σύνδεση/εγκατάσταση γίνεται από το Claude
> Code CLI όταν φτάσει η ώρα — δεν χρειάζεται να κάνεις τίποτα τώρα.

| MCP | Γιατί το χρειαζόμαστε |
|---|---|
| **Supabase MCP** | Schema/migrations, queries, Auth & Storage config, Realtime channels — απευθείας από το Claude Code |
| **GitHub MCP** | Repo, commits, pull requests, issues, version control του project |
| **Stripe MCP** | Δημιουργία products/prices, ρύθμιση & δοκιμή webhooks, test payments |
| **Playwright MCP** | E2E δοκιμές, οπτικός έλεγχος animations, simulations ταυτόχρονων αγορών (oversell tests) |
| **Vercel MCP** | Deploy, environment variables, preview deployments |
| **Sentry MCP** | Σύνδεση error monitoring, έλεγχος σφαλμάτων μετά το deploy |
| **Filesystem** (built-in) | Ανάγνωση/εγγραφή αρχείων του project — ήδη διαθέσιμο, καμία ενέργεια |
| **Web Search / Fetch** (built-in) | Έρευνα τεκμηρίωσης (π.χ. Stripe/Supabase API docs) όταν χρειάζεται — ήδη διαθέσιμο |

Καμία άλλη MCP δεν χρειάζεται για το αρχικό όραμα. Αν προστεθεί ανάγκη
(π.χ. αποστολή SMS, λογιστικό πρόγραμμα) θα προστεθεί εδώ πριν συνδεθεί.
