# ab-project-template

A template for setting up generative art projects.

## Quick Start

To create a new repository from this template, use the GitHub CLI:

```sh
gh repo create myrepo --template someuser/sometemplate
```

## Dev
Use Live Server Plugin for vscode to view index-dev.html

## Structure of a Generative Art Project

This template is organized to help set up a generative art project with efficiency and organization. Here's how it's structured:

- **Random Script**: Create randomization functions or scripts that can be used throughout the project.
  
- **Global Constants/Functions**: Define constants and functions that are going to be used globally in the project.
  
- **Feature Script**: The main script to generate the visual features of your art.
  
- **Assets/Libraries**: Store the assets (like images, fonts) and libraries that are going to be used in the project.
  
- **Setup**: Initialize canvas size, handle resizing, and set up your canvas.
  
- **Draw**: Main drawing functions to render your art.

## Directory Structure

```plaintext
.
├── README.md
├── Artblocks.js
├── index-build.html
├── index-dev.html
├── p5.sound.min.js
├── p5.min.js
├── package.json
├── build/
│   ├── Feature.js
│   ├── Feature.min.js
│   ├── Sketch.js
│   ├── Sketch.min.js
│   ├── Sketch.min.part1.js
│   ├── Sketch.min.part2.js
│   ├── Sketch.min.part3.js
├── scripts/
│   ├── 1-Random.js
│   ├── 2.1-Global-Constants.js
│   ├── 2.2-Global-Functions.js
│   ├── 3-Feature.js
│   ├── 4-Assets.js
│   ├── 5-Preload.js
│   ├── 6-Setup.js
│   ├── 7-Draw.js
├── utils/
│   ├── build.js
```

### Root Directory

- `Artblocks.js`: (Description of the file purpose).
- `index-build.html`: The production HTML file.
- `index-dev.html`: The development HTML file used for testing.
- `p5.sound.min.js`: Sound library used in the project.
- `p5.min.js`: The p5.js library, used for drawing and creating the visual elements.

### Build Directory

This directory contains the production-ready scripts.

### Scripts Directory

Contains various scripts that makeup the project:

- `1-Random.js`: Randomization related scripts/functions.
- `2.1-Global-Constants.js`: Globally accessible constants.
- `2.2-Global-Functions.js`: Globally accessible functions.
- `3-Feature.js`: Script for generating visual features.
- `4-Assets.js`: Script to load assets.
- `5-Preload.js`: Preload script for asynchronous loading.
- `6-Setup.js`: Contains setup related functions (e.g., Canvas setup).
- `7-Draw.js`: The script that contains the main drawing functions.

### Utils Directory

Contains utility scripts, such as build scripts.

## Contributing

Instructions for contributing to this project, if applicable.

## License

Information about the license, if applicable.
```

This refined README.md file provides a more structured and detailed overview of the contents and structure of the repository. It would be helpful to also add descriptions for specific files or folders if necessary.