// Exportujeme třídu Tile (dlaždice)
export default class Tile {
    #tileElement
    #x
    #y
    #value

    // Vytvoření nové dlaždice
    constructor(tileContainer, value = Math.random() > 0.5 ? 2 : 4) {

      // Vytvoříme HTML prvek pro dlaždici a přidáme ho do kontejneru 
      this.#tileElement = document.createElement("div")
      this.#tileElement.classList.add("tile")
      tileContainer.append(this.#tileElement)

      // Nastavíme hodnotu dlaždice, což také aktualizuje její vzhled
      this.value = value
    }

    // Getter a setter pro hodnotu dlaždice
    get value() {
      return this.#value
    }
  
    set value(v) {
      this.#value = v
      this.#tileElement.textContent = v
      const power = Math.log2(v)
      const backgroundLightness = 100 - power * 9
      this.#tileElement.style.setProperty(
        "--background-lightness",
        `${backgroundLightness}%`
      )
      this.#tileElement.style.setProperty(
        "--text-lightness",
        `${backgroundLightness <= 50 ? 90 : 10}%`
      )
    }

    // Setter pro souřadnice x a y dlaždice
    set x(value) {
      this.#x = value
      this.#tileElement.style.setProperty("--x", value)
    }
  
    set y(value) {
      this.#y = value
      this.#tileElement.style.setProperty("--y", value)
    }
  
    // Metoda pro odstranění prvku dlaždice
    remove() {
      this.#tileElement.remove()
    }
  
    // Metoda pro čekání na dokončení CSS přechodu nebo animace
    waitForTransition(animation = false) {
      return new Promise(resolve => {
        this.#tileElement.addEventListener(
          animation ? "animationend" : "transitionend",
          resolve,
          {
            once: true,
          }
        )
      })
    }
  }