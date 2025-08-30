
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
  deleteDoc,
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

// Delete an expense
export async function deleteExpense(expenseId: string): Promise<void> {
  const expenseRef = doc(db, 'expenses', expenseId);
  await deleteDoc(expenseRef);
}

// Save all expenses for the user (uses a batch write)
export async function saveExpenses(expenses: Expense[]): Promise<void> {
  const batch = writeBatch(db);
  const expensesCollection = collection(db, 'expenses').withConverter(expenseConverter);

  // First, get all existing expenses for the user
  const q = query(expensesCollection, where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  const existingExpenses = new Map(querySnapshot.docs.map(d => [d.id, d.data()]));
  const draftExpenseIds = new Set(expenses.map(e => e.id));

  // Delete expenses that are in Firestore but not in the draft state
  for (const [id] of existingExpenses) {
    if (!draftExpenseIds.has(id)) {
      batch.delete(doc(db, 'expenses', id));
    }
  }

  // Create or update expenses from the draft state
  expenses.forEach(expense => {
    if (expense.id.startsWith('temp-')) {
      // This is a new expense, create it
      const docRef = doc(expensesCollection);
      const { id, ...expenseData } = expense;
      batch.set(docRef, expenseData as Omit<Expense, 'id'>);
    } else {
       // This is an existing expense, we don't support updating expenses for now
    }
  });

  await batch.commit();
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

// Delete a financial goal
export async function deleteGoal(goalId: string): Promise<void> {
  const goalRef = doc(db, 'goals', goalId);
  await deleteDoc(goalRef);
}

// Save all goals for the user
export async function saveGoals(goals: FinancialGoal[]): Promise<void> {
    const batch = writeBatch(db);
    const goalsCollection = collection(db, 'goals').withConverter(goalConverter);

    const q = query(goalsCollection, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const existingGoals = new Map(querySnapshot.docs.map(d => [d.id, d.data()]));
    const draftGoalIds = new Set(goals.map(g => g.id));

    // Delete goals that are no longer in the draft state
    for (const [id] of existingGoals) {
        if (!draftGoalIds.has(id)) {
            batch.delete(doc(db, 'goals', id));
        }
    }

    // Create or update goals from the draft state
    goals.forEach(goal => {
        if (goal.id.startsWith('temp-')) {
            const docRef = doc(goalsCollection);
            const { id, ...goalData } = goal;
            batch.set(docRef, goalData as Omit<FinancialGoal, 'id'>);
        } else {
            const docRef = doc(db, 'goals', goal.id);
            batch.update(docRef, { currentAmount: goal.currentAmount });
        }
    });

    await batch.commit();
}
