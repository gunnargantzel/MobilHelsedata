#!/usr/bin/env python3
"""
Enkel HTTP-server for å teste PWA-appen lokalt
"""

import http.server
import socketserver
import webbrowser
import os
import sys
from pathlib import Path

PORT = 8000

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Legg til CORS-headers for PWA-funksjonalitet
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        # Legg til MIME-type for manifest.json
        if self.path.endswith('.json'):
            self.send_header('Content-Type', 'application/json')
        super().end_headers()

def main():
    # Sjekk om vi er i riktig mappe
    if not Path('index.html').exists():
        print("Feil: index.html ikke funnet. Kjør scriptet fra prosjektmappen.")
        sys.exit(1)
    
    # Start server
    with socketserver.TCPServer(("", PORT), CustomHTTPRequestHandler) as httpd:
        print(f"🚀 Server startet på http://localhost:{PORT}")
        print(f"📱 For iPhone-testing: http://[DIN_IP]:{PORT}")
        print("💡 Trykk Ctrl+C for å stoppe serveren")
        
        # Åpne nettleser automatisk
        try:
            webbrowser.open(f'http://localhost:{PORT}')
        except:
            pass
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n👋 Server stoppet")

if __name__ == "__main__":
    main()
