import React from 'react';

// This renders the json fields using the rules from the form definition.
export const OpenShiftObjectTemplate = function({
  TitleField,
  uiSchema,
  schema,
  properties,
  idSchema,
  title,
  description
}) {
  const { form } = uiSchema;

  return (
    <div>
      <TitleField title={title} />
      <div className="row">{form.map(key => getOpenShiftField(key, properties, idSchema, schema))}</div>
      {description}
    </div>
  );
};

function getOpenShiftField(field, properties, idSchema, schema) {
  if (!field.items) {
    const property = properties.find(prop => prop.name === field);
    const id = idSchema[field].$id;

    if (field === 'CLIENT_ID') {
      return (
        <div key={property.content.key}>
          <label className="control-label" htmlFor={id}>
            {schema.properties[field].title}
          </label>
          <input
            className="form-control"
            type="text"
            id={id}
            readOnly
            onBlur={event => property.content.props.onChange(event.target.value)}
            defaultValue={schema.properties[field].default}
          />
        </div>
      );
    } else if (field === 'CLIENT_TYPE') {
      const enumArray = schema.properties[field].enum;

      return (
        <div key={property.content.key}>
          <label className="control-label" htmlFor={id}>
            {schema.properties[field].title}
          </label>
          <select
            className="form-control"
            multiple={false}
            id={id}
            onChange={event => {
              property.content.props.onChange(event.target.value);
            }}
          >
            {enumArray.map((value, i) => (
              <option key={i} value={value}>
                {value.charAt(0).toUpperCase() + value.slice(1)}
              </option>
            ))}
          </select>
        </div>
      );
    }
    return <div key={property.content.key}>{property.content}</div>;
  }
  return getFieldSet(field, properties, idSchema, schema);
}

function getFieldSet(field, properties, idSchema, schema) {
  const { title, items } = field;

  const fieldSetItems = items.map(item => {
    if (typeof item === 'string') {
      return properties.find(prop => prop.name === item).content;
    }
    const property = properties.find(prop => prop.name === item.key);
    const id = idSchema[item.key].$id;

    switch (item.type) {
      case 'textarea':
        return (
          <div key={property.content.key}>
            <label className="control-label" htmlFor={id}>
              {schema.properties[item.key].title}
            </label>
            <textarea
              className="form-control"
              type="text"
              id={id}
              onBlur={event => property.content.props.onChange(event.target.value)}
            />
          </div>
        );
      case 'password':
        return (
          <div>
            <div key={property.content.key}>
              <label className="control-label" htmlFor={id}>
                {schema.properties[item.key].title}
              </label>
              <input
                className="form-control"
                type="password"
                id={id}
                onBlur={event => property.content.props.onChange(event.target.value)}
              />
            </div>
            <div key={`${property.content.key}2`}>
              <label className="control-label" htmlFor={`${id}2`}>
                {'Confirm Password'}
              </label>
              <input className="form-control" type="password" id={`${id}2`} />
            </div>
          </div>
        );
      default:
        return property.content;
    }
  });

  return (
    <fieldset>
      <h2>{title}</h2>
      {fieldSetItems}
    </fieldset>
  );
}
