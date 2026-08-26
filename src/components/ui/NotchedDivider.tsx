import React from 'react';

interface NotchedDividerProps {
  color?: string;
  height?: number;
  direction?: 'left-to-right' | 'right-to-left' | 'double';
  className?: string;
}

export default function NotchedDivider({
  color = 'bg-primary',
  height = 8,
  direction = 'left-to-right',
  className = ''
}: NotchedDividerProps) {
  let clipClass = 'notched-banner';
  if (direction === 'right-to-left') {
    clipClass = 'notched-banner-top-right';
  } else if (direction === 'double') {
    clipClass = 'notched-banner-double';
  }

  return (
    <div 
      className={`w-full ${color} ${clipClass} ${className}`}
      style={{ height: `${height}px` }}
      aria-hidden="true"
    />
  );
}
