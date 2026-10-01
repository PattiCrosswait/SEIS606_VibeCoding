const assert = require('node:assert/strict');

const {
  validateSubmission,
  createOutcome,
  applyOutcomeToState,
  startAnalysisSession,
} = require('./app.js');

const supportedFile = {
  name: 'meal.jpg',
  type: 'image/jpeg',
  size: 250000,
  isReadable: true,
  width: 1200,
  height: 800,
};

const invalidFile = {
  name: 'notes.txt',
  type: 'text/plain',
  size: 100,
  isReadable: true,
  width: 0,
  height: 0,
};

const lowQualityFile = {
  name: 'blurry.jpg',
  type: 'image/jpeg',
  size: 250000,
  isReadable: true,
  width: 200,
  height: 200,
  blur: true,
};

const noFoodFile = {
  name: 'chair.jpg',
  type: 'image/jpeg',
  size: 200000,
  isReadable: true,
  width: 1000,
  height: 800,
};

function run() {
  const valid = validateSubmission(supportedFile);
  assert.equal(valid.ok, true, 'Supported photo should pass validation');

  const rejected = validateSubmission(invalidFile);
  assert.equal(rejected.ok, false, 'Unsupported file type should be rejected');

  const lowQuality = validateSubmission(lowQualityFile);
  assert.equal(lowQuality.ok, false, 'Low-quality photo should be rejected');

  const outcome = createOutcome({
    kind: 'success',
    submissionId: 'sub-001',
    items: [{
      itemId: 'item-1',
      name: 'Grilled chicken salad',
      confidence: 'high',
      servingEstimate: { amount: 1, unit: 'bowl', assumption: 'one visible serving' },
      nutritionEstimate: {
        calories: 420,
        protein: { amount: 34, unit: 'g' },
        carbohydrates: { amount: 18, unit: 'g' },
        fat: { amount: 22, unit: 'g' },
        unitSystem: 'calories-and-grams',
        servingBasis: 'one visible bowl',
        sourceName: 'nutrition-reference',
        sourceVersion: 'sample',
      },
      notes: 'Estimate depends on dressing quantity.',
    }],
    message: 'Estimated nutrition for the visible food.',
    nextAction: 'review-assumptions',
    assumptions: ['Portion size is estimated from the image.'],
  });

  assert.equal(outcome.outcomeKind, 'success');
  assert.equal(outcome.items.length, 1);

  const nonFood = createOutcome({
    kind: 'non_food',
    submissionId: 'sub-002',
    message: 'No recognizable food was found in this photo.',
    nextAction: 'choose-another-photo',
  });

  assert.equal(nonFood.outcomeKind, 'non_food');
  assert.equal(nonFood.items.length, 0);

  const state = startAnalysisSession('sub-003');
  const updated = applyOutcomeToState(state, createOutcome({
    kind: 'failed',
    submissionId: 'sub-003',
    message: 'Analysis did not complete. Try again.',
    nextAction: 'retry',
  }));

  assert.equal(updated.status, 'failed');
  assert.equal(updated.error, 'Analysis did not complete. Try again.');

  console.log('All nutrition analysis tests passed.');
}

run();
