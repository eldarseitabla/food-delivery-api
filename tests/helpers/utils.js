const filter = JSON.stringify({
  offset: 0,
  limit: 10,
  order_by: {
    sort_direction: 'ASC',
    field: 'created_at',
  },
});

module.exports = { filter };
