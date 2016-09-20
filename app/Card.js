import React, { Component, PropTypes } from 'react';
import CheckList from './CheckList';
import styles from './style.css';
import marked from 'marked';


let titlePropType = (props, propName, componentName) => {
  if(props[propName]) {
    let value = props[propName];
    if (typeof value !== 'string' || value.length > 80) {
      return new Error(
        '${propName} in ${componentName} is longer than 80 characters'
      );
    }
  }
}
class Card extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      showDetails: false
    };
  }

  toggleDetails() {
    this.setState({showDetails: !this.state.showDetails});
  }

  render() {
    let cardDetails;
    if (this.state.showDetails) {
      cardDetails = (
        <div className={styles.card__details}>
          <span dangerouslySetInnerHTML={{__html:marked(this.props.description)}} />
          <CheckList cardId={this.props.id} taskCallbacks={this.props.taskCallbacks}
                     tasks={this.props.tasks} />
        </div>
      )
    }

    let sideColor = {
      position: 'absolute',
      zIndex: -1,
      top: 0,
      bottom: 0,
      left: 0,
      width: 7,
      backgroundColor: this.props.color
    }
    return (
      <div className={styles.card}>
        <div style={sideColor}/>
        <div className={
          this.state.showDetails ? (styles.card__title + " " + styles.card__title__is_open) : styles.card__title
        } onClick={this.toggleDetails.bind(this)}
        >{this.props.title}</div>
        {cardDetails}
      </div>
    );
  }
}

Card.propTypes = {
  id: PropTypes.number,
  title: titlePropType,
  description: PropTypes.string,
  color: PropTypes.string,
  tasks: PropTypes.arrayOf(PropTypes.object)
};

export default Card;
