/* ============================================================
   NEXIS GAMES — GAME REGISTRY  (editable plaintext)
   --------------------------------------------------------
   Add / fix games by editing this file. Each entry:
     id           - unique slug (used in URL hash)
     title        - display name
     developer    - credit
     src          - path to the game HTML (relative) or full URL
     theme        - tailwind 'from-X to-Y' gradient
     tags         - array of category strings
     isBeta       - optional, marks game as Beta
     isPublicBeta - optional, marks game as Public Beta
     isMOFUOnly   - optional, only visible to MOFU admins
   --------------------------------------------------------
   Drop game files into  /games/<YourGame>.html
   ============================================================ */
window.__NEXIS_GAMES__ = [
      { id: 'burger-chef', title: 'Burger Chef', developer: 'Mofawo', src: 'games/Burger.html', theme: 'from-amber-600 to-orange-900', tags: ['Cooking', 'Action'] },
      { id: 'beauty-and-the-cheese', title: 'Beauty and the Cheese', developer: 'Jam', src: 'games/Che.html', theme: 'from-yellow-500 to-amber-700', tags: ['Adventure', 'Arcade'] },
      { id: 'g-switch-3', title: 'G-Switch 3', developer: 'Serius Games', src: 'https://gswitch.io/g-switch-3.embed', theme: 'from-blue-700 to-indigo-950', tags: ['Action', 'Arcade'] },
      { id: 'architects-curse', title: "THE ARCHITECT'S CURSE", developer: 'CoolDude_10', src: 'games/Arch.html', theme: 'from-teal-900 to-black', tags: ['Spooky', 'Adventure'], isPublicBeta: true },
      { id: 'casual-blackjack', title: 'Casual Blackjack', developer: 'DUMBGUY0.π', src: 'games/Black.html', theme: 'from-green-800 to-emerald-950', tags: ['Arcade', 'Table'] },
      { id: 'polybit-destruction', title: 'PolyBit Destruction', developer: 'Jam', src: 'games/Poly.html', theme: 'from-fuchsia-700 to-purple-950', tags: ['Action', 'Arcade'] },
      { id: 'scary-maze', title: 'Scary Maze', developer: 'Mofawo', src: 'games/Maze.html', theme: 'from-red-950 to-black', tags: ['Spooky', 'Action'] },
      { id: 'the-spooky-maze', title: 'The Spooky Maze', developer: 'Unknown', src: 'games/Spok.html', theme: 'from-indigo-900 to-black', tags: ['Spooky', 'Adventure'] },
      { id: 'vbrawl', title: 'VBrawl Ultimate', developer: 'Mofawo', src: 'games/Brawl.html', theme: 'from-orange-600 to-rose-700', tags: ['3D', 'Action', 'Multiplayer'] },
      { id: 'horrow', title: 'Shadows of the Labyrinth', developer: 'Mofawo', src: 'games/Horror.html', theme: 'from-violet-900 to-black', tags: ['Spooky', 'Adventure'] },
      { id: 'shaddocraft', title: 'Cube Game', developer: 'shaddo24mc', src: 'https://shaddo24mc.github.io/3d-releases/', theme: 'from-emerald-700 to-green-900', tags: ['3D', 'Adventure'], isPublicBeta: true },
      { id: 'ascension-realm', title: 'Ascension: Realm of Shards', developer: 'Nexis GD', src: 'games/Realm.html', theme: 'from-sky-500 to-blue-800', tags: ['RPG', 'Adventure', '3D'], isBeta: true },
      
      // 5 Secret MOFU Placeholder Games
      { id: 'mofu-sec-1', title: 'Project Titan', developer: 'MOFU', src: 'about:blank', theme: 'from-slate-800 to-black', tags: ['Secret', 'Test'], isMOFUOnly: true },
      { id: 'mofu-sec-2', title: 'Admin Sandbox', developer: 'MOFU', src: 'about:blank', theme: 'from-rose-900 to-black', tags: ['Admin', 'Sandbox'], isMOFUOnly: true },
      { id: 'mofu-sec-3', title: 'Netcode v2.0', developer: 'MOFU', src: 'about:blank', theme: 'from-indigo-900 to-black', tags: ['Test', 'Multiplayer'], isMOFUOnly: true },
      { id: 'mofu-sec-4', title: 'Physics Engine', developer: 'MOFU', src: 'about:blank', theme: 'from-emerald-900 to-black', tags: ['Test', '3D'], isMOFUOnly: true },
      { id: 'mofu-sec-5', title: 'Database Sync', developer: 'MOFU', src: 'about:blank', theme: 'from-fuchsia-900 to-black', tags: ['Secret', 'Admin'], isMOFUOnly: true }
];
