import { CSSProperties, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import { useRecoilValue } from 'recoil';
import Link from 'next/link';
import Image from 'next/image';
import cls from '@/libs/client/utils';
import { Product } from '@prisma/client';
import { slideContentCols, windowWidthAtom, isMobileAtom } from '../atoms';

const RIGHT = 'right';
const LEFT = 'left';

interface CustomCSSProperties extends CSSProperties {
  '--slide-width'?: string;
  '--offset'?: string;
}

interface SliderProps {
  maxLength: number;
  type: 'product';
  title: string;
  list: Product[];
}

export default function Slider({ maxLength, type, title, list }: SliderProps) {
  const isMobile = useRecoilValue(isMobileAtom);
  const offset = useRecoilValue(slideContentCols);
  const windowWidth = useRecoilValue(windowWidthAtom);
  const sliderWidth = Math.min(maxLength, windowWidth - 40);
  const slideWidth = Math.floor(sliderWidth / offset);
  const maxIndex = Math.ceil(list.length / offset);

  const [direction, setDirection] = useState(RIGHT);
  const [index, setIndex] = useState(1);
  const [leaving, setLeaving] = useState(false);
  const dragWrapperRef = useRef<HTMLDivElement>(null);

  const rowVariants = {
    hidden: (to: string) => {
      return {
        x: to === RIGHT ? sliderWidth + 5 : -sliderWidth - 5
      };
    },
    visible: {
      x: 0,
      y: 0
    },
    exit: (to: string) => {
      return {
        x: to === RIGHT ? -sliderWidth - 5 : sliderWidth + 5
      };
    }
  };

  const changeIndex = (to: string) => {
    // 슬라이더 버튼 및 드래그로 인한 강제 흘러감 방지
    if (leaving) return;

    setLeaving(true);
    setDirection(to);

    if (to === RIGHT) setIndex((prev) => prev + 1);
    else setIndex((prev) => prev - 1);
  };

  // resize로 인해 index의 값이 엄청 커진 상태에서 offset 개수가 많아지면 값이 안 맞는 현상 막기 위해 재연산 처리 추가
  useEffect(() => {
    if (index > maxIndex) {
      setIndex(maxIndex);
    }
  }, [offset, index, setIndex, maxIndex]);

  const rowProps = {
    gridcnt: offset,
    custom: direction,
    variants: rowVariants,
    initial: 'hidden',
    animate: 'visible',
    exit: 'exit',
    transition: { type: 'tween', duration: 0.5 },
    key: index
  };

  const onClickArrowBtn = (to: string) => {
    if (leaving) return;
    changeIndex(to);
  };

  return (
    <motion.div ref={dragWrapperRef} className="slider">
      <h3>{title}</h3>
      {index !== 1 && (
        <button
          onClick={() => onClickArrowBtn(LEFT)}
          type="button"
          className={cls('slider-arrow left-0', isMobile ? '' : 'opacity-0')}
          style={
            {
              '--slide-width': `${slideWidth}`
            } as CustomCSSProperties
          }
        >
          <AiOutlineLeft />
        </button>
      )}
      {index !== maxIndex && (
        <button
          onClick={() => onClickArrowBtn(RIGHT)}
          type="button"
          className={cls('slider-arrow right-0', isMobile ? '' : 'opacity-0')}
          style={{ '--slide-width': `${slideWidth}` } as CustomCSSProperties}
        >
          <AiOutlineRight />
        </button>
      )}
      <AnimatePresence
        initial={false}
        onExitComplete={() => setLeaving(false)}
        custom={direction}
      >
        <motion.div {...rowProps} className="slider-row">
          {type === 'product' &&
            list.slice(offset * (index - 1), offset * index).map((item) => (
              <motion.div
                key={item.id}
                transition={{ type: 'tween' }}
                layoutId={item.id.toString()}
                className="slide"
                style={{ '--offset': `${offset}` } as CustomCSSProperties}
              >
                <Link href={`/products/${item.id}`}>
                  <div>
                    <div className="relative mb-4 aspect-square w-full">
                      <Image
                        src={item.image}
                        alt="product"
                        fill
                        sizes="50vw"
                        priority
                        className="object-center"
                      />
                    </div>
                    <div className="flex flex-col">
                      <div className="h-[42px] overflow-hidden">
                        <span>{item.name}</span>
                      </div>
                      <span className="mt-1">${item.price}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
