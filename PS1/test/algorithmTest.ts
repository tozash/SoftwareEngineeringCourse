import assert from "assert";
import { AnswerDifficulty, Flashcard, BucketMap } from "../src/flashcards";
import {
  toBucketSets,
  getBucketRange,
  practice,
  update,
  getHint,
  computeProgress,
} from "../src/algorithm";

// Sample flashcards for testing
let bucketSets: ReadonlyArray<Set<Flashcard>>;

const card1 = new Flashcard(
  "What is the capital of France?",
  "Paris",
  "City of Light",
  ["geography", "europe"]
);

const card2 = new Flashcard("What is 2+2?", "4", "Basic addition", [
  "math",
  "arithmetic",
]);

const card3 = new Flashcard(
  "Who wrote Romeo and Juliet?",
  "William Shakespeare",
  "Famous English playwright",
  ["literature", "drama"]
);

const card4 = new Flashcard(
  "What is the chemical symbol for Gold?",
  "Au",
  "Comes from Latin 'aurum'",
  ["science", "chemistry"]
);

const card5 = new Flashcard(
  "What programming language is TypeScript based on?",
  "JavaScript",
  "Adds static typing",
  ["programming", "web"]
);
const card6 = new Flashcard(
  "What is the capital of Japan?",
  "Tokyo",
  "Largest metropolitan area in the world",
  ["geography", "asia"]
);

const card7 = new Flashcard(
  "What is the speed of light?",
  "299,792,458 meters per second",
  "Universal speed limit",
  ["physics", "science"]
);

const card8 = new Flashcard(
  "Who painted the Mona Lisa?",
  "Leonardo da Vinci",
  "Italian Renaissance polymath",
  ["art", "history"]
);

const card9 = new Flashcard(
  "What is the largest planet in our solar system?",
  "Jupiter",
  "Gas giant with the Great Red Spot",
  ["astronomy", "science"]
);

const card10 = new Flashcard(
  "What is the square root of 144?",
  "12",
  "Perfect square",
  ["math", "arithmetic"]
);

let buckets: Map<number, Set<Flashcard>> = new Map<number, Set<Flashcard>>();
buckets.set(0, new Set<Flashcard>());
buckets.set(1, new Set<Flashcard>());
buckets.set(2, new Set<Flashcard>());
buckets.set(3, new Set<Flashcard>());
buckets.set(4, new Set<Flashcard>());
buckets.set(5, new Set<Flashcard>());

function setupBuckets() {
  // Clear all buckets first
  buckets.clear();
  buckets.set(0, new Set<Flashcard>());
  buckets.set(1, new Set<Flashcard>());
  buckets.set(2, new Set<Flashcard>());
  buckets.set(3, new Set<Flashcard>());
  buckets.set(4, new Set<Flashcard>());
  buckets.set(5, new Set<Flashcard>());

  // Randomly distribute cards across buckets
  buckets.get(0)?.add(card1);
  buckets.get(2)?.add(card2);
  buckets.get(4)?.add(card3);
  buckets.get(1)?.add(card4);
  buckets.get(3)?.add(card5);
  buckets.get(5)?.add(card6);
  buckets.get(2)?.add(card7);
  buckets.get(4)?.add(card8);
  buckets.get(0)?.add(card9);
  buckets.get(3)?.add(card10);

  bucketSets = toBucketSets(buckets);
}

/*
 * Testing strategy for toBucketSets():
 * test that the buckets are correctly distributed
 * test that the buckets are correctly sorted
 * test that the buckets are correctly sized
 * test that the buckets are correctly empty
 * test that the buckets are correctly full
 * test that the buckets are correctly mixed
 * test that the buckets are correctly shuffled
 * TODO: Describe your testing strategy for toBucketSets() here.
 */
describe("toBucketSets()", () => {
  beforeEach(setupBuckets);

  it("buckets are correctly distributed", () => {
    // Compare each bucket's contents independently
    assert.equal(
      bucketSets.length,
      6,
      "Bucket length should be 6 but is " + bucketSets.length
    );
    assert.equal(
      bucketSets[0]!.size,
      2,
      "Bucket 0 should have 2 cards but has " + bucketSets[0]!.size
    );
    assert.equal(
      bucketSets[1]!.size,
      1,
      "Bucket 1 should have 1 card but has " + bucketSets[1]!.size
    );
    assert.equal(
      bucketSets[2]!.size,
      2,
      "Bucket 2 should have 2 cards but has " + bucketSets[2]!.size
    );
    assert.equal(
      bucketSets[3]!.size,
      2,
      "Bucket 3 should have 2 cards but has " + bucketSets[3]!.size
    );
    assert.equal(
      bucketSets[4]!.size,
      2,
      "Bucket 4 should have 2 cards but has " + bucketSets[4]!.size
    );
    assert.equal(
      bucketSets[5]!.size,
      1,
      "Bucket 5 should have 1 card but has " + bucketSets[5]!.size
    );

    // Check contents of each bucket
    assert(
      bucketSets[0]!.has(card1) && bucketSets[0]!.has(card9),
      "Bucket 0 should have card1 and card9"
    );
    assert(bucketSets[1]!.has(card4), "Bucket 1 should have card4");
    assert(
      bucketSets[2]!.has(card2) && bucketSets[2]!.has(card7),
      "Bucket 2 should have card2 and card7"
    );
    assert(
      bucketSets[3]!.has(card5) && bucketSets[3]!.has(card10),
      "Bucket 3 should have card5 and card10"
    );
    assert(
      bucketSets[4]!.has(card3) && bucketSets[4]!.has(card8),
      "Bucket 4 should have card3 and card8"
    );
    assert(bucketSets[5]!.has(card6), "Bucket 5 should have card6");
  });
});

