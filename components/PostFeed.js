import Link from 'next/link';
import { formatRelative } from 'date-fns';
import { capitalize } from '../lib/helper';

export default function PostFeed({ posts, admin }) {
    return (
        <div className="post-list">
            {posts
                ? posts.map((post) => (
                      <PostItem post={post} key={post.slug} admin={admin} />
                  ))
                : null}
        </div>
    );
}

function PostItem({ post, admin = false }) {
    const wordCount = post?.content.trim().split(/\s+/g).length;
    const minutesToRead = (wordCount / 100 + 1).toFixed(0);
    return (
        <div className="post">
            <div className="post-header">
                <Link href={`/${post.username}`}>
                    @{post.username} •{' '}
                    {post.createdAt
                        ? post.createdAt.seconds
                            ? capitalize(
                                  formatRelative(
                                      post.createdAt.seconds * 1000,
                                      Date.now()
                                  )
                              )
                            : capitalize(
                                  formatRelative(post.createdAt, Date.now())
                              )
                        : null}
                </Link>
                {admin ? (
                    <Link href={`/manage/${post.slug}`}>
                        <button className="button btn-blue btn-edit">
                            Edit
                        </button>
                    </Link>
                ) : null}
            </div>
            <Link href={`/${post.username}/${post.slug}`}>
                <h1>{post.title}</h1>
            </Link>
            <footer>
                <div>💖 {post.heartCount} Hearts</div>

                <div>
                    {wordCount} words. {minutesToRead} min read
                </div>
            </footer>
        </div>
    );
}
