import { useEffect, useRef } from "react";

export default function Header({left, got, total}){
    const canvasRef= useRef(null);


useEffect(() => {
    const canvas = canvasRef.current;
    const ctx =canvas.getContext("2d");
    const reduce =window.matchMedia("(prefers-reduced-motion:reduce)").matches;
    let stars=[];
    let frame;

    function resize(){
        const box= canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        canvas.width= box.width * dpr;
        canvas.height=box.height *dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        stars= Array.from({length:Math.round(box.width/7)}, () => ({
            x:Math.random() * box.width,
            y:Math.random() * box.height,
            r:Math.random() * 1.3 + 0.3,
            phase:Math.random() * Math.PI * 2,
            speed: Math.random() * 0.02 + 0.006,
        }));
    }

    function draw(){
        const box= canvas.getBoundingClientRect();
        ctx.clearRect(0, 0, box.width, box.height);
        for (const star of stars){
            star.phase +=star.speed;
            ctx.globalAlpha = 0.35+ 0.65 * Math.abs(Math.sin(star.phase));
            ctx.fillStyle = "#f7e3al";
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
            ctx.fill();
        }
        if (!reduce) frame = requestAnimationFrame(draw);
    }

    function onResize(){
        resize();
        if (reduce) draw ();
    }

        resize();
        draw();
        window.addEventListener("resize", onResize);
        return () =>{
            cancelAnimationFrame(frame);
            window.removeEventListener("resize", onResize);
        };
    }, []);

    return (
        <header className="header">
            <canvas ref={canvasRef} className="sky" aria-hidden="true"/>
            <div className="header-inner">
                <svg className="bow" viewBox="0 0 46 26" aria-hidden="true">
                    <path fill="#f6b8c9"
                        d="M23 13C15  2 3 1 3  9s9 10 20 4c11 6 20 4 20-4S31 2 23 13z"/>
                    <circle cx="23" cy="13" r="3.4" fill="#d9718f"/>    
                </svg>
                <h1>Starlit Wishes</h1>
                <p className="tally">
                    {left} wishing&middot; {got} granted&middot; {total} to go
                </p>
            </div> 
        </header>
    );
}

