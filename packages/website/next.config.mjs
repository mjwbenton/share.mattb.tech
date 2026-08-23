import detectFrontmatter from "remark-frontmatter";
import extractFrontmatter from "remark-extract-frontmatter";
import gfm from "remark-gfm";
import {
  remarkDefinitionList,
  defListHastHandlers,
} from "remark-definition-list";
import yaml from "yaml";
import { plugin as mdxDataFetching } from "@mattb.tech/data-fetching";
import { plugin as remarkFlickr } from "@mattb.tech/remark-flickr";
import rehypePrism from "@mapbox/rehype-prism";
import nextPluginPreval from "next-plugin-preval/config.js";
import bundleAnalyzer from "@next/bundle-analyzer";
import mdx from "@next/mdx";

const SHARE_MODE = process.env.SHARE_MODE;
const isShareMode = SHARE_MODE === "true";

const withMDX = mdx({
  options: {
    remarkPlugins: [
      detectFrontmatter,
      [
        extractFrontmatter,
        { name: "pageMeta", yaml: yaml.parse, throws: true },
      ],
      gfm,
      remarkDefinitionList,
      mdxDataFetching,
      [remarkFlickr, { sizes: "100vw" }],
    ],
    rehypePlugins: [rehypePrism],
    remarkRehypeOptions: {
      handlers: {
        ...defListHastHandlers,
      },
    },
  },
});

export default nextPluginPreval()(
  bundleAnalyzer({ enabled: process.env.ANALYZE === "true" })(
    withMDX({
      output: "export",
      pageExtensions: ["tsx", "mdx"],
      reactStrictMode: true,
      eslint: {
        dirs: ["pages", "src"],
      },
      env: {
        SHARE_MODE,
      },
      distDir: isShareMode ? "out-share" : "out-lonesome",
    }),
  ),
);
