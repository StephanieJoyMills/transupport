from flask import render_template
import connexion

# Create application instance
app = connexion.App(__name__, specification_dir="./")

# Read the swagger.yml file to configure the endpoints
app.add_api("swagger.yml")

# Create a URL route in our app for "/"
@app.route("/")
def home():
    """
    This function just responds to the browser URL
    localhost:5000/

    :return:    the renderd template 'home.html'
    """
    return render_template("home.html")


# If we;re running in stand alone mode, run the >ptyapp
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)
