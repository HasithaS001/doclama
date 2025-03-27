'use client';

import { useState, useEffect } from 'react';
import { FiMic, FiMicOff } from 'react-icons/fi';

interface VoiceInputProps {
  onTranscript: (transcript: string) => void;
  isListening: boolean;
  setIsListening: (isListening: boolean) => void;
}

interface SpeechRecognitionEvent {
  results: {
    transcript: string;
    isFinal: boolean;
  }[][];
}

type SpeechRecognition = any;

const VoiceInput = ({ onTranscript, isListening, setIsListening }: VoiceInputProps) => {
  const [error, setError] = useState<string>('');

  useEffect(() => {
    let recognition: SpeechRecognition | null = null;

    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition = new SpeechRecognitionAPI();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setError('');
        setIsListening(true);
      };

      recognition.onerror = (event: { error: string }) => {
        setError('Error occurred in recognition: ' + event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const lastResult = event.results[event.results.length - 1];
        if (lastResult && lastResult[0]) {
          onTranscript(lastResult[0].transcript);
        }
      };

      if (isListening) {
        try {
          recognition.start();
        } catch (error) {
          console.error('Error starting recognition:', error);
        }
      } else {
        try {
          recognition.stop();
        } catch (error) {
          console.error('Error stopping recognition:', error);
        }
      }
    } else {
      setError('Speech recognition is not supported in this browser.');
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [isListening, onTranscript]);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsListening(!isListening)}
        className={`p-2 rounded-full ${
          isListening
            ? 'bg-red-500 hover:bg-red-600'
            : 'bg-blue-500 hover:bg-blue-600'
        } text-white transition-colors`}
        title={isListening ? 'Stop listening' : 'Start listening'}
      >
        {isListening ? <FiMicOff size={24} /> : <FiMic size={24} />}
      </button>
      {error && (
        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-red-100 text-red-600 px-2 py-1 rounded text-sm whitespace-nowrap">
          {error}
        </div>
      )}
    </div>
  );
};

export default VoiceInput;
