import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
      },
    ],
  },
  collectCoverageFrom: [
    'src/features/**/*.{ts,tsx}',
    '!src/features/**/*.d.ts',
    '!src/features/**/index.ts',
  ],
  coverageThreshold: {
    global: {
      statements: 70,
    },
    './src/features/': {
      statements: 70,
    },
  },
}

export default config
