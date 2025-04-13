# GreyCodeJS Framework



GreyCodeJS is a lightweight, flexible Node.js framework built on Express that simplifies web application development with a clean architecture and powerful CLI tools.

## Features

- **Simple MVC Structure**: Organized models, views, and controllers
- **Built-in CLI**: Create models, controllers, and routes with simple commands
- **Express Integration**: Built on top of Express.js for robust HTTP handling
- **Database Support**: Configured with Sequelize ORM for database operations
- **Middleware Support**: Easy integration for custom middlewares
- **Modular Design**: Clean separation of concerns with a well-defined directory structure

## Quick Start

### Installation

```bash
# Install the GreyCodeJS installer globally
npm install -g greycodejs-installer

# Create a new project
greycodejs-installer new my-project

# Navigate to your project
cd my-project

# Start development server
npm run dev
```

### Manual Installation

```bash
# Clone the repository
git clone https://github.com/kculz/greycodejs.git my-project

# Navigate to your project
cd my-project

# Install dependencies
npm install

# Start development server
npm run dev
```

## Project Structure

```
my-project/
├── bin/           # CLI tools
├── config/        # Configuration files
├── controllers/   # Route controllers
├── core/          # Core framework files
├── middlewares/   # Custom middleware
├── models/        # Data models
├── public/        # Static assets
├── routes/        # Route definitions
├── seeds/         # Database seeders
├── templates/     # Templates/ Views
├── .env.example   # Environment variables examples
├── app.js         # Application entry point
└── package.json   # Project dependencies
```

## Using the CLI

GreyCodeJS comes with a powerful CLI to help you generate code and perform common tasks:

```bash
# Create a new model
npm run cli -- create-model User

# Create a new controller
npm run cli -- create-controller UserController

# Create a new route
npm run cli -- create-route users

# Run database migrations
npm run cli -- migrate

# Generate seeders
npm run cli -- create-seed users
```

## Configuration

### Database

Edit the `config/database.js` file to configure your database connection:

```javascript
module.exports = {
  database: 'your_database',
  username: 'username',
  password: 'password',
  host: 'localhost',
  dialect: 'mysql', // mysql, postgres, sqlite, etc.
  logging: false
};
```

### Environment Variables

Copy `.env.example` to `.env` and adjust the settings as needed:

```
PORT=3000
NODE_ENV=development
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=greycodejs
DB_USERNAME=root
DB_PASSWORD=
```

## Creating a Model

Using the CLI:

```bash
npm run cli -- create-model User
```

Or manually create a file in `models/User.js`:

```javascript
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
  
  return User;
};
```

## Creating a Controller

Using the CLI:

```bash
npm run cli -- create-controller UserController
```

## Creating a Route

Using the CLI:

```bash
npm run cli -- create-route users
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Express.js
- Sequelize ORM
- Commander.js
