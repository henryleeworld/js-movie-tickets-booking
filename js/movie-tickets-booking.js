const moviesList = [{
        movieName: "灌籃高手",
        price: 280
    },
    {
        movieName: "阿凡達：水之道",
        price: 360
    },
    {
        movieName: "迫降危機",
        price: 340
    },
    {
        movieName: "玩命特攻：武演行動",
        price: 340
    },
];

const selectMovieEl = document.getElementById("select-movie");

const allSeatCont = document.querySelectorAll("#seat-container .seat");

const selectedSeatsHolderEl = document.getElementById("selected-seats-holder");

const moviePriceEl = document.getElementById("movie-price");

const cancelBtn = document.getElementById("cancel-button");

const proceedBtnEl = document.getElementById("proceed-button");

moviesList.forEach((movie) => {
    const optionEl = document.createElement("option");
    optionEl.innerHTML = `${movie.movieName} $${movie.price}`;
    selectMovieEl.appendChild(optionEl);
});

let moviePrice = 280;
let currentMovieName = `灌籃高手`;

selectMovieEl.addEventListener("input", (e) => {
    let movieName = e.target.value.split("");
    let dollarIndex = movieName.indexOf("$");
    let movie = movieName.splice(0, dollarIndex - 1).join("");
    currentMovieName = movie;
    moviePrice = JSON.parse(movieName.splice(2, dollarIndex).join(""));

    updatMovieName(movie, moviePrice);
    updatePrice(moviePrice, takenSeats.length);
});

let initialSeatValue = 0;
allSeatCont.forEach((seat) => {
    const attr = document.createAttribute("data-seatid");
    attr.value = ++initialSeatValue;
    seat.setAttributeNode(attr);
});

const seatContEl = document.querySelectorAll("#seat-container .seat:not(.occupied)");

let takenSeats = [];

seatContEl.forEach((seat) => {
    seat.addEventListener("click", (e) => {
        let isSelected = seat.classList.contains("selected");

        let seatId = JSON.parse(seat.dataset.seatid);

        if (!isSelected) {
            seat.classList.add("selected");
            takenSeats.push(seatId);
            takenSeats = [...new Set(takenSeats)];
        } else if (isSelected) {
            seat.classList.remove("selected");

            takenSeats = takenSeats.filter((seat) => {
                if (seat !== seatId) {
                    return seat;
                }
            });
        }
        updateSeats();
        updatePrice(moviePrice, takenSeats.length);
    });
});

function updateSeats() {
    selectedSeatsHolderEl.innerHTML = ``;

    takenSeats.forEach((seat) => {
        const seatHolder = document.createElement("div");
        seatHolder.classList.add("selected-seat");
        selectedSeatsHolderEl.appendChild(seatHolder);

        seatHolder.innerHTML = seat;
    });

    if (!takenSeats.length) {
        const spanEl = document.createElement("span");
        spanEl.classList.add("no-selected");
        spanEl.innerHTML = `尚未選擇座位`;
        selectedSeatsHolderEl.appendChild(spanEl);
    }

    seatCount();
}

function seatCount() {
    const numberOfSeatEl = document.getElementById("number-of-seat");
    numberOfSeatEl.innerHTML = takenSeats.length;
}

function updatMovieName(movieName, price) {
    const movieNameEl = document.getElementById("movie-name");
    const moviePriceEl = document.getElementById("movie-price");
    movieNameEl.innerHTML = movieName;
    moviePriceEl.innerHTML = `$ ${price}`;
}

function updatePrice(price, seats) {
    const totalPriceEl = document.getElementById("total-price");
    let total = seats * price;
    totalPriceEl.innerHTML = `$ ${total}`;
}

cancelBtn.addEventListener("click", (e) => {
    cancelSeats();
});

function cancelSeats() {
    takenSeats = [];
    seatContEl.forEach((seat) => {
        seat.classList.remove("selected");
    });
    updatePrice(0, 0);
    updateSeats();
}

function successModal(movieNameIn, totalPrice, successTrue) {
    const bodyEl = document.querySelector("body");

    const sectionEl = document.getElementById("section");

    const overlay = document.createElement("div");

    overlay.classList.add("overlay");

    sectionEl.appendChild(overlay);

    const successModal = document.createElement("div");
    successModal.classList.add("success-modal");
    const modalTop = document.createElement("div");
    modalTop.classList.add("modal-top");
    const popImg = document.createElement("img");
    popImg.src = "images/success.png";
    modalTop.appendChild(popImg);

    successModal.appendChild(modalTop);

    const modalCenter = document.createElement("div");
    const modalHeading = document.createElement("h1");
    modalCenter.classList.add("modal-center");
    modalHeading.innerHTML = `預訂成功`;
    modalCenter.appendChild(modalHeading);
    const modalPara = document.createElement("p");
    modalCenter.appendChild(modalPara);
    modalPara.innerHTML = `《${movieNameIn}》電影票預訂成功。`;
    successModal.appendChild(modalCenter);

    const modalBottom = document.createElement("div");
    modalBottom.classList.add("modal-bottom");
    const successBtn = document.createElement("button");

    successBtn.innerHTML = `好的，我知道了！`;
    modalBottom.appendChild(successBtn);
    successModal.appendChild(modalBottom);

    successBtn.addEventListener("click", (e) => {
        removeModal();
    });

    window.addEventListener("click", (e) => {
        if (e.target.classList.contains("overlay")) {
            removeModal();
        }
    });

    function removeModal() {
        overlay.remove();
        successModal.remove();
        bodyEl.classList.remove("modal-active");
        cancelSeats();
    }

    sectionEl.appendChild(successModal);
}

proceedBtnEl.addEventListener("click", (e) => {
    if (takenSeats.length) {
        const bodyEl = document.querySelector("body");
        bodyEl.classList.add("modal-active");
        successModal(currentMovieName, moviePrice * takenSeats.length);
    } else {
        alert("糟糕，尚未選擇座位。");
    }
});