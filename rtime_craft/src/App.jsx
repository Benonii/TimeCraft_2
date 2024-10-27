import React, {useState} from "react";
import Sidebar from "./components/Sidebar"
import Main from "./components/Main"
import Split from "react-split"
import Home from "./pages/Home"
import NewUser from "./pages/NewUser"
import NewTask from "./pages/NewTask"
import NewLog from "./pages/NewLog"
import DailyReport from "./pages/DailyReport"
import WeeklyReport from "./pages/WeelyReport"
import MonthlyReport from "./pages/MonthlyReport"
import TotalProductiveTime from "./pages/TotalProductiveTime"
import TotalWastedTime from "./pages/TotalWastedTime"
import TotalTimeOnTask from "./pages/TotalTimeOnTask"
import Profile from "./pages/Profile";
import Settings from "./pages/Settings"
// import "./style.css"


export default function App() {
	return (
        <main>
			<Settings />
        </main>
    )
}		
