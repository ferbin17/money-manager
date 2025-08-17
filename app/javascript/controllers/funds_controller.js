import { Controller } from "@hotwired/stimulus"
import { CurrencyHelper } from "../helpers/currency_helper.js"

export default class extends Controller {
  static targets = ["currencyAmount"]

  connect() {
    // Format all currency amounts on connect
    this.formatAllAmounts()
    
    // Listen for currency changes
    CurrencyHelper.onCurrencyChange(() => {
      this.formatAllAmounts()
    })
  }

  disconnect() {
    // Clean up event listener
    CurrencyHelper.offCurrencyChange(this.formatAllAmounts.bind(this))
  }

  formatAllAmounts() {
    // Find all elements with data-currency-format attribute
    const amountElements = this.element.querySelectorAll('[data-currency-format]')
    
    amountElements.forEach(element => {
      const amount = parseFloat(element.dataset.currencyFormat)
      if (!isNaN(amount)) {
        element.textContent = CurrencyHelper.formatCurrency(amount)
      }
    })
  }

  // Method to format a specific amount
  formatAmount(amount) {
    return CurrencyHelper.formatCurrency(amount)
  }

  // Method to get current currency info
  getCurrentCurrency() {
    return CurrencyHelper.getCurrentCurrency()
  }
}
