import { getApp, initializeApp } from "firebase/app";
import { getAuth,
         signInWithEmailAndPassword,
         UserCredential,
         User,
         createUserWithEmailAndPassword,
         sendEmailVerification,
         updateProfile } from "firebase/auth";



const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
    // databaseURL: process.env.DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID
};

try {
  getApp();
} catch {
  initializeApp(firebaseConfig);
}

const auth = getAuth();

export async function firebaseSignIn(email: string, password: string): Promise<User>{
  
  const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  return user;
}

export async function firebaseSignOut(): Promise<void> {
  await auth.signOut();
}


export async function firebaseRegister(name: string, email: string, password: string) {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    
    if (!auth.currentUser) return;

    await sendEmailVerification(auth.currentUser);

    await updateProfile(auth.currentUser, { displayName: name });
  } catch (err: any) {
    
    throw err.message;
  }
};