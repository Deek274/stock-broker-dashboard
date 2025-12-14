# Stock Broker Client Web Dashboard

## Overview
This project is a live stock dashboard built using **Python (Flask + Flask-SocketIO + Eventlet)**.  
It allows multiple users to log in, subscribe to specific stock tickers (GOOG, TSLA, AMZN, META, NVDA),  
and view real-time price updates without refreshing the page.

---

## Features
- User login using email
- Subscribe to one or more supported stocks
- Real-time stock price updates (randomly generated every second)
- Multiple users supported asynchronously
- Built using WebSockets for live updates

---

## How to Run
1. Clone this repository:
   ```bash
   git clone https://github.com/<yourusername>/stock-broker-dashboard.git
   cd stock-broker-dashboard


Install dependencies:

pip install -r requirements.txt

Run the app:

python app.py

Open your browser at:

http://127.0.0.1:5000

