import { createFileRoute } from "@tanstack/react-router";
import WeeklyReport from "../../pages/WeelyReport";

export const Route = createFileRoute('/reports/weekly')({
    component: () => <WeeklyReport />
})