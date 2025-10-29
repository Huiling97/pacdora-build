const API_BASE = 'https://pacdora-build.onrender.com';

export const exportPacdoraProject = async (
  fileType,
  projectIds,
  config = {}
) => {
  const response = await fetch(`${API_BASE}/api/export/${fileType}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ projectIds, config }),
  });
  if (!response.ok) throw new Error(`HTTP error ${response.status}`);
  const data = await response.json();
  return data.taskId;
};

export const pollExportStatus = (
  fileType,
  taskId,
  interval = 2000,
  timeout = 60000
) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const timerId = setInterval(async () => {
      try {
        const response = await fetch(
          `${API_BASE}/api/export-status/${fileType}?taskId=${taskId}`
        );
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);

        const data = await response.json();
        const status = data.msg;

        if (status === 'success') {
          clearInterval(timerId); // stop polling immediately
          resolve(data.data);
        } else if (status === 'failed') {
          clearInterval(timerId);
          reject(new Error('Export failed'));
        } else if (Date.now() - startTime > timeout) {
          clearInterval(timerId);
          reject(new Error('Polling timed out'));
        }
        // Otherwise, do nothing and wait for next interval
      } catch (err) {
        clearInterval(timerId);
        reject(err);
      }
    }, interval);
  });
};
