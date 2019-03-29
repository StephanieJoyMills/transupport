from datetime import datetime
from flask import make_response, abort
from gsc import (
    getPriorityAccounts,
    getResolvedAccounts,
    getCancelledAccounts,
    getNonResolvedAccounts,
    getAllAccounts,
)
from emailgenerator import sendEmail


def get_timestamp():
    return datetime.now().strftime(("%Y-%m-%d %H:%M:%S"))


def getAccounts(include):
    """
    Path: /api/accounts
    :param lname:   last name of person to find
    :return:        json list of priority accounts
    """
    # all, resolved, priority, cancelled, non-resolved
    if include == "priority":
        accounts = getPriorityAccounts()
    elif include == "resolved":
        accounts = getResolvedAccounts()
    elif include == "cancelled":
        accounts = getCancelledAccounts()
    elif include == "non-resolved":
        accounts = getNonResolvedAccounts()
    else:
        accounts = getAllAccounts()
    return accounts


def send_email(email):
    """
    Path: /api/send_email
    :param recipient:   email address of email recipient
    :param body:    email body
    :return:        status
    """
    # all, resolved, priority, cancelled,
    # non-resolved
    sendEmail(email["subject"], email["recipient"], email["body"])
    return "email sent"


# def resolved():
#     """
#     Path: /api/accounts/resolved
#     with the complete lists of people
#     :return:        json list of resolved accounts
#     """
#     accounts = getResolvedAccounts()
#     return accounts
