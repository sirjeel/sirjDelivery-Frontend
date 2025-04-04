'use client';

import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { makeStore } from '../store/index';

export default function ReduxProvider({ children }: { children: ReactNode }) {
  const store = makeStore;
  return <Provider store={store}>{children}</Provider>;
}