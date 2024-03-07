function MultipleLinks(destination, ...sources) {
  return sources.map((e) => ({
    source: e,
    destination,
    permanent: true,
  }));
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: ["cdn.discordapp.com", "raw.githubusercontent.com"],
  },
  async redirects() {
    return [
      ...MultipleLinks("https://discord.gg/Rgxv5M6sq9", "/support", "/discord"),
      ...MultipleLinks(
        "/pricing",
        "/pro",
        "/pro-plus",
        "/premium",
        "/learn/pro"
      ),
      ...MultipleLinks(
        "https://discord.com/oauth2/authorize?client_id=1028785995337977856&permissions=1504178465975&scope=bot",
        "/add",
        "/invite",
        "/bot"
      ),
      ...MultipleLinks(
        "https://www.craft.do/s/LDE5iUWkkRLnnA",
        "/privacy",
        "/tos",
        "/terms",
        "/terms-of-serivce",
        "/privacy-policy",
        "/policy"
      ),
      ...MultipleLinks(
        "https://www.craft.do/s/JJVExvuEq3ftaw",
        "/feature-tracker",
        "/upcoming",
        "/to-do",
        "/planned-changes",
        "/roadmap"
      ),
      ...MultipleLinks(
        "https://docs.trtle.xyz/pro/custom-bots",
        "/learn/custom-bots",
        "/learn/custom-bot",
        "/learn/custom"
      ),
      ...MultipleLinks(
        "https://docs.trtle.xyz/tickets/about",
        "/learn/tickets",
        "/learn/ticket",
        "/learn/private-tickets"
      ),
      ...MultipleLinks(
        "https://docs.trtle.xyz/pro/troubleshooting",
        "/learn/custom-bots-troubleshooting",
        "/learn/custom-bots-faq",
        "/learn/custom-bots-help"
      ),
      ...MultipleLinks(
        "https://my.forms.app/turtlepaw/beep-boop-beta",
        "/beta",
        "/beta-testing",
        "/join-beta"
      ),
    ];
  },
  webpack: {
    plugins: [
      new webpack.NormalModuleReplacementPlugin(/node:/, (resource) => {
        resource.request = resource.request.replace(/^node:/, "");
      }),
    ],
  },
};

module.exports = nextConfig;
