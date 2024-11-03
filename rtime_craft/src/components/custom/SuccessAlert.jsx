import { Alert, AlertDescription, AlertTitle } from "../shadcn/Alert";
import { Check } from 'lucide-react';


function SuccessAlert({ content }) {
  return (
    <Alert className="shadow-md border-green-500 mt-5 bg-white dark:bg-transparent">
      <AlertTitle className="flex items-center gap-2 font-monomaniac text-xl text-gray-700 dark:text-gray-300">
      <Check className="h-7 w-7 text-green-500 border-2 border-green-500 rounded-full" />
      Success
    </AlertTitle>
    <AlertDescription className="font-monomaniac ml-10 text-lg text-gray-700 dark:text-gray-300">
      {content}
    </AlertDescription>
    </Alert>
  )
}

export default SuccessAlert;