#!/usr/bin/env node

const program = require('commander');
const chalk = require('chalk');
const inquirer = require('inquirer');
const fs = require('fs-extra');
const ora = require('ora');
const Listr = require('listr');
const path = require('path');
const { execSync } = require('child_process');
const degit = require('degit');
const packageJson = require('./package.json');

// CLI configuration
program
  .version(packageJson.version)
  .description('GreyCode.js Framework installer');

program
  .command('new <project-name>')
  .description('Create a new GreyCode.js project')
  .option('-d, --directory <dir>', 'Specify installation directory')
  .option('--no-install', 'Skip installing dependencies')
  .action(async (projectName, options) => {
    console.log(chalk.bold.blue('\n⚡ Creating a new GreyCode.js project...\n'));

    const targetDir = options.directory || projectName;

    // Check if directory exists
    if (fs.existsSync(targetDir)) {
      if (fs.readdirSync(targetDir).length > 0) {
        const { overwrite } = await inquirer.prompt({
          type: 'confirm',
          name: 'overwrite',
          message: `Directory ${targetDir} already exists and is not empty. Overwrite?`,
          default: false
        });

        if (!overwrite) {
          console.log(chalk.red('❌ Operation cancelled'));
          return;
        }

        await fs.emptyDir(targetDir);
      }
    } else {
      await fs.ensureDir(targetDir);
    }

    const spinner = ora('Downloading GreyCode.js framework from GitHub...').start();

    // Replace with your actual GitHub repo path
    const emitter = degit('kculz/greycodejs', { cache: false, force: true });

    try {
      await emitter.clone(targetDir);
      spinner.succeed('Downloaded successfully!');
    } catch (err) {
      spinner.fail('Failed to download template');
      console.error(chalk.red(`Error: ${err.message}`));
      return;
    }

    // Prompt for project details
    const { projectDescription, author } = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectDescription',
        message: 'Project description:',
        default: 'A new GreyCode.js project'
      },
      {
        type: 'input',
        name: 'author',
        message: 'Author name:',
        default: ''
      }
    ]);

    // Update package.json
    const pkgPath = path.join(process.cwd(), targetDir, 'package.json');
    if (fs.existsSync(pkgPath)) {
      const pkg = await fs.readJson(pkgPath);

      pkg.name = projectName;
      pkg.description = projectDescription;
      pkg.author = author;

      const binDir = path.join(targetDir, 'bin');
      const binFiles = fs.existsSync(binDir) ? fs.readdirSync(binDir) : [];

      if (binFiles.length > 0) {
        const cliFile = binFiles.includes('cli.js') ? 'cli.js' : binFiles[0];
        pkg.bin = {
          "greycodejs": `./bin/${cliFile}`
        };

        fs.chmodSync(path.join(binDir, cliFile), '755');
      }

      pkg.scripts = {
        ...pkg.scripts,
        "start": "node app.js",
        "dev": "nodemon app.js"
      };

      if (pkg.bin && Object.keys(pkg.bin)[0]) {
        const binCommand = Object.keys(pkg.bin)[0];
        const binPath = pkg.bin[binCommand].replace(/^\.\//, '');
        pkg.scripts.cli = `node ./${binPath}`;
      }

      await fs.writeJson(pkgPath, pkg, { spaces: 2 });
    }

    // Create .env from .env.example
    const envExamplePath = path.join(targetDir, '.env.example');
    const envPath = path.join(targetDir, '.env');
    if (fs.existsSync(envExamplePath) && !fs.existsSync(envPath)) {
      await fs.copy(envExamplePath, envPath);
      console.log(chalk.green('Created .env file from .env.example'));
    }

    // Install dependencies if not skipped
    if (options.install !== false) {
      spinner.text = 'Installing dependencies...';
      spinner.start();

      try {
        process.chdir(targetDir);
        execSync('npm install', { stdio: 'ignore' });
        spinner.succeed('Dependencies installed successfully');
      } catch (err) {
        spinner.fail('Failed to install dependencies');
        console.error(chalk.red(`Error: ${err.message}`));
      }
    }

    console.log(chalk.green('\n✅ Project created successfully!'));
    console.log('\nNext steps:');
    console.log(chalk.cyan(`  cd ${targetDir}`));
    if (options.install === false) {
      console.log(chalk.cyan('  npm install'));
    }
    console.log(chalk.cyan('  npm run dev    # Start the development server'));

    const pkg = await fs.readJson(pkgPath);
    if (pkg.bin && Object.keys(pkg.bin)[0]) {
      const binCommand = Object.keys(pkg.bin)[0];
      console.log(chalk.cyan(`  npm run cli -- create-model User  # Use CLI to create models`));
      console.log(chalk.cyan(`  npx ${binCommand} create-model User`));
    }

    console.log('\nHappy coding with GreyCode.js! 🚀\n');
  });

program
  .command('install-global')
  .description('Install the project CLI globally on your system')
  .action(() => {
    try {
      console.log(chalk.blue('Installing GreyCode.js CLI globally...'));
      execSync('npm link', { stdio: 'inherit' });
      console.log(chalk.green('\n✅ GreyCode.js CLI installed globally!'));
      console.log('You can now run commands like:');
      console.log(chalk.cyan('  greycodejs new my-project'));
    } catch (err) {
      console.error(chalk.red(`Error installing globally: ${err.message}`));
    }
  });

program
  .command('help')
  .description('Display help information')
  .action(() => {
    program.outputHelp();
  });

// Process arguments
program.parse(process.argv);

// Show help if no arguments
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
