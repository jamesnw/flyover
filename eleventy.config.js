import pluginRss from "@11ty/eleventy-plugin-rss";
import pluginBundle from "@11ty/eleventy-plugin-bundle";
import pluginNavigation from "@11ty/eleventy-navigation";
import { EleventyHtmlBasePlugin } from "@11ty/eleventy";
import { EleventyRenderPlugin } from "@11ty/eleventy";
import pluginWebc from "@11ty/eleventy-plugin-webc";

/** @param {import('@11ty/eleventy').UserConfig} eleventyConfig */
export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({
    "./public/": "/",
    "node_modules/@picocss/pico/css/pico.fuchsia.min.css":
      "/css/pico.fuchsia.min.css",
  });

  eleventyConfig.setFrontMatterParsingOptions({
    language: "json",
  });

  eleventyConfig.addCollection("birds", function (collection) {
    const birds = {};
    collection.getFilteredByTag("recording").forEach((call) => {
      const uniqueBirds = new Set(call.data.detections.map((detection) => detection.species));
      uniqueBirds.forEach((bird) => {
        birds[bird] = birds[bird] ?? [];
        birds[bird].push({ call, bird: { species: bird } });
      });
    });
    return birds;
  });

  eleventyConfig.addPlugin(pluginRss);

  eleventyConfig.addPlugin(pluginNavigation);
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
  eleventyConfig.addPlugin(pluginBundle);

  eleventyConfig.addPlugin(pluginWebc);
  eleventyConfig.addPlugin(EleventyRenderPlugin);

  eleventyConfig.addShortcode("currentBuildDate", () => {
    return new Date().toISOString();
  });
  return {
    templateFormats: ["md", "njk", "html", "json"],

    markdownTemplateEngine: "njk",

    htmlTemplateEngine: "njk",
    dir: {
      input: "content", // default: "."
      includes: "../_includes", // default: "_includes"
      data: "_data", // default: "_data"
      output: "_site",
    },
  };
}
