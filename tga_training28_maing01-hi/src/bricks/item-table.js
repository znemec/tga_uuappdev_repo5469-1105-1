//@@viewOn:imports
import React from "react";
import PropTypes from "prop-types";
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import "uu_plus4u5g01-app";

import Config from "./config/config.js";
import Lsi from "./item-table-lsi.js";

import Item from "./item";
import "./item-table.less";
//@@viewOff:imports

export const ItemTable = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.ColorSchemaMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "ItemTable",
    classNames: {
      main: Config.CSS + "item-table",
      add: Config.CSS + "item-table-add"
    },
    lsi: Lsi
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    handleCreate: PropTypes.func,
    handleUpdate: PropTypes.func,
    handleDelete: PropTypes.func,
    handleReload: PropTypes.func,
    data: PropTypes.array,
    activeList: PropTypes.string
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      data: [],
      activeList: null
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    return {
      showCompleted: false
    };
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _showCompleted() {
    this.setState(prevState => {
      return { showCompleted: !prevState.showCompleted };
    });
  },
  _addTodo() {
    if (!this.props.activeList) {
      this._alertBus.addAlert({ content: this.getLsiItem(Lsi.noSelectedList) });
      return;
    }
    if (!this._textName.getValue()) {
      this._alertBus.addAlert({ content: this.getLsiItem(Lsi.emptyItemName) });
      return;
    }

    this.props.handleCreate({ text: this._textName.getValue(), list: this.props.activeList });
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <UU5.Bricks.Div {...this.getMainPropsToPass()}>
        <UU5.Forms.TextButton
          className={this.getClassName().add}
          placeholder={this.getLsiItem(Lsi.addTodo)}
          ref_={textName => (this._textName = textName)}
          required
          name={"todoName"}
          buttons={[
            {
              icon: "uu5-ok",
              onClick: this._addTodo,
              colorSchema: "info"
            }
          ]}
        />
        {this.props.data.map(item => {
          if (!item.completed) {
            return (
              <Item
                handleReload={this.props.handleReload}
                handleDelete={this.props.handleDelete}
                handleUpdate={this.props.handleUpdate}
                data={item}
                completed={true}
                key={UU5.Common.Tools.generateUUID()}
              />
            );
          }
        })}
        <UU5.Bricks.Button onClick={this._showCompleted} colorSchema="blue">
          {this.state.showCompleted ? this.getLsiItem(Lsi.hideCompletedItems) : this.getLsiItem(Lsi.showCompletedItems)}
        </UU5.Bricks.Button>
        {this.props.data.map(item => {
          if (item.completed && this.state.showCompleted) {
            return (
              <Item
                handleReload={this.props.handleReload}
                handleDelete={this.props.handleDelete}
                handleUpdate={this.props.handleUpdate}
                data={item}
                completed={false}
                key={UU5.Common.Tools.generateUUID()}
              />
            );
          }
        })}
        <UU5.Bricks.AlertBus colorSchema="danger" ref_={alertBus => (this._alertBus = alertBus)} />
      </UU5.Bricks.Div>
    );
  }
  //@@viewOff:render
});

export default ItemTable;
