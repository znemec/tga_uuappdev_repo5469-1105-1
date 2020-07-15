//@@viewOn:imports
import React from "react";
import PropTypes from "prop-types";
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import "uu_plus4u5g01-app";

import Config from "./config/config.js";
import Lsi from "./list-lsi.js";

import "./list.less";
//@@viewOff:imports

export const List = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.ColorSchemaMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "List",
    classNames: {
      main: Config.CSS + "list",
      button: Config.CSS + "list-button",
      selected: Config.CSS + "selected"
    },
    lsi: Lsi
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    handleDelete: PropTypes.func,
    handleUpdate: PropTypes.func,
    handleReload: PropTypes.func,
    onClick: PropTypes.func,
    data: PropTypes.object,
    activeList: PropTypes.string
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  componentWillMount() {
    this.setState({ name: this.props.data.name });
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _setEditable() {
    this.setState({ edit: true });
  },
  _setActive() {
    this.props.onClick(this.props.data.id);
  },

  _setEndEdit() {
    this.setState({ edit: false, name: this._textName.getValue() }, () => {
      this.props.handleUpdate(this.props.data.id, { name: this.state.name });
    });
  },

  _getEditableItem() {
    return (
      <React.Fragment>
        <UU5.Bricks.ConfirmModal
          ref_={confirm => (this._confirm = confirm)}
          onConfirm={() => {
            this.props.handleDelete({ id: this.props.data.id });
            this.props.handleReload();
          }}
          header={this.getLsiComponent("header")}
          content={<UU5.Bricks.P>{this.getLsiComponent("content")}</UU5.Bricks.P>}
          confirmButtonProps={{ content: this.getLsiComponent("deleteButton"), colorSchema: "red" }}
          refuseButtonProps={{ content: this.getLsiComponent("cancelButton") }}
          size={"l"}
        />
        <UU5.Forms.Text ref_={textName => (this._textName = textName)} inputWidth="50px" value={this.state.name} />
        <UU5.Bricks.Button onClick={this._setEndEdit} className={this.getClassName().button}>
          <UU5.Bricks.Icon icon="mdi-check" />
        </UU5.Bricks.Button>
        <UU5.Bricks.Button onClick={() => this._confirm.open()} className={this.getClassName().button}>
          <UU5.Bricks.Icon icon="mdi-delete" />
        </UU5.Bricks.Button>
      </React.Fragment>
    );
  },

  _getShowItem: function() {
    return (
      <React.Fragment>
        <UU5.Bricks.Button bgStyle="transparent" onClick={this._setActive}>
          {this.state.name}
        </UU5.Bricks.Button>
        <UU5.Bricks.Button
          className={this.getClassName().button}
          bgStyle="transparent"
          colorSchema="white"
          onClick={this._setEditable}
        >
          <UU5.Bricks.Icon icon="mdi-pencil" />
        </UU5.Bricks.Button>
      </React.Fragment>
    );
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    let colorSchema = this.state.edit ? "red" : "default";
    if (this.props.data.id === this.props.activeList && !this.state.edit) {
      colorSchema = "blue";
    }
    return (
      <UU5.Bricks.Div {...this.getMainPropsToPass()}>
        <UU5.Bricks.Box colorSchema={colorSchema} onClick={this._setEditable}>
          {this.state.edit ? this._getEditableItem() : this._getShowItem()}
        </UU5.Bricks.Box>
      </UU5.Bricks.Div>
    );
  }
  //@@viewOff:render
});

export default List;
