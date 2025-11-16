import { useNavigate } from 'react-router-dom';

interface ScoreModalProps {
  isOpen: boolean;
  score: number;
  onClose: () => void;
}

export default function ScoreModal({ isOpen, score, onClose }: ScoreModalProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleClose = () => {
    onClose();
    navigate('/review');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="flex w-[296px] flex-col items-center gap-8 rounded-2xl bg-white p-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="text-heading-01 text-gray-100">점수는 {score}점입니다!</h2>
          <p className="text-body-01-regular text-gray-60">
            정말 잘하셨습니다! 더 노력하면
            <br />
            발음이 훨씬 좋아질 거에요.
          </p>
        </div>

        <button
          onClick={handleClose}
          className="text-body-01-regular bg-blue-1 w-full cursor-pointer rounded-lg px-[45px] py-3 text-white"
        >
          복습으로 돌아가기
        </button>
      </div>
    </div>
  );
}
