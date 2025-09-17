'use client';
import dynamic from 'next/dynamic';

const VariablesForm = dynamic(() => import('../VariablesForm/VariablesForm'), {
  loading: () => <p>Loading...</p>,
});

export default function VariablesContainer({ id }: { id: string }) {
  return <VariablesForm id={id} />;
}
