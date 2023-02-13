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
      this.shadowRoot.querySelector(".enterNames").style.display = "block";
    } else {
      this.shadowRoot.querySelector(".game").style.display = "block";
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
    side === "side1" ? this.side1Count++ : this.side2Count++;
    this.render();
  }

  // First to 11
  handleScores() {
    if (this.side1Count < 10 || this.side2Count < 10) {
      if (this.side1Count >= 11) {
        this.init();
        this.side1Games++;
      } else if (this.side2Count >= 11) {
        this.init();
        this.side2Games++;
      }
    }

    // If both have 10 points or more, player has to win with two points clear
    if (this.side1Count >= 10 && this.side2Count >= 10) {
      if (this.side1Count - this.side2Count === 2) {
        this.init();
        this.side1Games++;
      } else if (this.side2Count - this.side1Count === 2) {
        this.init();
        this.side2Games++;
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
      this.shadowRoot.querySelector("#serve1").innerHTML = "Serve";
      this.shadowRoot.querySelector("#serve2").innerHTML = "";
    } else {
      this.shadowRoot.querySelector("#serve2").innerHTML = "Serve";
      this.shadowRoot.querySelector("#serve1").innerHTML = "";
    }
  }

  // Checks who won best out of 5
  handleWin() {
    if (this.side1Games >= 3) {
      alert("Player 1 won!");
      this.reset();
    } else if (this.side2Games >= 3) {
      alert("Player 2 won!");
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
  }
}

// Template
const template = document.createElement("template");

template.innerHTML = `
<div class="enterNames">
    <h1>The table tennis game</h1>
    <p>Enter player names</p>
    <form>
        <input id="player1input" type="text" placeholder="Player 1" value="Player 1"></input>
        <input id="player2input" type="text" placeholder="Player 2" value="Player 2"></input>
        <button id="start">Start game</button>
    </form>
</div>

<div class="game">
    <div class="serve">
        <p id="serve1">Serve</p>
        <p id="serve2"></p>
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
    }

    .serve {
        color: #ffffff;
        display: grid;
        grid-template-columns: 1fr 1fr;
        width: 600px;
    }

    .table {
        width: 600px;
        height: 300px;
        display: grid;
        grid-template-columns: 1fr 1fr;
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
        margin-top: 60px;
        display: grid;
        place-items: center;
    }

    #reset {
        width: 200px;
        height: 50px;
        background-color: #301E67;
        border: none; 
        color: #ffffff;
        border-radius: 10px;
        font-size: 1.5rem;
    }

    #reset:hover {
        cursor: pointer;
    }
</style>
`;

customElements.define("table-tennis", TableTennis);
