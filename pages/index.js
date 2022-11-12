import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import Link from 'next/link';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import { firestore, postToJSON, fromMillis } from '../lib/firebase';
import PostFeed from '../components/PostFeed';
import { useState } from 'react';
import Metatags from '../components/Metatags';
const LIMIT = 5;

export async function getServerSideProps(context) {
    const postsQuery = firestore
        .collectionGroup('posts')
        .where('published', '==', true)
        .orderBy('createdAt', 'desc')
        .limit(LIMIT);
    const posts = (await postsQuery.get()).docs.map(postToJSON);
    return {
        props: { posts },
    };
}

export default function Home(props) {
    const [posts, setPosts] = useState(props.posts);
    const [loading, setLoading] = useState(false);
    const [postsEnd, setPostsEnd] = useState(false);

    const fetchPosts = async () => {
        console.log(posts);
        setLoading(true);
        const last = posts[posts.length - 1];
        const cursor =
            typeof last?.createdAt === 'number'
                ? fromMillis(last?.createdAt)
                : last?.createdAt;
        const query = firestore
            .collectionGroup('posts')
            .where('published', '==', true)
            .orderBy('createdAt', 'desc')
            .startAfter(cursor)
            .limit(LIMIT);

        const newPosts = (await query.get()).docs.map((doc) => doc.data());
        setPosts(posts.concat(newPosts));
        setLoading(false);

        if (newPosts.length < LIMIT) {
            setPostsEnd(true);
        }
    };

    return (
        <main className="homepage">
            <Metatags
                title="Sharespace"
                desc="A space to share your thoughts!"
            />
            <PostFeed posts={posts} />

            {!loading && !postsEnd && (
                <button className="button btn-grey" onClick={fetchPosts}>
                    Load more!
                </button>
            )}

            <Loader show={loading} />
            {postsEnd && 'There are no more posts to fetch!'}
        </main>
    );
}
