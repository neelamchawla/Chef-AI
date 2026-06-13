import {
  collection,
  doc,
  setDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import { db, firebaseEnabled } from '../firebase/config';

export function subscribeToLatestPlan(userId, callback) {
  if (!firebaseEnabled || !userId) {
    callback(null);
    return () => {};
  }

  const plansRef = collection(db, 'users', userId, 'mealPlans');
  const q = query(plansRef, orderBy('createdAt', 'desc'), limit(1));

  return onSnapshot(q, (snapshot) => {
    if (snapshot.empty) {
      callback(null);
      return;
    }
    callback({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
  });
}

export async function savePlan(userId, planData) {
  if (!firebaseEnabled || !userId) return null;

  const planRef = doc(collection(db, 'users', userId, 'mealPlans'));
  const payload = {
    ...planData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  await setDoc(planRef, payload);
  return planRef.id;
}

export async function saveTodos(userId, todos) {
  if (!firebaseEnabled || !userId) return;

  const todoRef = doc(db, 'users', userId, 'todos', 'current');
  await setDoc(todoRef, { items: todos, updatedAt: serverTimestamp() }, { merge: true });
}

export async function saveGroceryList(userId, groceryList) {
  if (!firebaseEnabled || !userId) return;

  const groceryRef = doc(db, 'users', userId, 'groceryLists', 'current');
  await setDoc(groceryRef, { ...groceryList, updatedAt: serverTimestamp() }, { merge: true });
}

export function subscribeToTodos(userId, callback) {
  if (!firebaseEnabled || !userId) {
    callback([]);
    return () => {};
  }

  const todoRef = doc(db, 'users', userId, 'todos', 'current');
  return onSnapshot(todoRef, (snap) => {
    callback(snap.exists() ? snap.data().items || [] : []);
  });
}
