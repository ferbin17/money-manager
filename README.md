# money-manager

A modern personal finance management application built with Ruby on Rails, featuring Hotwire and Stimulus for dynamic user experiences.

## Tech Stack

- **Ruby on Rails 7.1.5** - Web framework
- **PostgreSQL** - Database
- **Redis** - Caching and session storage
- **Hotwire (Turbo + Stimulus)** - Modern JavaScript framework
- **Tailwind CSS** - Utility-first CSS framework
- **RSpec** - Testing framework
- **FactoryBot** - Test data factories
- **RuboCop** - Code linting and formatting
- **Pry** - Debugging
- **RSwag** - API documentation

## Features

- 💰 Personal finance tracking
- 📊 Budget management
- 💳 Expense categorization
- 📈 Financial analytics
- 🔐 Secure user authentication
- 📱 Responsive design with Tailwind CSS
- ⚡ Fast interactions with Hotwire
- 🧪 Comprehensive testing suite

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   bundle install
   ```

3. Set up the database:
   ```bash
   rails db:create
   rails db:migrate
   ```

4. Install and build Tailwind CSS:
   ```bash
   rails tailwindcss:install
   rails tailwindcss:build
   ```

5. Start the development server:
   ```bash
   bin/dev
   ```

## Development

### Starting the Application
```bash
bin/dev
```
This starts both the Rails server and Tailwind CSS build process using Foreman.

### Testing
Run the test suite:
```bash
bundle exec rspec
```

### Code Quality
Run RuboCop:
```bash
bundle exec rubocop
```

### API Documentation
Access the API documentation at `/api-docs` when the server is running.

## Project Structure

- **Hotwire**: Modern JavaScript framework for dynamic interactions
- **Stimulus**: Lightweight JavaScript framework for HTML attributes
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **RSpec**: Comprehensive testing framework
- **FactoryBot**: Test data factories for reliable testing
- **RuboCop**: Code quality and style enforcement

## Contributing

1. Follow the RuboCop style guidelines
2. Write tests for new features
3. Ensure all tests pass before submitting
4. Use meaningful commit messages

## License

This project is licensed under the MIT License.
