// PREMIUM UI LOGIC
// Includes: Lenis Smooth Scroll, Custom Cursor, Magnetic Buttons, 3D Text
// REMOVED: Page Transitions (Wipe Overlay)

document.addEventListener("DOMContentLoaded", () => {

    // --- 1. LENIS SMOOTH SCROLL ---
    // Check if Lenis is loaded
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        // Connect GSAP ScrollTrigger if available
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
            lenis.on('scroll', ScrollTrigger.update);
            gsap.ticker.add((time) => {
                lenis.raf(time * 1000);
            });
            gsap.ticker.lagSmoothing(0);
        }
    }

    // --- 2. ADD NOISE OVERLAY ---
    const noise = document.createElement('div');
    noise.classList.add('noise-overlay');
    document.body.appendChild(noise);

    // --- 3. CUSTOM CURSOR & MAGNETIC EFFECT ---
    // Only on desktop/fine pointers
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {

        // Create Cursor Elements
        const cursorDot = document.createElement("div");
        cursorDot.classList.add("cursor-dot");

        const cursorOutline = document.createElement("div");
        cursorOutline.classList.add("cursor-outline");

        document.body.appendChild(cursorDot);
        document.body.appendChild(cursorOutline);

        // Mouse Movement
        window.addEventListener("mousemove", function (e) {
            const posX = e.clientX;
            const posY = e.clientY;

            // Dot follows instantly
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            // Outline follows with slight delay (handled by CSS transition or simple animation)
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        // Hover Effect
        const hoverTargets = document.querySelectorAll("a, button, .dist-card, input, select, textarea, .magnetic");

        hoverTargets.forEach(el => {
            el.addEventListener("mouseenter", () => {
                document.body.classList.add("hovering");
                // Optional: Scale cursor up
            });
            el.addEventListener("mouseleave", () => {
                document.body.classList.remove("hovering");
            });
        });

        // --- 4. MAGNETIC BUTTONS (Greensock) ---
        if (typeof gsap !== 'undefined') {
            const magnets = document.querySelectorAll(".magnetic, button, .to-up");

            magnets.forEach((magnet) => {
                magnet.addEventListener("mousemove", (e) => {
                    const bounding = magnet.getBoundingClientRect();
                    const magnetsStrength = 40; // Strength of pull

                    const newX = ((e.clientX - bounding.left) / magnet.offsetWidth) - 0.5;
                    const newY = ((e.clientY - bounding.top) / magnet.offsetHeight) - 0.5;

                    gsap.to(magnet, {
                        duration: 1,
                        x: newX * magnetsStrength,
                        y: newY * magnetsStrength,
                        ease: "power4.out"
                    });
                });

                magnet.addEventListener("mouseleave", () => {
                    gsap.to(magnet, {
                        duration: 1,
                        x: 0,
                        y: 0,
                        ease: "elastic.out(1, 0.3)"
                    });
                });
            });
        }
    }

    // --- 5. PAGE TRANSITIONS REMOVED ---

    // --- 6. TEXT REVEALS (SplitType 3D ROLLING) ---
    if (typeof SplitType !== 'undefined' && typeof gsap !== 'undefined') {
        const revealText = document.querySelectorAll("h1, h2, .hero-title, .reveal-text");

        revealText.forEach(text => {
            // Split text into lines
            const split = new SplitType(text, { types: 'lines' });

            // Wrap lines in a container for overflow hidden + perspective
            split.lines.forEach(line => {
                const wrapper = document.createElement('div');
                wrapper.classList.add('split-line');
                line.parentNode.insertBefore(wrapper, line);
                wrapper.appendChild(line);
            });

            // Animate lines: 3D Roll Up
            gsap.fromTo(split.lines,
                { y: 100, opacity: 0, rotationX: -80, transformOrigin: "bottom" },
                {
                    y: 0,
                    opacity: 1,
                    rotationX: 0,
                    duration: 1.4,
                    stagger: 0.1,
                    ease: "power4.out",
                    scrollTrigger: {
                        trigger: text,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });
    }
});
