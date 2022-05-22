
let M = 0.1; // mutation rate
let N = 100; // number of cars

// assign N and M or if not store N and M 
if (sessionStorage.getItem("varM") && sessionStorage.getItem("varN")) {
    M = sessionStorage.getItem("varM");
    N = sessionStorage.getItem("varN");
} else {
    sessionStorage.setItem("varM", M);
    sessionStorage.setItem("varN", N);
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

