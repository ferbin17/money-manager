import { Controller } from "stimulus"

export default class extends Controller {
  static targets = ["searchInput", "typeFilter", "statusFilter", "dateFilter", "tableBody", "importModal", "importForm", "importFile", "fileType", "filePreview", "fileName", "fileSize", "submitButton", "skipDuplicates", "validateData", "progressContainer", "progressBar", "progressText"]

  connect() {
    // Initialize the controller
    this.setupEventListeners()
    this.setupImportModal()
    
    // Format currency amounts
    this.formatCurrencyAmounts()
    
    // Listen for currency changes
    if (window.CurrencyHelper) {
      window.CurrencyHelper.onCurrencyChange(() => {
        this.formatCurrencyAmounts()
      })
    }
  }

  disconnect() {
    // Clean up event listeners
    if (window.CurrencyHelper) {
      window.CurrencyHelper.offCurrencyChange(this.formatCurrencyAmounts.bind(this))
    }
  }

  setupEventListeners() {
    // Search and filter event listeners
    if (this.hasSearchInputTarget) {
      this.searchInputTarget.addEventListener('input', () => this.filterTransactions())
    }
    
    if (this.hasTypeFilterTarget) {
      this.typeFilterTarget.addEventListener('change', () => this.filterTransactions())
    }
    
    if (this.hasStatusFilterTarget) {
      this.statusFilterTarget.addEventListener('change', () => this.filterTransactions())
    }
    
    if (this.hasDateFilterTarget) {
      this.dateFilterTarget.addEventListener('change', () => this.filterTransactions())
    }
  }

  setupImportModal() {
    if (this.hasImportModalTarget) {
      // Close modal when clicking outside
      this.importModalTarget.addEventListener('click', (e) => {
        if (e.target === this.importModalTarget) {
          this.closeImportModal()
        }
      })

      // Handle form submission
      if (this.hasImportFormTarget) {
        this.importFormTarget.addEventListener('submit', (e) => this.handleImport(e))
      }

      // Setup file input handling
      if (this.hasImportFileTarget) {
        this.importFileTarget.addEventListener('change', (e) => this.handleFileSelect(e))
      }

      // Setup drag and drop
      this.setupDragAndDrop()
    }
  }

  // Search and filter functionality
  filterTransactions() {
    const searchTerm = this.hasSearchInputTarget ? this.searchInputTarget.value.toLowerCase() : ''
    const typeFilter = this.hasTypeFilterTarget ? this.typeFilterTarget.value : ''
    const statusFilter = this.hasStatusFilterTarget ? this.statusFilterTarget.value : ''
    const dateFilter = this.hasDateFilterTarget ? this.dateFilterTarget.value : ''
    
    if (!this.hasTableBodyTarget) return
    
    const rows = this.tableBodyTarget.querySelectorAll('tr')
    
    rows.forEach(row => {
      const description = row.querySelector('td:nth-child(1)')?.textContent.toLowerCase() || ''
      const type = row.querySelector('td:nth-child(3)')?.textContent.toLowerCase() || ''
      const status = row.querySelector('td:nth-child(5)')?.textContent.toLowerCase() || ''
      const date = row.querySelector('td:nth-child(4)')?.textContent || ''
      
      const matchesSearch = !searchTerm || description.includes(searchTerm)
      const matchesType = !typeFilter || type.includes(this.getTypeText(typeFilter))
      const matchesStatus = !statusFilter || status.includes(this.getStatusText(statusFilter))
      const matchesDate = !dateFilter || date.includes(dateFilter)
      
      if (matchesSearch && matchesType && matchesStatus && matchesDate) {
        row.style.display = ''
      } else {
        row.style.display = 'none'
      }
    })
  }

  getTypeText(typeValue) {
    switch (typeValue) {
      case '0': return 'income'
      case '1': return 'expense'
      case '2': return 'transfer'
      default: return ''
    }
  }

  getStatusText(statusValue) {
    switch (statusValue) {
      case '0': return 'pending'
      case '1': return 'completed'
      case '2': return 'cancelled'
      default: return ''
    }
  }

  // Import modal functionality
  openImportModal() {
    if (this.hasImportModalTarget) {
      console.log('Removing hidden class from modal')
      this.importModalTarget.classList.remove('hidden')
      // Reset form and file preview
      if (this.hasImportFormTarget) {
        this.importFormTarget.reset()
      }
      this.hideFilePreview()
      this.enableSubmitButton()
    } else {
      console.log('Import modal target not found')
    }
  }

  closeImportModal() {
    if (this.hasImportModalTarget) {
      this.importModalTarget.classList.add('hidden')
      this.hideFilePreview()
    }
  }

  // File handling methods
  handleFileSelect(event) {
    const file = event.target.files[0]
    if (file) {
      this.displayFilePreview(file)
      this.enableSubmitButton()
    } else {
      this.hideFilePreview()
      this.disableSubmitButton()
    }
  }

