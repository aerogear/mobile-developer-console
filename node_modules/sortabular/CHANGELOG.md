1.6.0 / 2018-05-22
==================

  * Feature - Throw error if sort is not passed to sorter. #13

1.5.1 / 2017-12-22
==================

  * Fix - Do not crash if column to reset isn't found

1.5.0 / 2017-10-02
==================

  * Chore - Support React 16. #11

1.4.1 / 2017-06-10
==================

  * Docs - Fix a typo at readme.

1.4.0 / 2017-05-03
==================

  * Refactor - React 15.5 upgrades, fixed deprecations, Jest upgrade. #7

1.3.0 / 2017-03-16
==================

  * Chore - Bump peer dependency to require lodash 4. Since lodash 3 won't work this is the only right solution.

1.2.0 / 2017-01-17
==================

  * Feature - Allow `sort.header` `sortable` parameter to be skipped. This is useful if you want to use the component only for visualization.
  * Feature - Separate `sort.order` component. This is useful if you need to display only the sorting status (i.e., direction) to the user.

1.1.1 / 2017-01-12
==================

  * Docs - Fix a readme example. #3

1.1.0 / 2016-12-26
==================

  * Feature - Add support for sorting numbers. The interface is exactly the same as this is an internal change. #2

1.0.0 / 2016-11-25
==================

  * Initial re-release under a different name.

---

## reactabular-sort

6.0.0 / 2016-10-14
==================

  * Breaking - Drop `styles` prop. Use `props` instead.

5.3.0 / 2016-10-05
==================

  * Feature - Expose `props` prop for customizing `sort.header` `props` of the component. This will replace `styles` eventually.

4.1.0 / 2016-09-20
==================

  * Feature - Add `sort.byColumnsPrioritizeLastSorted`. #199

2.0.5 / 2016-08-26
==================

  * Bug fix - Make sure `sort.byColumns` does not mutate passed `sortingColumns`. Now it performs a deep clone using lodash.

2.0.0 / 2016-08-16
==================

  * Breaking - Return sorting columns if no selected column is passed.
  * Breaking - Extract header styling to a separate file (`style.css` at package root) and allow `style` prop to be passed.
  * Breaking - Port sorting to a property based scheme over index one.
  * Feature - Mark React as a peer dependency.
  * Feature - Allow sorting `fieldName` to be customized for `sort`, `header`, and `reset`. This is useful if you want to sort per `property` for example.
  * Feature - Allow `sorter` `getColumns` mechanism to be customized. This is needed to make `fieldName` useful.

1.1.4 / 2016-08-04
==================

  * Bug fix - Do not crash if column `cell` definition is missing. #178

1.0.11 / 2016-07-29
===================

  * Bug fix - `sort.reset` accepts object properly now. Earlier it bailed out too early.

1.0.10 / 2016-07-29
===================

  * Feature - `sort.sort` accepts `event` parameter now. It defaults to `onClick`.
  * Feature - `sort.reset` is a new transform that can be used to remove the given column from the sorting rules.
  * Feature - `sort.header` is a new formatter that can be used to apply sorting. This is handy if you use `sort.reset`.

1.0.0 / 2016-07-25
==================

  * Initial release.