/*
 * Testing strategy for getBucketRange():
 * test that the bucket range is correctly calculated for max and min bucket
 * test that the bucket range is correctly calculated equal min and max bucket
 * test that the bucket range is correctly calculated for empty buckets
 * TODO: Describe your testing strategy for getBucketRange() here.
 */
describe("getBucketRange()", () => {
  beforeEach(() => {
    // Clear all buckets first
    buckets.clear();
    buckets.set(0, new Set<Flashcard>());
    buckets.set(1, new Set<Flashcard>());
    buckets.set(2, new Set<Flashcard>());
    buckets.set(3, new Set<Flashcard>());
    buckets.set(4, new Set<Flashcard>());
    buckets.set(5, new Set<Flashcard>());
  });

  it("bucket range is correctly calculated for max and min bucket", () => {
    buckets.get(2)?.add(card1);
    buckets.get(3)?.add(card2);

    const bucketSets = toBucketSets(buckets);
    const range = getBucketRange(bucketSets);

    assert.equal(range?.minBucket, 2);
    assert.equal(range?.maxBucket, 3);
  });

  it("bucket range is correctly calculated equal min and max bucket", () => {
    buckets.get(2)?.add(card1);

    const bucketSets = toBucketSets(buckets);
    const range = getBucketRange(bucketSets);

    assert.equal(range?.minBucket, 2);
    assert.equal(range?.maxBucket, 2);
  });

  it("bucket range is correctly calculated for empty buckets", () => {
    const bucketSets = toBucketSets(buckets);
    const range = getBucketRange(bucketSets);

    assert.equal(range?.minBucket, undefined);
  });
});

/*
 * Testing strategy for practice():
 * flashcards in bucket 0 are always selected for practice
 * flashcards in bucket i are selected for practice every 2^i days
 * Partition on bucket configurations:
 * - Single card per bucket
 * - Multiple cards per bucket
 * - Empty buckets
 * - Sparse buckets (gaps between filled buckets)
 * - Dense buckets (consecutive filled buckets)
 */
