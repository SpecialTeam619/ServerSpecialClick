import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
    verbose: true,
    preset: 'ts-jest',
    testRegex: '.e2e-spec.ts$',
    coveragePathIgnorePatterns: ['./src/prisma/generated']
}

export default config