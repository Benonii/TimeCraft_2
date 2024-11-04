import { createFileRoute } from "@tanstack/react-router";
import NewLog from "../../pages/NewLog";

export const Route = createFileRoute('/new/log')({
    component: () => <NewLog />
})