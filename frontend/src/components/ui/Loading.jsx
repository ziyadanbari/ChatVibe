export default function Loading({ className, ...args }) {
  return <span className={`loader ${className}`} {...args}></span>;
}
