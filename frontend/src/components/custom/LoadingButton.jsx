import React from 'react';
import { Button } from '../shadcn/Button';
import { cn } from '../../lib/utils';


function LoadingButton({ isLoading, text }) {
  return (
    <div>
      <Button
        disabled={isLoading}
        className={cn(
          'bg-yellow1 text-white md:w-36 md:h-14 text-xl md:text-2xl font-madimi hover:bg-yellow-300',
          isLoading ?? "cursor-not-allowed"
        )}
      >
        {isLoading ? (
          <span className='flex items-center justify-center'>
            <svg
              className='animate-spin h-5 w-5 text-white'
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className='opacity-75'
                fill='currentColor'
                d='M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z'
              ></path>
            </svg>
          </span>
        ): (
          text
        )}
      </Button>
    </div>
  )
}

export default LoadingButton
