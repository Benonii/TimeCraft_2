import { createFileRoute } from "@tanstack/react-router";
import NewActivity from "../../pages/NewActivity";

export const Route = createFileRoute('/new/log')({
    component: () => <NewActivity />
})