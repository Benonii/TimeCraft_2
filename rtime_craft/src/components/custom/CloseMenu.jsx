import { Button } from "../shadcn/Button"
import { X  } from "lucide-react"


export default function OpenMenu() {
  return (
    <Button variant="outline" size="icon" className="flex items-center justify-center rounded-full py-1 px-2 dark:hover:text-white">
      <X className="h-7 w-7 text-gray-500 hover:text-black" />
    </Button>
  )
}
