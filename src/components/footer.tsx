export function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-white">
      <div className="mx-auto max-w-[1440px] px-4 py-10 md:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-sm font-bold text-stone-900">
              Kolofardoulis<span className="text-brand">.</span>gr
            </h3>
            <p className="mt-2 text-xs text-stone-500">
              Boutique κατάστημα trading card games. One Piece TCG, Pokémon,
              Magic & περισσότερα.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400">
              Εξυπηρέτηση
            </h4>
            <ul className="mt-3 space-y-2 text-sm text-stone-600">
              <li>Όροι Χρήσης</li>
              <li>Πολιτική Απορρήτου</li>
              <li>Επιστροφές</li>
              <li>Επικοινωνία</li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400">
              Κατηγορίες
            </h4>
            <ul className="mt-3 space-y-2 text-sm text-stone-600">
              <li>One Piece TCG</li>
              <li>Singles</li>
              <li>Booster Boxes</li>
              <li>Promo</li>
            </ul>
          </div>
        </div>
        <p className="mt-10 text-center text-xs text-stone-400">
          © {new Date().getFullYear()} Kolofardoulis.gr — Με την επιφύλαξη κάθε
          δικαιώματος.
        </p>
      </div>
    </footer>
  )
}
