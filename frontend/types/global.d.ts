interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResult[][];
  resultIndex: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (event: Event) => void;
  onend: (event: Event) => void;
  onerror: (event: { error: string }) => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

interface Window {
  SpeechRecognition: {
    new(): SpeechRecognition;
  };
  webkitSpeechRecognition: {
    new(): SpeechRecognition;
  };
}

declare var window: Window;

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

interface NewWebhookEvent {
  id: number;
  createdAt: Date;
  eventName: string;
  processed: boolean;
  body: JsonValue;
  processingError: string;
}

interface NewSubscription {
  lemon_squeezy_id: string;
  order_id: number;
  name: string;
  email: string;
  status: string;
  status_formatted: string;
  renews_at: string;
  ends_at: string;
  trial_ends_at: string;
  price: string;
  is_usage_based: boolean;
  is_paused: boolean;
  subscription_item_id: number;
  user_id: string;
  plan_id: number;
}