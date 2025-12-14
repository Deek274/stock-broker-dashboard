from flask import Flask, render_template
from flask_socketio import SocketIO
import random
import threading
import eventlet

eventlet.monkey_patch()

app = Flask(__name__)
app.config["SECRET_KEY"] = "secret!"
socketio = SocketIO(app, cors_allowed_origins="*", async_mode="eventlet")

STOCKS = ["GOOG", "TSLA", "AMZN", "META", "NVDA"]
stock_prices = {}
thread = None
thread_lock = threading.Lock()


def init_prices():
    for s in STOCKS:
        stock_prices[s] = round(random.uniform(100, 1000), 2)


def update_prices_background():
    while True:
        for s in STOCKS:
            change = random.uniform(-5, 5)
            stock_prices[s] = round(max(1, stock_prices[s] + change), 2)
        socketio.emit("price_update", stock_prices)
        socketio.sleep(1)


@app.route("/")
def index():
    return render_template("index.html", stocks=STOCKS)


@socketio.on("connect")
def handle_connect():
    global thread
    with thread_lock:
        if thread is None:
            init_prices()
            thread = socketio.start_background_task(update_prices_background)
    print("Client connected")


@socketio.on("disconnect")
def handle_disconnect():
    print("Client disconnected")


if __name__ == "__main__":
    print("Starting Flask-SocketIO server with eventlet...")
    socketio.run(app, host="0.0.0.0", port=5000, debug=True)
