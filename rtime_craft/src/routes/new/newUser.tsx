import { createFileRoute } from "@tanstack/react-router";
import NewUser from "../../pages/NewUser";

export const Route = createFileRoute('/new/user')({
    component: () => <NewUser/>
})