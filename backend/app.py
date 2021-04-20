from flask import Flask, render_template
import csv
import sys
from typing import TypedDict

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


@app.route('/')
def index():
    print('This is error output', file=sys.stderr)
    sys.stdout.flush()
    app.logger.error("Hi")
    with open('../data/hospitals.csv') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            hospital: Hospital = {
                'id': row['編號'],
                'location': row['縣市'],
                'name': row['醫院名稱'],
                'department': row['科別'],
                'phone': row['電話'],
                'address': row['地址'],
            }
            app.logger.warning(hospital)
        return render_template('./index.html', )

if __name__ == '__main__':
    app.run(debug=True)
