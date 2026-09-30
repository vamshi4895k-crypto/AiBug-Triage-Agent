import { TriageRequest, TriageResult, SystemStatus } from '../types/triage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export async function submitBugTriage(request: TriageRequest): Promise<TriageResult> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 35000);

    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(errorBody.message || `Server returned status ${response.status}`);
    }

    const json = await response.json();
    if (!json.success || !json.data) {
      throw new Error('Invalid response structure from triage engine.');
    }

    return json.data;
  } catch (error: any) {
    console.warn('[API Client] Request to backend failed or timed out:', error);
    throw error;
  }
}

export async function fetchSystemStatus(): Promise<SystemStatus> {
  try {
    const response = await fetch(`${API_BASE_URL}/status`, {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch status');
    }
    return await response.json();
  } catch {
    return {
      status: 'STANDALONE',
      agent: 'AI Bug Triage Agent',
      engineReady: true,
      provider: 'Local Diagnostic Engine',
      model: 'smart-heuristics',
      liveAIConfigured: false,
      timestamp: new Date().toISOString(),
    };
  }
}
