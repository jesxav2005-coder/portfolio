export default function ElasticPhoto({ src, alt, className, style }) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={{
        ...style,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block'
      }}
      draggable={false}
    />
  );
}
