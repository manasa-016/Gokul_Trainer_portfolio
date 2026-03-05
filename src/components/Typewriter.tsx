"use client";
import { useEffect, useState } from "react";

const roles = [
    "AI/ML Expert & Trainer",
    "Data Science Professional",
    "Generative AI Specialist",
    "Full-Stack Python Developer",
    "Founder — Magizh Technologies",
    "IIT Madras Academic Mentor",
    "Guest Professor at VIT",
];

export default function Typewriter() {
    const [text, setText] = useState("");

    useEffect(() => {
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let timeout: NodeJS.Timeout;

        function typeEffect() {
            const currentRole = roles[roleIndex];
            let speed: number;

            if (isDeleting) {
                charIndex--;
                setText(currentRole.substring(0, charIndex));
                speed = 40;
            } else {
                charIndex++;
                setText(currentRole.substring(0, charIndex));
                speed = 80;
            }

            if (!isDeleting && charIndex === currentRole.length) {
                isDeleting = true;
                speed = 2000;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                speed = 500;
            }

            timeout = setTimeout(typeEffect, speed);
        }

        timeout = setTimeout(typeEffect, 2000);
        return () => clearTimeout(timeout);
    }, []);

    return (
        <div className="hero-roles animate-in">
            <span className="role-text">{text}</span>
            <span className="cursor-blink">|</span>
        </div>
    );
}
