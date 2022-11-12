import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
    apiKey: 'AIzaSyBM27DnL4-Upq3lT0fDAOcF3aY1scRwmNA',
    authDomain: 'sharespace-60dd2.firebaseapp.com',
    projectId: 'sharespace-60dd2',
    storageBucket: 'sharespace-60dd2.appspot.com',
    messagingSenderId: '917089501729',
    appId: '1:917089501729:web:3b27db5f8f4062a992d960',
    measurementId: 'G-LX08LM5Y7K',
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
export const fromMillis = firebase.firestore.Timestamp.fromMillis;
export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;
export const increment = firebase.firestore.FieldValue.increment;

export const STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED;
export async function getUserWithUsername(username) {
    const usersRef = firestore.collection('users');
    const query = usersRef.where('username', '==', username).limit(1);
    const userDoc = (await query.get()).docs[0];
    return userDoc;
}

export function postToJSON(doc) {
    const data = doc.data();
    return {
        ...data,
        createdAt: data.createdAt.toMillis(),
        updatedAt: data.updatedAt.toMillis(),
    };
}
