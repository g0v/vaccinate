from flask import Flask, render_template
import csv
import sys
from typing import TypedDict
import requests

app = Flask(
    __name__,
    static_url_path='',
    static_folder='../dist',
    template_folder='../dist',
)


class Hospital(TypedDict):
    id: int
    location: str
    name: str
    department: str
    phone: str
    address: str
    website: str


@app.route('/')
def index():
    r = requests.get('https://reg.ntuh.gov.tw/WebAdministration/VaccineRegPublic.aspx?Hosp=T0&Reg=', verify='../data/ntuh-gov-tw-chain.pem')
    app.logger.warn(r)
    sys.stdout.flush()
    print('This is error output', file=sys.stderr)
    sys.stdout.flush()
    app.logger.error("Hi")
    with open('../data/hospitals.csv') as csvfile:
        reader = csv.DictReader(csvfile)
        rows = []
        for row in reader:
            website = None
            id = row['編號']
            hospital: Hospital = {
                'id': row['編號'],
                'location': row['縣市'],
                'name': row['醫院名稱'],
                'department': row['科別'],
                'phone': row['電話'],
                'address': row['地址'],
                'website': row['Website'],
            }
            rows.append(hospital)
            app.logger.warning(hospital)
        return render_template('./index.html', rows=rows)

if __name__ == '__main__':
    app.run(debug=True)
