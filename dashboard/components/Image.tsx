import NextImage from 'next/image';
import { CSSProperties } from 'react';

export interface ImageProperties {
    className?: string;
    src?: string;
    width: number | `${number}`;
    height?: number | `${number}`;
    alt?: string;
    loading?: "eager" | "lazy";
    layout?: boolean;
    style?: CSSProperties;
}

export function Image({
    className,
    src,
    width,
    height,
    alt,
    loading,
    layout,
    style
}: ImageProperties) {
    return (
        <NextImage
            src={src}
            style={style}
            height={height ?? width}
            width={width}
            alt={alt ?? ""}
            className={className}
            loading={loading}
            fill={layout}
        />
    )
}

export interface ImageOptions {
    size?: number;
    className?: string;
}

export class Images {
    static Discord({ className, size }: ImageOptions) {
        return <Image width={size ?? 25} alt="Discord Logo" src='/Discord.svg' className={className} />
    }
}