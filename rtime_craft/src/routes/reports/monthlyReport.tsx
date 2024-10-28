import { createFileRoute } from "@tanstack/react-router";
import MonthlyReport from "../../pages/MonthlyReport";

export const Route = createFileRoute('/reports/monthly')({
    component: () => <MonthlyReport />
})