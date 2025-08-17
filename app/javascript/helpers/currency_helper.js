// Currency helper module for use throughout the application
export class CurrencyHelper {
  static getCurrentCurrency() {
    // Try to get currency from any active currency controller
    const currencyController = document.querySelector('[data-controller="currency"]')
    if (currencyController && currencyController.stimulus) {
      return currencyController.stimulus.getCurrentCurrency()
    }
    
    // Fallback to localStorage
    const savedCurrency = localStorage.getItem('selectedCurrency')
    if (savedCurrency) {
      return JSON.parse(savedCurrency)
    }
    
    // Default fallback
    return { symbol: '₹', code: 'INR' }
  }

  static formatCurrency(amount) {
    const currency = this.getCurrentCurrency()
    return `${currency.symbol}${amount.toLocaleString()}`
  }

  static formatCurrencyWithCode(amount) {
    const currency = this.getCurrentCurrency()
    return `${currency.symbol}${amount.toLocaleString()} ${currency.code}`
  }

  static getCurrencySymbol() {
    return this.getCurrentCurrency().symbol
  }

  static getCurrencyCode() {
    return this.getCurrentCurrency().code
  }

  // Listen for currency changes
  static onCurrencyChange(callback) {
    document.addEventListener('currency:changed', callback)
  }

  // Remove currency change listener
  static offCurrencyChange(callback) {
    document.removeEventListener('currency:changed', callback)
  }
}

// Make it available globally for easy access
window.CurrencyHelper = CurrencyHelper
