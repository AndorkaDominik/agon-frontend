# Athlete theme visual regression plan

## Application Overview

Vizuális regressziós tesztterv a regathlete@gmail.com sportolói felhasználó bejelentkezési, profil-téma mentési, oldalbejárási és újratöltés utáni témamegőrzési folyamatára. A teszt minden vizsgált oldalon a tests/helpers/visual.ts screenshotPage segédet használja, amely full-page screenshotot, a stabilizáló tests/theme-visual.css stílust és 20 pixeles diff-küszöböt alkalmaz.

## Test Scenarios

### 1. Athlete theme persistence and page coverage

**Seed:** `tests/seed.spec.ts`

#### 1.1. Pink theme persists and all athlete pages render consistently

**File:** `tests/visual/athlete-theme-flow.spec.ts`

**Steps:**
  1. Nyisd meg a /login oldalt friss böngészőállapottal.
    - expect: A bejelentkezési oldal stabilan betöltődik; a vizuális baseline előtt nincs runtime hiba vagy betöltési hiba.
  2. Töltsd ki az E-mail mezőt `regathlete@gmail.com` értékkel, a Jelszó mezőt `Asd123` értékkel, majd küldd el az űrlapot.
    - expect: A felhasználó sikeresen bejelentkezik sportolóként, és az `/athlete/dashboard` oldalra kerül.
    - expect: A dashboard fejléc és navigáció látható.
  3. A `tests/helpers/visual.ts` `screenshotPage` segédjével készíts baseline screenshotot a dashboardról `athlete-dashboard-default` néven.
    - expect: A screenshot teljes oldalas, a helperben definiált stabilizáló CSS-sel és diff-küszöbbel készül.
    - expect: A dashboard sportolói szintet jelző kártyája, az állatszint/level információ és a fejlődési elemek vizuálisan jelen vannak.
  4. Nyisd meg a Profile oldalt, és a megjelenés szekcióban válaszd a Pink (`aria-label="Pink"`) témát.
    - expect: A Pink választó kijelölt állapotba kerül.
    - expect: A felület akcentusszíne rózsaszínre vált.
    - expect: A mentési állapot sikeres mentést jelez, és nem jelenik meg hibaüzenet.
  5. Készíts screenshotot a profilról `athlete-profile-pink` néven a `screenshotPage` helperrel.
    - expect: A profil és a rózsaszín témaválasztó vizuálisan helyes.
  6. Töltsd újra a Profile oldalt, majd készíts `athlete-profile-pink-reloaded` screenshotot.
    - expect: A Pink választó újratöltés után is kijelölt.
    - expect: A profil teljes felülete rózsaszín témával jelenik meg.
    - expect: A screenshot nem tér el a jóváhagyott pink baseline-tól a helper küszöbén túl.
  7. A navigációval térj vissza az Athlete Dashboard oldalra, és készíts `athlete-dashboard-pink` screenshotot.
    - expect: A dashboard sportolói szintkártyája látható.
    - expect: A teljes oldal rózsaszín témát használ.
  8. Nyisd meg a New Workout oldalt, és készíts `athlete-new-workout-pink` screenshotot.
    - expect: A fejlődési mutatók kártyái láthatók.
    - expect: Az új edzés rögzítésére szolgáló űrlap, a Workout name, Notes és edzésvezérlők megjelennek.
    - expect: A teljes oldal rózsaszín témát használ.
  9. Nyisd meg a Plans oldalt, és készíts `athlete-plans-pink` screenshotot.
    - expect: A `Workout Plans` cím látható.
    - expect: Üres adathalmaz esetén a `No workout plans` üres állapot és tájékoztató szövege jelenik meg.
    - expect: A teljes oldal rózsaszín témát használ.
  10. Nyisd meg ismét a Profile oldalt, válaszd a Green (`aria-label="Green"`) témát, várd meg a mentés sikerét, majd töltsd újra az oldalt.
    - expect: A Green választó kijelölt állapotba kerül.
    - expect: A téma újratöltés után is zöld marad.
    - expect: Nem jelenik meg sikertelen mentésre vagy betöltési hibára utaló üzenet.
  11. Készíts `athlete-profile-green-reloaded` screenshotot a `screenshotPage` helperrel.
    - expect: A profil teljes felülete zöld témában jelenik meg.
  12. Látogasd meg egymás után az `/athlete/dashboard`, `/athlete/new-workout` és `/athlete/plans` oldalakat, és rendre készíts `athlete-dashboard-green`, `athlete-new-workout-green` és `athlete-plans-green` screenshotot.
    - expect: Mindhárom oldal zöld témával jelenik meg.
    - expect: A dashboard szintkártyája, a New Workout fejlődési mutatói és űrlapja, valamint a Plans üres állapota továbbra is látható és elrendezése stabil.
    - expect: A screenshotok csak a témaváltásból eredő, előre jóváhagyott vizuális különbséget tartalmazzák.
