import React, { MouseEventHandler } from 'react';

type TButton = {
  title: string;
  href?: string;
  onClick?: MouseEventHandler;
  svg?: boolean;
  modalId?: string;
};

const Button: React.FC<TButton> = ({ title, href, onClick, svg, modalId }) => {
  return (
    <>
      <a
        onClick={onClick}
        data-modal-toggle={modalId && modalId}
        href={href}
        className="inline-flex items-center py-2 px-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 cursor-pointer select-none"
      >
        {title}
        {svg && (
          <svg
            className="ml-2 -mr-1 w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"></path>
          </svg>
        )}
      </a>
    </>
  );
};

export default Button;
