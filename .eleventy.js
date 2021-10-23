module.exports = function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy("site/content/**/*.jpeg");
    eleventyConfig.addPassthroughCopy("site/content/**/*.jpg");
    eleventyConfig.addPassthroughCopy("site/content/**/*.png");
    eleventyConfig.addPassthroughCopy("site/content/**/*.webp");
    eleventyConfig.addPassthroughCopy("site/content/**/*.gif");
    eleventyConfig.addPassthroughCopy({'site/css': "/"})
    eleventyConfig.addCollection("postDesc", function(collectionApi) {
        return collectionApi.getFilteredByTag("post").sort(function(a, b) {
            return b.date - a.date;
        });
    });
    return {
        dir: {
            input: "./site/content",
            includes: "./layouts",
            output: "./site/dist"
        }
    };
};
