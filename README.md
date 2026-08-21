# 🏎️ CANYON HIGHWAY SURFER 3D — Highway Heist Edition

<div align="center">

  ![BTT Game Jam 2026](https://img.shields.io/badge/BTT%20Web%20Game%20Jam-Summer%202026-ff0055?style=for-the-badge&logo=game-and-watch)
  ![Live Demo](https://img.shields.io/badge/LIVE%20DEMO-VERCEL%20DEPLOYED-00ff88?style=for-the-badge&logo=vercel&logoColor=black)
  ![Three.js](https://img.shields.io/badge/3D%20ENGINE-THREE.JS%20WebGL-00f3ff?style=for-the-badge&logo=three.js)
  ![Web Audio API](https://img.shields.io/badge/AUDIO-WEB%20AUDIO%20API-ffd700?style=for-the-badge)

  <br />

  ### 🌐 **[PLAY LIVE GAME HERE: https://game-hazel-psi-89.vercel.app/](https://game-hazel-psi-89.vercel.app/)** 🌐

  *An award-winning, high-speed 3D WebGL highway heist fugitive runner featuring 24K glowing gold bars, cash bundles, near-miss combo multipliers, GTA-style wanted level escalation, high-realism police interceptor SUVs, and dynamic wet asphalt rain mode.*

</div>

---

## 🏆 Game Overview & Story

In **Canyon Highway Surfer 3D**, you play as an **Escaped Inmate Fugitive** (`INMATE 9920`) sprinting down a mountain canyon highway in an iconic bright orange prison jumpsuit with dangling handcuffs! 

Pursued by a **Police Officer Pursuer** and **Police Interceptor SUVs**, your mission is to collect stolen **Dollar Cash Bundles ($100)** and **24K Gold Bullion Bars ($500)**, expand your **Cash Duffel Bag**, pull off high-risk **Near-Miss Dodges** to build up your **Score Multiplier**, jump heavy **Construction Barricades (`W`/`↑`)**, slide under **Toll Gates (`S`/`↓`)**, and survive an escalating **5-Star GTA-Style Wanted Level**!

---

## ✨ Standout Key Features

- 🏃 **Escaped Prisoner Fugitive Avatar**: Iconic bright orange prison jumpsuit (`INMATE 9920`) with black horizontal stripes, stamped inmate ID badge, dangling wrist handcuffs, dark beanie, and expanding cash duffel bag!
- ⚡ **Near-Miss Bonus & Combo Multipliers (`1x` to `4x`)**: Weave within inches of Police SUVs or Barricades to trigger instant `+$500 NEAR MISS!` bonuses, electric audio chimes, and camera impact shake!
- ⭐ **GTA-Style Wanted Level Escalation (⭐ to ⭐⭐⭐⭐⭐)**: Real-time Wanted Level star gauge that escalates police chase frequency and speed as your escape distance increases!
- 🧈 **24K Pure Glowing Gold Bullion Bars ($500)**: Emissive 24K gold shader material (`color: #ffcc00, emissive: #ffaa00`) glowing brightly on top of the flat asphalt road (`y = 0.15`)!
- 💵 **Dollar Cash Bundles ($100)**: Stolen cash stacks wrapped in paper bands that physically expand your runner's Cash Duffel Bag as you collect them!
- 🚓 **High-Realism Police SUVs & Armored Bank Vans**: Detailed 3D vehicle models featuring aerodynamic hoods, white door panels, chrome bumpers, tinted glass, rubber tires with silver rims, and flashing red/blue LED emergency lightbars!
- 🌧️ **Dynamic Wet Asphalt Rain Mode**: Click the Rain button (`🌧️`) in the HUD to toggle dynamic falling rain drops, wet asphalt road sheen, and glowing puddle reflections!
- ⚡ **Silky-Smooth 60 FPS Performance**: Bulletproof crash-safe audio engine and zero-allocation memory pooling for lag-free performance on desktop & mobile!

---

## 🎮 Controls & Input Mapping

| Action | Keyboard Input | Mobile Touch Controls |
| :--- | :--- | :--- |
| **Shift Left / Right** | `A` / `D` or `←` / `→` | ◀ / ▶ Touch Buttons |
| **Jump Over Barricades** | `W` or `↑` | JUMP Touch Button |
| **Slide Under Toll Gates** | `S` or `↓` | SLIDE Touch Button |

*Note: Spacebar is un-bound with page scroll prevention (`e.preventDefault()`). Key-repeat spam is blocked to guarantee 60 FPS smoothness.*

---

## 🛠️ Technology Stack & Architecture

- **Core Engine**: Three.js (r128) WebGL Renderer
- **Color Depth**: ACESFilmic Tone Mapping (`exposure: 1.15`) & Fog Density Shaders
- **Audio Synthesizer**: Procedural Web Audio API (Zero external MP3 audio file dependencies!)
- **Collision Physics**: Zero-allocation `THREE.Box3` bounding volume hierarchies
- **Deployment**: Vercel Static Hosting (`vercel.json` included)

---

## 🚀 Quick Start / Local Setup

```bash
# 1. Clone the repository
git clone https://github.com/RaghavParasher/game.git

# 2. Navigate into project directory
cd game

# 3. Serve static site locally using any web server
npx serve .
```

Open `http://localhost:3000` in any modern web browser to play!

---

<div align="center">
  <h3>🏆 Built for BTT Web Game Jam — Summer 2026 🏆</h3>
  <p>Live Deployment: <a href="https://game-hazel-psi-89.vercel.app/">https://game-hazel-psi-89.vercel.app/</a></p>
  <p>GitHub Repository: <a href="https://github.com/RaghavParasher/game">https://github.com/RaghavParasher/game</a></p>
</div>
