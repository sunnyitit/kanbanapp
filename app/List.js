import React, { Component, PropTypes } from 'react';
import Card from './Card';
import styles from './style.css';

class List extends Component {
  render() {
    var cards = this.props.cards.map((card) => {
      return <Card key={card.id} taskCallbacks={this.props.taskCallbacks}
                   id={card.id}
                   title={card.title}
                   description={card.description}
                   color={card.color}
                   tasks={card.tasks} />
    });

    return (
      <div className={styles.list}>
        <h1>{this.props.title}</h1>
        {cards}
      </div>
    )
  }
}

List.propTypes = {
  title: PropTypes.string.isRequired,
  cards: PropTypes.arrayOf(PropTypes.object),
  taskCallbacks: PropTypes.object
};

export default List;
