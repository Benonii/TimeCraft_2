import React from 'react';
import { Button } from '../shadcn/Button';
import { cn } from '../../lib/utils';

function LoadingButton({ isLoading, text, className, ...props }) {
  return (
    <Button
      disabled={isLoading}
      className={cn(
        'bg-yellow1 text-white px-4 py-2',                    // Base styles
        'text-base sm:text-lg md:text-xl',                          // Responsive text
        'min-w-[120px] sm:min-w-[140px] md:min-w-[160px]',         // Responsive width
        'font-madimi shadow-lg rounded-md',                         // Consistent styling
        'hover:bg-yellow-500 transition-colors duration-300',       // Hover effects
        isLoading && "cursor-not-allowed opacity-80",              // Loading state
        className                                                  // Custom classes
      )}
      {...props}
    >
      {isLoading ? (
        <div className='flex items-center justify-center'>
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
            />
            <path
              className='opacity-75'
              fill='currentColor'
              d='M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z'
            />
          </svg>
        </div>
      ) : (
        text
      )}
    </Button>
  );
}

export default LoadingButton;
