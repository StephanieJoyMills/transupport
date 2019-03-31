from __future__ import print_function
import pickle
import os.path
import requests
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request

# If modifying these scopes, delete the file token.pickle.
SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]

accountTemplate = {
    "id": "",
    "product_code": "",
    "style_number": "",
    "ETA": "",
    "customer": "",
    "status": "",
    "quantity": "",
}

# The ID and range of a sample spreadsheet.
# SAMPLE_SPREADSHEET_ID = "1hN6wGIlLDdkP6Z3o7XPtnmISHN70uYA8ks32s7Q3ZF4"
# SAMPLE_RANGE_NAME = "CCC-Report!A2:D"


def buildCred():
    creds = None
    # The file token.pickle stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first
    # time.
    if os.path.exists("token.pickle"):
        with open("token.pickle", "rb") as token:
            creds = pickle.load(token)
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file("credentials.json", SCOPES)
            creds = flow.run_local_server()
        # Save the credentials for the next run
        with open("token.pickle", "wb") as token:
            pickle.dump(creds, token)
    service = build("sheets", "v4", credentials=creds)
    sheet = service.spreadsheets()

    return sheet

def extractData(sheet_id, range_name):
    sheet = buildCred()
    # Call the Sheets API
    result = sheet.values().get(spreadsheetId=sheet_id, range=range_name).execute()
    return result.get("values", [])


def getAccountDetails(id):
    sheet_id = "1hN6wGIlLDdkP6Z3o7XPtnmISHN70uYA8ks32s7Q3ZF4"
    value = "=MATCH({},'CCC-Report'!I2:I, 0)".format(id)
    inputRange = "LOOKUP!A2"
    rowNum = updateSheet(sheet_id, inputRange, value)
    rowNum = int(rowNum) + 1

    range_name = "CCC-Report!A{}:AA{}".format(rowNum, rowNum)
    row = extractData(sheet_id, range_name)[0]
    account = {
        "id": row[8],
        "prodcode": row[0],
        "stylnum": row[1],
        "cust": row[3],
        "q": row[4],
        "dsm": row[9],
        "gac": row[10],
        "ogac": row[11],
        "tm1": row[12],
        "p": row[13],
        "tm2": row[14],
        "crd": row[15],
        "lnch": row[16],
        "actual": row[17],
        "dm": row[18],
        "calcETA": row[19],
        "numdays": row[20],
        "status": row[21],
        "cpriority": row[22],
        "apriority": row[23],
        "sugtm1": row[24],
        "sugtm2": row[25],
        "sugtma": row[26],
    }

    return account


def getCounts():
    sheet_id = "1hN6wGIlLDdkP6Z3o7XPtnmISHN70uYA8ks32s7Q3ZF4"
    range_name = "CCC-Report!A2:AA"
    values = extractData(sheet_id, range_name)
    if not values:
        return "No data found."
    else:
        counts = {
            "at_risk": 0,
            "resolved": 0,
            "late": 0,
            "cancelled": 0,
            "not_ready": 0,
        }
        for row in values:
            if row[11] == "-" or row[11] == "-":
                counts["not_ready"] += 1
            elif (row[11] != "-" and row[12] != "-" and row[13] == "-") or (
                row[13] != "-" and row[14] != "-"
            ):
                counts["resolved"] += 1
            elif row[21] == "at risk":
                counts["at_risk"] += 1
            elif row[21] == "late":
                counts["late"] += 1
            elif row[21] == "cancelled":
                counts["cancelled"] += 1
    return counts


def getAtRiskAccounts():
    # status is 21
    # quanitty is 4
    sheet_id = "1hN6wGIlLDdkP6Z3o7XPtnmISHN70uYA8ks32s7Q3ZF4"
    range_name = "CCC-Report!A2:AA"
    values = extractData(sheet_id, range_name)
    if not values:
        return "No data found."
    else:
        accounts = []
        for row in values:
            if (
                row[10] != "-"
                and (
                    (row[11] != "-" and row[12] == "-")
                    or (row[13] != "-" and row[14] == "-")
                )
                and row[21] == "at risk"
            ):
                print(row[10])
                newAccount = accountTemplate.copy()
                newAccount["id"] = row[8]
                newAccount["product_code"] = row[0]
                newAccount["style_number"] = row[1]
                newAccount["ETA"] = row[2]
                newAccount["customer"] = row[3]
                newAccount["status"] = "at_risk"
                newAccount["quantity"] = row[4]
                accounts.append(newAccount)
    return accounts


def getLateAccounts():
    sheet_id = "1hN6wGIlLDdkP6Z3o7XPtnmISHN70uYA8ks32s7Q3ZF4"
    range_name = "CCC-Report!A2:AA"
    values = extractData(sheet_id, range_name)
    if not values:
        return "No data found."
    else:
        accounts = []
        for row in values:
            if (
                row[10] != "-"
                and (
                    (row[11] != "-" and row[12] == "-")
                    or (row[13] != "-" and row[14] == "-")
                )
                and row[21] == "late"
            ):
                newAccount = accountTemplate.copy()
                newAccount["id"] = row[8]
                newAccount["product_code"] = row[0]
                newAccount["style_number"] = row[1]
                newAccount["ETA"] = row[2]
                newAccount["customer"] = row[3]
                newAccount["status"] = "late"
                newAccount["quantity"] = row[4]
                accounts.append(newAccount)
    return accounts


