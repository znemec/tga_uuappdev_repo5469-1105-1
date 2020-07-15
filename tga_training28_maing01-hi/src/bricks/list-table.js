//@@viewOn:imports
import React from "react";
import PropTypes from "prop-types";
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import "uu_plus4u5g01-app";

import Config from "./config/config.js";
import Lsi from "./list-table-lsi.js";

import List from "./list";
import "./list-table.less";
//@@viewOff:imports

export const ListTable = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.ColorSchemaMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "ListTable",
    classNames: {
      main: Config.CSS + "list-table",
      createList: Config.CSS + "create-list"
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
    onSelect: PropTypes.func,
    data: PropTypes.array,
    activeList: PropTypes.string
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      data: []
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private

  _onClick(data) {
    this.props.onSelect(data);
  },

  _handleConfirm() {
    if (!this._listTextName.getValue()) {
      this._alertBus.addAlert({ content: this.getLsiComponent("emptyListName") });
      return;
    }
    this.props.handleCreate({ name: this._listTextName.getValue() });
    this._confirm.close();
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <UU5.Bricks.Div {...this.getMainPropsToPass()}>
        <UU5.Bricks.Modal
          ref_={confirm => (this._confirm = confirm)}
          header={this.getLsiComponent("addNewList")}
          size={"l"}
        >
          <UU5.Forms.Text ref_={textName => (this._listTextName = textName)} />
          <UU5.Bricks.Button
            onClick={() => {
              this._confirm.close();
            }}
          >
            {this.getLsiComponent("cancelButton")}
          </UU5.Bricks.Button>
          <UU5.Bricks.Button
            colorSchema={"green"}
            onClick={() => {
              this._handleConfirm();
            }}
          >
            {this.getLsiComponent("addButton")}
          </UU5.Bricks.Button>
        </UU5.Bricks.Modal>

        {this.props.data.map(list => {
          return (
            <List
              handleReload={this.props.handleReload}
              handleDelete={this.props.handleDelete}
              handleUpdate={this.props.handleUpdate}
              onClick={this._onClick}
              key={UU5.Common.Tools.generateUUID()}
              data={list}
              activeList={this.props.activeList}
            />
          );
        })}
        <UU5.Bricks.Line />
        <UU5.Bricks.Link className={this.getClassName("createList")} onClick={() => this._confirm.open()}>
          <UU5.Bricks.Icon icon="mdi-plus" />
          {this.getLsiComponent("createList")}
        </UU5.Bricks.Link>
        <UU5.Bricks.AlertBus ref_={alertBus => (this._alertBus = alertBus)} />
      </UU5.Bricks.Div>
    );
  }
  //@@viewOff:render
});

export default ListTable;
