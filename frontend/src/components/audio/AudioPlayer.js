import { useEffect, useRef } from 'react';
import { fetchAudio } from '../../api/audio';

const AudioPlayer = ({ audioType }) => {
  const audioRef = useRef(new Audio());

  useEffect(() => {
    const initializeAudio = async () => {
      try {
        // 오디오 권한 요청
        await navigator.mediaDevices.getUserMedia({ audio: true });

        // 권한을 얻은 후 오디오 재생
        const response = await fetchAudio(audioType);
        const url = URL.createObjectURL(response);
        audioRef.current.src = url;
        await audioRef.current.play();
        console.log('오디오 재생됨');
      } catch (error) {
        console.error('오디오 초기화/재생 오류:', error);
      }
    };

    initializeAudio();

    return () => {
      URL.revokeObjectURL(audioRef.current.src);
      audioRef.current.pause();
      audioRef.current.src = '';
    };
  }, [audioType]);

  return null;
};

export default AudioPlayer;