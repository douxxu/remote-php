const readline = require('readline');
const axios = require('axios');
const fs = require('fs');
const https = require('https');
const path = require('path');
const colors = require('colors');
const { Command } = require('commander');

const remote_php = `
 ###                      #                ###   #  #  ###  
 #  #   ##   #  #   ##   ####   ##         #  #  #  #  #  # 
 ###   ####  ####  #  #   #    ####  ####  ###   ####  ###  
 # #   #     #  #  #  #   #    #           #     #  #  #    
 #  #   ##   #  #   ##     ##   ##         #     #  #  #    
-----------------------------------------------------------
Github.com/douxxu/remote-php | GPL-3.0 | Help: rp help
`.magenta;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function startClient(remoteUrl, password) {
  console.log(remote_php);
  console.log(colors.green(`Connecting to ${remoteUrl}...`));

  try {
    const response = await axios.post(remoteUrl, {
      password: password,
      command: ''
    });

    if (response.data.status !== 'success') {
      console.error(colors.red('Connection failed:', response.data.message));
      process.exit(1);
    }

    console.log(colors.green('Connected to remote PHP server. Type your commands or "exit" to quit.'));
    console.log(colors.blue(`[${password}@remote-php ${response.data.currentDir}]$ `));

    rl.on('line', async (line) => {
      if (line.trim().toLowerCase() === 'exit') {
        console.log(colors.yellow('Exiting...'));
        await axios.post(remoteUrl, {
          password: password,
          command: 'exit'
        });
        rl.close();
        process.exit(0);
      }

      try {
        const commandResponse = await axios.post(remoteUrl, {
          password: password,
          command: line.trim(),
          currentDir: response.data.currentDir
        });

        if (commandResponse.data.status === 'success') {
          console.log(colors.green(commandResponse.data.output));
        } else {
          console.log(colors.red(commandResponse.data.message));
        }

        response.data.currentDir = commandResponse.data.currentDir;
        console.log(colors.blue(`[${password}@remote-php ${response.data.currentDir}]$ `));

      } catch (error) {
        console.error(colors.red('Error executing command:', error.message));
      }
    });

  } catch (error) {
    console.error(colors.red('Failed to connect:', error.message));
    process.exit(1);
  }
}

const program = new Command();

program
  .version('1.0.0')
  .argument('<passwordAndUrl>', 'Connection details (password@url)', (value) => {
    const [password, url] = value.split('@');
    if (!url || !password) {
      console.error(colors.red('Invalid format. Use: password@http(s)://example.com/remote-php.php'));
      process.exit(1);
    }
    startClient(url, password);
  })
  .option('-h, --help', 'Show this help', () => {
    console.log(remote_php);
    console.log(colors.green(`
Usage:
  rp <password@url>   - Connect to the remote PHP server
  rp server           - Download and configure the remote PHP server script
`));
    process.exit(0);
  })
  .command('server')
  .description('Download and configure the remote PHP server script')
  .action(async () => {
    console.log(remote_php);
    rl.question('Enter password for the server setup: ', async (serverPassword) => {
      console.log(colors.green('Downloading remote server PHP script...'));

      //Different name so we can't use the file to remote php into my server
      const fileUrl = 'https://cdn.douxx.tech/files/remote-php.server.die';
      const filePath = path.join(__dirname, 'remote.php');

      // Download the remote.php
      const file = fs.createWriteStream(filePath);
      https.get(fileUrl, (response) => {
        response.pipe(file);
        file.on('finish', async () => {
          file.close();

          // Replace default password with new one
          fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
              console.error(colors.red('Error reading file:', err.message));
              return;
            }

            const updatedData = data.replace('your_password_here', serverPassword);

            fs.writeFile(filePath, updatedData, (err) => {
              if (err) {
                console.error(colors.red('Error updating file:', err.message));
                return;
              }

              console.log(colors.green(`remote.php has been configured with the provided password.`));
              console.log(colors.blue(`Instructions:
1. Upload the 'remote.php' (${filePath}) file to your server.
2. Set the correct permissions for the file.
3. Ensure the PHP server has the required environment to execute the script.
4. Access the remote connection by using: rp ${serverPassword}@http(s)://example.com/remote.php
`));
              process.exit(0);
            });
          });
        });
      }).on('error', (err) => {
        console.error(colors.red('Error downloading file:', err.message));
        process.exit(1);
      });
    });
  });

program.parse(process.argv);
