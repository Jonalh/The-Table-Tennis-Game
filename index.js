class TableTennis extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // Enter player names
    this.loadingNames = true;
    this.player1 = "Player 1";
    this.player2 = "Player 2";

    // Count
    this.side1Count = 0;
    this.side2Count = 0;

    // Games
    this.side1Games = 0;
    this.side2Games = 0;

    // Serve
    this.serve = true;
    this.serveCount = 0;

    this.song = new Audio("./assets/song.mp3");

    this.render();
  }

  // Add event listeners
  connectedCallback() {
    const side1 = this.shadowRoot.querySelector("#side1");
    const side2 = this.shadowRoot.querySelector("#side2");
    const resetButton = this.shadowRoot.querySelector("#reset");
    const startButton = this.shadowRoot.querySelector("#start");

    side1.addEventListener("click", () => this.incrementSide("side1"));
    side2.addEventListener("click", () => this.incrementSide("side2"));
    resetButton.addEventListener("click", () => this.reset());
    startButton.addEventListener("click", (e) => {
      // Assign player names based on field input
      e.preventDefault();

      this.song.play();

      const startSound = new Audio("./assets/start.mp3");
      startSound.play();

      this.player1 = this.shadowRoot.querySelector("#player1input").value;
      this.player2 = this.shadowRoot.querySelector("#player2input").value;
      this.loadingNames = false;
      this.init();
      this.render();
    });
  }

  // Remove event listeners
  disconnectedCallback() {
    const side1 = this.shadowRoot.querySelector("#side1");
    const side2 = this.shadowRoot.querySelector("#side2");
    const resetButton = this.shadowRoot.querySelector("#reset");

    side1.removeEventListener();
    side2.removeEventListener();
    resetButton.removeEventListener();
  }

  render() {
    if (this.loadingNames) {
      this.shadowRoot.querySelector(".game").style.display = "none";
      this.shadowRoot.querySelector("#logo").style.display = "block";
      this.shadowRoot.querySelector(".enterNames").style.display = "block";

      const initSound = new Audio("./assets/init.mp3");
      initSound.play();
    } else {
      this.shadowRoot.querySelector(".game").style.display = "block";
      this.shadowRoot.querySelector("#logo").style.display = "none";
      this.shadowRoot.querySelector(".enterNames").style.display = "none";
    }

    this.shadowRoot.querySelector("#player1").innerHTML = this.player1;
    this.shadowRoot.querySelector("#player2").innerHTML = this.player2;

    this.shadowRoot.querySelector("#player1input").value = "Player 1";
    this.shadowRoot.querySelector("#player2input").value = "Player 2";

    this.handleScores();
    this.handleServe();
    this.handleWin();

    // Change innerHTML of count
    this.shadowRoot.querySelector(
      "#side1 #count"
    ).innerHTML = `Points: ${this.side1Count}`;
    this.shadowRoot.querySelector(
      "#side2 #count"
    ).innerHTML = `Points: ${this.side2Count}`;

    // Change innerHTML of games
    this.shadowRoot.querySelector(
      "#side1 #games"
    ).innerHTML = `Games: ${this.side1Games}`;
    this.shadowRoot.querySelector(
      "#side2 #games"
    ).innerHTML = `Games: ${this.side2Games}`;
  }

  // Methods
  //
  // Increments point every time side is clicked
  incrementSide(side) {
    const hitSound = new Audio("./assets/Recording.m4a");
    hitSound.play();
    side === "side1" ? this.side1Count++ : this.side2Count++;
    this.render();
  }

  // First to 11
  handleScores() {
    const gameSound = new Audio("./assets/game.mp3");

    if (this.side1Count < 10 || this.side2Count < 10) {
      if (this.side1Count >= 11) {
        this.init();
        this.side1Games++;
        gameSound.play();
      } else if (this.side2Count >= 11) {
        this.init();
        this.side2Games++;
        gameSound.play();
      }
    }

    // If both have 10 points or more, player has to win with two points clear
    if (this.side1Count >= 10 && this.side2Count >= 10) {
      if (this.side1Count - this.side2Count === 2) {
        this.init();
        this.side1Games++;
        gameSound.play();
      } else if (this.side2Count - this.side1Count === 2) {
        this.init();
        this.side2Games++;
        gameSound.play();
      }
    }
  }

  // Serve changes every two points
  handleServe() {
    if (this.serveCount < 1) {
      this.serveCount++;
    } else {
      this.serveCount = 0;
      this.serve = !this.serve;
    }

    if (this.serve) {
      this.shadowRoot.querySelector("#racket1").style.opacity = 1;
      this.shadowRoot.querySelector("#racket2").style.opacity = 0;
    } else {
      this.shadowRoot.querySelector("#racket1").style.opacity = 0;
      this.shadowRoot.querySelector("#racket2").style.opacity = 1;
    }
  }

  // Checks who won best out of 5
  handleWin() {
    if (this.side1Games >= 3) {
      alert(`${this.player1} won!`);
      this.reset();
    } else if (this.side2Games >= 3) {
      alert(`${this.player2} won!`);
      this.reset();
    }
  }

  // Init score
  init() {
    this.side1Count = 0;
    this.side2Count = 0;
    this.serve = true;
    this.serveCount = -1;
  }

  // Reset whole game
  reset() {
    this.init();
    this.side1Games = 0;
    this.side2Games = 0;
    this.loadingNames = true;
    this.render();
    this.song.pause();
    this.song.currentTime = 0;
  }
}

