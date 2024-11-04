import { createFileRoute } from "@tanstack/react-router";
import TotalTimeOnTask from "../../pages/TotalTimeOnTask";;

export const Route = createFileRoute('/reports/tpt')({
    component: () => <TotalTimeOnTask />
})