"use client";
import { useEffect, useState } from "react";

export default function Loader() {
    const [hidden, setHidden] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setHidden(true), 1500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`loader ${hidden ? "hidden" : ""}`} id="loader">
            <div className="loader-content" style={{ textAlign: "center" }}>
                <div className="loader-ring"></div>
                <div className="loader-text">
                    <span>G</span><span>O</span><span>K</span><span>U</span><span>L</span>
                </div>
            </div>
        </div>
    );
}
