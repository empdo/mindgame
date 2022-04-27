from dataclasses import dataclass
import threading
import socket

HEADER = 64
PORT = 5050
SERVER = "192.168.0.156"
ADDR = (SERVER, PORT)
FORMAT = 'utf-8'
DISCONNECT_MESSAGE = "DISCONNECT"

server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.bind(ADDR)

@dataclass
class User:
    name: str
    id: int

class Lobby:
    def __init__(self, id):
        pass

class Main():
    def __init__(self) -> None:
        server.listen()
        print("listening for connections...")
        while True:
            conn, addr = server.accept()
            thread = threading.Thread(target=self.handle_client, args=(conn, addr))
            thread.start()
            print(f"connection set to {addr}")

    def handle_client(self, conn, addr):
        #listen for request to connect to lobby, create lobby if needed
        pass

    def create_lobby(self, id):
        pass

main = Main()
