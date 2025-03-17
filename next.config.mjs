import createNextIntlPlugin from "next-intl/plugin";

const nextConfig = { output: "standalone" };

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
