Portfolio Odyssey — Playable Portfolio
====================================
Controls: Arrows/WASD move • Space/Up jump • E interact • P pause • Gamepad OK • Mobile on-screen controls

Structure
- Title -> Hub (portal select) -> Level scenes (L1/L2/L3). Currently L1 is playable; L2/L3 are mapped.
- Settings: reduced motion, assist mode (double jump), music/SFX volumes (placeholders for now).
- Auto-save: level completion stored in localStorage.

Customize Me
- Add case-study links in LevelComplete panel (Level.js: levelComplete()).
- Adjust platform layout in makeMap() for each id.
- Add NPCs with dialogue + links in Level.js (tryInteract()).
- Drop real sprites into /assets and load via this.load.image() in preload().

Deploy
- Upload to your GitHub Pages repo root.
