// The brand's flower (the shape behind the coming-soon badge).
// The same outline lives in public/shapes/flower.svg for CSS masks.
export const FLOWER_PATH =
  "M378.25,65.94h0s0,0,0,0c64.86-61.55,166.77,12.5,128.28,93.2h0s0,0,0,0c88.65-11.67,127.58,108.14,49,150.81h0s0,0,0,0c78.58,42.67,39.65,162.47-49,150.81h0s0,0,0,0c38.49,80.7-63.42,154.75-128.28,93.2h0s0,0,0,0c-16.3,87.92-142.27,87.92-158.57,0h0s0,0,0,0c-64.86,61.55-166.77-12.5-128.28-93.2h0s0,0,0,0c-88.65,11.67-127.58-108.14-49-150.81h0s0,0,0,0C-36.18,267.28,2.75,147.47,91.4,159.14h0s0,0,0,0C52.91,78.44,154.82,4.39,219.68,65.94h0s0,0,0,0c16.3-87.92,142.27-87.92,158.57,0Z";

export default function Flower({ className, color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 597.93 619.89" aria-hidden="true">
      <path fill={color} d={FLOWER_PATH} />
    </svg>
  );
}
