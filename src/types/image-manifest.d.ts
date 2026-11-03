declare module 'virtual:image-manifest' {
  type ImageVariant = { width: number; format: 'avif' | 'webp'; src: string }
  type ImageMetadata = { width: number; height: number; variants: ImageVariant[] }
  const images: Record<string, ImageMetadata | undefined>
  export default images
}
