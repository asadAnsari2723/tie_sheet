import { useMemo } from "react";
import defaultLeftLogo from '../assets/jamia.svg';
import defaultRightLogo from '../assets/react.svg';

const TournamentHeader = ({ 
    tournamentName, weightCategory, organizer, date, leftLogo, rightLogo 
}) => {
    // Helper to format date nicely
    const formattedDate = useMemo(() => {
        try {
            return new Date(date).toLocaleDateString('en-US', { 
                year: 'numeric', month: 'long', day: 'numeric' 
            });
        } catch (e) {
            return date;
        }
    }, [date]);

    return (
        <div className="flex items-center justify-between p-4 mb-8 bg-indigo-50 border-b-4 border-indigo-300 rounded-t-xl shadow-md">
            
            {/* Left Logo Container */}
            <div className="flex-shrink-0 w-16 h-16 mr-4">
                <img 
                    src={leftLogo || defaultLeftLogo} 
                    alt="Left Logo" 
                    className="w-full h-full object-contain"
                    onError={(e) => { 
                        e.target.onerror = null; 
                        e.target.src="https://placehold.co/64x64/8B5CF6/FFFFFF?text=Logo"; 
                    }}
                />
            </div>

            {/* Center Info Container */}
            <div className="flex-grow text-center">
                <h1 className="text-3xl font-extrabold text-indigo-800 mb-1 leading-tight">{tournamentName}</h1>
                <p className="text-2xl font-medium text-indigo-600 mb-1">
                    Organized By: <span className="font-semibold">{organizer}</span>
                </p>
                <p className="text-xl font-bold text-gray-700">
                    {weightCategory} | {formattedDate}
                </p>
            </div>

            {/* Right Logo Container */}
            <div className="flex-shrink-0 w-16 h-16 ml-4">
                <img 
                    src={rightLogo || defaultRightLogo} 
                    alt="Right Logo" 
                    className="w-full h-full object-contain"
                    onError={(e) => { 
                        e.target.onerror = null; 
                        e.target.src="https://placehold.co/64x64/8B5CF6/FFFFFF?text=Logo"; 
                    }}
                />
            </div>
        </div>
    );
};

export default TournamentHeader;
