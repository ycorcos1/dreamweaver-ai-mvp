import { useState } from "react";
import ImageForm from "../components/ImageForm";
import "../styles/Dashboard.css";
import Header from "../components/Header";

function Dashboard() {
  const [activeSection, setActiveSection] = useState("generate");

  return (
    <div className="dashboard-container">
      <Header />
      <div className="dashboard-content">
        <ImageForm />
      </div>
    </div>
  );
}

export default Dashboard;
