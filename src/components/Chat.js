// ChatComponent.js
import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const ChatComponent = ({ userId }) => {
  const [message, setMessage] = useState("");
  const [receivedMessages, setReceivedMessages] = useState([]);

  // useEffect(() => {
  //   // Ouça mensagens recebidas
  //   socket.on("receiveMessage", ({ userId, message }) => {
  //     setReceivedMessages((prevMessages) => [
  //       ...prevMessages,
  //       { userId, message },
  //     ]);
  //   });

  //   return () => {
  //     // Desconectar o socket quando o componente for desmontado
  //     socket.disconnect();
  //   };
  // }, []); // Executado apenas uma vez no início

  // const sendMessage = () => {
  //   if (message.trim() !== "") {
  //     socket.emit("sendMessage", { userId, message }, (error) => {
  //       if (error) {
  //         console.error("Erro ao enviar mensagem: ", error);
  //       }
  //     });

  //     // Limpar o campo de mensagem
  //     setMessage("");
  //   }
  // };

  return (
    <div>
      <div
        style={{
          height: "200px",
          overflowY: "scroll",
          border: "1px solid #ccc",
          marginBottom: "10px",
        }}
      >
        {receivedMessages.map((msg, index) => (
          <div key={index}>{`Usuário ${msg.userId}: ${msg.message}`}</div>
        ))}
      </div>
      <div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Digite sua mensagem..."
        />
        {/* <button onClick={sendMessage}>Enviar</button> */}
      </div>
    </div>
  );
};

export default ChatComponent;
