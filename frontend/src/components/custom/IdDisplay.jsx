import React, { useRef } from 'react';
import { Input } from "../shadcn/Input"
// import { Copy } from "lucide-react";
// import { Button } from "../shadcn/Button"

function IdDisplay({ id }) {
    // const inputRef = useRef(null);
    // console.log("ID:", id);

    // const handleCopy = () => {
    //     if (inputRef.current) {
    //       navigator.clipboard.writeText(inputRef.current.value)
    //         .then(() => {
    //           console.log('Text copied to clipboard');
    //           // Optionally, you can add a message or toast here to notify the user
    //         })
    //         .catch((error) => {
    //           console.error('Failed to copy text:', error);
    //         });
    //     }
    // };
    
  return (
    <div className='flex items-center gap-1 ml-10'>
      <Input
        id="id"
        defaultValue={id}
        readOnly
        className='text-lg'
      />
        {/* <Button
            type="button"
            size="sm"
            onClick={handleCopy} 
            className="px-3 bg-yellow1 hover:bg-yellow-400"
        >
            <span className="sr-only">Copy</span>
            <Copy className="h-4 w-4" />
        </Button> */}
    </div>
  )
}

export default IdDisplay