// Template
const template = document.createElement("template");

template.innerHTML = `
<img id="logo" src="./assets/logo.png"></img>
<div class="enterNames">
    <div class="container">
    <form>
        <div class="inputDiv">
          <input id="player1input" type="text" value="Player 1"></input>
          <input id="player2input" type="text" value="Player 2"></input>
        </div>
        <button id="start">Start game</button>
    </form>
    </div>
</div>

<div class="game">
    <div class="serve">
        <img id="racket1" src="./assets/racket.svg"></img>
        <img id="racket2" src="./assets/racket.svg"></img>
        <p id="player1"></p>
        <p id="player2"></p>
    </div>
    <div class="table">
    <div class="side" id="side1">
        <p id="count">Points: 0</p>
        <p id="games">Games: 0</p>
    </div>
    <div class="side" id="side2">
        <p id="count">Points: 0</p>
        <p id="games">Games: 0</p>
    </div>
    </div>
    <div class="resetDiv">
        <button id="reset">Reset</button>
    </div>
</div>

<style>

    @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

    * {
        font-family: 'Poppins', sans-serif;
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    input:focus{
      outline: none;
    }

    #logo {
      max-width: 100%;
      pointer-events: none;
      -webkit-user-select: none; /* Safari */
      -ms-user-select: none; /* IE 10 and IE 11 */
      user-select: none; /* Standard syntax */
    }

    .enterNames h1, p {
      margin-bottom: 32px;
    }

    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .inputDiv {
      display: flex;
      gap: 32px;
      width: 400px;
      justify-content: space-between;
    }

    #start {
      width: 400px;
      height: 50px;
      background-color: #B6EADA;
      border: none; 
      color: #03001C;
      border-radius: 10px;
      font-size: 1.5rem;
      padding: 0 20px;
      cursor: pointer;
      font-weight: 600;
    }

    form input { 
      width: 100%;
      height: 50px;
      background-color: #ffffff;
      border: none; 
      color: #301E67;
      border-radius: 10px;
      font-size: 1.5rem;
      padding: 0 20px;
      margin-bottom: 32px;
    }

    .serve {
        color: #ffffff;
        display: grid;
        place-items: center;
        grid-template-columns: 1fr 1fr;
        width: 600px;
    }

    .serve p {
      font-size: 1.5rem;
    }

    .serve img {
      width: 64px;
      margin-bottom: 32px;
    }

    .table {
        width: 600px;
        height: 300px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        margin-bottom: 32px;
    }

    .side {
        font-size: 3rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        -webkit-user-select: none; /* Safari */
        -ms-user-select: none; /* IE 10 and IE 11 */
        user-select: none; /* Standard syntax */
        cursor: pointer;
    }

    #side1 {
        background-color: #5B8FB9;
        border-radius: 20px 0 0 20px;
    }

    #side2 {
        background-color: #B6EADA;
        border-radius: 0 20px 20px 0;
    }

    #side1 p {
        color: #B6EADA;
    }

    #side2 p {
        color: #5B8FB9;
    }

    .enterNames h1, p {
        color: #ffffff;
        text-align: center;
    }

    .resetDiv {
        display: grid;
        place-items: center;
    }

    #reset {
      width: 400px;
      height: 50px;
      background-color: #B6EADA;
      border: none; 
      color: #03001C;
      border-radius: 10px;
      font-size: 1.5rem;
      padding: 0 20px;
      cursor: pointer;
      font-weight: 600;
    }

    #reset:hover {
        cursor: pointer;
    }
</style>
`;

customElements.define("table-tennis", TableTennis);
