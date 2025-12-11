"use client";

export const clamp = (value: number, min = 0, max = 1) => Math.min(Math.max(value, min), max);

export const easeInOutQuad = (t: number) => {
  const x = clamp(t);
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
};

export const easeOutCubic = (t: number) => {
  const x = clamp(t);
  return 1 - Math.pow(1 - x, 3);
};

export const easeInCubic = (t: number) => {
  const x = clamp(t);
  return x * x * x;
};

export const expoEase = (t: number) => {
  const x = clamp(t);
  return x === 0 ? 0 : Math.pow(2, 10 * (x - 1));
};



