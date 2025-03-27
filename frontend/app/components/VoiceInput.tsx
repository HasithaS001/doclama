'use client';

import { useState, useEffect } from 'react';
import { FiMic, FiMicOff } from 'react-icons/fi';

interface VoiceInputProps {
  onTranscript: (transcript: string) => void;
  isListening: boolean;
  setIsListening: (isListening: boolean) => void;
}

const VoiceInput = ({ onTranscript, isListening, setIsListening }: VoiceInputProps) => {
  const [error, setError] = useState<string>('');

  useEffect(() => {
    let recognition: SpeechRecognition | null = null;

    if (typeof window !== 'undefined' && 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setError('');
      };

      recognition.onerror = (event) => {
        setError('Error occurred in recognition: ' + event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');

        onTranscript(transcript);
      };

      if (isListening) {
        try {
          recognition.start();
        } catch (err) {
          console.error('Error starting recognition:', err);
          setError('Failed to start voice recognition');
          setIsListening(false);
        }
      }
    } else {
      setError('Speech recognition is not supported in this browser.');
    }

    return () => {
      if (recognition) {
        try {
          recognition.stop();
        } catch (err) {
          console.error('Error stopping recognition:', err);
        }
      }
    };
  }, [isListening, onTranscript, setIsListening]);

  const toggleListening = () => {
    setIsListening(!isListening);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleListening}
        className={`p-2 md:p-3 rounded-lg transition-colors ${
          isListening
            ? 'bg-red-500 text-white hover:bg-red-600'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
        } ${error ? 'opacity-50 cursor-not-allowed' : ''}`}
        title={isListening ? 'Stop recording' : 'Start recording'}
        disabled={!!error}
        aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
      >
        {isListening ? (
          <FiMicOff className="h-4 w-4 md:h-5 md:w-5" />
        ) : (
          <FiMic className="h-4 w-4 md:h-5 md:w-5" />
        )}
      </button>
      {error && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-red-100 text-red-600 rounded whitespace-nowrap">
          {error}
        </div>
      )}
    </div>
  );
};

export default VoiceInput;
