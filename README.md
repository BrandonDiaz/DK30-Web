# DK30.IO
[DK30.IO](http://dk30.io/) is a hub for others to share and explore "30 day projects", and my way of giving back to the community. The application is built in [Node.js](https://nodejs.org/en/) running ontop of [Redis](https://redis.io/) and [MongoDB](https://www.mongodb.com/), and intended to be clustered with [PM2](https://github.com/Unitech/pm2).

# Project Goals

1. Provide a way for Knights to share their projects, goals, and progress.
2. Provide a way to explore projects, prioritizing those with the least exposure.
3. Features should not detract from the official community, only aid and augment it.
4. Features should contribute to creating a safe environment.
5. Features should enforce positivity and growth, not negativity or exclusivity.


# Want to contribute?

This project is open source under the [MIT License](https://github.com/BrandonDiaz/DK30-Web/blob/master/LICENSE), and the community should have a voice in it's direction, as well as a hand in it's development.

If you're a developer, great! Feel free to fork the branch and tackle any of the [active issues](https://github.com/BrandonDiaz/DK30-Web/issues). It's a good idea to let others know what you intend on taking over an issue, so that nobody gets their wires crossed. This also gives people a chance to assist if needed, or brainstorm. When you're finished, just [submit a pull request](https://help.github.com/articles/creating-a-pull-request).

If you're not a developer, you can submit any bugs you've found by [submitting an issue](https://github.com/BrandonDiaz/DK30-Web/issues/new). If you have any ideas for new features or changes, feel free to reach out on Discord.


# Configuration

At a minimum, you'll need Node.js installed, and access to a MongoDB database. There's a shell script in the project root that will install the npm modules and create your .env file to fill out:

`$ sh bootstrap.sh`

This application uses Discord for authentication, and you'll need to [create an application](https://discordapp.com/developers/applications/me) for testing purposes. Once it's set up, add your Client ID/Secret to the .env file.
