/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}

const withTM = require("next-transpile-modules")(["@101xyz/ui-lib", "@101xyz/course-viewer"]);


module.exports = withTM(nextConfig)
