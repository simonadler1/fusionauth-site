import { BlogContent } from './blog-content';
import { marked } from 'marked';
import { ParsedBlog } from './parsed-blog';

/**
 * Takes in the blog content as returned from getCollection and parses it to a friendly object for the blog pages to use.
 *
 * This will grab and render the content above the `excerpt_separator` as markdown after stripping off any imports.
 * Authors, Categories, Tags will be split by comma and added to object. The slug will be added, and the rest of the frontmatter
 * will be present
 *
 * @param blog to be parsed.
 */
export const parseContent = (blog: BlogContent): ParsedBlog => {
  // parse the excerpt "blurb"
  const blurbLines: string[] = [];
  const separator = blog.data.excerpt_separator;
  const lines = blog.body.split('\n');

  for (let line of lines) {
    // stop at the excerpt_separator line
    if (separator && line.includes(separator)) {
      break;
    }

    // filter out imports
    if (line && !line.trim().startsWith('import')) {
      blurbLines.push(line);
    }
  }

  // trim the blurb handling any links in the markdown
  let preblurb = blurbLines.join('\n');
  let blurb = preblurb;
  if (preblurb.length > 160) {
    blurb = preblurb.substring(0, 160);
    // handle when someone put a link in the blurb and it is in the middle of the cutoff. kinda hacky, sorry
    const linkOpen = blurb.lastIndexOf('[');
    let linkClose = blurb.lastIndexOf(')');
    if (linkOpen > 1 && linkClose < linkOpen) {
      linkClose = preblurb.substring(linkOpen).indexOf(')');
      if (linkClose > 0) {
        blurb = preblurb.substring(0, linkOpen + linkClose + 1);
      }
    }
    blurb = blurb + '...';
  }
  blurb = marked.parse(blurb);

  // split frontmatter lists to arrays
  const categories = blog.data.categories.split(',').map(cat => cat.trim());
  const tags = blog.data.tags.split(',').map(tag => tag.trim());
  const authors = blog.data.authors.split(',').map(author => author.trim());

  return {
    ...blog.data,
    blurb,
    slug: blog.slug,
    categories,
    tags,
    authors
  };
};
