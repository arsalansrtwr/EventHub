import React, { useMemo } from 'react';

interface QRCodeViewProps {
  value: string;
  size?: number;
  className?: string;
}

// Generate a deterministic 21x21 QR Code matrix with standard finder patterns
export const QRCodeView: React.FC<QRCodeViewProps> = ({ value, size = 160, className = '' }) => {
  const matrix = useMemo(() => {
    const n = 21; // standard version 1 QR size
    const grid: boolean[][] = Array.from({ length: n }, () => Array(n).fill(false));

    // Finder patterns in top-left, top-right, bottom-left
    const addFinder = (rStart: number, cStart: number) => {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          if (
            r === 0 || r === 6 || c === 0 || c === 6 || // outer square
            (r >= 2 && r <= 4 && c >= 2 && c <= 4)      // inner solid 3x3
          ) {
            grid[rStart + r][cStart + c] = true;
          }
        }
      }
    };

    addFinder(0, 0);
    addFinder(0, 14);
    addFinder(14, 0);

    // Timing patterns
    for (let i = 8; i < 13; i++) {
      grid[6][i] = i % 2 === 0;
      grid[i][6] = i % 2 === 0;
    }

    // Deterministic pseudo-random payload pattern based on string hash
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
      hash = (hash << 5) - hash + value.charCodeAt(i);
      hash |= 0;
    }

    // Fill data area avoiding finder patterns
    let bitIndex = 0;
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        const inTL = r < 9 && c < 9;
        const inTR = r < 9 && c >= 13;
        const inBL = r >= 13 && c < 9;
        const isTiming = r === 6 || c === 6;

        if (!inTL && !inTR && !inBL && !isTiming) {
          const pseudoBit = ((hash ^ (r * 31 + c * 17 + bitIndex)) & 1) === 1;
          grid[r][c] = pseudoBit;
          bitIndex++;
        }
      }
    }

    return grid;
  }, [value]);

  const n = matrix.length;
  const cellSize = size / (n + 2); // 1-cell quiet zone

  return (
    <div
      className={`inline-flex items-center justify-center bg-white p-2 border border-slate-200 rounded-lg shadow-xs ${className}`}
      style={{ width: size + 16, height: size + 16 }}
      title={`EventHub Digital QR Pass: ${value}`}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="block"
        role="img"
        aria-label={`QR Code for ${value}`}
      >
        <rect width={size} height={size} fill="#ffffff" />
        {matrix.map((row, r) =>
          row.map((cell, c) => {
            if (!cell) return null;
            return (
              <rect
                key={`${r}-${c}`}
                x={(c + 1) * cellSize}
                y={(r + 1) * cellSize}
                width={cellSize + 0.2}
                height={cellSize + 0.2}
                fill="#0f172a"
              />
            );
          })
        )}
      </svg>
    </div>
  );
};
