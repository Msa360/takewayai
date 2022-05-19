const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width/2, carCanvas.width*0.9);

let M = 0.1; // mutation rate
let N = 100; // number of cars

// assign N and M or if not store N and M 
if (sessionStorage.getItem("varM") && sessionStorage.getItem("varN")) {
    M = sessionStorage.getItem("varM");
    N = sessionStorage.getItem("varN");
} else {
    sessionStorage.setItem("varM", M);
    sessionStorage.setItem("varN", N)
}

// changing mutation rate and number of cars
function changeParams() {
    if (document.getElementById("varM").value != "" && !isNaN(document.getElementById("varM").value) && document.getElementById("varM").value != 0) {
        sessionStorage.setItem("varM", document.getElementById("varM").value);
    }
    if (document.getElementById("varN").value != "" && !isNaN(document.getElementById("varN").value)) {
        sessionStorage.setItem("varN", document.getElementById("varN").value);
    }
}

// display update N and M on the html form
document.getElementById("varN").value = N;
document.getElementById("varM").value = M;

const cars = generateCars(N);
let bestCar = cars[0];
if (localStorage.getItem("bestBrain")) {
    for (let i = 0; i < cars.length; i++) {
        cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
        if (i != 0) {
            NeuralNetwork.mutate(cars[i].brain, M);
        }
    }
}

const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(2), -370, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(1), -450, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(1), -520, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(0), -630, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(1), -670, 30, 50, "DUMMY", 2)
];


animate();


function save() {
    localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

function discard() {
    localStorage.removeItem("bestBrain");
}

function generateCars(N) {
    const cars = [];
    for (let i = 1; i <= N; i++) {
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
    }
    return cars;
}

function animate(time) {
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders, []);
        
    }
    for (let i = 0; i < cars.length; i++) {
        cars[i].update(road.borders, traffic);
    }

    bestCar = cars.find(c => c.y == Math.min(...cars.map(c => c.y)));

    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    carCtx.save();
    carCtx.translate(0, -bestCar.y + carCanvas.height*0.7);
    road.draw(carCtx);
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].draw(carCtx, "red");
    }

    carCtx.globalAlpha = 0.2;
    for (let i = 0; i < cars.length; i++) {
        cars[i].draw(carCtx, "blue");
    }
    carCtx.globalAlpha = 1;
    bestCar.draw(carCtx, "blue", true);

    carCtx.restore();

    networkCtx.lineDashOffset = (-time/50)*(Math.abs(bestCar.speed) != 0 ? 1 : 0);

    Visualizer.drawNetwork(networkCtx, bestCar.brain);

    requestAnimationFrame(animate);
}