import { useContext } from 'react';
import { CareContext } from './careContextDef';

export const useCare = () => {
  const context = useContext(CareContext);
  if (!context) {
    throw new Error('useCare must be used within a CareProvider');
  }
  return context;
};

export { CareContext } from './careContextDef';
export type { CareContextType, ToastMessage } from './careContextDef';
