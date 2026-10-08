# Quickstart Validation: Nutrition Photo Analysis

## Prerequisites

- A modern desktop or mobile browser.
- The repository checked out locally.
- A local static-file server or an equivalent browser preview for `mockup/index.html`.
- Non-sensitive fixture images representing the scenarios below. Do not use personal
  photos for validation.

## Start the mockup

From the repository root, serve the `mockup/` directory with any local static
server available in the environment, then open `mockup/index.html` through that
server. The implementation must document the chosen local command in the task
breakdown when it is selected.

## Validation scenarios

### 1. Supported food photo

1. Select a clear, well-lit photo of one meal.
2. Submit the photo.
3. Verify that the interface acknowledges the selection, shows progress, and ends
   with a result.
4. Verify that the result shows identified food, serving assumption, calories,
   available macronutrients, units, confidence, and an estimate disclaimer.

Expected: The user can understand what was identified and what assumptions affect
accuracy.

### 2. Multiple foods and partial uncertainty

1. Select a photo containing several visible foods.
2. Submit the photo.
3. Verify that items are presented separately and that uncertain items are labeled.
4. Verify that unavailable nutrition values are shown as unavailable rather than
   silently replaced with zero.

Expected: Confident and uncertain identifications are distinguishable.

### 3. Low-quality photo

1. Submit a blurry, dark, obstructed, or poorly framed food image.
2. Verify that the result explains that a reliable estimate is not available.
3. Verify that no unsupported nutrition values appear.
4. Verify that the user can retake or choose another photo.

Expected: The user gets an actionable recovery path without fabricated data.

### 4. Non-food or no-food photo

1. Submit a photo of a household object, landscape, or empty scene.
2. Verify that the interface says recognizable food was not found.
3. Verify that no food item or nutrition value is rendered.
4. Verify that another-photo selection is available.

Expected: Non-food input is handled honestly and safely.

### 5. Local validation failures

Exercise each case:

- Cancel the file chooser or submit with no file.
- Use an unsupported file type.
- Use an oversized file.
- Use a corrupted or unreadable image.

Expected: Each case is rejected before analysis, has a plain-language explanation,
and leaves the user able to choose another photo.

### 6. Temporary analysis failure

1. Trigger the deterministic failure fixture.
2. Verify that the interface shows a failure message and retry action.
3. Retry once and verify a new progress state appears.
4. Verify that duplicate submissions are disabled while analysis is active.

Expected: The user can recover without a full page restart.

### 7. Responsive and keyboard behavior

1. Complete the upload flow using keyboard navigation only.
2. Repeat the upload and result flow at a narrow mobile viewport and a desktop
   viewport.
3. Verify that focus remains visible, controls have meaningful labels, and no result
   content is clipped or obscured.

Expected: Primary upload, progress, result, warning, and recovery states remain
usable across supported layouts and input methods.

## Evidence to record

- Fixture scenario and outcome kind.
- Whether nutrition values were suppressed for non-success outcomes.
- Time from submission to acknowledgement and terminal status.
- Screenshot or notes for mobile and keyboard checks.
- Confirmation that no raw photo data appeared in visible errors or logs.
