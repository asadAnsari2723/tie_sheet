import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AnimatedRoutes from "./AnimatedRoutes.jsx";
function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<TournamentForm />} />
//         <Route path="/tournament" element={<TournamentDisplay />} />
//       </Routes>
//     </Router>
//   );
    return(
        <Router>
            <AnimatedRoutes />
        </Router>
    );
}

export default App;
