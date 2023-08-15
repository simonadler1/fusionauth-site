import { getCollection } from 'astro:content';
import { marked } from 'marked';

const getAllEntries = (blogs, attribute) => {
  const reducer = (entries, entry) => {
    if (!entries.includes(entry)) {
      entries.push(entry);
    }
    return entries;
  }
  return blogs.flatMap(blog => blog.data[attribute]
      .split(',')
      .map(entry => entry.trim()))
      .filter(entry => !!entry)
      .reduce(reducer, []);
};

export const sortByDate = (a,b) => {
  const aDate = a.data.updated_date ? a.data.updated_date : a.data.publish_date;
  const bDate = b.data.updated_date ? b.data.updated_date : b.data.publish_date;
  if (aDate > bDate) {
    return -1;
  } else if (aDate == bDate) {
    return 0;
  } else {
    return 1;
  }
};



export const getStaticIndexPaths = async (paginate, attribute, paramName) => {
  const blogs = await getCollection('blog');
  const allTags = getAllEntries(blogs, attribute)
  return allTags.map((target) => {

    const filteredPosts = blogs.filter((post) => post.data[attribute].includes(target));
    // newest first
    filteredPosts.sort(sortByDate);
    const params = {} as any;
    params[paramName] = target.trim().replaceAll(' ', '-').toLowerCase();

    // Put the readable name into the astro props
    const props = {} as any;
    props[paramName + "Name"] = target;

    return paginate(filteredPosts, {
      params,
      props,
      pageSize: 7
    });
  });
}

export const getStaticTagPaths = async (paginate) => getStaticIndexPaths(paginate, 'tags', 'tag');
export const getStaticCategoryPaths = async (paginate) => getStaticIndexPaths(paginate, 'categories', 'category');
export const getStaticAuthorPaths = async (paginate) => getStaticIndexPaths(paginate, 'authors', 'author');
