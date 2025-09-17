'use client';
import { VariableItem } from '../type/type';

export function getVariable(id: string) {
  if (typeof window === 'undefined') {
    return [];
  }
  const stored = localStorage.getItem(id);
  if (stored !== null) {
    return JSON.parse(stored) as VariableItem[];
  }

  return [];
}
