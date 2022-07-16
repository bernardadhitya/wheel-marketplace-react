import firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/auth';
import { firebaseConfig } from './env';
import Moment from 'moment';

firebase.initializeApp(firebaseConfig);
export const fireAuth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage().ref();

export const signUp = async (email, password, userData) => {
  fireAuth.createUserWithEmailAndPassword(email, password)
    .then(async data => {
      userData = await createUser({...userData, email});
      console.log('SUCCESS SIGN UP');
    })
    .catch(error => console.log(error));
  return userData;
}

export const signIn = async (email, password) => {
  let userData = {};
  fireAuth.signInWithEmailAndPassword(email, password)
    .then(async () => {
      userData = await getUserByEmail(email);
      console.log('SUCCESS SIGN IN');
    })
    .catch(error => console.log('FAILED SIGNIN'))
  return userData;
}

export const signOut = async () => {
  fireAuth.signOut();
}

export const fetchCurrentUser = async () => {
  const isLoggedIn = fireAuth.currentUser;
  return !!isLoggedIn ? await getUserByEmail(isLoggedIn.email) : null;
}

export const getUserByEmail = async (email) => {
  const response = await db.collection('users').where('email', '==', email).get();
  const responseId = response.docs[0].id;
  const responseData = response.docs[0].data();
  return { userId: responseId, ...responseData};
}

export const getUserById = async (userId) => {
  const response = await db.collection('users').doc(userId).get();
  const responseId = response.id;
  const responseData = response.data();
  return { userId: responseId, ...responseData};
}

export const createUser = async (userData) => {
  const { name, phone, email } = userData;
  await db.collection('users').add({
    name,
    email,
    phone,
  });
}

export const getAllProducts = async () => {
  const response = await db.collection('items').get();
  const data = response.docs.map(doc => {
    const responseId = doc.id;
    const responseData = doc.data();
    return { item_id: responseId, ...responseData }
  });
  return data;
}

export const getProductsByUserId = async (userId) => {
  const response = await db.collection('items').where('seller_id', '==', userId).get();
  const data = response.docs.map(doc => {
    const responseId = doc.id;
    const responseData = doc.data();
    return { item_id: responseId, ...responseData }
  });
  return data;
}

export const getProductsByTitle = async (searchString) => {
  let allProducts = await getAllProducts();
  const data = allProducts.filter(product => {
    const { title, diameter, offset, width } = product;
    const fullTitle = `${title} ${diameter}x${width}" ET-${offset}`;
    return fullTitle.toLowerCase().includes(searchString.toLowerCase());
  });
  return data;
}

export const getProductById = async (productId) => {
  const response = await db.collection('items').doc(productId).get();
  const responseId = response.id;
  const responseData = response.data();
  return { productId: responseId, ...responseData};
}

export const getAllProductsPaginated =  async (carType) => {
  const products = await getAllProducts();
  let filteredProducts = products
  if (carType !== "None"){
    filteredProducts = filteredProducts.filter(product => product.carType === carType);
  }
  let paginatedProducts = []
  while (filteredProducts.length > 0){
    paginatedProducts.push(filteredProducts.splice(0,20));
  }
  return paginatedProducts;
}

export const getProductsByTitlePaginated =  async (searchString, carType) => {
  const products = await getProductsByTitle(searchString);
  let filteredProducts = products
  if (carType !== "None"){
    filteredProducts = filteredProducts.filter(product => product.carType === carType);
  }
  let paginatedProducts = []
  while (filteredProducts.length > 0){
    paginatedProducts.push(filteredProducts.splice(0,20));
  }
  return paginatedProducts;
}

export const createProduct = async (productData, image) => {
  const { seller_id, title, diameter, width, offset, price, filePath, carType, description } = productData;

  const item = await db.collection('items').add({
    seller_id,
    title,
    diameter,
    width,
    offset,
    price,
    filePath,
    carType,
    description,
  });
  await uploadImage(image, item);

}

export const deleteProductById = async (productId) => {
  db.collection("items").doc(productId).delete()
}

export const uploadImage = async (file, item) => {
  storage.child(`/${item.id}/${file.name}`).put(file);
}

export const getImageByItemId = async (itemId) => {
  try {
    const doc = await db.collection('items').doc(itemId).get();
    if (doc.data().filePath === '') return '';
    const fpath = '/' + itemId + '/' + doc.data().filePath;
    const response = await storage.child(fpath).getDownloadURL().then((url) => {
      return url;
    }).catch(function (error) {
      return '';
    });
    return response;
  } catch (error) {
    return '';
  }
}

export const getChats = async (senderId, receiverId) => {
  console.log("sender id:", senderId)
  console.log("receiver id:", receiverId)

  const response = await db.collection('chats')
    .orderBy('timestamp')
    .get();

  const data = response.docs.map(doc => {
    const responseId = doc.id;
    const responseData = doc.data();
    return { chat_id: responseId, ...responseData }
  });

  const chatData = data.filter((item) => {
    if (item.senderId === senderId){
      if (item.receiverId === receiverId){
        return true
      }
    } else if (item.senderId === receiverId){
      if (item.receiverId === senderId){
        return true
      }
    } else {
      return false
    }
  }) // ????
  console.log('CHAT DATA ->', chatData)
  return chatData;
}

export const sendChat = async (chatData) => {
  const { senderId, receiverId, senderName, receiverName, message } = chatData;
  const timestamp = new Date()
  const chat = await db.collection('chats').add({
    senderId, receiverId, senderName, receiverName, message, timestamp
  });
  return chat
}

export const getChatList = async (userId) => {
  const response_sender = await db.collection('chats')
    .where('senderId', '==', userId)
    .get();
  const response_receiver = await db.collection('chats')
    .where('receiverId', '==', userId)
    .get();
  const data_sender = response_sender.docs.map(doc => {
    const responseId = doc.id;
    const responseData = doc.data();
    return { chat_id: responseId, ...responseData }
  });
  const data_receiver = response_receiver.docs.map(doc => {
    const responseId = doc.id;
    const responseData = doc.data();
    return { chat_id: responseId, ...responseData }
  });
  const data = [...data_sender, ...data_receiver];

  // const result = data.map((chatItem) => {
  //   const name = chatItem.senderId === userId ? chatItem.senderName : chatItem.receiverName
  //   return {...chatItem, name}
  // })

  console.log("data from weird query:", data)

  const result = []
  const ids = []
  data.forEach(chatItem => {
    console.log(chatItem)
    const { senderId, receiverId, senderName, receiverName } = chatItem;
    if (!(ids.includes(senderId)) && senderId !== userId){
      result.push({id: senderId, name: senderName})
      ids.push(senderId)
    }
    if (!(ids.includes(receiverId)) && receiverId !== userId){
      result.push({id: receiverId, name: receiverName})
      ids.push(receiverId)
    }
  })
  return result
}
