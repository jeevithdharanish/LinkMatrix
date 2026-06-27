import toast from "react-hot-toast";

// Uploads the file picked in an <input type="file"> to /api/upload (S3),
// then calls callbackFn with the uploaded file's URL.
// toast.promise shows loading / success / error states automatically.
export async function upload(ev, callbackFn) {
  const file = ev.target.files?.[0];
  if (!file) return;

  async function sendFile() {
    const data = new FormData();
    data.set('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: data,
    });
    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const link = await response.json();
    callbackFn(link);
    return link;
  }

  await toast.promise(sendFile(), {
    loading: 'Uploading...',
    success: 'Uploaded!',
    error: 'Upload error!',
  });
}
