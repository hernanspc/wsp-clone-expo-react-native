import { collection, onSnapshot, query, where } from "@firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { View, Text, Button, Alert } from "react-native";
import GlobalContext from "../context/Context";
import { auth, db, logout } from "../firebase";
import ContactsFloatingIcon from "../components/ContactsFloatingIcon";
import ListItem from "../components/ListItem";
import useContacts from "../hooks/useHooks";
export default function Chats() {
  const { currentUser } = auth;
  console.log("currentUser ", currentUser);

  const { rooms, setRooms, setUnfilteredRooms } = useContext(GlobalContext);

  const [photos, setphotos] = useState(null);
  const contacts = useContacts();
  const chatsQuery = query(
    collection(db, "rooms"),
    where("participantsArray", "array-contains", currentUser?.email)
  );

  useEffect(() => {
    onSnapshot(
      query(collection(db, "users")),
      //   where("usersMatched", "array-contains", user.uid), //esto nunca va pasa
      (snapshot) => {
        setphotos(
          snapshot.docs
            .filter((doc) => doc.email !== currentUser.email)
            .map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
        );
      }
    );
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(chatsQuery, (querySnapshot) => {
      const parsedChats = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        userB: doc
          .data()
          .participants.find((p) => p.email !== currentUser?.email),
      }));
      setUnfilteredRooms(parsedChats);
      setRooms(parsedChats.filter((doc) => doc.lastMessage));
    });
    return () => unsubscribe();
  }, []);

  function getUserB(user, contacts) {
    //filtro del user con contactos
    const userContact = contacts.find((c) => c.email === user.email);
    if (userContact && userContact.contactName) {
      return { ...user, contactName: userContact.contactName, photoURL: reloj };
    }

    return user;
  }

  console.log("usersphotoURL: ", photos);
  return (
    <View style={{ flex: 1, padding: 5, paddingRight: 10 }}>
      {rooms.map((room, key) => (
        <ListItem
          type="chat"
          description={room.lastMessage.text}
          key={room.id}
          room={room}
          // image={photos[key]?.photoURL}
          time={room.lastMessage.createdAt}
          user={getUserB(room.userB, contacts)}
        />
        // console.log('key, ',photos[key].photoURL)
      ))}
      <ContactsFloatingIcon />
    </View>
  );
}
