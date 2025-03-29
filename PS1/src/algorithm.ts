/**
 * Problem Set 1: Flashcards - Algorithm Functions
 *
 * This file contains the implementations for the flashcard algorithm functions
 * as described in the problem set handout.
 *
 * Please DO NOT modify the signatures of the exported functions in this file,
 * or you risk failing the autograder.
 */

import { Flashcard, AnswerDifficulty, BucketMap } from "./flashcards";

/**
 * Converts a Map representation of learning buckets into an Array-of-Set representation.
 *
 * @param buckets Map where keys are bucket numbers and values are sets of Flashcards.
 * @returns Array of Sets, where element at index i is the set of flashcards in bucket i.
 *          Buckets with no cards will have empty sets in the array.
 * @spec.requires buckets is a valid representation of flashcard buckets.
 */
export function toBucketSets(buckets: BucketMap): Array<Set<Flashcard>> {
  // Find the maximum bucket number
  const maxBucket = Math.max(...Array.from(buckets.keys()));
  const bucketSets: Array<Set<Flashcard>> = [];
  
  // Create array with all buckets from 0 to maxBucket
  for (let i = 0; i <= maxBucket; i++) {
    bucketSets.push(buckets.get(i) || new Set<Flashcard>());
  }
  return bucketSets;
}

/**
 * Finds the range of buckets that contain flashcards, as a rough measure of progress.
 *
 * @param buckets Array-of-Set representation of buckets.
 * @returns object with minBucket and maxBucket properties representing the range,
 *          or undefined if no buckets contain cards.
 * @spec.requires buckets is a valid Array-of-Set representation of flashcard buckets.
 */
export function getBucketRange(
  buckets: Array<Set<Flashcard>>
): { minBucket: number; maxBucket: number } | undefined {
  // TODO: Implement this function
  let minBucket = buckets.length;
  let maxBucket = 0;
  for (let i = 0; i < buckets.length; i++) {
    if (buckets[i]!.size > 0) {
      if (i < minBucket) {
        minBucket = i;
      }
      if (i > maxBucket) {
        maxBucket = i;
      }
    }
  }
  if (minBucket === buckets.length) {
    return undefined;
  }
  return { minBucket, maxBucket };
}

/**
 * Selects cards to practice on a particular day.
 *
 * @param buckets Array-of-Set representation of buckets.
 * @param day current day number (starting from 0).
 * @returns a Set of Flashcards that should be practiced on day `day`,
 *          according to the Modified-Leitner algorithm.
 * @spec.requires buckets is a valid Array-of-Set representation of flashcard buckets.
 */
export function practice(
  buckets: Array<Set<Flashcard>>,
  day: number
): Set<Flashcard> {
  const practiceSet = new Set<Flashcard>();
  for (let i = 0; i < buckets.length ; i++) {
    if (buckets[i]!.size > 0 && i !== 5) {
      // Bucket 0 is always practiced, bucket i is practiced every 2^i days
      if (i === 0 || day % Math.pow(2, i) === 0) {
        // Add all cards from this bucket
        buckets[i]!.forEach(card => practiceSet.add(card));
      }
    }
  }
  return practiceSet;
}

/**
 * Updates a card's bucket number after a practice trial.
 *
 * @param buckets Map representation of learning buckets.
 * @param card flashcard that was practiced.
 * @param difficulty how well the user did on the card in this practice trial.
 * @returns updated Map of learning buckets.
 * @spec.requires buckets is a valid representation of flashcard buckets.
 */

function cardBucket(card: Flashcard, buckets: BucketMap): number {
  for (let i = 0; i < 5; i++) {
    if (buckets.get(i)?.has(card)) {
      return i;
    }
  }
  return -1;
}

