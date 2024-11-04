import { createFileRoute } from "@tanstack/react-router";
import DailyReport from "../../pages/DailyReport";

export const Route = createFileRoute('/reports/daily')({
    component: () => <DailyReport />
})