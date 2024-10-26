import React from "react"
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
// import "./style.css"


export default function App() {
	const [action, setAction] = React.useState(0)
	
	function onActionClick(id) {
		setAction(id)
	}

	return (
        <main>
			<TotalWastedTime />
        </main>
    )
}		
