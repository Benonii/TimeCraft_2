import { createFileRoute } from "@tanstack/react-router";
import TotalWastedTime from "../../pages/TotalWastedTime";;

export const Route = createFileRoute('/reports/twt')({
    component: () => <TotalWastedTime />
})