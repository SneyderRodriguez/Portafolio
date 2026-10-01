document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("nether-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let width, height;
    let particles = [];

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resize);
    resize();

    const ancientRunes = ["ᚠ", "ᚢ", "ᚦ", "ᚨ", "ᚱ", "ᚲ", "ᚷ", "ᚹ", "ᚺ", "ᚾ", "ᛁ", "ᛃ", "ᛈ", "ᛉ", "ᛊ", "ᛏ", "ᛒ", "ᛖ", "ᛗ", "ᛚ", "ᛜ", "ᛟ", "ᛞ"];
    const codeSymbols = ["</>", "{ }", "[ ]", "=>", "();", "&&", "||", "===", "++", "/*"];

    class Particle {
        constructor() {
            this.reset();
            this.y = Math.random() * height; 
        }

        reset() {
            this.x = (Math.random() * width) - (width * 0.2); 
            this.y = height + 50; 
            this.life = 0;
            this.isSymbol = Math.random() < 0.2;

            if (this.isSymbol) {
                this.size = Math.random() * 10 + 12;
                this.speedY = (Math.random() * 0.4 + 0.2) * -1; 
                this.speedX = (Math.random() * 0.3 + 0.1); 
                this.maxLife = Math.random() * 300 + 150; 
                this.isCode = Math.random() < 0.5; 

                if (this.isCode) {
                    this.char = codeSymbols[Math.floor(Math.random() * codeSymbols.length)];
                } else {
                    this.char = ancientRunes[Math.floor(Math.random() * ancientRunes.length)];
                }
            } else {
                this.size = Math.random() * 1.5 + 0.5;
                this.speedY = (Math.random() * 0.8 + 0.3) * -1;
                this.speedX = (Math.random() * 0.6 + 0.2);
                this.maxLife = Math.random() * 150 + 80;
            }
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.life++;

            if (this.life >= this.maxLife || this.y < -50) {
                this.reset();
            }
        }

        draw() {
            let opacity = 1;
            const fadeIn = 20;
            const fadeOut = 20;
            
            if (this.life < fadeIn) {
                opacity = this.life / fadeIn;
            } else if (this.maxLife - this.life < fadeOut) {
                opacity = (this.maxLife - this.life) / fadeOut;
            }

            ctx.globalAlpha = Math.max(0, opacity);

            if (this.isSymbol) {
                ctx.fillStyle = "#D4AF37"; 
                if (this.isCode) {
                    ctx.font = `bold ${this.size * 0.8}px monospace`; 
                } else {
                    ctx.font = `${this.size}px serif`;
                }
                
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.shadowBlur = 10;
                ctx.shadowColor = "rgba(212, 175, 55, 0.5)";
                ctx.fillText(this.char, this.x, this.y);
                ctx.shadowBlur = 0; 
            } else {
                ctx.fillStyle = "#35D6FF"; 
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
    for (let i = 0; i < 70; i++) {
        particles.push(new Particle());
    }
    function animate() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }
    animate();
});