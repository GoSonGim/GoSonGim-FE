import { useProfileQuery } from '@/hooks/profile/queries/useProfileQuery';
import { useStreakDaysQuery } from '@/hooks/profile/queries/useStreakDaysQuery';

export default function HomeWelcome() {
  const { data: profileData } = useProfileQuery();
  const { data: streakData } = useStreakDaysQuery();

  const userName = profileData?.result.user.nickname || '사용자';
  const streakDays = streakData?.result.streakDays || 0;

  return (
    <div className="flex items-center justify-between rounded-2xl bg-white px-3 py-2 shadow-lg">
      <p className="text-heading-02-semibold text-gray-100">{userName}님, 오늘도 화이팅!</p>
      <div className="bg-blue-3 flex flex-col items-center justify-center rounded-2xl px-2 py-2 text-center leading-normal">
        <p className="text-[22px] font-semibold text-gray-100">{streakDays}일 </p>
        <p className="text-body-02-regular text-gray-80">연속 학습중🔥</p>
      </div>
    </div>
  );
}