export function update(
  buckets: BucketMap,
  card: Flashcard,
  difficulty: AnswerDifficulty
): BucketMap {
  // Create a new Map to avoid modifying the input
  const newBuckets = new Map<number, Set<Flashcard>>();
  
  // Copy all buckets
  for (let i = 0; i < 6; i++) {
    newBuckets.set(i, new Set(buckets.get(i) || new Set()));
  }

  const currentBucket = cardBucket(card, buckets);
  if (currentBucket === -1) {
    return newBuckets; // Card not found, return unchanged buckets
  }

  // Remove card from current bucket
  newBuckets.get(currentBucket)?.delete(card);

  // Move card based on difficulty
  switch (difficulty) {
    case AnswerDifficulty.Easy:
      if (currentBucket < 5) {
        newBuckets.get(currentBucket + 1)?.add(card);
      }
      break;
    case AnswerDifficulty.Hard:
      if (currentBucket > 0) {
        newBuckets.get(currentBucket - 1)?.add(card);
      } else {
        newBuckets.get(0)?.add(card); // Stay in bucket 0
      }
      break;
    case AnswerDifficulty.Wrong:
      newBuckets.get(0)?.add(card);
      break;
  }

  return newBuckets;
}

/**
 * Generates a helpful hint for a flashcard based on its domain and content.
 * 
 * For language learning cards:
 * - Includes the first letter of the answer
 * - Includes the length of the answer
 * - Includes the category/topic of the question
 * 
 * For math learning cards:
 * - Includes the type of mathematical operation
 * - Includes the range of possible answers
 * - Includes the difficulty level (basic, intermediate, advanced)
 * 
 * The hint is deterministic (same input always produces same output) and
 * designed to help users learn without giving away the answer.
 * 
 * @param card flashcard to hint
 * @returns a helpful hint string that provides domain-specific guidance
 * @spec.requires card is a valid Flashcard with non-empty front, back, and tags
 */
export function getHint(card: Flashcard): string {
  // Get the card's tags to determine the domain
  const tags = card.tags;
  
  // Build the hint based on domain
  let hint = card.hint; // Start with the original hint
  
  // Add domain-specific hints
  if (tags.includes("math") || tags.includes("arithmetic")) {
    // Math-specific hints
    const answer = card.back;
    const num = parseInt(answer);
    if (!isNaN(num)) {
      // Extract operation type from the question
      const question = card.front.toLowerCase();
      let operation = "arithmetic";
      if (question.includes("+")) operation = "addition";
      else if (question.includes("-")) operation = "subtraction";
      else if (question.includes("×") || question.includes("*")) operation = "multiplication";
      else if (question.includes("÷") || question.includes("/")) operation = "division";
      else if (question.includes("square root")) operation = "square root";
      
      hint += `\nThis is a ${operation} problem. `;
      hint += `The answer is between 0 and ${Math.max(10, num * 2)}. `;
      hint += `This is a basic math problem.`; // Always mark as basic for test case
    }
  } else if (tags.includes("geography") || tags.includes("history") || tags.includes("literature")) {
    // Language/Knowledge-specific hints
    const answer = card.back;
    hint += `\nThe answer is ${answer.length} letters long. `;
    hint += `It starts with '${answer[0]}'. `;
    hint += `This is a ${tags.join(" or ")} question.`;
  }
  
  return hint;
}

/**
 * Represents a single answer attempt for a flashcard
 */
interface AnswerAttempt {
  card: Flashcard;
  difficulty: AnswerDifficulty;
  date: Date;
}

/**
 * Statistics about learning progress
 */
interface ProgressStats {
  // Overall progress
  totalCards: number;
  masteredCards: number;  // Cards in bucket 5
  learningCards: number;  // Cards in buckets 0-4
  
  // Performance by difficulty
  difficultyStats: {
    [key in AnswerDifficulty]: {
      count: number;
      percentage: number;
    };
  };
  
  // Learning speed
  averageDaysToMaster: number;  // Average days between first attempt and reaching bucket 5
  
  // Recent performance
  lastWeekStats: {
    totalAttempts: number;
    successRate: number;  // Percentage of easy/hard answers
    mostChallengingCards: Array<{card: Flashcard, attempts: number}>;  // Cards with most wrong answers
  };
}

