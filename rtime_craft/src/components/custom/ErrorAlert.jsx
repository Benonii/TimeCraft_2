import { Alert, AlertDescription, AlertTitle } from "../shadcn/Alert";
import { AlertCircle } from "lucide-react"
// import { X } from 'lucide-react';


function ErrorAlert({ content }) {
  return (
    <Alert variant="destructive" className="shadow-md mt-5 bg-white max-w-[500px]">
      <AlertTitle className="flex items-center gap-2 font-monomaniac text-xl">
        <AlertCircle className="h-7 w-7" />
        Error
      </AlertTitle>
      <AlertDescription className="font-serif ml-10 text-lg">
        {content}
      </AlertDescription>
    </Alert>

  )
}

export default ErrorAlert;