//@@viewOn:imports
import React from "react";
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import "uu_plus4u5g01-bricks";

import Calls from "../calls";
import ListTable from "../bricks/list-table";
import ItemTable from "../bricks/item-table";
//@@viewOff:imports

const TodoList = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.RouteMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  //@@viewOff:statics

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    return {
      activeList: undefined
    };
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _onSelect(data) {
    this.setState({ activeList: data }, () => this._itemListDataManager.reload());
  },

  _loadHandler() {
    const dtoIn = {};
    if (this.state.activeList) {
      dtoIn.list = this.state.activeList;
    }
    return Calls.listItem(dtoIn);
  },

  _reloadHandler() {
    const dtoIn = {};
    if (this.state.activeList) {
      dtoIn.list = this.state.activeList;
    }
    return Calls.listItem(dtoIn);
  },

  _deleteHandle(dtoInData) {
    this.setState({ activeList: undefined }, () => this._itemListDataManager.reload());

    return Calls.deleteList(dtoInData);
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <UU5.Bricks.Div {...this.getMainPropsToPass()}>
        <UU5.Common.ListDataManager
          onLoad={Calls.listList}
          onCreate={Calls.createList}
          onUpdate={Calls.updateList}
          onDelete={this._deleteHandle}
          onReload={Calls.listList}
          ref_={listDataManager => (this._itemListDataManager = listDataManager)}
        >
          {({ errorState, errorData, data, handleReload, handleCreate, handleUpdate, handleDelete }) => {
            if (errorState) {
              return <UU5.Common.Error errorData={errorData} colorSchema="red-rich" />;
            } else if (data) {
              return (
                <ListTable
                  handleCreate={handleCreate}
                  handleUpdate={handleUpdate}
                  handleDelete={handleDelete}
                  handleReload={handleReload}
                  onSelect={this._onSelect}
                  data={data}
                  activeList={this.state.activeList}
                />
              );
            } else {
              return <UU5.Bricks.Loading />;
            }
          }}
        </UU5.Common.ListDataManager>
        <UU5.Common.ListDataManager
          onLoad={this._loadHandler}
          onCreate={Calls.createItem}
          onUpdate={Calls.updateItem}
          onDelete={Calls.deleteItem}
          onReload={this._reloadHandler}
          ref_={listDataManager => (this._itemListDataManager = listDataManager)}
        >
          {({ errorState, errorData, data, handleReload, handleCreate, handleUpdate, handleDelete }) => {
            if (errorState) {
              return <UU5.Common.Error errorData={errorData} colorSchema="red-rich" />;
            } else if (data) {
              return (
                <ItemTable
                  handleCreate={handleCreate}
                  handleUpdate={handleUpdate}
                  handleDelete={handleDelete}
                  handleReload={handleReload}
                  data={data}
                  activeList={this.state.activeList}
                />
              );
            } else {
              return <UU5.Bricks.Loading />;
            }
          }}
        </UU5.Common.ListDataManager>
      </UU5.Bricks.Div>
    );
  }
  //@@viewOff:render
});

export default TodoList;
