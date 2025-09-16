import { Routes, Route } from "react-router-dom";
import Auth from "./Auth";
import Dashboard from "./Dashboard";
import CreatePayment from "./CreatePayment";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/create-payment" element={< CreatePayment />} />
    </Routes>
  );
}

export default App;