def getResolvedAccounts():
    sheet_id = "1hN6wGIlLDdkP6Z3o7XPtnmISHN70uYA8ks32s7Q3ZF4"
    range_name = "CCC-Report!A2:AA"
    values = extractData(sheet_id, range_name)

    if not values:
        return "No data found."
    else:
        accounts = []
        for row in values:
            if (row[11] != "-" and row[12] != "-" and row[13] == "-") or (
                row[13] != "-" and row[14] != "-"
            ):
                newAccount = accountTemplate.copy()
                newAccount["id"] = row[8]
                newAccount["product_code"] = row[0]
                newAccount["style_number"] = row[1]
                newAccount["ETA"] = row[2]
                newAccount["customer"] = row[3]
                newAccount["status"] = "resolved"
                newAccount["quantity"] = row[4]
                accounts.append(newAccount)
    return accounts


def getCancelledAccounts():
    sheet_id = "1hN6wGIlLDdkP6Z3o7XPtnmISHN70uYA8ks32s7Q3ZF4"
    range_name = "CCC-Report!A2:AA"
    values = extractData(sheet_id, range_name)

    if not values:
        return "No data found."
    else:
        accounts = []
        for row in values:
            if (
                row[10] != "-"
                and (
                    (row[11] != "-" and row[12] == "-")
                    or (row[13] != "-" and row[14] == "-")
                )
                and row[21] == "cancelled"
            ):
                newAccount = accountTemplate.copy()
                newAccount["id"] = row[8]
                newAccount["product_code"] = row[0]
                newAccount["style_number"] = row[1]
                newAccount["ETA"] = row[2]
                newAccount["customer"] = row[3]
                newAccount["status"] = "cancelled"
                newAccount["quantity"] = row[4]
                accounts.append(newAccount)
    return accounts


def getNonResolvedAccounts():
    sheet_id = "1hN6wGIlLDdkP6Z3o7XPtnmISHN70uYA8ks32s7Q3ZF4"
    range_name = "CCC-Report!A2:AA"
    values = extractData(sheet_id, range_name)
    if not values:
        return "No data found."
    else:
        accounts = []
        for row in values:
            if (
                (row[11] != "-" and row[12] == "-")
                or (row[13] != "-" and row[14] == "-")
                or row[10] == "-"
                or row[11] == "-"
            ):
                newAccount = accountTemplate.copy()
                newAccount["id"] = row[8]
                newAccount["product_code"] = row[0]
                newAccount["style_number"] = row[1]
                newAccount["ETA"] = row[2]
                newAccount["customer"] = row[3]
                newAccount["quantity"] = row[4]
                if row[10] == "-" or row[11] == "-":
                    newAccount["status"] = "not_ready"
                else:
                    newAccount["status"] = row[21]
                accounts.append(newAccount)
    return accounts


def getAllAccounts():
    sheet_id = "1hN6wGIlLDdkP6Z3o7XPtnmISHN70uYA8ks32s7Q3ZF4"
    range_name = "CCC-Report!A2:AA"
    values = extractData(sheet_id, range_name)

    if not values:
        return "No data found."
    else:
        accounts = []
        for row in values:
            newAccount = accountTemplate.copy()
            newAccount["id"] = row[8]
            newAccount["product_code"] = row[0]
            newAccount["style_number"] = row[1]
            newAccount["ETA"] = row[2]
            newAccount["customer"] = row[3]
            newAccount["quantity"] = row[4]
            if row[10] == "-" or row[11] == "-":
                newAccount["status"] = "not_ready"
            elif (row[11] != "-" and row[12] != "-" and row[13] == "-") or (
                row[13] != "-" and row[14] != "-"
            ):
                newAccount["status"] = "resolved"
            else:
                newAccount["status"] = row[21]
            accounts.append(newAccount)
    return accounts


def updateSheet(sheet_id, inputRange, value):
    sheet = buildCred()
    values = [[value]]
    body = {"values": values}
    result = (
        sheet.values()
        .update(
            spreadsheetId=sheet_id,
            range=inputRange,
            valueInputOption="USER_ENTERED",
            includeValuesInResponse="True",
            body=body,
        )
        .execute()
    )
    return result["updatedData"]["values"][0][0]


def setTransportation(id, method, number):
    sheet_id = "1hN6wGIlLDdkP6Z3o7XPtnmISHN70uYA8ks32s7Q3ZF4"
    value = "=MATCH({},'CCC-Report'!I2:I, 0)".format(id)
    inputRange = "LOOKUP!A2"
    rowNum = updateSheet(sheet_id, inputRange, value)
    rowNum = int(rowNum) + 1
    if number == 1:
        column = "M"
    else:
        column = "O"
    updateRange = "CCC-Report!{}{}".format(column, rowNum)
    updateSheet(sheet_id, updateRange, method)
