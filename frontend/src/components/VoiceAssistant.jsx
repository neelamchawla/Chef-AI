import { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { processVoiceCommand } from '../services/api';
import { usePlan } from '../context/PlanContext';

export default function VoiceAssistant({ onResult }) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interim, setInterim] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef(null);
  const { plan } = usePlan();

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
      return undefined;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-IN';

    recognition.onresult = (event) => {
      let finalText = '';
      let interimText = '';

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        if (result.isFinal) {
          finalText += result[0].transcript;
        } else {
          interimText += result[0].transcript;
        }
      }

      if (finalText) setTranscript(finalText);
      setInterim(interimText);
    };

    recognition.onend = () => setListening(false);
    recognition.onerror = (event) => {
      setError(event.error === 'no-speech' ? 'No speech detected. Try again.' : event.error);
      setListening(false);
    };

    recognitionRef.current = recognition;
    return () => recognition.abort();
  }, []);

  const processTranscript = useCallback(async (text) => {
    if (!text.trim()) return;
    setProcessing(true);
    setError(null);

    try {
      const result = await processVoiceCommand(text, { existingPlan: plan });
      onResult?.(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  }, [plan, onResult]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    setError(null);

    if (listening) {
      recognitionRef.current.stop();
    } else {
      setTranscript('');
      setInterim('');
      setListening(true);
      recognitionRef.current.start();
    }
  };

  useEffect(() => {
    if (!listening && transcript) {
      processTranscript(transcript);
    }
  }, [listening, transcript, processTranscript]);

  if (!supported) {
    return (
      <div className="card text-center text-sage-600">
        <p>Voice recognition is not supported in this browser.</p>
        <p className="mt-2 text-sm">Try Chrome or Edge, or use the text chat below.</p>
      </div>
    );
  }

  return (
    <div className="card text-center">
      <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center">
        {listening && (
          <span className="listening-ring absolute inset-0 rounded-full bg-terracotta-400/30" />
        )}
        <button
          type="button"
          onClick={toggleListening}
          disabled={processing}
          className={`relative flex h-20 w-20 items-center justify-center rounded-full transition ${
            listening
              ? 'bg-terracotta-500 text-white shadow-lg shadow-terracotta-500/30'
              : 'bg-sage-600 text-white hover:bg-sage-700'
          }`}
          aria-label={listening ? 'Stop listening' : 'Start listening'}
        >
          {processing ? (
            <Loader2 size={32} className="animate-spin" />
          ) : listening ? (
            <MicOff size={32} />
          ) : (
            <Mic size={32} />
          )}
        </button>
      </div>

      <p className="text-lg font-medium text-sage-900">
        {processing ? 'Processing...' : listening ? '🎤 Listening...' : 'Tap to speak'}
      </p>
      <p className="mt-2 text-sm text-sage-500">
        Try: &quot;I have eggs, bread and tomatoes. Plan breakfast and remind me to buy milk.&quot;
      </p>

      {(transcript || interim) && (
        <div className="mt-4 rounded-xl bg-cream-100 p-4 text-left text-sm text-sage-700">
          <p className="font-medium text-sage-900">You said:</p>
          <p className="mt-1">{transcript || interim}</p>
        </div>
      )}

      {error && (
        <p className="mt-4 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
