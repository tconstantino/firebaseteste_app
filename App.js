/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { 
  getDatabase,
  ref,
  set,
  remove,
  child,
  push,
  get,
  onValue,
} from "firebase/database";
import { getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  //COLOQUE AQUI A CONFIG DO SEU FIREBASE
};

import React, { Component } from 'react';
import '@react-native-community/async-storage';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  Button,
  View,
  Alert,
} from 'react-native';

  // Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const email = 'usuario-teste-firebase@gmail.com';
const senha = 'usuario12345';

class App extends Component {
  constructor(props){
    super(props);
    this.buscarDados();
    this.state = {
      pontuacao: 0
    };
  }

  cadastrarUsuario() {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, senha)
      .then((credencialUsuario) => {
        Alert.alert('Sucesso', JSON.stringify(credencialUsuario.user, null, ' '));
      })
      .catch((error) => {
        Alert.alert('Erro', `\n\n${error.code}\n\n${error.message}`);
      })
  }

  verificarUsuarioLogado() {
    const auth = getAuth();
    const user = auth.currentUser;

    if(user) {
      Alert.alert('Usuário logado', JSON.stringify(user, null, ' '));
    }
    else {
      Alert.alert('Usuário não está logado');
    }
  }

  ativarVerificacaoDeUsuarioLogado(){
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if(user) {
        Alert.alert('Usuário logado', JSON.stringify(user, null, ' '));
      }
      else {
        Alert.alert('Usuário não está logado');
      }
    });
  }

  logarUsuario() {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, senha)
      .then((user) => {
        Alert.alert('Sucesso no login', JSON.stringify(user, null, ' '));
      })
      .catch((error) => {
        Alert.alert('Erro ao deslogar', JSON.stringify(error, null, ' '));
      });
  }

  deslogarUsuario() {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        Alert.alert('Usuário deslogado com sucesso');
      })
      .catch((error) => {
        Alert.alert('Erro ao deslogar', JSON.stringify(error, null, ' '));
      });
  }

  salvarDados() {
    const funcionarios = ref(database, 'funcionarios');

    const mariana = {
      nome: 'Mariana',
      altura: '1,65',
      peso: '60kg',
      filho: {
        nome: 'João',
        altura: '1,80',
        peso: '80kg',
        filha: {
          nome: 'Joaquina',
          altura: '1,20',
          peso: '20kg',
        }
      }
    };

    const jamilton = {
      nome: 'Jamilton',
      altura: '1,75',
      peso: '70kg',
    };

    set(push(funcionarios), jamilton)
    .then((res) => {
      Alert.alert('Sucesso ao salvar');
    })
    .catch((error) => {
      Alert.alert('Erro!');
    });
    
  }

  excluirDados() {
    const funcionarios = ref(database, 'funcionarios');
    remove(funcionarios);
    
  }

  buscarDados() {
    const pontuacaoRef = ref(database, 'pontuacao');
    onValue(pontuacaoRef, (snapshot) => {
      const pontos = snapshot.val();
     this.setState({ pontuacao: pontos });
    })
  }

  render() {
    return (
      <SafeAreaView>
        <Text style={styles.titulo}>Firebase Teste App</Text>
        <View style={styles.botao}>
          <Button onPress={this.buscarDados.bind(this)} title='Buscar dados' />
        </View>
        <View style={styles.botao}>
          <Button onPress={this.salvarDados} title='Salvar dados' />
        </View>
        <View style={styles.botao}>
          <Button onPress={this.excluirDados} title='Excluir dados' />
        </View>
        <Text style={styles.resultado}>Pontuação: {this.state.pontuacao}</Text>
        <View style={styles.botao}>
          <Button onPress={this.cadastrarUsuario} title='Cadastrar usuário' />
        </View>
        <View style={styles.botao}>
          <Button onPress={this.verificarUsuarioLogado} title='Verificar usuário logado' />
        </View>
        <View style={styles.botao}>
          <Button onPress={this.logarUsuario} title='Logar usuário' />
        </View>
        <View style={styles.botao}>
          <Button onPress={this.deslogarUsuario} title='Deslogar usuário' />
        </View>
      </SafeAreaView>
    );
  };
}

const styles = StyleSheet.create({
  botao: {
    margin: 10,
    borderWidth: 0.5,
    borderColor: '#007AFF',
  },
  titulo: {
    fontSize: 35,
    fontWeight: 'bold',
    shadowColor: 'grey',
    shadowOpacity: 0.5,
    margin: 20,
  },
  resultado: {
    fontSize: 30,
    fontWeight: 'bold',
    margin: 20,
    shadowColor: 'grey',
    shadowOpacity: 0.5,
  }
});

export default App;
