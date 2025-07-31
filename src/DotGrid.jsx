import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { gsap } from "gsap";
import { InertiaPlugin } from "gsap/InertiaPlugin";

gsap.registerPlugin(InertiaPlugin);

// Throttle helper
const throttle = (func, limit) => {
    let lastCall = 0;
    return function (...args) {
        const now = performance.now();
        if (now - lastCall >= limit) {
            lastCall = now;
            func.apply(this, args);
        }
    };
};

// Hex to RGB converter
function hexToRgb(hex) {
    const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
    if (!m) return { r: 0, g: 0, b: 0 };
    return {
        r: parseInt(m[1], 16),
        g: parseInt(m[2], 16),
        b: parseInt(m[3], 16),
    };
}

// DotGrid Component
const DotGrid = ({
    dotSize = 16,
    gap = 32,
    baseColor = "#5227FF",
    activeColor = "#5227FF",
    proximity = 150,
    speedTrigger = 100,
    shockRadius = 250,
    shockStrength = 5,
    maxSpeed = 5000,
    resistance = 750,
    returnDuration = 1.5,
    className = "",
    style,
}) => {
    const wrapperRef = useRef(null);
    const canvasRef = useRef(null);
    const dotsRef = useRef([]);
    const dimensionsRef = useRef({ width: 0, height: 0, dpr: 1 });
    const pointerRef = useRef({
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        speed: 0,
        lastTime: 0,
        lastX: 0,
        lastY: 0,
    });

    const baseRgb = useMemo(() => hexToRgb(baseColor), [baseColor]);
    const activeRgb = useMemo(() => hexToRgb(activeColor), [activeColor]);

    const circlePath = useMemo(() => {
        if (typeof window === "undefined" || !window.Path2D) return null;

        const p = new window.Path2D();
        p.arc(0, 0, dotSize / 2, 0, Math.PI * 2);
        return p;
    }, [dotSize]);

    const buildGrid = useCallback(() => {
        const wrap = wrapperRef.current;
        const canvas = canvasRef.current;
        if (!wrap || !canvas) return;

        const { width, height } = wrap.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;

        // Store dimensions for coordinate conversion
        dimensionsRef.current = { width, height, dpr };

        // Set canvas dimensions with DPR scaling for crisp rendering
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        const ctx = canvas.getContext("2d");
        if (ctx) {
            // Scale context to match DPR
            ctx.scale(dpr, dpr);
        }

        const cols = Math.floor((width + gap) / (dotSize + gap));
        const rows = Math.floor((height + gap) / (dotSize + gap));
        const cell = dotSize + gap;

        const gridW = cell * cols - gap;
        const gridH = cell * rows - gap;

        const extraX = width - gridW;
        const extraY = height - gridH;

        const startX = extraX / 2 + dotSize / 2;
        const startY = extraY / 2 + dotSize / 2;

        const dots = [];
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const cx = startX + x * cell;
                const cy = startY + y * cell;
                dots.push({ cx, cy, xOffset: 0, yOffset: 0, _inertiaApplied: false });
            }
        }
        dotsRef.current = dots;
    }, [dotSize, gap]);

    useEffect(() => {
        if (!circlePath) return;

        let rafId;
        const proxSq = proximity * proximity;

        const draw = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            // Clear using CSS dimensions (context is already scaled)
            const { width, height } = dimensionsRef.current;
            ctx.clearRect(0, 0, width, height);

            const { x: px, y: py } = pointerRef.current;

            for (const dot of dotsRef.current) {
                const ox = dot.cx + dot.xOffset;
                const oy = dot.cy + dot.yOffset;
                const dx = dot.cx - px;
                const dy = dot.cy - py;
                const dsq = dx * dx + dy * dy;

                let style = baseColor;
                if (dsq <= proxSq) {
                    const dist = Math.sqrt(dsq);
                    const t = 1 - dist / proximity;
                    const r = Math.round(baseRgb.r + (activeRgb.r - baseRgb.r) * t);
                    const g = Math.round(baseRgb.g + (activeRgb.g - baseRgb.g) * t);
                    const b = Math.round(baseRgb.b + (activeRgb.b - baseRgb.b) * t);
                    style = `rgb(${r},${g},${b})`;
                }

                ctx.save();
                ctx.translate(ox, oy);
                ctx.fillStyle = style;
                ctx.fill(circlePath);
                ctx.restore();
            }

            rafId = requestAnimationFrame(draw);
        };

        draw();
        return () => cancelAnimationFrame(rafId);
    }, [proximity, baseColor, activeRgb, baseRgb, circlePath]);

    useEffect(() => {
        buildGrid();
        let ro = null;
        if ("ResizeObserver" in window) {
            ro = new ResizeObserver(() => {
                setTimeout(buildGrid, 10);
            });
            wrapperRef.current && ro.observe(wrapperRef.current);
        } else {
            window.addEventListener("resize", () => {
                setTimeout(buildGrid, 10);
            });
        }
        return () => {
            if (ro) ro.disconnect();
            else window.removeEventListener("resize", buildGrid);
        };
    }, [buildGrid]);

    useEffect(() => {
        const onMove = (e) => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const now = performance.now();
            const pr = pointerRef.current;
            const dt = pr.lastTime ? now - pr.lastTime : 16;
            const dx = e.clientX - pr.lastX;
            const dy = e.clientY - pr.lastY;
            let vx = (dx / dt) * 1000;
            let vy = (dy / dt) * 1000;
            let speed = Math.hypot(vx, vy);
            if (speed > maxSpeed) {
                const scale = maxSpeed / speed;
                vx *= scale;
                vy *= scale;
                speed = maxSpeed;
            }
            pr.lastTime = now;
            pr.lastX = e.clientX;
            pr.lastY = e.clientY;
            pr.vx = vx;
            pr.vy = vy;
            pr.speed = speed;

            // Convert mouse position to CSS coordinates (not canvas coordinates)
            const rect = canvas.getBoundingClientRect();
            pr.x = e.clientX - rect.left;
            pr.y = e.clientY - rect.top;

            for (const dot of dotsRef.current) {
                const dist = Math.hypot(dot.cx - pr.x, dot.cy - pr.y);
                if (speed > speedTrigger && dist < proximity && !dot._inertiaApplied) {
                    dot._inertiaApplied = true;
                    gsap.killTweensOf(dot);

                    // Enhanced push calculations for more dramatic effect
                    const normalizedDist = Math.max(0.1, dist / proximity);
                    const pushMultiplier = (1 / normalizedDist) * 0.5;
                    const velocityMultiplier = Math.min(speed / speedTrigger, 3) * 0.01;

                    const pushX = (dot.cx - pr.x) * pushMultiplier + vx * velocityMultiplier;
                    const pushY = (dot.cy - pr.y) * pushMultiplier + vy * velocityMultiplier;

                    gsap.to(dot, {
                        inertia: {
                            xOffset: pushX,
                            yOffset: pushY,
                            resistance: resistance
                        },
                        onComplete: () => {
                            gsap.to(dot, {
                                xOffset: 0,
                                yOffset: 0,
                                duration: returnDuration,
                                ease: "elastic.out(1,0.75)",
                                onComplete: () => {
                                    dot._inertiaApplied = false;
                                }
                            });
                        },
                    });
                }
            }
        };

        const onClick = (e) => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const rect = canvas.getBoundingClientRect();
            const cx = e.clientX - rect.left;
            const cy = e.clientY - rect.top;

            for (const dot of dotsRef.current) {
                const dist = Math.hypot(dot.cx - cx, dot.cy - cy);
                if (dist < shockRadius && !dot._inertiaApplied) {
                    dot._inertiaApplied = true;
                    gsap.killTweensOf(dot);

                    // Much more dramatic shock wave calculations
                    const normalizedDist = Math.max(0.01, dist / shockRadius);
                    const falloff = Math.max(0, 1 - normalizedDist);

                    // Multi-layered intensity calculation for more dramatic effect
                    const distanceIntensity = Math.pow(falloff, 0.3); // More gradual falloff
                    const proximityBoost = dist < (shockRadius * 0.3) ? 2.5 : 1; // Extra boost for close dots
                    const baseIntensity = shockStrength * distanceIntensity * proximityBoost;

                    // Add some randomness for more organic feel
                    const randomFactor = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
                    const finalIntensity = baseIntensity * randomFactor;

                    // Calculate push direction with some variation
                    const angle = Math.atan2(dot.cy - cy, dot.cx - cx);
                    const pushDistance = finalIntensity * (50 + Math.random() * 30); // 50-80 pixel push

                    const pushX = Math.cos(angle) * pushDistance;
                    const pushY = Math.sin(angle) * pushDistance;

                    gsap.to(dot, {
                        inertia: {
                            xOffset: pushX,
                            yOffset: pushY,
                            resistance: resistance * 0.6 // Much less resistance for more dramatic movement
                        },
                        onComplete: () => {
                            gsap.to(dot, {
                                xOffset: 0,
                                yOffset: 0,
                                duration: returnDuration * 1.2, // Slightly longer return for more satisfying bounce
                                ease: "elastic.out(1,0.6)", // More bouncy return
                                onComplete: () => {
                                    dot._inertiaApplied = false;
                                }
                            });
                        },
                    });
                }
            }
        };

        const throttledMove = throttle(onMove, 16); // Increased responsiveness
        window.addEventListener("mousemove", throttledMove, { passive: true });
        window.addEventListener("click", onClick);

        return () => {
            window.removeEventListener("mousemove", throttledMove);
            window.removeEventListener("click", onClick);
        };
    }, [
        maxSpeed,
        speedTrigger,
        proximity,
        resistance,
        returnDuration,
        shockRadius,
        shockStrength,
    ]);

    return (
        <section className={`dot-grid ${className}`} style={style}>
            <div ref={wrapperRef} className="dot-grid__wrap">
                <canvas ref={canvasRef} className="dot-grid__canvas" />
            </div>
        </section>
    );
};

export default DotGrid;

// CSS Styles
const styles = `
  .dot-grid {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    position: relative;
  }

  .dot-grid__wrap {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .dot-grid__canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
}