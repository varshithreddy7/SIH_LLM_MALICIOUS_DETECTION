/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

export interface VerifyRequest {
  text?: string;
  url?: string;
}

export interface VerifyResponse {
  label: 'fake' | 'real' | 'ai-generated' | string;
  confidence: number; // 0..1
  reason?: string;
  probabilities?: Record<string, number>;
}

export interface AnalyticsResponse {
  weekly: { week: string; detections: number }[];
  aiVsHuman: { label: string; value: number }[];
}

export interface ReportsResponse {
  recent: Array<{ id: string; label: string; confidence: number; timestamp: string }>;
}
