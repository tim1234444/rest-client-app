'use client'
import { FallbackProps } from 'react-error-boundary';

export default function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="p-5 bg-red-100 rounded border border-red-400">
      <h2 className="text-red-600 font-bold">Что-то пошло не так</h2>
      <p className="mt-2">{error.message}</p>
      <button
        className="mt-3 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={resetErrorBoundary}
      >
        Попробовать снова
      </button>
    </div>
  );
}
