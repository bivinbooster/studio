
import { db } from './firebase';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  writeBatch,
  Timestamp,
  increment,
  limit,
} from 'firebase/firestore';
import type { Expense, Budget, FinancialGoal } from './types';

// Hardcoded user ID for demonstration purposes.
// In a real app, this would come from an authentication service.
const userId = 'new-user-test';

// --- Type Converters for Firestore ---
// These helpers ensure that data is correctly typed when moving between
// the application and Firestore, especially for things like Dates.

const expenseConverter = {
  toFirestore: (expense: Omit<Expense, 'id'>) => {
    return {
      ...expense,
      date: Timestamp.fromDate(expense.date),
      userId,
    };
  },
  fromFirestore: (snapshot: any, options: any): Expense => {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      ...data,
      date: data.date.toDate(),
    } as Expense;
  },
};

const budgetConverter = {
  toFirestore: (budget: Budget) => {
    return { ...budget, userId };
  },
  fromFirestore: (snapshot: any, options: any): Budget => {
    const data = snapshot.data(options);
    return data as Budget;
  },
};

const goalConverter = {
  toFirestore: (goal: Omit<FinancialGoal, 'id'>) => {
    return { ...goal, userId };
  },
  fromFirestore: (snapshot: any, options: any): FinancialGoal => {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      ...data,
    } as FinancialGoal;
  },
};

// --- Data Service Functions ---

// Fetch all expenses for the user
export async function getExpenses(): Promise<Expense[]> {
  const q = query(
    collection(db, 'expenses'),
    where('userId', '==', userId)
  ).withConverter(expenseConverter);

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs
    .map((doc) => doc.data())
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}

// Add a new expense
export async function addExpense(
  newExpense: Omit<Expense, 'id'>
): Promise<Expense> {
  const docRef = await addDoc(
    collection(db, 'expenses').withConverter(expenseConverter),
    newExpense
  );
  return { ...newExpense, id: docRef.id };
}

// Fetch all budgets for the user
export async function getBudgets(): Promise<Budget[]> {
  const q = query(
    collection(db, 'budgets'),
    where('userId', '==', userId)
  ).withConverter(budgetConverter);

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data());
}

// Save all budgets for the user (uses a batch write)
export async function saveBudgets(budgets: Budget[]): Promise<void> {
  const batch = writeBatch(db);
  const budgetsCollection = collection(db, 'budgets').withConverter(
    budgetConverter
  );

  // First, query existing budgets to decide whether to update or create
  const q = query(budgetsCollection, where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  const existingBudgets = new Map(
    querySnapshot.docs.map((d) => [d.data().category, d.id])
  );

  budgets.forEach((budget) => {
    const existingDocId = existingBudgets.get(budget.category);
    if (existingDocId) {
      // Update existing budget
      const docRef = doc(db, 'budgets', existingDocId);
      batch.update(docRef, { amount: budget.amount });
    } else {
      // Create new budget
      const docRef = doc(budgetsCollection);
      batch.set(docRef, budget);
    }
  });

  await batch.commit();
}


// Fetch all financial goals for the user
export async function getGoals(): Promise<FinancialGoal[]> {
  const q = query(
    collection(db, 'goals'),
    where('userId', '==', userId)
  ).withConverter(goalConverter);

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data());
}

// Add a new financial goal
export async function addGoal(
  newGoal: Omit<FinancialGoal, 'id' | 'currentAmount'>
): Promise<FinancialGoal> {
  const goalWithCurrentAmount = { ...newGoal, currentAmount: 0 };
  const docRef = await addDoc(
    collection(db, 'goals').withConverter(goalConverter),
    goalWithCurrentAmount as any // Firestore converter handles this
  );
  return { ...goalWithCurrentAmount, id: docRef.id };
}

// Contribute to a financial goal
export async function contributeToGoal(
  goalId: string,
  amount: number
): Promise<void> {
  const goalRef = doc(db, 'goals', goalId);
  await updateDoc(goalRef, {
    currentAmount: increment(amount),
  });
}
