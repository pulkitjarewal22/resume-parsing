import apiClient from './client';
import type { MatchType } from '../types';

export interface MatchPayload {
  matchType: MatchType;
  source: any;
  target: any;
}

export const matchingApi = {
  /**
   * Run matching engine analysis between source and target JSON payloads
   * Replace the URL with your actual backend endpoint when ready.
   */
  runAnalysis: async (payload: MatchPayload) => {
    const response = await apiClient.post('/matching/analyze', payload);
    return response.data;
  },
};
