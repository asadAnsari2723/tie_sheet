import React, { useState, useRef, useEffect } from 'react';

const EditablePlayerName = ({ playerName, onSave, id, mirror = false, className="" }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState(playerName);
    const inputRef = useRef(null);

    // Sync input only if parent changes the name externally
    useEffect(() => {
        setInputValue(playerName);
    }, [playerName]);

    const handleSave = () => {
        const newName = inputValue.trim();
        if (newName !== playerName) {
            onSave(id, newName);   // <-- passes id + new value correctly
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSave();
        if (e.key === 'Escape') {
            setInputValue(playerName);
            setIsEditing(false);
        }
    };

    const containerClasses = `p-2 transition-colors duration-150 w-full text-center ${className}`;
    const mirrorClasses = mirror ? "scale-x-[-1]" : "";
    const displayClasses = "cursor-pointer hover:bg-yellow-100/50 flex justify-center items-center";
    const inputClasses = "w-full p-1 border border-indigo-400 rounded-md shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg font-medium text-center";

    return (
        <div className={`${containerClasses} ${mirrorClasses}`}>
            {isEditing ? (
                <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onBlur={handleSave}
                    onKeyDown={handleKeyDown}
                    className={inputClasses}
                    autoFocus
                    placeholder="text"
                />
            ) : (
                <div 
                    className={displayClasses}
                    onDoubleClick={() => setIsEditing(true)}
                >
                    <span className="font-semibold text-gray-800 text-lg truncate">
                        {playerName || "\u200B"}
                    </span>
                </div>
            )}
        </div>
    );
};

export default EditablePlayerName;
