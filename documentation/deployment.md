# Deployment

Heroku is used for deploying this app. Do the following steps:

1. Install the heroku-cli on your PC
2. Create a heroku account
3. Execute `heroku login` and follow the instructions to log in.
4. Execute `heroku apps:create qkd-game` to create a heroku app called `qkd-game` with the default remote branch `heroku`
5. Push your code from your main branch by executing `git push heroku main`. If you want to push your code from another branch (e.g. `development`) use `git push heroku development:main`
