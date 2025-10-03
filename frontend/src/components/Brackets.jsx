import React from "react";

// Import your SVG files
import Svg2 from "../assets/2.svg";
import Svg4 from "../assets/4.svg";
import Svg8 from "../assets/8.svg";
import Svg16 from "../assets/16.svg";
import Svg32 from "../assets/32.svg";

// Editable player cell component (reuse your existing one)
import EditablePlayerCell from "./EditablePlayerCell";

// Map bracket sizes to SVGs
const SVG_TEMPLATES = {
  2: Svg2,
  4: Svg4,
  8: Svg8,
  16: Svg16,
  32: Svg32,
};

// Player cell size
const CELL_WIDTH = 50;
const CELL_HEIGHT = 20;
const CELL_MARGIN_Y = 10;

// Function to generate coordinates dynamically
const generateCoordinates = (numPlayers) => {
  const bracketSize = Math.pow(2, Math.ceil(Math.log2(numPlayers)));
  const levels = Math.log2(bracketSize);
  const coordinates = [];

  const stepY = (CELL_HEIGHT + CELL_MARGIN_Y) * Math.pow(2, levels - 1);

  const assignCoordinates = (startX, startY, level, count) => {
    if (level === 0) {
      for (let i = 0; i < count; i++) {
        coordinates.push({
          x: startX,
          y: startY + i * (CELL_HEIGHT + CELL_MARGIN_Y),
        });
      }
      return;
    }
    const half = Math.ceil(count / 2);
    assignCoordinates(startX, startY, level - 1, half);
    assignCoordinates(startX, startY + half * stepY / 2, level - 1, count - half);
  };

  assignCoordinates(0, 0, levels - 1, bracketSize);
  return coordinates;
};

const Bracket = ({ players, onPlayerSave }) => {
  if (!players || players.length === 0) return null;

  const bracketSize = Math.pow(2, Math.ceil(Math.log2(players.length)));
  const SvgComponent = SVG_TEMPLATES[bracketSize];
  const coordinates = generateCoordinates(bracketSize);

  return (
    <div className="relative">
      {SvgComponent && <SvgComponent />} {/* Render the SVG */}

      {players.map((player, index) => {
        const coord = coordinates[index];
        if (!coord) return null;

        return (
          <EditablePlayerCell
            key={player.id}
            player={player}
            onSave={onPlayerSave}
            x={coord.x}
            y={coord.y}
          />
        );
      })}
    </div>
  );
};

export default Bracket;
