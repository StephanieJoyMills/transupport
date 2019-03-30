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
    "transportation": "",
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


# def getPriorityAccounts():
#     sheet_id = "1hN6wGIlLDdkP6Z3o7XPtnmISHN70uYA8ks32s7Q3ZF4"
#     range_name = "CCC-Report!A2:H55"
#     values = extractData(sheet_id, range_name)
#     if not values:
#         return "No data found."
#     else:
#         accounts = []
#         for row in values:
#             if row[6] == "-" and row[7] == "not selected":
#                 newAccount = accountTemplate.copy()
#                 newAccount["product_code"] = row[0]
#                 newAccount["style_number"] = row[1]
#                 newAccount["ETA"] = row[2]
#                 newAccount["customer"] = row[3]
#                 newAccount["transportation"] = "not selected"
#                 if row[4] != "-":
#                     newAccount["status"] = "At Risk"
#                     newAccount["quantity"] = row[4]
#                 else:
#                     newAccount["status"] = "Late"
#                     newAccount["quantity"] = row[5]
#                 accounts.append(newAccount)
#     return accounts


def getAccountDetails(id):
    # # getAccountDetails
    # sheet_id = "1hN6wGIlLDdkP6Z3o7XPtnmISHN70uYA8ks32s7Q3ZF4"
    # range_name = "CCC-Report!A2:I"
    # values = extractData(sheet_id, range_name)
    # if not values:
    #     return "No data found."
    # else:
    #     counts = {"at_risk": 0, "resolved": 0, "late": 0, "cancelled": 0}
    #     for row in values:
    #         if row[7] != "not selected":
    #             counts["resolved"] += 1
    #         elif row[4] != "-":
    #             counts["at_risk"] += 1
    #         elif row[5] != "-":
    #             counts["late"] += 1
    #             print(row[5])
    #         elif row[6] != "-":
    #             counts["cancelled"] += 1
    return "muh"


def getCounts():
    sheet_id = "1hN6wGIlLDdkP6Z3o7XPtnmISHN70uYA8ks32s7Q3ZF4"
    range_name = "CCC-Report!A2:I"
    values = extractData(sheet_id, range_name)
    if not values:
        return "No data found."
    else:
        counts = {"at_risk": 0, "resolved": 0, "late": 0, "cancelled": 0}
        for row in values:
            if row[7] != "not selected":
                counts["resolved"] += 1
            elif row[4] != "-":
                counts["at_risk"] += 1
            elif row[5] != "-":
                counts["late"] += 1
                print(row[5])
            elif row[6] != "-":
                counts["cancelled"] += 1
    return counts


def getAtRiskAccounts():
    sheet_id = "1hN6wGIlLDdkP6Z3o7XPtnmISHN70uYA8ks32s7Q3ZF4"
    range_name = "CCC-Report!A2:I"
    values = extractData(sheet_id, range_name)
    if not values:
        return "No data found."
    else:
        accounts = {"at_risk"}
        for row in values:
            if row[6] == "-" and row[5] == "-" and row[7] == "not selected":
                newAccount = accountTemplate.copy()
                newAccount["id"] = row[8]
                newAccount["product_code"] = row[0]
                newAccount["style_number"] = row[1]
                newAccount["ETA"] = row[2]
                newAccount["customer"] = row[3]
                newAccount["transportation"] = "not selected"
                newAccount["status"] = "at_risk"
                newAccount["quantity"] = row[4]
                accounts.append(newAccount)
    return accounts


def getLateAccounts():
    sheet_id = "1hN6wGIlLDdkP6Z3o7XPtnmISHN70uYA8ks32s7Q3ZF4"
    range_name = "CCC-Report!A2:I"
    values = extractData(sheet_id, range_name)
    if not values:
        return "No data found."
    else:
        accounts = []
        for row in values:
            if row[6] == "-" and row[4] == "-" and row[7] == "not selected":
                newAccount = accountTemplate.copy()
                newAccount["id"] = row[8]
                newAccount["product_code"] = row[0]
                newAccount["style_number"] = row[1]
                newAccount["ETA"] = row[2]
                newAccount["customer"] = row[3]
                newAccount["transportation"] = "not selected"
                newAccount["status"] = "Late"
                newAccount["quantity"] = row[5]
                accounts.append(newAccount)
    return accounts


