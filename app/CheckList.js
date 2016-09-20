import React, { Component, PropTypes } from 'react';
import styles from './style.css';

class CheckList extends Component {
  checkInputKeyPress(evt) {
    if (evt.key === 'Enter') {
      this.props.taskCallbacks.add(this.props.cardId, evt.target.value);
      evt.target.value= '';
    }
  }
  render() {
    let tasks = this.props.tasks.map((task, taskIndex) => (
      <li key={task.id} className={styles.checklist__task}>
        <input type="checkbox" defaultChecked={task.done} onChange={
          this.props.taskCallbacks.toggle.bind(null, this.props.cardId, task.id, taskIndex)
        } />
        {task.name}{' '}
        <a href="#" className={styles.checklist__task_remove} onClick={
          this.props.taskCallbacks.delete.bind(null, this.props.cardId, task.id, taskIndex)
        } />
      </li>
    ));

    return (
      <div className={styles.checklist}>
        <ul>{tasks}</ul>
        <input type="text"
               className={styles.checklist__add_task}
               placeholder="Type then hi Enter to add a task"
               onKeyPress={this.checkInputKeyPress.bind(this)} />
      </div>
    )
  }
}

CheckList.propTypes = {
  cardId: PropTypes.number,
  task: PropTypes.arrayOf(PropTypes.object),
  taskCallbacks: PropTypes.object
};

export default CheckList;
