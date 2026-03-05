"use client";
import { useEffect, useRef } from "react";

export default function CustomCursor() {
    const dotRef = useRef<HTMLDivElement>(null);
    const outlineRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (window.innerWidth <= 768) return;
        const dot = dotRef.current;
        const outline = outlineRef.current;
        if (!dot || !outline) return;

        let curX = 0, curY = 0, dotX = 0, dotY = 0;

        const onMouseMove = (e: MouseEvent) => {
            curX = e.clientX;
            curY = e.clientY;
            dot.style.left = curX - 4 + "px";
            dot.style.top = curY - 4 + "px";
        };
        document.addEventListener("mousemove", onMouseMove);

        let animId: number;
        function animateOutline() {
            dotX += (curX - dotX) * 0.15;
            dotY += (curY - dotY) * 0.15;
            if (outline) {
                outline.style.left = dotX - 18 + "px";
                outline.style.top = dotY - 18 + "px";
            }
            animId = requestAnimationFrame(animateOutline);
        }
        animateOutline();

        const hoverElements = document.querySelectorAll("a, button, .tilt-card, .skill-tag, .cert-card, .role-card");
        const enterHandler = () => outline?.classList.add("hover");
        const leaveHandler = () => outline?.classList.remove("hover");
        hoverElements.forEach((el) => {
            el.addEventListener("mouseenter", enterHandler);
            el.addEventListener("mouseleave", leaveHandler);
        });

        return () => {
            document.removeEventListener("mousemove", onMouseMove);
            cancelAnimationFrame(animId);
            hoverElements.forEach((el) => {
                el.removeEventListener("mouseenter", enterHandler);
                el.removeEventListener("mouseleave", leaveHandler);
            });
        };
    }, []);

    return (
        <>
            <div className="cursor-dot" ref={dotRef}></div>
            <div className="cursor-outline" ref={outlineRef}></div>
        </>
    );
}
