import TournamentBracket from "./Table.jsx";
import RoundCell from './RoundCells.jsx';
import { useState } from "react";
import { shuffle } from "./shuffle.js"; // same shuffle function

function TieSheetPlaceholder({ players = [] }) {
  const [headtitle, setHeadtitle] = useState(['Number', '|', '|', 'Under ']);
  // Player list state
  const [playerOrder, setPlayerOrder] = useState(
    Array.isArray(players)
      ? players
      : typeof players === 'string'
        ? players.split('\n').map(line => {
            const parts = line.split('|').map(p => p.trim());
            return { name: parts[0] || 'Unknown Player', state: parts[1] || 'N/A' };
          })
        : []
  );

  // These will update after every shuffle/state change
  const half = Math.ceil(playerOrder.length / 2);
  const firstHalf = playerOrder.slice(0, half).length < 2
    ? [...playerOrder.slice(0, half), { name: 'Bye', state: '' }]
    : playerOrder.slice(0, half);

  const secondHalf = playerOrder.slice(half).length < 2
    ? [...playerOrder.slice(half), { name: 'Bye', state: '' }]
    : playerOrder.slice(half);

  const handleRandomize = () => {
    setPlayerOrder(shuffle(playerOrder));
  };

  const handleOnSave = (id, newName) => {
    setHeadtitle(prev => {
      const newTitles = [...prev];
      newTitles[id] = newName;
      return newTitles;
    });
  };

  return (
    <div className="flex flex-col items-center w-full">
      <button
        type="button"
        className="no-print mb-4 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={handleRandomize}
      >
        Randomize Players
      </button>
      <div>
        <table>
          <thead>
            <tr>
              {headtitle.map((title, index) => (
                <th key={index}>
                  <RoundCell
                    playerName={title}
                    playerState=""
                    onSave={handleOnSave}
                    id={index}
                    className='min-w-[425px] min-h-[40px] border-2 border-black bg-gray-200'
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr style={{ height: '30px' }}>
              <td />
            </tr>
          </tbody>
        </table>
      </div>
      <div className="bracket-container flex justify-center items-start gap-4">
        <div>
          <TournamentBracket
            playerList={firstHalf}  // Always computed from current state!
            mirrored={false}
          />
        </div>
        <div>
          {/* center portion */}
        </div>
        <div className="mirrored transform scale-x-[-1]">
          <TournamentBracket
            playerList={secondHalf}  // Always computed from current state!
            mirrored={true}
          />
        </div>
      </div>
    </div>
  );
}
export default TieSheetPlaceholder;
