import { LucideMenu } from "lucide-react"
import { Button } from "../shadcn/Button"

export default function OpenMenu() {
  return (
    <Button 
      variant="outline" 
      size="icon" 
      className="flex items-center justify-center border border-gray-500 rounded-full p-1.5 md:p-2 lg:p-2.5 
        bg-white hover:bg-gray-200
        dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-600
        shadow-sm hover:shadow-md transition-all duration-300"
    >
      <LucideMenu className="h-5 w-5 md:h-8 md:w-8 lg:h-10 lg:w-10
        text-gray-900 hover:text-orange3 
        dark:text-gray-100 dark:hover:text-orange3 
        transition-colors duration-300" 
      />
    </Button>
  )
}
