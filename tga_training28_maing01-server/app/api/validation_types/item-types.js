/* eslint-disable */

const itemCreateDtoInType = shape({
  list: id().isRequired(),
  text: string(1,1000).isRequired()
});

const itemGetDtoInType = shape({
  id: id().isRequired()
});

const itemUpdateDtoInType = shape({
  item: id().isRequired(),
  list: id(),
  text: string(1,1000)
});

const itemCompleteDtoInType = shape({
  item: id().isRequired(),
  completed: boolean()
});

const itemDeleteDtoInType = shape({
  id: id().isRequired()
});

const itemListDtoInType = shape({
  list: id(),
  completed: boolean(),
  pageInfo: shape({
    pageIndex: integer(),
    pageSize: integer()
  })
});
