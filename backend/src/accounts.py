from datetime import datetime
from flask import make_response, abort
from gsc import (
    getPriorityAccounts,
    getResolvedAccounts,
    getCancelledAccounts,
    getNonResolvedAccounts,
    getAllAccounts,
)


def get_timestamp():
    return datetime.now().strftime(("%Y-%m-%d %H:%M:%S"))


def getAccounts(include):
    print(include)
    """
    Path: /api/accounts/priority
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


# def resolved():
#     """
#     Path: /api/accounts/resolved
#     with the complete lists of people
#     :return:        json list of resolved accounts
#     """
#     accounts = getResolvedAccounts()
#     return accounts
