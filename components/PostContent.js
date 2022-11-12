import { formatRelative } from 'date-fns';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { capitalize } from '../lib/helper';

export default function PostContent({ post }) {

    return (
        <div className="post-content">
            <h1 className="post-title">{post?.title}</h1>
            <span className="post-author">
                Written by{' '}
                <Link href={`/${post.username}`}>@{post.username}</Link>
                {'  '}on{' '}
                {post.createdAt
                    ? post.createdAt.seconds
                        ? capitalize(
                              formatRelative(
                                 post.createdAt.seconds * 1000,
                                  Date.now()
                              )
                          )
                        : capitalize(formatRelative(post.createdAt, Date.now()))
                    : null}
            </span>

            <ReactMarkdown>{post?.content}</ReactMarkdown>
        </div>
    );
}
 