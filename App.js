import React, { useState, useEffect, useContext } from "react";
import { Text, View, LogBox, Button, Alert } from "react-native";
import { useAssets } from "expo-asset";
import { onAuthStateChanged } from "firebase/auth";
import { auth, logout } from "./firebase";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import SignIn from "./screens/SignIn";
import ContextWrapper from "./context/ContextWrapper";
import Context from "./context/Context";
import Profile from "./screens/Profile";
import Chats from "./screens/Chats";
import ProfileInfo from "./screens/ProfileInfo";
import UpdateProfile, { updateT } from "./screens/UpdateProfile";
import { Ionicons } from "@expo/vector-icons";
import Contacts from "./screens/Contacts";
import Chat from "./screens/Chat";
import ChatHeader from "./components/ChatHeader";
import { StatusBar } from "expo-status-bar";

// import { useNavigation } from "@react-navigation/core";

LogBox.ignoreLogs([
  "Setting a timer",
  "AsyncStorage has been extracted from react-native core and will be removed in a future release.",
]);

const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();

function App() {
  // const navigation = useNavigation();

  const [currUser, setCurrUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const {
    theme: { colors },
  } = useContext(Context);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoading(false);
      if (user) {
        setCurrUser(user);
      }
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  const outApp = () => {
    Alert.alert("Alerta", "Realmente, desea salir de la Aplicación?", [
      {
        text: "Cancelar",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          logout();
          setCurrUser(null);
        },
      },
    ]);
  };

  return (
    <NavigationContainer>
      {!currUser ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="signIn" component={SignIn} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: colors.foreground,
              shadowOpacity: 0,
              elevation: 0,
            },
            headerTintColor: colors.white,
          }}
        >
          {!currUser?.displayName && (
            <Stack.Screen
              name="profile"
              component={Profile}
              options={{ headerShown: false }}
            />
          )}

          <Stack.Screen
            name="home"
            options={{
              headerTitle: "Whatsapp",
              headerRight: () => (
                <Ionicons
                  name="log-out-outline"
                  size={29}
                  color={colors.white}
                  style={{ paddingRight: 10 }}
                  onPress={outApp}
                />
              ),
              // headerLeft: () => (
              //   <Ionicons
              //     name="ios-person-circle-outline"
              //     size={29}
              //     color={colors.white}
              //     style={{ paddingLeft: 10 }}
              //     onPress={goToUpdate}
              //   />
              // ),
            }}
            // component={Chats}
            component={Home}
          />
          <Stack.Screen
            name="contacts"
            options={{ title: "Select Contacts" }}
            component={Contacts}
          />
          <Stack.Screen
            name="chat"
            component={Chat}
            options={{ headerTitle: (props) => <ChatHeader {...props} /> }}
          />
          <Stack.Screen
            name="ProfileInfo"
            component={ProfileInfo}
            options={{ title: "Informacion de perfil" }}
          />
          <Stack.Screen
            name="UpdateProfile"
            component={UpdateProfile}
            options={{ title: "Configuración de perfil" }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
function Home() {
  const {
    theme: { colors },
  } = useContext(Context);
  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        return {
          tabBarLabel: () => {
            if (route.name === "photo") {
              return (
                <Ionicons
                  // name="person"
                  name="ios-person-circle-outline"
                  size={30}
                  color={colors.white}
                />
              );
            } else {
              return (
                <Text style={{ color: colors.white }}>
                  {route.name.toLocaleUpperCase()}
                </Text>
              );
            }
          },
          tabBarShowIcon: true,
          tabBarLabelStyle: {
            color: colors.white,
          },
          tabBarIndicatorStyle: {
            backgroundColor: colors.white,
          },
          tabBarStyle: {
            backgroundColor: colors.foreground,
          },
        };
      }}
      initialRouteName="chats"
    >
      <Tab.Screen name="photo" component={ProfileInfo} />
      <Tab.Screen name="chats" component={Chats} />
    </Tab.Navigator>
  );
}

function Main() {
  const [assets] = useAssets(
    require("./assets/icon-square.png"),
    require("./assets/chatbg.png"),
    require("./assets/user-icon.png"),
    require("./assets/welcome-img.png")
  );
  if (!assets) {
    return <Text>Loading ..</Text>;
  }
  return (
    <ContextWrapper>
      <StatusBar style="light" />
      <App />
    </ContextWrapper>
  );
}

export default Main;
