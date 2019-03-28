import smtplib, ssl

from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

sender_email = "johnmarlow182@gmail.com"
receiver_email = "irkemp@uwaterloo.ca"

message = MIMEMultipart("alternative")
message["Subject"] = "multipart test"
message["From"] = sender_email
password = "123!@#qwe"
message["To"] = receiver_email

# Create the plain-text and HTML version of your message
text = """\
Hi,
How are you?
Real Python has many great tutorials:
www.realpython.com"""
html = """\
<html>
  <body>
    <p>Hi Ian,<br>
       I am very sad<br>
       <a>a url</a>
       <div style="color:blue;">
       This is html so we can make it pretty
       </div>
    </p>
  </body>
</html>
"""

# Turn these into plain/html MIMEText objects
part1 = MIMEText(text, "plain")
part2 = MIMEText(html, "html")

# Add HTML/plain-text parts to MIMEMultipart message
# The email client will try to render the last part first
# message.attach(part1)
message.attach(part2)

# Create secure connection with server and send email
context = ssl.create_default_context()
server = smtplib.SMTP_SSL("smtp.gmail.com", 465)
server.login(sender_email, password)
server.sendmail(sender_email, receiver_email, message.as_string())

