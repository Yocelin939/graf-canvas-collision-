const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

document.body.style.backgroundColor = "#000000"; // Fondo beige

class Circle {
    constructor(x, y, radius, color, speedX, speedY) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.originalColor = color;
        this.color = color;
        this.speedX = speedX;
        this.speedY = speedY;
        this.enColision = false;
        this.tiempoColision = 0;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    move() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.speedX = -this.speedX;
        }
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.speedY = -this.speedY;
        }
    }

    detectCollision(other) {
        let dx = other.x - this.x;
        let dy = other.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.radius + other.radius) {
            this.enColision = true;
            other.enColision = true;
            this.tiempoColision = 10;
            other.tiempoColision = 10;

            this.color = "#ADD8E6"; // Azul pastel
            other.color = "#ADD8E6";

            let angle = Math.atan2(dy, dx);
            let speed1 = Math.sqrt(this.speedX ** 2 + this.speedY ** 2);
            let speed2 = Math.sqrt(other.speedX ** 2 + other.speedY ** 2);

            this.speedX = -Math.cos(angle) * speed1;
            this.speedY = -Math.sin(angle) * speed1;
            other.speedX = Math.cos(angle) * speed2;
            other.speedY = Math.sin(angle) * speed2;
        }
    }

    update(circles) {
        this.enColision = false;

        this.move();
        circles.forEach(other => {
            if (this !== other) {
                this.detectCollision(other);
            }
        });

        if (!this.enColision && this.tiempoColision > 0) {
            this.tiempoColision--;
            if (this.tiempoColision === 0) {
                this.color = this.originalColor;
            }
        }

        this.draw();
    }
}

// Función para generar colores pastel
function pastelColor() {
    let hue = Math.random() * 360;
    return `hsl(${hue}, 70%, 80%)`;
}

// Crear círculos con colores pastel
let circles = [];
for (let i = 0; i < 10; i++) {
    let radius = Math.random() * 20 + 20;
    let x = Math.random() * (canvas.width - radius * 2) + radius;
    let y = Math.random() * (canvas.height - radius * 2) + radius;
    let speedX = (Math.random() * 1.2 + 0.3) * (Math.random() < 0.5 ? 1 : -1);
    let speedY = (Math.random() * 1.2 + 0.3) * (Math.random() < 0.5 ? 1 : -1);
    let color = pastelColor();

    circles.push(new Circle(x, y, radius, color, speedX, speedY));
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    circles.forEach(circle => circle.update(circles));
    requestAnimationFrame(animate);
}

animate();