  removeFile() {
    if (this.hasImportFileTarget) {
      this.importFileTarget.value = ''
      this.hideFilePreview()
      this.disableSubmitButton()
    }
  }

  displayFilePreview(file) {
    if (this.hasFilePreviewTarget && this.hasFileNameTarget && this.hasFileSizeTarget) {
      this.fileNameTarget.textContent = file.name
      this.fileSizeTarget.textContent = this.formatFileSize(file.size)
      this.filePreviewTarget.classList.remove('hidden')
    }
  }

  hideFilePreview() {
    if (this.hasFilePreviewTarget) {
      this.filePreviewTarget.classList.add('hidden')
    }
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  enableSubmitButton() {
    if (this.hasSubmitButtonTarget) {
      this.submitButtonTarget.disabled = false
    }
  }

  disableSubmitButton() {
    if (this.hasSubmitButtonTarget) {
      this.submitButtonTarget.disabled = true
    }
  }

  setupDragAndDrop() {
    const dropZone = this.importModalTarget?.querySelector('.border-dashed')
    if (!dropZone) return

    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault()
      dropZone.classList.add('border-blue-400', 'bg-blue-50')
    })

    dropZone.addEventListener('dragleave', (e) => {
      e.preventDefault()
      dropZone.classList.remove('border-blue-400', 'bg-blue-50')
    })

