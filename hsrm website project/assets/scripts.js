document.addEventListener("DOMContentLoaded", () => {

   // NAVIGATION & SCROLL HEADER
  const header = document.querySelector("header");
  const hamburger = document.getElementById("hamburger");
  const nav = document.querySelector("nav");
  const navLinks = document.querySelectorAll(".nav-center li a");

  if (hamburger && nav) {
    hamburger.addEventListener("click", () => nav.classList.toggle("active"));
  }

  navLinks.forEach(link => {
    link.addEventListener("click", () => nav.classList.remove("active"));
  });

  window.addEventListener("scroll", () => {
    if (!header) return;
    if (window.scrollY > 50) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  });

  // BILDER CAFÉ CARDS SLIDER
  function nextImage(button) {
    const slider = button.parentElement;
    const images = slider.querySelectorAll("img");
    const current = slider.querySelector("img.active");
    if (!current) return;

    let index = Array.from(images).indexOf(current);
    current.classList.remove("active");
    let nextIndex = (index + 1) % images.length;
    images[nextIndex].classList.add("active");
  }

  function prevImage(button) {
    const slider = button.parentElement;
    const images = slider.querySelectorAll("img");
    const current = slider.querySelector("img.active");
    if (!current) return;

    let index = Array.from(images).indexOf(current);
    current.classList.remove("active");
    let prevIndex = (index - 1 + images.length) % images.length;
    images[prevIndex].classList.add("active");
  }

  document.querySelectorAll(".image-slider").forEach(slider => {
    const leftBtn = slider.querySelector(".arrow.left");
    const rightBtn = slider.querySelector(".arrow.right");
    if (!leftBtn || !rightBtn) return;

    leftBtn.addEventListener("click", () => prevImage(leftBtn));
    rightBtn.addEventListener("click", () => nextImage(rightBtn));
  });

    // MODAL ANMELDUNG
  const modal = document.getElementById("anmeldungModal");
  const cafeButtons = document.querySelectorAll("#cafes button.anmelden-btn[data-cafe]");
  const cafeSelect = document.getElementById("cafe");
  const datumSelect = document.getElementById("datum");
  const closeBtn = modal ? modal.querySelector(".close") : null;

  const form = document.getElementById("anmeldungForm");
  const thankyouModal = document.getElementById("thankyouModal");
  const thankyouClose = thankyouModal ? thankyouModal.querySelector(".thankyou-close") : null;
  const thankyouOk    = thankyouModal ? thankyouModal.querySelector(".thankyou-ok") : null;

  function getFirstWeekdayOfMonth(year, month, weekday) {
    const date = new Date(year, month, 1);
    const diff = (weekday + 7 - date.getDay()) % 7;
    date.setDate(date.getDate() + diff);
    return date;
  }

  function getLastWeekdayOfMonth(year, month, weekday) {
    const date = new Date(year, month + 1, 0);
    const diff = (date.getDay() - weekday + 7) % 7;
    date.setDate(date.getDate() - diff);
    return date;
  }

  function updateDates(cafeName) {
    if (!datumSelect) return;
    datumSelect.innerHTML = "";
    const today = new Date();
    let dates = [];

    if (cafeName === "Ahoi Café") {
      let month = today.getMonth();
      let year = today.getFullYear();
      while (dates.length < 3) {
        const firstTuesday = getFirstWeekdayOfMonth(year, month, 2);
        if (firstTuesday >= today) dates.push(firstTuesday);
        month++;
        if (month > 11) { month = 0; year++; }
      }
    } else if (cafeName === "Besser-Samstag") {
      let month = today.getMonth();
      let year = today.getFullYear();
      while (dates.length < 3) {
        const lastThursday = getLastWeekdayOfMonth(year, month, 4);
        if (lastThursday >= today) dates.push(lastThursday);
        month++;
        if (month > 11) { month = 0; year++; }
      }
    }

    dates.forEach(date => {
      const option = document.createElement("option");
      option.value = date.toISOString().split("T")[0];
      option.textContent = date.toLocaleDateString("de-DE", {
        weekday: "long", day: "numeric", month: "long", year: "numeric"
      });
      datumSelect.appendChild(option);
    });
  }

  if (modal && cafeSelect) {
    cafeButtons.forEach(button => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        const cafe = button.getAttribute("data-cafe");
        cafeSelect.value = cafe;
        updateDates(cafe);
        modal.classList.add("is-open");
      });
    });

    cafeSelect.addEventListener("change", (e) => updateDates(e.target.value));

    if (closeBtn) {
      closeBtn.addEventListener("click", () => modal.classList.remove("is-open"));
    }
  }

  if (form && thankyouModal && modal) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      modal.classList.remove("is-open");
      form.reset();
      if (datumSelect) datumSelect.innerHTML = '<option value="">Bitte wählen</option>';
      thankyouModal.classList.add("is-open");
    });
  }

  function closeThankyou() {
    if (thankyouModal) thankyouModal.classList.remove("is-open");
  }

  if (thankyouClose) thankyouClose.addEventListener("click", closeThankyou);
  if (thankyouOk) thankyouOk.addEventListener("click", closeThankyou);

  window.addEventListener("click", (e) => {
    if (modal && e.target === modal) modal.classList.remove("is-open");
    if (thankyouModal && e.target === thankyouModal) closeThankyou();
  });

  // RECAP KARTEN
  const stack = document.getElementById("cardStack");
  const shuffleBtn = document.getElementById("shuffleBtn");

  function updateStack() {
    if (!stack) return;
    const cards = stack.querySelectorAll(".card");

    cards.forEach((card, index) => {
      card.style.zIndex = cards.length - index;

      if (index === 0) {
        card.style.transform = "translate(0, 0) rotate(-1deg)";
        card.style.opacity = "1";
      } else if (index === 1) {
        card.style.transform = "translate(10px, 8px) rotate(1.5deg)";
        card.style.opacity = "0.9";
      } else if (index === 2) {
        card.style.transform = "translate(20px, 16px) rotate(-2deg)";
        card.style.opacity = "0.8";
      } else {
        card.style.opacity = "0";
      }
    });
  }

  if (shuffleBtn && stack) {
    shuffleBtn.addEventListener("click", () => {
      const cards = stack.querySelectorAll(".card");
      if (cards.length <= 1) return;

      const first = cards[0];
      first.style.transform = "translateX(120%) rotate(8deg)";

      setTimeout(() => {
        first.style.transform = "";
        stack.appendChild(first);
        updateStack();
      }, 300);
    });

    updateStack();
  }

    // HANDY RECAP HINTERGRUND
  function extendRecapRows() {
    const recapBg = document.querySelector("#recap .bg-recap");
    if (!recapBg) return;

    const isMobile = window.innerWidth <= 768;
    const baseSpans = recapBg.querySelectorAll("span");
    const baseCount = 5;

    recapBg.innerHTML = "";
    baseSpans.forEach(span => recapBg.appendChild(span.cloneNode(true)));

    if (isMobile) {
      for (let i = baseCount; i < 9; i++) {
        const clone = baseSpans[i % baseCount].cloneNode(true);
        recapBg.appendChild(clone);
      }
    }
  }

  window.addEventListener("load", extendRecapRows);
  window.addEventListener("resize", extendRecapRows);

});


  // PUZZLE
  (function initPuzzle(){
    const puzzleContainer = document.getElementById("puzzle-container");
    const piecesLeft  = document.getElementById("piecesLeft");
    const piecesRight = document.getElementById("piecesRight");
const isMobile = window.innerWidth <= 768;

if (isMobile) {
  piecesLeft.classList.add("puzzle-side-top");
  piecesRight.classList.add("puzzle-side-bottom");
}


    if (!puzzleContainer || !piecesLeft || !piecesRight) return;

    const puzzleImageSrc = "assets/image/quizbild.jpeg";
    const rows = 3;
    const cols = 4;
    const pieces = [];

    const img = new Image();
    img.src = puzzleImageSrc;

    function pxToPct(px, base) { return (px / base) * 100; }
    function setPiecePosPct(piece, leftPct, topPct) {
      piece.dataset.leftPct = String(leftPct);
      piece.dataset.topPct  = String(topPct);
      piece.style.left = leftPct + "%";
      piece.style.top  = topPct  + "%";
    }
    function getPiecePosPct(piece) {
      return {
        leftPct: parseFloat(piece.dataset.leftPct || "0"),
        topPct:  parseFloat(piece.dataset.topPct  || "0"),
      };
    }

    function getBoardMetrics() {
      const boardW = puzzleContainer.offsetWidth;
      const ratio  = img.naturalHeight / img.naturalWidth;
      const boardH = Math.round(boardW * ratio);
      const pieceW = boardW / cols;
      const pieceH = boardH / rows;
      return { boardW, boardH, pieceW, pieceH };
    }

    function applyBoardHeight() {
      const { boardH, pieceH } = getBoardMetrics();
      let finalH = boardH;
     if (window.innerWidth <= 768) finalH = boardH;

      puzzleContainer.style.height = Math.round(finalH) + "px";
    }

    function updateBoardBackgroundForPieces() {
      const { boardW, boardH, pieceW, pieceH } = getBoardMetrics();

      pieces.forEach(piece => {
        if (piece.parentElement !== puzzleContainer) return;

        const col = parseInt(piece.dataset.col, 10);
        const row = parseInt(piece.dataset.row, 10);

        piece.style.width  = Math.round(pieceW) + "px";
        piece.style.height = Math.round(pieceH) + "px";
        piece.style.backgroundImage = `url(${puzzleImageSrc})`;
        piece.style.backgroundSize = `${Math.round(boardW)}px ${Math.round(boardH)}px`;
        piece.style.backgroundPosition = `-${Math.round(col * pieceW)}px -${Math.round(row * pieceH)}px`;

        piece.dataset.boardBgPos = piece.style.backgroundPosition;
      });
    }

    function applyStoredPctPositions() {
      applyBoardHeight();

      pieces.forEach(piece => {
        if (piece.parentElement !== puzzleContainer) return;
        const { leftPct, topPct } = getPiecePosPct(piece);
        piece.style.left = leftPct + "%";
        piece.style.top  = topPct  + "%";
      });

      updateBoardBackgroundForPieces();
    }

    function checkPuzzleComplete() {
      const allPlaced = pieces.length > 0 && pieces.every(p => p.style.pointerEvents === "none");
      if (!allPlaced) return;

      puzzleContainer.innerHTML = "";
      const fullImg = document.createElement("img");
      fullImg.src = puzzleImageSrc;
      fullImg.style.width = "100%";
      fullImg.style.height = "100%";
      fullImg.style.objectFit = "cover";
      fullImg.style.display = "block";
      puzzleContainer.appendChild(fullImg);
    }

    img.onload = () => {
      applyBoardHeight();

      const positions = [];
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) positions.push({ row: r, col: c });
      for (let i = positions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [positions[i], positions[j]] = [positions[j], positions[i]];
      }

      const { boardW, boardH, pieceW, pieceH } = getBoardMetrics();

      for (let i = 0; i < rows * cols; i++) {
        const pos = positions[i];
        const piece = document.createElement("div");
        piece.classList.add("puzzle-piece");

        piece.dataset.row = String(pos.row);
        piece.dataset.col = String(pos.col);
        piece.dataset.boardBgPos = `-${Math.round(pos.col * pieceW)}px -${Math.round(pos.row * pieceH)}px`;

        const inLeft = i < 6;
        const sideScale = window.innerWidth <= 768 ? 0.55 : 0.40;
        const sideW = Math.round(pieceW * sideScale);
        const sideH = Math.round(pieceH * sideScale);

        piece.style.width  = sideW + "px";
        piece.style.height = sideH + "px";
        piece.style.backgroundImage = `url(${puzzleImageSrc})`;
        piece.style.backgroundSize = `${Math.round(boardW * sideScale)}px ${Math.round(boardH * sideScale)}px`;
        piece.style.backgroundPosition =
          `-${Math.round(pos.col * pieceW * sideScale)}px -${Math.round(pos.row * pieceH * sideScale)}px`;

        const rot = (Math.random() * 18 - 9) * (inLeft ? -1 : 1);
        piece.style.transform = `rotate(${rot}deg)`;

        (i < 6 ? piecesLeft : piecesRight).appendChild(piece);
        piece.style.position = "relative";
        piece.style.left = "0";
        piece.style.top  = "0";

        pieces.push(piece);

        piece.addEventListener("pointerdown", (e) => {
          e.preventDefault();

          const pieceRect = piece.getBoundingClientRect();
          const containerRect = puzzleContainer.getBoundingClientRect();

          puzzleContainer.appendChild(piece);

          const { boardW, boardH, pieceW, pieceH } = getBoardMetrics();

          piece.style.width  = Math.round(pieceW) + "px";
          piece.style.height = Math.round(pieceH) + "px";
          piece.style.backgroundSize = `${Math.round(boardW)}px ${Math.round(boardH)}px`;
          piece.style.backgroundPosition = piece.dataset.boardBgPos;
          piece.style.transform = "rotate(0deg)";

          piece.style.position = "absolute";
          piece.style.zIndex = 10;

          const startLeftPx = pieceRect.left - containerRect.left;
          const startTopPx  = pieceRect.top  - containerRect.top;

          piece.style.left = startLeftPx + "px";
          piece.style.top  = startTopPx  + "px";
          setPiecePosPct(piece, pxToPct(startLeftPx, boardW), pxToPct(startTopPx, boardH));

          piece.style.cursor = "grabbing";

          const offsetX = e.clientX - pieceRect.left;
          const offsetY = e.clientY - pieceRect.top;

          const move = (ev) => {
            piece.style.left = (ev.clientX - containerRect.left - offsetX) + "px";
            piece.style.top  = (ev.clientY - containerRect.top  - offsetY) + "px";
          };

          const up = () => {
            document.removeEventListener("pointermove", move);
            document.removeEventListener("pointerup", up);
            piece.style.cursor = "grab";

            const { boardW, boardH } = getBoardMetrics();

            const currentLeftPx = parseFloat(piece.style.left);
            const currentTopPx  = parseFloat(piece.style.top);

            const currentLeftPct = pxToPct(currentLeftPx, boardW);
            const currentTopPct  = pxToPct(currentTopPx,  boardH);

            const col = parseInt(piece.dataset.col, 10);
            const row = parseInt(piece.dataset.row, 10);

            const targetLeftPct = col * (100 / cols);
            const targetTopPct  = row * (100 / rows);

            const snapPctX = (100 / cols) * 0.25;
            const snapPctY = (100 / rows) * 0.25;

            if (
              Math.abs(currentLeftPct - targetLeftPct) < snapPctX &&
              Math.abs(currentTopPct  - targetTopPct)  < snapPctY
            ) {
              setPiecePosPct(piece, targetLeftPct, targetTopPct);
              piece.style.pointerEvents = "none";
              piece.style.zIndex = 1;
            } else {
              setPiecePosPct(piece, currentLeftPct, currentTopPct);
            }

            checkPuzzleComplete();
          };

          document.addEventListener("pointermove", move);
          document.addEventListener("pointerup", up);
        });
      }

      window.addEventListener("resize", applyStoredPctPositions);
    };
  })();


