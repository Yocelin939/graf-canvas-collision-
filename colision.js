const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

document.body.style.backgroundColor = "#000000"; // Fondo negro

// Crear el contador en la parte superior derecha
document.body.insertAdjacentHTML("beforeend", '<div id="contador" style="position: absolute; top: 10px; right: 20px; color: white; font-size: 20px;">Círculos eliminados: <span id="contadorValor">0</span></div>');

class Circle {
    constructor(x, radius, color, speedY) {
        this.x = x;
        this.y = -radius;
        this.radius = radius;
        this.color = color;
        this.speedY = speedY;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    move() {
        this.y += this.speedY;
        if (this.y - this.radius > canvas.height) {
            this.y = -this.radius;
            this.x = Math.random() * canvas.width;
            this.speedY = Math.random() * 3 + 1;
            this.color = pastelColor();
        }
    }

    isClicked(mouseX, mouseY) {
        let dx = mouseX - this.x;
        let dy = mouseY - this.y;
        return Math.sqrt(dx * dx + dy * dy) < this.radius;
    }
}

function pastelColor() {
    let hue = Math.random() * 360;
    return `hsl(${hue}, 70%, 80%)`;
}

let circles = [];
for (let i = 0; i < 10; i++) {
    let radius = Math.random() * 20 + 20;
    let x = Math.random() * canvas.width;
    let speedY = Math.random() * 3 + 1;
    let color = pastelColor();
    circles.push(new Circle(x, radius, color, speedY));
}

let contador = 0;
const contadorValor = document.getElementById("contadorValor");

canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    for (let i = 0; i < circles.length; i++) {
        if (circles[i].isClicked(mouseX, mouseY)) {
            circles.splice(i, 1);
            contador++;
            contadorValor.textContent = contador;
            break;
        }
    }
});

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    circles.forEach(circle => {
        circle.move();
        circle.draw();
    });
    requestAnimationFrame(animate);
}

animate();
