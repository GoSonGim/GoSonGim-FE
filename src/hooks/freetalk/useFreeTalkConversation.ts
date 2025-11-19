import { useState, useRef, useEffect, useCallback } from 'react';
import type { Conversation } from '@/mock/freetalk/freeTalk.mock';
import { useHeygenAvatar } from './useHeygenAvatar';
import { logger } from '@/utils/common/loggerUtils';

interface UseFreeTalkConversationReturn {
  conversations: Conversation[];
  activeConversation: Conversation | undefined;
  isRecording: boolean;
  showLoadingDots: boolean;
  isWaitingUserAnswer: boolean;
  userAnswer: string | null;
  progress: number;
  handleMicClick: () => void;
  handleStopRecording: () => void;
  // 아바타 관련
  avatarState: string;
  isSessionReady: boolean;
  avatarError: string | null;
  startSession: () => Promise<void>;
  endSession: () => Promise<void>;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

export const useFreeTalkConversation = (): UseFreeTalkConversationReturn => {
  // 대화 목록 - 빈 배열로 시작
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [showLoadingDots, setShowLoadingDots] = useState(false);
  const [isWaitingUserAnswer, setIsWaitingUserAnswer] = useState(false); // 사용자 답변 대기 중

  const conversationIdRef = useRef(1);
  const isRecordingRef = useRef(false);
  const isVoiceChatActiveRef = useRef(false); // Voice Chat 활성화 여부
  const isProcessingUserStopRef = useRef(false); // USER_STOP 이벤트 처리 중 플래그
  const userStopTimeoutRef = useRef<number | null>(null); // USER_STOP 지연 타이머
  const avatarRef = useRef<{
    stopListening: () => Promise<void>;
    endSession: () => Promise<void>;
  } | null>(null);

  // 메시지 버퍼 (스트리밍 중 누적)
  const avatarMessageBufferRef = useRef<string>('');
  const userMessageBufferRef = useRef<string>('');

  // 아바타 메시지 콜백 (스트리밍 - 한 단어씩 들어옴)
  const handleAvatarMessage = useCallback((message: string) => {
    logger.log('[AVATAR STREAM] 📥 아바타 단어:', message);

    // 버퍼에 누적
    avatarMessageBufferRef.current += message;

    logger.log('[AVATAR STREAM] 📝 현재 버퍼 누적:', avatarMessageBufferRef.current);
    logger.log('[AVATAR STREAM] 📏 버퍼 길이:', avatarMessageBufferRef.current.length);

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
      logger.log('[USER STREAM] ⏸️ 무시됨 (녹음 중 아님):', message);
      return;
    }

    logger.log('[USER STREAM] 📥 사용자 단어:', message);

    // 버퍼에 누적
    userMessageBufferRef.current += message;

    logger.log('[USER STREAM] 📝 현재 버퍼 누적:', userMessageBufferRef.current);
    logger.log('[USER STREAM] 📏 버퍼 길이:', userMessageBufferRef.current.length);
    logger.log('[USER STREAM] 🔢 isRecordingRef:', isRecordingRef.current);

    // 실시간으로 화면에 표시
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.status === 'active') {
          return {
            ...conv,
            answer: userMessageBufferRef.current, // 실시간 업데이트
          };
        }
        return conv;
      }),
    );
  }, []);

  // 아바타 말하기 시작
  const handleAvatarStartTalking = useCallback(() => {
    logger.log('=== 아바타 말하기 시작 ===');
    setShowLoadingDots(false);

    // active conversation이 있으면 그대로 사용 (질문만 업데이트될 것임)
    setConversations((prev) => {
      const activeConv = prev.find((c) => c.status === 'active');

      logger.log('[AVATAR START] 현재 active conversation:', activeConv?.id);

      // 이미 active 대화가 있으면 그대로 유지 (USER_STOP에서 이미 생성됨)
      if (activeConv) {
        logger.log('[AVATAR START] ✅ Active conversation 유지, ID:', activeConv.id);
        return prev;
      }

      // active conversation이 없으면 새로 생성 (첫 대화)
      logger.log('[AVATAR START] 📝 첫 대화 - 새 active conversation 생성, ID:', conversationIdRef.current);
      return [
        ...prev.filter((c) => c.status === 'completed'),
        {
          id: conversationIdRef.current,
          question: '',
          answer: '',
          status: 'active' as const,
        },
      ];
    });
  }, []);

  // 아바타 말하기 완료
  const handleAvatarStopTalking = useCallback(() => {
    const fullMessage = avatarMessageBufferRef.current.trim();
    logger.log('='.repeat(60));
    logger.log('[AVATAR COMPLETE] ✅ 아바타 말하기 완료');
    logger.log('[AVATAR COMPLETE] 📝 버퍼 내용:', avatarMessageBufferRef.current);
    logger.log('[AVATAR COMPLETE] ✅ 최종 문장 (trim 후):', fullMessage);
    logger.log('[AVATAR COMPLETE] 📏 최종 문장 길이:', fullMessage.length);
    logger.log('='.repeat(60));

    // 이미 실시간 업데이트됨, 로딩만 제거
    setShowLoadingDots(false);

    avatarMessageBufferRef.current = ''; // 버퍼 초기화
  }, []);

  // 사용자 말하기 완료 (아바타가 판단) - 이때 답변 추출!
  const handleUserStopTalking = useCallback(() => {
    // 중복 호출 방지
    if (isProcessingUserStopRef.current) {
      logger.log('[USER STOP] ⏸️ 이미 처리 중 - 무시');
      return;
    }

    // 녹음 중일 때만 처리
    if (!isRecordingRef.current) {
      logger.log('[USER STOP] ⏸️ 무시됨 (녹음 중 아님)');
      return;
    }

    logger.log('='.repeat(60));
    logger.log('[USER STOP] 🛑 사용자 말하기 완료 (아바타 판단)');
    logger.log('[USER STOP] ⏰ 1초 대기 후 버퍼 확인 시작...');
    logger.log('='.repeat(60));

    // 처리 시작 플래그 설정
    isProcessingUserStopRef.current = true;

    // 대기 상태 시작
    setIsWaitingUserAnswer(true);

    // 이전 타이머가 있으면 취소
    if (userStopTimeoutRef.current) {
      clearTimeout(userStopTimeoutRef.current);
      logger.log('[USER STOP] ⏰ 이전 타이머 취소');
    }

    // 5초 대기 후 버퍼 확인 및 처리
    userStopTimeoutRef.current = window.setTimeout(() => {
      logger.log('='.repeat(60));
      logger.log('[USER STOP] ⏰ 대기 완료 - 버퍼 확인 시작');
      logger.log('[USER STOP] 📝 버퍼 내용 (원본):', userMessageBufferRef.current);
      logger.log('[USER STOP] 📏 버퍼 길이 (원본):', userMessageBufferRef.current.length);

      // 대기 상태 종료
      setIsWaitingUserAnswer(false);

      // 버퍼 내용을 즉시 추출하여 별도 변수에 저장
      const capturedAnswer = userMessageBufferRef.current.trim();

      logger.log('[USER STOP] ✅ 추출된 답변 (trim 후):', capturedAnswer);
      logger.log('[USER STOP] 📏 추출된 답변 길이:', capturedAnswer.length);
      logger.log('='.repeat(60));

      // 답변이 있을 때만 저장
      if (capturedAnswer.length > 0) {
        logger.log('[USER STOP] ✅ 답변이 있음 - conversation 업데이트');

        // ✅ setConversations 호출 전에 다음 ID 계산 및 증가 (한 번만 실행)
        conversationIdRef.current++;
        const nextId = conversationIdRef.current;
        logger.log('[USER STOP] 🆔 다음 대화 ID 증가:', nextId);

        // 답변 저장 + 즉시 completed로 변경 + 새 active 생성
        setConversations((prev) => {
          // 완료된 대화 개수 확인
          const completedCount = prev.filter((c) => c.status === 'completed').length;
          logger.log('[USER STOP] 📊 현재 완료된 대화 수:', completedCount, '/ 5');

          // active conversation을 completed로 변경
          const completedConversations = prev.map((conv) => {
            if (conv.status === 'active') {
              logger.log('[USER STOP] 📝 대화 완료 처리:', {
                id: conv.id,
                question: conv.question,
                answer: capturedAnswer,
                status: 'completed',
              });
              return {
                ...conv,
                answer: capturedAnswer,
                status: 'completed' as const,
              };
            }
            return conv;
          });

          // 5번째 대화 완료 시 세션 종료
          if (completedCount >= 4) {
            logger.log('='.repeat(60));
            logger.log('[SESSION END] 🎉 5번째 대화 완료! 세션 종료');
            logger.log('='.repeat(60));

            setIsRecording(false);
            isRecordingRef.current = false;
            setShowLoadingDots(false);
            isVoiceChatActiveRef.current = false;

            setTimeout(async () => {
              try {
                if (avatarRef.current) {
                  await avatarRef.current.stopListening();
                  await avatarRef.current.endSession();
                }
                alert('대화가 완료되었습니다! 수고하셨어요 😊');
              } catch (error) {
                logger.error('Failed to end session:', error);
              }
            }, 1000);

            return completedConversations;
          }

          // 다음 질문을 위한 준비
          setIsRecording(false);
          isRecordingRef.current = false;
          setShowLoadingDots(true);

          // 즉시 새 active conversation 생성 (nextId는 이미 증가됨)
          logger.log('[USER STOP] 📝 새 active conversation 생성, ID:', nextId);
          return [
            ...completedConversations,
            {
              id: nextId,
              question: '',
              answer: '',
              status: 'active' as const,
            },
          ];
        });

        logger.log('[USER STOP] ✅ 버퍼 유지 (다음 녹음 시 초기화)');
      } else {
        logger.log('[USER STOP] ⚠️ 답변이 비어있음 - 녹음 종료');
        setIsRecording(false);
        isRecordingRef.current = false;
      }

      // 처리 완료 플래그 해제
      setTimeout(() => {
        isProcessingUserStopRef.current = false;
        logger.log('[USER STOP] 🔓 처리 완료 플래그 해제');
      }, 100);

      // 타이머 ref 초기화
      userStopTimeoutRef.current = null;
    }, 1000); // 1초 대기
  }, []);

  // HeyGen 아바타 훅
  const avatar = useHeygenAvatar({
    language: 'ko',
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
      onUserStop: handleUserStopTalking, // 사용자 말 끝남 이벤트
    },
  });

  // Avatar 메서드를 ref에 저장
  useEffect(() => {
    avatarRef.current = {
      stopListening: avatar.stopListening,
      endSession: avatar.endSession,
    };
  }, [avatar.stopListening, avatar.endSession]);

  // 현재 활성 대화 찾기
  const activeConversation = conversations.find((conv) => conv.status === 'active');

  // 세션이 준비되면 아바타가 먼저 인사 + Voice Chat 시작
  useEffect(() => {
    if (avatar.isSessionReady && conversations.length === 0) {
      const startConversation = async () => {
        try {
          logger.log('=== 아바타 세션 준비 완료. 아바타 첫 인사 시작 ===');
          setShowLoadingDots(true);
          avatarMessageBufferRef.current = '';

          await avatar.speak({
            text: '안녕하세요! 저는 당신의 한국어 회화 연습을 도와줄 AI 선생님이에요. ' +
              '오늘은 일상 대화를 연습해볼까요? 예를 들어, 좋아하는 음식이나 취미, 최근에 본 영화에 대해 이야기해주세요!',
          });
          logger.log('아바타 첫 인사 완료.');
        } catch (error) {
          logger.error('Failed to auto-start conversation:', error);
          setShowLoadingDots(false);
        }
      };

      const timer = setTimeout(startConversation, 500);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [avatar.isSessionReady, conversations.length]);

  // 마이크 클릭 핸들러 (녹음 시작)
  const handleMicClick = async () => {
    if (!avatar.isSessionReady) {
      logger.log('Avatar session not ready');
      return;
    }

    if (!activeConversation || isRecording) return;

    logger.log('='.repeat(60));
    logger.log('[MIC] 🎤 마이크 클릭 - 녹음 시작');
    logger.log('[MIC] 🆔 현재 대화 ID:', activeConversation.id);
    logger.log('[MIC] 🧹 이전 버퍼 내용:', userMessageBufferRef.current);
    logger.log('='.repeat(60));

    // 대기 중인 USER_STOP 타이머 취소
    if (userStopTimeoutRef.current) {
      clearTimeout(userStopTimeoutRef.current);
      userStopTimeoutRef.current = null;
      logger.log('[MIC] ⏰ 대기 중인 USER_STOP 타이머 취소');
    }

    // 대기 상태 초기화
    setIsWaitingUserAnswer(false);

    // 녹음 시작 - 상태 업데이트
    setIsRecording(true);
    isRecordingRef.current = true;

    // 버퍼 초기화 (이전 대화의 잔여 데이터 제거)
    userMessageBufferRef.current = '';
    logger.log('[MIC] 🧹 버퍼 초기화 완료');

    // 처리 플래그 리셋
    isProcessingUserStopRef.current = false;
    logger.log('[MIC] 🔓 처리 플래그 리셋');

    // 빈 답변 박스 미리 생성
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.status === 'active') {
          logger.log('[MIC] 📝 빈 답변 박스 생성');
          return {
            ...conv,
            answer: '',
          };
        }
        return conv;
      }),
    );

    try {
      // 첫 번째 녹음 시에만 Voice Chat 시작
      if (!isVoiceChatActiveRef.current) {
        logger.log('[MIC] 🎙️ 첫 녹음: Voice Chat 시작 (이후 계속 유지)');
        await avatar.startListening();
        isVoiceChatActiveRef.current = true;
        logger.log('[MIC] ✅ Voice Chat 시작 완료');
      } else {
        logger.log('[MIC] ✅ Voice Chat 이미 활성화됨 - 계속 녹음');
      }
    } catch (error) {
      logger.error('[MIC] ❌ Failed to start voice chat:', error);
      if (error instanceof Error && error.name === 'NotAllowedError') {
        alert('마이크 권한이 필요합니다. 브라우저 설정에서 마이크 권한을 허용해주세요.');
      }
      setIsRecording(false);
      isRecordingRef.current = false;
    }
  };

  // 녹음 중단 핸들러 (수동 중단용 - 실제로는 USER_STOP 이벤트로 자동 처리)
  const handleStopRecording = async () => {
    // 이 함수는 비상용 - 일반적으로 USER_STOP 이벤트가 자동으로 처리
    logger.log('[MANUAL STOP] 수동 녹음 중단');
    if (!isRecording) return;

    setIsRecording(false);
    isRecordingRef.current = false;
  };

  // Cleanup
  useEffect(() => {
    return () => {
      // 타이머 정리
      if (userStopTimeoutRef.current) {
        clearTimeout(userStopTimeoutRef.current);
        userStopTimeoutRef.current = null;
      }
    };
  }, []);

  return {
    conversations,
    activeConversation,
    isRecording,
    showLoadingDots,
    isWaitingUserAnswer,
    userAnswer: null,
    progress: 0,
    handleMicClick,
    handleStopRecording,
    // 아바타 관련
    avatarState: avatar.avatarState,
    isSessionReady: avatar.isSessionReady,
    avatarError: avatar.error,
    startSession: avatar.startSession,
    endSession: avatar.endSession,
    videoRef: avatar.videoRef,
  };
};
