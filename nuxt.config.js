global.File = typeof window === "undefined" ? Object : window.File;
global.HTMLElement =
  typeof window === "undefined" ? Object : window.HTMLElement;

const parseArgs = require("minimist");
const argv = parseArgs(process.argv.slice(2), {
  alias: {
    H: "hostname",
    p: "port"
  },
  string: ["H"],
  unknown: parameter => false
});

const port =
  argv.port ||
  process.env.PORT ||
  process.env.npm_package_config_nuxt_port ||
  "3000";
const host =
  argv.hostname ||
  process.env.HOST ||
  process.env.npm_package_config_nuxt_host ||
  "localhost";
module.exports = {
  env: {
    baseUrl: process.env.BASE_URL || `http://${host}:${port}`
  },
  plugins: [
    { src: "~/plugins/api" },
    { src: "~/plugins/async-computed.plugin.ts" },
    { src: "~/plugins/bem.plugin.ts" },
    { src: "~/plugins/buefy.plugin.ts" },
    { src: "~/plugins/charts.plugin.ts", ssr: false }
  ],
  head: {
    title: "tt1",
    meta: [
      { charset: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      },
      {
        hid: "description",
        name: "description",
        content: "Nuxt.js project"
      }
    ],
    link: [
      {
        rel: "icon",
        type: "image/x-icon",
        href: "/favicon.ico"
      }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: "#3B8070" },
  /*
  ** Build configuration
  */
  css: ["~/assets/scss/main.scss"],
  build: {
    babel: {
      plugins: ["dynamic-import-node"]
    }
  },
  modules: ["@nuxtjs/axios", "@nuxtjs/dotenv", "~/modules/typescript.js"],
  axios: {}
};
