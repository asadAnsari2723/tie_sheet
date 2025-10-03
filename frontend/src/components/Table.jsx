import './styles/Table.css';
import React, { useState, useCallback, useEffect } from 'react';
import EditablePlayerCell from './Player';
import RoundCell from './RoundCells.jsx';
import {
    BlankCell,
    TopConnector,
    MidConnector,
    BottomConnector,
    NoConnector
} from './BracketCell/BracketCells.jsx';

// Helper functions (same as original logic)
function createBracketGame(parentGameId, slotOneValue, slotTwoValue, isSlotOneTeam, isSlotTwoTeam) {
    return [parentGameId, slotOneValue, slotTwoValue, isSlotOneTeam, isSlotTwoTeam];
}

function increment(GameStatus) {
    GameStatus++;
    return (GameStatus === 4) ? 0 : GameStatus;
}

// Main Bracket Component
const TournamentBracket = ({ playerList, mirrored = false, doShowNames = true }) => {
    const [players, setPlayers] = useState(
        playerList.map((player, idx) => ({ ...player, id: idx + 1 }))
    );

    React.useEffect(() => {
        setPlayers(playerList.map((player, idx) => ({ ...player, id: idx + 1 })));
    }, [playerList]);



    // State for editable header titles (first col + rounds)
    const [headerTitles, setHeaderTitles] = useState(() => [
        "Player Names",
        ...Array(playerList.length > 0 ? Math.ceil(Math.log2(playerList.length)) : 0)
            .fill(0)
            .map((_, i) => `Rnd ${i + 1}`)
    ]);

    // useEffect(() => {
    //     setPlayers(playerList.map((player, idx) => ({ ...player, id: idx + 1 })));
    //     // Recalculate rounds count and set header titles on playerList change
    //     const totalRounds = Math.ceil(Math.log2(playerList.length)) + 1 || 1;
    //     setHeaderTitles([
    //         "Player Names",
    //         ...Array(totalRounds).fill(0).map((_, i) => `Rnd ${i + 1}`)
    //     ]);
    // }, [playerList]);

useEffect(() => {
    setPlayers(playerList.map((player, idx) => ({ ...player, id: idx + 1 })));

    const totalRounds = Math.ceil(Math.log2(playerList.length)) + 1 || 1;

    const roundTitles = Array(totalRounds).fill(0).map((_, i) => `Rnd ${i + 1}`);

    if (roundTitles.length > 0) {
      roundTitles[roundTitles.length - 1] = "Final";
    }

    setHeaderTitles([
      "Player Names",
      ...roundTitles
    ]);
}, [playerList]);



    // Save handler updates player's name and state
    const handlePlayerSave = useCallback((id, newName, newState) => {
        setPlayers(prevPlayers => prevPlayers.map(p =>
            p.id === id ? { ...p, name: newName, state: newState } : p
        ));
    }, []);


     // Save handler for header cells
  const handleHeaderSave = (id, newName) => {
    setHeaderTitles(prev => {
      const updated = [...prev];
      updated[id] = newName;
      return updated;
    });
  };

    // Build bracket data
    const { bracketGames, totalRounds } = React.useMemo(() => {
        var playerToGameMap = [];
        var bracketGamesLocal = [];
        var totalRoundsLocal = 1;
        var numPlayers = players.length;

        playerToGameMap[1] = 1;
        playerToGameMap[2] = 1;
        bracketGamesLocal[1] = createBracketGame(0, 1, 2, true, true);

        totalRoundsLocal++;
        var roundThreshold = 3;
        var nextGameId = 1;

        for (var currentPlayerIdx = 3; currentPlayerIdx <= numPlayers; currentPlayerIdx++) {
            if (currentPlayerIdx === roundThreshold) {
                roundThreshold = (2 * roundThreshold) - 1;
                totalRoundsLocal++;
            }
            var previousPlayer = roundThreshold - currentPlayerIdx;

            var parentGameId = playerToGameMap[previousPlayer];
            var parentGame = bracketGamesLocal[parentGameId];
            var newGameId = nextGameId + 1;

            if (parentGame[1] === previousPlayer) {
                bracketGamesLocal[parentGameId] = createBracketGame(
                    parentGame[0],
                    newGameId,
                    parentGame[2],
                    false,
                    parentGame[4]
                );
            } else {
                bracketGamesLocal[parentGameId] = createBracketGame(
                    parentGame[0],
                    parentGame[1],
                    newGameId,
                    parentGame[3],
                    false
                );
            }

            bracketGamesLocal[newGameId] = createBracketGame(
                parentGameId,
                previousPlayer,
                currentPlayerIdx,
                true,
                true
            );

            playerToGameMap[currentPlayerIdx] = newGameId;
            playerToGameMap[previousPlayer] = newGameId;
            nextGameId = newGameId;
        }

        return { bracketGames: bracketGamesLocal, totalRounds: totalRoundsLocal };
    }, [players]);

    // LevelStatus to track connector states during render
    const levelStatus = React.useRef(new Array(totalRounds + 1).fill(0));

    // Recursive rendering of games
    const sendGameHTML = useCallback(
        (GameSet, LevelStatus, ThisLevel, OneGame, total, howfar) => {
            const Game = GameSet[OneGame];
            if (!Game) return howfar;

            // Left Side
            howfar = Game[3]
                ? sendTeamHTML(Game[1], LevelStatus, OneGame, ThisLevel - 1, total, howfar)
                : sendGameHTML(GameSet, LevelStatus, ThisLevel - 1, Game[1], total, howfar);

            // Center line
            howfar = sendTeamHTML(0, LevelStatus, OneGame, ThisLevel, total, howfar);

            // Right Side
            howfar = Game[4]
                ? sendTeamHTML(Game[2], LevelStatus, OneGame, ThisLevel - 1, total, howfar)
                : sendGameHTML(GameSet, LevelStatus, ThisLevel - 1, Game[2], total, howfar);

            return howfar;
        },
        []
    );

    // Render a single team box or empty spacer
    const sendTeamHTML = (TeamNumber, LevelStatus, GameNum, ThisLevel, total, howfar) => {
        if (LevelStatus[ThisLevel] === undefined) LevelStatus[ThisLevel] = 0;
        LevelStatus[ThisLevel] = increment(LevelStatus[ThisLevel]);

        const cells = [];
        if (TeamNumber === 0) {
            // Empty cell
            cells.push(<BlankCell key="blank" />);
        } else {
            // Player cell
            const player = players[TeamNumber - 1];
            cells.push(
                <td key="player-cell" className="player-cell">
                    <EditablePlayerCell
                        playerName={doShowNames ? player.name : `Player ${player.id}`}
                        playerState={player.state}
                        onSave={handlePlayerSave}
                        id={player.id}
                    />
                </td>
            );
        }

        // Add vertical connectors based on LevelStatus
        for (let x = 0; x < LevelStatus.length - 2; x++) {
            if (x === 0 && TeamNumber !== 0 && LevelStatus[x] === 0) {
                cells.push(<NoConnector key={`conn-no-${x}`} />);
            } else {
                // Map LevelStatus[x] 0-4 to connector components
                switch (LevelStatus[x]) {
                    case 0:
                        cells.push(<BlankCell key={`conn-blank-${x}`} />);
                        break;
                    case 1:
                        cells.push(<TopConnector key={`conn-top-${x}`} />);
                        break;
                    case 2:
                        cells.push(<MidConnector key={`conn-mid-${x}`} />);
                        break;
                    case 3:
                        cells.push(<BottomConnector key={`conn-bottom-${x}`} />);
                        break;
                    case 4:
                        cells.push(<NoConnector key={`conn-no-${x}`} />);
                        break;
                    default:
                        cells.push(<BlankCell key={`conn-default-${x}`} />);
                }
            }
        }

        if (GameNum === 1 && TeamNumber === 0) {
            cells.push(<NoConnector key="conn-no-last" />);
        }

        LevelStatus[ThisLevel] = increment(LevelStatus[ThisLevel]);

        howfar++;
        return (
            <tr key={`row-${howfar}`}>
                {cells}
            </tr>
        );
    };

    // Render all rows (simulate the HTML string build)
    const rows = [];
    const dummyHtmlObj = { html: '' };

    // We can collect rows from recursive call by slightly changing sendGameHTML or collecting sent team rows:
    // We'll simulate here a small wrapper to capture the rows built instead of string HTML

    // So rewrite sendGameHTML to build an array of JSX rows recursively

    const sendGameHTMLJSX = (GameSet, LevelStatus, ThisLevel, OneGame, total, howfar, rowsCollector) => {
        const Game = GameSet[OneGame];
        if (!Game) return howfar;

        howfar = Game[3]
            ? sendTeamJSX(Game[1], LevelStatus, OneGame, ThisLevel - 1, total, howfar, rowsCollector)
            : sendGameHTMLJSX(GameSet, LevelStatus, ThisLevel - 1, Game[1], total, howfar, rowsCollector);

        howfar = sendTeamJSX(0, LevelStatus, OneGame, ThisLevel, total, howfar, rowsCollector);

        howfar = Game[4]
            ? sendTeamJSX(Game[2], LevelStatus, OneGame, ThisLevel - 1, total, howfar, rowsCollector)
            : sendGameHTMLJSX(GameSet, LevelStatus, ThisLevel - 1, Game[2], total, howfar, rowsCollector);

        return howfar;
    };

    const sendTeamJSX = (TeamNumber, LevelStatus, GameNum, ThisLevel, total, howfar, rowsCollector) => {
        if (LevelStatus[ThisLevel] === undefined) LevelStatus[ThisLevel] = 0;
        LevelStatus[ThisLevel] = increment(LevelStatus[ThisLevel]);

        const cells = [];
        if (TeamNumber === 0) {
            cells.push(<BlankCell key="blank" />);
        } else {
            const player = players[TeamNumber - 1];
            cells.push(
                <td key="player-cell" className="player-cell">
                    <EditablePlayerCell
                        playerName={doShowNames ? player.name : `Player ${player.id}`}
                        playerState={player.state}
                        onSave={handlePlayerSave}
                        id={player.id}
                        mirror={mirrored}
                        className='border-2 border-black'
                    />
                </td>
            );
        }

        for (let x = 0; x < LevelStatus.length - 2; x++) {
            if (x === 0 && TeamNumber !== 0 && LevelStatus[x] === 0) {
                cells.push(<NoConnector key={`conn-no-${x}`} />);
            } else {
                switch (LevelStatus[x]) {
                    case 0:
                        cells.push(<BlankCell key={`conn-blank-${x}`} />);
                        break;
                    case 1:
                        cells.push(<TopConnector key={`conn-top-${x}`} />);
                        break;
                    case 2:
                        cells.push(<MidConnector key={`conn-mid-${x}`} />);
                        break;
                    case 3:
                        cells.push(<BottomConnector key={`conn-bottom-${x}`} />);
                        break;
                    case 4:
                        cells.push(<NoConnector key={`conn-no-${x}`} />);
                        break;
                    default:
                        cells.push(<BlankCell key={`conn-default-${x}`} />);
                }
            }
        }

        if (GameNum === 1 && TeamNumber === 0) {
            cells.push(<NoConnector key="conn-no-last" />);
        }

        LevelStatus[ThisLevel] = increment(LevelStatus[ThisLevel]);

        howfar++;
        rowsCollector.push(
            <tr key={`row-${howfar}`}>
                {cells}
            </tr>
        );
        return howfar;
    };

    // Render the full bracket rows
    sendGameHTMLJSX(bracketGames, levelStatus.current, totalRounds - 1, 1, players.length, 0, rows);

    return (
        <div className={mirrored ? 'mirrored' : ''}>
            <table cellSpacing={0} cellPadding={0} >


                <thead>
                    <tr className='editable-header'>
                        <th style={{ width: 100 }}>
                            <RoundCell
                                playerName={headerTitles[0] || "Player Names"}
                                playerState={""}
                                onSave={handleHeaderSave}
                                id={0}
                                mirror={mirrored}
                                className='min-w-[80px] border-2 border-black bg-gray-200'
                            />
                            {/* </th>
                        {[...Array(totalRounds).keys()].map(x => (
                            <th className='editable-round' key={`header-${x}`} align="center">
                                <RoundCell
                                    playerName={`Rnd ${x + 1}`}
                                    playerState=""
                                    onSave={(id, newName) => console.log('Round name saved:', newName)}
                                    id={x + 1}
                                    mirror={mirrored}
                                    className='min-w-[80px]'
                                />
                            </th> */}
                        </th>
                        {headerTitles.slice(1).map((title, idx) => (
                            <th key={`header-${idx}`} className='editable-round' align="center">
                                <RoundCell
                                    playerName={title}
                                    playerState={""}
                                    onSave={handleHeaderSave}
                                    id={idx + 1}
                                    mirror={mirrored}
                                    className='min-w-[80px] border-2 border-black bg-gray-200'
                                />
                            </th>
                        ))}
                    </tr>

                </thead>


                <tbody>
                    {/* Blank spacer row */}
                    <tr style={{ height: '20px' }}>
                        <td colSpan={totalRounds + 1} />
                    </tr>
                    {rows}</tbody>
            </table>
        </div>
    );
};

export default TournamentBracket;
