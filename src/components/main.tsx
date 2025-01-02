import Link from 'next/link';

const POSTS_PER_PAGE = 5;

export async function getServerSideProps(context: {
  query: { page?: string };
}) {
  const page = parseInt(context.query.page || '1', 10);
  const res = await fetch('https://jsonplaceholder.typicode.com/posts');
  const allPosts = await res.json();
  const totalPosts = allPosts.length;

  const startIndex = (page - 1) * POSTS_PER_PAGE;
  const posts = allPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  return {
    props: {
      posts,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / POSTS_PER_PAGE),
    },
  };
}

function Pagination({
  currentPage,
  totalPages,
  baseUrl,
}: {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}) {
  const getPaginationRange = () => {
    const delta = 2;
    const range: (string | number)[] = [];
    const left = Math.max(1, currentPage - delta);
    const right = Math.min(totalPages, currentPage + delta);

    for (let i = left; i <= right; i++) {
      range.push(i);
    }

    if (left > 2) {
      range.unshift('...');
      range.unshift(1);
    } else if (left === 2) {
      range.unshift(1);
    }

    if (right < totalPages - 1) {
      range.push('...');
      range.push(totalPages);
    } else if (right === totalPages - 1) {
      range.push(totalPages);
    }

    return range;
  };

  const paginationRange = getPaginationRange();

  return (
    <div className="flex items-center justify-center space-x-2 mt-8">
      <Link
        href={`${baseUrl}?page=${currentPage - 1}`}
        className={`px-4 py-2 rounded-lg ${
          currentPage === 1
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-white text-black border-2 border-black hover:bg-black hover:text-white transition'
        }`}
      >
        Previous
      </Link>

      {paginationRange.map((page, index) =>
        typeof page === 'number' ? (
          <Link
            key={index}
            href={`${baseUrl}?page=${page}`}
            className={`px-4 py-2 rounded-lg ${
              page === currentPage
                ? 'bg-black text-white'
                : 'bg-white text-black border border-black hover:bg-black hover:text-white transition'
            }`}
          >
            {page}
          </Link>
        ) : (
          <span key={index} className="px-4 py-2 text-gray-500">
            {page}
          </span>
        ),
      )}

      <Link
        href={`${baseUrl}?page=${currentPage + 1}`}
        className={`px-4 py-2 rounded-lg ${
          currentPage === totalPages
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-white text-black border-2 border-black hover:bg-black hover:text-white transition'
        }`}
      >
        Next
      </Link>
    </div>
  );
}

export default function BlogIndex({
  posts,
  currentPage,
  totalPages,
}: {
  posts: { id: number; title: string; body: string }[];
  currentPage: number;
  totalPages: number;
}) {
  return (
    <div className="hero min-h-screen mt-10">
      <header className="text-white py-16">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-extrabold">Welcome to Our Blog</h1>
          <p className="mt-4 text-lg">
            Discover insights, ideas, and inspiration.
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-black shadow-lg opacity-80 rounded-lg p-6 hover:shadow-2xl transition-shadow"
            >
              <h2 className="text-2xl font-bold text-white">{post.title}</h2>
              <p className="text-[#eee] mt-4">
                {post.body.substring(0, 100)}...
              </p>
              <Link
                href={`/blog/${post.id}`}
                className="text-blue-500 mt-4 inline-block"
              >
                Read More →
              </Link>
            </div>
          ))}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          baseUrl="/blog"
        />
      </div>
    </div>
  );
}
