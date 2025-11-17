import { BottomSheet } from '@/components/auth/BottomSheet';
import { Button } from '@/components/auth/Button';
import EmailIcon from '@/assets/svgs/auth/login/emailIcon.svg';
import GoogleLogo from '@/assets/svgs/auth/login/googleLogo.svg';
import DragHandle from '@/assets/svgs/auth/signup/dragHandle.svg';
import DividerLine from '@/assets/svgs/auth/signup/dividerLine.svg';

interface SignupBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onGoogleSignup: () => void;
  onEmailSignup: () => void;
}

export const SignupBottomSheet = ({ isOpen, onClose, onGoogleSignup, onEmailSignup }: SignupBottomSheetProps) => {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <div className="flex h-[369px] flex-col items-center px-8 pb-8">
        {/* 드래그 핸들 */}
        <div className="flex w-full justify-center pt-4 pb-6">
          <DragHandle className="text-gray-30 h-1 w-[105.5px]" />
        </div>

        {/* 컨텐츠 */}
        <div className="flex w-full max-w-[328px] flex-col items-center gap-4">
          {/* 제목 */}
          <p className="text-body-02-semibold text-gray-80 mb-2">간편하게 가입하기</p>

          {/* 구글로 회원가입 버튼 */}
          <Button variant="google" icon={<GoogleLogo className="h-5 w-5" />} onClick={onGoogleSignup}>
            구글로 회원가입
          </Button>

          {/* 또는 구분선 */}
          <div className="flex w-full items-center justify-center gap-4">
            <DividerLine className="text-gray-30 h-px w-[136px]" />
            <p className="text-detail-01 text-gray-60">또는</p>
            <DividerLine className="text-gray-30 h-px w-[136px]" />
          </div>

          {/* 이메일로 회원가입 버튼 */}
          <Button variant="signup" icon={<EmailIcon className="h-5 w-5" />} onClick={onEmailSignup}>
            이메일로 회원가입
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
};
