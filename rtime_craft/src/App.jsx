import React from "react"
import Sidebar from "./components/Sidebar"
import Main from "./components/Main"
import Split from "react-split"
import Home from "./pages/Home"
import NewUser from "./pages/NewUser"
// import "./style.css"


export default function App() {
	const [action, setAction] = React.useState(0)
	
	function onActionClick(id) {
		setAction(id)
	}

	return (
        <main>
			<Home />
        </main>
    )
}		
