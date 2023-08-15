import { getCollection } from 'astro:content';
import { sortByDate } from '../../pages/blog/blog-tools';
import { PaginateFunction, PaginateOptions } from 'astro';

/**
 * Returns data for GetStaticPaths for the blog landing page
 * @param paginate
 */
export const getLatestStaticPaths = async(paginate: PaginateFunction) => {
  const blogs = await getCollection('blog');
  // newest first
  blogs.sort(sortByDate);
  return paginate(blogs, {
    pageSize: 7
  } as PaginateOptions);
}
