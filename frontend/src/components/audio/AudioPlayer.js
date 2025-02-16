import { useEffect, useRef, useState } from 'react';
import { fetchAudio } from '../../api/audio';

const GUIDE_ENABLED_KEY = 'guideEnabled';

// 타이머 알림음 타입들
const TIMER_AUDIO_TYPES = ['TEN_LEFT', 'FIVE_LEFT', 'ONE_LEFT'];

// 전역 오디오 상태 관리
const audioState = {
  instance: null,
  isPlaying: false,
  currentType: null,
  playPromise: null
};

const AudioPlayer = ({ audioType, isOn=true }) => {
    const audioRef = useRef(new Audio());
    const initializingRef = useRef(false);  // 초기화 상태를 추적하는 ref 추가
    const mountedRef = useRef(true);  // 컴포넌트 마운트 상태 추적

    const [guideOn, setGuideOn] = useState(() => { // tts on/off 설정정
      const savedState = localStorage.getItem(GUIDE_ENABLED_KEY);
      return savedState === null ? true : JSON.parse(savedState);
  });

  useEffect(() => {
      const handleStorageChange = (e) => {
          console.log('Storage change event:', e.detail);
          if (e.detail.key === GUIDE_ENABLED_KEY) {
              console.log('TTS setting changed to:', e.detail.value);
              setGuideOn(JSON.parse(e.detail.value));
          }
      };

      window.addEventListener('localStorageChange', handleStorageChange);
      return () => window.removeEventListener('localStorageChange', handleStorageChange);
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    const stopCurrentAudio = async () => {
      if (audioState.playPromise) {
        await audioState.playPromise;
      }
      if (audioState.instance) {
        audioState.instance.pause();
        URL.revokeObjectURL(audioState.instance.src);
        audioState.instance.src = '';
        audioState.instance = null;
        audioState.isPlaying = false;
        audioState.currentType = null;
      }
    };

    const initializeAudio = async () => {
      // 초기 조건 체크
      if (!isOn || initializingRef.current || !mountedRef.current) return;
    
      if (!guideOn && !TIMER_AUDIO_TYPES.includes(audioType)) {
        return;
      }
    
      if (audioState.currentType === audioType && audioState.isPlaying) {
        return;
      }
    
      initializingRef.current = true;
    
      try {
        await stopCurrentAudio();
        await navigator.mediaDevices.getUserMedia({ audio: true });
        
        if (!mountedRef.current) return;
    
        const response = await fetchAudio(audioType);
        const url = URL.createObjectURL(response);
        
        if (!mountedRef.current) {
          URL.revokeObjectURL(url);
          return;
        }
    
        audioRef.current = new Audio(url);
        audioState.instance = audioRef.current;
        
        audioRef.current.onended = () => {
          console.log(`[${new Date().toLocaleTimeString()}] 오디오 재생 완료:`, audioType);
          if (audioState.instance === audioRef.current) {
            URL.revokeObjectURL(url);
            audioState.instance = null;
            audioState.isPlaying = false;
            audioState.currentType = null;
          }
          initializingRef.current = false;
        };
    
        audioState.playPromise = audioRef.current.play();
        await audioState.playPromise;
        
        if (!mountedRef.current) {
          stopCurrentAudio();
          return;
        }
    
        audioState.isPlaying = true;
        audioState.currentType = audioType;
        console.log(`[${new Date().toLocaleTimeString()}] 재생 시작:`, audioType);
      } catch (error) {
        console.error(`[${new Date().toLocaleTimeString()}] 오류 발생:`, error);
        await stopCurrentAudio();
      } finally {
        // onended 이벤트에서 처리되지 않는 경우를 위한 안전장치
        if (!audioState.isPlaying) {
          initializingRef.current = false;
        }
      }
    };

    initializeAudio();

    return () => {
      console.log(`[${new Date().toLocaleTimeString()}] 컴포넌트 언마운트 - audioType:`, audioType);
      mountedRef.current = false;
      if (audioRef.current === audioState.instance) {
        stopCurrentAudio();
      }
      initializingRef.current = false;
    };
  }, [audioType, isOn, guideOn]);

  return null;
};

export default AudioPlayer;