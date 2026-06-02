const { initializeApp } = require("firebase/app");
const { getFirestore, collection, doc, writeBatch } = require("firebase/firestore");

const firebaseConfig = {
  projectId: "layer3dlabs-b62a7",
  appId: "1:309669601016:web:d195821e9c5487309f650d",
  storageBucket: "layer3dlabs-b62a7.firebasestorage.app",
  apiKey: "AIzaSyD-GkQpIUO9okl4EAbGPWavCFfsfuhWi7Y",
  authDomain: "layer3dlabs-b62a7.firebaseapp.com",
  messagingSenderId: "309669601016"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const sections = [
  { name: 'Especiais e Estádios', prefix: 'FWC', count: 20 },
  { name: 'Seleção Brasileira', prefix: 'BRA', count: 20 },
  { name: 'Seleção Argentina', prefix: 'ARG', count: 20 },
  { name: 'Seleção Francesa', prefix: 'FRA', count: 20 },
  { name: 'Seleção Inglesa', prefix: 'ENG', count: 20 }
];

async function seed() {
  console.log("🚀 Iniciando o seeding do Firestore (Projeto Layer3D)...");
  const batch = writeBatch(db);
  let totalCreated = 0;

  sections.forEach(section => {
    for (let i = 1; i <= section.count; i++) {
      const codigo = `${section.prefix}-${String(i).padStart(2, '0')}`;
      let tipo = 'normal';

      if (section.prefix === 'FWC' && i <= 3) tipo = 'brilhante';
      if ((section.prefix === 'BRA' || section.prefix === 'ARG') && i === 10) tipo = 'legend';

      const stickerRef = doc(collection(db, "figurinhas"));
      batch.set(stickerRef, {
        codigo,
        secao: section.name,
        tipo,
        quantidade: 0
      });
      totalCreated++;
    }
  });

  console.log(`📦 Preparadas ${totalCreated} figurinhas para inserção.`);
  
  try {
    await batch.commit();
    console.log("✅ Sucesso! O banco de dados foi populado no projeto Layer3D.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Erro ao executar o seeding:", error);
    process.exit(1);
  }
}

seed();
