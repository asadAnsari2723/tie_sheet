import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import TieSheetPlaceholder from "./TieSheetPlaceholder.jsx";
import PrintWrapper from "../PrintWrapper.jsx";

function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="loader border-4 border-gray-300 border-t-4 border-t-gray-700 rounded-full w-12 h-12 animate-spin"></div>
      <span className="ml-4 text-gray-700 font-semibold">Calculating layout...</span>
    </div>
  );
}

function TournamentDisplay() {
  const bracketRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState("auto");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const tournamentDataFromState = location.state;
  const [tournamentData, setTournamentData] = useState(tournamentDataFromState || null);

  // Redirect to form if no data
  useEffect(() => {
    if (!tournamentData) {
      navigate("/");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      if (bracketRef.current) {
        const bracketWidth = bracketRef.current.scrollWidth;
        const bracketHeight = bracketRef.current.scrollHeight;
        const viewportWidth = window.innerWidth * 0.9;

        let newScale = 1;
        if (bracketWidth > viewportWidth) {
          newScale = viewportWidth / bracketWidth;
          setScale(newScale);
          setHeight(bracketHeight * newScale);
        } else {
          setScale(1);
          setHeight("auto");
        }
        setLoading(false);
      }
    }, 0);
  }, [tournamentData, navigate]);

  const handleEdit = () => {
    navigate("/", { state: tournamentData });
  };

  if (!tournamentData) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <Header
        tournamentName={tournamentData.tournamentName}
        weightCategory={tournamentData.weightCategory}
        organizer={tournamentData.organizedBy}
        date={tournamentData.tournamentDate}
        leftLogo={tournamentData.leftLogoUrl}
        rightLogo={tournamentData.rightLogoUrl}
      />
    
      <main className="max-w-8xl mx-auto p-6 relative overflow-x-hidden flex flex-col items-center space-y-4">
        {loading && <Loading />}
        <div
          ref={bracketRef}
          style={{
            transformOrigin: "center top",
            transform: `scale(${scale})`,
            visibility: loading ? "hidden" : "visible",
            width: "max-content",
            display: "inline-block",
            height: height,
            overflow: "visible",
          }}
        >
            
          <TieSheetPlaceholder players={tournamentData.players} />
          

        </div>

        <div className="flex justify-center w-full mt-3">
          <Footer />
        </div>
      </main>
      <div className="flex justify-center w-full mt-4">
        <button
          className="no-print px-4 py-2 rounded bg-gray-700 text-white hover:bg-gray-800"
          onClick={handleEdit}
        >
          ← Edit Form
        </button>
      </div>
    </div>
  );
}

export default TournamentDisplay;
