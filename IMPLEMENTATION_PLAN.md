# 복습 녹음 재생 기능 구현 계획

## 📋 Issue: #48

## 🎯 목표
- 상황극 복습 녹음 듣기 기능 구현
- 조음 키트 복습 녹음 듣기 기능 구현
- Mock 데이터를 실제 API로 대체

## 📊 조사 결과 요약

### 오디오 URL 발급 구조
- ✅ 상황극 복습 API: `conversation[].answer.audioUrl` (presigned URL 직접 반환)
- ✅ 조음 키트 복습 API: `records[].audioFileUrl` (presigned URL 직접 반환)
- ⏰ URL 만료: 3600초 (1시간)
- 🔑 별도 다운로드 URL 발급 불필요

### UUID/파일명 생성 규칙
- WordQuiz: `word{index}_{uuid}.wav`
- Articulation: `round{round}_{uuid}.wav`
- Situation: `situation_{id}_turn{index}_{timestamp}.wav`

### 중요 이슈 발견
- ⚠️ ArticulationListen은 `recordingId`를 받지만 API는 `kitId` 필요
- ⚠️ ReviewPractice에서 `kit.recordingId` 전달 → `kit.kitId`로 변경 필요

---

## 🚀 구현 단계

### Phase 1: Types 정의

**파일:**
- `src/types/review/queries/situationDetail.types.ts`
- `src/types/review/queries/kitDetail.types.ts`
- `src/types/review/index.ts` (barrel export 업데이트)

**내용:**
```typescript
// situationDetail.types.ts
export interface SituationDetailRequest {
  recordingId: number;
}

export interface SituationDetailResponse {
  recordingId: number;
  situation: {
    id: number;
    name: string;
  };
  evaluation: {
    score: number;
    feedback: string;
  };
  conversation: Array<{
    question: string;
    answer: {
      text: string;
      audioUrl: string;
      audioExpiresIn: number;
    };
  }>;
}
```

```typescript
// kitDetail.types.ts
export interface KitDetailRequest {
  kitId: number;
}

export interface KitDetailResponse {
  kitId: number;
  kitName: string;
  records: Array<{
    id: number;
    kitStageId: number;
    kitStageName: string;
    evaluationScore: number;
    evaluationFeedback: string;
    isSuccess: boolean;
    targetWord: string;
    audioFileUrl: string;
    createdAt: string;
  }>;
}
```

**커밋:** `#48 [FEAT] 복습 상세 조회 타입 정의`

---

### Phase 2: API 함수 생성

**파일:**
- `src/apis/review/queries/situationDetail.ts`
- `src/apis/review/queries/kitDetail.ts`
- `src/apis/review/index.ts` (업데이트)

**내용:**
```typescript
// situationDetail.ts
export const getSituationDetail = async (
  recordingId: number
): Promise<SituationDetailResponse> => {
  const response = await apiClient.get<ApiResponse<SituationDetailResponse>>(
    `/api/v1/review/situations/${recordingId}`
  );
  return response.data.result;
};
```

```typescript
// kitDetail.ts
export const getKitDetail = async (
  kitId: number
): Promise<KitDetailResponse> => {
  const response = await apiClient.get<ApiResponse<KitDetailResponse>>(
    `/api/v1/review/kits/${kitId}`
  );
  return response.data.result;
};
```

**커밋:** `#48 [FEAT] 복습 상세 조회 API 함수 추가`

---

### Phase 3: React Query Hooks

**파일:**
- `src/hooks/review/queries/useSituationDetailQuery.ts`
- `src/hooks/review/queries/useKitDetailQuery.ts`

**내용:**
```typescript
// useSituationDetailQuery.ts
export const useSituationDetailQuery = (recordingId: number) => {
  return useQuery({
    queryKey: ['situationDetail', recordingId],
    queryFn: () => reviewAPI.getSituationDetail(recordingId),
    enabled: recordingId > 0,
    staleTime: 1000 * 60 * 5,
  });
};
```

**커밋:** `#48 [FEAT] 복습 상세 조회 React Query 훅 추가`

---

### Phase 4: 오디오 재생 Hook

**파일:**
- `src/hooks/review/useAudioPlayer.ts`

**내용:**
- HTML5 Audio API 기반
- 재생/정지, 진행바, 5초 앞뒤 이동
- duration, currentTime, progress 상태 관리

**커밋:** `#48 [FEAT] 오디오 재생 훅 구현`

---

### Phase 5.1: SituationListen 통합

**파일:**
- `src/pages/review/practice/listen/SituationListen.tsx`

**변경사항:**
- ❌ Mock 데이터 제거
- ✅ `useSituationDetailQuery(recordingId)` 연동
- ✅ `useAudioPlayer()` 연동
- ✅ `conversation` 배열 렌더링
- ✅ 실제 audioUrl 재생

**커밋:** `#48 [FEAT] 상황극 복습 듣기 페이지 API 연동`

---

### Phase 5.2: ArticulationListen 통합

**파일:**
- `src/pages/review/practice/listen/ArticulationListen.tsx`

**변경사항:**
- ❌ Mock 데이터 제거
- ⚠️ URL 파라미터: `recordingId` → `kitId`로 변경
- ✅ `useKitDetailQuery(kitId)` 연동
- ✅ `useAudioPlayer()` 연동
- ✅ `records` 배열 렌더링
- ✅ 실제 audioFileUrl 재생

**커밋:** `#48 [FEAT] 조음 키트 복습 듣기 페이지 API 연동`

---

### Phase 5.3: ReviewPractice 수정

**파일:**
- `src/pages/review/practice/ReviewPractice.tsx`

**변경사항:**
- 조음 키트 녹음 듣기 버튼 수정 (Line 206):
  ```typescript
  // 변경 전
  navigate(`/review/practice/articulation-listen?recordingId=${kit.recordingId}`)

  // 변경 후
  navigate(`/review/practice/articulation-listen?kitId=${kit.kitId}`)
  ```

**커밋:** `#48 [FIX] 조음 키트 복습 듣기 파라미터 수정`

---

### Phase 6: 에러 처리 & UI 개선

**변경사항:**
- 로딩 상태 (React Query의 `isLoading`, `isFetching`)
- 에러 처리 (401/403/404)
- 오디오 재생 실패 처리

**커밋:** `#48 [FEAT] 복습 듣기 에러 처리 및 UI 개선`

---

### Phase 7: Mock 파일 정리

**삭제할 파일:**
- `src/mock/reviewPracticeListen.mock.ts`
- `src/mock/articulationPracticeListen.mock.ts`
- `src/hooks/review/useReviewPracticeListen.ts`
- `src/hooks/review/useArticulationPracticeListen.ts`

**커밋:** `#48 [REFACTOR] Mock 파일 정리`

---

## ✅ 완료 기준

1. 상황극 복습 녹음 듣기 페이지에서 실제 녹음 파일 재생
2. 조음 키트 복습 녹음 듣기 페이지에서 실제 녹음 파일 재생
3. 오디오 재생 컨트롤 (재생/정지, 진행바, 5초 이동) 정상 동작
4. 에러 처리 및 로딩 상태 표시
5. Mock 파일 완전 제거

---

## 📝 참고사항

### API 엔드포인트
- 상황극: `GET /api/v1/review/situations/{recordingId}`
- 조음 키트: `GET /api/v1/review/kits/{kitId}`

### Presigned URL 만료
- 유효 시간: 3600초 (1시간)
- API 응답에 직접 포함
- 별도 다운로드 URL 발급 불필요
