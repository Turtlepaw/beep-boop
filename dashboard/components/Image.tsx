import NextImage from 'next/image';

export interface ImageProperties {
    className?: string;
    src?: string;
    width: number | `${number}`;
    height?: number | `${number}`;
    alt?: string;
}

export function Image({
    className,
    src,
    width,
    height,
    alt
}: ImageProperties) {
    return (
        <NextImage
            src={src}
            height={height ?? width}
            width={width}
            alt={alt ?? ""}
            className={className}
        />
    )
}