'use client';

import { useEffect } from 'react';
import { captureUtmParameters } from '@/lib/analytics';

export default function UtmTracker() {
  useEffect(() => {
    captureUtmParameters();
  }, []);

  return null;
}
