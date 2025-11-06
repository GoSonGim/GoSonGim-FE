import { useState, useRef, useEffect, useCallback } from 'react';
import type { Conversation } from '@/mock/freetalk/freeTalk.mock';
import { useHeygenAvatar } from './useHeygenAvatar';

interface UseFreeTalkConversationReturn {
  conversations: Conversation[];
  activeConversation: Conversation | undefined;
  isRecording: boolean;
  showLoadingDots: boolean;
  userAnswer: string | null;
  progress: number;
  handleMicClick: () => void;
  handleStopRecording: () => void;
  // 아바타 관련
  avatarState: string;
  isSessionReady: boolean;
  avatarError: string | null;
  startSession: () => Promise<void>;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

export const useFreeTalkConversation = (): UseFreeTalkConversationReturn => {
  // 대화 목록 - 빈 배열로 시작 (AI가 대화를 생성)
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [showLoadingDots, setShowLoadingDots] = useState(false);
  const [userAnswer, setUserAnswer] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const loadingTimerRef = useRef<number | null>(null);
  const completeTimerRef = useRef<number | null>(null);
  const progressIntervalRef = useRef<number | null>(null);
  const conversationIdRef = useRef(1);
  const isRecordingRef = useRef(false);

  // 메시지 버퍼 (스트리밍 중 누적)
  const avatarMessageBufferRef = useRef<string>('');
  const userMessageBufferRef = useRef<string>('');

  // 아바타 메시지 콜백 (스트리밍 - 한 단어씩 들어옴)
  const handleAvatarMessage = useCallback((message: string) => {
    console.log('[AVATAR STREAM] 아바타 단어:', message);

    // 버퍼에 누적
    avatarMessageBufferRef.current += message;

    setConversations((prev) => {
      // active conversation이 없으면 즉시 생성
      if (!prev.some((c) => c.status === 'active')) {
        return [
          ...prev.filter((c) => c.status === 'completed'),
          {
            id: conversationIdRef.current,
            question: avatarMessageBufferRef.current.trim(),
            status: 'active' as const,
          },
        ];
      }

      // 있으면 실시간 업데이트
      return prev.map((conv) => {
        if (conv.status === 'active' && conv.id === conversationIdRef.current) {
          return {
            ...conv,
            question: avatarMessageBufferRef.current.trim(),
          };
        }
        return conv;
      });
    });
  }, []);

  // 사용자 메시지 콜백 (스트리밍 - 한 단어씩 들어옴)
  const handleUserMessage = useCallback((message: string) => {
    // 녹음 중일 때만 메시지 처리
    if (!isRecordingRef.current) {
      console.log('[USER STREAM] 무시됨 (녹음 중 아님):', message);
      return;
    }

    console.log('[USER STREAM] 사용자 단어:', message);

    // 버퍼에 누적
    userMessageBufferRef.current += message;
  }, []);

  // 아바타 말하기 시작
  const handleAvatarStartTalking = useCallback(() => {
    console.log('=== 아바타 말하기 시작 ===');
    setShowLoadingDots(false);

    // 즉시 대화 항목 추가 (빈 텍스트로 시작)
    setConversations((prev) => {
      const completed = prev.filter((c) => c.status === 'completed');
      // 이미 active 대화가 있으면 추가하지 않음
      if (prev.some((c) => c.status === 'active')) {
        return prev;
      }
      return [
        ...completed,
        {
          id: conversationIdRef.current,
          question: '', // 빈 문자열로 시작
          status: 'active' as const,
        },
      ];
    });
  }, []);

  // 아바타 말하기 완료
  const handleAvatarStopTalking = useCallback(() => {
    const fullMessage = avatarMessageBufferRef.current.trim();
    console.log('=== 아바타 말하기 완료 ===');
    console.log('[AVATAR COMPLETE] 완전한 문장:', fullMessage);

    // 이미 실시간 업데이트됨, 로딩만 제거
    setUserAnswer(null);
    setShowLoadingDots(false);

    avatarMessageBufferRef.current = ''; // 버퍼 초기화
  }, []);

  // 사용자 말하기 완료 (잠시 멈춤) - 버퍼는 유지
  const handleUserStopTalking = useCallback(() => {
    // 녹음 중일 때만 로그 출력
    if (!isRecordingRef.current) {
      console.log('=== 사용자 말하기 완료 (무시됨 - 녹음 중 아님) ===');
      return; // 버퍼는 초기화하지 않음
    }

    console.log('=== 사용자 말 잠시 멈춤 (계속 녹음 중) ===');
    console.log('[USER PAUSED] 현재 버퍼:', userMessageBufferRef.current.trim());
    // 버퍼는 유지, userAnswer도 설정하지 않음
  }, []);

  // HeyGen 아바타 훅 - 콜백을 여기서 설정
  const avatar = useHeygenAvatar({
    language: 'ko', // 한국어 설정
    knowledgeBase: `당신은 한국어 회화 연습을 돕는 친절한 AI 선생님입니다.

<중요한 규칙>
1. 대화를 이어가기 위한 자연스럽고 흥미로운 질문을 하세요.
2. 학습자의 답변에 대해 간단한 피드백을 주고, 다음 질문으로 자연스럽게 이어가세요.
3. 일상생활, 취미, 음식, 여행 등 친근한 주제로 대화하세요.
4. 간단하고 명확한 한국어로 말하며, 너무 길지 않게 2-3문장 정도로 응답하세요.
5. 격려하고 긍정적인 톤을 유지하세요.
</중요한 규칙>`,
    callbacks: {
      onAvatarMessage: handleAvatarMessage,
      onUserMessage: handleUserMessage,
      onAvatarStartTalking: handleAvatarStartTalking,
      onAvatarStopTalking: handleAvatarStopTalking,
      onUserStop: handleUserStopTalking,
    },
  });

  // 현재 활성 대화 찾기
  const activeConversation = conversations.find((conv) => conv.status === 'active');

  // 프로그레스 업데이트
  useEffect(() => {
    if (isRecording) {
      setProgress(0);
      const duration = 3000; // 3초
      const interval = 50; // 50ms마다 업데이트
      const increment = (100 / duration) * interval;

      progressIntervalRef.current = window.setInterval(() => {
        setProgress((prev) => {
          const next = prev + increment;
          if (next >= 100) {
            if (progressIntervalRef.current) {
              clearInterval(progressIntervalRef.current);
              progressIntervalRef.current = null;
            }
            return 100;
          }
          return next;
        });
      }, interval);

      return () => {
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
        }
      };
    } else {
      setProgress(0);
    }
  }, [isRecording]);

