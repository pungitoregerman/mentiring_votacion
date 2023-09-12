import React, { useState, useEffect } from "react";
import { doc, setDoc, updateDoc, getDoc, onSnapshot } from "firebase/firestore";
import db from "./firebase"; // Importa la referencia a Firestore desde tu archivo firebase.js
import "./App.css";
import Swal from 'sweetalert2'


const options = [
  {
    id: "option1",
    imageSrc: "./img/enjoys.png",
  },
  {
    id: "option2",
    imageSrc: "./img/enj.png", 
  },
  {
    id: "option3",
    imageSrc: "./img/lents.png", 
  },
  {
    id: "option4",
    imageSrc: "./img/silent.png", 
  },
];

const optionColors = ["#06507a", "#078f3b", "#470466", "#af0505"];

function App() {
  const [votes, setVotes] = useState({});
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    const votosDocRef = doc(db, "votos", "votos");

    // Escuchar los cambios en el documento en tiempo real
    const unsubscribe = onSnapshot(votosDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        setVotes(docSnapshot.data());
      } else {
        console.log("El documento 'votos' no existe en Firestore.");
      }
    });

    // Verificar si el usuario ha votado anteriormente
    const hasVotedPreviously = localStorage.getItem("hasVoted");
    if (hasVotedPreviously) {
      setHasVoted(true);
    }

    return () => {
      // Detener la escucha cuando el componente se desmonta
      unsubscribe();
    };
  }, []);

  const handleVote = async (optionId) => {
    if (hasVoted) {
      Swal.fire(
        'Ya votaste, no podes votar de nuevo!',
        '',
        'warning'
      )
      return;
    }

    try {
      const votosDocRef = doc(db, "votos", "votos");

      // Verificar si el documento existe antes de actualizarlo
      const votosDoc = await getDoc(votosDocRef);

      if (votosDoc.exists()) {
        // El documento existe, actualízalo
        const updatedVotes = { ...votes, [optionId]: (votes[optionId] || 0) + 1 };
        await updateDoc(votosDocRef, updatedVotes);

        // Marcar al usuario como que ya ha votado
        localStorage.setItem("hasVoted", "true");
        setHasVoted(true);
      } else {
        // El documento no existe, créalo con valores iniciales
        const initialVotes = {};
        options.forEach((opt) => {
          initialVotes[opt.id] = opt.id === optionId ? 1 : 0;
        });
        await setDoc(votosDocRef, initialVotes);
        // Marcar al usuario como que ya ha votado
        localStorage.setItem("hasVoted", "true");
        setHasVoted(true);
      }
    } catch (error) {
      console.error("Error al actualizar los votos:", error);
    }

    Swal.fire(
      'Gracias por tu voto!',
      '',
      'success'
    )
  };
  
  return (
    <div className="App" style={{
      backgroundImage: `url('https://img.freepik.com/vector-gratis/fondo-abstracto-acuarela_220290-24.jpg')`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat', 
      backgroundAttachment: 'fixed', 
      backgroundPosition: 'center center',
    }}>
     
      <h1>¿Podés definir el encuentro con un Emoji?</h1>
      <h3>Clickea cuál te represento: </h3>
      <div className="options">
        <div className="options-container">
          {options.map((option,index) => (
            <div className="option" key={option.id}>
              <button
                className="image-button"
                onClick={() => handleVote(option.id)}
                style={{
                  backgroundColor: optionColors[index], 
                borderRadius: '30px',
                }}
              >
                <img className='emoji-vote' src={option.imageSrc} alt={`Imagen de ${option.id}`} />
                <p className="cantidad-votos" style={{ fontSize: '14px', color: 'white', marginTop: '5px' }}>{votes[option.id] || 0}</p>
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="logos-container">
        <img  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQzPxHmR7v9kjmUqWVz_fFH0WL46T7qvvuxqGe8kpCbX00STpjHCp-b5R7vRw8QhlfgL8&usqp=CAU" alt="Logo 1" className="logo" />
        <img  src="https://i0.wp.com/www.pescar.org.ar/wp-content/uploads/2021/10/Home-Boceto-Pescar-2021-312x96-1.png?resize=312%2C96&ssl=1" alt="Logo 2" className="logo" />
      </div>
    </div>
  );
}

export default App;
