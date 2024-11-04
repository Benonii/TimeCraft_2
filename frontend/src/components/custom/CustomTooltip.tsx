import { useState } from "react";


const Tooltip = ({ content, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      className="relative inline-block"
    >
      {children}
      {isVisible && (
        <div className="absolute bottom-full mb-2 w-max px-2 py-1 text-xs bg-transparent text-gray-500 rounded shadow-lg font-madimi dark:text-white">
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;