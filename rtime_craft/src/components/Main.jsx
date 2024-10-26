import React from "react"
// import "../style.css"
import Description from "./Description"
import NewUser from "./NewUser"
import NewTask from "./NewTask"
import NewLog from "./NewLog"
import DailyReport from "./DailyReport"
import WeeklyReport from "./WeeklyReport"
import MonthlyReport from "./MonthlyReport"
import TotalProductiveTime from "./TotalProductiveTime"
import TotalWastedTime from "./TotalWastedTime"
import TotalTimeOnTask from "./TotalTimeOnTask"
import AssignUser from "./AssignUser"

export default function Main({actionId}) {
	const [userId, setUserId] = React.useState("");

	async function getUser() {
		try {

			const response = await fetch("http://127.0.0.1:5001/tc/v1/get_session_user",
						{
							method: 'GET',
							headers: {
								'Content-Type': 'application/json'
							}
						});
			if (response.ok) {
				const responseJSON = await response.json();
				const userID = responseJSON.user_id;
				
				if (userID !== null) {
					setUserId(userId);
					console.log("Ladies and Gentlemen, we got him");
				}
			} else {
				console.error("Couldn't get user");
				console.log(response)
			};
		} catch(error){
			console.error("Error submitting form: ", error);
		};
	};
	getUser();

	async function assignUser(userID) {	
		if (userID === null || userID === "") {
			console.error("Please enter a valid User ID")
			return ({});
		} else {
			const obj = { 'userID': userID }
			const response = await fetch("http://127.0.0.1:5001/tc/v1/switch_user",
						{
							method: 'POST',
							headers: {
								'Content-Type': 'application/json'
							},
							body: JSON.stringify(obj),
						})
			if (response.ok) {
				const responseJson = await response.json();
				if (responseJson.length !== 0) {
				  setUserId(userID);
				  return ({'name': responseJson.name});
				} else {
				  return ({});
				}
			} else {
				console.error("Couldn't switch user");
			};
		};
		return
	};

	const actions = {
		0: <Description />,
		1: <NewUser assignUser={assignUser}/>,
		2: <NewTask userId={userId} assignUser={assignUser}/ >,
		3: <NewLog userId={userId} assignUser={assignUser} />,
		4: <DailyReport userId={userId} assignUser={assignUser} />,
		5: <WeeklyReport userId={userId} assignUser={assignUser} />,
		6: <MonthlyReport userId={userId} assignUser={assignUser} />,
		7: <TotalProductiveTime userId={userId} assignUser={assignUser} />,
		8: <TotalWastedTime userId={userId} assignUser={assignUser} />,
		9: <TotalTimeOnTask userId={userId} assignUser={assignUser} />,
		10: <AssignUser assignUser={assignUser} />
	}

	let component = actions[actionId];
    return (
        <main>
	    {component}
        </main>
    )
}
