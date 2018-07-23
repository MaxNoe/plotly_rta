from flask import Flask, render_template, jsonify
from fact.io import read_data
import numpy as np

np.random.seed(0)


events = read_data('./data/crab_gammas_dl3.hdf5', key='events')

app = Flask(__name__)

keys = ['theta_deg'] + [f'theta_deg_off_{i}' for i in range(1, 6)]


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/events')
def get_events():
    return jsonify(events.sample(100).query(
        ' or '.join(f'{key} < {np.sqrt(0.3)}' for key in keys)
    ).to_dict(orient='records'))


if __name__ == '__main__':
    app.run()
