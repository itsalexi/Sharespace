import { firestore, getUserWithUsername, postToJSON } from '../../lib/firebase';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import PostContent from '../../components/PostContent';
import Metatags from '../../components/Metatags';
import AuthCheck from '../../components/AuthCheck';
import HeartButton from '../../components/HeartButton';
export async function getStaticProps({ params }) {
    const { username, slug } = params;
    const userDoc = await getUserWithUsername(username);

    let post;
    let path;

    if (userDoc) {
        const postRef = userDoc.ref.collection('posts').doc(slug);
        post = postToJSON(await postRef.get());

        path = postRef.path;
    }

    return {
        props: { post, path },
        revalidate: 100,
    };
}

export async function getStaticPaths() {
    const snapshot = await firestore.collectionGroup('posts').get();

    const paths = snapshot.docs.map((doc) => {
        const { slug, username } = doc.data();
        return {
            params: { username, slug },
        };
    });

    return {
        paths,
        fallback: 'blocking',
    };
}

export default function Post(props) {
    console.log(props.post);
    const postRef = firestore.doc(props.path);
    const [realtimePost] = useDocumentData(postRef);

    const post = realtimePost || props.post;

    return (
        <main className="main-post-content">
            <Metatags
                title={post.title}
                desc="This is a post made with Sharespace! Create your own posts today!"
            />
            <section>
                <PostContent post={post} />
            </section>

            <aside className="heart-section">
                <p>{post.heartCount || 0} 💖</p>
                <AuthCheck>
                    <HeartButton postRef={postRef}></HeartButton>
                </AuthCheck>
            </aside>
        </main>
    );
}
