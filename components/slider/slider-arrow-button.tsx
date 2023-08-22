import { isMobileAtom } from '@/atoms';
import cls from '@/libs/client/utils';
import { CSSProperties } from 'react';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import { useRecoilValue } from 'recoil';

interface CustomCSSProperties extends CSSProperties {
  '--slide-width': string;
}

interface SliderArrowButtonProps {
  direction: 'left' | 'right';
  onClick: () => void;
  slideWidth: number;
}

export default function SliderArrowButton({
  direction,
  onClick,
  slideWidth
}: SliderArrowButtonProps) {
  const isMobile = useRecoilValue(isMobileAtom);
  return (
    <button
      onClick={onClick}
      type="button"
      className={cls(
        'slider-arrow',
        isMobile ? '' : 'opacity-0',
        direction === 'left' ? 'left-0' : 'right-0'
      )}
      style={
        {
          '--slide-width': `${slideWidth}`
        } as CustomCSSProperties
      }
    >
      {direction === 'left' && <AiOutlineLeft />}
      {direction === 'right' && <AiOutlineRight />}
    </button>
  );
}