describe("practice()", () => {
  beforeEach(setupBuckets);

  it("bucket 0 cards are always selected for practice regardless of day", () => {
    // Test multiple random days
    for (let day = 0; day < 50; day++) {
      let practiceSet = practice([...bucketSets], day);
      assert(
        practiceSet.has(card1) && practiceSet.has(card9),
        `Bucket 0 cards should be selected on day ${day}`
      );
    }
  });

  it("bucket 1 cards are selected only when day % 2 === 0", () => {
    // Test with single card
    buckets.clear();
    buckets.set(1, new Set([card4]));
    const singleCardBuckets = toBucketSets(buckets);

    // Test with multiple cards
    buckets.clear();
    buckets.set(1, new Set([card4, card5, card6]));
    const multipleCardBuckets = toBucketSets(buckets);

    for (let day = 0; day < 10; day++) {
      // Test single card bucket
      let practiceSet = practice([...singleCardBuckets], day);
      if (day % 2 === 0) {
        assert(
          practiceSet.has(card4),
          `Single card in bucket 1 should be selected on day ${day}`
        );
      } else {
        assert(
          !practiceSet.has(card4),
          `Single card in bucket 1 should not be selected on day ${day}`
        );
      }

      // Test multiple cards bucket
      practiceSet = practice([...multipleCardBuckets], day);
      if (day % 2 === 0) {
        assert(
          practiceSet.has(card4) &&
            practiceSet.has(card5) &&
            practiceSet.has(card6),
          `All cards in bucket 1 should be selected on day ${day}`
        );
      } else {
        assert(
          !practiceSet.has(card4) &&
            !practiceSet.has(card5) &&
            !practiceSet.has(card6),
          `No cards in bucket 1 should be selected on day ${day}`
        );
      }
    }
  });

  it("tests sparse bucket configuration", () => {
    // Setup sparse buckets with gaps
    buckets.clear();
    buckets.set(0, new Set([card1]));
    buckets.set(2, new Set([card2]));
    buckets.set(4, new Set([card3]));
    const sparseBuckets = toBucketSets(buckets);

    for (let day = 0; day < 20; day++) {
      let practiceSet = practice([...sparseBuckets], day);

      // Bucket 0 always selected
      assert(
        practiceSet.has(card1),
        `Bucket 0 card should be selected on day ${day}`
      );

      // Bucket 2 selected every 4 days
      if (day % 4 === 0) {
        assert(
          practiceSet.has(card2),
          `Bucket 2 card should be selected on day ${day}`
        );
      }

      // Bucket 4 selected every 16 days
      if (day % 16 === 0) {
        assert(
          practiceSet.has(card3),
          `Bucket 4 card should be selected on day ${day}`
        );
      }
    }
  });

  it("tests dense bucket configuration", () => {
    // Setup consecutive buckets
    buckets.clear();
    buckets.set(0, new Set([card1]));
    buckets.set(1, new Set([card2]));
    buckets.set(2, new Set([card3]));
    buckets.set(3, new Set([card4]));
    const denseBuckets = toBucketSets(buckets);

    const testDays = [0, 2, 4, 8, 16];
    for (const day of testDays) {
      let practiceSet = practice([...denseBuckets], day);

      assert(
        practiceSet.has(card1),
        `Bucket 0 card should always be selected on day ${day}`
      );

      if (day % 2 === 0) {
        assert(
          practiceSet.has(card2),
          `Bucket 1 card should be selected on day ${day}`
        );
      }

      if (day % 4 === 0) {
        assert(
          practiceSet.has(card3),
          `Bucket 2 card should be selected on day ${day}`
        );
      }

      if (day % 8 === 0) {
        assert(
          practiceSet.has(card4),
          `Bucket 3 card should be selected on day ${day}`
        );
      }
    }
  });

  it("handles empty buckets correctly", () => {
    // Setup empty buckets
    buckets.clear();
    for (let i = 0; i < 5; i++) {
      buckets.set(i, new Set());
    }
    const emptyBuckets = toBucketSets(buckets);

    for (let day = 0; day < 20; day++) {
      let practiceSet = practice([...emptyBuckets], day);
      assert(
        practiceSet.size === 0,
        `No cards should be selected from empty buckets on day ${day}`
      );
    }
  });

  it("bucket 5 cards are never selected for practice on any day", () => {
    // Test with both single and multiple cards
    buckets.clear();
    buckets.set(5, new Set([card6, card7, card8]));
    const bucket5Cards = toBucketSets(buckets);

    for (let day = 0; day < 50; day++) {
      let practiceSet = practice([...bucket5Cards], day);
      assert(
        !practiceSet.has(card6) &&
          !practiceSet.has(card7) &&
          !practiceSet.has(card8),
        `No bucket 5 cards should be selected on day ${day}`
      );
    }
  });
});

/*
 * Testing strategy for update():
 *
 * TODO: Describe your testing strategy for update() here.
 */
