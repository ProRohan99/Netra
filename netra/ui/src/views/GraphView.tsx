import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
}

const GraphView = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Resize canvas to parent
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let nodes: any[] = [];
        let links: any[] = [];

        // Fetch Real Graph Data
        fetch('/api/graph')
            .then(res => res.json())
            .then(data => {
                // Map API nodes to canvas coordinates (random init)
                nodes = data.nodes.map((n: any) => ({
                    ...n,
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.2,
                    vy: (Math.random() - 0.5) * 0.2
                }));
                links = data.links;
            })
            .catch(err => console.error("Graph fetch failed:", err));

        // Simulation Loop
        const animate = () => {
            if (!canvas) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#00f3ff';
            ctx.strokeStyle = 'rgba(0, 243, 255, 0.2)';

            // Fallback visualization if no data yet (or empty)
            if (nodes.length === 0) {
                ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
                ctx.font = "20px monospace";
                ctx.fillText("Scanning Knowledge Graph...", canvas.width / 2 - 100, canvas.height / 2);
            }

            nodes.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
                ctx.fillStyle = p.group === 'Domain' ? '#ff00ff' : '#00f3ff'; // Color by type
                ctx.fill();

                // Draw Label
                if (p.label) {
                    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
                    ctx.font = "10px sans-serif";
                    ctx.fillText(p.label, p.x + 5, p.y);
                }
            });

            // Draw Links
            links.forEach(link => {
                // Find source and target nodes
                // (Optimized lookup would use a map, but for < 100 nodes this is fine)
                const s = nodes.find(n => n.id === link.source);
                const t = nodes.find(n => n.id === link.target);

                if (s && t) {
                    ctx.beginPath();
                    ctx.moveTo(s.x, s.y);
                    ctx.lineTo(t.x, t.y);
                    ctx.strokeStyle = 'rgba(100, 100, 255, 0.3)';
                    ctx.stroke();
                }
            });

            requestAnimationFrame(animate);
        };
        animate();
    }, []);

    return (
        <div className="relative h-full w-full bg-cyber-black overflow-hidden rounded-xl border border-cyber-border">
            <div className="absolute top-4 left-4 z-10">
                <h2 className="text-2xl font-display font-bold text-white">Asset Graph <span className="text-radium-500 text-sm">v2.0 Beta</span></h2>
                <p className="text-slate-400 text-sm">Visualizing relationships between domains, IPs, and cloud resources.</p>
            </div>
            <canvas ref={canvasRef} width={800} height={600} className="w-full h-full opacity-60" />
        </div>
    );
};

export default GraphView;