  // 세션이 준비되면 아바타가 먼저 인사 + Voice Chat 시작
  useEffect(() => {
    if (avatar.isSessionReady && conversations.length === 0) {
      const startConversation = async () => {
        try {
          console.log('=== 아바타 세션 준비 완료. 아바타 첫 인사 시작 ===');

          // 로딩 표시
          setShowLoadingDots(true);

          // 버퍼 초기화 (speak 호출 전)
          avatarMessageBufferRef.current = '';

          // 아바타가 먼저 인사 및 주제 제시
          await avatar.speak(
            '안녕하세요! 저는 당신의 한국어 회화 연습을 도와줄 AI 선생님이에요. ' +
              '오늘은 일상 대화를 연습해볼까요? 예를 들어, 좋아하는 음식이나 취미, 최근에 본 영화에 대해 이야기해주세요!',
          );
          console.log('아바타 첫 인사 완료. 사용자가 마이크 버튼을 누르면 Voice Chat이 시작됩니다.');
        } catch (error) {
          console.error('Failed to auto-start conversation:', error);
          setShowLoadingDots(false);
        }
      };

      // 약간의 지연 후 자동 시작
      const timer = setTimeout(startConversation, 500);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [avatar.isSessionReady, conversations.length]);

  // 마이크 클릭 핸들러 (녹음 시작)
  const handleMicClick = async () => {
    if (!avatar.isSessionReady) {
      console.log('Avatar session not ready');
      return;
    }

    if (!activeConversation || isRecording) return;

    setIsRecording(true);
    isRecordingRef.current = true; // ref 업데이트
    setUserAnswer(null);
    userMessageBufferRef.current = ''; // 버퍼 초기화

    try {
      console.log('=== 사용자 녹음 시작: Voice Chat 시작 ===');
      await avatar.startListening();
      console.log('Voice Chat 시작됨. 음성 인식 중...');
    } catch (error) {
      console.error('Failed to start voice chat:', error);
      if (error instanceof Error && error.name === 'NotAllowedError') {
        alert('마이크 권한이 필요합니다. 브라우저 설정에서 마이크 권한을 허용해주세요.');
      }
      setIsRecording(false);
      isRecordingRef.current = false;
    }
  };

  // 녹음 중단 핸들러
  const handleStopRecording = async () => {
    if (!isRecording || !activeConversation) return;

    // 타이머 취소
    if (loadingTimerRef.current) {
      clearTimeout(loadingTimerRef.current);
      loadingTimerRef.current = null;
    }
    if (completeTimerRef.current) {
      clearTimeout(completeTimerRef.current);
      completeTimerRef.current = null;
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }

    // 버퍼에서 최종 사용자 답변 추출
    const finalAnswer = userMessageBufferRef.current.trim() || '답변을 받지 못했습니다.';
    const hasAnswer = userMessageBufferRef.current.trim() !== '';

    console.log('[STOP] 녹음 중단, 최종 사용자 답변:', finalAnswer);

    // 버퍼 초기화
    userMessageBufferRef.current = '';

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === activeConversation.id) {
          return {
            ...conv,
            status: 'completed' as const,
            answer: finalAnswer,
          };
        }
        return conv;
      }),
    );

    // 다음 대화 ID 증가
    conversationIdRef.current++;

    // 완료된 대화 개수 확인
    const completedCount = conversations.filter((c) => c.status === 'completed').length + 1; // +1은 방금 완료된 대화

    if (completedCount >= 5) {
      console.log('[SESSION END] 대화 5개 완료. 세션 종료');
      setIsRecording(false);
      setShowLoadingDots(false);
      setUserAnswer(null);

      // Voice Chat 종료
      setTimeout(async () => {
        try {
          await avatar.stopListening();
          await avatar.endSession();

          // 종료 메시지 표시
          alert('대화가 완료되었습니다! 수고하셨어요 😊');
        } catch (error) {
          console.error('Failed to end session:', error);
        }
      }, 1000);

      return; // 더 이상 진행하지 않음
    }

    setIsRecording(false);
    isRecordingRef.current = false; // ref 업데이트

    // Voice Chat 종료
    try {
      console.log('Voice Chat 종료');
      await avatar.stopListening();
    } catch (error) {
      console.error('Failed to stop voice chat:', error);
    }

    setShowLoadingDots(true); // 아바타의 다음 질문 대기
    setUserAnswer(null);

    // 답변이 없으면 아바타가 자동으로 다음 질문 요청
    if (!hasAnswer) {
      console.log('[NO ANSWER] 답변 없음. 아바타에게 다음 질문 요청');
      setTimeout(async () => {
        try {
          await avatar.speak('계속해서 대화를 나눠볼까요? 다른 주제로 이야기해주세요!');
        } catch (error) {
          console.error('Failed to speak next question:', error);
          setShowLoadingDots(false);
        }
      }, 500);
    }
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);
      if (completeTimerRef.current) clearTimeout(completeTimerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, []);

  return {
    conversations,
    activeConversation,
    isRecording,
    showLoadingDots,
    userAnswer,
    progress,
    handleMicClick,
    handleStopRecording,
    // 아바타 관련
    avatarState: avatar.avatarState,
    isSessionReady: avatar.isSessionReady,
    avatarError: avatar.error,
    startSession: avatar.startSession,
    videoRef: avatar.videoRef,
  };
};
