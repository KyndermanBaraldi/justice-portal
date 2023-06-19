import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./carousel.module.css";

interface CarouselProps {
  images: {
    src: string;
    alt: string;
  }[];
  interval?: number;
  width?: number;
  height?: number;
}

const Carousel: React.FC<CarouselProps> = ({ images, interval = 3000, width = 300, height = 200 }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

 
  useEffect(() => {

    const timer = setInterval(() => {
      handleNext();
    }, interval);

    return () => {
      clearInterval(timer);
    };
  }, [interval]);

  return (
    <div className={styles.carousel}>
      
      <div className={styles.imageContainer}
        style={{
          width: width,
          height: height
        }}
      >
        {images.map((image, index) => (
          <Image
            key={index}
            src={image.src}
            alt={image.alt}
            width={width}
            height={height}
            className={index === activeIndex ? styles.active : ""}
          />
        ))}
      </div>
      <Image
          className={styles.image}
          src="/escrevente-vestido-como-super-heroi.png"
          alt="Escrevente vestido como super heroi"
          width={423}
          height={600}
        />
    </div>
  );
};

export default Carousel;