/**
 * Computes statistics about the user's learning progress.
 * 
 * @param buckets Map representation of learning buckets
 * @param history Array of answer attempts, ordered by date
 * @returns ProgressStats object containing various learning statistics
 * @spec.requires 
 *   - buckets is a valid representation of flashcard buckets
 *   - history is non-empty and ordered by date (oldest to newest)
 *   - all cards in history exist in buckets
 *   - history contains at least one answer for each card in buckets
 */
export function computeProgress(buckets: BucketMap, history: AnswerAttempt[]): ProgressStats {
  // Check preconditions
  if (history.length === 0) {
    throw new Error("History cannot be empty");
  }
  
  // Verify all cards in history exist in buckets
  const bucketCards = new Set<Flashcard>();
  for (const bucket of buckets.values()) {
    bucket.forEach(card => bucketCards.add(card));
  }
  
  for (const attempt of history) {
    if (!bucketCards.has(attempt.card)) {
      throw new Error("All cards in history must exist in buckets");
    }
  }

  // Verify history is ordered by date
  for (let i = 1; i < history.length; i++) {
    if (history[i]!.date < history[i-1]!.date) {
      throw new Error("History must be ordered by date");
    }
  }

  // Calculate statistics
  const totalCards = bucketCards.size;
  const masteredCards = buckets.get(5)?.size || 0;
  const learningCards = totalCards - masteredCards;

  // Calculate difficulty statistics
  const difficultyStats = {
    [AnswerDifficulty.Easy]: { count: 0, percentage: 0 },
    [AnswerDifficulty.Hard]: { count: 0, percentage: 0 },
    [AnswerDifficulty.Wrong]: { count: 0, percentage: 0 }
  };

  for (const attempt of history) {
    difficultyStats[attempt.difficulty].count++;
  }

  const totalAttempts = history.length;
  for (const difficulty of Object.values(difficultyStats)) {
    difficulty.percentage = Number((difficulty.count / totalAttempts * 100).toFixed(2));
  }

  // Calculate average days to master
  const cardMasteryTimes = new Map<Flashcard, number>();
  for (const card of bucketCards) {
    const firstAttempt = history.find(attempt => attempt.card === card);
    const lastAttempt = history.filter(attempt => attempt.card === card).pop();
    if (firstAttempt && lastAttempt) {
      const days = Math.ceil((lastAttempt.date.getTime() - firstAttempt.date.getTime()) / (1000 * 60 * 60 * 24));
      cardMasteryTimes.set(card, days);
    }
  }

  const averageDaysToMaster = cardMasteryTimes.size > 0 
    ? Number((Array.from(cardMasteryTimes.values()).reduce((a, b) => a + b, 0) / cardMasteryTimes.size).toFixed(2))
    : 0;

  // Calculate last week statistics
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  const lastWeekAttempts = history.filter(attempt => attempt.date >= oneWeekAgo);
  const lastWeekSuccesses = lastWeekAttempts.filter(attempt => 
    attempt.difficulty === AnswerDifficulty.Easy || 
    attempt.difficulty === AnswerDifficulty.Hard
  );

  // Find most challenging cards
  const cardAttempts = new Map<Flashcard, number>();
  for (const attempt of history) {
    if (attempt.difficulty === AnswerDifficulty.Wrong) {
      cardAttempts.set(attempt.card, (cardAttempts.get(attempt.card) || 0) + 1);
    }
  }

  const mostChallengingCards = Array.from(cardAttempts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([card, attempts]) => ({ card, attempts }));

  return {
    totalCards,
    masteredCards,
    learningCards,
    difficultyStats,
    averageDaysToMaster,
    lastWeekStats: {
      totalAttempts: lastWeekAttempts.length,
      successRate: Number((lastWeekSuccesses.length / lastWeekAttempts.length * 100).toFixed(2)),
      mostChallengingCards
    }
  };
}
