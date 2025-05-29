
# Rock-Paper-Scissors Game

A blockchain-enabled Rock-Paper-Scissors game built with Cocos Creator.

## Overview

This project is a multiplayer Rock-Paper-Scissors game that integrates with blockchain technology. Players can compete against each other using rock, paper, or scissors choices while their game data is secured on the blockchain.

## Features

- Player vs Player gameplay
- Blockchain integration using Cardano (tADA)
- User profiles with avatars and wallet addresses
- Game lobby system
- Interactive UI with animations

## Technology Stack

- **Game Engine**: Cocos Creator 3.8.6
- **Programming Language**: TypeScript
- **Blockchain**: Cardano (via @meshsdk/core)
- **Networking**: Socket.IO for real-time communication
- **Additional Libraries**:
  - axios for HTTP requests
  - bcryptjs for encryption
  - js-sha256 for hashing
  - lodash-es for utility functions

## Project Structure

```
/
├── assets/                  # Game assets and code
│   ├── Scenes/              # Game scenes
│   │   ├── game-start.scene # Start screen
│   │   ├── game-lobby.scene # Lobby screen
│   │   └── game-play.scene  # Main gameplay screen
│   ├── Scripts/             # TypeScript code
│   │   ├── common/          # Shared utilities and types
│   │   │   ├── types/       # TypeScript type definitions
│   │   │   └── utils/       # Utility functions
│   │   └── core/            # Core game logic
│   │       ├── gameplay/    # Gameplay mechanics
│   │       └── prefabs/     # Reusable UI components
│   └── resources/           # Game resources
│       ├── Textures/        # Images and sprites
│       │   └── game-play/   # Gameplay-specific textures
│       └── Fonts/           # Custom fonts
├── settings/                # Cocos Creator settings
├── build-templates/         # Templates for building
│   └── web-mobile/         # Web mobile build template
├── preview-template/        # Preview templates
├── node_modules/            # NPM dependencies
├── package.json             # NPM package configuration
├── tsconfig.json            # TypeScript configuration
└── README.md                # Project documentation
```

## Getting Started

### Prerequisites

- Node.js
- Cocos Creator 3.8.6

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Open the project in Cocos Creator

### Running the Game

Use Cocos Creator's preview functionality to run the game locally.

## Game Flow

1. Start at the game start screen
2. Enter the game lobby
3. Join or create a game
4. Make your choice (rock, paper, or scissors)
5. View the results and play again

## License

[Include license information here]