    dropZone.addEventListener('drop', (e) => {
      e.preventDefault()
      dropZone.classList.remove('border-blue-400', 'bg-blue-50')
      
      const files = e.dataTransfer.files
      if (files.length > 0) {
        const file = files[0]
        if (this.isValidFileType(file)) {
          this.importFileTarget.files = files
          this.displayFilePreview(file)
          this.enableSubmitButton()
        } else {
          this.showAlert('Invalid file type. Please select a CSV, Excel, or JSON file.', 'error')
        }
      }
    })
  }

  isValidFileType(file) {
    const validTypes = ['.csv', '.xlsx', '.xls', '.json']
    const fileName = file.name.toLowerCase()
    return validTypes.some(type => fileName.endsWith(type))
  }

  // Template and help methods
  downloadTemplate() {
    const csvContent = `description,amount,transaction_type,transaction_date,reference_number,notes,status,nav,units
Salary,5000.00,0,2024-01-15,REF001,Monthly salary,1,,
Grocery Shopping,-150.50,1,2024-01-16,REF002,Weekly groceries,1,,
Investment Purchase,1000.00,2,2024-01-17,REF003,ETF purchase,1,25.50,39.22
Restaurant,-75.00,1,2024-01-18,REF004,Dinner with friends,1,,`
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'transactions_template.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  showFormatHelp() {
    const helpContent = `
      <div class="space-y-4">
        <div>
          <h4 class="font-medium text-gray-900 mb-2">CSV Format</h4>
          <p class="text-sm text-gray-600">Your CSV should have the following columns:</p>
          <ul class="text-xs text-gray-500 mt-1 space-y-1">
            <li>• description: Transaction description (required)</li>
            <li>• amount: Amount (positive for income, negative for expense)</li>
            <li>• transaction_type: 0=Income, 1=Expense, 2=Transfer</li>
            <li>• transaction_date: Date in YYYY-MM-DD format</li>
            <li>• reference_number: Optional reference</li>
            <li>• notes: Optional additional notes</li>
            <li>• status: 0=Pending, 1=Completed, 2=Cancelled</li>
            <li>• nav: Net Asset Value (for investments)</li>
            <li>• units: Number of units (for investments)</li>
          </ul>
        </div>
        <div>
          <h4 class="font-medium text-gray-900 mb-2">Excel Format</h4>
          <p class="text-sm text-gray-600">Same columns as CSV, but in Excel format.</p>
        </div>
        <div>
          <h4 class="font-medium text-gray-900 mb-2">JSON Format</h4>
          <p class="text-sm text-gray-600">Array of transaction objects with the same fields.</p>
        </div>
      </div>
    `
    
    this.showModal('Import Format Help', helpContent)
  }

  showModal(title, content) {
    const modal = document.createElement('div')
    modal.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50'
    modal.innerHTML = `
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">${title}</h3>
            <button class="text-gray-400 hover:text-gray-600" onclick="this.parentElement.parentElement.parentElement.remove()">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <div class="text-sm text-gray-700">
            ${content}
          </div>
          <div class="mt-4 flex justify-end">
            <button class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50" onclick="this.parentElement.parentElement.parentElement.remove()">
              Close
            </button>
          </div>
        </div>
      </div>
    `
    
    document.body.appendChild(modal)
    
    // Close when clicking outside
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove()
      }
    })
  }

  handleImport(event) {
    event.preventDefault()
    
    if (!this.hasImportFileTarget || !this.hasFileTypeTarget) return
    
    const file = this.importFileTarget.files[0]
    const fileType = this.fileTypeTarget.value
    
    if (!file) {
      this.showAlert('Please select a file to import', 'error')
      return
    }
    
    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      this.showAlert('File size too large. Please select a file smaller than 10MB.', 'error')
      return
    }
    
    // Validate file type
    const validTypes = {
      'csv': ['.csv'],
      'xlsx': ['.xlsx', '.xls'],
      'json': ['.json']
    }
    
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase()
    if (!validTypes[fileType].includes(fileExtension)) {
      this.showAlert(`Invalid file type. Expected ${validTypes[fileType].join(' or ')}`, 'error')
      return
    }
    
    // Get import options
    const skipDuplicates = this.hasSkipDuplicatesTarget ? this.skipDuplicatesTarget.checked : false
    const validateData = this.hasValidateDataTarget ? this.validateDataTarget.checked : true
    
    // Create form data and submit
    const formData = new FormData()
    formData.append('file', file)
    formData.append('file_type', fileType)
    formData.append('skip_duplicates', skipDuplicates)
    formData.append('validate_data', validateData)
    
    // Show loading state and start progress
    this.showLoadingState()
    const progressInterval = this.simulateProgress()
    
    // Submit to backend
    fetch('/transactions/import', {
      method: 'POST',
      body: formData,
      headers: {
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
      }
    })
    .then(response => response.json())
    .then(data => {
      // Complete progress
      clearInterval(progressInterval)
      this.updateProgress(100, 'Import completed!')
      
      if (data.success) {
        this.showAlert(data.message || 'Import completed successfully!', 'success')
        setTimeout(() => {
          this.closeImportModal()
          // Reload page to show new data
          window.location.reload()
        }, 1000)
      } else {
        this.showAlert(data.message || 'Import failed. Please try again.', 'error')
        this.hideLoadingState()
      }
    })
    .catch(error => {
      // Complete progress on error
      clearInterval(progressInterval)
      this.updateProgress(100, 'Import failed')
      
      console.error('Import error:', error)
      this.showAlert('Import failed. Please try again.', 'error')
      this.hideLoadingState()
    })
  }

  showLoadingState() {
    if (this.hasSubmitButtonTarget) {
      this.submitButtonTarget.disabled = true
      this.submitButtonTarget.innerHTML = `
        <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Importing...
      `
    }
    
    // Show progress bar
    if (this.hasProgressContainerTarget) {
      this.progressContainerTarget.classList.remove('hidden')
      this.updateProgress(0, 'Preparing import...')
    }
  }

  hideLoadingState() {
    if (this.hasSubmitButtonTarget) {
      this.submitButtonTarget.disabled = false
      this.submitButtonTarget.innerHTML = 'Import'
    }
    
    // Hide progress bar
    if (this.hasProgressContainerTarget) {
      this.progressContainerTarget.classList.add('hidden')
    }
  }

  updateProgress(percentage, text) {
    if (this.hasProgressBarTarget) {
      this.progressBarTarget.style.width = `${percentage}%`
    }
    if (this.hasProgressTextTarget) {
      this.progressTextTarget.textContent = text
    }
  }

  simulateProgress() {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 15
      if (progress >= 90) {
        progress = 90
        clearInterval(interval)
      }
      this.updateProgress(progress, `Processing... ${Math.round(progress)}%`)
    }, 200)
    
    return interval
  }

  showAlert(message, type = 'info') {
    // Create alert element
    const alertDiv = document.createElement('div')
    alertDiv.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
      type === 'success' ? 'bg-green-500 text-white' :
      type === 'error' ? 'bg-red-500 text-white' :
      'bg-blue-500 text-white'
    }`
    
    alertDiv.innerHTML = `
      <div class="flex items-center">
        <div class="flex-shrink-0">
          ${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'}
        </div>
        <div class="ml-3">
          <p class="text-sm font-medium">${message}</p>
        </div>
        <div class="ml-auto pl-3">
          <button class="text-white hover:text-gray-200" onclick="this.parentElement.parentElement.parentElement.remove()">
            ✗
          </button>
        </div>
      </div>
    `
    
    document.body.appendChild(alertDiv)
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (alertDiv.parentElement) {
        alertDiv.remove()
      }
    }, 5000)
  }

  // Currency formatting
  formatCurrencyAmounts() {
    if (!this.hasTableBodyTarget) return
    
    const amountElements = this.tableBodyTarget.querySelectorAll('[data-currency-format]')
    
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

  // Export functionality
  exportTransactions(format = 'csv') {
    const filters = {
      search: this.hasSearchInputTarget ? this.searchInputTarget.value : '',
      type: this.hasTypeFilterTarget ? this.typeFilterTarget.value : '',
      status: this.hasStatusFilterTarget ? this.statusFilterTarget.value : '',
      date: this.hasDateFilterTarget ? this.dateFilterTarget.value : ''
    }
    
    // Create export URL with filters
    const params = new URLSearchParams(filters)
    const exportUrl = `/transactions/export.${format}?${params.toString()}`
    
    // Trigger download
    const link = document.createElement('a')
    link.href = exportUrl
    link.download = `transactions_${new Date().toISOString().split('T')[0]}.${format}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}
