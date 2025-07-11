'use client';

import { useState, useCallback } from 'react';

export function useLoadingOverlay(defaultVisible = false) {
  const [visible, setVisible] = useState(defaultVisible);

  const show = useCallback(() => setVisible(true), []);
  const hide = useCallback(() => setVisible(false), []);

  return { visible, show, hide };
}