describe("update()", () => {
  beforeEach(() => {
    buckets = new Map<number, Set<Flashcard>>();
    buckets.set(0, new Set<Flashcard>());
    buckets.set(1, new Set<Flashcard>());
    buckets.set(2, new Set<Flashcard>());
    buckets.set(3, new Set<Flashcard>());
    buckets.set(4, new Set<Flashcard>());
    buckets.set(5, new Set<Flashcard>());
    // Add some initial cards to buckets
    buckets.get(0)?.add(card1);
    buckets.get(2)?.add(card2);
    buckets.get(4)?.add(card3);
    buckets.get(1)?.add(card4);
    buckets.get(3)?.add(card5);
    buckets.get(5)?.add(card6);
    buckets.get(2)?.add(card7);
    buckets.get(4)?.add(card8);
    buckets.get(0)?.add(card9);
    buckets.get(3)?.add(card10);
  });
  describe("handles wrong answer correctly", () => {
    it("when we answer wrong in bucket 0", () => {
      const updatedBuckets = update(buckets, card1, AnswerDifficulty.Wrong);
      assert(
        updatedBuckets.get(0)?.has(card1) && updatedBuckets.get(0)?.has(card9),
        "Bucket 0 should contain the same cards after wrong answer"
      );
    });
    it("when we answer wrong in buckets 1-4, card moves to bucket 0", () => {
      // Test each bucket from 1 to 4
      const cardsToTest = [
        { bucket: 1, card: card4 },
        { bucket: 2, card: card2 },
        { bucket: 3, card: card5 },
        { bucket: 4, card: card3 },
      ];

      for (const { bucket, card } of cardsToTest) {
        const updatedBuckets = update(buckets, card, AnswerDifficulty.Wrong);

        // Check that card moved to bucket 0
        assert(
          updatedBuckets.get(0)?.has(card),
          `Card from bucket ${bucket} should move to bucket 0 after wrong answer`
        );
        assert(
          !updatedBuckets.get(bucket)?.has(card),
          `Card should no longer be in bucket ${bucket} after wrong answer`
        );

        // Check that all other cards stayed in their original buckets
        for (let i = 0; i <= 5; i++) {
          const originalCards = buckets.get(i) || new Set();
          const updatedCards = updatedBuckets.get(i) || new Set();

          originalCards.forEach((c) => {
            if (c !== card) {
              assert(
                updatedCards.has(c),
                `Card ${c} should stay in bucket ${i} after updating different card`
              );
            }
          });
        }
      }
    });
  });
  describe("handles hard answer correctly", () => {
    it("when we answer hard in bucket 0", () => {
      const updatedBuckets = update(buckets, card1, AnswerDifficulty.Hard);
      assert(
        updatedBuckets.get(0)?.has(card1) && updatedBuckets.get(0)?.has(card9),
        "Bucket 0 should contain the same cards after hard answer"
      );
    });
    it("when we answer hard in buckets 1-4, card moves to bucket bellow original bucket", () => {
      // Test each bucket from 1 to 4
      const cardsToTest = [
        { bucket: 1, card: card4 },
        { bucket: 2, card: card2 },
        { bucket: 3, card: card5 },
        { bucket: 4, card: card3 },
      ];

      for (const { bucket, card } of cardsToTest) {
        const updatedBuckets = update(buckets, card, AnswerDifficulty.Hard);

        // Check that card moved to bucket below
        assert(
          updatedBuckets.get(bucket - 1)?.has(card),
          `Card from bucket ${bucket} should move to bucket ${
            bucket - 1
          } after hard answer`
        );
        assert(
          !updatedBuckets.get(bucket)?.has(card),
          `Card should no longer be in bucket ${bucket} after hard answer`
        );

        // Check that all other cards stayed in their original buckets
        for (let i = 0; i <= 5; i++) {
          const originalCards = buckets.get(i) || new Set();
          const updatedCards = updatedBuckets.get(i) || new Set();

          originalCards.forEach((c) => {
            if (c !== card) {
              assert(
                updatedCards.has(c),
                `Card ${c} should stay in bucket ${i} after updating different card`
              );
            }
          });
        }
      }
    });
  });
  describe("handles easy answer correctly", () => {
    it("when we answer easy in bucket 0", () => {
      const updatedBuckets = update(buckets, card1, AnswerDifficulty.Easy);
      assert(!updatedBuckets.get(0)?.has(card1) && updatedBuckets.get(0)?.has(card9),
        "Bucket 0 should not contain card 1 and Should contain card 9"
      );
      assert(updatedBuckets.get(1)?.has(card1),
        "Card 1 should be in bucket 1 after easy answer"
      );
      assert(updatedBuckets.get(1)?.has(card4),
        "Card 4 should be in bucket 1 after easy answer on card 1"
      );
    });
    it("when we answer easy in buckets 1-4, card moves to bucket above original bucket", () => {
      // Test each bucket from 0 to 4 - card should move up one bucket on easy answer
      const cardsToTest = [
        { bucket: 0, card: card1 },
        { bucket: 1, card: card4 }, 
        { bucket: 2, card: card2 },
        { bucket: 3, card: card5 },
        { bucket: 4, card: card3 }
      ];

      for (const { bucket, card } of cardsToTest) {
        const updatedBuckets = update(buckets, card, AnswerDifficulty.Easy);
        assert(updatedBuckets.get(bucket + 1)?.has(card),
          "Card should move to bucket above original bucket on easy answer"
        );
        assert(
          !updatedBuckets.get(bucket)?.has(card),
          `Card should no longer be in bucket ${bucket} after easy answer`
        );
        for (let i = 0; i <= 5; i++) {
          const originalCards = buckets.get(i) || new Set();
          const updatedCards = updatedBuckets.get(i) || new Set();

          originalCards.forEach((c) => {
            if (c !== card) {
              assert(
                updatedCards.has(c),
                `Card ${c} should stay in bucket ${i} after updating different card`
              );
            }
          });
        }
      }
    });
  });
});

/*
 * Testing strategy for getHint():
 *
 * TODO: Describe your testing strategy for getHint() here.
 */
describe("getHint()", () => {
  it("Example test case - replace with your own tests", () => {
    assert.fail(
      "Replace this test case with your own tests based on your testing strategy"
    );
  });
});

/*
 * Testing strategy for computeProgress():
 *
 * TODO: Describe your testing strategy for computeProgress() here.
 */
describe("computeProgress()", () => {
  it("Example test case - replace with your own tests", () => {
    assert.fail(
      "Replace this test case with your own tests based on your testing strategy"
    );
  });
});
