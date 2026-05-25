"use client";

import { useRef, useEffect } from "react";

const LetterGlitch = ({
  glitchColors = ["#2b4539", "#61dca3", "#61b3dc"],
  className = "",
  glitchSpeed = 50,
  centerVignette = false,
  outerVignette = true,
  smooth = true,
  characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-_+=/[]{};:<>.,0123456789",
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const letters = useRef([]);
  const grid = useRef({ columns: 0, rows: 0 });
  const context = useRef(null);
  const lastGlitchTime = useRef(Date.now());

  const lettersAndSymbols = Array.from(characters);

  const fontSize = 16;
  const charWidth = 10;
  const charHeight = 20;

  const getRandomChar = () => {
    return lettersAndSymbols[
      Math.floor(Math.random() * lettersAndSymbols.length)
    ];
  };

  const getRandomColor = () => {
    return glitchColors[
      Math.floor(Math.random() * glitchColors.length)
    ];
  };

  const calculateGrid = (width, height) => {
    const columns = Math.ceil(width / charWidth);
    const rows = Math.ceil(height / charHeight);

    return { columns, rows };
  };

  const initializeLetters = (columns, rows) => {
    grid.current = { columns, rows };

    const totalLetters = columns * rows;

    letters.current = Array.from(
      { length: totalLetters },
      () => ({
        char: getRandomChar(),
        color: getRandomColor(),
      })
    );
  };

  const resizeCanvas = () => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const parent = canvas.parentElement;

    if (!parent) return;

    const rect = parent.getBoundingClientRect();

    canvas.width = rect.width;
    canvas.height = rect.height;

    const { columns, rows } = calculateGrid(
      rect.width,
      rect.height
    );

    initializeLetters(columns, rows);

    drawLetters();
  };

  const drawLetters = () => {
    const canvas = canvasRef.current;

    if (!canvas || !context.current) return;

    const ctx = context.current;

    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    ctx.font = `${fontSize}px monospace`;
    ctx.textBaseline = "top";

    letters.current.forEach((letter, index) => {
      const x =
        (index % grid.current.columns) * charWidth;

      const y =
        Math.floor(index / grid.current.columns) *
        charHeight;

      ctx.fillStyle = letter.color;

      ctx.fillText(letter.char, x, y);
    });
  };

  const updateLetters = () => {
    const updateCount = Math.max(
      1,
      Math.floor(letters.current.length * 0.05)
    );

    for (let i = 0; i < updateCount; i++) {
      const index = Math.floor(
        Math.random() * letters.current.length
      );

      letters.current[index].char =
        getRandomChar();

      letters.current[index].color =
        getRandomColor();
    }
  };

  const animate = () => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const now = Date.now();

    if (now - lastGlitchTime.current >= glitchSpeed) {
      updateLetters();
      drawLetters();

      lastGlitchTime.current = now;
    }

    animationRef.current =
      requestAnimationFrame(animate);
  };

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    context.current = canvas.getContext("2d");

    resizeCanvas();

    animate();

    window.addEventListener(
      "resize",
      resizeCanvas
    );

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(
          animationRef.current
        );
      }

      window.removeEventListener(
        "resize",
        resizeCanvas
      );
    };
  }, []);

  return (
    <div
      className={`relative w-full h-full overflow-hidden bg-black ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />

      {outerVignette && (
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle,rgba(0,0,0,0)_60%,rgba(0,0,0,1)_100%)]" />
      )}

      {centerVignette && (
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle,rgba(0,0,0,0.8)_0%,rgba(0,0,0,0)_60%)]" />
      )}
    </div>
  );
};

export default LetterGlitch;