import { useEffect, useRef } from 'react';
import { fetchAudio } from '../../api/audio';

// 전역 오디오 상태 관리
const audioState = {
  instance: null,
  isPlaying: false,
  currentType: null,
  playPromise: null
};

const AudioPlayer = ({ audioType }) => {
  const audioRef = useRef(new Audio());

  useEffect(() => {
    console.log(`[${new Date().toLocaleTimeString()}] 컴포넌트 마운트 - audioType:`, audioType);

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
  }, [audioType]);

  return null;
};

export default AudioPlayer;