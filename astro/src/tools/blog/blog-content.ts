import { BlogFrontmatter } from './blog-frontmatter';
import { Render } from 'astro:content';

export interface BlogContent {
  id: string;
  slug: string;
  body: string;
  collection: 'blog';
  data: BlogFrontmatter;
  render(): Render['.mdx' | '.md']
}
