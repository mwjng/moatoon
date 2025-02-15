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
      // 가이드가 꺼져있고, 타이머 알림음이 아닌 경우에만 리턴
      if (!guideOn && !TIMER_AUDIO_TYPES.includes(audioType)) {
        return;
      }

      // isOn이 true일 때만 오디오 실행
      if (!isOn) return;

      try {
        // 반드시 이전 오디오 정지
        await stopCurrentAudio();

        await navigator.mediaDevices.getUserMedia({ audio: true });
        
        const response = await fetchAudio(audioType);
        const url = URL.createObjectURL(response);
        
        audioRef.current = new Audio(url);
        audioState.instance = audioRef.current;
        
        audioRef.current.onended = () => {
          console.log(`[${new Date().toLocaleTimeString()}] 오디오 재생 완료:`, audioType);
          if (audioState.instance === audioRef.current) {
            audioState.instance = null;
            audioState.isPlaying = false;
            audioState.currentType = null;
          }
        };

        // play() Promise를 저장
        audioState.playPromise = audioRef.current.play();
        await audioState.playPromise;
        
        audioState.isPlaying = true;
        audioState.currentType = audioType;
        console.log(`[${new Date().toLocaleTimeString()}] 재생 시작:`, audioType);
      } catch (error) {
        console.error(`[${new Date().toLocaleTimeString()}] 오류 발생:`, error);
        await stopCurrentAudio();
      }
    };

    initializeAudio();

    return () => {
      console.log(`[${new Date().toLocaleTimeString()}] 컴포넌트 언마운트 - audioType:`, audioType);
      if (audioRef.current === audioState.instance) {
        stopCurrentAudio();
      }
    };
  }, [audioType, isOn, guideOn]); 

  return null;
};

export default AudioPlayer;