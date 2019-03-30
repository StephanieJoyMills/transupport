from datetime import datetime
from flask import make_response, abort
from gsc import (
    getAtRiskAccounts,
    getLateAccounts,
    getResolvedAccounts,
    getCancelledAccounts,
    getNonResolvedAccounts,
    getAllAccounts,
    setTransportation,
    getCounts,
    getAccountDetails,
)
from emailgenerator import sendEmail


def get_timestamp():
    return datetime.now().strftime(("%Y-%m-%d %H:%M:%S"))


def getAccounts(include):
    """
    Path: /api/accounts
    :param include:   what status of account we want to include aka the flag
    :return:        json list of priority accounts
    """
    # all, resolved, priority, cancelled, non-resolved
    if include == "at_risk":
        accounts = getAtRiskAccounts()
    elif include == "late":
        accounts = getLateAccounts()
    elif include == "resolved":
        accounts = getResolvedAccounts()
    elif include == "cancelled":
        accounts = getCancelledAccounts()
    elif include == "non_resolved":
        accounts = getNonResolvedAccounts()
    elif include == "all":
        accounts = getAllAccounts()
    else:
        accounts = "invaild call"
    return accounts


def get_account_details(id):
    """
    Path: /api/account/{id}
    :param id:  id of the account we want details of   
    :return:        json list of priority accounts
    """
    accountDetails = getAccountDetails(id)
    return accountDetails


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
    return "email sent!"


def set_transportation(id, method):
    print(method)
    """
    Path: /api/account/{id}
    :param id:   id of account
    :param method:    transportation method selected
    :return:        status
    """
    setTransportation(id, method["name"])
    return "transportation method set!"


def get_counts():
    """
    Path: /api/accounts/count
    :return:        status
    """
    counts = getCounts()
    return counts


# def resolved():
#     """
#     Path: /api/accounts/resolved
#     with the complete lists of people
#     :return:        json list of resolved accounts
#     """
#     accounts = getResolvedAccounts()
#     return accounts
