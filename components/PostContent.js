import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

export default function PostContent({ post }) {
    const createdAt =
        typeof post?.createdAt === 'number'
            ? new Date(post.createdAt)
            : post.createdAt.toDate();
    return (
        <div className="post-content">
            <h1 className='post-title'>{post?.title}</h1>
            <span className='post-author'>
                Written by{' '}
                <Link href={`/${post.username}`}>@{post.username}</Link>
                {'  '}on {createdAt.toISOString()}
            </span>

            <ReactMarkdown>{post?.content}</ReactMarkdown>
        </div>
    );
}
