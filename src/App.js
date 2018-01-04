import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props)

    this.state = {turn:{id:null}, user:{email: null, displayName: null, uid: null}, gameId: null}
    this.gameId = '1234'
    this.bid_type = [{name: "open"}, {name: "closed"}, {name: "first"}, {name: "fixed"}, {name: "double"}]
    this.artists =  [{name: "artist 1"}, {name: "artist 2"}, {name: "artist 3"}, {name: "artist 4"}, {name: "artist 5"}]
    this.cards =  []
    this.number_cards = 5
    this.hand_cards = []
    this.current_card = {name: ''}

    this.artists.forEach((artist,index) => {
        this.bid_type.forEach(btype => {
            this.cards.push({name: `card ${index++}`, artist: artist.name, bid_type: btype.name})
        })
    })
    this.gameState = 'choose'



    console.log(this.hand_cards,this.cards.length)
    /*cards = [{name: null, artist: "", bid_type: null, double_card: null]
    users = [{displayName: null, email: null, uid: null, hand_cards: [], own_cards: [], money: 0, first: false}]
    seasons = [{first: null, second: null, third: null, fourth: null}]
    current_bid = {card: {name: null, artist: "", bid_type: null, double_card: null}, price: 0, user: {}, owner: {}}
    game = {id: null, users: [], seasons: [], state: null, current_bid: current_bid}
    */



  }
  logOut() {
    this.props.firebase.auth().signOut().then(function() {
      this.setState({user:{email: null, displayName: null, uid: null}})
    }).catch(function(error) {
      // An error happened.
    });
  }
  logIn() {
    let firebase = this.props.firebase
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().useDeviceLanguage();

    firebase.auth().signInWithPopup(provider).then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      //var token = result.credential.accessToken;
      //dddasdasdasd The signed-in user info.
      var user = result.user;
      // ...

      //console.log(token, user)
      //consoel.log(user.displayName)
      /*var user = firebase.auth().currentUser;
      var name, email, photoUrl, uid, emailVerified;

      if (user != null) {
        name = user.displayName;
        email = user.email;
        photoUrl = user.photoURL;
        emailVerified = user.emailVerified;
        uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
                         // this value to authenticate with your backend server, if
                         // you have one. Use User.getToken() instead.
      }*/
      let {uid, displayName, email} = {...user}
      this.setState({user: {uid, displayName, email}})
      //this.handleUpdates()

    }).catch(function(error) {
      // Handle Errors here.
      //var errorCode = error.code;
      //var errorMessage = error.message;
      // The email of the user's account used.
      //var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      //var credential = error.credential;
      //console.log(error)
    });
  }
handleUpdates() {
  console.log('handleUpdates')
  let gameId = this.gameId
  var starCountRef = this.props.firebase.database().ref('game/' + gameId );
    starCountRef.on('value', (snapshot) => {
    let d = {...snapshot.val()}
    console.log(d)
    if (d) {
      this.setState(d)
    }
    //updateStarCount(postElement, snapshot.val());
  });
}
componentDidMount() {
  this.props.firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    this.handleUpdates()
  }
});

//   if (this.props.firebase.auth().currentUser) {

  // }
}
  connectGame(gameId){
    let user = this.props.firebase.auth().currentUser
    if (!user) {
     console.log('must log before')
    } else {
      let users = [user]
      let game = {id: gameId, users: [user.email], seasons: [], state: 'wait', turn: [],  create_date: new Date(), owner: user.email}
      this.props.firebase.database().ref('game/' + gameId).set(game)
    }
    //this.giveCards(this.number_cards)
  }

  handlePlayCard(index, event) {

    this.current_card = this.hand_cards.splice(index,1)[0]
    this.forceUpdate()
  }

  giveCards(num) {
    let hand = []
    let random_cards = Array(num).fill(null).map(()=>Math.floor(Math.random()*this.cards.length-1))
    random_cards.forEach((card) => {
          hand.push(this.cards.splice(card,1)[0])
    })
    return hand
  }

  generateUID() {
    var firstPart = (Math.random() * 46656) | 0
    var secondPart = (Math.random() * 46656) | 0
    firstPart = ("000" + firstPart.toString(36)).slice(-3)
    secondPart = ("000" + secondPart.toString(36)).slice(-3)
    //return firstPart + secondPart;
    return '1234'
  }

  logInLogOut() {
    return (this.state.user.uid) ? <button onClick={this.logOut.bind(this)}>Log Out: ({this.state.user.email})</button> : <button onClick={this.logIn.bind(this)}>Log in</button>
  }

  handleJoinGame (event) {
    let gameId = event.currentTarget[2].value
    this.connectGame(gameId)
  }
  handleCreateNew() {
    let gameId = this.generateUID()
    this.connectGame(gameId)
  }

  render() {
    console.log('render')
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        {(this.gameState == 'choose') ?
        <div>
          {this.logInLogOut()}
          <form onSubmit={this.handleJoinGame.bind(this)}>
          <button onClick={this.handleCreateNew.bind(this)}>Create New</button>
          <input type="submit" value="Join Existing" />
          <label>
            GameID:
            <input type="text" name="gid" defaultValue="1234"/>
          </label>
        </form>
        </div> :
        <div>

          <div>Turn: {this.gameId} - {this.state.turn.id} - {this.state.turn.user}</div>
          {this.hand_cards.map((card,index) => <button key={index} onClick={this.handlePlayCard.bind(this,index)}>{card.name}</button>)}
          <div>
          current card: {this.current_card.name}
          </div>
        </div>
      }
      </div>

    );
  }
}

export default App;
