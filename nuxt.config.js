import bodyParser from "body-parser";
export default {
  head: {
    title: "The next INT Titans Magic Block !"
  },
  meta: [
    { charset: "utf-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1" }
  ],
  modules: ["@nuxtjs/axios"],
  serverMiddleware: [bodyParser.json(), "~/api"]
};
