import toast from "react-hot-toast";

// Standard toast for server-action save results.
// Returns true on success so callers can chain follow-up work.
export function notifySaveResult(result, successMessage) {
  if (result?.success) {
    toast.success(successMessage);
    return true;
  }
  toast.error(result?.message || 'Could not save — please try again');
  return false;
}
