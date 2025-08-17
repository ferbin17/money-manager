import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["button", "menu", "display", "mobileSelect"]
  static values = { 
    symbol: { type: String, default: "₹" },
    code: { type: String, default: "INR" }
  }

  connect() {
    // Initialize from localStorage or set default
    const savedCurrency = localStorage.getItem('selectedCurrency')
    if (savedCurrency) {
      const { symbol, code } = JSON.parse(savedCurrency)
      this.updateCurrency(symbol, code)
    } else {
      this.updateCurrency("₹", "INR")
    }

    // Close menu when clicking outside
    document.addEventListener('click', this.handleClickOutside.bind(this))
  }

  disconnect() {
    document.removeEventListener('click', this.handleClickOutside.bind(this))
  }

  toggle() {
    this.menuTarget.classList.toggle('hidden')
    this.buttonTarget.setAttribute('aria-expanded', !this.menuTarget.classList.contains('hidden'))
  }

  select(event) {
    const button = event.currentTarget
    const symbol = button.dataset.symbol
    const code = button.dataset.code
    
    this.updateCurrency(symbol, code)
    this.close()
  }

  selectMobile(event) {
    const value = event.target.value
    const [symbol, code] = value.split(' ')
    this.updateCurrency(symbol, code)
  }

  updateCurrency(symbol, code) {
    // Update values
    this.symbolValue = symbol
    this.codeValue = code

    // Update display
    this.displayTarget.textContent = `${symbol} ${code}`

    // Update mobile selector if it exists
    if (this.hasMobileSelectTarget) {
      this.mobileSelectTarget.value = `${symbol} ${code}`
    }

    // Store in localStorage
    localStorage.setItem('selectedCurrency', JSON.stringify({ symbol, code }))

    // Dispatch custom event
    this.dispatch('currencyChanged', { detail: { symbol, code } })
  }

  close() {
    this.menuTarget.classList.add('hidden')
    this.buttonTarget.setAttribute('aria-expanded', 'false')
  }

  handleClickOutside(event) {
    if (!this.element.contains(event.target)) {
      this.close()
    }
  }

  // Public methods that can be called from other controllers
  getCurrentCurrency() {
    return {
      symbol: this.symbolValue,
      code: this.codeValue
    }
  }

  formatCurrency(amount) {
    return `${this.symbolValue}${amount.toLocaleString()}`
  }
}
