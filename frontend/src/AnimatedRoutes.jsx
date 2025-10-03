import TournamentForm from "./components/Form.jsx";
import TournamentDisplay from "./components/TournamentDisplay.jsx"; // Your tournament bracket component
import { AnimatePresence, motion } from "framer-motion";
import { useLocation, Routes, Route } from "react-router-dom";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <TournamentForm />
            </motion.div>
          }
        />
        <Route
          path="/tournament"
          element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="print-wrapper">
                <TournamentDisplay />
              </div>
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}
export default AnimatedRoutes;