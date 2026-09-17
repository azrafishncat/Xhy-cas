(() => {
  const pages = document.querySelectorAll(".page");
  const nav = document.querySelectorAll(".nav button");
  const show = id => {
    pages.forEach(p => p.classList.toggle("hidden", p.id !== id));
    nav.forEach(b => b.classList.toggle("active", b.dataset.page === id));
    window.scrollTo({top: 0, behavior: "smooth"});
  };
  nav.forEach(b => b.addEventListener("click", () => show(b.dataset.page)));
  document.querySelectorAll("[data-jump]").forEach(b => b.addEventListener("click", () => show(b.dataset.jump)));

  document.getElementById("unlock").addEventListener("click", () => {
    const value = document.getElementById("password").value.trim();
    document.getElementById("unlock-message").textContent =
      (value === "25.03.2026" || value === "25032026")
      ? "access granted ♡ welcome in."
      : "hmm... that's not it. try again, love.";
  });

  const letters = {
    miss: "If you miss me, remember that distance is only the space between two people who still choose each other. I'm still here. ♡",
    bad: "You don't have to make every day a good one. Be gentle with yourself today. Eat something, breathe, rest, and remember that you are loved.",
    love: "In case you ever need reminding: I love you. Not only on the exciting days, but in all the ordinary little ones too.",
    random: "There isn't a special occasion. I just wanted an excuse to put this here: I'm really happy you're my person."
  };
  const letterBox = document.getElementById("letter");
  document.querySelectorAll("[data-letter]").forEach(b => b.addEventListener("click", () => {
    letterBox.textContent = letters[b.dataset.letter];
    letterBox.classList.remove("hidden");
  }));

  const questions = [
    "What's a tiny thing about us that you never want to forget?",
    "What was the first thing you noticed about me?",
    "What's one thing you want us to do together someday?",
    "What song makes you think of me?",
    "What's your favorite memory of us so far?",
    "If we could spend one completely ordinary day together, what would we do?"
  ];
  let qi = 0;
  document.getElementById("next-question").addEventListener("click", () => {
    qi = (qi + 1) % questions.length;
    document.getElementById("question").textContent = questions[qi];
    document.getElementById("question-number").textContent = "q" + String(qi + 1).padStart(2, "0");
    document.querySelector("#questions textarea").value = "";
  });

  document.querySelectorAll(".game-tabs button").forEach(b => b.addEventListener("click", () => {
    document.querySelectorAll(".game-tabs button").forEach(x => x.classList.remove("active"));
    b.classList.add("active");
    document.querySelectorAll(".game").forEach(g => g.classList.add("hidden"));
    document.getElementById(b.dataset.game).classList.remove("hidden");
  }));

  // Wordle
  const answer = "HEART";
  let guess = "", row = 0;
  const board = document.getElementById("board");
  for (let r = 0; r < 6; r++) {
    const line = document.createElement("div");
    line.className = "row";
    for (let c = 0; c < 5; c++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.id = `cell-${r}-${c}`;
      line.appendChild(cell);
    }
    board.appendChild(line);
  }

  const keyboard = document.getElementById("keyboard");
  [..."QWERTYUIOPASDFGHJKLZXCVBNM"].forEach(ch => {
    const b = document.createElement("button");
    b.className = "key"; b.type = "button"; b.textContent = ch;
    b.addEventListener("click", () => typeKey(ch));
    keyboard.appendChild(b);
  });
  ["⌫","ENTER"].forEach(ch => {
    const b = document.createElement("button");
    b.className = "key wide"; b.type = "button"; b.textContent = ch;
    b.addEventListener("click", () => ch === "⌫" ? typeKey("BACK") : submitGuess());
    keyboard.appendChild(b);
  });

  function renderGuess() {
    for (let c = 0; c < 5; c++)
      document.getElementById(`cell-${row}-${c}`).textContent = guess[c] || "";
  }
  function typeKey(ch) {
    if (row >= 6) return;
    if (ch === "BACK") guess = guess.slice(0, -1);
    else if (guess.length < 5) guess += ch;
    renderGuess();
  }
  function submitGuess() {
    const msg = document.getElementById("wordle-message");
    if (guess.length !== 5) { msg.textContent = "five letters, silly ♡"; return; }
    for (let c = 0; c < 5; c++) {
      const cell = document.getElementById(`cell-${row}-${c}`);
      if (guess[c] === answer[c]) cell.classList.add("good");
      else if (answer.includes(guess[c])) cell.classList.add("mid");
      else cell.classList.add("no");
    }
    if (guess === answer) { msg.textContent = "you got it ♡"; row = 6; return; }
    row++;
    guess = "";
    msg.textContent = row < 6 ? "not quite. try again ♡" : "the word was HEART.";
  }
  document.addEventListener("keydown", e => {
    if (!document.getElementById("games").classList.contains("hidden") && !["INPUT","TEXTAREA"].includes(e.target.tagName)) {
      if (/^[a-zA-Z]$/.test(e.key)) typeKey(e.key.toUpperCase());
      else if (e.key === "Backspace") typeKey("BACK");
      else if (e.key === "Enter") submitGuess();
    }
  });

  // Tiny quiz — placeholders intentionally easy to replace.
  const quizData = [
    {q:"What's one thing Cas would probably choose?", a:["a quiet night together","a 5-hour lecture","an alarm at 6am"], correct:0},
    {q:"What's the date this whole little site is celebrating?", a:["25.03.2026","25.03.2025","03.25.2027"], correct:0},
    {q:"What is this website's main color?", a:["light blue","neon orange","tax-document beige"], correct:0}
  ];
  let qz = 0;
  const renderQuiz = () => {
    const item = quizData[qz];
    document.getElementById("quiz-question").textContent = item.q;
    const box = document.getElementById("quiz-options");
    box.innerHTML = "";
    item.a.forEach((text, i) => {
      const b = document.createElement("button");
      b.className = "option"; b.type = "button"; b.textContent = text;
      b.addEventListener("click", () => {
        const msg = document.getElementById("quiz-message");
        if (i === item.correct) { b.classList.add("correct"); msg.textContent = "correct ♡"; }
        else { b.classList.add("wrong"); msg.textContent = "nope. suspicious behavior."; }
        setTimeout(() => { qz = (qz + 1) % quizData.length; renderQuiz(); }, 650);
      });
      box.appendChild(b);
    });
  };
  renderQuiz();
})();
