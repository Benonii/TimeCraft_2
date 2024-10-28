import { createFileRoute } from "@tanstack/react-router";
import Trackers from "../pages/Trackers";

export const Route = createFileRoute('/trackers')({
    component: () => <Trackers />
});