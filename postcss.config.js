module.exports = {
    plugins: [
        // Allow use of @import statements
        // https://tailwindcss.com/docs/using-with-preprocessors#build-time-imports
        require('postcss-import'),
        // Allow nested declarations
        // https://tailwindcss.com/docs/using-with-preprocessors#nesting
        require('tailwindcss/nesting'),
        // Use Tailwind
        require('tailwindcss'),
        // Automatically manage vendor prefixes
        // https://tailwindcss.com/docs/using-with-preprocessors#vendor-prefixes
        require('autoprefixer'),
    ]
}
