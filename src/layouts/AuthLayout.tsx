import { Outlet } from "react-router-dom";
import { useConfigStore } from "../store/configStore";
import { useState, useEffect, useRef } from "react";

interface Particle {
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    color: string;
}

const AuthLayout = () => {
    const fondoPorDefecto = "/images/fondo-login-default.jpg";
    const { configuracion } = useConfigStore();
    const [imagenActual, setImagenActual] = useState(fondoPorDefecto);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (configuracion?.fondoLoginUrl && configuracion?.fondoLoginUrl !== imagenActual) {
            setImagenActual(configuracion?.fondoLoginUrl);
        }
    }, [configuracion?.fondoLoginUrl, imagenActual]);

    useEffect(() => {
        if (configuracion?.fondoLoginUrl) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let particles: Particle[] = [];
        const particleCount = window.innerWidth < 768 ? 30 : 80;

        // Inicializar canvas
        function init() {
            if (canvas) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
            createParticles();
            animate();
        }

        // Crear partículas
        function createParticles() {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                if (canvas) {
                    particles.push({
                        x: Math.random() * canvas.width,
                        y: Math.random() * canvas.height,
                        size: Math.random() * 3 + 1,
                        speedX: Math.random() * 1 - 0.5,
                        speedY: Math.random() * 1 - 0.5,
                        color: `rgba(59, 130, 246, ${Math.random() * 0.5 + 0.1})`,
                    });
                }
            }
        }

        // Animar partículas
        function animate() {
            if (canvas && ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                particles.forEach((particle) => {
                    particle.x += particle.speedX;
                    particle.y += particle.speedY;

                    // Rebote
                    if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
                    if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;

                    // Dibujar partícula
                    ctx.fillStyle = particle.color;
                    ctx.beginPath();
                    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                    ctx.fill();

                    // Conexiones
                    drawLines(particle);
                });
            }


            requestAnimationFrame(animate);
        }

        // Dibujar líneas entre partículas cercanas
        function drawLines(particle: Particle) {
            particles.forEach((p) => {
                const distance = Math.sqrt(
                    Math.pow(particle.x - p.x, 2) + Math.pow(particle.y - p.y, 2)
                );

                if (distance < 150 && ctx) {
                    ctx.strokeStyle = `rgba(59, 130, 246, ${1 - distance / 150})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(p.x, p.y);
                    ctx.stroke();
                }
            });
        }

        init();

        // Handler resize
        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            createParticles();
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [configuracion?.fondoLoginUrl]);

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-900">
            {/* Fondo con imagen o partículas */}
            {configuracion?.fondoLoginUrl ? (
                <>
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: `url(${imagenActual})` }}
                    />
                    <div className="absolute inset-0 bg-black/40 z-0" />
                </>
            ) : (
                <>
                    <canvas ref={canvasRef} className="absolute inset-0 z-0" />
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900/70 to-blue-900/30 z-0"></div>
                </>
            )}

            <div className="relative z-10 w-full">
                <Outlet />
            </div>
        </div>
    );
};

export default AuthLayout;
