import { terser } from 'rollup-plugin-terser'
import typescript from 'rollup-plugin-typescript2'

require('dotenv').config()

export default {
    input: 'src/smart-search.ts',
    output: {
        file: 'lib/smart-search.min.js',
        format: 'iife',
        name: 'smartSearch',
        compact: true,
        ...(process.env.NODE_ENV === 'development'
            ? { sourcemap: 'inline' }
            : {}),
    },
    plugins: [
        typescript({
            clean: true,
        }),
        ...(process.env.NODE_ENV !== 'development' ? [terser()] : []),
    ],
}
