import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from './use-toast';

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: any) => void;
  onend: () => void;
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export function useVoiceCommands() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
      console.warn('Speech recognition not supported');
      return;
    }

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionAPI();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        }
      }

      if (finalTranscript) {
        setTranscript(finalTranscript);
        processCommand(finalTranscript.toLowerCase());
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, []);

  const processCommand = (command: string) => {
    console.log('Processing command:', command);

    // Navigation commands
    if (command.includes('dashboard') || command.includes('home')) {
      navigate('/dashboard');
      toast({
        title: "Voice Command",
        description: "Navigating to Dashboard",
      });
    } else if (command.includes('media') || command.includes('studio')) {
      navigate('/media-lab');
      toast({
        title: "Voice Command",
        description: "Opening Media Lab",
      });
    } else if (command.includes('telemetry') || command.includes('analysis')) {
      toast({
        title: "Voice Command",
        description: "Telemetry analysis coming soon",
      });
    } else if (command.includes('strategy') || command.includes('prediction')) {
      toast({
        title: "Voice Command",
        description: "Strategy module coming soon",
      });
    } else if (command.includes('sign out') || command.includes('logout')) {
      toast({
        title: "Voice Command",
        description: "Signing out...",
      });
      // Could add actual logout logic here
    }
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
      setIsListening(true);
      toast({
        title: "Voice Commands Active",
        description: "Say 'Dashboard', 'Media Lab', or other commands",
      });
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    toggleListening,
  };
}
