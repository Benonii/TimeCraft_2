import { X  } from "lucide-react"

import { Button } from "./Button"

export default function OpenMenu() {
  return (
    <Button variant="outline" size="icon" className="flex items-center justify-center rounded-full py-1 px-2">
      <X className="h-7 w-7 text-gray-500 hover:text-black" />
    </Button>
  )
}
