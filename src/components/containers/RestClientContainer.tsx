'use client';
import dynamic from 'next/dynamic';

const RestForm = dynamic(() => import('../RestForm/RestForm'), {
  loading: () => <p>Loading...</p>,
  ssr: false 
});

export default function RestClientContainer({ id }: { id: string }) {
  return <RestForm id={id} />;
}
