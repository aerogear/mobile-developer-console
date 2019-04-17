[![build status](https://secure.travis-ci.org/reactabular/table-resolver.svg)](http://travis-ci.org/reactabular/table-resolver) [![bitHound Score](https://www.bithound.io/github/reactabular/table-resolver/badges/score.svg)](https://www.bithound.io/github/reactabular/table-resolver) [![codecov](https://codecov.io/gh/reactabular/table-resolver/branch/master/graph/badge.svg)](https://codecov.io/gh/reactabular/table-resolver)

# table-resolver - Table resolution utilities

Sometimes your rows might come in a nested format or it might have a representation that maps to the underlying value. A name split to first and last parts is an example of the former. Country code to country mapping is an example of the latter.

```javascript
import * as resolve from 'table-resolver';

// Or you can cherry-pick
import { nested } from 'table-resolver';
import { nested as resolveNested } from 'table-resolver';
```

## API

The API consists of two parts: **row resolvers** and **column resolvers**. If you have complex data, use the former. Latter come in handy if you have a nested column definition that needs to be flattened so that it works with a component like Reactabular.

## Row Resolvers

`table-resolver` uses an iterator that accepts rows and then transforms it using a specific resolver method (or several, if they have been composed into one).

### `resolve.resolve`

**`({ columns: <columns>, method: <resolver function>, indexKey = '_index' }) => <rows> => <rows>`**

The `resolve` iterator is the heart of this package. It accepts columns and a method. When applied with rows, it will return resolved rows. The method is a function with signature like: `({ column }) => (rowData) => <resolved row>`. In most cases, the `nested` and `byFunction` methods provided in this package (or a composition of them) will be all you need.

The `resolve` iterator automatically injects into every resolved row object a field named `_index` containing the row's index. If `method` is not provided, `_index` is injected to the data automatically.

If your own resolver (e.g. `byFunction`) happens to also output a field named `_index`, it will overwrite the default one. In that case, if you still need the row index, you may wish to pass a different `indexKey` when calling `resolve`.

### Method `resolve.nested`

**`({ column }) => (rowData) => <resolved row>`**

The `nested` resolver digs rows from a `property: 'name.first'` kind of definition and maps the received value to property name. It replaces the original value with the resolved one. *Note*: instead of defining a path string `property: 'name.first'`, you may provide a custom getter function `property: data => (data.name || {}).first` directly. This may be slightly faster but needs to be done carefully to prevent TypeErrors due to missing values.

### Method creator `resolve.byFunction`

**`(path: <string>) => ({ column }) => (rowData) => <resolved row>`**

The `byFunction` resolver accepts a path from where to look for a resolving function. It could be `column.cell.resolve` for example and you can use a nested definition for getting it from your column definition.

Instead of replacing the original value, `byFunction` generates `_<property>` kind of field to the resulting rows. This sort of implicit rule is useful for other functionality as it can rely on the same convention.

## Column Resolvers

### `resolve.columnChildren`

**`({ columns, childrenField = 'children' }) => <resolved columns>`**

Assuming your column definition is nested, this function resolves it to a flat format.

### `resolve.headerRows`

**`({ columns, childrenField = 'children' }) => <resolved columns>`**

If your column definition is nested, you have to resolve it to header rows. `resolve.headerRows` has been designed exactly for this purpose.

## Combining Resolver Methods

You can easily combine resolver methods like this:

```javascript
const resolver = resolve.resolve({
  columns,
  method: ({ rowData, column }) => resolve.byFunction('cell.resolve')({
    rowData: resolve.nested({ rowData, column }),
    column
  })
});
```

or if you are already using Redux:

```javascript
import { compose } from 'redux';

...

const resolver = resolve.resolve({
  columns,
  method: (extra) => compose(
    resolve.byFunction('cell.resolve')(extra),
    resolve.nested(extra)
  )
});
```

## Resolution Example

The following example shows how you to resolve nested values.

**Example:**

```jsx
/*
import * as resolve from 'table-resolver';
*/

const columns = [
  {
    property: 'color',
    header: {
      label: 'Color'
    }
  },
  {
    header: {
      label: 'Name'
    },
    children: [
      {
        property: 'name.first',
        header: {
          label: 'First Name'
        }
      },
      {
        property: 'name.last',
        header: {
          label: 'Last Name'
        }
      }
    ]
  },
  {
    header: {
      label: 'About'
    },
    children: [
      {
        property: 'company',
        header: {
          label: 'Company'
        }
      },
      {
        property: 'sentence',
        header: {
          label: 'Sentence'
        }
      }
    ]
  }
];

const rows = [
  {
    id: 1,
    color: 'red',
    name: {
      first: 'John',
      last: 'Johnson'
    },
    company: 'John Inc.',
    sentence: 'consequatur nihil minima corporis omnis nihil rem'
  },
  {
    id: 2,
    color: 'blue',
    name: {
      first: 'Mike',
      last: 'Mikeson'
    },
    company: 'Mike Inc.',
    sentence: 'a sequi doloremque sed id quo voluptatem voluptatem ut voluptatibus'
  }
];

<ul>{
  resolve.resolve(
    {
      columns: resolve.columnChildren({ columns }),
      method: resolve.nested
    }
  )(rows).map((d, i) =>
    <li key={`value-${i}`}>{JSON.stringify(d, null, 2)}</li>
  )
}</ul>
```

## License

MIT. See LICENSE for details.
