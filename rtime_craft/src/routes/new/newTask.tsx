import { createFileRoute } from "@tanstack/react-router";
import NewTask from "../../pages/NewTask";

export const Route = createFileRoute('/new/log')({
    component: () => <NewTask />
})