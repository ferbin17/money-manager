# Pin npm packages by running ./bin/importmap

pin "application"
pin "@hotwired/turbo", to: "https://unpkg.com/@hotwired/turbo@7.3.0/dist/turbo.es2017-umd.js"
pin "@hotwired/stimulus", to: "stimulus.min.js"
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js"
pin "stimulus", to: "stimulus.min.js"
pin_all_from "app/javascript/controllers", under: "controllers"
pin_all_from "app/javascript/helpers", under: "helpers"
