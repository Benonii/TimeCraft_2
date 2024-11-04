import { RouterProvider } from "@tanstack/react-router";
import { Toaster } from "./components/shadcn/Toaster";
import router from './router';


export default function App() {
	return (
        <RouterProvider router={router}>
            <Toaster />
        </RouterProvider>
    )
}		
