from __future__ import print_function
import pickle
import os.path
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request

# If modifying these scopes, delete the file token.pickle.
SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"]

# The ID and range of a sample spreadsheet.
# SAMPLE_SPREADSHEET_ID = "1hN6wGIlLDdkP6Z3o7XPtnmISHN70uYA8ks32s7Q3ZF4"
# SAMPLE_RANGE_NAME = "CCC-Report!A2:D"


def main():
    """Shows basic usage of the Sheets API.
    Prints values from a sample spreadsheet.
    """
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

    # Call the Sheets API
    sheet = service.spreadsheets()
    result = (
        sheet.values()
        .get(spreadsheetId=SAMPLE_SPREADSHEET_ID, range=SAMPLE_RANGE_NAME)
        .execute()
    )
    values = result.get("values", [])

    if not values:
        print("No data found.")
    else:
        print("Name, Major:")
        for row in values:
            print(row)


def extractData(sheet_id, range_name):
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

    # Call the Sheets API
    sheet = service.spreadsheets()
    result = sheet.values().get(spreadsheetId=sheet_id, range=range_name).execute()
    return result.get("values", [])


def getPriorityAccounts():
    sheet_id = "1hN6wGIlLDdkP6Z3o7XPtnmISHN70uYA8ks32s7Q3ZF4"
    range_name = "CCC-Report!A2:H"
    values = extractData(sheet_id, range_name)
    newAccount = {
        "product_code": "",
        "style_number": "",
        "ETA": "",
        "customer": "",
        "type": "",
        "quantity": "",
    }
    if not values:
        return "No data found."
    else:
        priorityAccounts = []
        for row in values:
            if row[6] == "-" and row[7] == "not selected":
                newAccount["product_code"] = row[0]
                newAccount["style_number"] = row[1]
                newAccount["ETA"] = row[2]
                newAccount["customer"] = row[3]
                if row[4] == "-":
                    newAccount["type"] = "At Risk"
                    newAccount["quantity"] = row[5]
                else:
                    newAccount["type"] = "Late"
                    newAccount["quantity"] = row[6]
                priorityAccounts.append(newAccount)
    return priorityAccounts


def getResolvedAccounts():
    sheet_id = "1hN6wGIlLDdkP6Z3o7XPtnmISHN70uYA8ks32s7Q3ZF4"
    range_name = "CCC-Report!A2:H"
    values = extractData(sheet_id, range_name)
    newAccount = {
        "product_code": "",
        "style_number": "",
        "ETA": "",
        "customer": "",
        "transportation_type": "",
        "quantity": "",
    }
    if not values:
        return "No data found."
    else:
        priorityAccounts = []
        for row in values:
            if row[7] != "not selected":
                newAccount["product_code"] = row[0]
                newAccount["style_number"] = row[1]
                newAccount["ETA"] = row[2]
                newAccount["customer"] = row[3]
                newAccount["transportation_type"] = row[7]
                if row[4] != "-":
                    newAccount["quantity"] = row[4]
                elif row[5] != "-":
                    newAccount["quantity"] = row[5]
                else:
                    newAccount["quantity"] = row[6]
                priorityAccounts.append(newAccount)
    return priorityAccounts


# if __name__ == "__main__":
#     main()
