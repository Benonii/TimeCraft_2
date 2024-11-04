import { createFileRoute } from "@tanstack/react-router";
import TotalProductiveTime from "../../pages/TotalProductiveTime";;

export const Route = createFileRoute('/reports/tpt')({
    component: () => <TotalProductiveTime />
})