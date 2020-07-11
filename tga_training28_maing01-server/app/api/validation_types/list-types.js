/* eslint-disable */

const listCreateDtoInType = shape({
  name: string(1,30).isRequired()
});

const listGetDtoInType = shape({
  id: id().isRequired()
});

const listUpdateDtoInType = shape({
  list: id().isRequired(),
  name: string(1,30)
});

const listDeleteDtoInType = shape({
  id: id().isRequired(),
  forceDelete: boolean()
});

const listListDtoInType = shape({
  pageInfo: shape({
    pageIndex: integer(),
    pageSize: integer()
  })
});
