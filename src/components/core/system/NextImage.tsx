import Image, { ImageProps } from "next/image";

export const NextImage = ({ src, alt, ...props }: ImageProps) => {
  return <Image src={src} alt={alt} {...props} />;
};

export default NextImage