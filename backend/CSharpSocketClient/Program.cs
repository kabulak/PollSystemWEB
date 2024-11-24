using System;
using Quobject.SocketIoClientDotNet.Client;

class Program
{
    static void Main(string[] args)
    {
        // Connect to the Socket.IO server
        var socket = IO.Socket("http://localhost:3000"); // Replace with your server URL

        // Listen for connection
        socket.On(Socket.EVENT_CONNECT, () =>
        {
            Console.WriteLine("Connected to server!");

            // Emit an event to the server
            socket.Emit("message", "Hello, Server!");
        });

        // Listen for a specific event from the server
        socket.On("message", (data) =>
        {
            Console.WriteLine("Message from server: " + data);
        });

        // Keep the console application running
        Console.ReadLine();
    }
}
