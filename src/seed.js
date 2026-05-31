import { db } from './firebase';
import { collection, getDocs, addDoc, query, limit } from 'firebase/firestore';

const countries = [
  "Canadá", "Estados Unidos", "México", "Curaçao", "Haiti", "Panamá", 
  "Marrocos", "Argélia", "Egito", "Costa do Marfim", "Tunísia", "África do Sul", 
  "Gana", "Senegal", "Cabo Verde", "Irã", "Catar", "Arábia Saudita", 
  "Coreia do Sul", "Japão", "Uzbequistão", "Jordânia", "Austrália", "Argentina", 
  "Brasil", "Uruguai", "Colômbia", "Equador", "Paraguai", "Nova Zelândia", 
  "Inglaterra", "Portugal", "Croácia", "Noruega", "França", "Alemanha", 
  "Holanda", "Áustria", "Bélgica", "Escócia", "Espanha", "Suíça", 
  "Itália", "Dinamarca", "Turquia", "Ucrânia", "Bósnia e Herzegovina", 
  "República Tcheca", "Suécia", "RD Congo", "Iraque"
];

export const seedSelecoes = async () => {
  const selecoesRef = collection(db, 'selecoes');
  const q = query(selecoesRef, limit(1));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    console.log('Seeding selecoes...');
    for (const name of countries) {
      await addDoc(selecoesRef, { name });
    }
    console.log('Seeding complete.');
  } else {
    console.log('Selecoes already seeded.');
  }
};
