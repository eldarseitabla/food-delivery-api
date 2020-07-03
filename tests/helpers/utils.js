const filter = JSON.stringify({
  where: {
    field: 'id',
    operator: '<>',
    value: '0',
  },
  order_by: {
    field: 'id',
    sort_direction: 'ASC',
  },
  offset: 0,
  limit: 100,
});

module.exports = { filter };
