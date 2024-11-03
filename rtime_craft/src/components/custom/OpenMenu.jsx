import { LucideMenu  } from "lucide-react"
import { Button } from "../shadcn/Button"


export default function OpenMenu() {
  return (
    <Button variant="outline" size="icon" className="flex items-center justify-center border rounded-full py-1 px-2">
      <LucideMenu className="h-8 w-8 md:w-20 md:h-20 text-gray-500 hover:text-black" />
    </Button>
  )
}
