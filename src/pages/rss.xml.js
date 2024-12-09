import rss, { pagesGlobToRssItems } from "@astrojs/rss"

export async function GET(context){
    return rss({
        title: "Atro Blog",
        description: "A blog about Astro",
        site: context.site,
        items: await pagesGlobToRssItems(import.meta.glob("./**/*.md")),
        customData: `<language>en-us</language>`
    })
}