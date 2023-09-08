import React, { useState, useEffect } from "react";
import { doc, setDoc, updateDoc, getDoc, onSnapshot } from "firebase/firestore";
import db from "./firebase"; // Importa la referencia a Firestore desde tu archivo firebase.js
import "./App.css";

const options = [
  {
    id: "option1",
    imageSrc: "https://images.emojiterra.com/google/noto-emoji/unicode-15/color/512px/263a.png", // Ruta a la imagen (reemplaza con tu ruta)
  },
  {
    id: "option2",
    imageSrc: "https://images.emojiterra.com/google/noto-emoji/unicode-15/color/512px/1f60d.png", // Ruta a la imagen (reemplaza con tu ruta)
  },
  {
    id: "option3",
    imageSrc: "https://as01.epimg.net/epik/imagenes/2018/11/05/portada/1541440062_346544_1541440238_noticia_normal_recorte1.jpg", // Ruta a la imagen (reemplaza con tu ruta)
  },
  {
    id: "option4",
    imageSrc: "https://ep01.epimg.net/verne/imagenes/2017/07/26/articulo/1501057501_658002_1501059072_noticia_normal.jpg", // Ruta a la imagen (reemplaza con tu ruta)
  },
];

function App() {
  const [votes, setVotes] = useState({});

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

    return () => {
      // Detener la escucha cuando el componente se desmonta
      unsubscribe();
    };
  }, []);

  const handleVote = async (optionId) => {
    try {
      const votosDocRef = doc(db, "votos", "votos");

      // Verificar si el documento existe antes de actualizarlo
      const votosDoc = await getDoc(votosDocRef);

      if (votosDoc.exists()) {
        // El documento existe, actualízalo
        const updatedVotes = { ...votes, [optionId]: (votes[optionId] || 0) + 1 };
        await updateDoc(votosDocRef, updatedVotes);
      } else {
        // El documento no existe, créalo con valores iniciales
        const initialVotes = {};
        options.forEach((opt) => {
          initialVotes[opt.id] = opt.id === optionId ? 1 : 0;
        });
        await setDoc(votosDocRef, initialVotes);
      }
    } catch (error) {
      console.error("Error al actualizar los votos:", error);
    }
  };

  return (
    <div className="App" style={{
      backgroundImage: `url('')`,
      backgroundSize: 'cover', // Cubrir todo el fondo
      backgroundRepeat: 'no-repeat', // Evitar la repetición de la imagen
      backgroundAttachment: 'fixed', // Fijar la imagen de fondo
      backgroundPosition: 'center center', // Centrar la imagen horizontal y verticalmente
    }}>
      <div className="logos-container">
        <img  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQzPxHmR7v9kjmUqWVz_fFH0WL46T7qvvuxqGe8kpCbX00STpjHCp-b5R7vRw8QhlfgL8&usqp=CAU" alt="Logo 1" className="logo" />
        <img  src="https://i0.wp.com/www.pescar.org.ar/wp-content/uploads/2021/10/Home-Boceto-Pescar-2021-312x96-1.png?resize=312%2C96&ssl=1" alt="Logo 2" className="logo" />
      </div>
      <h1>¿Podes definir el encuentro con un Emoji?</h1>
      <h3>Elegí cual te represento: </h3>
      <div className="options">
        <div className="options-container">
          {options.map((option) => (
            <div className="option" key={option.id}>
              <button
                className="image-button"
                onClick={() => handleVote(option.id)}
              >
                <img className='emoji-vote' src={option.imageSrc} alt={`Imagen de ${option.id}`} />
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="div-votes">
      {options.map((option) => (
            <div className="option" key={option.id}>
              <span><img className='emoji-vote' src={option.imageSrc} alt={`Img votes ${option.id}`}/> {votes[option.id] || 0}</span>
            </div>
          ))}
      </div>
      <h2 style={{
        margin: '40px'
      }}>¡Muchas Gracias!</h2>
    </div>
  );
}

export default App;
