'use client';

import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

interface NoSSRProps {
  children: React.ReactNode;
}

const NoSSRWrapper = ({ children }: NoSSRProps) => {
  return <>{children}</>;
};

const NoSSR = dynamic(() => Promise.resolve(NoSSRWrapper), {
  ssr: false,
});

export default NoSSR;