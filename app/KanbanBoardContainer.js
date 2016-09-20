import React, { Component } from 'react';
import KanbanBoard from './KanbanBoard';
import update from 'react-addons-update';
//폴리필
import 'whatwg-fetch';

const API_URL = 'http://kanbanapi.pro-react.com';
const API_HEADERS = {
  'content-type': 'application/json',
  'Authorization': 'any-string-you-like'
}

class KanbanBoardContainer extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      cards: []
    };
  }

  componentDidMount() {
    fetch(API_URL + '/cards', {headers: API_HEADERS})
    .then((response) => response.json())
    .then((responseData) => {
      this.setState({cards: responseData});
      window.state = this.state;
    })
    .catch((error) => {
      console.log('Error fetching and parsing data', error);
    });
  }

  addTask(cardId, taskName) {
    //낙관적인 UI변경을 되돌려야 하는 경우를 대비해 변경하기 전 원래상태에 대한 참조를 저장한다.
    let prevState = this.state;
    //카드의 인덱스를 찾는다.
    let cardIndex = this.state.cards.findIndex((card) => card.id === cardId);

    //지정된 이름과 임시 ID로 새로운 태스크를 생성한다.
    let newTask = {id: Date.now(), name:taskName, done:false};

    //새로운 객체를 생성하고 태스크의 배열로 새로운 태스크를푸시한다.
    let nextState = update(this.state.cards, {
      [cardIndex]: {
        tasks: {$push: [newTask]}
      }
    });

    //변경된 객체로 컴포넌트 상태를 설정한다.
    this.setState({cards: nextState});

    //API를 호출해 서버에 해당 태스크를 추가한다.
    fetch(`${API_URL}/cards/${cardId}/tasks`, {
      method: 'post',
      headers: API_HEADERS,
      body: JSON.stringify(newTask)
    })
    .then((response) => {
      if(response.ok) {
        return response.json()
      } else {
        //서버 응답이 정상이 아닌경우
        //오류를 생성해 UI에 대한 낙관적 변경을 원래대로 되돌린다.
        throw new Error("Server response wasn't OK");
      }
    })
    .then((responseData) => {
      //서버가 새로운 태스크를 추가하는 데 이용한
      //확정 ID를 반환하면 리액트에서 ID를 업데이트한다
      newTask.id = responseData.id;
      this.setState({cards: nextState});
    })
    .catch((error) => {
      this.setState(prevState);
    })
  }

  deleteTask(cardId, taskId, taskIndex) {
    let prevState = this.state;
    //카드의 인덱스를 찾는다.
    let cardIndex = this.state.cards.findIndex((card) => card.id === cardId);

    //해당 태스크를 제외한 새로운 객체를 생성한다.
    let nextState = update(this.state.cards, {
      [cardIndex]: {
        tasks: {$splice: [[taskIndex, 1]]}
      }
    })

    //변경된 객체로 컴포넌트 상태를 설정한다.
    this.setState({cards: nextState});

    //API를 호출해 서버에서 해당 태스크를 제거한다.
    fetch(`${API_URL}/cards/${cardId}/tasks/${taskId}`, {
      method: 'delete',
      headers: API_HEADERS
    })
    .then((response) => {
      if(!response.ok) {
        throw new Error("Server response wasn't OK");
      }
    })
    .catch((error) => {
      console.error("Fetch error:", error);
      this.setState(prevState);
    })
  }

  toggleTask(cardId, taskId, taskIndex) {
    let prevState = this.state;
    //카드의 인덱스를 찾는다.
    let cardIndex = this.state.cards.findIndex((card) => card.id === cardId);
    //태스크의 'done'값에 대한 참조를 저장한다.
    let newDoneValue;
    //$apply 명령을 이용해 done값을 현재와 반대로 변경한다.
    let nextState = update(this.state.cards, {
      [cardIndex]: {
        tasks: {
          [taskIndex]: {
            done: { $apply: (done) => {
              newDoneValue = !done
              return newDoneValue;
            }}
          }
        }
      }
    })
    //변경된 객체로 컴포넌트 상태를 설정한다.
    this.setState({card: nextState});

    //API를 호출해 서버에서 해당 태스크를 토글한다.
    fetch(`${API_URL}/cards/${cardId}/tasks/${taskId}`, {
      method: 'put',
      headers: API_HEADERS,
      body: JSON.stringify({done: newDoneValue})
    })
    .then((response) => {
      if(!response.ok) {
        throw new Error("Server response wasn't OK")
      }
    })
    .catch((error) => {
      console.error("Fetch error:", error);
      this.setState(prevState);
    })
  }

  render() {
    return (
      <KanbanBoard cards={this.state.cards}
          taskCallbacks={{
            toggle: this.toggleTask.bind(this),
            delete: this.deleteTask.bind(this),
            add: this.addTask.bind(this)
          }} />
    )
  }
}

export default KanbanBoardContainer;
