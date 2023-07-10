// Importujeme potřebné třídy z externích souborů
import Grid from "./Grid.js"
import Tile from "./Tile.js"

// Získáme prvek herního pole a skóre
const gameBoard = document.getElementById("game-board")
const scoreElement = document.getElementById("score")
let score = 0

// Vytvoříme novou instanci Grid (mřížky) a inicializujeme skóre
const grid = new Grid(gameBoard)

// Inicializujeme mřížku se dvěma dlaždicemi
grid.randomEmptyCell().tile = new Tile(gameBoard)
grid.randomEmptyCell().tile = new Tile(gameBoard)

// Zavoláme funkci setupInput pro nastavení posluchače událostí
setupInput()

// Funkce pro nastavení posluchače událostí klávesnice
function setupInput() {
  window.addEventListener("keydown", handleInput, { once: true })
}

// Funkce pro zpracování vstupu z klávesnice
async function handleInput(e) {
  switch (e.key) {
    case "ArrowUp":
      if (!canMoveUp()) {
        setupInput()
        return
      }
      await moveUp()
      break
    case "ArrowDown":
      if (!canMoveDown()) {
        setupInput()
        return
      }
      await moveDown()
      break
    case "ArrowLeft":
      if (!canMoveLeft()) {
        setupInput()
        return
      }
      await moveLeft()
      break
    case "ArrowRight":
      if (!canMoveRight()) {
        setupInput()
        return
      }
      await moveRight()
      break
    default:
      setupInput()
      return
  }

  // Spojíme všechny dlaždice, pokud je možné je spojit
  grid.cells.forEach(cell => cell.mergeTiles())

  // Přidáme novou dlaždici do náhodné prázdné buňky
  const newTile = new Tile(gameBoard)
  grid.randomEmptyCell().tile = newTile

  // Zkontrolujeme, zda jsou stále možné další tahy, pokud ne, hráč prohrává
  if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
    newTile.waitForTransition(true).then(() => {
      alert("You lose")
    })
    return
  }

  // Nastavíme posluchač událostí pro další tah
  setupInput()
}

// Funkce pro pohyb a kontrolu, zda je možný pohyb ve všech směrech
function moveUp() {
  return slideTiles(grid.cellsByColumn)
}

function moveDown() {
  return slideTiles(grid.cellsByColumn.map(column => [...column].reverse()))
}

function moveLeft() {
  return slideTiles(grid.cellsByRow)
}

function moveRight() {
  return slideTiles(grid.cellsByRow.map(row => [...row].reverse()))
}

function slideTiles(cells) {
  return Promise.all(
    cells.flatMap(group => {
      const promises = []
      for (let i = 1; i < group.length; i++) {
        const cell = group[i]
        if (cell.tile == null) continue
        let lastValidCell
        for (let j = i - 1; j >= 0; j--) {
          const moveToCell = group[j]
          if (!moveToCell.canAccept(cell.tile)) break
          lastValidCell = moveToCell
        }

        if (lastValidCell != null) {
          promises.push(cell.tile.waitForTransition())
          if (lastValidCell.tile != null) {
            lastValidCell.mergeTile = cell.tile
          } else {
            lastValidCell.tile = cell.tile
          }
          cell.tile = null
        }
      }
      return promises
    })
  )
}

function canMoveUp() {
  return canMove(grid.cellsByColumn)
}

function canMoveDown() {
  return canMove(grid.cellsByColumn.map(column => [...column].reverse()))
}

function canMoveLeft() {
  return canMove(grid.cellsByRow)
}

function canMoveRight() {
  return canMove(grid.cellsByRow.map(row => [...row].reverse()))
}

function canMove(cells) {
  return cells.some(group => {
    return group.some((cell, index) => {
      if (index === 0) return false
      if (cell.tile == null) return false
      const moveToCell = group[index - 1]
      return moveToCell.canAccept(cell.tile)
    })
  })
}

