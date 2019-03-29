import smtplib, ssl

from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

sender_email = "johnmarlow182@gmail.com"


def sendEmail(subject, recipient, body):
    message = MIMEMultipart("alternative")
    message["Subject"] = subject
    message["From"] = sender_email
    password = "123!@#qwe"
    message["To"] = recipient
    message.attach(MIMEText(body, "plain"))

    context = ssl.create_default_context()
    server = smtplib.SMTP_SSL("smtp.gmail.com", 465)
    server.login(sender_email, password)
    server.sendmail(sender_email, recipient, message.as_string())
    return


# Turn these into plain/html MIMEText objects
# part1 = MIMEText(text, "plain")
# part2 = MIMEText(html, "html")

# Create secure connection with server and send email