def getResolvedAccounts():
    sheet_id = "1hN6wGIlLDdkP6Z3o7XPtnmISHN70uYA8ks32s7Q3ZF4"
    range_name = "CCC-Report!A2:I"
    values = extractData(sheet_id, range_name)

    if not values:
        return "No data found."
    else:
        accounts = []
        for row in values:
            if row[7] != "not selected":
                newAccount = accountTemplate.copy()
                newAccount["id"] = row[8]
                newAccount["product_code"] = row[0]
                newAccount["style_number"] = row[1]
                newAccount["ETA"] = row[2]
                newAccount["customer"] = row[3]
                newAccount["status"] = "resolved"
                newAccount["transportation"] = row[7]
                if row[4] != "-":
                    newAccount["quantity"] = row[4]
                elif row[5] != "-":
                    newAccount["quantity"] = row[5]
                else:
                    newAccount["quantity"] = row[6]
                accounts.append(newAccount)
    return accounts


def getCancelledAccounts():
    sheet_id = "1hN6wGIlLDdkP6Z3o7XPtnmISHN70uYA8ks32s7Q3ZF4"
    range_name = "CCC-Report!A2:I"
    values = extractData(sheet_id, range_name)

    if not values:
        return "No data found."
    else:
        accounts = []
        for row in values:
            if row[7] == "not selected" and row[6] != "-":
                newAccount = accountTemplate.copy()
                newAccount["id"] = row[8]
                newAccount["product_code"] = row[0]
                newAccount["style_number"] = row[1]
                newAccount["ETA"] = row[2]
                newAccount["customer"] = row[3]
                newAccount["status"] = "cancelled"
                newAccount["transportation"] = "not selected"
                newAccount["quantity"] = row[7]
                accounts.append(newAccount)
    return accounts


def getNonResolvedAccounts():
    sheet_id = "1hN6wGIlLDdkP6Z3o7XPtnmISHN70uYA8ks32s7Q3ZF4"
    range_name = "CCC-Report!A2:I"
    values = extractData(sheet_id, range_name)

    if not values:
        return "No data found."
    else:
        accounts = []
        for row in values:
            if row[7] == "not selected":
                newAccount = accountTemplate.copy()
                newAccount["id"] = row[8]
                newAccount["product_code"] = row[0]
                newAccount["style_number"] = row[1]
                newAccount["ETA"] = row[2]
                newAccount["customer"] = row[3]
                newAccount["transportation"] = row[7]
                if row[4] != "-":
                    newAccount["quantity"] = row[4]
                    newAccount["status"] = "at_risk"
                elif row[5] != "-":
                    newAccount["quantity"] = row[5]
                    newAccount["status"] = "late"
                else:
                    newAccount["quantity"] = row[6]
                    newAccount["status"] = "cancelled"
                accounts.append(newAccount)
    return accounts


def getAllAccounts():
    sheet_id = "1hN6wGIlLDdkP6Z3o7XPtnmISHN70uYA8ks32s7Q3ZF4"
    range_name = "CCC-Report!A2:I"
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
            newAccount["transportation"] = row[7]
            if row[4] != "-":
                newAccount["quantity"] = row[4]
                newAccount["status"] = "at_risk"
            elif row[5] != "-":
                newAccount["quantity"] = row[5]
                newAccount["status"] = "late"
            else:
                newAccount["quantity"] = row[6]
                newAccount["status"] = "cancelled"
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


def setTransportation(id, method):
    sheet_id = "1hN6wGIlLDdkP6Z3o7XPtnmISHN70uYA8ks32s7Q3ZF4"
    value = "=MATCH({},'CCC-Report'!I2:I, 0)".format(id)
    inputRange = "LOOKUP!A2"
    rowNum = updateSheet(sheet_id, inputRange, value)
    rowNum = int(rowNum) + 1
    updateRange = "CCC-Report!H{}".format(rowNum)
