# 06 — 3D Environment & Animations UX

## Αρχές σχεδιασμού

1. **Καθοδηγούμενη, όχι ελεύθερη εμπειρία.** Ο χρήστης δεν "οδηγεί" κάμερα·
   το scroll/click κάνει σκηνοθετημένες κινήσεις (σαν trailer).
2. **Performance-first.** 3D φορτώνεται lazy, μόνο στα routes που το
   χρειάζονται· code-splitting ανά σκηνή.
3. **Graceful degradation.** Χωρίς WebGL ή σε `prefers-reduced-motion`/αδύναμη
   συσκευή → απλά CSS/2D animations, καμία απώλεια λειτουργίας.
4. **Σύντομο & skippable.** Τα purchase animations είναι ~2–4 δευτ., με
   δυνατότητα skip — δεν εμποδίζουν την ολοκλήρωση αγοράς.

## Σκηνές

### Hero / Αρχική (`ShowcaseScene`)

Στυλιζαρισμένη 3D βιτρίνα (ράφι, κουτιά, κάρτες σε φωτισμένο χώρο). Στο
scroll: GSAP ScrollTrigger μετακινεί κάμερα/φωτισμό, αποκαλύπτει sections
(Νέες Αφίξεις, Κατηγορίες) σαν σκηνές μιας μικρής ταινίας.

### Booster Box purchase (`BoosterBoxScene`)

1. Click "Αγόρασε" → full-screen overlay, 3D μοντέλο booster box.
2. Timeline (GSAP + R3F): καπάκι ανοίγει.
3. Τόσα packs όσα η επιλεγμένη ποσότητα "πετάγονται" έξω και τακτοποιούνται
   σε grid (οπτική επιβεβαίωση ποσότητας).
4. Μετάβαση (fade/scale) στο cart drawer.

### Single card purchase (`CardFlipScene`)

1. Click στην κάρτα → flip 180° (CSS 3D transform ή R3F plane, ό,τι δίνει
   καλύτερο αποτέλεσμα/απόδοση — απόφαση `frontend-3d-animator`).
2. Μικρό "settle" animation (η κάρτα πέφτει σε tray επιλεγμένων).
3. Μετάβαση στο cart/menu.

## Σχέση με την ασφάλεια αποθέματος

Η reservation του stock (βλ. `05-...md`) γίνεται **παράλληλα/πριν** ξεκινήσει
το animation, όχι μετά. Το animation ποτέ δεν είναι το σημείο που "κλειδώνει"
την αγορά — είναι αμιγώς οπτικό feedback. Έτσι, ακόμα κι αν κάποιος κλείσει
τη σελίδα στη μέση του animation, το reservation/timeout logic λειτουργεί
κανονικά.

## Mobile & accessibility

- Διακόπτης "Λιτή εμφάνιση" στα settings (αποθηκεύεται ανά browser).
- Αυτόματος σεβασμός `prefers-reduced-motion`.
- Στα μικρά οθόνη/χαμηλής ισχύος συσκευές: απλούστερη εκδοχή (λιγότερα
  polygons, χαμηλότερη ανάλυση textures, ή πλήρως 2D fallback).
- Subtitles/labels πάντα ορατά (τα animations δεν είναι το μόνο μέσο
  μετάδοσης πληροφορίας — π.χ. η ποσότητα φαίνεται και ως αριθμός, όχι μόνο
  ως πλήθος 3D αντικειμένων).
