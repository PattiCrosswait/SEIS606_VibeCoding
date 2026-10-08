const SUPPORTED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_FILE_SIZE = 8 * 1024 * 1024;

function generateSubmissionId() {
  return `submission-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function validateSubmission(file) {
  if (!file) {
    return { ok: false, reason: 'missing_file', message: 'Please choose a photo before analyzing.' };
  }

  if (!file.type || !SUPPORTED_TYPES.has(file.type)) {
    return {
      ok: false,
      reason: 'unsupported_type',
      message: 'Please use a JPEG, PNG, or WebP image.'
    };
  }

  if (file.size <= 0) {
    return {
      ok: false,
      reason: 'empty_file',
      message: 'This file appears empty. Please choose a valid photo.'
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      ok: false,
      reason: 'too_large',
      message: 'This photo is larger than the 8 MB limit. Please choose a smaller image.'
    };
  }

  const width = Number(file.width) || 0;
  const height = Number(file.height) || 0;
  const name = (file.name || '').toLowerCase();

  if ((width > 0 && height > 0 && (width < 200 || height < 200)) || /blurry|dark|unclear/.test(name)) {
    return {
      ok: false,
      reason: 'low_quality',
      message: 'This photo is too unclear or too small for a reliable estimate.'
    };
  }

  return { ok: true, reason: 'valid', message: 'Photo ready for analysis.' };
}

function createOutcome({ kind, submissionId, items = [], message, nextAction, assumptions = [], completedAt = new Date().toISOString() }) {
  return {
    outcomeKind: kind,
    submissionId,
    items: Array.isArray(items) ? items : [],
    message: message || 'No explanation available.',
    nextAction: nextAction || 'choose-another-photo',
    assumptions: Array.isArray(assumptions) ? assumptions : [],
    completedAt
  };
}

function startAnalysisSession(submissionId) {
  return {
    submissionId,
    status: 'selected',
    isBusy: false,
    result: null,
    error: ''
  };
}

function applyOutcomeToState(state, outcome) {
  return {
    ...state,
    status: outcome.outcomeKind === 'success' ? 'success' : outcome.outcomeKind,
    isBusy: false,
    result: outcome,
    error: outcome.outcomeKind === 'failed' ? outcome.message : outcome.outcomeKind === 'rejected' ? outcome.message : ''
  };
}

function buildSuccessOutcome(submissionId) {
  return createOutcome({
    kind: 'success',
    submissionId,
    items: [
      {
        itemId: 'item-1',
        name: 'Grilled chicken salad',
        confidence: 'high',
        servingEstimate: { amount: 1, unit: 'bowl', assumption: 'One visible serving estimated from the photo.' },
        nutritionEstimate: {
          calories: 420,
          protein: { amount: 34, unit: 'g' },
          carbohydrates: { amount: 18, unit: 'g' },
          fat: { amount: 22, unit: 'g' },
          unitSystem: 'calories-and-grams',
          servingBasis: 'One bowl portion',
          sourceName: 'nutrition-reference',
          sourceVersion: '2026-09-30'
        },
        notes: 'Estimate depends on dressing quantity and additional toppings.'
      },
      {
        itemId: 'item-2',
        name: 'Fresh fruit cup',
        confidence: 'medium',
        servingEstimate: { amount: 1, unit: 'cup', assumption: 'A smaller side serving was inferred.' },
        nutritionEstimate: {
          calories: 140,
          protein: { amount: 1, unit: 'g' },
          carbohydrates: { amount: 34, unit: 'g' },
          fat: { amount: 1, unit: 'g' },
          unitSystem: 'calories-and-grams',
          servingBasis: 'Approximate side serving',
          sourceName: 'nutrition-reference',
          sourceVersion: '2026-09-30'
        },
        notes: 'Fruit mix may vary by fruit type and slice size.'
      }
    ],
    message: 'Estimated nutrition for the visible food.',
    nextAction: 'review-assumptions',
    assumptions: [
      'Portion size is estimated from the image.',
      'Nutrition values are informational estimates, not medical advice.'
    ]
  });
}

function buildOutcomeFromFile(file, submissionId) {
  const name = (file.name || '').toLowerCase();

  if (name.includes('chair') || name.includes('lamp') || name.includes('object') || name.includes('landscape')) {
    return createOutcome({
      kind: 'non_food',
      submissionId,
      message: 'No recognizable food was found in this photo.',
      nextAction: 'choose-another-photo',
      assumptions: ['Food could not be identified in the image.']
    });
  }

  if (name.includes('blurry') || name.includes('dark') || name.includes('unclear') || /low|ambiguous/.test(name)) {
    return createOutcome({
      kind: 'uncertain',
      submissionId,
      message: 'The photo is not clear enough for a reliable estimate.',
      nextAction: 'retake-photo',
      assumptions: ['Food identity or serving size could not be confirmed.']
    });
  }

  if (name.includes('fail')) {
    return createOutcome({
      kind: 'failed',
      submissionId,
      message: 'Analysis did not complete. Try again.',
      nextAction: 'retry'
    });
  }

  return buildSuccessOutcome(submissionId);
}

function renderStatus(text, tone = 'neutral') {
  const banner = document.getElementById('statusBanner');
  if (!banner) return;
  banner.textContent = text;
  banner.dataset.tone = tone;
}

function renderOutcome(outcome) {
  const panel = document.getElementById('resultPanel');
  if (!panel) return;

  panel.classList.remove('is-hidden');

  if (outcome.outcomeKind === 'success') {
    const itemsMarkup = outcome.items
      .map((item) => {
        const calories = item.nutritionEstimate?.calories ?? 'n/a';
        const protein = item.nutritionEstimate?.protein ? `${item.nutritionEstimate.protein.amount} ${item.nutritionEstimate.protein.unit}` : 'unavailable';
        const carbs = item.nutritionEstimate?.carbohydrates ? `${item.nutritionEstimate.carbohydrates.amount} ${item.nutritionEstimate.carbohydrates.unit}` : 'unavailable';
        const fat = item.nutritionEstimate?.fat ? `${item.nutritionEstimate.fat.amount} ${item.nutritionEstimate.fat.unit}` : 'unavailable';
        return `
          <article class="result-item">
            <div class="item-topline">
              <h3>${item.name}</h3>
              <span class="confidence ${item.confidence}">${item.confidence} confidence</span>
            </div>
            <p class="serving-copy">Serving estimate: ${item.servingEstimate.amount} ${item.servingEstimate.unit}</p>
            <div class="macro-grid">
              <div><span>Calories</span><strong>${calories} kcal</strong></div>
              <div><span>Protein</span><strong>${protein}</strong></div>
              <div><span>Carbs</span><strong>${carbs}</strong></div>
              <div><span>Fat</span><strong>${fat}</strong></div>
            </div>
            <p class="item-note">${item.notes}</p>
          </article>
        `;
      })
      .join('');

    const assumptionsMarkup = outcome.assumptions.length
      ? `<ul class="assumption-list">${outcome.assumptions.map((entry) => `<li>${entry}</li>`).join('')}</ul>`
      : '';

    panel.className = 'result-panel outcome-success';
    panel.innerHTML = `
      <div class="outcome-head">
        <div>
          <p class="eyebrow">analysis result</p>
          <h2>Nutrition estimate</h2>
        </div>
        <span class="outcome-tag success">Estimated</span>
      </div>
      <p class="outcome-message">${outcome.message}</p>
      <div class="result-list">${itemsMarkup}</div>
      ${assumptionsMarkup}
      <div class="next-action-row">
        <button type="button" class="primary-button" data-action="retry">Review assumptions</button>
        <button type="button" class="secondary-button" data-action="new-photo">Use another photo</button>
      </div>
    `;
    return;
  }

  panel.className = `result-panel outcome-${outcome.outcomeKind}`;
  panel.innerHTML = `
    <div class="outcome-head">
      <div>
        <p class="eyebrow">analysis result</p>
        <h2>${outcome.outcomeKind === 'non_food' ? 'No food identified' : outcome.outcomeKind === 'uncertain' ? 'Needs a clearer photo' : outcome.outcomeKind === 'failed' ? 'Temporary analysis failure' : 'Result withheld'}</h2>
      </div>
      <span class="outcome-tag ${outcome.outcomeKind}">${outcome.outcomeKind}</span>
    </div>
    <p class="outcome-message">${outcome.message}</p>
    ${outcome.assumptions.length ? `<ul class="assumption-list">${outcome.assumptions.map((entry) => `<li>${entry}</li>`).join('')}</ul>` : ''}
    <div class="next-action-row">
      <button type="button" class="primary-button" data-action="retry">${outcome.nextAction === 'retake-photo' ? 'Retake photo' : outcome.nextAction === 'retry' ? 'Try again' : 'Choose another photo'}</button>
      <button type="button" class="secondary-button" data-action="new-photo">Use another photo</button>
    </div>
  `;
}

function resetState() {
  const fileInput = document.getElementById('photoInput');
  const resultPanel = document.getElementById('resultPanel');
  if (fileInput) fileInput.value = '';
  if (resultPanel) resultPanel.classList.add('is-hidden');
  renderStatus('Waiting for a photo upload.', 'neutral');
}

async function handleAnalysis(file) {
  const validation = validateSubmission(file);

  if (!validation.ok) {
    renderOutcome(createOutcome({
      kind: 'rejected',
      submissionId: generateSubmissionId(),
      message: validation.message,
      nextAction: 'choose-another-photo',
      assumptions: ['The file was rejected before analysis.']
    }));
    renderStatus(validation.message, 'warning');
    return;
  }

  const submissionId = generateSubmissionId();
  const state = startAnalysisSession(submissionId);
  renderStatus('Checking image quality and reviewing the meal...', 'info');
  state.isBusy = true;

  await new Promise((resolve) => setTimeout(resolve, 900));

  const outcome = buildOutcomeFromFile(file, submissionId);
  const nextState = applyOutcomeToState(state, outcome);

  if (nextState.status === 'success') {
    renderStatus('Nutrition estimate ready.', 'success');
  } else if (nextState.status === 'failed') {
    renderStatus('The analysis could not complete. Please retry.', 'warning');
  } else {
    renderStatus(outcome.message, 'warning');
  }

  renderOutcome(outcome);
}

function bindEvents() {
  const form = document.getElementById('uploadForm');
  const fileInput = document.getElementById('photoInput');
  const resetButton = document.getElementById('resetButton');

  if (fileInput) {
    fileInput.addEventListener('change', (event) => {
      const file = event.target.files && event.target.files[0];
      if (!file) {
        resetState();
        return;
      }
      renderStatus(`Selected: ${file.name}. Ready to analyze.`, 'neutral');
    });
  }

  if (form) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const file = fileInput && fileInput.files && fileInput.files[0];
      if (!file) {
        renderOutcome(createOutcome({
          kind: 'rejected',
          submissionId: generateSubmissionId(),
          message: 'No file was selected. Choose a photo to continue.',
          nextAction: 'choose-another-photo',
          assumptions: ['No photo was submitted for analysis.']
        }));
        renderStatus('No file selected. Please choose a photo.', 'warning');
        return;
      }
      await handleAnalysis(file);
    });
  }

  if (resetButton) {
    resetButton.addEventListener('click', () => {
      resetState();
    });
  }

  document.addEventListener('click', (event) => {
    const actionButton = event.target.closest('[data-action]');
    if (!actionButton) return;

    const action = actionButton.dataset.action;
    if (action === 'new-photo') {
      resetState();
      if (fileInput) fileInput.click();
      return;
    }

    if (action === 'retry') {
      const sameFile = fileInput && fileInput.files && fileInput.files[0];
      if (sameFile) {
        handleAnalysis(sameFile);
      } else {
        resetState();
      }
    }
  });
}

if (typeof document !== 'undefined') {
  renderStatus('Waiting for a photo upload.', 'neutral');
  bindEvents();
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    MAX_FILE_SIZE,
    SUPPORTED_TYPES,
    validateSubmission,
    createOutcome,
    startAnalysisSession,
    applyOutcomeToState,
    buildOutcomeFromFile
  };
}

