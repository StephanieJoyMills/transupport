from datetime import datetime
from flask import make_response, abort
from gsc import getPriorityAccounts, getResolvedAccounts


def get_timestamp():
    return datetime.now().strftime(("%Y-%m-%d %H:%M:%S"))


def priority():
    """
    Path: /api/accounts/priority
    :return:        json list of priority accounts
    """
    accounts = getPriorityAccounts()
    return accounts


def resolved():
    """
    Path: /api/accounts/resolved
    with the complete lists of people
    :return:        json list of resolved accounts
    """
    accounts = getResolvedAccounts()
    return accounts
