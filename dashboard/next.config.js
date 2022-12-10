function MultipleLinks(destination, ...sources) {
  return sources.map(e => ({
    source: e,
    destination,
    permanent: true
  }))
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  async redirects() {
    return [
      ...MultipleLinks("https://discord.gg/Rgxv5M6sq9", "/support", "/discord"),
      ...MultipleLinks(
        "https://discord.com/oauth2/authorize?client_id=1028785995337977856&permissions=1504178465975&scope=bot",
        "/add",
        "/invite",
        "/bot"
      ),
      ...MultipleLinks("https://www.craft.do/s/LDE5iUWkkRLnnA", "/privacy", "/tos", "/terms", "/terms-of-serivce", "/privacy-policy", "/policy"),
      ...MultipleLinks("https://docs.trtle.xyz/pro/custom-bots", "/learn/custom-bots", "/learn/custom-bot", "/learn/custom")
    ]
  }
}

module.exports = nextConfig