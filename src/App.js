import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from 'firebase';

var config = {
    apiKey: "AIzaSyD1lk118v_l9_TEuAMoNT8t5336FNrJsW0",
    authDomain: "react-todo-e6cad.firebaseapp.com",
    databaseURL: "https://react-todo-e6cad.firebaseio.com",
    projectId: "react-todo-e6cad",
    storageBucket: "react-todo-e6cad.appspot.com",
    messagingSenderId: "471179440559"
  };
firebase.initializeApp(config);

class App extends Component {
  constructor(){
    super()
    this.state = {
      data: []
    }
  }
  componentDidMount(){
    const rootRef = firebase.database().ref();
    const childRef = rootRef.child('data');
    let arrData = [];
    childRef.on('value', snap => {
      arrData = [];
      snap.forEach(ev => {
        let obj = ev.val();
        obj.id = ev.key;
        arrData.push(obj)
        this.setState({data:arrData});
      });
        console.log(this.state.data);
    });
  }
  addItem(){
    if(this.refs.item.value !== ""){
    let fireData = {
      name:this.refs.item.value,
      isTrue:false
    }
    const rootRef = firebase.database().ref();
    rootRef.child('data').push(fireData)    
    this.refs.item.value = "";
    }else{
      console.log("Enter Item");
    }
  }
  delItem(key){
    console.log(key)
    const rootRef = firebase.database().ref();
    rootRef.child(`data/${this.state.data[key].id}`).remove();    
  }
  editItem(key){
    console.log(key);
    let data = this.state.data;
    console.log(data);
    data[key].isTrue = true;
    this.setState({data:data});
  }
  cancelEdit(key){
    console.log(key);
    let data = this.state.data;
    console.log(data);
    data[key].isTrue = false;
    this.setState({data:data});
  }
  saveItem(key){
    console.log(key)
    if(this.refs["edit" + key].value !== ""){
      let item = this.refs["edit" + key].value;
      const rootRef = firebase.database().ref();
      rootRef.child(`data/${this.state.data[key].id}`).set({name:item,isTrue:false});
      this.refs["edit" + key].value = "";
    }else{
      console.log("Enter some Item")
    }
  }
  render() {
    return (
      <div className="App">
        <header className="App-header text-center">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title text-center">Welcome to React Todo App</h1>
        </header>
        <div className = "main">
        <h2>Todo App</h2>
          <input type="text" placeholder="Title..." className = "input-tab" ref = "item" />
          <span className="add-btn" onClick={this.addItem.bind(this)}>Add Todo</span>
        </div>

        <ul className = "App-intro">
          {this.state.data.map((val, index) => {
              return <li key = {index}>{val.name}
                 <span className = "edit" onClick={this.editItem.bind(this,index)}>
                      <i className="fa fa-pencil" aria-hidden="true"></i>
                 </span>
                 <span className = "close" onClick={this.delItem.bind(this,index)}>&times;</span>   
                 <br/>
                    {this.state.data[index].isTrue ? (
                      [<div className = "row">
                          <div className = "col-6 col-md-6">
                            <input type="text" className="form-control input" placeholder="Enter text..." ref = {"edit" +index} />
                            <span className = "save" onClick = {this.saveItem.bind(this,index)} ><i className="fa fa-floppy-o" aria-hidden="true"></i></span>
                            <span className = "edit-close" onClick={this.cancelEdit.bind(this,index)}><i className="fa fa-times" aria-hidden="true"></i></span>                         
                          </div>
                      </div>
                      ]
                    ) : (
                      <span className = "edit" onClick={this.editItem.bind(this,index)}>
                      <i className="fa fa-pencil" aria-hidden="true"></i>
                    </span>
                    )}             
              </li>
            })
          }
        </ul>
      </div>
    );
  }
}

export default App;
