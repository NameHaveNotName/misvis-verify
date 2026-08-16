// MisVis Verify runtime configuration.
//
// Formspree (recommended, no Google account needed):
//   1. Register at https://formspree.io with any email address.
//   2. Create a new form and complete the activation email step.
//   3. Copy the form endpoint (https://formspree.io/f/xxxxxxxx) below.
// See SUBMISSION_SETUP.md for details.
//
// Leave SUBMIT_ENDPOINT null to disable automatic submission and rely on JSON download only.
window.MISVIS_VERIFY_CONFIG = {
  SUBMIT_ENDPOINT: null,
  SUBMIT_METHOD: 'POST',
  // 'formspree' wraps the export as { participant_id, payload } and sends the
  // Accept header Formspree's AJAX API requires. 'raw' sends the JSON as-is
  // (for custom backends).
  SUBMIT_FORMAT: 'formspree'
};
