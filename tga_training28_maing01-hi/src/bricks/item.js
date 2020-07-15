//@@viewOn:imports
import React from "react";
import PropTypes from "prop-types";
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import "uu_plus4u5g01-app";

import Config from "./config/config.js";
import Lsi from "./item-lsi.js";

import "./item.less";
import Calls from "../calls";
//@@viewOff:imports

export const Item = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.ColorSchemaMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "Item",
    classNames: {
      main: Config.CSS + "item",
      checkBox: Config.CSS + "item-checkbox",
      button: Config.CSS + "list-button"
    },
    lsi: Lsi
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    handleUpdate: PropTypes.func,
    handleDelete: PropTypes.func,
    handleReload: PropTypes.func,
    data: PropTypes.object,
    completed: PropTypes.bool
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      data: null
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    return {
      edit: false,
      completed: false,
      text: ""
    };
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  componentWillMount() {
    this.setState({ text: this.props.data.text, completed: this.props.data.completed });
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _checkboxHandle(value) {
    this.setState({ text: this.props.data.text, completed: value.value });
    Calls.completeItem(this.props.data.id, { completed: value.value }, false);
    this.props.handleReload();
  },

  _setEditable() {
    this.setState({ edit: true });
  },

  _setEndEdit() {
    this.setState({ edit: false, text: this._textText.getValue() });
    this.props.handleUpdate(this.props.data.id, { text: this._textText.getValue() }, false);
  },

  _handleConfirm() {
    this.props.handleDelete({ id: this.props.data.id }, false);
    this.props.handleReload();
  },

  _getEditableItem() {
    return (
      <UU5.Bricks.Div>
        <UU5.Bricks.ConfirmModal
          ref_={confirm => (this._confirm = confirm)}
          onConfirm={this._handleConfirm}
          header={this.getLsiComponent("header")}
          confirmButtonProps={{ content: this.getLsiComponent("deleteButton"), colorSchema: "red" }}
          refuseButtonProps={{ content: this.getLsiComponent("cancelButton") }}
          size={"l"}
        />
        <UU5.Forms.Text ref_={textName => (this._textText = textName)} value={this.state.text} inputWidth="100px" />
        <UU5.Bricks.Button onClick={this._setEndEdit} className={this.getClassName().button}>
          <UU5.Bricks.Icon icon="mdi-check" />
        </UU5.Bricks.Button>
        <UU5.Bricks.Button onClick={() => this._confirm.open()} className={this.getClassName().button}>
          <UU5.Bricks.Icon icon="mdi-delete" />
        </UU5.Bricks.Button>
      </UU5.Bricks.Div>
    );
  },

  _getShowItem: function() {
    const text = this.state.completed ? <UU5.Bricks.S>{this.state.text}</UU5.Bricks.S> : this.state.text;

    return (
      <UU5.Bricks.Div>
        <UU5.Forms.Checkbox
          className={this.getClassName().checkBox}
          value={this.state.completed}
          onChange={this._checkboxHandle}
        />
        {text}
        <UU5.Bricks.Button onClick={this._setEditable} bgStyle="transparent" className={this.getClassName().button}>
          <UU5.Bricks.Icon icon="mdi-pencil" />
        </UU5.Bricks.Button>
      </UU5.Bricks.Div>
    );
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    let colorSchema = this.state.edit ? "red" : "grey";

    return (
      <UU5.Bricks.Div {...this.getMainPropsToPass()}>
        <UU5.Bricks.Box elevationHover="3" colorSchema={colorSchema}>
          {this.state.edit ? this._getEditableItem() : this._getShowItem()}
        </UU5.Bricks.Box>
      </UU5.Bricks.Div>
    );
  }
  //@@viewOff:render
});

export default Item;
