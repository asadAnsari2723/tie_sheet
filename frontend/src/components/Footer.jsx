import React, { useState, useLayoutEffect, useRef, useMemo } from 'react';
import EditablePlayerName from './RoundCells.jsx'; // Your provided cell component

const MedalTable = () => {
  const medalRows = useMemo(() => ['Gold', 'Silver', 'Bronze', 'Bronze'], []);
  const initialResults = useMemo(() =>
    medalRows.map((medal, index) => ({
      id: index,
      medal,
      name: '',
      detail: '',
    }))
  , [medalRows]);

  const [results, setResults] = useState(initialResults);

  // Handler to update name or detail separately
  const handleCellSave = (id, newValue, field) => {
    setResults(prev => prev.map(row => 
      row.id === id ? { ...row, [field]: newValue } : row
    ));
  };

  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    function updateScale() {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.offsetWidth;
      const viewportWidth = window.innerWidth * 0.9;
      if (containerWidth > viewportWidth) {
        setScale(viewportWidth / containerWidth);
      } else {
        setScale(1);
      }
    }
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  return (
    <div className="flex justify-center mt-2 w-full overflow-x-auto">
      <div
        ref={containerRef}
        style={{
          transformOrigin: 'top center',
          transform: `scale(${scale})`,
          minWidth: 320,
          transition: 'transform 0.2s ease',
        }}
      >
        <table
          className="border border-black border-collapse max-w-md w-full"
          style={{ tableLayout: 'fixed' }}
        >
          <thead>
            <tr className="bg-gray-200 border-b border-black text-gray-900">
              <th className="w-1/3 px-2 py-1 text-center border-r border-black">
                
              </th>
              <th className="w-1/3 px-2 py-1 text-center border-r border-black">
                
              </th>
              <th className="w-1/3 px-2 py-1 text-center font-bold uppercase">
                Medal
              </th>
            </tr>
          </thead>
          <tbody>
            {results.map(row => (
              <tr key={row.id} className="bg-white">
                <td className="border border-black p-0">
                  <EditablePlayerName
                    playerName={row.name}
                    onSave={(id, newName) => handleCellSave(id, newName, 'name')}
                    id={row.id}
                    className=""
                  />
                </td>
                <td className="border border-black p-0">
                  <EditablePlayerName
                    playerName={row.detail}
                    onSave={(id, newDetail) => handleCellSave(id, newDetail, 'detail')}
                    id={row.id}
                    className=""
                  />
                  </td>
                <td className={`border border-black px-2 py-1 text-center font-semibold
                  ${row.medal === 'Gold' ? 'bg-yellow-100 text-yellow-900' :
                    row.medal === 'Silver' ? 'bg-gray-300 text-gray-900' :
                    'bg-amber-200 text-amber-900'}`}
                >
                  {row.medal}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MedalTable;
