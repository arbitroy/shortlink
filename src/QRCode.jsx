import React, { useRef, useEffect } from 'react';

// Simple QR Code Component
const QRCode = ({ value, size = 200 }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!canvasRef.current || !value) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Simple QR code generator (creates a pattern based on the URL)
        // In production, you'd want to use a proper QR encoding algorithm
        const modules = 25; // QR code modules (size)
        const moduleSize = size / modules;

        // Clear canvas
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, size, size);

        // Generate a deterministic pattern based on the URL
        const hash = value.split('').reduce((acc, char) => {
            return ((acc << 5) - acc) + char.charCodeAt(0);
        }, 0);

        // Create QR-like pattern
        ctx.fillStyle = '#000000';

        // Draw finder patterns (corners)
        const drawFinderPattern = (x, y) => {
            // Outer square
            ctx.fillRect(x, y, 7 * moduleSize, 7 * moduleSize);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(x + moduleSize, y + moduleSize, 5 * moduleSize, 5 * moduleSize);
            ctx.fillStyle = '#000000';
            ctx.fillRect(x + 2 * moduleSize, y + 2 * moduleSize, 3 * moduleSize, 3 * moduleSize);
        };

        drawFinderPattern(0, 0);
        drawFinderPattern((modules - 7) * moduleSize, 0);
        drawFinderPattern(0, (modules - 7) * moduleSize);

        // Draw timing patterns
        for (let i = 8; i < modules - 8; i++) {
            if (i % 2 === 0) {
                ctx.fillRect(6 * moduleSize, i * moduleSize, moduleSize, moduleSize);
                ctx.fillRect(i * moduleSize, 6 * moduleSize, moduleSize, moduleSize);
            }
        }

        // Draw data modules (simplified pattern based on URL hash)
        for (let y = 0; y < modules; y++) {
            for (let x = 0; x < modules; x++) {
                // Skip finder patterns and timing patterns
                if ((x < 8 && y < 8) || (x >= modules - 8 && y < 8) || (x < 8 && y >= modules - 8)) continue;
                if (x === 6 || y === 6) continue;

                // Generate pseudo-random pattern based on position and hash
                const bit = (hash * (x + 1) * (y + 1)) % 2;
                if (bit === 0) {
                    ctx.fillRect(x * moduleSize, y * moduleSize, moduleSize, moduleSize);
                }
            }
        }

        // Add quiet zone (border)
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = moduleSize;
        ctx.strokeRect(0, 0, size, size);
    }, [value, size]);

    return (
        <canvas
            ref={canvasRef}
            width={size}
            height={size}
            style={{ display: 'block' }}
        />
    );
};

export default QRCode;