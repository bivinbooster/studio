'use server';

/**
 * @fileOverview Analyzes spending patterns and provides personalized recommendations on where users can reduce costs.
 *
 * - getSpendingInsights - A function that handles the analysis of spending patterns and provides personalized recommendations.
 * - SpendingInsightsInput - The input type for the getSpendingInsights function.
 * - SpendingInsightsOutput - The return type for the getSpendingInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SpendingInsightsInputSchema = z.object({
  spendingData: z.string().describe('JSON string of user spending data including category and amount.'),
  budgetGoals: z.string().describe('JSON string of user budget goals for each spending category.'),
});
export type SpendingInsightsInput = z.infer<typeof SpendingInsightsInputSchema>;

const SpendingInsightsOutputSchema = z.object({
  summary: z.string().describe('A summary of spending patterns and recommendations for cost reduction.'),
});
export type SpendingInsightsOutput = z.infer<typeof SpendingInsightsOutputSchema>;

export async function getSpendingInsights(input: SpendingInsightsInput): Promise<SpendingInsightsOutput> {
  return spendingInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'spendingInsightsPrompt',
  input: {schema: SpendingInsightsInputSchema},
  output: {schema: SpendingInsightsOutputSchema},
  prompt: `You are a personal finance advisor. Analyze the user's spending data and budget goals to provide personalized recommendations on where they can reduce costs.

Spending Data: {{{spendingData}}}
Budget Goals: {{{budgetGoals}}}

Provide a concise summary of spending patterns and specific, actionable recommendations for cost reduction. Focus on areas where the user is overspending compared to their budget goals.`,
});

const spendingInsightsFlow = ai.defineFlow(
  {
    name: 'spendingInsightsFlow',
    inputSchema: SpendingInsightsInputSchema,
    outputSchema: SpendingInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
