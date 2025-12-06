import { Controller } from "stimulus"

export default class extends Controller {
  static targets = ["currencyAmount"]

  connect() {
    // Format all currency amounts on connect
    this.formatAllAmounts()
    
    // Listen for currency changes
    if (window.CurrencyHelper) {
      window.CurrencyHelper.onCurrencyChange(() => {
        this.formatAllAmounts()
      })
    }
  }

  disconnect() {
    // Clean up event listener
    if (window.CurrencyHelper) {
      window.CurrencyHelper.offCurrencyChange(this.formatAllAmounts.bind(this))
    }
  }

  formatAllAmounts() {
    // Find all elements with data-currency-format attribute
    const amountElements = this.element.querySelectorAll('[data-currency-format]')
    
    amountElements.forEach(element => {
      const amount = parseFloat(element.dataset.currencyFormat)
      if (!isNaN(amount)) {
        element.textContent = window.CurrencyHelper ? window.CurrencyHelper.formatCurrency(amount) : amount
      }
    })
  }

  // Method to format a specific amount
  formatAmount(amount) {
    return window.CurrencyHelper ? window.CurrencyHelper.formatCurrency(amount) : amount
  }

  // Method to get current currency info
  getCurrentCurrency() {
    return window.CurrencyHelper ? window.CurrencyHelper.getCurrentCurrency() : { symbol: '₹', code: 'INR' }
  }
}
