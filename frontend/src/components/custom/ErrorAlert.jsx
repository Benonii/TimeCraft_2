import { Alert, AlertDescription, AlertTitle } from "../shadcn/Alert";
import { AlertCircle } from "lucide-react"


function ErrorAlert({ content }) {
  return (
    <Alert variant="destructive" className="shadow-md mt-3 sm:mt-5 bg-white max-w-[500px] dark:bg-transparent dark:text-red-500 dark:border-red-500">
      <AlertTitle className="flex items-center gap-1 sm:gap-2 font-monomaniac text-lg sm:text-xl">
        <AlertCircle className="h-5 w-5 sm:h-7 sm:w-7" />
        Error
      </AlertTitle>
      <AlertDescription className="font-serif ml-6 sm:ml-10 text-base sm:text-lg">
        {content}
      </AlertDescription>
    </Alert>

  )
}

export default ErrorAlert;