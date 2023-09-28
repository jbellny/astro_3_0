import rss from "@astrojs/rss"
import type { APIContext } from "astro"
import { getCollection } from "astro:content"
import MarkdownIt from "markdown-it"
import sanitzeHtml from "sanitize-html"

const parser = new MarkdownIt()

export async function GET(context: APIContext) {
  const posts = await getCollection("posts")
  return rss({
    title: "Rhythm Nation",
    description: "A community of music producers and enthusiasts.",
    site: context.site?.toString() ?? "",
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: new Date(post.data.date),
      description: post.data.description,
      // compute RSS link from post `slug`
      // This example assumes all posts are rendered as `/blog/[slug]` routes
      link: `/blog/${post.slug}`,
      content: sanitzeHtml(parser.render(post.body)),
      image: post.data.image,
    })),
  })
}
