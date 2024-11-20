# Remote-php

Remote-php is a simple command-line tool that allows you to execute commands remotely on a PHP server through an interactive terminal interface. It consists of two components:

1. **remote.php** - The PHP script that runs on your server and executes the commands.
2. **rp** - The Node.js client that connects to the remote PHP server.

## Features

- Secure connection using password authentication.
- Supports basic shell commands, including `cd` to change directories.
- Ability to execute shell commands on the remote server.
- Automatically handles the `exit` command to close the session.
- Can be easily set up on any PHP-enabled server.

## Requirements

- A server with PHP installed.
- Node.js (for the client-side functionality).

## Installation

### 1. Set up the PHP server script:

- Download the `remote.php` script from the repository or use the provided setup commands.

### 1. Set up the Node.js client:

- Ensure you have **Node.js** installed on your local machine.
- Install dependencies by running:

```bash
npm install -g remote-php
```

### 2. Setup the remote.php file

> You can also use "remote-php" instead of "rp"

To run the server-side script, you'll need to download the remote.php file with the command
```bash
rp server
```


- Upload `remote.php` to your server (for example, `http(s)://your-server/remote.php`).
- Set the correct permissions for the file on your server.
- Ensure your server is running PHP and has the required environment for executing the script.


### 3. Run the client:

To connect to the remote PHP server, run the `remote-php` client with the format:

```bash
rp <password@url>
```

For example:

```bash
node rp mysecretpassword@http://your-server/remote.php
```

## Usage

### Command-Line Interface (CLI)

Once connected to the remote PHP server, you can execute shell commands in the terminal. The interface provides:

- **Password authentication**: You'll need to provide the correct password for the remote connection.
- **Directory navigation**: Use `cd <directory>` to change directories on the server.
- **Command execution**: Execute any command that is allowed by the PHP server.
- **Exit**: Type `exit` to close the session.

### Setting up the remote PHP server

If you'd like to download and configure the `remote.php` script, use the following command:

```bash
rp server
```

You will be prompted to enter a password for the server setup, and the script will automatically download and configure the remote.php file for you.

## Example:

1. **Run the client:**

```bash
rp mysecretpassword@http://your-server/remote.php
```

2. **Execute commands:**

```bash
[mysecretpassword@remote-php /]$
> ls
```

3. **Change directory:**

```bash
[mysecretpassword@remote-php /]$
> cd /var/www
```

4. **Exit the session:**

```bash
[mysecretpassword@remote-php /]$
> exit
```

## License

This project is licensed under the **GPL-3.0 License**. See the [LICENSE](LICENSE) file for more details.
