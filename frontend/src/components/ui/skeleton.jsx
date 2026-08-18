import React from 'react';
import { cn } from '../../lib/utils';

export const Skeleton = ({ className, ...props }) => {
  return (
    <div
      data-slot="skeleton"
      className={cn('animate-pulse rounded-xl bg-gray-200/80 dark:bg-gray-800/80', className)}
      {...props}
    />
  );
};

