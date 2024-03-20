import React from 'react';

function ExitIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 21 21"
      stroke="green"
      strokeOpacity={1}
      fill="green"
      className="w-10 h-10 hover:stroke-green-500 hover:-rotate-45 select-none cursor-pointer active:scale-95 duration-500"
      {...props}
    >
      <g
        fill="none"
        fillRule="evenodd"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14.595 13.5l2.905-3-2.905-3M17.5 10.5h-9M14.5 3.5l-8 .002c-1.104.001-2 .896-2 2v9.995a2 2 0 002 2h8.095" />
      </g>
    </svg>
  );
}

export default ExitIcon;
