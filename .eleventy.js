const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const markdownItContainer = require("markdown-it-container");
const path = require("path");
const Image = require("@11ty/eleventy-img");
const { eleventyImageTransformPlugin } = Image;

const CALLOUTS = {
  info: {
    label: "Info",
    icon: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
  },
  caution: {
    label: "Caution",
    icon: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>'
  },
  warning: {
    label: "Warning",
    icon: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>'
  }
};

function addCalloutContainer(md, name, modifierClass, config) {
  md.use(markdownItContainer, name, {
    render: function (tokens, idx) {
      if (tokens[idx].nesting === 1) {
        return `<div class="tip-callout callout-${modifierClass}"><span class="tip-title">${config.icon}<span>${config.label}</span></span>\n`;
      } else {
        return '</div>\n';
      }
    }
  });
}

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/fonts");
  eleventyConfig.addPassthroughCopy("src/css/prism");
  eleventyConfig.addPassthroughCopy("src/robots.txt");
  eleventyConfig.addPassthroughCopy("src/files");

  eleventyConfig.addPlugin(syntaxHighlight);

  const md = markdownIt({ html: true, linkify: true });

  md.use(markdownItAnchor, {
    permalink: markdownItAnchor.permalink.headerLink()
  });

  md.use(markdownItContainer, "tip", {
    render: function (tokens, idx) {
      if (tokens[idx].nesting === 1) {
        return '<div class="tip-callout"><span class="tip-title">&gt; TIP:</span>\n';
      } else {
        return '</div>\n';
      }
    }
  });

  addCalloutContainer(md, "info", "info", CALLOUTS.info);
  addCalloutContainer(md, "caution", "caution", CALLOUTS.caution);
  addCalloutContainer(md, "warning", "warning", CALLOUTS.warning);

  eleventyConfig.setLibrary("md", md);

  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/posts/**/*.md")
      .filter(item => !item.data.eleventyExcludeFromCollections)
      .sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addFilter("isoDate", function(date) {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0];
  });

  eleventyConfig.addAsyncShortcode("ogImageUrl", async function(coverPath) {
    if (!coverPath) return "";
    const outArg = process.argv.find(a => a.startsWith("--output="));
    const outDir = outArg ? outArg.split("=")[1] : "_site";
    const srcPath = path.join(__dirname, "src", coverPath.replace(/^\/+/, ""));
    const metadata = await Image(srcPath, {
      widths: [1200],
      formats: ["jpeg"],
      outputDir: path.join(__dirname, outDir, "img"),
      urlPath: "/img/"
    });
    return metadata.jpeg && metadata.jpeg[0] ? metadata.jpeg[0].url : "";
  });

  eleventyConfig.addFilter("cssmin", function(code) {
    if (!code) return "";
    const urls = [];
    let s = String(code).replace(/url\(([^)]+)\)/g, (m) => {
      urls.push(m);
      return `__URL_${urls.length - 1}__`;
    });
    s = s.replace(/\/\*[\s\S]*?\*\//g, "")
         .replace(/\s+/g, " ")
         .replace(/\s*([{}:;,>~+])\s*/g, "$1")
         .replace(/;}/g, "}")
         .trim();
    return s.replace(/__URL_(\d+)__/g, (_, i) => urls[Number(i)]);
  });

  eleventyConfig.addFilter("limit", function(array, limit) {
    if (!array) return [];
    return array.slice(0, limit);
  });

  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    extensions: "html",
    formats: ["avif", "webp", "jpeg"],
    widths: [360, 820, 1440],
    defaultAttributes: {
      loading: "lazy",
      decoding: "async",
      sizes: "(max-width: 820px) 100vw, 820px"
    }
  });

  return {
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dir: {
      input: "src",
      output: "_site"
    }
  };
};
