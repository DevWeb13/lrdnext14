const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

// Paramètres de la base de données
const uri =
  'mongodb+srv://vercel-admin-user-6569a92faee9571358074a4c:7wzHWvcGe7yWDQHZ@cluster0.qy0y4i9.mongodb.net/LaReponseDev?retryWrites=true&w=majority';
const dbName = 'LaReponseDev';

console.log('uri', uri);
// Informations de l'utilisateur à ajouter
const newUser = {
  name: 'NomUtilisateur',
  email: 'email@example.com',
  password: 'motdepasse123', // Ce mot de passe sera hashé avant d'être stocké
};

// Fonction pour hasher le mot de passe
async function hashPassword(password) {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

// Fonction pour ajouter un utilisateur dans la base de données
async function addUser() {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    console.log('Connecté à MongoDB');

    const db = client.db(dbName);
    const users = db.collection('users');

    // Hasher le mot de passe avant de l'insérer
    const hashedPassword = await hashPassword(newUser.password);
    const userWithHashedPassword = { ...newUser, password: hashedPassword };

    // Ajouter l'utilisateur
    const result = await users.insertOne(userWithHashedPassword);
    console.log(`Nouvel utilisateur ajouté avec l'ID : ${result.insertedId}`);
  } catch (err) {
    console.error("Erreur lors de l'ajout de l'utilisateur", err);
  } finally {
    await client.close();
  }
}

// Exécuter la fonction addUser
addUser();
