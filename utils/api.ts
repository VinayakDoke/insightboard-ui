import axios from "axios";

const API_BASE = "https://YOUR_BACKEND_URL";

export const submitTranscript = (text: string) =>
  axios.post(`${API_BASE}/jobs`, { transcript: text });

export const getJobStatus = (jobId: string) =>
  axios.get(`${API_BASE}/jobs/${jobId}`);
