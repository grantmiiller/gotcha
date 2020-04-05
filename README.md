## Introduction
This is an app allowing you to explore, exploit, and prevent a number of common vulnerabilities.

Solutions can be found in [solutions.md](https://github.com/grantmiiller/gotcha/blob/master/solutions.md)

## Get Started
First, make sure you have Docker installed on your machine.

Then, in the repo's root directory run `./bin/run.sh`. This will pull the latest version of the Docker image and run it.

In another shell instance, also run `./bin/start-evil.sh` to create the evil site, located at `localhost:8000` to do the CSRF exercise.

Finally, go to `http://localhost:4000` and walk through the exercises.
