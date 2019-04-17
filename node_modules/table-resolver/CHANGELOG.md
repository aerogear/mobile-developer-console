## table-resolver

3.3.0 / 2018-04-03
==================

  * Performance - Improved performance (-36%) on large datasets. #6

3.2.0 / 2017-08-17
==================

  * Feature - Remove `resolve.nested - Failed to find "${property}" property from` warning. #4

3.1.1 / 2017-06-20
==================

  * Fix - `resolve.headerRows` calculates `colSpan`s correctly now. #3

3.1.0 / 2017-02-11
==================

  * Feature - Make `resolve.resolve` `method` optional. If it's not provided, it will inject only `_index` to the data.

3.0.0 / 2017-02-11
==================

  * Breaking - Drop `resolve.index`. The functionality has been integrated to `resolve.resolve`. You can customize it through `indexKey` option there. #2
  * Feature - `resolve.nested` accepts custom getters through properties now. Example: `property: data => (data.name || {}).first`. #2

2.0.0 / 2016-11-27
==================

  * Breaking - Drop `resolve.rowKey`. That was moved to `reactabular-table` since it's too specific to fit here.

1.0.0 / 2016-11-26
==================

  * Initial re-release under a different name.
  * Feature - Add `resolve.columnChildren({ columns, childrenField = 'children' }) => <resolved columns>`. Earlier this was in `reactabular-utils` but it fits this namespace better.
  * Breaking - Allow resolvers to be composed more easily. Now the API follows the pattern `(extra) => (rowData) => <resolved row>. This means the functions fit within `compose` like this:

```javascript
const resolver = resolve.resolve({
  columns,
  method: (extra) => compose(
    resolve.byFunction('cell.resolve')(extra),
    resolve.nested(extra)
  )
});
```

---

## reactabular-resolve

2.0.2 / 2016-08-17
==================

  * Bug fix - Make sure `resolve` does not crash if `rows` aren't provided. It will return an empty array in that case.

2.0.0 / 2016-08-16
==================

  * Breaking - Rework `resolve` interface to be object based and pass row index through it.
  * Feature - Implement `resolve.index`. This attached the row indices to `_index`. That can be handy data to have for optimization.

1.0.1 / 2016-07-26
==================

  * Feature - Make sure `undefined` keys aren't included in the resolved result.

1.0.0 / 2016-07-25
==================

  * Initial release.
