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
  beforeEach(() => {
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
  });

  it("buckets are correctly distributed", () => {
    // Compare each bucket's contents independently
    assert.equal(bucketSets.length, 6, "Bucket length should be 6 but is " + bucketSets.length);
    assert.equal(bucketSets[0]!.size, 2, "Bucket 0 should have 2 cards but has " + bucketSets[0]!.size);
    assert.equal(bucketSets[1]!.size, 1, "Bucket 1 should have 1 card but has " + bucketSets[1]!.size);
    assert.equal(bucketSets[2]!.size, 2, "Bucket 2 should have 2 cards but has " + bucketSets[2]!.size);
    assert.equal(bucketSets[3]!.size, 2, "Bucket 3 should have 2 cards but has " + bucketSets[3]!.size);
    assert.equal(bucketSets[4]!.size, 2, "Bucket 4 should have 2 cards but has " + bucketSets[4]!.size);
    assert.equal(bucketSets[5]!.size, 1, "Bucket 5 should have 1 card but has " + bucketSets[5]!.size);

    // Check contents of each bucket
    assert(bucketSets[0]!.has(card1) && bucketSets[0]!.has(card9), "Bucket 0 should have card1 and card9");
    assert(bucketSets[1]!.has(card4), "Bucket 1 should have card4");
    assert(bucketSets[2]!.has(card2) && bucketSets[2]!.has(card7), "Bucket 2 should have card2 and card7");
    assert(bucketSets[3]!.has(card5) && bucketSets[3]!.has(card10), "Bucket 3 should have card5 and card10");
    assert(bucketSets[4]!.has(card3) && bucketSets[4]!.has(card8), "Bucket 4 should have card3 and card8");
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
 *
 * TODO: Describe your testing strategy for practice() here.
 */
describe("practice()", () => {
  it("Example test case - replace with your own tests", () => {
    assert.fail(
      "Replace this test case with your own tests based on your testing strategy"
    );
  });
});

/*
 * Testing strategy for update():
 *
 * TODO: Describe your testing strategy for update() here.
 */
describe("update()", () => {
  it("Example test case - replace with your own tests", () => {
    assert.fail(
      "Replace this test case with your own tests based on your testing strategy"
    );
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
