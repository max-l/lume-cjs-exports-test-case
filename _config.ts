import lume from "lume/mod.ts";
import esbuild from "lume/plugins/esbuild.ts";
import sourceMaps from "lume/plugins/source_maps.ts";

import tailwindcss from "lume/plugins/tailwindcss.ts";
import postcss from "lume/plugins/postcss.ts";

const site = lume();

site
  .ignore("README.md")
  .ignore("app")
  .use(esbuild({
    extensions: [".jsx"],
    options: {
        jsxDev: true,
        minify: false
    },
    esm: {
        dev: true,
        cjsExports: {
            "react-table": "useTable,useExpanded"
        }
    }
  }))
  .use(sourceMaps({
    sourceContent: true,
  })).use(tailwindcss({
    extensions: [".html", ".jsx"]
  })).use(postcss())
;

export default site;
