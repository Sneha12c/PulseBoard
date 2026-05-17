import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import CreatePoll from "./pages/CreatePoll.tsx";
import PollForm from "./pages/PollForm.tsx";
import Analytics from "./pages/Analytics.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/create-poll"
          element={<CreatePoll />}
        />

        <Route
          path="/poll/:pollLink"
          element={<PollForm />}
        />

        <Route
          path="/analytics/:pollLink"
          element={<Analytics />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;