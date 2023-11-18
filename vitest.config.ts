import swc from 'unplugin-swc';
import { configDefaults, defineConfig } from 'vitest/config';
import tsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  test: {
    globals: true,
    root: './',
    exclude: [...configDefaults.exclude, 'data'],
    coverage: {
      exclude: [
        ...configDefaults.exclude,
        'src/**/prisma/**',
        'src/**/types/**',
        'src/**/env/**',
        'src/**/errors/**',
        'src/**/entities/**',
        'test',
      ],
    },
  },
  plugins: [
    tsConfigPaths(),
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
});
