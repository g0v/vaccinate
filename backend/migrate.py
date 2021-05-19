from hospital_types import (
    Hospital,
    AppointmentAvailability,
)
import csv, json

# Code for combining data from the `hospitals.csv` with the
# `hospitals.json` file that was taken from the MOHW website.


def main() -> None:
    csvfile = open("../data/hospitals.csv")
    reader = csv.DictReader(csvfile)
    rows = []
    for row in reader:
        hospital_id = int(row["編號"])
        hospital: Hospital = {
            "address": row["地址"],
            "selfPaidAvailability": AppointmentAvailability.NO_DATA,
            "department": row["科別"],
            "governmentPaidAvailability": AppointmentAvailability.NO_DATA,
            "hospitalId": row["編號"],
            "location": row["縣市"],
            "name": row["醫院名稱"],
            "phone": row["電話"],
            "website": row["Website"],
        }
        rows.append(hospital)
    jsonfile = open("../data/hospitals.json")
    json_blob = json.loads(jsonfile.read())
    print(json_blob)


main()

if __name__ == "main":
    main()
