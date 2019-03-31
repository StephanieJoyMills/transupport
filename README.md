# DSS Backend

Build in Python with Flask, Connexion, Anaconda

- Swagger Documentation at: `http://0.0.0.0:8080/api/ui`

## Set-up

### Part 1: Setting Up Your Python Environment

Download Anaconda https://www.anaconda.com/distribution/
Create a new env: `conda create -n transupport`
Hop into new env: `conda activate transupport`
(If using VS Code select the correct interpreter)
Install dependencies: `pip install -r requirements.text`

to see info about packages use: pip show <packagename>
If you require additional dependencies instll using: `pip install <package>`
To updated requirements.text use: `pip freeze > requirements.txt`

### Part 2: Running our api!

cd into `/backend/src`
run `python server.py`

And were running!

To see the API Swagger Documentation go to `http://0.0.0.0:8080/api/ui`
