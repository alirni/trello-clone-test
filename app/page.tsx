'use client';

import dynamic from 'next/dynamic';

const BoardComponent = dynamic(() => import('@/components/Board'), {
  ssr: false,
});

export default function Home() {
  return (
    <main>
      <BoardComponent />
    </main>
  );
}
