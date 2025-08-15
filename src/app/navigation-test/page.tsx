'use client';

import { NavigationTest } from '@/components/dev/navigation-test';
import { ThemeProvider } from '@/components/providers/theme-provider';

export default function NavigationTestPage() {
  return (
    <ThemeProvider>
      <NavigationTest />
    </ThemeProvider>
  );
}