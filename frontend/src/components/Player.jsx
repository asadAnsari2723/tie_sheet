import React, { useState, useRef, useEffect } from 'react';

/**
 * Reusable component for displaying and editing a player's name and state.
 * Props:
 * - playerName: The current name of the player.
 * - playerState: The current state/location of the player.
 * - onSave: Function called on save: (id, newName, newState) => void.
 * - id: Unique identifier for the player (used when calling onSave).
 */
const EditablePlayerCell = ({ playerName, playerState, onSave, id, mirror = false, className = "" }) => {
    // Combine name and state into a single string for initial input value
    const initialText = `${playerName} | ${playerState}`;
    const [isEditing, setIsEditing] = useState(false);
    // Use the combined text as the internal state for the input field
    const [inputValue, setInputValue] = useState(initialText);
    const inputRef = useRef(null);

    // Effect to set focus when isEditing changes to true
    useEffect(() => {
        if (isEditing && inputRef.current) {
            // Set input value again in case the parent component changed the data while editing was off
            setInputValue(`${playerName} | ${playerState}`);
            inputRef.current.focus();
        }
    }, [isEditing, playerName, playerState]); // Dependency on props ensures update if parent re-renders

    const handleSave = () => {
        // Parse the input value back into name and state
        const parts = inputValue.split('|').map(p => p.trim());

        // Use the new name, falling back to old name if the input part is empty
        const newName = parts[0] || playerName;

        // State is the second part, or use old state if the second part is missing
        const newState = parts.length > 1 ? parts[1] : playerState;

        // 1. Call the external save function passed via props
        onSave(id, newName, newState);

        // 2. Since the parent's state change will update playerName/playerState props, 
        // we can rely on those, but we'll manually sync the internal input value
        // to handle the immediate transition out of editing mode.
        setInputValue(`${newName} | ${newState}`);

        // 3. Exit editing mode
        setIsEditing(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            // Cancel editing and revert input to the current saved value
            setInputValue(`${playerName} | ${playerState}`);
            setIsEditing(false);
        }
    };

    // Base classes for the element
    const containerClasses = `p-2  transition-colors duration-150 w-full min-w-[400px] text-center md:text-left bg-white ${className}`;

    // Classes for the static display mode
    const displayClasses = "cursor-pointer hover:bg-yellow-100/50";

    // Classes for the focused input field
    const inputClasses = "w-full p-1 border border-indigo-400 rounded-md shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium";

    const mirrorClasses = mirror ? "scale-x-[-1]" : "";
    return (
        <div className={containerClasses + " " + mirrorClasses}>
            {isEditing ? (
                <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onBlur={handleSave} // Save when focus is lost
                    onKeyDown={handleKeyDown}
                    className={inputClasses}
                    // Prevent component re-render focus loss issue by using autoFocus
                    autoFocus
                    placeholder="Name | State"
                />
            ) : (
                <div
                    className={`${displayClasses} flex justify-between items-center`}
                    onDoubleClick={() => setIsEditing(true)}
                >
                    {/* Player Name */}
                    {/* <span className="font-semibold text-gray-800 text-sm truncate mr-2">
                        {playerName}
                    </span>
                    
                    <span className="text-xs text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full ml-auto flex-shrink-0 shadow-sm">
                        {playerState}
                    </span> */}

                    <div className="flex w-full">
                        {/* Left portion 70% */}
                        <div className="w-[60%] font-bold text-gray-800 text-lg truncate flex items-center justify-center">
                            {playerName}
                        </div>

                        {/* Vertical divider */}
                        <div className="border-l-3 border-black mx-2"></div>


                        {/* Right portion 30% */}
                        <div className="w-[40%] text-md font-bold flex items-center justify-center shadow-sm overflow-hidden text-ellipsis whitespace-nowrap px-2 py-1  rounded-full">
                            {playerState}
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
};

export default EditablePlayerCell;