import { getApps, initializeApp } from 'firebase/app';
import {
  getAuth,
  sendEmailVerification,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  type User as FirebaseUser
} from 'firebase/auth';
import {
  doc,
  getFirestore,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  deleteDoc,
  onSnapshot,
  type Unsubscribe
} from 'firebase/firestore';
import { Role, User } from '../types';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

export const isFirebaseConfigured = Object.values(firebaseConfig).every(Boolean);

const firebaseApp = isFirebaseConfigured
  ? (getApps()[0] || initializeApp(firebaseConfig))
  : null;
const firebaseAuth = firebaseApp ? getAuth(firebaseApp) : null;
const firestore = firebaseApp ? getFirestore(firebaseApp) : null;

export async function getFirebaseCollection<T>(name: string): Promise<T[] | null> {
  if (!firestore) return null;
  const snapshot = await getDocs(collection(firestore, name));
  return snapshot.docs.map(item => item.data() as T);
}

export async function setFirebaseDocument<T extends object>(collectionName: string, id: string, data: T): Promise<void> {
  if (!firestore) throw new Error('Firebase n’est pas configuré.');
  await setDoc(doc(firestore, collectionName, id), data);
}

export async function deleteFirebaseDocument(collectionName: string, id: string): Promise<void> {
  if (!firestore) throw new Error('Firebase n’est pas configuré.');
  await deleteDoc(doc(firestore, collectionName, id));
}

export function subscribeToFirebaseCollection<T>(
  name: string,
  callback: (items: T[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  if (!firestore) return () => undefined;
  return onSnapshot(
    collection(firestore, name),
    snapshot => callback(snapshot.docs.map(item => item.data() as T)),
    error => onError?.(error)
  );
}

function toAppUser(firebaseUser: FirebaseUser, profile: Partial<User> = {}): User {
  return {
    id: firebaseUser.uid,
    name: profile.name || firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Utilisateur',
    email: firebaseUser.email || '',
    role: profile.role || 'client',
    phone: profile.phone,
    companyName: profile.companyName,
    avatar: profile.avatar || firebaseUser.photoURL || undefined,
    country: profile.country,
    address: profile.address,
    createdAt: profile.createdAt || new Date().toISOString()
  };
}

function requireFirebase() {
  if (!firebaseAuth || !firestore) {
    throw new Error('Firebase n’est pas configuré. Ajoutez les variables VITE_FIREBASE_* dans l’environnement.');
  }
  return { auth: firebaseAuth, db: firestore };
}

export async function registerWithFirebase(data: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  companyName?: string;
  role?: Role;
}): Promise<User> {
  const { auth, db } = requireFirebase();
  const credentials = await createUserWithEmailAndPassword(auth, data.email.trim().toLowerCase(), data.password);
  await sendEmailVerification(credentials.user);

  const user = toAppUser(credentials.user, {
    name: data.name,
    phone: data.phone,
    companyName: data.companyName,
    role: data.role || 'client'
  });
  await setDoc(doc(db, 'users', credentials.user.uid), user);
  await signOut(auth);
  return user;
}

export async function createManagedUserWithFirebase(data: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  companyName?: string;
  role: Role;
}): Promise<User> {
  if (!firebaseApp || !firestore) {
    throw new Error('Firebase n’est pas configuré.');
  }

  const managedApp = initializeApp(firebaseConfig, `managed-user-${Date.now()}`);
  const managedAuth = getAuth(managedApp);
  try {
    const credentials = await createUserWithEmailAndPassword(
      managedAuth,
      data.email.trim().toLowerCase(),
      data.password
    );
    await sendEmailVerification(credentials.user);
    const user = toAppUser(credentials.user, {
      name: data.name,
      phone: data.phone,
      companyName: data.companyName,
      role: data.role
    });
    await setDoc(doc(firestore, 'users', credentials.user.uid), user);
    return user;
  } finally {
    await signOut(managedAuth);
  }
}

export async function loginWithFirebase(email: string, password: string): Promise<User> {
  const { auth, db } = requireFirebase();
  const credentials = await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
  if (!credentials.user.emailVerified) {
    await signOut(auth);
    throw new Error('Veuillez vérifier votre adresse email avant de vous connecter.');
  }

  const profileSnapshot = await getDoc(doc(db, 'users', credentials.user.uid));
  const profile = profileSnapshot.exists() ? profileSnapshot.data() as Partial<User> : {};
  return toAppUser(credentials.user, profile);
}

export async function logoutFromFirebase(): Promise<void> {
  if (firebaseAuth) {
    await signOut(firebaseAuth);
  }
}

export async function updateFirebaseUser(userId: string, data: Partial<User>): Promise<void> {
  const { db } = requireFirebase();
  await updateDoc(doc(db, 'users', userId), data);
}
