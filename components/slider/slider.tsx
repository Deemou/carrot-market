import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useRecoilValue } from 'recoil';
import { Product } from '@prisma/client';
import { slideContentCols, windowWidthAtom } from '../../atoms';
import ProductSlide from '../product/product-slide';
import SliderArrowButton from './slider-arrow-button';

interface SliderProps {
  maxLength: number;
  type: 'product';
  title: string;
  list: Product[];
}

export default function Slider({ maxLength, type, title, list }: SliderProps) {
  const offset = useRecoilValue(slideContentCols);
  const windowWidth = useRecoilValue(windowWidthAtom);
  const sliderWidth = Math.min(maxLength, windowWidth - 40);
  const slideWidth = Math.floor(sliderWidth / offset);
  const maxIndex = Math.ceil(list.length / offset);

  const [direction, setDirection] = useState('right');
  const [index, setIndex] = useState(1);
  const [leaving, setLeaving] = useState(false);
  const dragWrapperRef = useRef<HTMLDivElement>(null);

  const rowVariants = {
    hidden: (to: string) => {
      return {
        x: to === 'right' ? sliderWidth + 5 : -sliderWidth - 5
      };
    },
    visible: {
      x: 0,
      y: 0
    },
    exit: (to: string) => {
      return {
        x: to === 'right' ? -sliderWidth - 5 : sliderWidth + 5
      };
    }
  };

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

  // resize로 인해 index의 값이 엄청 커진 상태에서 offset 개수가 많아지면 값이 안 맞는 현상 막기 위해 재연산 처리 추가
  useEffect(() => {
    if (index > maxIndex) {
      setIndex(maxIndex);
    }
  }, [offset, index, setIndex, maxIndex]);

  const onClickArrowButton = useCallback(
    (to: string) => {
      // 슬라이더 버튼 및 드래그로 인한 강제 흘러감 방지
      if (leaving) return;

      setLeaving(true);
      setDirection(to);

      if (to === 'right') setIndex((prev) => prev + 1);
      else setIndex((prev) => prev - 1);
    },
    [leaving]
  );

  return (
    <motion.div ref={dragWrapperRef} className="slider">
      <h3>{title}</h3>
      {index !== 1 && (
        <SliderArrowButton
          direction="left"
          onClick={() => onClickArrowButton('left')}
          slideWidth={slideWidth}
        />
      )}
      {index !== maxIndex && (
        <SliderArrowButton
          direction="right"
          onClick={() => onClickArrowButton('right')}
          slideWidth={slideWidth}
        />
      )}
      <AnimatePresence
        initial={false}
        onExitComplete={() => setLeaving(false)}
        custom={direction}
      >
        <motion.div {...rowProps} className="slider-row">
          {list
            .slice(offset * (index - 1), offset * index)
            .map(
              (item) =>
                type === 'product' && (
                  <ProductSlide key={item.id} offset={offset} product={item} />
                )
            )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
